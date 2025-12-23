// frontend/app/api/admin/settings/route.ts
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: Request) {
  const res = await fetch(`${BACKEND}/api/admin/settings/`, {
    headers: {
      cookie: req.headers.get("cookie") || "",
    },
    cache: "no-store",
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}

export async function PUT(req: Request) {
  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/admin/settings/`, {
    method: "PUT",
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body,
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}

export async function PATCH(req: Request) {
  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/admin/settings/`, {
    method: "PATCH",
    headers: {
      "content-type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body,
  });
  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}
