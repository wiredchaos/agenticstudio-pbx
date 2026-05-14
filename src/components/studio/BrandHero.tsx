import type { BrandTheme } from "@/lib/studioTheme";
import { mergeTheme } from "@/lib/studioTheme";

export function BrandHero({ theme, name, tagline }: { theme?: BrandTheme | null; name: string; tagline?: string | null }) {
  const t = mergeTheme(theme);
  return (
    <section className="relative w-full overflow-hidden border-b border-white/10" style={{ minHeight: "70vh" }}>
      {t.hero_media_url ? (
        t.hero_media_kind === "video" ? (
          <video
            src={t.hero_media_url}
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        ) : (
          <img src={t.hero_media_url} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        )
      ) : null}
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(180deg, hsl(${t.background} / 0.2) 0%, hsl(${t.background}) 100%)`,
        }}
      />
      <div className="relative z-10 mx-auto max-w-5xl px-6 py-32">
        {t.logo_url && <img src={t.logo_url} alt={name} className="h-10 w-auto mb-6 opacity-90" />}
        <h1 className="text-5xl md:text-7xl" style={{ fontFamily: "var(--brand-display)", letterSpacing: "-0.02em" }}>
          {name}
        </h1>
        {tagline && (
          <p className="mt-4 italic text-lg" style={{ color: `hsl(${t.accent})`, fontFamily: "var(--brand-display)" }}>
            "{tagline}"
          </p>
        )}
      </div>
    </section>
  );
}
