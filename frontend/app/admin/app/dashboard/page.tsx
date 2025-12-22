import { fetchAdminMe } from "@/lib/admin-auth";

async function count(path: string) {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  const res = await fetch(`${API}${path}`, { cache: "no-store" });
  const data = await res.json();
  return data.length;
}

export default async function AdminDashboard() {
  const user = await fetchAdminMe();
  
  const [pages, stories, collections] = await Promise.all([
    count("/api/pages/"),
    count("/api/stories/"),
    count("/api/collections/"),
  ]);

  return (
    <>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <p>Pages: {pages}</p>
      <p>Stories: {stories}</p>
      <p>Collections: {collections}</p>
    </>
  );
}
