"use client";

import { useEffect, useState } from "react";
import { adminSettings } from "@/lib/admin-api";

export default function AdminSettings() {
  const [settings, setSettings] = useState<any>(null);

  useEffect(() => {
    adminSettings.get().then(setSettings);
  }, []);

  if (!settings) return null;

  async function save() {
    await adminSettings.update(settings);
    alert("Settings saved");
  }

  return (
    <>
      <h1>Site Settings</h1>
      <input
        value={settings.site_name}
        onChange={(e) =>
          setSettings({ ...settings, site_name: e.target.value })
        }
      />
      <input
        value={settings.tagline}
        onChange={(e) =>
          setSettings({ ...settings, tagline: e.target.value })
        }
      />
      <button onClick={save}>Save</button>
    </>
  );
}
