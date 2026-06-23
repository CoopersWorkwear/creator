"use client";

import { motion } from "framer-motion";

const ACCENT = "#C8A96E";
const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const IMG = `${BASE_PATH}/watch-everose.jpg`;

// Three macro crops of the same real photograph, framed via background-size /
// background-position to spotlight different details of the watch.
const plates: { label: string; caption: string; size: string; position: string }[] = [
  {
    label: "The Dial",
    caption: "A chocolate sunburst face, sub-dials turned in concentric guilloché.",
    size: "230%",
    position: "62% 42%",
  },
  {
    label: "The Bezel",
    caption: "Each flute cut and polished by hand to catch and throw the light.",
    size: "180%",
    position: "40% 60%",
  },
  {
    label: "The Bracelet",
    caption: "Three-piece President links flowing seamlessly from the case.",
    size: "200%",
    position: "12% 78%",
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
          Closer than the eye can hold.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "clamp(1rem, 2vw, 1.5rem)",
          }}
        >
          {plates.map((p) => (
            <motion.figure key={p.label} variants={item} style={{ margin: 0 }}>
              <div
                role="img"
                aria-label={`${p.label} detail of the Everose Day-Date 40`}
                style={{
                  aspectRatio: "4 / 5",
                  backgroundImage: `url(${IMG})`,
                  backgroundSize: p.size,
                  backgroundPosition: p.position,
                  backgroundRepeat: "no-repeat",
                  backgroundColor: "#000",
                  border: "1px solid rgba(200,169,110,0.2)",
                }}
              />
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
