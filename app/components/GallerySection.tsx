"use client";

import { motion } from "framer-motion";

const ACCENT = "#C8A96E";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

// Reuse three moments from the hero sequence as gallery stills:
// fully assembled, mid-deconstruction, and the final exploded view.
const plates: { src: string; label: string; caption: string }[] = [
  {
    src: `${BASE_PATH}/frames/frame_0001.jpg`,
    label: "The Whole",
    caption: "Assembled to a tolerance measured in microns.",
  },
  {
    src: `${BASE_PATH}/frames/frame_0096.jpg`,
    label: "The Reveal",
    caption: "Mid-motion, the case yields its inner architecture.",
  },
  {
    src: `${BASE_PATH}/frames/frame_0160.jpg`,
    label: "The Sum of Parts",
    caption: "Every component, suspended in deliberate symmetry.",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0, 0, 1] as const },
  },
};

export default function GallerySection() {
  return (
    <section
      style={{
        background: "#000",
        padding: "clamp(5rem, 12vh, 9rem) clamp(1.5rem, 6vw, 7rem)",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
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
          Anatomy of an Icon
        </motion.span>

        <motion.h2
          variants={item}
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            maxWidth: "18ch",
            marginBottom: "clamp(3rem, 6vh, 5rem)",
            lineHeight: 1.1,
          }}
        >
          Seen from every angle.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {plates.map((p) => (
            <motion.figure
              key={p.label}
              variants={item}
              style={{ margin: 0 }}
            >
              <div
                style={{
                  position: "relative",
                  aspectRatio: "4 / 5",
                  overflow: "hidden",
                  background: "#000",
                  border: "1px solid rgba(200,169,110,0.2)",
                }}
              >
                {/* Plain <img> — these are pre-rendered static frames. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.src}
                  alt={p.label}
                  loading="lazy"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    display: "block",
                  }}
                />
              </div>
              <figcaption style={{ marginTop: "1.1rem" }}>
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--font-inter)",
                    fontSize: "0.62rem",
                    letterSpacing: "0.22em",
                    textTransform: "uppercase",
                    color: ACCENT,
                    marginBottom: "0.5rem",
                  }}
                >
                  {p.label}
                </span>
                <span
                  style={{
                    fontFamily: "var(--font-inter)",
                    fontWeight: 300,
                    fontSize: "0.92rem",
                    lineHeight: 1.6,
                    color: "#E5E5E5",
                  }}
                >
                  {p.caption}
                </span>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
