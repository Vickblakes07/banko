import path from "path";
import type { NextConfig } from "next";

/** Where Express runs (same machine in dev). Used only for server-side rewrites. */
const apiOrigin = process.env.API_INTERNAL_URL || "http://127.0.0.1:5000";

const allowedDevOrigins =
  process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Keeps tracing inside `client/` when a lockfile exists in the repo root */
  outputFileTracingRoot: path.join(__dirname),
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
  async rewrites() {
    return [
      {
        source: "/health",
        destination: `${apiOrigin}/health`,
      },
      {
        source: "/api/:path*",
        destination: `${apiOrigin}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;