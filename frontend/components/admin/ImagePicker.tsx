"use client";

import { useEffect, useMemo, useState } from "react";

export type PickedAsset = {
  id: number | string;
  title?: string;
  alt_text?: string;
  type?: string;
  url: string;
  width?: number | null;
  height?: number | null;
};

type ApiAsset = {
  id: number;
  type: string;
  title?: string;
  alt_text?: string;
  file?: string | null;         // e.g. "/media/media_assets/2025/12/x.jpg"
  external_url?: string | null; // e.g. "https://..."
  width?: number | null;
  height?: number | null;
};

export function ImagePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (asset: PickedAsset) => void;
}) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<ApiAsset[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      setErr(null);
      try {
        // IMPORTANT: this assumes you already have an admin endpoint listing media assets
        // e.g. GET /api/admin/media-assets/?type=image
        const res = await fetch(`${API}/api/admin/media-assets/?type=image`, {
          credentials: "include",
          cache: "no-store",
        });
        if (!res.ok) {
          setErr(await res.text().catch(() => "Failed to load media assets"));
          setItems([]);
          setLoading(false);
          return;
        }
        const data = await res.json();
        // supports both {results:[...]} and [...]
        const list = Array.isArray(data) ? data : (data.results ?? []);
        setItems(list);
      } catch (e: any) {
        setErr(e?.message ?? "Failed to load media assets");
      } finally {
        setLoading(false);
      }
    })();
  }, [open, API]);

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return items;
    return items.filter((it) => {
      const t = (it.title ?? "").toLowerCase();
      const a = (it.alt_text ?? "").toLowerCase();
      const u = (it.external_url ?? it.file ?? "").toLowerCase();
      return t.includes(query) || a.includes(query) || u.includes(query);
    });
  }, [items, q]);

  function toUrl(it: ApiAsset) {
    const raw = it.external_url || it.file || "";
    if (!raw) return "";
    // If backend returns "/media/..." make it absolute for the frontend
    if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
    return `${API}${raw}`;
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute left-1/2 top-1/2 w-[min(980px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-lg bg-white shadow-lg">
        <div className="flex items-center justify-between border-b px-4 py-3">
          <div className="font-semibold">Pick an image</div>
          <button className="text-sm underline" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4 space-y-3">
          <input
            className="border w-full p-2 rounded"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search title / alt text / URL"
          />

          {err ? <div className="text-sm text-red-600">{err}</div> : null}
          {loading ? <div className="text-sm">Loading...</div> : null}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 max-h-[60vh] overflow-auto">
            {filtered.map((it) => {
              const url = toUrl(it);
              if (!url) return null;

              return (
                <button
                  key={it.id}
                  className="border rounded overflow-hidden text-left hover:shadow-sm"
                  onClick={() =>
                    onPick({
                      id: it.id,
                      title: it.title,
                      alt_text: it.alt_text,
                      type: it.type,
                      url,
                      width: it.width,
                      height: it.height,
                    })
                  }
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={url} alt={it.alt_text || it.title || ""} className="w-full h-32 object-cover" />
                  <div className="p-2 text-xs">
                    <div className="font-semibold line-clamp-1">{it.title || "Untitled"}</div>
                    <div className="text-muted-foreground line-clamp-1">{it.alt_text || ""}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {filtered.length === 0 && !loading ? (
            <div className="text-sm text-muted-foreground">No images found.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
