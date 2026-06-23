"use client";

import { motion } from "framer-motion";

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

export default function ScrollHero() {
  const item = {
    hidden: { opacity: 0, y: 24 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        overflow: "hidden",
        background: "#000",
      }}
    >
      {/* Looping hero video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={`${BASE_PATH}/hero-poster.jpg`}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      >
        <source src={`${BASE_PATH}/hero.mp4`} type="video/mp4" />
      </video>

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

      {/* Overlay copy */}
      <motion.div
        initial="hidden"
        animate="show"
        transition={{ delayChildren: 0.5, staggerChildren: 0.18, ease: "easeOut" }}
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          padding: "0 clamp(1.5rem, 6vw, 7rem) clamp(3rem, 10vh, 7rem)",
          pointerEvents: "none",
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
    </section>
  );
}
