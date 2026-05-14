import { useEffect, useRef, useState, Suspense } from "react";
import { Link } from "react-router-dom";
import { ReelScene } from "./ReelScene";
import { type Device } from "./devices";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FilmStripRail } from "../FilmStripRail";
import { MixPlayer } from "@/components/audio/MixPlayer";
import { type MixGenre } from "@/components/audio/mixTracks";

export type ReelSectionProps = {
  videos: Device[];
  eyebrow?: string;
  heading?: React.ReactNode;
  subheading?: string;
  accentHsl?: string;
  ctaPrimary?: { label: string; href: string };
  ctaSecondary?: { label: string; href: string };
  defaultMix?: MixGenre;
  showMixPlayer?: boolean;
};

export function ReelSection({
  videos,
  eyebrow = "Featured Filmmaker · MonkeY Teer · Devin Teer",
  heading,
  subheading = "Watch the work. Then enter the studio.",
  accentHsl = "45 56% 51%",
  ctaPrimary,
  ctaSecondary,
  defaultMix,
  showMixPlayer = true,
}: ReelSectionProps) {
  const scroll = useRef(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState<Device | null>(null);
  const [reduce, setReduce] = useState(false);
  const accentCss = `hsl(${accentHsl})`;
  const accentSoft = `hsl(${accentHsl} / 0.4)`;
  const accentMid = `hsl(${accentHsl} / 0.6)`;

  useEffect(() => {
    setReduce(window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const el = wrapRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      const passed = Math.min(Math.max(-rect.top, 0), total);
      scroll.current = total > 0 ? passed / total : 0;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  if (reduce) {
    return (
      <section className="relative bg-background px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: accentCss }}>
            {eyebrow}
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">{heading || "Watch the work."}</h2>
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {videos.map((d) => (
              <button key={d.id} onClick={() => setOpen(d)} className="group text-left">
                <div className="aspect-video overflow-hidden border" style={{ borderColor: accentSoft }}>
                  <img
                    src={`https://i.ytimg.com/vi/${d.id}/hqdefault.jpg`}
                    alt={d.title}
                    className="h-full w-full object-cover transition group-hover:scale-105"
                  />
                </div>
                <p className="mt-3 font-serif text-lg">{d.title}</p>
                <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">{d.role}</p>
              </button>
            ))}
          </div>
        </div>
        <VideoModal open={open} onClose={() => setOpen(null)} />
      </section>
    );
  }

  return (
    <>
      <div ref={wrapRef} className="relative" style={{ height: `${(videos.length + 2) * 100}vh` }}>
        <div className="sticky top-0 h-screen w-full">
          <Suspense fallback={null}>
            <ReelScene scrollRef={scroll} onOpen={setOpen} videos={videos} accentHsl={accentHsl} />
          </Suspense>
          <FilmStripRail side="left" />
          <FilmStripRail side="right" />
          <div className="pointer-events-none absolute left-0 right-0 top-8 z-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] md:text-xs" style={{ color: accentCss }}>
              {eyebrow}
            </p>
          </div>
          <div className="pointer-events-none absolute bottom-8 left-0 right-0 z-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              Scroll to fly the reel · Click a device to play
            </p>
          </div>
        </div>

        <div className="absolute inset-0 z-20 pointer-events-none">
          <HeroPanel heading={heading} subheading={subheading} accentCss={accentCss} eyebrow={eyebrow} />
          {videos.map((d, i) => (
            <div key={d.id} className="flex h-screen items-center justify-end px-8 md:px-20">
              <DeviceCaption index={i} scroll={scroll} total={videos.length + 2} accentCss={accentCss} />
            </div>
          ))}
          <div className="flex h-screen items-center justify-center">
            <div className="pointer-events-auto text-center">
              <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: accentCss }}>
                Built for directors who think in images
              </p>
              <h3 className="mt-4 font-serif text-4xl md:text-6xl">
                Enter the <em className="italic" style={{ color: accentCss }}>Studio</em>.
              </h3>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                {ctaPrimary && (
                  <Link to={ctaPrimary.href} className="px-7 py-3 text-xs uppercase tracking-[0.25em] text-black" style={{ background: accentCss }}>
                    {ctaPrimary.label} →
                  </Link>
                )}
                {ctaSecondary && (
                  <a href={ctaSecondary.href} className="border px-7 py-3 text-xs uppercase tracking-[0.25em]" style={{ borderColor: accentMid }}>
                    {ctaSecondary.label}
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        {showMixPlayer && <MixPlayer defaultGenre={defaultMix} accentHsl={accentHsl} />}
      </div>
      <VideoModal open={open} onClose={() => setOpen(null)} />
    </>
  );
}

function DeviceCaption({
  index,
  scroll,
  total,
  accentCss,
}: {
  index: number;
  scroll: React.MutableRefObject<number>;
  total: number;
  accentCss: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const center = (index + 1.5) / total;
      const dist = Math.abs(scroll.current - center);
      const opacity = Math.max(0, 1 - dist * 8);
      if (ref.current) ref.current.style.opacity = String(opacity);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [index, total, scroll]);

  return (
    <div ref={ref} className="pointer-events-auto text-right transition-opacity" style={{ opacity: 0 }}>
      <p className="text-[10px] uppercase tracking-[0.3em]" style={{ color: accentCss }}>
        {String(index + 1).padStart(2, "0")}
      </p>
    </div>
  );
}

function VideoModal({ open, onClose }: { open: Device | null; onClose: () => void }) {
  return (
    <Dialog open={!!open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-4xl border-0 bg-black p-0">
        {open && (
          <div className="aspect-video w-full">
            <iframe
              className="h-full w-full"
              src={`https://www.youtube.com/embed/${open.id}?autoplay=1&rel=0&modestbranding=1`}
              title={open.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function HeroPanel({
  heading,
  subheading,
  accentCss,
  eyebrow,
}: {
  heading?: React.ReactNode;
  subheading?: string;
  accentCss: string;
  eyebrow: string;
}) {
  return (
    <div className="flex h-screen flex-col items-center justify-center px-6 text-center">
      <div className="pointer-events-auto">
        <p className="mb-8 text-[10px] uppercase tracking-[0.4em] md:text-xs" style={{ color: accentCss }}>
          {eyebrow}
        </p>
        <h1 className="font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
          {heading || (
            <>
              The AI <em className="italic font-serif" style={{ color: accentCss }}>Production</em> Suite.
            </>
          )}
        </h1>
        <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg mx-auto">{subheading}</p>
      </div>
    </div>
  );
}
