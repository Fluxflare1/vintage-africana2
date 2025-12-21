import { fetchPageBySlug } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";

export default async function GenericCmsPage({ params }: { params: { slug: string } }) {
  const page = await fetchPageBySlug(params.slug);
  const blocks = normalizeBlocks(page.content);

  return (
    <main className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{page.title}</h1>
        {page.excerpt ? <p className="text-muted-foreground">{page.excerpt}</p> : null}
      </div>

      <ContentRenderer blocks={blocks} />
    </main>
  );
}
