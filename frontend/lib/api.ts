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

export type CollectionCategory = {
  name: string;
  slug: string;
  description?: string;
  cover_image?: { url?: string; external_url?: string } | null;
};

export type VintageItemList = {
  name: string;
  slug: string;
  short_description?: string;
  year?: number;
  era_label?: string;
  condition?: string;
  cover_image?: { url?: string; external_url?: string } | null;
};

export type VintageItemDetail = {
  name: string;
  slug: string;
  story: any[];
  item_type?: string;
  brand?: string;
  model?: string;
  year?: number;
  era_label?: string;
  origin_country?: string;
  condition?: string;
  cover_image?: { url?: string; external_url?: string } | null;
  media?: { asset?: { url?: string; external_url?: string } }[];
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

export function fetchCollections() {
  return getJson<CollectionCategory[]>("/api/collections/");
}

export function fetchItemsByCategory(slug: string) {
  return getJson<VintageItemList[]>(`/api/collections/${slug}/`);
}

export function fetchItemDetail(category: string, slug: string) {
  return getJson<VintageItemDetail>(`/api/collections/${category}/${slug}/`);
}
