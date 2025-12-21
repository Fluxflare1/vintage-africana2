import { fetchPageBySlug } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";
import { HeroSection } from "@/components/hero";

export default async function VisitPage() {
  const page = await fetchPageBySlug("visit");
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
}
