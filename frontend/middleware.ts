import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Allow landing + login page
  if (pathname === "/admin" || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  // Only protect /admin/*
  if (!pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  // Ask Django if this request is authenticated (pass cookies through)
  const cookie = req.headers.get("cookie") || "";

  const r = await fetch(`${BACKEND}/api/auth/me/`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (r.ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname + (search || ""));
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/admin/:path*"],
};
