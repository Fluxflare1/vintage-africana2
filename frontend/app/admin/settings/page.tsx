"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "@/components/ImagePicker";

type MediaAsset = { id: number; url: string; title?: string; type?: string };

export default function AdminSettings() {
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // text fields
  const [siteName, setSiteName] = useState("");
  const [tagline, setTagline] = useState("");
  const [instagram, setInstagram] = useState("");
  const [xTwitter, setXTwitter] = useState("");
  const [facebook, setFacebook] = useState("");
  const [youtube, setYoutube] = useState("");
  const [tiktok, setTiktok] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [address, setAddress] = useState("");
  const [mapEmbedUrl, setMapEmbedUrl] = useState("");
  const [defaultSeoTitle, setDefaultSeoTitle] = useState("");
  const [defaultSeoDescription, setDefaultSeoDescription] = useState("");

  // image IDs + previews
  const [logoId, setLogoId] = useState<number | null>(null);
  const [faviconId, setFaviconId] = useState<number | null>(null);
  const [ogId, setOgId] = useState<number | null>(null);

  const [logoUrl, setLogoUrl] = useState<string>("");
  const [faviconUrl, setFaviconUrl] = useState<string>("");
  const [ogUrl, setOgUrl] = useState<string>("");

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"logo" | "favicon" | "og">("logo");

  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);

      // NOTE: your public settings endpoint is /api/settings/
      const res = await fetch("/api/settings/", { credentials: "include" });
      if (!res.ok) {
        setErr(await res.text().catch(() => "Failed to load settings"));
        setLoading(false);
        return;
      }
      const s = await res.json();

      setSiteName(s.site_name || "");
      setTagline(s.tagline || "");

      setInstagram(s.instagram || "");
      setXTwitter(s.x_twitter || "");
      setFacebook(s.facebook || "");
      setYoutube(s.youtube || "");
      setTiktok(s.tiktok || "");

      setContactEmail(s.contact_email || "");
      setContactPhone(s.contact_phone || "");
      setAddress(s.address || "");
      setMapEmbedUrl(s.map_embed_url || "");

      setDefaultSeoTitle(s.default_seo_title || "");
      setDefaultSeoDescription(s.default_seo_description || "");

      // nested objects come back like {id, url, ...}
      if (s.logo?.id) {
        setLogoId(s.logo.id);
        setLogoUrl(s.logo.url || "");
      }
      if (s.favicon?.id) {
        setFaviconId(s.favicon.id);
        setFaviconUrl(s.favicon.url || "");
      }
      if (s.default_og_image?.id) {
        setOgId(s.default_og_image.id);
        setOgUrl(s.default_og_image.url || "");
      }

      setLoading(false);
    })();
  }, []);

  function openPicker(target: "logo" | "favicon" | "og") {
    setPickerTarget(target);
    setPickerOpen(true);
  }

  function onPick(asset: MediaAsset) {
    if (pickerTarget === "logo") {
      setLogoId(asset.id);
      setLogoUrl(asset.url);
    }
    if (pickerTarget === "favicon") {
      setFaviconId(asset.id);
      setFaviconUrl(asset.url);
    }
    if (pickerTarget === "og") {
      setOgId(asset.id);
      setOgUrl(asset.url);
    }
    setPickerOpen(false);
  }

  async function save() {
    setErr(null);
    setSaving(true);

    // If your backend requires admin permission for saving settings,
    // you should expose an admin PUT endpoint. For now we try PUT /api/settings/
    const res = await fetch("/api/settings/", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        site_name: siteName,
        tagline,

        instagram,
        x_twitter: xTwitter,
        facebook,
        youtube,
        tiktok,

        contact_email: contactEmail,
        contact_phone: contactPhone,
        address,
        map_embed_url: mapEmbedUrl,

        default_seo_title: defaultSeoTitle,
        default_seo_description: defaultSeoDescription,

        // IMPORTANT: send *_id fields (serializer now accepts these)
        logo_id: logoId,
        favicon_id: faviconId,
        default_og_image_id: ogId,
      }),
    });

    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      setSaving(false);
      return;
    }

    setSaving(false);
  }

  if (loading) return <main>Loading...</main>;

  return (
    <main className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
        <button className="border px-4 py-2 rounded" onClick={save} disabled={saving}>
          {saving ? "Saving..." : "Save"}
        </button>
      </div>

      {err ? <p className="text-red-600 text-sm whitespace-pre-wrap">{err}</p> : null}

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Brand</h2>

        <div className="grid gap-3">
          <input className="border p-2 rounded" value={siteName} onChange={(e) => setSiteName(e.target.value)} placeholder="Site name" />
          <input className="border p-2 rounded" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="Tagline" />
        </div>

        <div className="grid gap-4">
          <div className="flex items-center gap-3">
            <button className="border px-3 py-2 rounded" onClick={() => openPicker("logo")}>
              Pick Logo
            </button>
            {logoUrl ? <img src={logoUrl} className="h-12 rounded border" /> : <span className="text-sm text-gray-500">No logo</span>}
          </div>

          <div className="flex items-center gap-3">
            <button className="border px-3 py-2 rounded" onClick={() => openPicker("favicon")}>
              Pick Favicon
            </button>
            {faviconUrl ? <img src={faviconUrl} className="h-10 w-10 rounded border" /> : <span className="text-sm text-gray-500">No favicon</span>}
          </div>

          <div className="flex items-center gap-3">
            <button className="border px-3 py-2 rounded" onClick={() => openPicker("og")}>
              Pick Default OG Image
            </button>
            {ogUrl ? <img src={ogUrl} className="h-12 rounded border" /> : <span className="text-sm text-gray-500">No OG image</span>}
          </div>
        </div>
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Contact</h2>
        <input className="border p-2 rounded w-full" value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} placeholder="Contact email" />
        <input className="border p-2 rounded w-full" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} placeholder="Contact phone" />
        <input className="border p-2 rounded w-full" value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Address" />
        <input className="border p-2 rounded w-full" value={mapEmbedUrl} onChange={(e) => setMapEmbedUrl(e.target.value)} placeholder="Map embed URL" />
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Social</h2>
        <input className="border p-2 rounded w-full" value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="Instagram URL" />
        <input className="border p-2 rounded w-full" value={xTwitter} onChange={(e) => setXTwitter(e.target.value)} placeholder="X/Twitter URL" />
        <input className="border p-2 rounded w-full" value={facebook} onChange={(e) => setFacebook(e.target.value)} placeholder="Facebook URL" />
        <input className="border p-2 rounded w-full" value={youtube} onChange={(e) => setYoutube(e.target.value)} placeholder="YouTube URL" />
        <input className="border p-2 rounded w-full" value={tiktok} onChange={(e) => setTiktok(e.target.value)} placeholder="TikTok URL" />
      </section>

      <section className="border rounded p-4 space-y-3">
        <h2 className="font-semibold">Default SEO</h2>
        <input className="border p-2 rounded w-full" value={defaultSeoTitle} onChange={(e) => setDefaultSeoTitle(e.target.value)} placeholder="Default SEO title" />
        <textarea className="border p-2 rounded w-full min-h-[90px]" value={defaultSeoDescription} onChange={(e) => setDefaultSeoDescription(e.target.value)} placeholder="Default SEO description" />
      </section>

      <ImagePicker open={pickerOpen} onClose={() => setPickerOpen(false)} onPick={onPick} />
    </main>
  );
}
