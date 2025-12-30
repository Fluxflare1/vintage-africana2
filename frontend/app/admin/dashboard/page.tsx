import Link from "next/link";

export default function AdminDashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p className="text-gray-600">
        Manage your website content and settings.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <DashboardCard
          title="Pages"
          desc="Create and manage site pages"
          href="/admin/pages"
        />
        <DashboardCard
          title="Homepage"
          desc="Hero, cover image, and homepage content"
          href="/admin/homepage"
        />
        <DashboardCard
          title="Navigation"
          desc="Menus and site links"
          href="/admin/navigation"
        />
        <DashboardCard
          title="Site Settings"
          desc="Logo, SEO, contact info"
          href="/admin/settings"
        />
        <DashboardCard
          title="Media Library"
          desc="Upload and manage images"
          href="/admin/media"
        />
      </div>
    </div>
  );
}

function DashboardCard({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="border bg-white rounded-lg p-5 hover:shadow transition block"
    >
      <div className="font-semibold text-lg">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
    </Link>
  );
}
