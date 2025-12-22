"use client";

import { useEffect, useState } from "react";
import { adminPages } from "@/lib/admin-api";

export default function EditPage({ params }: { params: { slug: string } }) {
  const [page, setPage] = useState<any>(null);

  useEffect(() => {
    adminPages.detail(params.slug).then(setPage);
  }, [params.slug]);

  if (!page) return null;

  async function save() {
    await adminPages.update(params.slug, page);
    alert("Saved");
  }

  return (
    <>
      <h1>Edit Page</h1>
      <input
        value={page.title}
        onChange={(e) => setPage({ ...page, title: e.target.value })}
      />
      <textarea
        value={page.excerpt || ""}
        onChange={(e) => setPage({ ...page, excerpt: e.target.value })}
      />
      <button onClick={save}>Save</button>
    </>
  );
}
