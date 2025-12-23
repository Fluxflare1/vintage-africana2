"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "@/components/ImagePicker";

type Asset = { id: number; url: string; title?: string };

export default function AdminHomepage() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);

  const [status, setStatus] = useState<"draft" | "review" | "published">("draft");

  const [heroEnabled, setHeroEnabled] = useState(false);
  const [heroCtaLabel, setHeroCtaLabel] = useState("");
  const [heroCtaUrl, setHeroCtaUrl] = useState("");

  const [heroAsset, setHeroAsset] = useState<Asset | null>(null);
  const [coverImage, setCoverImage] = useState<Asset | null>(null);

  const [heroPickerOpen, setHeroPickerOpen] = useState(false);
  const [coverPickerOpen, setCoverPickerOpen] = useState(false);

  useEffect(() => {
    (async () => {
      setErr(null);
      const res = await fetch("/api/admin/homepage", { cache: "no-store" });
      if (!res.ok) {
        setErr(await res.text().catch(() => "Failed to load homepage"));
        setLoading(false);
        return;
      }
      const p = await res.json();

      setStatus(p.status || "draft");
      setHeroEnabled(!!p.hero_enabled);
      setHeroCtaLabel(p.hero_cta_label || "");
      setHeroCtaUrl(p.hero_cta_url || "");

      setHeroAsset(p.hero_asset?.id ? { id: p.hero_asset.id, url: p.hero_asset.url, title: p.hero_asset.title } : null);
      setCoverImage(p.cover_image?.id ? { id: p.cover_image.id, url: p.cover_image.url, title: p.cover_image.title } : null);

      setLoading(false);
    })();
  }, []);

  async function save() {
    setErr(null);
    const res = await fetch("/api/admin/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        status,
        hero_enabled: heroEnabled,
        hero_cta_label: heroCtaLabel,
        hero_cta_url: heroCtaUrl,
        hero_asset_id: heroAsset?.id ?? null,
        cover_image_id: coverImage?.id ?? null,
      }),
    });

    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      return;
    }
    alert("Homepage saved");
  }

  if (loading) return <main>Loading…</main>;

  return (
    <main className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold">Homepage (Hero)</h1>

      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="flex gap-3 items-center">
        <label className="text-sm font-medium">Status</label>
        <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value as any)}>
          <option value="draft">draft</option>
          <option value="review">review</option>
          <option value="published">published</option>
        </select>
      </div>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Hero</h2>

        <label className="flex gap-2 items-center">
          <input type="checkbox" checked={heroEnabled} onChange={(e) => setHeroEnabled(e.target.checked)} />
          Enable hero section
        </label>

        <div className="space-y-2">
          <div className="text-sm font-medium">Hero background (Image/Video asset)</div>

          {heroAsset?.url ? <img src={heroAsset.url} className="h-40 rounded border object-cover" /> : <div className="text-sm text-muted-foreground">No hero asset selected</div>}

          <div className="flex gap-2">
            <button className="border px-3 py-2 rounded" onClick={() => setHeroPickerOpen(true)}>
              Pick hero asset
            </button>
            <button className="border px-3 py-2 rounded" onClick={() => setHeroAsset(null)}>
              Clear
            </button>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Hero CTA</div>
          <input className="border w-full p-2 rounded" value={heroCtaLabel} onChange={(e) => setHeroCtaLabel(e.target.value)} placeholder="CTA label (e.g. Shop Collections)" />
          <input className="border w-full p-2 rounded" value={heroCtaUrl} onChange={(e) => setHeroCtaUrl(e.target.value)} placeholder="CTA URL (e.g. /collections)" />
        </div>
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Cover image</h2>

        {coverImage?.url ? <img src={coverImage.url} className="h-40 rounded border object-cover" /> : <div className="text-sm text-muted-foreground">No cover image selected</div>}

        <div className="flex gap-2">
          <button className="border px-3 py-2 rounded" onClick={() => setCoverPickerOpen(true)}>
            Pick cover image
          </button>
          <button className="border px-3 py-2 rounded" onClick={() => setCoverImage(null)}>
            Clear
          </button>
        </div>
      </section>

      <button className="border px-4 py-2 rounded" onClick={save}>
        Save
      </button>

      <ImagePicker
        open={heroPickerOpen}
        onClose={() => setHeroPickerOpen(false)}
        onPick={(asset) => {
          setHeroAsset({ id: asset.id, url: asset.url, title: asset.title });
          setHeroPickerOpen(false);
        }}
        type="image"
        title="Pick Hero Image"
      />

      <ImagePicker
        open={coverPickerOpen}
        onClose={() => setCoverPickerOpen(false)}
        onPick={(asset) => {
          setCoverImage({ id: asset.id, url: asset.url, title: asset.title });
          setCoverPickerOpen(false);
        }}
        type="image"
        title="Pick Cover Image"
      />
    </main>
  );
}
