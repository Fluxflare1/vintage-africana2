type SeoInput = {
  title?: string;
  excerpt?: string;
  seo_title?: string;
  seo_description?: string;
  canonical_url?: string;
  og_title?: string;
  og_description?: string;
  hero_asset?: { url?: string; external_url?: string } | null;
  featured_image?: { url?: string; external_url?: string } | null;
  cover_image?: { url?: string; external_url?: string } | null;
};

function pickImageUrl(input?: { url?: string; external_url?: string } | null): string | undefined {
  return input?.url || input?.external_url || undefined;
}

export function buildMetadata(input: SeoInput) {
  const title = input.seo_title || input.title || "Vintage Africana";
  const description = input.seo_description || input.excerpt || "Vintage Africana";

  const image =
    pickImageUrl(input.cover_image) ||
    pickImageUrl(input.featured_image) ||
    pickImageUrl(input.hero_asset);

  const ogTitle = input.og_title || title;
  const ogDescription = input.og_description || description;

  const canonical = input.canonical_url || undefined;

  return {
    title,
    description,
    alternates: canonical ? { canonical } : undefined,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      images: image ? [{ url: image }] : undefined,
    },
  };
}
