/**
 * CORS for Banko API (Render, etc.) when the Next.js app runs on Vercel.
 * - Reflects allowed origins (required with credentials: true).
 * - Allows any https://*.vercel.app (production + preview URLs) unless CORS_STRICT=true.
 * - Allows CLIENT_ORIGIN comma-separated list (custom domains, extra URLs).
 * - Allows localhost / 127.0.0.1 for local dev.
 */

function parseOriginList(raw) {
  if (!raw || typeof raw !== "string") return [];
  return raw.split(",").map((s) => s.trim()).filter(Boolean);
}

function isLocalDevOrigin(origin) {
  if (!origin) return false;
  return /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
}

function isVercelDeploymentOrigin(origin) {
  if (!origin) return false;
  try {
    const u = new URL(origin);
    if (u.protocol !== "https:") return false;
    const h = u.hostname.toLowerCase();
    return h === "vercel.app" || h.endsWith(".vercel.app");
  } catch {
    return false;
  }
}

function createCorsOriginCallback() {
  const explicit = parseOriginList(process.env.CLIENT_ORIGIN);
  const strict = process.env.CORS_STRICT === "true";

  return function corsOrigin(origin, callback) {
    // No Origin: same-origin, curl, server-to-server — allow without reflecting broken headers
    if (!origin) {
      return callback(null, true);
    }

    if (explicit.includes(origin)) {
      return callback(null, true);
    }

    if (isLocalDevOrigin(origin)) {
      return callback(null, true);
    }

    if (!strict && isVercelDeploymentOrigin(origin)) {
      return callback(null, true);
    }

    // Blocked — do not throw (avoids 500 on preflight)
    return callback(null, false);
  };
}

function corsOptions() {
  return {
    origin: createCorsOriginCallback(),
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  };
}

module.exports = { corsOptions, parseOriginList, isLocalDevOrigin, isVercelDeploymentOrigin };
