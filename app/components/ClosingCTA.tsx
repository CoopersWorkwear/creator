"use client";

import { motion } from "framer-motion";

const ACCENT = "#C8A96E";

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

export default function ClosingCTA() {
  return (
    <section
      style={{
        background: "#000",
        padding: "clamp(6rem, 16vh, 12rem) clamp(1.5rem, 6vw, 7rem)",
        textAlign: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        style={{
          maxWidth: 720,
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <motion.span
          variants={item}
          style={{
            fontFamily: "var(--font-inter)",
            fontSize: "0.65rem",
            letterSpacing: "0.25em",
            textTransform: "uppercase",
            color: ACCENT,
            marginBottom: "1.6rem",
          }}
        >
          Yours to Command
        </motion.span>

        <motion.h2
          variants={item}
          style={{
            fontFamily: "var(--font-playfair)",
            fontWeight: 400,
            fontSize: "clamp(2.2rem, 5vw, 4.5rem)",
            lineHeight: 1.12,
          }}
        >
          A century of mastery.
          <br />
          <span style={{ fontStyle: "italic", color: "#E5E5E5" }}>
            One expression of it.
          </span>
        </motion.h2>

        <motion.p
          variants={item}
          style={{
            fontFamily: "var(--font-inter)",
            fontWeight: 300,
            color: "#E5E5E5",
            maxWidth: 480,
            lineHeight: 1.65,
            margin: "1.6rem 0 2.6rem",
          }}
        >
          The Day-Date 40 is offered exclusively through our network of authorised
          retailers, where each timepiece is presented as it was always meant to be.
        </motion.p>

        <motion.div
          variants={item}
          style={{ position: "relative", display: "inline-block" }}
        >
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: "-120% -60%",
              background:
                "radial-gradient(ellipse, rgba(200,169,110,0.10) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
          />
          <motion.a
            href="#"
            whileHover={{ backgroundColor: "#000", color: ACCENT }}
            style={{
              position: "relative",
              display: "inline-block",
              background: ACCENT,
              color: "#000",
              border: `1px solid ${ACCENT}`,
              fontFamily: "var(--font-inter)",
              fontWeight: 500,
              fontSize: "0.7rem",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              padding: "0.9rem 2.6rem",
              textDecoration: "none",
            }}
          >
            Find an Authorised Retailer
          </motion.a>
        </motion.div>
      </motion.div>
    </section>
  );
}
