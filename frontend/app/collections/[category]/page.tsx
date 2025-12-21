import Link from "next/link";
import { fetchItemsByCategory } from "@/lib/api";

export default async function CategoryPage({ params }: { params: { category: string } }) {
  const items = await fetchItemsByCategory(params.category);

  return (
    <div>
      <h1>{params.category}</h1>
      <ul>
        {items.map((item) => (
          <li key={item.slug}>
            <Link href={`/collections/${params.category}/${item.slug}`}>
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
