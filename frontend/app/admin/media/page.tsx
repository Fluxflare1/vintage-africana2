"use client";

import { useEffect, useState } from "react";

type Asset = { id: number; url: string; name: string; created_at?: string | null };

export default function AdminMedia() {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setErr(null);
    const res = await fetch("/api/admin/media/", { credentials: "include" });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Failed to load media"));
      return;
    }
    setAssets(await res.json());
  }

  async function upload(file: File) {
    setErr(null);
    setUploading(true);

    const fd = new FormData();
    fd.append("file", file);
    fd.append("name", file.name);

    const res = await fetch("/api/admin/media/upload/", {
      method: "POST",
      credentials: "include",
      body: fd,
    });

    setUploading(false);

    if (!res.ok) {
      setErr(await res.text().catch(() => "Upload failed"));
      return;
    }
    await load();
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold">Media Library</h1>
      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="border rounded p-3">
        <input
          type="file"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) upload(f);
          }}
          disabled={uploading}
        />
        {uploading ? <p className="text-sm">Uploading...</p> : null}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {assets.map((a) => (
          <div key={a.id} className="border rounded p-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={a.url} alt={a.name} className="w-full h-32 object-cover rounded" />
            <div className="text-xs mt-2 break-words">{a.name}</div>
          </div>
        ))}
      </div>
    </main>
  );
}
