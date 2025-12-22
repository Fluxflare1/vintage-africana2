import { redirect } from "next/navigation";
import { fetchAdminMe } from "@/lib/admin-auth";

export default async function AdminAppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await fetchAdminMe();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: "#111", color: "#fff" }}>
        <h3 style={{ padding: 16 }}>Admin</h3>
        <nav>
          <a href="/admin/app/dashboard">Dashboard</a>
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
