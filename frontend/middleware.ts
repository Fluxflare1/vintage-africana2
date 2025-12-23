import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  if (pathname === "/admin" || pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  if (!pathname.startsWith("/admin")) return NextResponse.next();

  const cookie = req.headers.get("cookie") || "";
  const origin = req.nextUrl.origin;

  const r = await fetch(`${origin}/api/auth/me/`, {
    headers: { cookie },
    cache: "no-store",
  });

  if (r.ok) return NextResponse.next();

  const url = req.nextUrl.clone();
  url.pathname = "/admin/login";
  url.searchParams.set("next", pathname + (search || ""));
  return NextResponse.redirect(url);
}

export const config = { matcher: ["/admin/:path*"] };
