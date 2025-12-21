import Link from "next/link";
import { fetchStories } from "@/lib/api";

export default async function StoriesPage() {
  const stories = await fetchStories();

  return (
    <div>
      <h1>Stories</h1>
      <ul>
        {stories.map((s) => (
          <li key={s.slug}>
            <Link href={`/stories/${s.slug}`}>{s.title}</Link>
            {s.excerpt ? <p>{s.excerpt}</p> : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
