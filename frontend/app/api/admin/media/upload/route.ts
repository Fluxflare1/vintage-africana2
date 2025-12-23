// frontend/app/api/admin/media/upload/route.ts
import { NextResponse } from "next/server";

const BACKEND = process.env.BACKEND_URL || "http://127.0.0.1:8000";

export async function POST(req: Request) {
  const form = await req.formData();

  const res = await fetch(`${BACKEND}/api/admin/media/upload/`, {
    method: "POST",
    headers: {
      cookie: req.headers.get("cookie") || "",
      // DO NOT set content-type manually for multipart
    },
    body: form,
  });

  const text = await res.text();
  return new NextResponse(text, { status: res.status, headers: { "content-type": res.headers.get("content-type") || "application/json" } });
}
