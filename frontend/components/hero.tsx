import Link from "next/link";
import { Button } from "@/components/ui/button";

type Media = { url?: string; external_url?: string } | null | undefined;

function pickSrc(asset: any): string {
  if (!asset) return "";
  return asset.url || asset.external_url || "";
}

export function HeroSection(props: {
  title: string;
  subtitle?: string;
  heroEnabled?: boolean;
  heroAsset?: any;
  ctaLabel?: string;
  ctaUrl?: string;
}) {
  const { title, subtitle, heroEnabled, heroAsset, ctaLabel, ctaUrl } = props;

  if (!heroEnabled || !heroAsset) return null;

  const src = pickSrc(heroAsset);
  const type = heroAsset.type; // "image" | "video" (from backend MediaAsset.type)

  if (!src) return null;

  return (
    <section className="relative overflow-hidden rounded-xl border">
      {/* Background media */}
      <div className="absolute inset-0">
        {type === "video" ? (
          <video
            className="h-full w-full object-cover"
            src={src}
            muted
            autoPlay
            loop
            playsInline
          />
        ) : (
          <img className="h-full w-full object-cover" src={src} alt={heroAsset.alt_text || ""} />
        )}

        {/* Dark overlay for readability */}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      {/* Overlay content */}
      <div className="relative z-10 p-8 sm:p-12">
        <div className="max-w-2xl space-y-4">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
          {subtitle ? <p className="text-white/85">{subtitle}</p> : null}

          {ctaLabel && ctaUrl ? (
            <div className="pt-2">
              <Button asChild variant="outline">
                <Link href={ctaUrl}>{ctaLabel}</Link>
              </Button>
            </div>
          ) : null}
        </div>
      </div>

      {/* Reserve height */}
      <div className="h-[320px] sm:h-[420px]" />
    </section>
  );
}
