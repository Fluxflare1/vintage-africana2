import Link from "next/link";

async function fetchPages() {
  const res = await fetch("http://127.0.0.1:8000/api/admin/pages/", {
    cache: "no-store",
    credentials: "include",
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function AdminPages() {
  const pages = await fetchPages();

  return (
    <main className="space-y-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Pages</h1>
        <Link className="underline" href="/admin/pages/new">New Page</Link>
      </div>

      <ul className="space-y-2">
        {pages.map((p: any) => (
          <li key={p.id} className="border rounded p-3">
            <div className="font-semibold">{p.title}</div>
            <div className="text-sm text-muted-foreground">/{p.slug} • {p.status}</div>
            <div className="mt-2">
              <Link className="underline" href={`/admin/pages/${p.id}`}>Edit</Link>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
