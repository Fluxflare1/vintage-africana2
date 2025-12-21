import { fetchStoryDetail } from "@/lib/api";

export default async function StoryDetailPage({ params }: { params: { slug: string } }) {
  const story = await fetchStoryDetail(params.slug);

  return (
    <article>
      <h1>{story.title}</h1>
      {story.excerpt ? <p>{story.excerpt}</p> : null}
      {/* content is JSON blocks; rendering will be implemented later */}
    </article>
  );
}
