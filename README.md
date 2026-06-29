# Berwick Mechanical Services

Marketing website for **Berwick Mechanical Services** — a VicRoads accredited
local mechanic workshop on Enterprise Avenue, Berwick VIC, serving the City of
Casey since 2003.

Built with **Next.js 15**, **React 19**, **TypeScript**, and **Framer Motion**
as a single-page, fully responsive, statically-exportable site.

## Running locally

```bash
npm install
npm run dev      # http://localhost:3000
```

## Building

```bash
npm run build            # standard Next.js build
GITHUB_PAGES=true npm run build   # static export to ./out (used by Pages CI)
```

## Project structure

```
app/
  layout.tsx                 Oswald + Inter fonts, SEO metadata, AutoRepair JSON-LD
  globals.css                design tokens (brand palette), base styles, utilities
  page.tsx                   composes the page sections
  lib/
    business.ts              single source of truth for all business details
  components/
    SiteHeader.tsx           sticky header with desktop + mobile nav and call CTA
    Hero.tsx                 headline, trust badges, call-to-action, stat strip
    ServicesSection.tsx      eight core services with SVG icons
    AboutSection.tsx         "since 2003" story + stat panel
    WhyUsSection.tsx         accreditation / trust reasons
    ContactSection.tsx       phone, mobile, email, address, hours, embedded map
    SiteFooter.tsx           CTA band, sitemap, contact, service-area footer
```

## Editing business details

All contact details, hours, address, accreditations and navigation live in
`app/lib/business.ts`. Update them there and they propagate across the whole
site (header, hero, contact, footer, metadata and structured data).

## Services covered

Log book servicing · Roadworthy certificates (RWC) · Brakes & clutches ·
Suspension & steering · Batteries & exhausts · Pre-purchase inspections ·
General repairs · All makes & models including 4WDs and vintage vehicles.

## Deployment

`.github/workflows/ci.yml` builds on every push. `.github/workflows/pages.yml`
publishes a static export to GitHub Pages on demand (`workflow_dispatch`). The
site uses no server-side features, so it deploys cleanly to any static host.
