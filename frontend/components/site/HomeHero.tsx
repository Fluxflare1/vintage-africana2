import Link from "next/link";

export default function HomeHero({
  enabled,
  title,
  excerpt,
  heroAssetUrl,
  coverUrl,
  ctaLabel,
  ctaUrl,
  cmsReady,
}: {
  enabled: boolean;
  title: string;
  excerpt: string;
  heroAssetUrl: string;
  coverUrl: string;
  ctaLabel: string;
  ctaUrl: string;
  cmsReady: boolean;
}) {
  const bg = heroAssetUrl || coverUrl;

  return (
    <section className="relative overflow-hidden border-b">
      {/* Background */}
      <div className="absolute inset-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        {bg ? (
          <img src={bg} alt="" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-50 to-gray-200" />
        )}
        <div className="absolute inset-0 bg-black/45" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 py-20 md:py-28">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-medium bg-white/10 text-white border border-white/20 rounded-full px-3 py-1">
            {cmsReady ? "Live content from CMS" : "Website ready • awaiting homepage content"}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mt-4 leading-tight">
            {title}
          </h1>

          <p className="text-white/90 mt-4 text-base md:text-lg leading-relaxed">
            {excerpt}
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={ctaUrl} className="px-5 py-3 rounded bg-white text-black font-semibold hover:bg-gray-100 transition">
              {ctaLabel}
            </Link>
            <Link href="/stories" className="px-5 py-3 rounded border border-white/40 text-white hover:bg-white/10 transition">
              Read Stories
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
