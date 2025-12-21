import Link from "next/link";
import type { NavigationMenu, SiteSettings } from "@/lib/api";

export function SiteFooter({ settings, menu }: { settings: SiteSettings; menu: NavigationMenu | null }) {
  return (
    <footer style={{ padding: 16, borderTop: "1px solid #e5e5e5", marginTop: 24 }}>
      <div style={{ display: "flex", gap: 16, justifyContent: "space-between", flexWrap: "wrap" }}>
        <div>
          <div style={{ fontWeight: 700 }}>{settings.site_name || "Vintage Africana"}</div>
          {settings.tagline ? <div style={{ opacity: 0.8 }}>{settings.tagline}</div> : null}
          <div style={{ marginTop: 8, opacity: 0.8 }}>
            {settings.contact_email ? <div>{settings.contact_email}</div> : null}
            {settings.contact_phone ? <div>{settings.contact_phone}</div> : null}
            {settings.address ? <div>{settings.address}</div> : null}
          </div>
        </div>

        <div>
          <div style={{ fontWeight: 700, marginBottom: 8 }}>{menu?.title || "Links"}</div>
          <div style={{ display: "grid", gap: 6 }}>
            {(menu?.items || []).map((item) => (
              <Link key={`${item.label}-${item.url}`} href={item.url} style={{ textDecoration: "none", color: "inherit" }}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <div style={{ marginTop: 16, opacity: 0.7 }}>
        © {new Date().getFullYear()} {settings.site_name || "Vintage Africana"}
      </div>
    </footer>
  );
}
