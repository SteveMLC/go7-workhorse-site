import type { NextConfig } from "next";

// Loud failure mode for "I built the site but GA4 is missing." A local build
// without NEXT_PUBLIC_GA_MEASUREMENT_ID used to ship a quiet, GA-less artifact.
// The live monitor catches the deployed result, but a dev-time run slipped past
// every signal until the published page was checked by hand. Make it loud.
const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID?.trim();
if (!GA_ID) {
  console.warn(
    "[go7-workhorse-site] NEXT_PUBLIC_GA_MEASUREMENT_ID is not set. " +
      "The built site will ship without GA4 — set it in .env.local " +
      "(see .env.example) or in your deployment environment.",
  );
}

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
  turbopack: { root: __dirname },
};

export default nextConfig;
