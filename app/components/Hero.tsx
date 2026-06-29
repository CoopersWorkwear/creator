"use client";

import { motion } from "framer-motion";
import { business } from "../lib/business";

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
};

const rise = {
  hidden: { opacity: 0, y: 26 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const badges = [
  "VicRoads accredited",
  "VACC member",
  `Trusted since ${business.established}`,
];

export default function Hero() {
  return (
    <section
      id="top"
      style={{
        position: "relative",
        minHeight: "100svh",
        display: "flex",
        alignItems: "center",
        color: "#fff",
        overflow: "hidden",
        background:
          "radial-gradient(1100px 700px at 78% -5%, #1d3354 0%, rgba(29,51,84,0) 60%), linear-gradient(160deg, #0c1320 0%, #111c30 55%, #0c1320 100%)",
      }}
    >
      {/* Decorative grid / blueprint lines */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
          backgroundSize: "54px 54px",
          maskImage:
            "radial-gradient(900px 600px at 70% 30%, #000 0%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(900px 600px at 70% 30%, #000 0%, transparent 80%)",
        }}
      />
      {/* Accent glow */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          width: 520,
          height: 520,
          right: "-6%",
          top: "12%",
          background:
            "radial-gradient(circle, rgba(226,59,59,0.25) 0%, rgba(226,59,59,0) 70%)",
          filter: "blur(10px)",
        }}
      />

      <div
        className="container"
        style={{
          position: "relative",
          paddingTop: 110,
          paddingBottom: 70,
          display: "grid",
          gap: "clamp(2.5rem, 5vw, 4rem)",
          gridTemplateColumns: "minmax(0,1fr)",
          width: "100%",
        }}
      >
        <motion.div variants={stagger} initial="hidden" animate="show" style={{ maxWidth: 760 }}>
          <motion.span variants={rise} className="eyebrow">
            Berwick · Casey · South-East Melbourne
          </motion.span>

          <motion.h1
            variants={rise}
            style={{
              fontSize: "clamp(2.6rem, 7vw, 5rem)",
              fontWeight: 700,
              marginTop: "1.2rem",
              lineHeight: 0.98,
            }}
          >
            Honest mechanics.
            <br />
            <span style={{ color: "var(--accent)" }}>Done properly</span>, every time.
          </motion.h1>

          <motion.p
            variants={rise}
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "clamp(1.05rem, 1.6vw, 1.25rem)",
              color: "rgba(255,255,255,0.78)",
              marginTop: "1.6rem",
              maxWidth: "52ch",
              lineHeight: 1.65,
            }}
          >
            {business.blurb} Family-run in Berwick since {business.established} —
            no job too big or too small.
          </motion.p>

          <motion.div
            variants={rise}
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "0.9rem",
              marginTop: "2.2rem",
            }}
          >
            <a href={business.phoneHref} className="btn btn-primary">
              <PhoneIcon /> Call {business.phone}
            </a>
            <a href="#contact" className="btn btn-ghost">
              Book a service
            </a>
          </motion.div>

          <motion.ul
            variants={rise}
            style={{
              listStyle: "none",
              display: "flex",
              flexWrap: "wrap",
              gap: "0.7rem 1.4rem",
              marginTop: "2.4rem",
            }}
          >
            {badges.map((b) => (
              <li
                key={b}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  fontSize: "0.9rem",
                  color: "rgba(255,255,255,0.85)",
                }}
              >
                <CheckIcon />
                {b}
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </div>

      {/* Bottom stat strip */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          borderTop: "1px solid var(--line-dark)",
          background: "rgba(8,13,22,0.55)",
          backdropFilter: "blur(6px)",
        }}
      >
        <div
          className="container"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "1rem",
            paddingBlock: "1.1rem",
          }}
        >
          {[
            { n: `${new Date().getFullYear() - business.established}+`, l: "Years serving Berwick" },
            { n: "All", l: "Makes & models" },
            { n: "RWC", l: "Roadworthy certificates" },
            { n: "4WD", l: "Cars · 4WDs · classics" },
          ].map((s) => (
            <div key={s.l}>
              <div
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: "clamp(1.4rem, 2.4vw, 1.9rem)",
                  color: "#fff",
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  fontSize: "0.78rem",
                  letterSpacing: "0.08em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
