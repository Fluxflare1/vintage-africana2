// frontend/app/admin/page.tsx
import Link from "next/link";

export default function AdminLanding() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold">Admin</h1>
        <p className="text-sm text-gray-600">
          Login first, then proceed to dashboard to manage the website.
        </p>
      </div>

      <div className="flex gap-3">
        <Link className="border px-4 py-2 rounded bg-white hover:bg-gray-100" href="/admin/login">
          Login
        </Link>
        <Link className="border px-4 py-2 rounded bg-white hover:bg-gray-100" href="/admin/dashboard">
          Dashboard
        </Link>
        <Link className="underline self-center" href="/">
          Back to site
        </Link>
      </div>
    </div>
  );
}
