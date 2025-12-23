"use client";

import { useEffect, useState } from "react";
import { ImagePicker } from "@/components/admin/ImagePicker";

type MediaAsset = {
  id: number;
  url: string;
  external_url: string;
  title: string;
  alt_text: string;
  caption: string;
  type: string;
};

type Settings = {
  site_name: string;
  tagline: string;

  logo: MediaAsset | null;
  favicon: MediaAsset | null;
  default_og_image: MediaAsset | null;

  instagram: string;
  x_twitter: string;
  facebook: string;
  youtube: string;
  tiktok: string;

  contact_email: string;
  contact_phone: string;
  address: string;
  map_embed_url: string;

  default_seo_title: string;
  default_seo_description: string;
};

export default function AdminSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState<string | null>(null);

  const [settings, setSettings] = useState<Settings | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<"logo" | "favicon" | "og">("logo");

  useEffect(() => {
    (async () => {
      setErr(null);
      setLoading(true);
      try {
        const res = await fetch("/api/admin/settings", { cache: "no-store", credentials: "include" });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();
        setSettings({
          site_name: data.site_name || "",
          tagline: data.tagline || "",

          logo: data.logo || null,
          favicon: data.favicon || null,
          default_og_image: data.default_og_image || null,

          instagram: data.instagram || "",
          x_twitter: data.x_twitter || "",
          facebook: data.facebook || "",
          youtube: data.youtube || "",
          tiktok: data.tiktok || "",

          contact_email: data.contact_email || "",
          contact_phone: data.contact_phone || "",
          address: data.address || "",
          map_embed_url: data.map_embed_url || "",

          default_seo_title: data.default_seo_title || "",
          default_seo_description: data.default_seo_description || "",
        });
      } catch (e: any) {
        setErr(e?.message || "Failed to load settings");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  function pickToField(asset: any) {
    if (!settings) return;
    if (pickerTarget === "logo") setSettings({ ...settings, logo: asset });
    if (pickerTarget === "favicon") setSettings({ ...settings, favicon: asset });
    if (pickerTarget === "og") setSettings({ ...settings, default_og_image: asset });
  }

  async function save() {
    if (!settings) return;
    setErr(null);
    setOk(null);
    setSaving(true);

    const payload = {
      site_name: settings.site_name,
      tagline: settings.tagline,

      logo_id: settings.logo?.id ?? null,
      favicon_id: settings.favicon?.id ?? null,
      default_og_image_id: settings.default_og_image?.id ?? null,

      instagram: settings.instagram,
      x_twitter: settings.x_twitter,
      facebook: settings.facebook,
      youtube: settings.youtube,
      tiktok: settings.tiktok,

      contact_email: settings.contact_email,
      contact_phone: settings.contact_phone,
      address: settings.address,
      map_embed_url: settings.map_embed_url,

      default_seo_title: settings.default_seo_title,
      default_seo_description: settings.default_seo_description,
    };

    const res = await fetch("/api/admin/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      setSaving(false);
      return;
    }

    const fresh = await res.json();
    setSettings((prev) =>
      prev
        ? {
            ...prev,
            logo: fresh.logo || null,
            favicon: fresh.favicon || null,
            default_og_image: fresh.default_og_image || null,
          }
        : prev
    );

    setOk("Saved successfully.");
    setSaving(false);
  }

  if (loading) return <div>Loading...</div>;
  if (err) return <div className="text-red-600 text-sm">{err}</div>;
  if (!settings) return <div>No settings loaded.</div>;

  const Img = ({ asset }: { asset: MediaAsset | null }) => {
    if (!asset) return <div className="text-sm text-gray-600">Not set</div>;
    const src = asset.url || asset.external_url;
    return <img src={src} className="h-16 w-16 rounded object-cover border" alt={asset.alt_text || asset.title || "image"} />;
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-gray-600">Site identity, SEO defaults, socials, and contact info.</p>
      </div>

      {ok ? <div className="text-sm text-green-700">{ok}</div> : null}
      {err ? <div className="text-sm text-red-700">{err}</div> : null}

      <section className="rounded border bg-white p-4 space-y-3">
        <div className="font-semibold">Brand</div>

        <input
          className="border rounded p-2 w-full"
          value={settings.site_name}
          onChange={(e) => setSettings({ ...settings, site_name: e.target.value })}
          placeholder="Site name"
        />

        <input
          className="border rounded p-2 w-full"
          value={settings.tagline}
          onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
          placeholder="Tagline"
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Logo</div>
            <Img asset={settings.logo} />
            <button
              className="border px-3 py-2 rounded bg-white hover:bg-gray-50"
              onClick={() => {
                setPickerTarget("logo");
                setPickerOpen(true);
              }}
            >
              Pick Logo
            </button>
            <button
              className="text-sm underline"
              onClick={() => setSettings({ ...settings, logo: null })}
            >
              Clear
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Favicon</div>
            <Img asset={settings.favicon} />
            <button
              className="border px-3 py-2 rounded bg-white hover:bg-gray-50"
              onClick={() => {
                setPickerTarget("favicon");
                setPickerOpen(true);
              }}
            >
              Pick Favicon
            </button>
            <button
              className="text-sm underline"
              onClick={() => setSettings({ ...settings, favicon: null })}
            >
              Clear
            </button>
          </div>

          <div className="space-y-2">
            <div className="text-sm font-medium">Default OG Image</div>
            <Img asset={settings.default_og_image} />
            <button
              className="border px-3 py-2 rounded bg-white hover:bg-gray-50"
              onClick={() => {
                setPickerTarget("og");
                setPickerOpen(true);
              }}
            >
              Pick OG Image
            </button>
            <button
              className="text-sm underline"
              onClick={() => setSettings({ ...settings, default_og_image: null })}
            >
              Clear
            </button>
          </div>
        </div>
      </section>

      <section className="rounded border bg-white p-4 space-y-3">
        <div className="font-semibold">SEO Defaults</div>
        <input
          className="border rounded p-2 w-full"
          value={settings.default_seo_title}
          onChange={(e) => setSettings({ ...settings, default_seo_title: e.target.value })}
          placeholder="Default SEO title"
        />
        <textarea
          className="border rounded p-2 w-full min-h-[90px]"
          value={settings.default_seo_description}
          onChange={(e) => setSettings({ ...settings, default_seo_description: e.target.value })}
          placeholder="Default SEO description"
        />
      </section>

      <section className="rounded border bg-white p-4 space-y-3">
        <div className="font-semibold">Socials</div>
        <input className="border rounded p-2 w-full" value={settings.instagram} onChange={(e) => setSettings({ ...settings, instagram: e.target.value })} placeholder="Instagram URL" />
        <input className="border rounded p-2 w-full" value={settings.x_twitter} onChange={(e) => setSettings({ ...settings, x_twitter: e.target.value })} placeholder="X/Twitter URL" />
        <input className="border rounded p-2 w-full" value={settings.facebook} onChange={(e) => setSettings({ ...settings, facebook: e.target.value })} placeholder="Facebook URL" />
        <input className="border rounded p-2 w-full" value={settings.youtube} onChange={(e) => setSettings({ ...settings, youtube: e.target.value })} placeholder="YouTube URL" />
        <input className="border rounded p-2 w-full" value={settings.tiktok} onChange={(e) => setSettings({ ...settings, tiktok: e.target.value })} placeholder="TikTok URL" />
      </section>

      <section className="rounded border bg-white p-4 space-y-3">
        <div className="font-semibold">Contact</div>
        <input className="border rounded p-2 w-full" value={settings.contact_email} onChange={(e) => setSettings({ ...settings, contact_email: e.target.value })} placeholder="Contact email" />
        <input className="border rounded p-2 w-full" value={settings.contact_phone} onChange={(e) => setSettings({ ...settings, contact_phone: e.target.value })} placeholder="Contact phone" />
        <input className="border rounded p-2 w-full" value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} placeholder="Address" />
        <input className="border rounded p-2 w-full" value={settings.map_embed_url} onChange={(e) => setSettings({ ...settings, map_embed_url: e.target.value })} placeholder="Map embed URL" />
      </section>

      <div className="flex gap-2">
        <button
          className="border px-4 py-2 rounded bg-white hover:bg-gray-50"
          onClick={save}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>

      <ImagePicker
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onPick={(asset) => {
          pickToField(asset);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
