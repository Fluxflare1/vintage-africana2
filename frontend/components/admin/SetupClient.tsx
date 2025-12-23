"use client";

import { useState } from "react";

export default function SetupClient() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const [out, setOut] = useState<any>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function runSeed() {
    setLoading(true);
    setErr(null);
    setOut(null);

    const res = await fetch(`${API}/api/admin/setup/seed/`, {
      method: "POST",
      credentials: "include",
    });

    setLoading(false);

    if (!res.ok) {
      setErr(await res.text().catch(() => "Seed failed"));
      return;
    }

    setOut(await res.json());
  }

  return (
    <div className="space-y-3">
      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      <button className="border px-4 py-2 rounded" onClick={runSeed} disabled={loading}>
        {loading ? "Running..." : "Run Setup/Seed"}
      </button>

      {out ? (
        <pre className="border rounded p-3 text-xs overflow-auto">
          {JSON.stringify(out, null, 2)}
        </pre>
      ) : null}
    </div>
  );
}
