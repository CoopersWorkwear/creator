"use client";

import { motion } from "framer-motion";

const ACCENT = "#C8A96E";

const specs: [string, string][] = [
  ["Reference No.", "228235"],
  ["Case Diameter", "40 mm"],
  ["Case Material", "18 ct Everose gold"],
  ["Movement", "Calibre 3255, perpetual self-winding"],
  ["Power Reserve", "Approx. 70 hours"],
  ["Accuracy", "−2 / +2 sec per day, after casing"],
  ["Crystal", "Scratch-resistant sapphire, Cyclops lens"],
  ["Water Resistance", "100 m (330 ft)"],
  ["Dial", "Chocolate sunburst, applied hour markers"],
  ["Bracelet", "President, concealed Crownclasp"],
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.25, 0, 0, 1] as const },
  },
};

export default function SpecsSection() {
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
        viewport={{ once: true, amount: 0.2 }}
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
          Technical Specifications
        </motion.span>

        <motion.h2
          variants={item}
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            marginBottom: "clamp(3rem, 6vh, 5rem)",
            lineHeight: 1.1,
          }}
        >
          The architecture of precision.
        </motion.h2>

        <div style={{ maxWidth: 820 }}>
          {specs.map(([label, value]) => (
            <motion.div
              key={label}
              variants={item}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: "1.5rem",
                padding: "1.05rem 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontSize: "0.7rem",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                  color: ACCENT,
                  flexShrink: 0,
                }}
              >
                {label}
              </span>
              <span
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "0.98rem",
                  color: "#E5E5E5",
                  textAlign: "right",
                }}
              >
                {value}
              </span>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
