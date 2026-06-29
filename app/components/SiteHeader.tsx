"use client";

import { useEffect, useState } from "react";
import { business, navLinks } from "../lib/business";

function Wrench({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M14.7 6.3a4 4 0 0 0-5.2 5.2L3 18l3 3 6.5-6.5a4 4 0 0 0 5.2-5.2l-2.4 2.4-2.6-.7-.7-2.6 2.4-2.4z" />
    </svg>
  );
}

export default function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: scrolled ? "rgba(12,19,32,0.95)" : "rgba(12,19,32,0.6)",
        backdropFilter: "blur(10px)",
        borderBottom: scrolled
          ? "1px solid var(--line-dark)"
          : "1px solid transparent",
        transition: "background 0.25s ease, border-color 0.25s ease",
      }}
    >
      <div
        className="container"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: 72,
        }}
      >
        {/* Logo */}
        <a
          href="#top"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.7rem",
            color: "#fff",
          }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 40,
              height: 40,
              borderRadius: 9,
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            <Wrench />
          </span>
          <span style={{ lineHeight: 1 }}>
            <span
              style={{
                display: "block",
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                textTransform: "uppercase",
                letterSpacing: "0.03em",
                fontSize: "1.05rem",
              }}
            >
              Berwick Mechanical
            </span>
            <span
              style={{
                display: "block",
                fontSize: "0.62rem",
                letterSpacing: "0.32em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Services · Est. {business.established}
            </span>
          </span>
        </a>

        {/* Desktop nav */}
        <nav
          className="desktop-only"
          style={{ display: "flex", alignItems: "center", gap: "2rem" }}
        >
          {navLinks.map((l) => (
            <a key={l.href} href={l.href} className="nav-link">
              {l.label}
            </a>
          ))}
          <a href={business.phoneHref} className="btn btn-primary" style={{ padding: "0.7rem 1.3rem" }}>
            {business.phone}
          </a>
        </nav>

        {/* Mobile toggle */}
        <button
          className="mobile-only"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          style={{
            background: "transparent",
            border: "1px solid var(--line-dark)",
            borderRadius: 9,
            width: 44,
            height: 44,
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            color: "#fff",
          }}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round">
            {open ? (
              <>
                <line x1="6" y1="6" x2="18" y2="18" />
                <line x1="18" y1="6" x2="6" y2="18" />
              </>
            ) : (
              <>
                <line x1="3" y1="7" x2="21" y2="7" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="17" x2="21" y2="17" />
              </>
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <nav
          className="mobile-only"
          style={{
            background: "var(--ink)",
            borderTop: "1px solid var(--line-dark)",
            padding: "1rem var(--pad) 1.6rem",
            display: "flex",
            flexDirection: "column",
            gap: "0.4rem",
          }}
        >
          {navLinks.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              style={{
                color: "#fff",
                fontFamily: "var(--font-head)",
                textTransform: "uppercase",
                letterSpacing: "0.04em",
                padding: "0.85rem 0",
                borderBottom: "1px solid var(--line-dark)",
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href={business.phoneHref}
            className="btn btn-primary"
            style={{ marginTop: "1rem" }}
          >
            Call {business.phone}
          </a>
        </nav>
      )}
    </header>
  );
}
