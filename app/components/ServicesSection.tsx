"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";

const iconProps = {
  width: 30,
  height: 30,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

type Service = { title: string; copy: string; icon: ReactNode };

const services: Service[] = [
  {
    title: "Log Book Servicing",
    copy: "Manufacturer-scheduled servicing that keeps your new-car warranty fully intact — stamped and done by the book.",
    icon: (
      <svg {...iconProps}>
        <path d="M4 4h11l5 5v11a0 0 0 0 1 0 0H4z" />
        <path d="M15 4v5h5" />
        <path d="M8 13h7M8 17h7" />
      </svg>
    ),
  },
  {
    title: "Roadworthy Certificates",
    copy: "VicRoads licensed RWC inspections for registration, resale or transfer — assessed thoroughly and signed off on site.",
    icon: (
      <svg {...iconProps}>
        <path d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Brakes & Clutches",
    copy: "Pads, discs, drums and complete clutch replacements — restoring safe, confident stopping and smooth shifting.",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="12" r="8" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 4v3M12 17v3M4 12h3M17 12h3" />
      </svg>
    ),
  },
  {
    title: "Suspension & Steering",
    copy: "Shocks, struts, bushes, ball joints and steering components repaired for a stable, comfortable, controlled ride.",
    icon: (
      <svg {...iconProps}>
        <path d="M5 19a3 3 0 0 0 6 0M13 19a3 3 0 0 0 6 0" />
        <path d="M8 16V8l3-2 5 4v6" />
        <circle cx="8" cy="6" r="1.4" />
      </svg>
    ),
  },
  {
    title: "Batteries & Exhausts",
    copy: "Battery testing and replacement, plus exhaust and emissions repairs — diagnosed quickly and fitted to last.",
    icon: (
      <svg {...iconProps}>
        <rect x="3" y="9" width="14" height="9" rx="1.5" />
        <path d="M7 9V6h6v3M17 13h3l1 3" />
        <path d="M9 13h1.5M13 13h1.5" />
      </svg>
    ),
  },
  {
    title: "Pre-Purchase Inspections",
    copy: "Buying used? We give any vehicle a thorough independent check so you know exactly what you're paying for.",
    icon: (
      <svg {...iconProps}>
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-3.5-3.5" />
        <path d="M8.5 11h5M11 8.5v5" />
      </svg>
    ),
  },
  {
    title: "General Repairs",
    copy: "From cooling systems and timing belts to electrical faults — diagnosed accurately and repaired right the first time.",
    icon: (
      <svg {...iconProps}>
        <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.6-.7-.7-2.6 2.4-2.4z" />
      </svg>
    ),
  },
  {
    title: "All Makes & Models",
    copy: "Daily drivers, 4WDs, commercial vehicles and vintage classics — no job is too big or too small for our workshop.",
    icon: (
      <svg {...iconProps}>
        <path d="M3 13l2-5a2 2 0 0 1 1.9-1.3h10.2A2 2 0 0 1 19 8l2 5v4h-2M3 17v-4M3 17h2m14 0h-7" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
      </svg>
    ),
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const item = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function ServicesSection() {
  return (
    <section id="services" className="section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: "clamp(2.5rem, 5vw, 4rem)" }}>
          <span className="eyebrow">What we do</span>
          <h2>Everything your vehicle needs, under one roof.</h2>
          <p className="lead">
            A full-service workshop carrying out all general mechanical repairs to
            a high standard — backed by VicRoads accreditation and decades of
            hands-on experience.
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(255px, 1fr))",
            gap: "1.1rem",
          }}
        >
          {services.map((s) => (
            <motion.article
              key={s.title}
              variants={item}
              whileHover={{ y: -5 }}
              style={{
                background: "#fff",
                border: "1px solid var(--line)",
                borderRadius: "var(--radius)",
                padding: "1.8rem 1.6rem",
                transition: "box-shadow 0.2s ease, border-color 0.2s ease",
                boxShadow: "0 1px 2px rgba(16,24,40,0.04)",
              }}
            >
              <div
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: "rgba(226,59,59,0.1)",
                  color: "var(--accent)",
                  marginBottom: "1.3rem",
                }}
              >
                {s.icon}
              </div>
              <h3 style={{ fontSize: "1.2rem", marginBottom: "0.6rem", color: "var(--text)" }}>
                {s.title}
              </h3>
              <p style={{ fontSize: "0.93rem", color: "var(--muted)", lineHeight: 1.6 }}>
                {s.copy}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
