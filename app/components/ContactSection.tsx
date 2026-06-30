"use client";

import { motion } from "framer-motion";
import type { ReactNode } from "react";
import { business } from "../lib/business";

const fade = {
  hidden: { opacity: 0, y: 24 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] as const },
  },
};

function Row({ icon, label, children }: { icon: ReactNode; label: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
      <span
        style={{
          flexShrink: 0,
          display: "grid",
          placeItems: "center",
          width: 44,
          height: 44,
          borderRadius: 10,
          background: "var(--accent-tint)",
          color: "var(--accent)",
        }}
      >
        {icon}
      </span>
      <div>
        <div
          style={{
            fontSize: "0.72rem",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "var(--muted)",
            marginBottom: "0.2rem",
          }}
        >
          {label}
        </div>
        <div style={{ fontSize: "1.05rem", fontWeight: 500, color: "var(--text)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

export default function ContactSection() {
  return (
    <section id="contact" className="section">
      <div className="container">
        <div className="section-head" style={{ marginBottom: "clamp(2.5rem, 5vw, 3.5rem)" }}>
          <span className="eyebrow">Get in touch</span>
          <h2>Book your car in today.</h2>
          <p className="lead">
            Call us, send an email or drop by the workshop on Enterprise Avenue.
            We&apos;ll get you sorted and back on the road.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gap: "1.4rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
            alignItems: "stretch",
          }}
        >
          {/* Details */}
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "1.6rem",
              background: "#fff",
              border: "1px solid var(--line)",
              borderRadius: "var(--radius)",
              padding: "clamp(1.6rem, 3vw, 2.4rem)",
            }}
          >
            <Row icon={<PhoneIcon />} label="Phone">
              <a href={business.phoneHref} style={{ color: "inherit" }}>
                {business.phone}
              </a>
            </Row>
            <Row icon={<MobileIcon />} label="Mobile">
              <a href={business.mobileHref} style={{ color: "inherit" }}>
                {business.mobile}
              </a>
            </Row>
            <Row icon={<MailIcon />} label="Email">
              <a href={business.emailHref} style={{ color: "inherit", wordBreak: "break-word" }}>
                {business.email}
              </a>
            </Row>
            <Row icon={<PinIcon />} label="Workshop">
              <a href={business.mapsHref} target="_blank" rel="noopener noreferrer" style={{ color: "inherit" }}>
                {business.address.line1}
                <br />
                {business.address.suburb} {business.address.state} {business.address.postcode}
              </a>
            </Row>

            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap", marginTop: "0.4rem" }}>
              <a href={business.phoneHref} className="btn btn-primary">
                Call now
              </a>
              <a href={business.emailHref} className="btn btn-dark">
                Email us
              </a>
            </div>
          </motion.div>

          {/* Hours */}
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            style={{
              background: "var(--ink)",
              color: "#fff",
              borderRadius: "var(--radius)",
              padding: "clamp(1.6rem, 3vw, 2.4rem)",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <h3 style={{ fontSize: "1.3rem", marginBottom: "1.4rem" }}>Opening Hours</h3>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column" }}>
              {business.hours.map((h) => (
                <li
                  key={h.day}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "1rem",
                    padding: "0.85rem 0",
                    borderBottom: "1px solid var(--line-dark)",
                  }}
                >
                  <span style={{ color: "rgba(255,255,255,0.85)" }}>{h.day}</span>
                  <span style={{ fontWeight: 600, color: "#fff", textAlign: "right" }}>{h.time}</span>
                </li>
              ))}
            </ul>
            <p style={{ marginTop: "1.4rem", fontSize: "0.9rem", color: "rgba(255,255,255,0.6)", lineHeight: 1.6 }}>
              Please call ahead to book — especially for roadworthy inspections and
              larger jobs, so we can have you in and out as quickly as possible.
            </p>
          </motion.div>

          {/* Map */}
          <motion.div
            variants={fade}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            style={{
              borderRadius: "var(--radius)",
              overflow: "hidden",
              border: "1px solid var(--line)",
              minHeight: 320,
              background: "var(--paper-soft)",
            }}
          >
            <iframe
              title={`Map to ${business.name}`}
              src={business.mapEmbed}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              style={{ width: "100%", height: "100%", minHeight: 320, border: 0 }}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.9.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}
function MobileIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="7" y="2" width="10" height="20" rx="2.5" />
      <path d="M11 18h2" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 21s-7-5.5-7-11a7 7 0 0 1 14 0c0 5.5-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
