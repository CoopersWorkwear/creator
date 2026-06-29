import { business, navLinks } from "../lib/business";

export default function SiteFooter() {
  const year = new Date().getFullYear();
  return (
    <footer style={{ background: "#080d16", color: "rgba(255,255,255,0.7)" }}>
      {/* CTA band */}
      <div style={{ background: "var(--accent)" }}>
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1.2rem",
            alignItems: "center",
            justifyContent: "space-between",
            paddingBlock: "2.2rem",
          }}
        >
          <div style={{ color: "#fff" }}>
            <div
              style={{
                fontFamily: "var(--font-head)",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "clamp(1.4rem, 3vw, 2rem)",
                lineHeight: 1.05,
              }}
            >
              Need a mechanic in Berwick?
            </div>
            <div style={{ opacity: 0.9, marginTop: "0.3rem" }}>
              Give us a call — we&apos;ll look after you.
            </div>
          </div>
          <a
            href={business.phoneHref}
            className="btn"
            style={{ background: "#fff", color: "var(--accent-dark)" }}
          >
            Call {business.phone}
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div
        className="container"
        style={{
          display: "grid",
          gap: "2rem",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          paddingBlock: "clamp(2.5rem, 5vw, 3.5rem)",
        }}
      >
        <div>
          <div
            style={{
              fontFamily: "var(--font-head)",
              fontWeight: 700,
              textTransform: "uppercase",
              color: "#fff",
              fontSize: "1.15rem",
            }}
          >
            {business.name}
          </div>
          <p style={{ marginTop: "0.8rem", fontSize: "0.92rem", lineHeight: 1.65, maxWidth: "34ch" }}>
            VicRoads accredited local mechanics serving Berwick and the City of
            Casey since {business.established}.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: "0.85rem", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Explore
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} style={{ fontSize: "0.92rem" }}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 style={{ color: "#fff", fontSize: "0.85rem", letterSpacing: "0.12em", marginBottom: "1rem" }}>
            Contact
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.92rem" }}>
            <li>
              <a href={business.phoneHref}>{business.phone}</a>
            </li>
            <li>
              <a href={business.mobileHref}>{business.mobile}</a>
            </li>
            <li>
              <a href={business.emailHref} style={{ wordBreak: "break-word" }}>
                {business.email}
              </a>
            </li>
            <li style={{ marginTop: "0.3rem", lineHeight: 1.55 }}>
              {business.address.line1}
              <br />
              {business.address.suburb} {business.address.state} {business.address.postcode}
            </li>
          </ul>
        </div>
      </div>

      <div style={{ borderTop: "1px solid var(--line-dark)" }}>
        <div
          className="container"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.6rem",
            justifyContent: "space-between",
            paddingBlock: "1.4rem",
            fontSize: "0.82rem",
            color: "rgba(255,255,255,0.5)",
          }}
        >
          <span>
            © {year} {business.name}. All rights reserved.
          </span>
          <span>Berwick · Beaconsfield · Officer · Narre Warren · Clyde</span>
        </div>
      </div>
    </footer>
  );
}
