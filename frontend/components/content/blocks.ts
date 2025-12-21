export type ContentBlock =
  // Basic
  | { type: "heading"; level?: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "divider" }
  | { type: "list"; style?: "bulleted" | "numbered"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt?: string; caption?: string }[] }
  | { type: "link"; label: string; href: string; variant?: "default" | "outline" }

  // Advanced
  | {
      type: "callout";
      title?: string;
      text: string;
      tone?: "neutral" | "info" | "success" | "warning";
    }
  | {
      type: "two_column";
      left: ContentBlock[];
      right: ContentBlock[];
      ratio?: "1:1" | "2:1" | "1:2";
    }
  | {
      type: "media_text";
      media: { kind: "image" | "video"; src: string; alt?: string; caption?: string };
      text: ContentBlock[];
      mediaPosition?: "left" | "right";
    }
  | {
      type: "embed";
      provider: "youtube" | "vimeo" | "generic";
      url: string;
      title?: string;
      aspect?: "16:9" | "4:3" | "1:1";
    }
  | {
      type: "cards";
      title?: string;
      layout?: "grid" | "list";
      cards: {
        title: string;
        description?: string;
        href?: string;
        image?: { src: string; alt?: string };
        badge?: string;
      }[];
    };

export function normalizeBlocks(input: unknown): ContentBlock[] {
  if (!Array.isArray(input)) return [];
  return input.filter((b: any) => b && typeof b === "object" && typeof b.type === "string") as ContentBlock[];
}
