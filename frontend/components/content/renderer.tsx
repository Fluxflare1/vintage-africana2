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
      <img src={src} alt={alt || ""} className="w-full rounded-lg border object-cover" />
      {caption ? <figcaption className="text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}

function VideoBlock({ src, caption }: { src: string; caption?: string }) {
  return (
    <figure className="space-y-2">
      <video className="w-full rounded-lg border" src={src} controls playsInline />
      {caption ? <figcaption className="text-sm text-muted-foreground">{caption}</figcaption> : null}
    </figure>
  );
}

function GalleryBlock({ images }: { images: { src: string; alt?: string; caption?: string }[] }) {
  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {images.map((img, idx) => (
          <div key={`${img.src}-${idx}`} className="space-y-2">
            <img src={img.src} alt={img.alt || ""} className="w-full rounded-lg border object-cover" />
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

/* =========================
   Advanced blocks
========================= */

function CalloutBlock({
  title,
  text,
  tone = "neutral",
}: {
  title?: string;
  text: string;
  tone?: "neutral" | "info" | "success" | "warning";
}) {
  const toneCls =
    tone === "info"
      ? "border-blue-200 bg-blue-50"
      : tone === "success"
      ? "border-green-200 bg-green-50"
      : tone === "warning"
      ? "border-amber-200 bg-amber-50"
      : "border-slate-200 bg-slate-50";

  return (
    <section className={`rounded-lg border p-4 ${toneCls}`}>
      {title ? <div className="font-semibold mb-1">{title}</div> : null}
      <div className="text-sm leading-6">{text}</div>
    </section>
  );
}

function TwoColumnBlock({
  left,
  right,
  ratio = "1:1",
}: {
  left: ContentBlock[];
  right: ContentBlock[];
  ratio?: "1:1" | "2:1" | "1:2";
}) {
  const gridCls =
    ratio === "2:1"
      ? "lg:grid-cols-[2fr_1fr]"
      : ratio === "1:2"
      ? "lg:grid-cols-[1fr_2fr]"
      : "lg:grid-cols-2";

  return (
    <section className={`grid gap-6 ${gridCls}`}>
      <div className="space-y-6">
        <ContentRenderer blocks={left} />
      </div>
      <div className="space-y-6">
        <ContentRenderer blocks={right} />
      </div>
    </section>
  );
}

function MediaTextBlock({
  media,
  text,
  mediaPosition = "left",
}: {
  media: { kind: "image" | "video"; src: string; alt?: string; caption?: string };
  text: ContentBlock[];
  mediaPosition?: "left" | "right";
}) {
  const mediaEl =
    media.kind === "video" ? (
      <VideoBlock src={media.src} caption={media.caption} />
    ) : (
      <ImageBlock src={media.src} alt={media.alt} caption={media.caption} />
    );

  return (
    <section className="grid gap-6 lg:grid-cols-2">
      {mediaPosition === "left" ? (
        <>
          <div>{mediaEl}</div>
          <div className="space-y-6">
            <ContentRenderer blocks={text} />
          </div>
        </>
      ) : (
        <>
          <div className="space-y-6">
            <ContentRenderer blocks={text} />
          </div>
          <div>{mediaEl}</div>
        </>
      )}
    </section>
  );
}

function EmbedBlock({
  provider,
  url,
  title,
  aspect = "16:9",
}: {
  provider: "youtube" | "vimeo" | "generic";
  url: string;
  title?: string;
  aspect?: "16:9" | "4:3" | "1:1";
}) {
  const aspectCls = aspect === "4:3" ? "aspect-[4/3]" : aspect === "1:1" ? "aspect-square" : "aspect-video";

  // We intentionally use iframe (simple + flexible).
  // URL should be an embeddable URL for best results.
  return (
    <section className="space-y-2">
      {title ? <div className="font-semibold">{title}</div> : null}
      <div className={`w-full overflow-hidden rounded-lg border ${aspectCls}`}>
        <iframe
          className="h-full w-full"
          src={url}
          title={title || provider}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </section>
  );
}

function CardsBlock({
  title,
  layout = "grid",
  cards,
}: {
  title?: string;
  layout?: "grid" | "list";
  cards: {
    title: string;
    description?: string;
    href?: string;
    image?: { src: string; alt?: string };
    badge?: string;
  }[];
}) {
  return (
    <section className="space-y-3">
      {title ? <div className="text-xl font-semibold">{title}</div> : null}

      <div className={layout === "list" ? "space-y-3" : "grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3"}>
        {cards.map((c, idx) => {
          const CardInner = (
            <div className="rounded-lg border p-4 space-y-2">
              {c.image?.src ? (
                <img src={c.image.src} alt={c.image.alt || ""} className="w-full rounded-md border object-cover" />
              ) : null}

              <div className="flex items-start justify-between gap-3">
                <div className="font-semibold">{c.title}</div>
                {c.badge ? (
                  <span className="text-xs rounded-full border px-2 py-0.5">{c.badge}</span>
                ) : null}
              </div>

              {c.description ? <p className="text-sm text-muted-foreground">{c.description}</p> : null}
            </div>
          );

          return c.href ? (
            <Link key={`${c.title}-${idx}`} href={c.href} className="block hover:opacity-95">
              {CardInner}
            </Link>
          ) : (
            <div key={`${c.title}-${idx}`}>{CardInner}</div>
          );
        })}
      </div>
    </section>
  );
}

/* =========================
   Renderer
========================= */

export function ContentRenderer({ blocks }: { blocks: ContentBlock[] }) {
  if (!blocks?.length) return null;

  return (
    <div className="space-y-6">
      {blocks.map((block, index) => {
        const key = `${block.type}-${index}`;

        switch (block.type) {
          // Basic
          case "heading":
            return <Heading key={key} level={block.level} text={block.text} />;

          case "paragraph":
            return (
              <p key={key} className="leading-7">
                {block.text}
              </p>
            );

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

          // Advanced
          case "callout":
            return <CalloutBlock key={key} title={block.title} text={block.text} tone={block.tone} />;

          case "two_column":
            return <TwoColumnBlock key={key} left={block.left || []} right={block.right || []} ratio={block.ratio} />;

          case "media_text":
            return (
              <MediaTextBlock
                key={key}
                media={block.media}
                text={block.text || []}
                mediaPosition={block.mediaPosition}
              />
            );

          case "embed":
            return (
              <EmbedBlock
                key={key}
                provider={block.provider}
                url={block.url}
                title={block.title}
                aspect={block.aspect}
              />
            );

          case "cards":
            return <CardsBlock key={key} title={block.title} layout={block.layout} cards={block.cards || []} />;

          default:
            return null;
        }
      })}
    </div>
  );
}
