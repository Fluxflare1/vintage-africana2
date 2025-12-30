// frontend/app/admin/layout.tsx
import Link from "next/link";

export const metadata = {
  title: "Admin | Vintage Africana",
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900">
        <div className="min-h-screen flex">
          {/* Sidebar */}
          <aside className="w-64 bg-white border-r px-4 py-6 hidden md:block">
            <div className="text-xl font-bold mb-6">Vintage Africana</div>

            <nav className="space-y-2 text-sm">
              <Link href="/admin/dashboard" className="block px-3 py-2 rounded hover:bg-gray-100">
                Dashboard
              </Link>
              <Link href="/admin/pages" className="block px-3 py-2 rounded hover:bg-gray-100">
                Pages
              </Link>
              <Link href="/admin/homepage" className="block px-3 py-2 rounded hover:bg-gray-100">
                Homepage
              </Link>
              <Link href="/admin/navigation" className="block px-3 py-2 rounded hover:bg-gray-100">
                Navigation
              </Link>
              <Link href="/admin/settings" className="block px-3 py-2 rounded hover:bg-gray-100">
                Site Settings
              </Link>
              <Link href="/admin/media" className="block px-3 py-2 rounded hover:bg-gray-100">
                Media Library
              </Link>
            </nav>
          </aside>

          {/* Main */}
          <div className="flex-1 flex flex-col">
            {/* Top bar */}
            <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
              <div className="font-semibold">Admin Panel</div>
              <Link
                href="/"
                className="text-sm text-gray-600 hover:underline"
              >
                View Site
              </Link>
            </header>

            {/* Content */}
            <main className="flex-1 p-6">{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}
