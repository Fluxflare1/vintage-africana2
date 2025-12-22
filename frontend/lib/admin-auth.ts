export type AdminUser = {
  id: number;
  email: string;
  is_staff: boolean;
  is_superuser: boolean;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export async function fetchAdminMe(): Promise<AdminUser | null> {
  const res = await fetch(`${API_BASE}/api/auth/me/`, {
    credentials: "include",
    cache: "no-store",
  });

  if (!res.ok) return null;
  return res.json();
}
