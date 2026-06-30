// Continuously sliding strip of the makes we service. The list is rendered
// twice inside the track and the CSS animates it by -50%, giving a seamless,
// never-ending loop. Hover to pause.

const brands = [
  "BMW",
  "Mercedes-Benz",
  "Audi",
  "Volkswagen",
  "Ford",
  "Holden",
  "Toyota",
  "Mazda",
  "Nissan",
  "Honda",
  "Hyundai",
  "Subaru",
  "Kia",
  "Mitsubishi",
];

export default function BrandsMarquee() {
  const loop = [...brands, ...brands];

  return (
    <section
      aria-label="Vehicle makes we service"
      style={{
        background: "var(--paper-soft)",
        borderBlock: "1px solid var(--line)",
        paddingBlock: "clamp(2.2rem, 5vw, 3.2rem)",
      }}
    >
      <p
        style={{
          textAlign: "center",
          fontFamily: "var(--font-head)",
          textTransform: "uppercase",
          letterSpacing: "0.18em",
          fontSize: "0.78rem",
          color: "var(--muted)",
          marginBottom: "clamp(1.4rem, 3vw, 2rem)",
          paddingInline: "var(--pad)",
        }}
      >
        Proudly servicing all makes &amp; models
      </p>

      <div className="marquee">
        <div className="marquee-track">
          {loop.map((brand, i) => (
            <span key={i} className="marquee-item" aria-hidden={i >= brands.length}>
              {brand}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
