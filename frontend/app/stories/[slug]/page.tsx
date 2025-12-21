import { fetchStoryDetail } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({ params }: { params: { slug: string } }) {
  const story = await fetchStoryDetail(params.slug);
  return buildMetadata({
    title: story.title,
    excerpt: story.excerpt,
    seo_title: (story as any).seo_title,
    seo_description: (story as any).seo_description,
    canonical_url: (story as any).canonical_url,
    og_title: (story as any).og_title,
    og_description: (story as any).og_description,
    featured_image: (story as any).featured_image,
  });
}

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
