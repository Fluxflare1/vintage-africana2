"use client";

import { useEffect, useState } from "react";

export default function SettingsClient() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const [data, setData] = useState<any>(null);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    const res = await fetch(`${API}/api/admin/settings/`, { credentials: "include", cache: "no-store" });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Failed to load settings"));
      return;
    }
    setData(await res.json());
  }

  useEffect(() => { load(); }, []);

  async function save() {
    if (!data) return;
    setSaving(true);
    setErr(null);
    const res = await fetch(`${API}/api/admin/settings/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    setSaving(false);
    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      return;
    }
    setData(await res.json());
  }

  if (!data) return <div>Loading...</div>;

  // We don’t assume exact fields — we show common ones if they exist
  return (
    <div className="space-y-3">
      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      {"site_name" in data ? (
        <input className="border w-full p-2 rounded" value={data.site_name || ""} placeholder="Site name"
          onChange={(e) => setData({ ...data, site_name: e.target.value })} />
      ) : null}

      {"tagline" in data ? (
        <input className="border w-full p-2 rounded" value={data.tagline || ""} placeholder="Tagline"
          onChange={(e) => setData({ ...data, tagline: e.target.value })} />
      ) : null}

      {"logo_url" in data ? (
        <input className="border w-full p-2 rounded" value={data.logo_url || ""} placeholder="Logo URL"
          onChange={(e) => setData({ ...data, logo_url: e.target.value })} />
      ) : null}

      {/* fallback: show raw editable JSON ONLY IF the model has unusual fields (but still editable) */}
      <details className="border rounded p-3">
        <summary className="cursor-pointer text-sm">Advanced (all fields)</summary>
        <textarea
          className="border w-full p-2 rounded min-h-[220px] mt-2 font-mono text-xs"
          value={JSON.stringify(data, null, 2)}
          onChange={(e) => {
            try { setData(JSON.parse(e.target.value)); } catch {}
          }}
        />
        <p className="text-xs text-muted-foreground mt-2">
          This is temporary. We’ll replace any remaining JSON-only fields with proper UI inputs next.
        </p>
      </details>

      <button className="border px-4 py-2 rounded" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save settings"}
      </button>
    </div>
  );
}
