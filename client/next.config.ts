import path from "path";
import type { NextConfig } from "next";

const allowedDevOrigins =
  process.env.ALLOWED_DEV_ORIGINS?.split(",")
    .map((s) => s.trim())
    .filter(Boolean) ?? [];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  /** Keeps tracing inside `client/` when a lockfile exists in the repo root */
  outputFileTracingRoot: path.join(__dirname),
  ...(allowedDevOrigins.length > 0 ? { allowedDevOrigins } : {}),
  /**
   * API traffic goes through `src/app/api/[...path]/route.ts` so `API_INTERNAL_URL`
   * is read at request time (Vercel). Build-time rewrites baked the wrong URL when the env var was missing.
   */
};

export default nextConfig;
