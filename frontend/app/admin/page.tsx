import Link from "next/link";

export default function AdminLanding() {
  return (
    <main className="space-y-4">
      <h1 className="text-3xl font-bold tracking-tight">Admin Panel</h1>
      <p className="text-muted-foreground">
        Manage pages, navigation, and site settings.
      </p>

      <div className="flex gap-3">
        <Link className="underline" href="/admin/login">Login</Link>
        <Link className="underline" href="/">Back to site</Link>
      </div>
    </main>
  );
}
