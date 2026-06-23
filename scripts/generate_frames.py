#!/usr/bin/env python3
"""
PLACEHOLDER asset generator (stand-in for PDF Steps 1-2).

The original workflow generates a luxury-watch hero video in Higgsfield AI
(Step 1) and extracts JPEG frames with ffmpeg (Step 2). Higgsfield AI is an
external paid tool that is not available in this environment, so this script
renders a procedural Everose-gold watch that orbits and then deconstructs on a
pure-black background. It produces the same artifact the site consumes:
4-digit zero-padded JPEG frames in public/frames/.

To use REAL footage instead, generate hero.mp4 in Higgsfield AI and run:
    ffmpeg -i hero.mp4 -vf "fps=24,scale=1920:-1" -q:v 3 "public/frames/frame_%04d.jpg"
then update FRAME_COUNT in app/components/ScrollHero.tsx.
"""
import math
import os
from PIL import Image, ImageDraw

# Output config -------------------------------------------------------------
OUT_DIR = os.path.join(os.path.dirname(__file__), "..", "public", "frames")
W, H = 1920, 1080
FRAME_COUNT = 72          # 3 seconds @ 24fps
SS = 2                    # supersample factor for antialiasing

# Everose gold palette ------------------------------------------------------
GOLD = (200, 169, 110)
GOLD_HI = (232, 201, 142)
GOLD_DK = (120, 96, 58)
DIAL = (58, 40, 28)       # chocolate sunburst dial (dark)
DIAL_HI = (96, 66, 44)
BLACK = (0, 0, 0)


def lerp(a, b, t):
    return a + (b - a) * t


def lerp_color(c1, c2, t):
    return tuple(int(round(lerp(c1[i], c2[i], t))) for i in range(3))


def ease_in_out(t):
    return t * t * (3 - 2 * t)


def ring(draw, cx, cy, r_out, r_in, color, sx=1.0):
    """Draw an annulus (ring) with optional horizontal squash for fake orbit."""
    bbox_o = [cx - r_out * sx, cy - r_out, cx + r_out * sx, cy + r_out]
    bbox_i = [cx - r_in * sx, cy - r_in, cx + r_in * sx, cy + r_in]
    draw.ellipse(bbox_o, fill=color)
    draw.ellipse(bbox_i, fill=BLACK)


def disc(draw, cx, cy, r, color, sx=1.0):
    draw.ellipse([cx - r * sx, cy - r, cx + r * sx, cy + r], fill=color)


def render_frame(idx):
    img = Image.new("RGB", (W * SS, H * SS), BLACK)
    d = ImageDraw.Draw(img)

    p = idx / (FRAME_COUNT - 1)            # 0..1 overall progress
    cx, cy = W * SS / 2, H * SS / 2

    # First half: orbit (camera sweep). Second half: deconstruction.
    orbit_t = min(1.0, p / 0.5)
    explode_t = ease_in_out(max(0.0, (p - 0.5) / 0.5))

    # Fake orbit via horizontal squash + slight rotation of crown position.
    orbit_ang = lerp(-0.6, 0.6, ease_in_out(orbit_t))   # radians
    sx = 0.78 + 0.22 * math.cos(orbit_ang)               # 0.78..1.0

    base = 300 * SS    # base case radius
    e = explode_t

    # ---- Caseback (floats down) ----
    cb = base * 0.92
    ring(d, cx, cy + e * 520 * SS, cb, cb * 0.62, lerp_color(GOLD_DK, GOLD, 0.4), sx)

    # ---- Movement plate (floats up, rotor accents) ----
    mv_y = cy - e * 470 * SS
    disc(d, cx, mv_y, base * 0.5, lerp_color(GOLD_DK, GOLD, 0.5), sx)
    disc(d, cx, mv_y, base * 0.5 * 0.7, lerp_color(GOLD_DK, BLACK, 0.3), sx)
    # rotor sweep
    ra = base * 0.46
    rot = orbit_ang * 1.5 + p * 1.2
    d.line(
        [cx, mv_y, cx + ra * sx * math.cos(rot), mv_y + ra * math.sin(rot)],
        fill=GOLD_HI, width=int(10 * SS),
    )

    # ---- Case body (stays centered) ----
    ring(d, cx, cy, base, base * 0.88, GOLD, sx)
    ring(d, cx, cy, base * 0.88, base * 0.82, GOLD_DK, sx)

    # ---- Bezel (lifts up) ----
    bz_y = cy - e * 150 * SS
    ring(d, cx, bz_y, base * 1.02, base * 0.82, lerp_color(GOLD, GOLD_HI, 0.3), sx)

    # ---- Dial (floats up-right) drawn above case so the face is visible ----
    dx = cx + e * 360 * SS
    dy = cy - e * 300 * SS
    disc(d, dx, dy, base * 0.8, DIAL, sx)                      # chocolate dial
    ring(d, dx, dy, base * 0.8, base * 0.74, GOLD_DK, sx)       # rehaut ring
    disc(d, dx, dy, base * 0.74, DIAL, sx)                      # restore inner face
    disc(d, dx, dy, base * 0.55, DIAL_HI, sx)                   # sunburst centre
    disc(d, dx, dy, base * 0.3, DIAL, sx)
    # hour markers
    for h in range(12):
        a = math.pi / 2 - h * (math.pi / 6)
        r1, r2 = base * 0.6, base * 0.7
        d.line(
            [dx + r1 * sx * math.cos(a), dy - r1 * math.sin(a),
             dx + r2 * sx * math.cos(a), dy - r2 * math.sin(a)],
            fill=GOLD_HI, width=int(7 * SS),
        )
    # hands
    for ang, ln, wd in ((1.1, 0.42, 13), (-0.4, 0.62, 9)):
        d.line(
            [dx, dy, dx + base * ln * sx * math.cos(ang), dy - base * ln * math.sin(ang)],
            fill=GOLD_HI, width=int(wd * SS),
        )
    disc(d, dx, dy, base * 0.05, GOLD_HI, sx)

    # ---- Crystal (rises above the dial once deconstruction begins) ----
    # While assembled the crystal is invisible glass, so only render it as it
    # separates — otherwise its inner cut-out would erase the dial face.
    if e > 0.03:
        cr_y = cy - e * 250 * SS
        ring(d, cx, cr_y, base * 0.84, base * 0.8,
             lerp_color(GOLD_HI, (255, 255, 255), 0.4), sx)

    # ---- Crown (floats right) ----
    crown_ang = orbit_ang
    crx = cx + (base * 1.02 * sx + e * 300 * SS) * math.cos(crown_ang)
    cry = cy + base * 1.02 * math.sin(crown_ang) * 0.15
    d.ellipse([crx - 28 * SS, cry - 28 * SS, crx + 28 * SS, cry + 28 * SS], fill=GOLD)

    # ---- Bracelet links (spread vertically) ----
    for i in range(1, 4):
        off = base * (0.95 + i * 0.42) + e * (160 + i * 220) * SS
        lw, lh = base * 0.46 * sx, base * 0.16
        for sign in (-1, 1):
            ly = cy + sign * off
            d.rounded_rectangle(
                [cx - lw, ly - lh, cx + lw, ly + lh],
                radius=int(18 * SS),
                fill=lerp_color(GOLD, GOLD_DK, 0.3 + i * 0.12),
            )

    # Vignette-free downsample for clean antialiased edges
    return img.resize((W, H), Image.LANCZOS)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    for i in range(FRAME_COUNT):
        frame = render_frame(i)
        path = os.path.join(OUT_DIR, f"frame_{i + 1:04d}.jpg")
        frame.save(path, "JPEG", quality=88, optimize=True)
    print(f"Wrote {FRAME_COUNT} frames to {os.path.abspath(OUT_DIR)}")


if __name__ == "__main__":
    main()
