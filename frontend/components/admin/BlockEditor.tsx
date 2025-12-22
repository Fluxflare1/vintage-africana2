"use client";

type Block = { type: string; data: any };

export default function BlockEditor({
  value,
  onChange,
}: {
  value: Block[];
  onChange: (v: Block[]) => void;
}) {
  function add(type: string) {
    onChange([...value, { type, data: {} }]);
  }

  function update(i: number, data: any) {
    const v = [...value];
    v[i].data = data;
    onChange(v);
  }

  return (
    <>
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => add("text")}>Text</button>
        <button onClick={() => add("image")}>Image</button>
      </div>

      {value.map((b, i) => (
        <div key={i}>
          {b.type === "text" && (
            <textarea
              value={b.data.text || ""}
              onChange={(e) => update(i, { text: e.target.value })}
            />
          )}
          {b.type === "image" && (
            <input
              placeholder="Image URL"
              value={b.data.url || ""}
              onChange={(e) => update(i, { url: e.target.value })}
            />
          )}
        </div>
      ))}
    </>
  );
}
