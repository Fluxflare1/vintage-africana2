import { adminCollections } from "@/lib/admin-api";

export default async function AdminCollections() {
  const collections = await adminCollections.list();

  return (
    <>
      <h1>Collections</h1>
      <ul>
        {collections.map((c) => (
          <li key={c.slug}>{c.name}</li>
        ))}
      </ul>
    </>
  );
}
