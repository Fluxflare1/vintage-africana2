"use client";

import { useEffect, useMemo, useState } from "react";

export type MediaAsset = {
  id: number;
  type: "image" | "video" | "audio" | "doc";
  title: string;
  alt_text: string;
  url: string; // computed by backend serializer
};

export function ImagePicker({
  open,
  onClose,
  onPick,
  type = "image",
  title = "Pick an Asset",
}: {
  open: boolean;
  onClose: () => void;
  onPick: (asset: MediaAsset) => void;
  type?: MediaAsset["type"]; // ✅ added
  title?: string;            // ✅ optional UI title
}) {
  const [assets, setAssets] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [q, setQ] = useState("");
  const [uploading, setUploading] = useState(false);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    return assets.filter((a) => {
      if (type && a.type !== type) return false;
      if (!query) return true;
      return (a.title || "").toLowerCase().includes(query);
    });
  }, [assets, q, type]);

  async function load() {
    setErr(null);
    setLoading(true);
    try {
      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const url = `${base}/api/admin/media/`;

      const res = await fetch(url, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) throw new Error(await res.text().catch(() => "Failed to load media"));
      const data = await res.json();
      setAssets(Array.isArray(data) ? data : []);
    } catch (e: any) {
      setErr(e?.message || "Failed to load media");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (open) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function uploadFile(file: File) {
    setErr(null);
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("type", type); // ✅ use selected type
      fd.append("title", file.name);

      const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
      const res = await fetch(`${base}/api/admin/media/upload/`, {
        method: "POST",
        credentials: "include",
        body: fd,
      });

      if (!res.ok) throw new Error(await res.text().catch(() => "Upload failed"));
      const created = await res.json();
      setAssets((prev) => [created, ...prev]);
    } catch (e: any) {
      setErr(e?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between gap-3">
          <div className="font-semibold">{title}</div>
          <button className="border px-3 py-1 rounded" onClick={onClose} type="button">
            Close
          </button>
        </div>

        <div className="p-4 space-y-3">
          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <input
              className="border p-2 rounded w-full"
              placeholder="Search by title..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <label className="border px-3 py-2 rounded cursor-pointer text-sm w-fit">
              {uploading ? "Uploading..." : `Upload ${type}`}
              <input
                type="file"
                accept={type === "image" ? "image/*" : type === "video" ? "video/*" : type === "audio" ? "audio/*" : "*/*"}
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) uploadFile(f);
                  e.currentTarget.value = "";
                }}
                disabled={uploading}
              />
            </label>

            <button className="border px-3 py-2 rounded text-sm" onClick={load} disabled={loading} type="button">
              {loading ? "Loading..." : "Refresh"}
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtered.map((a) => (
              <button
                key={a.id}
                className="border rounded overflow-hidden text-left hover:shadow"
                onClick={() => onPick(a)}
                type="button"
                title={a.title || `Asset #${a.id}`}
              >
                <div className="aspect-square bg-gray-50">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {a.type === "image" ? (
                    <img
                      src={a.url}
                      alt={a.alt_text || a.title || ""}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                      {a.type.toUpperCase()}
                    </div>
                  )}
                </div>

                <div className="p-2 text-xs">
                  <div className="font-medium truncate">{a.title || `Asset #${a.id}`}</div>
                </div>
              </button>
            ))}
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No assets found.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
