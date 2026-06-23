import type { NextConfig } from "next";

// When building for GitHub Pages we produce a fully static export served from
// a project subpath (e.g. /creator). Both are driven by env vars so local dev
// and the standard CI build are unaffected.
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

const nextConfig: NextConfig = {
  ...(process.env.GITHUB_PAGES === "true" ? { output: "export" as const } : {}),
  ...(basePath ? { basePath } : {}),
  images: { unoptimized: true },
};

export default nextConfig;
