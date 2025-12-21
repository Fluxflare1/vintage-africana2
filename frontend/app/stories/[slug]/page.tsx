import { fetchStoryDetail } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";

export default async function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = await fetchStoryDetail(params.slug);
  const blocks = normalizeBlocks(story.content);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{story.title}</h1>
        {story.excerpt ? <p className="text-muted-foreground">{story.excerpt}</p> : null}
      </header>

      <ContentRenderer blocks={blocks} />
    </article>
  );
}
