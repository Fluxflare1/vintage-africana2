import SetupClient from "@/components/admin/SetupClient";

export default function AdminSetupPage() {
  return (
    <main className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Setup</h1>
      <p className="text-sm text-muted-foreground">
        One click creates default Settings, Menus, and a published Homepage.
      </p>
      <SetupClient />
    </main>
  );
}
