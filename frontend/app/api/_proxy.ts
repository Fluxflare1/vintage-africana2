import { NextRequest, NextResponse } from "next/server";

const DJANGO_BASE = process.env.NEXT_PUBLIC_DJANGO_BASE_URL || "http://127.0.0.1:8000";

export async function proxy(req: NextRequest, path: string) {
  const url = `${DJANGO_BASE}${path}`;

  const headers = new Headers(req.headers);
  headers.delete("host");

  const init: RequestInit = {
    method: req.method,
    headers,
    redirect: "manual",
  };

  // body handling
  if (req.method !== "GET" && req.method !== "HEAD") {
    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("multipart/form-data")) {
      init.body = await req.formData();
    } else {
      init.body = await req.text();
    }
  }

  const res = await fetch(url, init);

  const out = new NextResponse(res.body, { status: res.status });

  // copy headers (including Set-Cookie!)
  res.headers.forEach((v, k) => {
    if (k.toLowerCase() === "transfer-encoding") return;
    out.headers.set(k, v);
  });

  return out;
}
