"use client";

import { motion } from "framer-motion";

const ACCENT = "#C8A96E";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.25, 0, 0, 1] as const },
  },
};

export default function ShowcaseSection() {
  return (
    <section
      style={{
        background: "#000",
        padding: "clamp(5rem, 12vh, 9rem) clamp(1.5rem, 6vw, 7rem)",
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        style={{ maxWidth: 1100, margin: "0 auto", textAlign: "center" }}
      >
        <motion.span
          variants={item}
          style={{
            display: "block",
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: "1.2rem",
          }}
        >
          The Reference in the Metal
        </motion.span>

        <motion.h2
          variants={item}
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4.5vw, 3.8rem)",
            lineHeight: 1.1,
            marginBottom: "clamp(2.5rem, 6vh, 4.5rem)",
          }}
        >
          Light is the truest test of gold.
        </motion.h2>

        <motion.figure
          variants={item}
          style={{ margin: 0, position: "relative" }}
        >
          {/* Soft radial glow so the on-black product shot reads with depth. */}
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: "-10% -5%",
              background:
                "radial-gradient(ellipse at center, rgba(200,169,110,0.10) 0%, transparent 65%)",
              pointerEvents: "none",
            }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`${BASE_PATH}/watch-everose.jpg`}
            alt="The Day-Date 40 in Everose gold with a chocolate sunburst dial"
            loading="lazy"
            style={{
              position: "relative",
              display: "block",
              width: "100%",
              height: "auto",
              maxWidth: 900,
              margin: "0 auto",
            }}
          />
          <figcaption
            style={{
              fontFamily: "var(--font-inter)",
              fontWeight: 300,
              fontSize: "0.85rem",
              lineHeight: 1.6,
              color: "#E5E5E5",
              maxWidth: 520,
              margin: "2rem auto 0",
            }}
          >
            Everose gold and a chocolate sunburst dial, captured under a single
            raking light — every flute, every link, every reflection intact.
          </figcaption>
        </motion.figure>
      </motion.div>
    </section>
  );
}
