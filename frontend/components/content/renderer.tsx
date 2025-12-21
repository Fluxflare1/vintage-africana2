import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { ContentBlock } from "./blocks";

function Heading({ level = 2, text }: { level?: 1 | 2 | 3 | 4; text: string }) {
  const Tag = (["h1", "h2", "h3", "h4"][Math.max(1, Math.min(level, 4)) - 1] as any) as
    | "h1"
    | "h2"
    | "h3"
    | "h4";

  const cls =
    level === 1
      ? "text-3xl font-bold tracking-tight"
      : level === 2
      ? "text-2xl font-semibold tracking-tight"
      : level === 3
      ? "text-xl font-semibold"
      : "text-lg font-semibold";

  return <Tag className={cls}>{text}</Tag>;
}

function ImageBlock({ src, alt, caption }: { src: string; alt?: string; caption?: string }) {
  return (
    <figure className="space-y-2">
      {/* Use <img> to avoid Next/Image remote domain config at this stage */}
      <img src={src} alt={alt || ""} className="w-full rounded-lg border" />
      {caption ? <figcaption className="text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}

function GalleryBlock({
  images,
}: {
  images: { src: string; alt?: string; caption?: string }[];
}) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, idx) => (
          <div key={`${img.src}-${idx}`} className="space-y-2">
            <img src={img.src} alt={img.alt || ""} className="w-full rounded-lg border" />
            {img.caption ? <div className="text-sm text-muted-foreground">{img.caption}</div> : null}
          </div>
        ))}
      </div>
    </div>
  );
}

function ListBlock({ style = "bulleted", items }: { style?: "bulleted" | "numbered"; items: string[] }) {
  if (style === "numbered") {
    return (
      <ol className="list-decimal pl-5 space-y-1">
        {items.map((t, i) => (
          <li key={i}>{t}</li>
        ))}
      </ol>
    );
  }
  return (
    <ul className="list-disc pl-5 space-y-1">
      {items.map((t, i) => (
        <li key={i}>{t}</li>
      ))}
    </ul>
  );
}

function QuoteBlock({ text, attribution }: { text: string; attribution?: string }) {
  return (
    <blockquote className="border-l-4 pl-4 italic">
      <p>{text}</p>
      {attribution ? <footer className="mt-2 text-sm not-italic text-muted-foreground">— {attribution}</footer> : null}
    </blockquote>
  );
}

function DividerBlock() {
  return <hr className="my-6" />;
}

function LinkBlock({
  label,
  href,
  variant = "default",
}: {
  label: string;
  href: string;
  variant?: "default" | "outline";
}) {
  return (
    <Button asChild variant={variant}>
      <Link href={href}>{label}</Link>
    </Button>
  );
}

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks?.length) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          case "heading":
            return <Heading key={key} level={block.level} text={block.text} />;

          case "paragraph":
            return <p key={key} className="leading-7">{block.text}</p>;

          case "quote":
            return <QuoteBlock key={key} text={block.text} attribution={block.attribution} />;

          case "divider":
            return <DividerBlock key={key} />;

          case "list":
            return <ListBlock key={key} style={block.style} items={block.items || []} />;

          case "image":
            return <ImageBlock key={key} src={block.src} alt={block.alt} caption={block.caption} />;

          case "gallery":
            return <GalleryBlock key={key} images={block.images || []} />;

          case "link":
            return <LinkBlock key={key} label={block.label} href={block.href} variant={block.variant} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
