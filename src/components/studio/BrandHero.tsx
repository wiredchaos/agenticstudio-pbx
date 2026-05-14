import { useEffect, useRef, useState } from "react";
import type { BrandTheme } from "@/lib/studioTheme";
import { mergeTheme } from "@/lib/studioTheme";

export function BrandHero({ theme, name, tagline }: { theme?: BrandTheme | null; name: string; tagline?: string | null }) {
  const t = mergeTheme(theme);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduced, setReduced] = useState(false);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  const isVideo = t.hero_media_kind === "video" && !!t.hero_media_url;
  const isImage = t.hero_media_kind === "image" && !!t.hero_media_url;
  // Reduced-motion fallback: prefer poster, then static frame from the video, then nothing.
  const posterFallback = t.hero_poster_url || (isVideo ? undefined : t.hero_media_url || undefined);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <section className="relative w-full overflow-hidden border-b border-white/10" style={{ minHeight: "70vh" }}>
      {isVideo && !reduced && (
        <video
          ref={videoRef}
          src={t.hero_media_url!}
          poster={t.hero_poster_url || undefined}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />
      )}
      {isVideo && reduced && (
        posterFallback ? (
          <img src={posterFallback} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        ) : (
          // No poster supplied — render the video element paused with controls hidden so the first frame shows.
          <video
            src={t.hero_media_url!}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover opacity-60"
          />
        )
      )}
      {isImage && (
        <img src={t.hero_media_url!} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
      )}
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

      {isVideo && !reduced && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-20 border bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-white backdrop-blur transition hover:bg-black/80"
          style={{ borderColor: `hsl(${t.accent} / 0.6)` }}
          aria-label={muted ? "Unmute hero" : "Mute hero"}
        >
          {muted ? "Sound on" : "Sound off"}
        </button>
      )}
    </section>
  );
}
