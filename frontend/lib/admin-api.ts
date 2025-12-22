const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

async function request<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    cache: "no-store",
    ...options,
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}`);
  }

  return res.json();
}

/* PAGES */
export const adminPages = {
  list: () => request<any[]>("/api/pages/"),
  detail: (slug: string) => request<any>(`/api/pages/${slug}/`),
  create: (data: any) =>
    request("/api/pages/", { method: "POST", body: JSON.stringify(data) }),
  update: (slug: string, data: any) =>
    request(`/api/pages/${slug}/`, {
      method: "PUT",
      body: JSON.stringify(data),
    }),
};

/* STORIES */
export const adminStories = {
  list: () => request<any[]>("/api/stories/"),
  detail: (slug: string) => request<any>(`/api/stories/${slug}/`),
};

/* COLLECTIONS */
export const adminCollections = {
  list: () => request<any[]>("/api/collections/"),
};

/* MEDIA */
export const adminMedia = {
  list: () => request<any[]>("/api/media/"),
};

/* SETTINGS */
export const adminSettings = {
  get: () => request("/api/settings/"),
  update: (data: any) =>
    request("/api/settings/", { method: "PUT", body: JSON.stringify(data) }),
};
