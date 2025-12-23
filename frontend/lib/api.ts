// frontend/lib/api.ts

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

export type StoryCategory = {
  name: string;
  slug: string;
};

export type Tag = {
  name: string;
  slug: string;
};

export type StoryList = {
  title: string;
  slug: string;
  excerpt?: string;
  published_at?: string;
  is_featured?: boolean;
  category?: StoryCategory | null;
  tags?: Tag[];
  featured_image?: { url?: string; external_url?: string } | null;
};

export type StoryDetail = {
  title: string;
  slug: string;
  excerpt?: string;
  content: any[];
  published_at?: string;
  is_featured?: boolean;
  category?: StoryCategory | null;
  tags?: Tag[];
  featured_image?: { url?: string; external_url?: string } | null;
  related_items?: { name: string; slug: string }[];
};

export type ExperienceList = {
  title: string;
  slug: string;
  type: string;
  summary?: string;
  starts_at?: string;
  ends_at?: string;
  location?: string;
  is_featured?: boolean;
  cover_image?: { url?: string; external_url?: string } | null;
};

export type ExperienceDetail = {
  title: string;
  slug: string;
  type: string;
  summary?: string;
  details: any[];
  starts_at?: string;
  ends_at?: string;
  location?: string;
  booking_url?: string;
  is_featured?: boolean;
  cover_image?: { url?: string; external_url?: string } | null;
};

export type CmsPage = {
  title: string;
  slug: string;
  excerpt?: string;
  content: any[];
  status?: string;
  published_at?: string;
  hero_image?: { url?: string; external_url?: string } | null;
  cover_image?: { url?: string; external_url?: string } | null;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  is_homepage?: boolean;
  hero_enabled?: boolean;
  hero_asset?: {
    type?: string;
    url?: string;
    external_url?: string;
    alt_text?: string;
  } | null;
  hero_cta_label?: string;
  hero_cta_url?: string;
};

function resolveBaseUrl(): string {
  // Browser
  if (typeof window !== "undefined") {
    return process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";
  }

  // Server (Docker)
  return process.env.INTERNAL_API_BASE_URL || "http://127.0.0.1:8000";
}

async function getJson<T>(path: string): Promise<T> {
  const url = `${resolveBaseUrl()}${path}`;

  const res = await fetch(url, {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`API ${res.status} ${path} :: ${body}`);
  }

  return res.json();
}

export const fetchSiteSettings = () => getJson<SiteSettings>("/api/settings/");
export const fetchNavigation = (code: string) =>
  getJson<NavigationMenu>(`/api/navigation/${code}/`);

export const fetchCollections = () =>
  getJson<CollectionCategory[]>("/api/collections/");

export const fetchItemsByCategory = (slug: string) =>
  getJson<VintageItemList[]>(`/api/collections/${slug}/`);

export const fetchItemDetail = (category: string, slug: string) =>
  getJson<VintageItemDetail>(`/api/collections/${category}/${slug}/`);

export const fetchStoryCategories = () =>
  getJson<StoryCategory[]>("/api/stories/categories/");

export const fetchStoryTags = () =>
  getJson<Tag[]>("/api/stories/tags/");

export const fetchStories = (params?: {
  category?: string;
  tag?: string;
  featured?: boolean;
}) => {
  const qs = new URLSearchParams();
  if (params?.category) qs.set("category", params.category);
  if (params?.tag) qs.set("tag", params.tag);
  if (params?.featured) qs.set("featured", "true");
  return getJson<StoryList[]>(`/api/stories/?${qs.toString()}`);
};

export const fetchStoryDetail = (slug: string) =>
  getJson<StoryDetail>(`/api/stories/${slug}/`);

export const fetchExperiences = (params?: {
  type?: string;
  featured?: boolean;
}) => {
  const qs = new URLSearchParams();
  if (params?.type) qs.set("type", params.type);
  if (params?.featured) qs.set("featured", "true");
  return getJson<ExperienceList[]>(`/api/experiences/?${qs.toString()}`);
};

export const fetchExperienceDetail = (slug: string) =>
  getJson<ExperienceDetail>(`/api/experiences/${slug}/`);

export const fetchHomepage = () =>
  getJson<CmsPage>("/api/pages/home/");

export const fetchPageBySlug = (slug: string) =>
  getJson<CmsPage>(`/api/pages/${slug}/`);
