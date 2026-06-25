#!/usr/bin/env python3
"""
Higgsfield AI asset pipeline (PDF Steps 1-2), automated via the REST API.

Generates the three assets from the brief — base product image, exploded image,
hero video — then downloads hero.mp4 and extracts JPEG frames into
public/frames/ so the Next.js site picks them up.

────────────────────────────────────────────────────────────────────────────
This targets Higgsfield's **v2 REST API** (platform.higgsfield.ai), whose wire
contract is mirrored from the official SDK (@higgsfield/client). Concretely:

  • Auth   : a single header  `Authorization: Key <KEY_ID>:<KEY_SECRET>`
  • Create : POST /v1/text2image/soul   and   POST /v1/image2video/dop
             with the input fields sent as a FLAT JSON body.
  • Poll   : GET /requests/{request_id}/status until status is
             completed | failed | nsfw.
  • Result : completed image → images[0].url ; completed video → video.url
────────────────────────────────────────────────────────────────────────────
NETWORK / EGRESS — this cannot run inside the default Claude Code web sandbox.
Two hosts must be in the environment's network egress allowlist:

  1. platform.higgsfield.ai          — the API itself (create + poll)
  2. the asset CDN host              — whatever host the result URLs use
                                       (printed by this script). Higgsfield
                                       serves finished media from a separate
                                       storage/CDN host; downloading the assets
                                       needs that host allowlisted too.

Run it where both are reachable (an environment created with a permissive
network policy, or locally).

CREDENTIALS — set ONE of:
  export HIGGSFIELD_API_KEY="KEY_ID:KEY_SECRET"      # preferred (single value)
  export HIGGSFIELD_API_KEY="KEY_ID"; export HIGGSFIELD_API_SECRET="KEY_SECRET"
  export HF_CREDENTIALS="KEY_ID:KEY_SECRET"          # SDK-style fallback

DEPENDENCIES:
  pip install requests pillow imageio imageio-ffmpeg
  (frame extraction also works with a system `ffmpeg` if one is installed)

USAGE:
  python3 scripts/higgsfield_generate.py            # real run
  python3 scripts/higgsfield_generate.py --dry-run  # print requests, no network
Finally update FRAME_COUNT in app/components/ScrollHero.tsx to the printed count.
"""
import argparse
import json
import os
import pathlib
import sys
import time
from urllib.parse import urlsplit

import requests

# ── CONFIG ──────────────────────────────────────────────────────────────────
API_BASE = os.environ.get("HIGGSFIELD_API_BASE", "https://platform.higgsfield.ai")
IMAGE_ENDPOINT = "/v1/text2image/soul"     # Soul text/image-to-image
VIDEO_ENDPOINT = "/v1/image2video/dop"      # DoP image-to-video

# Generation parameters (see SoulSize / SoulQuality / DoPModel in the SDK).
SOUL_SIZE = "2048x1152"     # 16:9 landscape, matches the canvas hero aspect
SOUL_QUALITY = "1080p"      # "720p" | "1080p"
VIDEO_MODEL = "dop-standard"  # "dop-lite" | "dop-turbo" | "dop-standard"
ENHANCE_PROMPT = False      # keep the brief's prompts verbatim (no stylization)

POLL_INTERVAL = 5           # seconds between status checks
POLL_TIMEOUT = 600          # give up after 10 minutes per asset
FRAME_WIDTH = 1920          # extracted frame width (height keeps aspect)

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FRAMES_DIR = PUBLIC / "frames"
HERO_MP4 = PUBLIC / "hero.mp4"
MANIFEST = PUBLIC / "higgsfield_assets.json"

USER_AGENT = "higgsfield-server-js/2.0"     # the SDK sends this; mirror it

# ── PROMPTS (verbatim from the brief) ───────────────────────────────────────
BASE_IMAGE_PROMPT = (
    "A studio-grade product photograph of a Rolex Day-Date 40 in Everose gold, "
    "shown at a three-quarter angle revealing both the dial and the bracelet. "
    "Pure black background with zero ambient light bleed, no reflections on the "
    "case or crystal, no surface shadows. The watch is fully assembled, bracelet "
    "intact. Shot as if for a high-end print campaign — clinical precision, no "
    "stylization."
)
EXPLODED_IMAGE_PROMPT = (
    "Using the provided reference watch image: deconstruct the watch into a "
    "precise exploded-view diagram. Each component — bezel, crystal, dial, "
    "movement plate, rotor, case, caseback, crown, bracelet links and clasp — "
    "should float apart from its assembled position along its natural mechanical "
    "axis, with uniform spacing between parts. The arrangement should feel "
    "deliberate and symmetrical, like a technical illustration or a luxury "
    "brand's campaign visual. Pure black background. All parts retain their "
    "Everose gold finish and material texture. No labels, no lines, no overlays."
)
HERO_VIDEO_PROMPT = (
    "A Rolex Day-Date 40 in Everose gold with a chocolate sunburst dial floats "
    "in a pure black void, fully assembled, with no environment, no ground plane, "
    "no ambient reflections. The camera begins at a front-right angle and slowly "
    "orbits clockwise in a smooth, uninterrupted arc. As the camera arrives at "
    "the direct front-facing position — approximately halfway through the shot — "
    "the watch begins a seamless mechanical deconstruction. Each component "
    "separates along its natural axis with deliberate, weighted momentum: the "
    "bezel lifts, the crystal rises, the dial peels back, the movement floats up, "
    "the bracelet unfurls and spreads. Parts float outward in perfect radial "
    "symmetry as if gravity has been selectively reversed. The movement is slow, "
    "cinematic, and precise — never chaotic. By the end of the shot, all parts "
    "are suspended in a balanced exploded arrangement, still against the void."
)


# ── Auth ────────────────────────────────────────────────────────────────────
def _credentials() -> str:
    """Return the "KEY_ID:KEY_SECRET" credential string for the Authorization header."""
    cred = (
        os.environ.get("HIGGSFIELD_API_KEY")
        or os.environ.get("HF_CREDENTIALS")
        or os.environ.get("HF_KEY")
    )
    secret = os.environ.get("HIGGSFIELD_API_SECRET") or os.environ.get("HF_API_SECRET")
    if cred and secret and ":" not in cred:
        cred = f"{cred}:{secret}"
    if not cred or ":" not in cred:
        sys.exit(
            "Missing/malformed credentials. Set HIGGSFIELD_API_KEY=\"KEY_ID:KEY_SECRET\" "
            "(or HIGGSFIELD_API_KEY + HIGGSFIELD_API_SECRET). Got "
            f"{'a value without a colon' if cred else 'nothing'}."
        )
    return cred


def _headers(creds: str) -> dict:
    return {
        "Authorization": f"Key {creds}",
        "Content-Type": "application/json",
        "User-Agent": USER_AGENT,
    }


# ── Core request helpers ────────────────────────────────────────────────────
def _status_url(create_response: dict, request_id: str) -> str:
    """Prefer the server-supplied status_url; otherwise build the v2 default."""
    return create_response.get("status_url") or f"{API_BASE}/requests/{request_id}/status"


def _asset_url_from_status(status: dict) -> str | None:
    """Pull the finished media URL from a completed status payload."""
    imgs = status.get("images") or []
    if imgs and isinstance(imgs, list) and imgs[0].get("url"):
        return imgs[0]["url"]
    video = status.get("video") or {}
    if video.get("url"):
        return video["url"]
    return None


def create_and_wait(endpoint: str, body: dict, kind: str, headers: dict, dry_run: bool) -> str:
    """POST a generation request (flat v2 body), poll until complete, return the asset URL."""
    url = f"{API_BASE}{endpoint}"
    if dry_run:
        print(f"\n→ [dry-run] would POST {url}")
        print(f"  headers: {{'Authorization': 'Key ***', 'User-Agent': '{USER_AGENT}'}}")
        print(f"  body: {json.dumps(body, indent=2)}")
        return f"https://<cdn-host>/dry-run/{kind.replace(' ', '_')}.bin"

    print(f"→ Requesting {kind} …")
    resp = requests.post(url, headers=headers, json=body, timeout=60)
    if resp.status_code == 401:
        sys.exit("Authentication failed (401). Check HIGGSFIELD_API_KEY (KEY_ID:KEY_SECRET).")
    if resp.status_code == 403:
        sys.exit("403 from API — insufficient Higgsfield credits, or the host is egress-blocked.")
    resp.raise_for_status()
    data = resp.json()

    request_id = data.get("request_id") or data.get("id")
    if not request_id:
        raise RuntimeError(f"No request_id in create response: {data}")

    # The create call may already be terminal; otherwise poll.
    if _asset_url_from_status(data) and (data.get("status") == "completed"):
        url_out = _asset_url_from_status(data)
    else:
        url_out = _poll(_status_url(data, request_id), kind, headers)

    print(f"  ✓ {kind} ready")
    return url_out


def _poll(status_url: str, kind: str, headers: dict) -> str:
    deadline = time.time() + POLL_TIMEOUT
    while time.time() < deadline:
        r = requests.get(status_url, headers=headers, timeout=30)
        if r.status_code >= 500:
            time.sleep(POLL_INTERVAL)
            continue
        r.raise_for_status()
        s = r.json()
        status = (s.get("status") or "").lower()
        if status == "completed":
            asset = _asset_url_from_status(s)
            if not asset:
                raise RuntimeError(f"{kind} completed but no media URL: {s}")
            return asset
        if status in ("failed", "nsfw", "canceled"):
            raise RuntimeError(f"{kind} ended with status '{status}': {s}")
        time.sleep(POLL_INTERVAL)
    raise TimeoutError(f"{kind} timed out after {POLL_TIMEOUT}s")


def download(url: str, dest: pathlib.Path, dry_run: bool):
    rel = dest.relative_to(ROOT)
    if dry_run:
        print(f"→ [dry-run] would download → {rel}")
        return
    host = urlsplit(url).netloc
    print(f"→ Downloading {host} → {rel}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    try:
        with requests.get(url, stream=True, timeout=120) as r:
            r.raise_for_status()
            with open(dest, "wb") as f:
                for chunk in r.iter_content(chunk_size=1 << 16):
                    f.write(chunk)
    except requests.exceptions.RequestException as exc:
        sys.exit(
            f"Could not download the asset from '{host}'. If this is an egress block, add "
            f"'{host}' to the environment's network allowlist (alongside platform.higgsfield.ai) "
            f"and re-run.\n  URL: {url}\n  error: {exc}"
        )


# ── Frame extraction ────────────────────────────────────────────────────────
def extract_frames(video_path: pathlib.Path) -> int:
    """Extract frames at FRAME_WIDTH px wide into public/frames/ (4-digit JPEGs)."""
    for old in FRAMES_DIR.glob("*.jpg"):
        old.unlink()
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)

    import imageio.v3 as iio
    from PIL import Image

    count = 0
    for frame in iio.imiter(video_path, plugin="pyav"):
        img = Image.fromarray(frame)
        w, h = img.size
        img = img.resize((FRAME_WIDTH, round(h * FRAME_WIDTH / w)), Image.LANCZOS)
        count += 1
        img.save(FRAMES_DIR / f"frame_{count:04d}.jpg", "JPEG", quality=88, optimize=True)
    return count


# ── Pipeline ────────────────────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="Higgsfield watch asset pipeline")
    parser.add_argument(
        "--dry-run", action="store_true",
        help="Print the requests that would be sent (no network, no credits spent).",
    )
    args = parser.parse_args()

    creds = "DRY:RUN" if args.dry_run else _credentials()
    headers = _headers(creds)
    manifest = {}

    # Asset 1 — base product image
    base_url = create_and_wait(
        IMAGE_ENDPOINT,
        {
            "prompt": BASE_IMAGE_PROMPT,
            "width_and_height": SOUL_SIZE,
            "quality": SOUL_QUALITY,
            "batch_size": 1,
            "enhance_prompt": ENHANCE_PROMPT,
        },
        "base image", headers, args.dry_run,
    )
    manifest["base_image"] = base_url
    download(base_url, PUBLIC / "asset_base.jpg", args.dry_run)

    # Asset 2 — exploded image (Soul image-to-image referencing Asset 1)
    exploded_url = create_and_wait(
        IMAGE_ENDPOINT,
        {
            "prompt": EXPLODED_IMAGE_PROMPT,
            "image_reference": {"type": "image_url", "image_url": base_url},
            "width_and_height": SOUL_SIZE,
            "quality": SOUL_QUALITY,
            "batch_size": 1,
            "enhance_prompt": ENHANCE_PROMPT,
        },
        "exploded image", headers, args.dry_run,
    )
    manifest["exploded_image"] = exploded_url
    download(exploded_url, PUBLIC / "asset_exploded.jpg", args.dry_run)

    # Asset 3 — hero video (DoP image-to-video from Asset 1)
    video_url = create_and_wait(
        VIDEO_ENDPOINT,
        {
            "model": VIDEO_MODEL,
            "prompt": HERO_VIDEO_PROMPT,
            "input_images": [{"type": "image_url", "image_url": base_url}],
            "enhance_prompt": ENHANCE_PROMPT,
        },
        "hero video", headers, args.dry_run,
    )
    manifest["hero_video"] = video_url
    download(video_url, HERO_MP4, args.dry_run)

    if args.dry_run:
        print("\n✅ Dry run complete — requests above are well-formed. No network calls made.")
        print("   Open egress to platform.higgsfield.ai (+ the asset CDN host) and re-run "
              "without --dry-run.")
        return

    PUBLIC.mkdir(parents=True, exist_ok=True)
    MANIFEST.write_text(json.dumps(manifest, indent=2))

    n = extract_frames(HERO_MP4)
    print(f"\n✅ Done. Extracted {n} frames into public/frames/.")
    print(f"   Set FRAME_COUNT = {n} in app/components/ScrollHero.tsx, then commit.")
    print(f"   Asset URLs saved to {MANIFEST.relative_to(ROOT)}.")


if __name__ == "__main__":
    main()
