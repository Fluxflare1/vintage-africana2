import Link from "next/link";
import type { NavigationMenu, SiteSettings } from "@/lib/api";

export function SiteHeader({ settings, menu }: { settings: SiteSettings; menu: NavigationMenu | null }) {
  return (
    <header style={{ padding: 16, borderBottom: "1px solid #e5e5e5" }}>
      <div style={{ display: "flex", gap: 16, alignItems: "center", justifyContent: "space-between" }}>
        <Link href="/" style={{ fontWeight: 700, textDecoration: "none", color: "inherit" }}>
          {settings.site_name || "Vintage Africana"}
        </Link>

        <nav style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          {(menu?.items || []).map((item) => (
            <Link key={`${item.label}-${item.url}`} href={item.url} style={{ textDecoration: "none", color: "inherit" }}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
