import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: Request) {
  const res = await fetch(`${BACKEND}/api/admin/setup/`, {
    method: "POST",
    headers: { cookie: req.headers.get("cookie") || "" },
  });

  return NextResponse.json(await res.json(), { status: res.status });
}
