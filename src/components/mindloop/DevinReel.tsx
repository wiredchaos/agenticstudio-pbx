import { motion } from "framer-motion";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Play } from "lucide-react";
import { fadeUp } from "@/lib/animations";

// Source: youtube.com/@monkeyteer
const VIDEOS = [
  { id: "4sn-nB52bGE", title: "Once Upon a Time in America", role: "Production / Cast (Monkey Teer)" },
  { id: "OH8ajVijDM8", title: "Bizzarro e Fantastico", role: "Monkey Teer Production" },
  { id: "YVOVWfuJ68Y", title: "L'imposteur du 16 Rue Ravignan", role: "Monkey Teer Production" },
  { id: "0iiwUgv2U0o", title: "Off-Key", role: "Monkey Teer Production" },
  { id: "ocklAzBhZQM", title: "Parenthesis", role: "Cinematographer" },
  { id: "a5nX0nCCIes", title: "Him — Batman Thriller Short", role: "Monkey Teer Entertainment" },
  { id: "CiOmC95OnRA", title: "Him & Her", role: "Monkey Teer Entertainment" },
  { id: "V6RIdwkjE_c", title: "Son of Sheba", role: "Executive Producer" },
  { id: "okf0wKINsvM", title: "MonkeY Teer — Untitled", role: "Monkey Teer Production" },
  { id: "6L9esv2doHw", title: "MonkeY Teer — Untitled", role: "Monkey Teer Production" },
];

function VideoCard({ id, title, role }: { id: string; title: string; role: string }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div className="snap-start shrink-0 w-[85vw] sm:w-[480px] md:w-[560px]">
      <div className="liquid-glass rounded-2xl overflow-hidden aspect-video relative group cursor-pointer" onClick={() => setPlaying(true)}>
        {playing ? (
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${id}?autoplay=1&rel=0&modestbranding=1`}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover opacity-80 grayscale group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-500"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="liquid-glass w-16 h-16 rounded-full flex items-center justify-center">
                <Play className="w-6 h-6 text-foreground fill-current" />
              </span>
            </div>
          </>
        )}
      </div>
      <p className="mt-3 text-sm text-foreground tracking-wide">{title}</p>
      <p className="mt-1 text-xs uppercase tracking-[2px] text-muted-foreground">{role}</p>
    </div>
  );
}

export function DevinReel() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === "left" ? -600 : 600, behavior: "smooth" });
  };

  return (
    <section className="px-6 md:px-12 py-32 md:py-44 border-t border-border/30">
      <div className="flex items-end justify-between max-w-7xl mx-auto mb-12">
        <div>
          <motion.p {...fadeUp(0)} className="text-xs tracking-[3px] uppercase text-muted-foreground">FEATURED FILMMAKER</motion.p>
          <motion.h2 {...fadeUp(0.05)} className="text-4xl md:text-6xl mt-4 font-medium tracking-[-1px] text-foreground">
            Watch the <span className="font-serif italic font-normal">work</span>
          </motion.h2>
          <motion.p {...fadeUp(0.1)} className="text-muted-foreground text-lg mt-4 max-w-xl">
            Selections from MonkeY Teer — Devin Teer's ongoing visual diary.
          </motion.p>
        </div>
        <motion.div {...fadeUp(0.15)} className="hidden md:flex gap-2">
          <button onClick={() => scroll("left")} aria-label="scroll left" className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-foreground hover:opacity-100 opacity-80 transition-opacity">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={() => scroll("right")} aria-label="scroll right" className="liquid-glass w-12 h-12 rounded-full flex items-center justify-center text-foreground hover:opacity-100 opacity-80 transition-opacity">
            <ChevronRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
      <motion.div {...fadeUp(0.2)} ref={scrollRef} className="reel-scroll flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 -mx-6 px-6 md:-mx-12 md:px-12">
        {VIDEOS.map((v) => (
          <VideoCard key={v.id} id={v.id} title={v.title} />
        ))}
      </motion.div>
    </section>
  );
}
