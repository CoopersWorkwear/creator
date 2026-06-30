"use client";

import { useEffect, useState } from "react";
import { business, navLinks } from "../lib/business";
import Logo from "./Logo";

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
        background: scrolled ? "rgba(10,11,13,0.95)" : "rgba(10,11,13,0.55)",
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
        <Logo scale={0.95} />

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
