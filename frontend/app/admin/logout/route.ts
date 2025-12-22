import { NextResponse } from "next/server";

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function POST() {
  await fetch(`${API_BASE}/api/auth/logout/`, {
    method: "POST",
    credentials: "include",
  });

  return NextResponse.redirect(
    new URL("/admin/login", process.env.NEXT_PUBLIC_SITE_URL),
    { status: 302 }
  );
}
