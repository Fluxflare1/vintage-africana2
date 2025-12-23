"use client";

import { useEffect, useState } from "react";

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");

  async function load() {
    setErr(null);
    setLoading(true);
    const res = await fetch("/api/admin/settings/", { credentials: "include" });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Failed to load"));
      setLoading(false);
      return;
    }
    const data = await res.json();
    setSiteName(data.site_name || "");
    setTagline(data.tagline || "");
    setLoading(false);
  }

  async function save() {
    setErr(null);
    const res = await fetch("/api/admin/settings/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ site_name: siteName, tagline }),
    });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      return;
    }
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <main>Loading...</main>;

  return (
    <main className="space-y-4 max-w-xl">
      <h1 className="text-2xl font-bold">Site Settings</h1>

      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="space-y-2">
        <input
          className="border w-full p-2 rounded"
          value={siteName}
          onChange={(e) => setSiteName(e.target.value)}
          placeholder="Site name"
        />
        <input
          className="border w-full p-2 rounded"
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="Tagline"
        />
      </div>

      <button className="border px-4 py-2 rounded" onClick={save}>
        Save Settings
      </button>
    </main>
  );
}
