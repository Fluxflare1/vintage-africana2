import Link from "next/link";

type Block =
  | { type: "heading"; level: number; text: string }
  | { type: "paragraph"; text: string }
  | { type: "cta"; label: string; url: string };

export default function BlocksRenderer({ blocks }: { blocks: Block[] }) {
  return (
    <div className="space-y-6">
      {blocks.map((b, i) => {
        if (b.type === "heading") {
          const Tag = (b.level === 1 ? "h2" : b.level === 2 ? "h3" : "h4") as any;
          return (
            <Tag key={i} className="font-bold text-xl md:text-2xl">
              {b.text}
            </Tag>
          );
        }

        if (b.type === "paragraph") {
          return (
            <p key={i} className="text-gray-700 leading-relaxed">
              {b.text}
            </p>
          );
        }

        if (b.type === "cta") {
          return (
            <div key={i}>
              <Link
                href={b.url || "/"}
                className="inline-flex px-4 py-2 rounded bg-black text-white hover:bg-gray-900 transition"
              >
                {b.label || "Learn more"}
              </Link>
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
