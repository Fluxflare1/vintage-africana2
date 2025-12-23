"use client";

import { useEffect, useState } from "react";

type Asset = { id: number; url: string; name: string };

export function ImagePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (asset: Asset) => void;
}) {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [err, setErr] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function load() {
    setErr(null);
    const res = await fetch("/api/admin/media/", { credentials: "include" });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Failed to load"));
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
    if (open) load();
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-3xl rounded p-4 space-y-3">
        <div className="flex justify-between items-center">
          <h2 className="font-bold text-lg">Select an image</h2>
          <button className="border px-3 py-1 rounded" onClick={onClose}>Close</button>
        </div>

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

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[50vh] overflow-auto">
          {assets.map((a) => (
            <button
              key={a.id}
              className="border rounded p-2 text-left hover:bg-gray-50"
              onClick={() => onPick(a)}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={a.url} alt={a.name} className="w-full h-28 object-cover rounded" />
              <div className="text-xs mt-2 break-words">{a.name}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
