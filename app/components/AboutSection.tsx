"use client";

import { motion } from "framer-motion";
import { business } from "../lib/business";

const years = new Date().getFullYear() - business.established;

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function AboutSection() {
  return (
    <section id="about" className="section section-dark">
      <div
        className="container"
        style={{
          display: "grid",
          gap: "clamp(2.5rem, 5vw, 4.5rem)",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          alignItems: "center",
        }}
      >
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="eyebrow">Our story</span>
          <h2 style={{ fontSize: "clamp(2rem, 4.5vw, 3rem)", marginTop: "0.9rem" }}>
            A local workshop you can actually trust.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.78)", marginTop: "1.4rem", lineHeight: 1.7 }}>
            Berwick Mechanical Services has been looking after the cars of Berwick
            and the City of Casey from our Enterprise Avenue workshop since{" "}
            {business.established}. Over those years we&apos;ve built our reputation
            the only way that lasts — by carrying out every general repair to a high
            standard and treating every customer the way we&apos;d want to be treated.
          </p>
          <p style={{ color: "rgba(255,255,255,0.78)", marginTop: "1.1rem", lineHeight: 1.7 }}>
            We work on all makes and models, including four-wheel drives and vintage
            vehicles. Whether it&apos;s a quick roadworthy, a major repair or a routine
            log book service, no job is too big or too small.
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.7rem", marginTop: "1.8rem" }}>
            {business.accreditations.map((a) => (
              <span
                key={a}
                style={{
                  fontSize: "0.82rem",
                  fontWeight: 600,
                  letterSpacing: "0.03em",
                  padding: "0.5rem 0.95rem",
                  borderRadius: 999,
                  border: "1px solid rgba(255,255,255,0.18)",
                  color: "#fff",
                  background: "rgba(255,255,255,0.04)",
                }}
              >
                {a}
              </span>
            ))}
          </div>

          <a href="#contact" className="btn btn-primary" style={{ marginTop: "2rem" }}>
            Get in touch
          </a>
        </motion.div>

        {/* Stat panel */}
        <motion.div
          variants={fade}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "1px",
            background: "var(--line-dark)",
            border: "1px solid var(--line-dark)",
            borderRadius: "var(--radius)",
            overflow: "hidden",
          }}
        >
          {[
            { n: `${years}+`, l: "Years in business" },
            { n: `${business.established}`, l: "Serving Berwick since" },
            { n: "All", l: "Makes & models welcome" },
            { n: "100%", l: "Honest, upfront pricing" },
          ].map((s) => (
            <div
              key={s.l}
              style={{
                background: "var(--navy)",
                padding: "clamp(1.6rem, 4vw, 2.6rem) 1.4rem",
              }}
            >
              <div
                className="metal-text"
                style={{
                  fontFamily: "var(--font-head)",
                  fontWeight: 700,
                  fontSize: "clamp(2.2rem, 5vw, 3.2rem)",
                  lineHeight: 1,
                }}
              >
                {s.n}
              </div>
              <div
                style={{
                  marginTop: "0.6rem",
                  fontSize: "0.82rem",
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                {s.l}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
