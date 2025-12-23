"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setErr(null);
    setLoading(true);

    const res = await fetch("/api/admin/login/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ username, password }),
    });

    setLoading(false);

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      setErr(text || "Login failed");
      return;
    }

    router.push("/admin/dashboard");
  }

  return (
    <main className="space-y-4 max-w-md">
      <h1 className="text-2xl font-bold">Login</h1>

      <form onSubmit={submit} className="space-y-3">
        <input
          className="border w-full p-2 rounded"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="border w-full p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {err ? <p className="text-red-600 text-sm">{err}</p> : null}

        <button
          className="border px-4 py-2 rounded"
          type="submit"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}
