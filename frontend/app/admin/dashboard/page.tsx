import Link from "next/link";

async function getMe() {
  const res = await fetch("http://127.0.0.1:8000/api/admin/me/", {
    cache: "no-store",
    credentials: "include",
  }).catch(() => null);

  // NOTE: In browser navigation this should hit same-origin.
  // For server rendering in dev, it may not carry cookies.
  return res;
}

export default async function AdminDashboard() {
  // Minimal dashboard (no hard auth enforcement yet in SSR)
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>

      <div className="space-y-2">
        <Link className="underline" href="/admin/pages">Pages</Link>
        <br />
        <Link className="underline" href="/admin/settings">Site Settings</Link>
      </div>

      <form action="/api/admin/logout/" method="post">
        <button className="border px-3 py-2 rounded" type="submit">
          Logout
        </button>
      </form>
    </main>
  );
}
