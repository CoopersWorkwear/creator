#!/usr/bin/env bash
#
# Higgsfield CLI helper — generates the three brief assets (base image →
# exploded image → hero video) using the official @higgsfield/cli, then leaves
# you with hero.mp4 to hand off.
#
# ── SETUP ───────────────────────────────────────────────────────────────────
#   npm install -g @higgsfield/cli
#   higgsfield auth login                 # one-time browser login
#   higgsfield model list                 # copy an IMAGE model id  → IMAGE_MODEL
#   higgsfield model list --video         # copy a VIDEO model id  → VIDEO_MODEL
#
# Fill in the two model ids below, then run:   bash scripts/higgsfield_cli.sh
#
# NOTE: this must run where higgsfield.ai is reachable (your own machine, or a
# Claude Code web env created with a network policy that allows higgsfield.ai).
# The default web sandbox blocks it ("denied by policy").
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

# ── FILL THESE IN ────────────────────────────────────────────────────────────
IMAGE_MODEL="${IMAGE_MODEL:-}"     # e.g. from `higgsfield model list`
VIDEO_MODEL="${VIDEO_MODEL:-}"     # e.g. from `higgsfield model list --video`

OUT_DIR="public"
HERO_MP4="${OUT_DIR}/hero.mp4"

# ── PROMPTS (verbatim from the brief) ────────────────────────────────────────
BASE_PROMPT="A studio-grade product photograph of a Rolex Day-Date 40 in Everose gold, shown at a three-quarter angle revealing both the dial and the bracelet. Pure black background with zero ambient light bleed, no reflections on the case or crystal, no surface shadows. The watch is fully assembled, bracelet intact. Shot as if for a high-end print campaign — clinical precision, no stylization."

EXPLODED_PROMPT="Using the provided reference watch image: deconstruct the watch into a precise exploded-view diagram. Each component — bezel, crystal, dial, movement plate, rotor, case, caseback, crown, bracelet links and clasp — should float apart from its assembled position along its natural mechanical axis, with uniform spacing between parts. Deliberate and symmetrical, like a luxury brand's campaign visual. Pure black background. All parts retain their Everose gold finish. No labels, no lines, no overlays."

VIDEO_PROMPT="A Rolex Day-Date 40 in Everose gold with a chocolate sunburst dial floats in a pure black void, fully assembled, no environment, no ground plane, no reflections. The camera begins at a front-right angle and slowly orbits clockwise in a smooth arc. As it reaches the front-facing position — about halfway — the watch begins a seamless mechanical deconstruction: the bezel lifts, the crystal rises, the dial peels back, the movement floats up, the bracelet unfurls and spreads, outward in radial symmetry. Slow, cinematic, precise — never chaotic. Ends with all parts suspended in a balanced exploded arrangement against the black void."

# ── HELPERS ──────────────────────────────────────────────────────────────────
need() { command -v "$1" >/dev/null 2>&1 || { echo "Missing '$1'. $2"; exit 1; }; }

# Pull a field out of a higgsfield --json response, trying common key names.
json_field() {
  python3 - "$@" <<'PY'
import sys, json
data = json.load(sys.stdin)
keys = sys.argv[1:]
def find(o):
    if isinstance(o, dict):
        for k in keys:
            if k in o and o[k]:
                return o[k]
        for v in o.values():
            r = find(v)
            if r:
                return r
    elif isinstance(o, list):
        for v in o:
            r = find(v)
            if r:
                return r
    return None
val = find(data)
print(val if val is not None else "")
PY
}

# ── PREFLIGHT ────────────────────────────────────────────────────────────────
need higgsfield "Install it: npm install -g @higgsfield/cli"
need python3 "Install Python 3."
higgsfield auth token >/dev/null 2>&1 || { echo "Not logged in. Run: higgsfield auth login"; exit 1; }
[ -n "$IMAGE_MODEL" ] || { echo "Set IMAGE_MODEL (see 'higgsfield model list')."; exit 1; }
[ -n "$VIDEO_MODEL" ] || { echo "Set VIDEO_MODEL (see 'higgsfield model list --video')."; exit 1; }
mkdir -p "$OUT_DIR"

echo "→ [1/3] Base product image …"
BASE_JSON=$(higgsfield generate create "$IMAGE_MODEL" --prompt "$BASE_PROMPT" --json)
BASE_JOB=$(printf '%s' "$BASE_JSON" | json_field id job_id generation_id request_id)
BASE_OUT=$(higgsfield generate wait "$BASE_JOB" --json)
BASE_URL=$(printf '%s' "$BASE_OUT" | json_field output_url result_url url)
echo "   base image: $BASE_URL"
curl -fsSL "$BASE_URL" -o "${OUT_DIR}/asset_base.jpg"
BASE_UPLOAD=$(higgsfield upload "${OUT_DIR}/asset_base.jpg" --json | json_field upload_id id)

echo "→ [2/3] Exploded image …"
EXPL_JSON=$(higgsfield generate create "$IMAGE_MODEL" --prompt "$EXPLODED_PROMPT" --image "$BASE_UPLOAD" --json)
EXPL_JOB=$(printf '%s' "$EXPL_JSON" | json_field id job_id generation_id request_id)
EXPL_OUT=$(higgsfield generate wait "$EXPL_JOB" --json)
EXPL_URL=$(printf '%s' "$EXPL_OUT" | json_field output_url result_url url)
echo "   exploded image: $EXPL_URL"
curl -fsSL "$EXPL_URL" -o "${OUT_DIR}/asset_exploded.jpg"

echo "→ [3/3] Hero video (this can take a few minutes) …"
VID_JSON=$(higgsfield generate create "$VIDEO_MODEL" --prompt "$VIDEO_PROMPT" --image "$BASE_UPLOAD" --json)
VID_JOB=$(printf '%s' "$VID_JSON" | json_field id job_id generation_id request_id)
VID_OUT=$(higgsfield generate wait "$VID_JOB" --json)
VID_URL=$(printf '%s' "$VID_OUT" | json_field output_url result_url url)
echo "   hero video: $VID_URL"
curl -fsSL "$VID_URL" -o "$HERO_MP4"

echo
echo "✅ Saved $HERO_MP4"
echo "   Next: upload $HERO_MP4 in the Claude chat — I'll extract frames and redeploy."
echo "   (Or extract yourself: ffmpeg -i $HERO_MP4 -vf \"fps=24,scale=1920:-1\" -q:v 3 \"public/frames/frame_%04d.jpg\")"
