"use client";

import { useState } from "react";

export default function AdminSetupPage() {
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  async function runSetup() {
    setLoading(true);
    setMsg(null);

    const res = await fetch("/api/admin/setup", { method: "POST" });
    const text = await res.text().catch(() => "");
    setLoading(false);

    if (!res.ok) {
      setMsg(`Setup failed: ${text}`);
      return;
    }

    setMsg(`Setup success: ${text}`);
  }

  return (
    <main className="max-w-2xl space-y-4">
      <h1 className="text-2xl font-bold">Initial Setup</h1>
      <p className="text-sm text-muted-foreground">
        This will create SiteSettings, header/footer navigation, and a homepage if missing.
      </p>

      <button
        className="border px-4 py-2 rounded"
        disabled={loading}
        onClick={runSetup}
      >
        {loading ? "Running..." : "Run Setup"}
      </button>

      {msg ? <pre className="border rounded p-3 text-sm whitespace-pre-wrap">{msg}</pre> : null}
    </main>
  );
}
