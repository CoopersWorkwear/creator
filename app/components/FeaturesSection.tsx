"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const ACCENT = "#C8A96E";

type Feature = {
  label: string;
  copy: string;
  icon: ReactNode;
};

const iconProps = {
  width: 28,
  height: 28,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: ACCENT,
  strokeWidth: 1.2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

const features: Feature[] = [
  {
    label: "Perpetual Movement",
    copy: "A self-winding calibre that draws its rhythm from the motion of the wrist, never asking to be wound.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    label: "Everose Gold",
    copy: "An exclusive 18 ct rose-gold alloy cast in-house, its warm blush sealed against the fading of years.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l4 4-4 14-4-14 4-4z" />
        <path d="M8 7h8" />
      </svg>
    ),
  },
  {
    label: "Oyster Waterproofing",
    copy: "A hermetically screwed-down case and crown that hold the elements at bay to a depth of 100 metres.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3c4 5 6 8 6 11a6 6 0 0 1-12 0c0-3 2-6 6-11z" />
      </svg>
    ),
  },
  {
    label: "President Bracelet",
    copy: "Three semi-circular links flow seamlessly into the case, concealing a Crownclasp beneath the gold.",
    icon: (
      <svg {...iconProps}>
        <circle cx="6" cy="12" r="2.4" />
        <circle cx="12" cy="12" r="2.4" />
        <circle cx="18" cy="12" r="2.4" />
      </svg>
    ),
  },
  {
    label: "Superlative Chronometer",
    copy: "Certified to a precision of −2/+2 seconds a day, tested after casing across temperature and position.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 13l4 4L19 7" />
        <circle cx="12" cy="12" r="9" />
      </svg>
    ),
  },
  {
    label: "Cyclops Date",
    copy: "A 2.5× sapphire lens magnifies the date at three o'clock, an instantly legible signature at a glance.",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="6" />
        <path d="M20 20l-4.5-4.5" />
      </svg>
    ),
  },
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

export default function FeaturesSection() {
  return (
    <section
      id="features"
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
          Crafted Without Compromise
        </motion.span>

        <motion.h2
          variants={item}
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(2rem, 4vw, 3.5rem)",
            maxWidth: "20ch",
            marginBottom: "clamp(3rem, 6vh, 5rem)",
            lineHeight: 1.1,
          }}
        >
          Every part earns its place.
        </motion.h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "1px",
          }}
        >
          {features.map((f) => (
            <motion.article
              key={f.label}
              variants={item}
              style={{
                borderTop: "1px solid rgba(200,169,110,0.2)",
                padding: "2.2rem 1.6rem 1.6rem 0",
              }}
            >
              <div style={{ marginBottom: "1.4rem" }}>{f.icon}</div>
              <h3
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 500,
                  fontSize: "1.05rem",
                  marginBottom: "0.7rem",
                  color: "#fff",
                }}
              >
                {f.label}
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter)",
                  fontWeight: 300,
                  fontSize: "0.92rem",
                  lineHeight: 1.65,
                  color: "#E5E5E5",
                  maxWidth: "34ch",
                }}
              >
                {f.copy}
              </p>
            </motion.article>
          ))}
        </div>
      </motion.div>
    </section>
  );
}
