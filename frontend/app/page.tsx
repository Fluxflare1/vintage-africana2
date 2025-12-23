import { fetchHomepage } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";
import { HeroSection } from "@/components/hero";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata() {
  try {
    const page = await fetchHomepage();
    return buildMetadata({
      title: page.title,
      excerpt: page.excerpt,
      seo_title: page.seo_title,
      seo_description: page.seo_description,
      canonical_url: page.canonical_url,
      og_title: page.og_title,
      og_description: page.og_description,
      hero_asset: page.hero_asset,
      cover_image: page.cover_image,
    });
  } catch {
    // Fallback metadata if homepage not configured yet
    return {
      title: "Vintage Africana",
      description: "Vintage Africana website",
    };
  }
}

export default async function HomePage() {
  try {
    const page = await fetchHomepage();
    const blocks = normalizeBlocks(page.content);

    return (
      <main className="space-y-8">
        <HeroSection
          title={page.title}
          subtitle={page.excerpt}
          heroEnabled={page.hero_enabled}
          heroAsset={page.hero_asset}
          ctaLabel={page.hero_cta_label}
          ctaUrl={page.hero_cta_url}
        />

        {!page.hero_enabled ? (
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
            {page.excerpt ? <p className="text-muted-foreground">{page.excerpt}</p> : null}
          </div>
        ) : null}

        <ContentRenderer blocks={blocks} />
      </main>
    );
  } catch (err: any) {
    // Homepage missing (404) or API down: render a safe fallback instead of crashing
    return (
      <main className="space-y-4" style={{ padding: 24 }}>
        <h1 className="text-3xl font-bold tracking-tight">Vintage Africana</h1>
        <p className="text-muted-foreground">
          The homepage isn’t configured yet. Please create and publish a homepage in the admin.
        </p>
      </main>
    );
  }
}
