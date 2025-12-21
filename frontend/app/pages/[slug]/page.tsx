import { fetchPageBySlug } from "@/lib/api";

export default async function GenericCmsPage({ params }: { params: { slug: string } }) {
  const page = await fetchPageBySlug(params.slug);

  return (
    <main>
      <h1>{page.title}</h1>
      {page.excerpt ? <p>{page.excerpt}</p> : null}
      {/* page.content is JSON blocks; block rendering will be implemented later */}
    </main>
  );
}
