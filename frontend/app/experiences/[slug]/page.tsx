import { fetchExperienceDetail } from "@/lib/api";

export default async function ExperienceDetailPage({ params }: { params: { slug: string } }) {
  const exp = await fetchExperienceDetail(params.slug);

  return (
    <article>
      <h1>{exp.title}</h1>
      {exp.summary ? <p>{exp.summary}</p> : null}
      {/* details is JSON blocks; rendering will be implemented later */}
    </article>
  );
}
