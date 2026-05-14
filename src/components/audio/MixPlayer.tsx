import { useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { MIX_TRACKS, MIX_GENRES, DEFAULT_MIX, type MixGenre } from "./mixTracks";

const STORAGE_KEY = "mix:genre";

export function MixPlayer({ defaultGenre = DEFAULT_MIX, accentHsl }: { defaultGenre?: MixGenre; accentHsl?: string }) {
  const initial = (() => {
    if (typeof window === "undefined") return defaultGenre;
    const saved = window.localStorage.getItem(STORAGE_KEY) as MixGenre | null;
    return saved && MIX_TRACKS[saved] ? saved : defaultGenre;
  })();
  const [genre, setGenre] = useState<MixGenre>(initial);
  const [muted, setMuted] = useState(true);
  const audioRef = useRef<HTMLAudioElement>(null);
  const accent = accentHsl || "var(--gold)";

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.src = MIX_TRACKS[genre].url;
    a.loop = true;
    a.volume = 0.5;
    if (!muted) a.play().catch(() => {});
    try { window.localStorage.setItem(STORAGE_KEY, genre); } catch {}
  }, [genre]);

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.muted = muted;
    if (!muted) a.play().catch(() => {});
    else a.pause();
  }, [muted]);

  return (
    <div
      className="fixed bottom-6 right-6 z-50 flex items-center gap-1 rounded-full border bg-black/70 p-1.5 backdrop-blur-md"
      style={{ borderColor: `hsl(${accent} / 0.35)` }}
    >
      <button
        type="button"
        onClick={() => setMuted((m) => !m)}
        className="flex h-8 w-8 items-center justify-center rounded-full text-white/80 transition hover:text-white"
        style={{ background: muted ? "transparent" : `hsl(${accent} / 0.2)` }}
        aria-label={muted ? "Unmute" : "Mute"}
      >
        {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
      </button>
      <div className="hidden sm:flex items-center gap-0.5">
        {MIX_GENRES.map((g) => {
          const active = g === genre;
          return (
            <button
              key={g}
              type="button"
              onClick={() => {
                if (muted) setMuted(false);
                setGenre(g);
              }}
              className="px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] rounded-full transition"
              style={{
                color: active ? `hsl(${accent})` : "rgba(255,255,255,0.5)",
                background: active ? `hsl(${accent} / 0.12)` : "transparent",
              }}
            >
              {MIX_TRACKS[g].label}
            </button>
          );
        })}
      </div>
      <audio ref={audioRef} preload="none" />
    </div>
  );
}
