import "./globals.css";
import { fetchNavigation, fetchSiteSettings } from "@/lib/api";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata = {
  title: "Vintage Africana",
  description: "Vintage Africana website",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await fetchSiteSettings().catch(() => ({ site_name: "Vintage Africana", tagline: "" }));
  const headerMenu = await fetchNavigation("header").catch(() => null);
  const footerMenu = await fetchNavigation("footer").catch(() => null);

  return (
    <html lang="en">
      <body>
        <SiteHeader settings={settings} menu={headerMenu} />
        <main style={{ padding: 24 }}>{children}</main>
        <SiteFooter settings={settings} menu={footerMenu} />
      </body>
    </html>
  );
}
