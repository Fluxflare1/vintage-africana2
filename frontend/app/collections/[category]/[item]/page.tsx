import { fetchItemDetail } from "@/lib/api";

export default async function ItemDetailPage({
  params,
}: {
  params: { category: string; item: string };
}) {
  const item = await fetchItemDetail(params.category, params.item);

  return (
    <article>
      <h1>{item.name}</h1>
      {item.year ? <p>Year: {item.year}</p> : null}
      {item.origin_country ? <p>Origin: {item.origin_country}</p> : null}
    </article>
  );
}
