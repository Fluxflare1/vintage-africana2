import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { fetchAdminMe } from "@/lib/admin-auth";
import { requireAdmin } from "@/lib/require-admin";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check session cookie first
  const auth = cookies().get("sessionid");
  if (!auth) {
    return <meta httpEquiv="refresh" content="0; url=/admin/login" />;
  }

  // Then verify user via API
  const user = await fetchAdminMe();
  if (!user) {
    redirect("/admin/login");
  }

  // Additional admin permission check
  const ok = await requireAdmin();
  if (!ok) return <h1>403 — Admin Only</h1>;

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 260, background: "#0f172a", color: "#fff" }}>
        <h3 style={{ padding: 16 }}>Admin</h3>
        <nav style={{ display: "flex", flexDirection: "column", gap: 8, padding: 16 }}>
          <a href="/admin/app/dashboard">Dashboard</a>
          <a href="/admin/app/pages">Pages</a>
          <a href="/admin/app/stories">Stories</a>
          <a href="/admin/app/collections">Collections</a>
          <a href="/admin/app/media">Media Library</a>
          <a href="/admin/app/settings">Site Settings</a>
        </nav>
      </aside>

      {/* Main */}
      <div style={{ flex: 1 }}>
        {/* Header */}
        <header
          style={{
            height: 60,
            borderBottom: "1px solid #ddd",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 16px",
          }}
        >
          <span>Vintage Africana</span>
          <form action="/admin/logout" method="post">
            <button>Logout</button>
          </form>
        </header>

        <main style={{ padding: 24 }}>{children}</main>
      </div>
    </div>
  );
}
