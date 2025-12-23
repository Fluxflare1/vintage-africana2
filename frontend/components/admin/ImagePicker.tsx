"use client";

import { useEffect, useMemo, useState } from "react";

type Asset = {
  id: number;
  type: string;
  title: string;
  alt_text: string;
  caption: string;
  external_url: string;
  url: string; // computed by serializer for uploaded file
};

export function ImagePicker({
  open,
  onClose,
  onPick,
}: {
  open: boolean;
  onClose: () => void;
  onPick: (asset: Asset) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [items, setItems] = useState<Asset[]>([]);
  const [q, setQ] = useState("");
  const [err, setErr] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    if (!needle) return items;
    return items.filter((a) => (a.title || "").toLowerCase().includes(needle));
  }, [items, q]);

  useEffect(() => {
    if (!open) return;
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await fetch("/api/admin/media", { cache: "no-store", credentials: "include" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        // If you later add filtering server-side, this still works.
        setItems((data || []).filter((x: any) => x.type === "image"));
      } catch (e: any) {
        setErr(e?.message || "Failed to load media");
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  async function upload(file: File) {
    setErr(null);
    const form = new FormData();
    form.append("file", file);

    const res = await fetch("/api/admin/media/upload/", {
      method: "POST",
      body: form,
      credentials: "include",
    });

    if (!res.ok) {
      setErr(await res.text().catch(() => "Upload failed"));
      return;
    }

    const created = await res.json();
    setItems((prev) => [created, ...prev]);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-white rounded border shadow-sm">
        <div className="p-3 border-b flex items-center justify-between">
          <div className="font-semibold">Pick an image</div>
          <button className="underline" onClick={onClose}>Close</button>
        </div>

        <div className="p-3 space-y-3">
          {err ? <div className="text-sm text-red-600">{err}</div> : null}

          <div className="flex gap-3 items-center">
            <input
              className="border rounded p-2 w-full"
              placeholder="Search by title..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />

            <label className="border rounded px-3 py-2 cursor-pointer bg-white hover:bg-gray-50">
              Upload
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) upload(f);
                }}
              />
            </label>
          </div>

          {loading ? <div className="text-sm text-gray-600">Loading...</div> : null}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {filtered.map((a) => (
              <button
                key={a.id}
                className="border rounded overflow-hidden text-left hover:shadow-sm"
                onClick={() => onPick(a)}
              >
                <div className="bg-gray-100 aspect-video">
                  {/* prefer uploaded file url, fallback to external_url */}
                  <img
                    src={a.url || a.external_url}
                    alt={a.alt_text || a.title || "image"}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-2 text-sm">
                  <div className="font-medium truncate">{a.title || `Image #${a.id}`}</div>
                </div>
              </button>
            ))}
          </div>

          {!loading && filtered.length === 0 ? (
            <div className="text-sm text-gray-600">No images found.</div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
