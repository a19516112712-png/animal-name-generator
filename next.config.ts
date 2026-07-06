import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: { unoptimized: true },
  async redirects() {
    return [
      {
        source: "/terms-of-service",
        destination: "/terms",
        permanent: true,
      },
      {
        /**
         * Legacy /animal/:slug/facts/ → /animal/:slug/
         * :slug+ captures multi-segment paths (e.g. anemone-shrimp).
         * :slug* in destination enables multi-segment passthrough.
         * Handles the canonical /facts/ variant with trailing slash.
         */
        source: "/animal/:slug+/facts/",
        destination: "/animal/:slug*/",
        permanent: true,
      },
      {
        /**
         * Legacy /animal/:slug/facts (no trailing slash) → /animal/:slug/
         * Without this rule, requests without trailing slash would
         * trigger trailingSlash:true normalization before redirect evaluation.
         * This rule ensures a direct 308 to the animal detail page.
         */
        source: "/animal/:slug+/facts",
        destination: "/animal/:slug*/",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
