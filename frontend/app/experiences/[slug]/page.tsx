import { fetchExperienceDetail } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const exp = await fetchExperienceDetail(params.slug);
  return buildMetadata({
    title: exp.title,
    excerpt: exp.summary,
    seo_title: (exp as any).seo_title,
    seo_description: (exp as any).seo_description,
    canonical_url: (exp as any).canonical_url,
    cover_image: exp.cover_image,
  });
}

export default async function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const exp = await fetchExperienceDetail(params.slug);
  const blocks = normalizeBlocks(exp.details);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{exp.title}</h1>
        {exp.summary ? <p className="text-muted-foreground">{exp.summary}</p> : null}
      </header>

      <ContentRenderer blocks={blocks} />
    </article>
  );
}
