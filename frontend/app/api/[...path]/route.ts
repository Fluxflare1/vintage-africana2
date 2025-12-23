import { NextResponse } from "next/server";

const BACKEND =
  process.env.BACKEND_INTERNAL_URL || "http://backend:8000"; // docker default

function hopByHopHeadersToDrop(name: string) {
  const n = name.toLowerCase();
  return (
    n === "connection" ||
    n === "keep-alive" ||
    n === "proxy-authenticate" ||
    n === "proxy-authorization" ||
    n === "te" ||
    n === "trailers" ||
    n === "transfer-encoding" ||
    n === "upgrade" ||
    n === "host"
  );
}

async function proxy(req: Request, ctx: { params: { path: string[] } }) {
  const url = new URL(req.url);
  const target = `${BACKEND}/${ctx.params.path.join("/")}${url.search}`;

  // Copy headers (including cookies + csrf header)
  const headers = new Headers(req.headers);
  for (const [k] of headers) {
    if (hopByHopHeadersToDrop(k)) headers.delete(k);
  }

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  // Only attach body for non-GET/HEAD
  if (req.method !== "GET" && req.method !== "HEAD") {
    init.body = req.body; // streams multipart correctly
    // If body is a stream, do not set content-length manually
  }

  const r = await fetch(target, init);

  // Return response as-is (including set-cookie)
  const outHeaders = new Headers(r.headers);
  return new NextResponse(r.body, {
    status: r.status,
    headers: outHeaders,
  });
}

export const GET = proxy;
export const POST = proxy;
export const PUT = proxy;
export const PATCH = proxy;
export const DELETE = proxy;
export const OPTIONS = proxy;
