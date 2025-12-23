"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePicker } from "@/components/ImagePicker";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "cta"; label: string; url: string };

export default function EditPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [status, setStatus] = useState<"draft" | "published">("draft");
  const [isHomepage, setIsHomepage] = useState(false);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      setErr(null);
      const res = await fetch(`/api/admin/pages/${params.id}/`, {
        credentials: "include",
      });
      if (!res.ok) {
        setErr(await res.text().catch(() => "Failed to load"));
        setLoading(false);
        return;
      }
      const p = await res.json();
      setTitle(p.title || "");
      setSlug(p.slug || "");
      setStatus(p.status || "draft");
      setIsHomepage(!!p.is_homepage);
      setBlocks(p.content || []);
      setLoading(false);
    })();
  }, [params.id]);

  function addBlock(type: Block["type"]) {
    if (type === "heading") setBlocks([...blocks, { type: "heading", level: 2, text: "" }]);
    if (type === "paragraph") setBlocks([...blocks, { type: "paragraph", text: "" }]);
    if (type === "cta") setBlocks([...blocks, { type: "cta", label: "", url: "" }]);
  }

  async function save() {
    setErr(null);
    const res = await fetch(`/api/admin/pages/${params.id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title,
        slug,
        status,
        is_homepage: isHomepage,
        content: blocks,
      }),
    });

    if (!res.ok) {
      setErr(await res.text().catch(() => "Save failed"));
      return;
    }
    router.refresh();
  }

  if (loading) return <main>Loading...</main>;

  return (
    <main className="space-y-4 max-w-3xl">
      <h1 className="text-2xl font-bold">Edit Page</h1>

      {err ? <p className="text-red-600 text-sm">{err}</p> : null}

      <div className="space-y-2">
        <input className="border w-full p-2 rounded" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title" />
        <input className="border w-full p-2 rounded" value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="Slug (home, about, ...)" />

        <div className="flex gap-3 items-center">
          <label className="flex gap-2 items-center">
            <input type="checkbox" checked={isHomepage} onChange={(e) => setIsHomepage(e.target.checked)} />
            Homepage
          </label>

          <select className="border p-2 rounded" value={status} onChange={(e) => setStatus(e.target.value as any)}>
            <option value="draft">draft</option>
            <option value="published">published</option>
          </select>
        </div>
      </div>

      <div className="border rounded p-3 space-y-3">
        <div className="flex gap-2">
          <button className="border px-3 py-2 rounded" onClick={() => addBlock("heading")}>+ Heading</button>
          <button className="border px-3 py-2 rounded" onClick={() => addBlock("paragraph")}>+ Paragraph</button>
          <button className="border px-3 py-2 rounded" onClick={() => addBlock("cta")}>+ CTA</button>
        </div>

        {blocks.map((b, idx) => (
          <div key={idx} className="border rounded p-3 space-y-2">
            <div className="text-sm font-semibold">{b.type.toUpperCase()}</div>

            {b.type === "heading" ? (
              <>
                <select
                  className="border p-2 rounded"
                  value={b.level}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).level = Number(e.target.value);
                    setBlocks(next);
                  }}
                >
                  <option value={1}>H1</option>
                  <option value={2}>H2</option>
                  <option value={3}>H3</option>
                </select>
                <input
                  className="border w-full p-2 rounded"
                  value={b.text}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).text = e.target.value;
                    setBlocks(next);
                  }}
                  placeholder="Heading text"
                />
              </>
            ) : null}

            {b.type === "paragraph" ? (
              <textarea
                className="border w-full p-2 rounded min-h-[100px]"
                value={b.text}
                onChange={(e) => {
                  const next = [...blocks];
                  (next[idx] as any).text = e.target.value;
                  setBlocks(next);
                }}
                placeholder="Paragraph text"
              />
            ) : null}

            {b.type === "cta" ? (
              <>
                <input
                  className="border w-full p-2 rounded"
                  value={b.label}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).label = e.target.value;
                    setBlocks(next);
                  }}
                  placeholder="Button label"
                />
                <input
                  className="border w-full p-2 rounded"
                  value={b.url}
                  onChange={(e) => {
                    const next = [...blocks];
                    (next[idx] as any).url = e.target.value;
                    setBlocks(next);
                  }}
                  placeholder="Button URL (/collections)"
                />
              </>
            ) : null}

            <button
              className="text-red-600 underline text-sm"
              onClick={() => setBlocks(blocks.filter((_, i) => i !== idx))}
            >
              Remove block
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button className="border px-4 py-2 rounded" onClick={save}>Save</button>
        <button className="border px-4 py-2 rounded" onClick={() => router.push("/admin/pages")}>Back</button>
      </div>
    </main>
  );
}
