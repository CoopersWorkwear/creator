"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

// Real frames extracted from the uploaded Higgsfield "snake watch" clip.
const FRAME_COUNT = 150;
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const framePath = (i: number) =>
  `${BASE_PATH}/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`;

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Overlay copy fades out as the camera pushes into the macro, and returns as
  // you scroll back up.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });
  const textOpacity = useTransform(scrollYProgress, [0, 0.16, 0.32], [1, 1, 0]);
  const textY = useTransform(scrollYProgress, [0, 0.32], ["0%", "30%"]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const images: HTMLImageElement[] = [];
    let currentIdx = -1;
    let rafId = 0;

    // Cover-fit draw: scale the frame to fill the canvas, centred, black behind.
    const draw = (index: number) => {
      const img = images[index];
      if (!img || !img.complete || img.naturalWidth === 0) return;

      const dpr = window.devicePixelRatio || 1;
      const cw = canvas.width / dpr;
      const ch = canvas.height / dpr;
      const iw = img.naturalWidth;
      const ih = img.naturalHeight;

      ctx.fillStyle = "#000";
      ctx.fillRect(0, 0, cw, ch);

      const scale = Math.max(cw / iw, ch / ih);
      const dw = iw * scale;
      const dh = ih * scale;
      ctx.drawImage(img, (cw - dw) / 2, (ch - dh) / 2, dw, dh);

      currentIdx = index;
    };

    const sizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    sizeCanvas();

    // Preload every frame; draw frame 0 as soon as the first image is ready.
    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = framePath(i);
      if (i === 0) img.onload = () => draw(0);
      images[i] = img;
    }

    // rAF loop — no scroll listener. Progress comes from the container rect, so
    // scrolling down advances the clip and scrolling up rewinds it.
    const tick = () => {
      const top = container.getBoundingClientRect().top;
      const scrollable = container.offsetHeight - window.innerHeight;
      const progress = Math.max(0, Math.min(1, -top / scrollable));
      const target = Math.round(progress * (FRAME_COUNT - 1));
      if (target !== currentIdx) draw(target);
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const handleResize = () => {
      sizeCanvas();
      if (currentIdx >= 0) draw(currentIdx);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div ref={containerRef} style={{ height: "400vh", position: "relative", background: "#000" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          width: "100vw",
          height: "100vh",
          overflow: "hidden",
          background: "#000",
        }}
      >
        <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />

        {/* Legibility gradient */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 45%, rgba(0,0,0,0) 72%)",
            pointerEvents: "none",
          }}
        />

        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 clamp(1.5rem, 6vw, 7rem) clamp(3rem, 10vh, 7rem)",
            pointerEvents: "none",
            opacity: textOpacity,
            y: textY,
          }}
        >
          <motion.div
            initial="hidden"
            animate="show"
            transition={{ delayChildren: 0.5, staggerChildren: 0.18, ease: "easeOut" }}
            style={{ display: "flex", flexDirection: "column" }}
          >
            <motion.span
              variants={item}
              transition={{ ease: "easeOut", duration: 0.8 }}
              style={{
                fontFamily: "var(--font-inter)",
                fontSize: "0.65rem",
                letterSpacing: "0.25em",
                textTransform: "uppercase",
                color: "#C8A96E",
                marginBottom: "1.4rem",
              }}
            >
              Est. 1905 · Geneva
            </motion.span>

            <motion.h1
              variants={item}
              transition={{ ease: "easeOut", duration: 0.8 }}
              style={{
                fontFamily: "var(--font-playfair)",
                fontWeight: 400,
                fontSize: "clamp(2.4rem, 6vw, 5.5rem)",
                lineHeight: 1.05,
                maxWidth: "16ch",
              }}
            >
              The Day-Date 40
            </motion.h1>

            <motion.p
              variants={item}
              transition={{ ease: "easeOut", duration: 0.8 }}
              style={{
                fontFamily: "var(--font-inter)",
                fontWeight: 300,
                color: "#E5E5E5",
                maxWidth: 460,
                marginTop: "1.2rem",
                lineHeight: 1.6,
              }}
            >
              Forged in Everose gold and crowned with a chocolate sunburst dial —
              scroll to move through the light.
            </motion.p>

            <motion.a
              href="#features"
              variants={item}
              transition={{ ease: "easeOut", duration: 0.8 }}
              whileHover={{ backgroundColor: "#E8C98E" }}
              style={{
                pointerEvents: "auto",
                alignSelf: "flex-start",
                marginTop: "2.2rem",
                background: "#C8A96E",
                color: "#000",
                fontFamily: "var(--font-inter)",
                fontWeight: 500,
                fontSize: "0.7rem",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "0.9rem 2.6rem",
                textDecoration: "none",
              }}
            >
              Explore Collection
            </motion.a>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
