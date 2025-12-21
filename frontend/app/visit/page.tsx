import { fetchPageBySlug } from "@/lib/api";

export default async function VisitPage() {
  const page = await fetchPageBySlug("visit");

  return (
    <main>
      <h1>{page.title}</h1>
      {page.excerpt ? <p>{page.excerpt}</p> : null}
      {/* page.content is JSON blocks; block rendering will be implemented later */}
    </main>
  );
}
