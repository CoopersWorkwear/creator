# Day-Date 40 — Scroll-Driven Hero

A scroll-driven luxury-watch product landing page built with **Next.js 15**,
**React 19**, **TypeScript**, and **Framer Motion**, following the 8-step
"Build Animated Websites Using Claude Code" workflow.

As you scroll the hero, a `<canvas>` scrubs through preloaded JPEG frames —
the watch orbits and then mechanically deconstructs into an exploded view —
followed by scroll-triggered Features, Specs, and Closing CTA sections.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
```

Then confirm:

- `http://localhost:3000` loads
- `/frames/frame_0001.jpg` returns `200`
- Scrolling the hero scrubs the watch from assembled to fully deconstructed
- Features, Specs, and CTA animate in on scroll

## Project structure

```
app/
  layout.tsx                 Inter + Playfair Display fonts, metadata
  globals.css                reset + black canvas
  page.tsx                   composes the four sections
  components/
    ScrollHero.tsx           canvas frame-scrub hero (rAF, no scroll listener)
    FeaturesSection.tsx      6 feature cards, useInView fade-ins
    SpecsSection.tsx         technical specs table
    ClosingCTA.tsx           closing call-to-action
public/
  frames/frame_0001.jpg …    160 preloaded hero frames (4-digit zero-padded)
scripts/
  generate_frames.py         procedural placeholder-frame generator
  higgsfield_generate.py     real-asset pipeline via the Higgsfield API
```

The hero implementation honours the spec's non-negotiables: **no `<video>`
element** (canvas + JPEG frames only), **no scroll event listener** (a
`requestAnimationFrame` loop reading `getBoundingClientRect()`),
device-pixel-ratio scaling, cover-fit drawing, and a single fixed design-token
palette built around Everose gold `#C8A96E` on pure black `#000000`.

## ⚠️ About the hero frames (Steps 1–2)

The original workflow generates the hero footage in **Higgsfield AI** — an
external, paid generative-video tool — and extracts frames with `ffmpeg`:

```bash
ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-1" -q:v 3 "public/frames/frame_%04d.jpg"
```

Higgsfield AI is **not available in this environment**, so the committed frames
in `public/frames/` are **procedurally generated placeholders** (see
`scripts/generate_frames.py`) — an Everose-gold watch that orbits and then
explodes on a pure-black background. They demonstrate the scroll-scrub
mechanic end-to-end and match the page's aesthetic.

### Option A — swap in real Higgsfield footage manually

1. Generate the three assets and the hero video in Higgsfield AI (web app)
   using the prompts in the source brief; save it as `hero.mp4`.
2. Extract frames into `public/frames/` with the `ffmpeg` command above
   (and copy `hero.mp4` to `public/hero.mp4` if you want the raw file).
3. Update `FRAME_COUNT` at the top of `app/components/ScrollHero.tsx` to match
   the number of extracted frames.

### Option B — automate it via the Higgsfield API

`scripts/higgsfield_generate.py` runs the full pipeline (base image → exploded
image → hero video → frame extraction). It targets Higgsfield's **v2 REST API**
(`platform.higgsfield.ai`), with the wire contract mirrored from the official
`@higgsfield/client` SDK — auth header `Authorization: Key <KEY_ID:KEY_SECRET>`,
flat JSON bodies to `POST /v1/text2image/soul` and `POST /v1/image2video/dop`,
and polling at `GET /requests/{request_id}/status`.

**Network egress.** Two hosts must be in the environment's egress allowlist (the
default Claude Code web sandbox blocks both):

1. `platform.higgsfield.ai` — the API (create + poll)
2. the **asset CDN host** the result URLs use — Higgsfield serves finished media
   from a separate storage/CDN host, so *downloading* the assets needs that host
   allowlisted too. The script prints the host; add it and re-run.

```bash
# Credentials — your Higgsfield key is a KEY_ID:KEY_SECRET pair:
export HIGGSFIELD_API_KEY="KEY_ID:KEY_SECRET"
# (or: export HIGGSFIELD_API_KEY=KEY_ID; export HIGGSFIELD_API_SECRET=KEY_SECRET)

pip install requests pillow imageio imageio-ffmpeg

python3 scripts/higgsfield_generate.py --dry-run   # validate requests, no network
python3 scripts/higgsfield_generate.py             # real run (spends credits)
# then set FRAME_COUNT in app/components/ScrollHero.tsx to the printed count
```

Generation parameters (image size, quality, DoP video model) live in the
`CONFIG` block at the top of the script. `--dry-run` prints every request that
would be sent so you can confirm the payloads before spending any credits.

**Prefer the official CLI?** `scripts/higgsfield_cli.sh` does the same
three-asset run via `@higgsfield/cli` (browser login, no API key). Install the
CLI, run `higgsfield auth login`, fill in `IMAGE_MODEL` / `VIDEO_MODEL` (from
`higgsfield model list`), then `bash scripts/higgsfield_cli.sh`. It leaves you
with `public/hero.mp4` to hand off. Must run where higgsfield.ai is reachable.

### Regenerate the placeholder frames

```bash
pip install pillow numpy
python3 scripts/generate_frames.py    # FRAME_COUNT is set at the top
```

## Page sections

`app/page.tsx` composes, in scroll order: **ScrollHero** (600vh frame scrub) →
**Features** → **Gallery** (three stills pulled from the hero sequence) →
**Specs** → **Heritage** (story + stats) → **Closing CTA**.
