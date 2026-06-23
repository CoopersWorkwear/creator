"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ScrollHero() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Drive every layer from a single scroll progress value (0 → 1) across the
  // tall container, so the watch, the glow, and the copy move at different
  // rates — the essence of the parallax.
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Watch image: slow zoom + a gentle rotation + slight rise. Because the photo
  // sits on a pure-black field, any edge revealed by the rotation stays black.
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.06, 1.34]);
  const imageRotate = useTransform(scrollYProgress, [0, 1], [-7, 4]);
  const imageY = useTransform(scrollYProgress, [0, 1], ["2%", "-10%"]);

  // Glow breathes behind the watch at its own pace.
  const glowScale = useTransform(scrollYProgress, [0, 1], [1, 1.5]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.5, 0.9, 0.4]);

  // Copy drifts down faster and fades out before the section ends.
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "55%"]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55, 0.85], [1, 1, 0]);

  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div ref={containerRef} style={{ height: "320vh", position: "relative", background: "#000" }}>
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
        {/* Glow layer */}
        <motion.div
          aria-hidden
          style={{
            position: "absolute",
            inset: "-15%",
            scale: glowScale,
            opacity: glowOpacity,
            background:
              "radial-gradient(ellipse at 58% 42%, rgba(200,169,110,0.18) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Watch image — the parallax centerpiece */}
        <motion.img
          src={`${BASE_PATH}/watch-everose.jpg`}
          alt="The Day-Date 40 in Everose gold with a chocolate sunburst dial"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
            scale: imageScale,
            rotate: imageRotate,
            y: imageY,
            willChange: "transform",
          }}
        />

        {/* Legibility gradient */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0) 75%)",
            pointerEvents: "none",
          }}
        />

        {/* Overlay copy */}
        <motion.div
          initial="hidden"
          animate="show"
          transition={{ delayChildren: 0.6, staggerChildren: 0.18, ease: "easeOut" }}
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "0 clamp(1.5rem, 6vw, 7rem) clamp(3rem, 10vh, 7rem)",
            pointerEvents: "none",
            y: textY,
            opacity: textOpacity,
          }}
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
            Forged in Everose gold and crowned with a chocolate sunburst dial — an
            heirloom engineered to outlive the moment it marks.
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
      </div>
    </div>
  );
}
