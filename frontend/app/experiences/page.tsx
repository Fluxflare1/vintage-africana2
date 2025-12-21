import Link from "next/link";
import { fetchExperiences } from "@/lib/api";

export default async function ExperiencesPage() {
  const experiences = await fetchExperiences();

  return (
    <div>
      <h1>Experiences</h1>
      <ul>
        {experiences.map((e) => (
          <li key={e.slug}>
            <Link href={`/experiences/${e.slug}`}>{e.title}</Link>
            {e.summary ? <p>{e.summary}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
