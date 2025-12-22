"use client";

import { useEffect, useState } from "react";

const API =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

export default function MenuBuilder() {
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/navigation/main/`, { credentials: "include" })
      .then((r) => r.json())
      .then((d) => setItems(d.items));
  }, []);

  async function save() {
    await fetch(`${API}/api/navigation/main/`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items }),
    });
    alert("Menu saved");
  }

  return (
    <>
      <h1>Menu Builder</h1>
      {items.map((i, idx) => (
        <input
          key={idx}
          value={i.label}
          onChange={(e) => {
            const v = [...items];
            v[idx].label = e.target.value;
            setItems(v);
          }}
        />
      ))}
      <button onClick={save}>Save</button>
    </>
  );
}
