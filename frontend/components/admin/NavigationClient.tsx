"use client";

import { useEffect, useState } from "react";

type Menu = any;
type Item = any;

export default function NavigationClient() {
  const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

  const [menus, setMenus] = useState<Menu[]>([]);
  const [selectedMenuId, setSelectedMenuId] = useState<number | null>(null);
  const [items, setItems] = useState<Item[]>([]);
  const [err, setErr] = useState<string | null>(null);

  async function loadMenus() {
    setErr(null);
    const res = await fetch(`${API}/api/admin/navigation/menus/`, { credentials: "include", cache: "no-store" });
    if (!res.ok) { setErr(await res.text().catch(() => "Failed to load menus")); return; }
    const data = await res.json();
    setMenus(data);
    if (!selectedMenuId && data?.length) setSelectedMenuId(data[0].id);
  }

  async function loadItems(menuId: number) {
    setErr(null);
    const res = await fetch(`${API}/api/admin/navigation/menus/${menuId}/items/`, { credentials: "include", cache: "no-store" });
    if (!res.ok) { setErr(await res.text().catch(() => "Failed to load items")); return; }
    setItems(await res.json());
  }

  useEffect(() => { loadMenus(); }, []);
  useEffect(() => { if (selectedMenuId) loadItems(selectedMenuId); }, [selectedMenuId]);

  async function createMenu() {
    setErr(null);
    const res = await fetch(`${API}/api/admin/navigation/menus/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ title: "Main Menu" }),
    });
    if (!res.ok) { setErr(await res.text().catch(() => "Create menu failed")); return; }
    await loadMenus();
  }

  async function addItem() {
    if (!selectedMenuId) return;
    setErr(null);
    const res = await fetch(`${API}/api/admin/navigation/menus/${selectedMenuId}/items/`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ label: "New link", url: "/", order: items.length + 1 }),
    });
    if (!res.ok) { setErr(await res.text().catch(() => "Add item failed")); return; }
    await loadItems(selectedMenuId);
  }

  async function saveItem(item: Item) {
    setErr(null);
    const res = await fetch(`${API}/api/admin/navigation/items/${item.id}/`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(item),
    });
    if (!res.ok) { setErr(await res.text().catch(() => "Update failed")); return; }
  }

  async function deleteItem(id: number) {
    setErr(null);
    const res = await fetch(`${API}/api/admin/navigation/items/${id}/`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) { setErr(await res.text().catch(() => "Delete failed")); return; }
    if (selectedMenuId) await loadItems(selectedMenuId);
  }

  return (
    <div className="space-y-3">
      {err ? <div className="text-sm text-red-600">{err}</div> : null}

      <div className="flex gap-2 items-center">
        <select
          className="border p-2 rounded"
          value={selectedMenuId ?? ""}
          onChange={(e) => setSelectedMenuId(Number(e.target.value))}
        >
          {menus.map((m) => (
            <option key={m.id} value={m.id}>
              {m.title || `Menu #${m.id}`}
            </option>
          ))}
        </select>

        <button className="border px-3 py-2 rounded" onClick={createMenu}>
          + New menu
        </button>

        <button className="border px-3 py-2 rounded" onClick={addItem} disabled={!selectedMenuId}>
          + Add link
        </button>
      </div>

      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={it.id} className="border rounded p-3 space-y-2">
            <div className="text-sm font-semibold">Link #{idx + 1}</div>

            <input
              className="border w-full p-2 rounded"
              value={it.label || ""}
              placeholder="Label"
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...it, label: e.target.value };
                setItems(next);
              }}
              onBlur={() => saveItem(items[idx])}
            />

            <input
              className="border w-full p-2 rounded"
              value={it.url || ""}
              placeholder="URL (e.g. /collections)"
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...it, url: e.target.value };
                setItems(next);
              }}
              onBlur={() => saveItem(items[idx])}
            />

            <input
              className="border w-full p-2 rounded"
              type="number"
              value={it.order ?? idx + 1}
              onChange={(e) => {
                const next = [...items];
                next[idx] = { ...it, order: Number(e.target.value) };
                setItems(next);
              }}
              onBlur={() => saveItem(items[idx])}
            />

            <button className="text-red-600 underline text-sm" onClick={() => deleteItem(it.id)}>
              Remove link
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
