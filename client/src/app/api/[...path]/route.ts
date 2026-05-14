import { NextRequest, NextResponse } from "next/server";
import {
  getApiInternalBase,
  HOP_BY_HOP_REQUEST_HEADERS,
  HOP_BY_HOP_RESPONSE_HEADERS,
} from "@/lib/upstream-api";

type Ctx = { params: Promise<{ path: string[] }> };

async function forward(req: NextRequest, pathSegments: string[]) {
  const base = getApiInternalBase();
  if (!base) {
    return NextResponse.json(
      {
        error:
          "API_INTERNAL_URL is not configured. In Vercel → Settings → Environment Variables, set API_INTERNAL_URL to your Render API URL (e.g. https://banko-psp6.onrender.com), then redeploy.",
      },
      { status: 503 }
    );
  }

  const subpath = (pathSegments ?? []).join("/");
  const target = new URL(`${base}/api/${subpath}`);
  const src = new URL(req.url);
  target.search = src.search;

  const headers = new Headers();
  req.headers.forEach((value, key) => {
    if (HOP_BY_HOP_REQUEST_HEADERS.has(key.toLowerCase())) return;
    headers.set(key, value);
  });

  let body: ArrayBuffer | undefined;
  if (!["GET", "HEAD"].includes(req.method)) {
    body = await req.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target.toString(), {
      method: req.method,
      headers,
      body: body && body.byteLength ? body : undefined,
      cache: "no-store",
    });
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return NextResponse.json(
      { error: "Could not reach the API server", detail: msg },
      { status: 502 }
    );
  }

  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    if (HOP_BY_HOP_RESPONSE_HEADERS.has(key.toLowerCase())) return;
    out.set(key, value);
  });

  return new NextResponse(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}

export async function GET(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path ?? []);
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path ?? []);
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path ?? []);
}

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path ?? []);
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path ?? []);
}

export async function OPTIONS(req: NextRequest, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path ?? []);
}
