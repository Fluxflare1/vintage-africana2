// frontend/app/admin/login/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

function getCookie(name: string) {
  if (typeof document === "undefined") return "";
  const m = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return m ? decodeURIComponent(m[2]) : "";
}

export default function AdminLogin() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    // Ensure csrftoken cookie exists
    fetch(`${BACKEND}/api/auth/csrf/`, { credentials: "include" }).catch(() => {});
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setBusy(true);

    const csrftoken = getCookie("csrftoken");

    const res = await fetch(`${BACKEND}/api/auth/login/`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrftoken,
      },
      body: JSON.stringify({ username, password }),
    });

    setBusy(false);

    if (!res.ok) {
      const t = await res.text().catch(() => "");
      setErr(t || "Login failed");
      return;
    }

    router.replace("/admin/dashboard");
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>

      {err ? <p className="text-red-600 text-sm whitespace-pre-wrap">{err}</p> : null}

      <form onSubmit={onSubmit} className="space-y-3">
        <input
          className="border w-full p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
        <input
          className="border w-full p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />

        <button className="border px-4 py-2 rounded w-full" disabled={busy}>
          {busy ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
