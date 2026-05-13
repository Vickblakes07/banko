import { clearToken, getToken } from "./auth-storage";

/**
 * If unset, requests use same-origin `/api/...` and Next.js rewrites proxy to Express
 * (see `next.config.ts`). That works when you open the app via LAN IP, not only localhost.
 * Set `NEXT_PUBLIC_API_URL` only when the API is on another host (e.g. production).
 */
const base = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/$/, "");

export type ApiErrorBody = {
  error?: string;
  errors?: { msg: string; path?: string }[];
  message?: string;
};

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(message: string, status: number, body: ApiErrorBody | null) {
    super(message);
    this.status = status;
    this.body = body;
  }
}

async function parseJson(res: Response): Promise<unknown> {
  const text = await res.text();
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const h = new Headers(headers);
  h.set("Content-Type", "application/json");
  if (auth) {
    const token = getToken();
    if (token) h.set("Authorization", `Bearer ${token}`);
  }

  const url = `${base}${path}`;
  let res: Response;
  try {
    res = await fetch(url, { ...rest, headers: h });
  } catch (err) {
    const hint =
      base === ""
        ? " Start the API (folder server) with npm run dev on port 5000, then restart Next.js if you changed env."
        : " Check NEXT_PUBLIC_API_URL and that the API server is running.";
    const message =
      err instanceof TypeError
        ? `Cannot reach the server (${url}).${hint}`
        : err instanceof Error
          ? err.message
          : "Network error";
    throw new ApiError(message, 0, null);
  }
  const data = (await parseJson(res)) as T & ApiErrorBody;

  if (!res.ok) {
    if (res.status === 401) clearToken();
    const msg =
      (data && typeof data === "object" && "error" in data && data.error) ||
      (data && typeof data === "object" && "message" in data && data.message) ||
      `Request failed (${res.status})`;
    throw new ApiError(String(msg), res.status, (data as ApiErrorBody) || null);
  }

  return data as T;
}
