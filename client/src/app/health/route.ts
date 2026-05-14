import { NextResponse } from "next/server";
import { getApiInternalBase } from "@/lib/upstream-api";

export async function GET() {
  const base = getApiInternalBase();
  if (!base) {
    return NextResponse.json(
      {
        ok: false,
        error:
          "API_INTERNAL_URL is not set. Add it in Vercel Environment Variables and redeploy.",
      },
      { status: 503 }
    );
  }

  try {
    const upstream = await fetch(`${base}/health`, { cache: "no-store" });
    return new NextResponse(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: { "content-type": upstream.headers.get("content-type") || "application/json" },
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json({ ok: false, error: "Upstream unreachable", detail: msg }, { status: 502 });
  }
}
