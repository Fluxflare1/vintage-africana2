"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePicker, MediaAsset } from "@/components/ImagePicker";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "cta"; label: string; url: string };

export default function EditPage() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  // basic
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isHomepage, setIsHomepage] = useState(false);

  // hero + cover - STORE IDs, not URLs
  const [heroEnabled, setHeroEnabled] = useState(false);
  const [heroAssetId, setHeroAssetId] = useState<number | null>(null);
  const [coverImageId, setCoverImageId] = useState<number | null>(null);
  const [heroAssetUrl, setHeroAssetUrl] = useState<string>("");     // for preview only
  const [coverImageUrl, setCoverImageUrl] = useState<string>("");   // for preview only
  const [heroCtaLabel, setHeroCtaLabel] = useState<string>("");
  const [heroCtaUrl, setHeroCtaUrl] = useState<string>("");

  // blocks
  const [blocks, setBlocks] = useState<Block[]>([]);

  // picker state
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"hero" | "cover">("hero");

  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setErr(null);

      const res = await fetch(`${API}/api/admin/pages/${params.id}/`, {
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        setErr(await res.text().catch(() => "Failed to load"));
        setLoading(false);
        return;
      }

      const p = await res.json();

      setTitle(p.title || "");
      setSlug(p.slug || "");
      setStatus(p.status || "draft");
      setIsHomepage(!!p.is_homepage);
      setBlocks(p.content || []);

      setHeroEnabled(!!p.hero_enabled);
      setHeroAssetId(p.hero_asset?.id || null);
      setCoverImageId(p.cover_image?.id || null);
      setHeroAssetUrl(p.hero_asset?.url || "");
      setCoverImageUrl(p.cover_image?.url || "");
      setHeroCtaLabel(p.hero_cta_label || "");
      setHeroCtaUrl(p.hero_cta_url || "");

      setLoading(false);
    })();
  }, [params.id, API]);

  function addBlock(type: Block["type"]) {
    if (type === "heading") setBlocks([...blocks, { type: "heading", level: 2, text: "" }]);
    if (type === "paragraph") setBlocks([...blocks, { type: "paragraph", text: "" }]);
    if (type === "cta") setBlocks([...blocks, { type: "cta", label: "", url: "" }]);
  }

  function onPick(asset: MediaAsset) {
    if (pickerTarget === "hero") {
      setHeroAssetId(asset.id);
      setHeroAssetUrl(asset.url); // for preview only
    }
    if (pickerTarget === "cover") {
      setCoverImageId(asset.id);
      setCoverImageUrl(asset.url); // for preview only
    }
    setPickerOpen(false);
  }

  async function save() {
    setErr(null);

    const payload = {
      title,
      slug,
      status,
      is_homepage: isHomepage,
      content: blocks,

      hero_enabled: heroEnabled,
      hero_asset_id: heroAssetId || null,
      cover_image_id: coverImageId || null,
      hero_cta_label: heroCtaLabel,
      hero_cta_url: heroCtaUrl,
    };

    const res = await fetch(`${API}/api/admin/pages/${params.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      return;
    }

    router.refresh();
  }

  if (loading) return <main>Loading...</main>;

  return (
    <main className="space-y-6 max-w-3xl">
      <h1 className="text-2xl font-bold">Edit Page</h1>
      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      {/* Basics */}
      <div className="space-y-2">
        <input className="border w-full p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input className="border w-full p-2 rounded" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (home, about, ...)" />

        <div className="flex gap-3 items-center">
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={isHomepage} onChange={(e) => setIsHomepage(e.target.checked)} />
            Homepage
          </label>

          <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
      </div>

      {/* Hero + Cover */}
      <section className="border rounded p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-semibold">Hero & Cover</h2>
          <label className="flex gap-2 items-center text-sm">
            <input type="checkbox" checked={heroEnabled} onChange={(e) => setHeroEnabled(e.target.checked)} />
            Enable hero
          </label>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-semibold">Hero Image</div>
            {heroAssetUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={heroAssetUrl} alt="" className="h-36 w-full object-cover rounded border" />
            ) : (
              <div className="h-36 rounded border flex items-center justify-center text-sm text-muted-foreground">
                No hero image
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="border px-3 py-2 rounded"
                onClick={() => {
                  setPickerTarget("hero");
                  setPickerOpen(true);
                }}
              >
                Pick hero image
              </button>
              <button className="border px-3 py-2 rounded" onClick={() => {
                setHeroAssetId(null);
                setHeroAssetUrl("");
              }}>
                Clear
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-semibold">Cover Image (OG)</div>
            {coverImageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={coverImageUrl} alt="" className="h-36 w-full object-cover rounded border" />
            ) : (
              <div className="h-36 rounded border flex items-center justify-center text-sm text-muted-foreground">
                No cover image
              </div>
            )}

            <div className="flex gap-2">
              <button
                className="border px-3 py-2 rounded"
                onClick={() => {
                  setPickerTarget("cover");
                  setPickerOpen(true);
                }}
              >
                Pick cover image
              </button>
              <button className="border px-3 py-2 rounded" onClick={() => {
                setCoverImageId(null);
                setCoverImageUrl("");
              }}>
                Clear
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-2 md:grid-cols-2">
          <input
            className="border w-full p-2 rounded"
            value={heroCtaLabel}
            onChange={(e) => setHeroCtaLabel(e.target.value)}
            placeholder="Hero CTA Label (e.g. Shop now)"
          />
          <input
            className="border w-full p-2 rounded"
            value={heroCtaUrl}
            onChange={(e) => setHeroCtaUrl(e.target.value)}
            placeholder="Hero CTA URL (e.g. /collections)"
          />
        </div>
      </section>

      {/* Blocks */}
      <div className="border rounded p-3 space-y-3">
        <div className="flex gap-2">
          <button className="border px-3 py-2 rounded" onClick={() => addBlock("heading")}>+ Heading</button>
          <button className="border px-3 py-2 rounded" onClick={() => addBlock("paragraph")}>+ Paragraph</button>
          <button className="border px-3 py-2 rounded" onClick={() => addBlock("cta")}>+ CTA</button>
        </div>

        {blocks.map((b, idx) => (
          <div key={idx} className="border rounded p-3 space-y-2">
            <div className="text-sm font-semibold">{b.type.toUpperCase()}</div>

            {b.type === "heading" ? (
              <>
                <select
                  className="border p-2 rounded"
                  value={b.level}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).level = Number(e.target.value);
                    setBlocks(next);
                  }}
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  className="border w-full p-2 rounded"
                  value={b.text}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).text = e.target.value;
                    setBlocks(next);
                  }}
                  placeholder="Heading text"
                />
              </>
            ) : null}

            {b.type === "paragraph" ? (
              <textarea
                className="border w-full p-2 rounded min-h-[100px]"
                value={b.text}
                onChange={(e) => {
                  const next = [...blocks];
                  (next[idx] as any).text = e.target.value;
                  setBlocks(next);
                }}
                placeholder="Paragraph text"
              />
            ) : null}

            {b.type === "cta" ? (
              <>
                <input
                  className="border w-full p-2 rounded"
                  value={b.label}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).label = e.target.value;
                    setBlocks(next);
                  }}
                  placeholder="Button label"
                />
                <input
                  className="border w-full p-2 rounded"
                  value={b.url}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).url = e.target.value;
                    setBlocks(next);
                  }}
                  placeholder="Button URL (/collections)"
                />
              </>
            ) : null}

            <button className="text-red-600 underline text-sm" onClick={() => setBlocks(blocks.filter((_, i) => i !== idx))}>
              Remove block
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" onClick={save}>Save</button>
        <button className="border px-4 py-2 rounded" onClick={() => router.push("/admin/pages")}>Back</button>
      </div>

      <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={onPick} />
    </main>
  );
}
