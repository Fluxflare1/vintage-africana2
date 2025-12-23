// frontend/app/admin/layout.tsx
import type { ReactNode } from "react";
import Link from "next/link";

export const metadata = {
  title: "Admin | Vintage Africana",
};

const NavItem = ({ href, label }: { href: string; label: string }) => (
  <Link
    href={href}
    className="block rounded px-3 py-2 hover:bg-gray-100"
  >
    {label}
  </Link>
);

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Topbar */}
      <header className="border-b bg-white">
        <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
          <div className="font-semibold">Vintage Africana • Admin</div>
          <div className="flex gap-3 text-sm">
            <Link className="underline" href="/">
              View site
            </Link>
            <Link className="underline" href="/admin/login">
              Login
            </Link>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="mx-auto max-w-6xl px-4 py-6 grid grid-cols-12 gap-6">
        {/* Sidebar */}
        <aside className="col-span-12 md:col-span-3">
          <div className="rounded border bg-white p-3 space-y-1">
            <div className="text-xs text-gray-500 px-2 pb-2">ADMIN MENU</div>
            <NavItem href="/admin/dashboard" label="Dashboard" />
            <NavItem href="/admin/pages" label="Pages" />
            <NavItem href="/admin/navigation" label="Navigation" />
            <NavItem href="/admin/settings" label="Settings" />
            <NavItem href="/admin/media" label="Media Library" />
          </div>
        </aside>

        {/* Main */}
        <main className="col-span-12 md:col-span-9">{children}</main>
      </div>
    </div>
  );
}
