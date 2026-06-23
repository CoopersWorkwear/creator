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
  frames/frame_0001.jpg …    72 preloaded hero frames (4-digit zero-padded)
scripts/
  generate_frames.py         procedural placeholder-frame generator
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

### To swap in real Higgsfield footage

1. Generate the three assets and the hero video in Higgsfield AI using the
   prompts in the source brief; save it as `hero.mp4`.
2. Extract frames into `public/frames/` with the `ffmpeg` command above
   (and copy `hero.mp4` to `public/hero.mp4` if you want the raw file).
3. Update `FRAME_COUNT` at the top of `app/components/ScrollHero.tsx` to match
   the number of extracted frames.

To regenerate the placeholder frames instead:

```bash
pip install pillow numpy
python3 scripts/generate_frames.py
```
