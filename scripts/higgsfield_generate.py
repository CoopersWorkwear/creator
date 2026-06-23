#!/usr/bin/env python3
"""
Higgsfield AI asset pipeline (PDF Steps 1-2), automated via the REST API.

This generates the three assets from the brief — base product image, exploded
image, hero video — then downloads hero.mp4 and extracts JPEG frames into
public/frames/ so the Next.js site picks them up.

────────────────────────────────────────────────────────────────────────────
REQUIREMENTS (this cannot run inside the default Claude Code web sandbox — its
egress policy blocks higgsfield.ai. Run it where Higgsfield egress is allowed,
e.g. an environment created with a permissive network policy, or locally.)

  1. An environment that can reach the Higgsfield API.
  2. export HIGGSFIELD_API_KEY="sk-..."          # from your Higgsfield account
  3. pip install requests imageio imageio-ffmpeg

Then:  python3 scripts/higgsfield_generate.py
Finally update FRAME_COUNT in app/components/ScrollHero.tsx to the printed count.
────────────────────────────────────────────────────────────────────────────

NOTE ON ENDPOINTS: Higgsfield exposes an official SDK and a REST API behind an
authenticated dashboard. The exact paths/field names can vary by API version,
so the constants in the CONFIG block below are the single place to adjust if
your dashboard documents them differently. The create → poll → download shape
is standard and is what the SDK uses under the hood.
"""
import os
import sys
import time
import pathlib
import urllib.request

import requests

# ── CONFIG — confirm against your Higgsfield API dashboard ──────────────────
API_BASE = os.environ.get("HIGGSFIELD_API_BASE", "https://platform.higgsfield.ai/v1")
API_KEY = os.environ.get("HIGGSFIELD_API_KEY")
IMAGE_ENDPOINT = f"{API_BASE}/image-generations"   # text/-image-to-image (Soul)
VIDEO_ENDPOINT = f"{API_BASE}/image2video"          # image-to-video
POLL_INTERVAL = 5      # seconds between status checks
POLL_TIMEOUT = 600     # give up after 10 minutes per asset

ROOT = pathlib.Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
FRAMES_DIR = PUBLIC / "frames"
HERO_MP4 = PUBLIC / "hero.mp4"

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


def _headers():
    return {
        "Authorization": f"Bearer {API_KEY}",
        "Content-Type": "application/json",
    }


def _create_and_wait(endpoint: str, payload: dict, kind: str) -> str:
    """POST a generation request, poll until complete, return the asset URL."""
    print(f"→ Requesting {kind} …")
    resp = requests.post(endpoint, headers=_headers(), json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    # Common response shapes: {id|generation_id|request_id, status_url}
    job_id = data.get("id") or data.get("generation_id") or data.get("request_id")
    status_url = data.get("status_url") or (f"{endpoint}/{job_id}" if job_id else None)
    if not status_url:
        raise RuntimeError(f"No status_url/id in response: {data}")

    deadline = time.time() + POLL_TIMEOUT
    while time.time() < deadline:
        s = requests.get(status_url, headers=_headers(), timeout=30).json()
        status = (s.get("status") or "").lower()
        if status in ("completed", "succeeded", "success", "done"):
            url = (
                s.get("result_url")
                or s.get("output_url")
                or s.get("url")
                or (s.get("result") or {}).get("url")
            )
            if not url:
                raise RuntimeError(f"Completed but no asset URL: {s}")
            print(f"  ✓ {kind} ready")
            return url
        if status in ("failed", "error", "cancelled"):
            raise RuntimeError(f"{kind} failed: {s}")
        time.sleep(POLL_INTERVAL)
    raise TimeoutError(f"{kind} timed out after {POLL_TIMEOUT}s")


def _download(url: str, dest: pathlib.Path):
    print(f"→ Downloading → {dest.relative_to(ROOT)}")
    dest.parent.mkdir(parents=True, exist_ok=True)
    with urllib.request.urlopen(url) as r, open(dest, "wb") as f:
        f.write(r.read())


def extract_frames(video_path: pathlib.Path) -> int:
    """Extract frames at 24fps, 1920px wide, into public/frames/ (4-digit)."""
    import imageio.v3 as iio
    from PIL import Image

    for old in FRAMES_DIR.glob("*.jpg"):
        old.unlink()
    FRAMES_DIR.mkdir(parents=True, exist_ok=True)

    count = 0
    for frame in iio.imiter(video_path, plugin="pyav"):
        img = Image.fromarray(frame)
        w, h = img.size
        img = img.resize((1920, round(h * 1920 / w)), Image.LANCZOS)
        count += 1
        img.save(FRAMES_DIR / f"frame_{count:04d}.jpg", "JPEG", quality=88, optimize=True)
    return count


def main():
    if not API_KEY:
        sys.exit("HIGGSFIELD_API_KEY is not set. Export it and re-run.")

    # Asset 1 — base product image
    base_url = _create_and_wait(
        IMAGE_ENDPOINT,
        {"prompt": BASE_IMAGE_PROMPT, "aspect_ratio": "1:1", "model": "soul"},
        "base image",
    )
    _download(base_url, PUBLIC / "asset_base.jpg")

    # Asset 2 — exploded image (references Asset 1)
    exploded_url = _create_and_wait(
        IMAGE_ENDPOINT,
        {
            "prompt": EXPLODED_IMAGE_PROMPT,
            "reference_image_url": base_url,
            "aspect_ratio": "1:1",
            "model": "soul",
        },
        "exploded image",
    )
    _download(exploded_url, PUBLIC / "asset_exploded.jpg")

    # Asset 3 — hero video (references Assets 1 & 2)
    video_url = _create_and_wait(
        VIDEO_ENDPOINT,
        {
            "prompt": HERO_VIDEO_PROMPT,
            "input_image": base_url,
            "reference_image_url": exploded_url,
            "model": "turbo",
            "duration": 10,
            "resolution": "1080p",
            "aspect_ratio": "16:9",
        },
        "hero video",
    )
    _download(video_url, HERO_MP4)

    n = extract_frames(HERO_MP4)
    print(f"\n✅ Done. Extracted {n} frames into public/frames/.")
    print(f"   Set FRAME_COUNT = {n} in app/components/ScrollHero.tsx, then commit.")


if __name__ == "__main__":
    main()
