"use client";

import { useEffect, useState } from "react";

type MenuItem = { label: string; url: string; order: number };
type Menu = { id: number; code?: string; title: string; items: MenuItem[] };

export default function AdminNavigation() {
  const [menus, setMenus] = useState<Menu[]>([]);
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  const activeMenu = menus.find((m) => m.id === activeMenuId) || null;

  async function load() {
    setErr(null);
    const res = await fetch("/api/admin/menus/", { credentials: "include" });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Failed to load menus"));
      return;
    }
    const data = await res.json();
    setMenus(data);
    if (data.length && activeMenuId === null) setActiveMenuId(data[0].id);
  }

  async function saveMenu(menu: Menu) {
    setErr(null);
    const res = await fetch(`/api/admin/menus/${menu.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ items: menu.items }),
    });
    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      return;
    }
    await load();
  }

  function updateItem(idx: number, patch: Partial<MenuItem>) {
    if (!activeMenu) return;
    const nextMenus = menus.map((m) => {
      if (m.id !== activeMenu.id) return m;
      const items = [...m.items];
      items[idx] = { ...items[idx], ...patch };
      return { ...m, items };
    });
    setMenus(nextMenus);
  }

  function addItem() {
    if (!activeMenu) return;
    const nextMenus = menus.map((m) => {
      if (m.id !== activeMenu.id) return m;
      const nextOrder = (m.items?.length || 0) + 1;
      return { ...m, items: [...m.items, { label: "", url: "", order: nextOrder }] };
    });
    setMenus(nextMenus);
  }

  function removeItem(idx: number) {
    if (!activeMenu) return;
    const nextMenus = menus.map((m) => {
      if (m.id !== activeMenu.id) return m;
      const items = m.items.filter((_, i) => i !== idx).map((it, i) => ({ ...it, order: i + 1 }));
      return { ...m, items };
    });
    setMenus(nextMenus);
  }

  function move(idx: number, dir: -1 | 1) {
    if (!activeMenu) return;
    const nextMenus = menus.map((m) => {
      if (m.id !== activeMenu.id) return m;
      const items = [...m.items];
      const ni = idx + dir;
      if (ni < 0 || ni >= items.length) return m;
      const tmp = items[idx];
      items[idx] = items[ni];
      items[ni] = tmp;
      const reOrdered = items.map((it, i) => ({ ...it, order: i + 1 }));
      return { ...m, items: reOrdered };
    });
    setMenus(nextMenus);
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <main className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Navigation</h1>
      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="flex gap-2">
        {menus.map((m) => (
          <button
            key={m.id}
            className={`border px-3 py-2 rounded ${m.id === activeMenuId ? "font-bold" : ""}`}
            onClick={() => setActiveMenuId(m.id)}
          >
            {m.title}
          </button>
        ))}
      </div>

      {!activeMenu ? (
        <p>No menus found.</p>
      ) : (
        <div className="border rounded p-3 space-y-3">
          <div className="flex justify-between items-center">
            <div>
              <div className="font-semibold">{activeMenu.title}</div>
              <div className="text-sm text-muted-foreground">{activeMenu.code ? `code: ${activeMenu.code}` : ""}</div>
            </div>
            <button className="border px-3 py-2 rounded" onClick={addItem}>
              + Add item
            </button>
          </div>

          <div className="space-y-2">
            {activeMenu.items.map((it, idx) => (
              <div key={idx} className="border rounded p-3 space-y-2">
                <div className="flex gap-2">
                  <input
                    className="border p-2 rounded w-1/2"
                    value={it.label}
                    onChange={(e) => updateItem(idx, { label: e.target.value })}
                    placeholder="Label (e.g. Collections)"
                  />
                  <input
                    className="border p-2 rounded w-1/2"
                    value={it.url}
                    onChange={(e) => updateItem(idx, { url: e.target.value })}
                    placeholder="URL (e.g. /collections)"
                  />
                </div>

                <div className="flex gap-2 text-sm">
                  <button className="border px-2 py-1 rounded" onClick={() => move(idx, -1)}>↑</button>
                  <button className="border px-2 py-1 rounded" onClick={() => move(idx, 1)}>↓</button>
                  <button className="text-red-600 underline" onClick={() => removeItem(idx)}>Remove</button>
                </div>
              </div>
            ))}
          </div>

          <button className="border px-4 py-2 rounded" onClick={() => saveMenu(activeMenu)}>
            Save Menu
          </button>
        </div>
      )}
    </main>
  );
}
