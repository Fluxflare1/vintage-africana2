import Link from "next/link";

function Card({
  title,
  desc,
  href,
}: {
  title: string;
  desc: string;
  href: string;
}) {
  return (
    <Link href={href} className="block rounded border bg-white p-4 hover:shadow-sm">
      <div className="font-semibold">{title}</div>
      <div className="text-sm text-gray-600 mt-1">{desc}</div>
      <div className="text-sm underline mt-3">Open</div>
    </Link>
  );
}

export default function AdminDashboard() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-gray-600">
          Manage content, navigation, settings, and media.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          title="Pages"
          desc="Create and edit website pages (Homepage, About, etc.)"
          href="/admin/pages"
        />
        <Card
          title="Navigation"
          desc="Manage header/footer menus and links"
          href="/admin/navigation"
        />
        <Card
          title="Settings"
          desc="Site identity, SEO defaults, social links, logo/favicon"
          href="/admin/settings"
        />
        <Card
          title="Media Library"
          desc="Upload and pick images used across the site"
          href="/admin/media"
        />
        <Card
          title="Homepage (Hero)"
          desc="Edit homepage hero section and layout"
          href="/admin/homepage"
        />
      </div>

      <div className="pt-4 border-t">
        <Link className="underline" href="/admin/setup">Setup</Link>
      </div>
    </div>
  );
}
