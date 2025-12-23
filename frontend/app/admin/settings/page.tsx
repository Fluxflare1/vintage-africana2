import SettingsClient from "@/components/admin/SettingsClient";

export default function AdminSettingsPage() {
  return (
    <main className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Settings</h1>
      <SettingsClient />
    </main>
  );
}
