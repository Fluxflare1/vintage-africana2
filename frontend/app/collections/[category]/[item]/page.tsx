import { fetchItemDetail } from "@/lib/api";
import { ContentRenderer } from "@/components/content/renderer";
import { normalizeBlocks } from "@/components/content/blocks";
import { buildMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: { category: string; item: string };
}) {
  const item = await fetchItemDetail(params.category, params.item);
  return buildMetadata({
    title: item.name,
    excerpt: item.item_type || (item as any).short_description || "",
    seo_title: (item as any).seo_title,
    seo_description: (item as any).seo_description,
    canonical_url: (item as any).canonical_url,
    cover_image: item.cover_image,
  });
}

export default async function ItemDetailPage({
  params,
}: {
  params: { category: string; item: string };
}) {
  const item = await fetchItemDetail(params.category, params.item);
  const blocks = normalizeBlocks(item.story);

  return (
    <article className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{item.name}</h1>
        <div className="text-sm text-muted-foreground space-y-1">
          {item.year ? <div>Year: {item.year}</div> : null}
          {item.era_label ? <div>Era: {item.era_label}</div> : null}
          {item.origin_country ? <div>Origin: {item.origin_country}</div> : null}
          {item.condition ? <div>Condition: {item.condition}</div> : null}
        </div>
      </header>

      <ContentRenderer blocks={blocks} />
    </article>
  );
}
