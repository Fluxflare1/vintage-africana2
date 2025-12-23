// frontend/app/api/admin/media/route.ts
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const qs = url.searchParams.toString();

  const res = await fetch(`${BACKEND}/api/admin/media/${qs ? `?${qs}` : ""}`, {
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}
