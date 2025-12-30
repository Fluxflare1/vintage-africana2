import Link from "next/link";
import HomeHero from "@/components/site/HomeHero";
import BlocksRenderer from "@/components/site/BlocksRenderer";

type MediaAsset = {
  id: number;
  url: string;
  title?: string;
  alt_text?: string;
  type?: string;
};

type Page = {
  title: string;
  slug: string;
  excerpt?: string;
  content: any[];
  status: "draft" | "review" | "published";
  hero_enabled: boolean;
  hero_cta_label?: string;
  hero_cta_url?: string;
  hero_asset?: MediaAsset | null;
  cover_image?: MediaAsset | null;
};

type NavigationMenu = {
  code: string;
  title: string;
  items: { label: string; url: string; order?: number; children?: any[] }[];
};

type SiteSettings = {
  site_name: string;
  tagline?: string;
  logo?: MediaAsset | null;
  instagram?: string;
  x_twitter?: string;
  facebook?: string;
};

async function fetchJson<T>(path: string): Promise<{ ok: boolean; data?: T; text?: string }> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const res = await fetch(`${base}${path}`, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    return { ok: false, text };
  }

  return { ok: true, data: (await res.json()) as T };
}

export default async function HomePage() {
  // Public endpoints (no auth)
  const [homeRes, settingsRes, navRes] = await Promise.all([
    fetchJson<Page>("/api/pages/home/"),
    fetchJson<SiteSettings>("/api/settings/"),
    fetchJson<NavigationMenu>("/api/navigation/header/"),
  ]);

  const homepage = homeRes.ok ? homeRes.data : null;
  const settings = settingsRes.ok ? settingsRes.data : null;
  const nav = navRes.ok ? navRes.data : null;

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="sticky top-0 z-20 bg-white/80 backdrop-blur border-b">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            {settings?.logo?.url ? (
              <img src={settings.logo.url} alt={settings?.site_name || "Vintage Africana"} className="h-10 w-10 rounded object-cover border" />
            ) : (
              <div className="h-10 w-10 rounded bg-gray-100 border flex items-center justify-center text-xs font-semibold">
                VA
              </div>
            )}
            <div className="leading-tight">
              <div className="font-bold">{settings?.site_name || "Vintage Africana"}</div>
              <div className="text-xs text-gray-500">{settings?.tagline || "Curated African vintage, stories & collections."}</div>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-5 text-sm">
            {(nav?.items || []).slice(0, 6).map((it, idx) => (
              <Link key={idx} href={it.url} className="text-gray-700 hover:text-gray-900">
                {it.label}
              </Link>
            ))}
            <Link href="/admin" className="px-3 py-2 rounded border text-gray-800 hover:bg-gray-50">
              Admin
            </Link>
          </nav>

          <Link href="/admin" className="md:hidden px-3 py-2 rounded border text-sm">
            Admin
          </Link>
        </div>
      </header>

      {/* Hero */}
      <HomeHero
        enabled={!!homepage?.hero_enabled}
        title={homepage?.title || "Vintage Africana"}
        excerpt={homepage?.excerpt || settings?.tagline || "Curated African vintage, stories & collections."}
        heroAssetUrl={homepage?.hero_asset?.url || ""}
        coverUrl={homepage?.cover_image?.url || ""}
        ctaLabel={homepage?.hero_cta_label || "Explore Collections"}
        ctaUrl={homepage?.hero_cta_url || "/collections"}
        cmsReady={!!homepage}
      />

      {/* Main */}
      <main className="max-w-6xl mx-auto px-4 py-10 space-y-10">
        {/* CMS empty-state (IMPORTANT: never crash) */}
        {!homepage ? (
          <div className="border rounded-lg p-6 bg-gray-50">
            <div className="text-lg font-semibold">Homepage not configured yet</div>
            <p className="text-sm text-gray-600 mt-1">
              The public site layout is ready. You just need to create + publish a Homepage in the Admin panel.
            </p>
            <div className="mt-4 flex gap-3">
              <Link className="px-4 py-2 rounded bg-black text-white" href="/admin/homepage">
                Open Admin Homepage
              </Link>
              <Link className="px-4 py-2 rounded border" href="/admin/dashboard">
                Admin Dashboard
              </Link>
            </div>
          </div>
        ) : null}

        {/* CMS Blocks */}
        {homepage?.content?.length ? (
          <section className="space-y-6">
            <h2 className="text-xl font-bold">Featured</h2>
            <BlocksRenderer blocks={homepage.content} />
          </section>
        ) : (
          <section className="grid md:grid-cols-3 gap-6">
            {[
              { title: "Collections", desc: "Explore curated items with story and heritage.", href: "/collections" },
              { title: "Stories", desc: "Editorial storytelling around culture and vintage.", href: "/stories" },
              { title: "Experiences", desc: "Discover experiences inspired by Africana.", href: "/experiences" },
            ].map((c) => (
              <Link key={c.title} href={c.href} className="border rounded-lg p-6 hover:shadow transition">
                <div className="font-semibold">{c.title}</div>
                <div className="text-sm text-gray-600 mt-1">{c.desc}</div>
                <div className="text-sm mt-3 underline">Open</div>
              </Link>
            ))}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t">
        <div className="max-w-6xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-8">
          <div>
            <div className="font-bold">{settings?.site_name || "Vintage Africana"}</div>
            <div className="text-sm text-gray-600 mt-2">
              {settings?.tagline || "Curated African vintage, stories & collections."}
            </div>
          </div>

          <div>
            <div className="font-semibold">Links</div>
            <div className="mt-2 text-sm space-y-2">
              {(nav?.items || []).slice(0, 6).map((it, idx) => (
                <div key={idx}>
                  <Link href={it.url} className="text-gray-700 hover:underline">
                    {it.label}
                  </Link>
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="font-semibold">Social</div>
            <div className="mt-2 text-sm space-y-2">
              {settings?.instagram ? <a className="hover:underline" href={settings.instagram}>Instagram</a> : <div className="text-gray-400">Instagram not set</div>}
              {settings?.x_twitter ? <a className="hover:underline" href={settings.x_twitter}>X (Twitter)</a> : <div className="text-gray-400">X not set</div>}
              {settings?.facebook ? <a className="hover:underline" href={settings.facebook}>Facebook</a> : <div className="text-gray-400">Facebook not set</div>}
            </div>
          </div>
        </div>

        <div className="text-xs text-gray-500 py-4 text-center border-t">
          © {new Date().getFullYear()} Vintage Africana. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
