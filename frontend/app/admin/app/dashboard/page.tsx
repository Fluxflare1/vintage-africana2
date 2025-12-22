import { fetchAdminMe } from "@/lib/admin-auth";

export default async function AdminDashboard() {
  const user = await fetchAdminMe();

  return (
    <>
      <h1>Dashboard</h1>
      <p>Logged in as: {user?.email}</p>
      <p>No metrics available yet.</p>
    </>
  );
}
