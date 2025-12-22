import { adminStories } from "@/lib/admin-api";

export default async function AdminStories() {
  const stories = await adminStories.list();

  return (
    <>
      <h1>Stories</h1>
      <ul>
        {stories.map((s) => (
          <li key={s.slug}>{s.title}</li>
        ))}
      </ul>
    </>
  );
}
