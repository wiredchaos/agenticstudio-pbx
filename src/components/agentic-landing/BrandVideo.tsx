import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface BrandVideoProps {
  src: string;
  poster?: string;
  aspect?: "16/9" | "21/9" | "4/3";
  loop?: boolean;
  autoPlay?: boolean;
  controls?: boolean;
  className?: string;
  rounded?: boolean;
}

export function BrandVideo({
  src,
  poster,
  aspect = "16/9",
  loop = true,
  autoPlay = true,
  controls = false,
  className,
  rounded = true,
}: BrandVideoProps) {
  const wrapRef = useRef<HTMLDivElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [load, setLoad] = useState(false);
  const [muted, setMuted] = useState(true);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setLoad(true);
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            setLoad(true);
            setRevealed(true);
          }
        }
      },
      { rootMargin: "200px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !v.muted;
    setMuted(v.muted);
    if (!v.muted) v.play().catch(() => {});
  };

  return (
    <div
      ref={wrapRef}
      className={cn(
        "relative overflow-hidden brand-video-frame",
        revealed && "brand-video-revealed",
        rounded && "rounded-sm",
        className
      )}
      style={{ aspectRatio: aspect.replace("/", " / ") }}
    >
      {/* Sprocket rails */}
      <div className="brand-sprocket-rail brand-sprocket-rail--top" aria-hidden />
      <div className="brand-sprocket-rail brand-sprocket-rail--bottom" aria-hidden />

      {load ? (
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          autoPlay={autoPlay}
          muted
          playsInline
          loop={loop}
          controls={controls}
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
        />
      ) : poster ? (
        <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover" />
      ) : null}

      {!controls && (
        <button
          type="button"
          onClick={toggleMute}
          className="absolute bottom-4 right-4 z-10 border bg-black/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.25em] text-foreground backdrop-blur transition hover:bg-black/80"
          style={{ borderColor: "hsl(var(--gold) / 0.6)" }}
          aria-label={muted ? "Unmute video" : "Mute video"}
        >
          {muted ? "Sound on" : "Sound off"}
        </button>
      )}
    </div>
  );
}
