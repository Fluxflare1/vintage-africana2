import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function GET(req: Request) {
  const res = await fetch(`${BACKEND}/api/admin/homepage/`, {
    headers: { cookie: req.headers.get("cookie") || "" },
    cache: "no-store",
  });
  return NextResponse.json(await res.json(), { status: res.status });
}

export async function PUT(req: Request) {
  const body = await req.text();
  const res = await fetch(`${BACKEND}/api/admin/homepage/`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      cookie: req.headers.get("cookie") || "",
    },
    body,
  });
  return NextResponse.json(await res.json(), { status: res.status });
}
