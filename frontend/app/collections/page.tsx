import Link from "next/link";
import { fetchCollections } from "@/lib/api";

export default async function CollectionsPage() {
  const categories = await fetchCollections();

  return (
    <div>
      <h1>Collections</h1>
      <ul>
        {categories.map((cat) => (
          <li key={cat.slug}>
            <Link href={`/collections/${cat.slug}`}>
              {cat.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
