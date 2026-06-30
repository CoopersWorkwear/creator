import { business } from "../lib/business";

/**
 * Brushed-chrome wordmark lockup recreating the Berwick Mechanical Services
 * logo: "BERWICK MECHANICAL" in metallic lettering above tracked-out
 * "SERVICES". Pure CSS so it stays crisp at any size and needs no asset.
 */
export default function Logo({
  scale = 1,
  asLink = true,
}: {
  scale?: number;
  asLink?: boolean;
}) {
  const inner = (
    <span
      style={{
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        lineHeight: 1,
        gap: `${0.28 * scale}rem`,
      }}
    >
      <span
        className="metal-text"
        style={{
          fontFamily: "var(--font-head)",
          textTransform: "uppercase",
          fontSize: `${1.18 * scale}rem`,
          letterSpacing: "0.01em",
          whiteSpace: "nowrap",
        }}
      >
        <span style={{ fontWeight: 700 }}>Berwick</span>
        <span style={{ fontWeight: 400 }}>Mechanical</span>
      </span>
      <span
        style={{
          display: "flex",
          alignItems: "center",
          gap: `${0.5 * scale}rem`,
          width: "100%",
        }}
      >
        <span style={{ flex: 1, height: 1, background: "rgba(199,204,210,0.35)" }} />
        <span
          style={{
            fontFamily: "var(--font-head)",
            fontWeight: 500,
            textTransform: "uppercase",
            fontSize: `${0.56 * scale}rem`,
            letterSpacing: "0.52em",
            textIndent: "0.52em",
            color: "var(--metal-dark)",
            whiteSpace: "nowrap",
          }}
        >
          Services
        </span>
        <span style={{ flex: 1, height: 1, background: "rgba(199,204,210,0.35)" }} />
      </span>
    </span>
  );

  if (!asLink) return inner;

  return (
    <a href="#top" aria-label={`${business.name} — home`} style={{ display: "inline-block" }}>
      {inner}
    </a>
  );
}
