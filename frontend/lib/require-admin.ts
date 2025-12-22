export async function requireAdmin() {
  const res = await fetch("/api/me", { credentials: "include" });
  if (!res.ok) return false;
  const u = await res.json();
  return u.role === "admin";
}
