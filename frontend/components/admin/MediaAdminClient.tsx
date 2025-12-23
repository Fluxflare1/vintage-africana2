"use client";

import { useEffect, useState } from "react";

type MediaAsset = {
  id: number;
  type: string;
  title: string;
  alt_text: string;
  url: string;
};

export default function MediaAdminClient() {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL ?? ""}/api/admin/media/`, {
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load"));
      setAssets(await res.json());
    } catch (e: any) {
      setErr(e?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-3">
      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      <div className="flex items-center gap-2">
        <button className="border px-3 py-2 rounded" onClick={load} disabled={loading}>
          {loading ? "Loading..." : "Refresh"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {assets.map((a) => (
          <div key={a.id} className="border rounded overflow-hidden">
            <div className="aspect-square bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt={a.alt_text || a.title || ""} className="w-full h-full object-cover" />
            </div>
            <div className="p-2 text-xs">
              <div className="font-medium truncate">{a.title || `Asset #${a.id}`}</div>
              <div className="text-muted-foreground">{a.type}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
