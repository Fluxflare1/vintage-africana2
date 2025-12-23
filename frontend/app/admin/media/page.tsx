import MediaAdminClient from "@/components/admin/MediaAdminClient";

export default function AdminMediaPage() {
  return (
    <main className="space-y-4 max-w-5xl">
      <h1 className="text-2xl font-bold">Media Library</h1>
      <MediaAdminClient />
    </main>
  );
}
