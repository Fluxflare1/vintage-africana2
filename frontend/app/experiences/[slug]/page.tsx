import { fetchExperienceDetail } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";

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
