import { redirect } from "next/navigation";
import { fetchAdminMe } from "@/lib/admin-auth";

export default async function AdminLanding() {
  const user = await fetchAdminMe();

  if (user) {
    redirect("/admin/app/dashboard");
  }

  return (
    <main style={{ height: "100vh", display: "grid", placeItems: "center" }}>
      <div style={{ textAlign: "center" }}>
        <h1>Vintage Africana Admin</h1>
        <a href="/admin/login">Login</a>
      </div>
    </main>
  );
}
