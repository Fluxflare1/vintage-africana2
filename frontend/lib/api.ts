type ApiMenuItem = {
  label: string;
  url: string;
  order: number;
  children?: ApiMenuItem[];
};

export type SiteSettings = {
  site_name: string;
  tagline: string;
  logo?: { url?: string; external_url?: string } | null;
  instagram?: string;
  x_twitter?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
};

export type NavigationMenu = {
  code: string;
  title: string;
  items: ApiMenuItem[];
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8000";

async function getJson<T>(path: string): Promise<T> {
  const res = await fetch(`${baseUrl}${path}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`API error ${res.status} for ${path}`);
  return res.json();
}

export function fetchSiteSettings() {
  return getJson<SiteSettings>("/api/settings/");
}

export function fetchNavigation(code: string) {
  return getJson<NavigationMenu>(`/api/navigation/${code}/`);
}
