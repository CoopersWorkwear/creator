"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const iconProps = {
  width: 26,
  height: 26,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Reason = { title: string; copy: string; icon: ReactNode };

const reasons: Reason[] = [
  {
    title: "VicRoads Accredited",
    copy: "A licensed vehicle tester, so your roadworthy is done right and accepted without hassle.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "VACC Member",
    copy: "We hold ourselves to the Victorian Automobile Chamber of Commerce's professional standards.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4.5" />
        <path d="M8 13.5 6.5 21 12 18l5.5 3L16 13.5" />
      </svg>
    ),
  },
  {
    title: "Honest & Upfront",
    copy: "Clear advice and fair quotes before we start — no surprises and no work you didn't ask for.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 6h18M6 6l1 13a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-13" />
        <path d="M9 6V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2" />
      </svg>
    ),
  },
  {
    title: "Experienced Hands",
    copy: "Two decades servicing the same community — many of our customers have been with us for years.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
];

const container = { hidden: {}, show: { transition: { staggerChildren: 0.1 } } };
const item = {
  hidden: { opacity: 0, y: 22 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function WhyUsSection() {
  return (
    <section id="why-us" className="section" style={{ background: "var(--paper-soft)" }}>
      <div className="container">
        <div className="section-head" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <span className="eyebrow">Why choose us</span>
          <h2>Reliable repairs, the friendly way.</h2>
          <p className="lead">
            We&apos;re a genuine local workshop — accredited, accountable and easy to
            deal with. Here&apos;s what keeps Berwick coming back.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
            gap: "1.1rem",
          }}
        >
          {reasons.map((r) => (
            <motion.div
              key={r.title}
              variants={item}
              style={{
                background: "#fff",
                borderRadius: "var(--radius)",
                padding: "1.9rem 1.6rem",
                border: "1px solid var(--line)",
                borderTop: "3px solid var(--accent)",
              }}
            >
              <div style={{ color: "var(--accent)", marginBottom: "1.1rem" }}>{r.icon}</div>
              <h3 style={{ fontSize: "1.12rem", marginBottom: "0.55rem", color: "var(--text)" }}>
                {r.title}
              </h3>
              <p style={{ fontSize: "0.92rem", color: "var(--muted)", lineHeight: 1.6 }}>
                {r.copy}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
