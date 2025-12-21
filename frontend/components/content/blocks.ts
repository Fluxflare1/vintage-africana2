export type ContentBlock =
  | { type: "heading"; level?: 1 | 2 | 3 | 4; text: string }
  | { type: "paragraph"; text: string }
  | { type: "quote"; text: string; attribution?: string }
  | { type: "divider" }
  | { type: "list"; style?: "bulleted" | "numbered"; items: string[] }
  | { type: "image"; src: string; alt?: string; caption?: string }
  | { type: "gallery"; images: { src: string; alt?: string; caption?: string }[] }
  | { type: "link"; label: string; href: string; variant?: "default" | "outline" };

export function normalizeBlocks(input: unknown): ContentBlock[] {
  if (!Array.isArray(input)) return [];
  // Lightweight validation: keep only blocks with a valid "type"
  return input.filter((b: any) => b && typeof b === "object" && typeof b.type === "string") as ContentBlock[];
}
