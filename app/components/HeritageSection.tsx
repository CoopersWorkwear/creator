"use client";

import { motion } from "framer-motion";

const ACCENT = "#C8A96E";

const stats: [string, string][] = [
  ["1905", "The year the workshop opened its doors"],
  ["120", "Years of uninterrupted in-house craft"],
  ["02", "Generations to truly own a single piece"],
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

export default function HeritageSection() {
  return (
    <section
      style={{
        background: "#000",
        padding: "clamp(5rem, 12vh, 9rem) clamp(1.5rem, 6vw, 7rem)",
        borderTop: "1px solid rgba(200,169,110,0.2)",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        style={{ maxWidth: 900 }}
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
            marginBottom: "1.6rem",
          }}
        >
          A Lineage of Precision
        </motion.span>

        <motion.blockquote
          variants={item}
          style={{
            margin: 0,
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(1.6rem, 3.4vw, 2.8rem)",
            lineHeight: 1.25,
            color: "#fff",
          }}
        >
          &ldquo;We do not make watches to mark the hour. We make them to
          outlast the hand that winds them.&rdquo;
        </motion.blockquote>

        <motion.p
          variants={item}
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 300,
            fontSize: "1rem",
            lineHeight: 1.7,
            color: "#E5E5E5",
            maxWidth: 620,
            margin: "2rem 0 0",
          }}
        >
          Every Day-Date begins as a raw ingot of Everose gold and ends as an
          object of inheritance. Between those two points lie hundreds of hours
          of hand-finishing, a movement assembled and disassembled until it
          keeps time without compromise, and a final inspection no machine is
          trusted to perform alone.
        </motion.p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "clamp(1.5rem, 4vw, 3rem)",
            marginTop: "clamp(3rem, 7vh, 5rem)",
          }}
        >
          {stats.map(([value, label]) => (
            <motion.div key={value} variants={item}>
              <div
                style={{
                  fontFamily: "var(--font-playfair)",
                  fontWeight: 400,
                  fontSize: "clamp(2.4rem, 5vw, 3.6rem)",
                  color: ACCENT,
                  lineHeight: 1,
                  marginBottom: "0.8rem",
                }}
              >
                {value}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "0.9rem",
                  lineHeight: 1.6,
                  color: "#E5E5E5",
                  maxWidth: "26ch",
                }}
              >
                {label}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
