import { BrandVideo } from "./BrandVideo";
import { BrandMark } from "./BrandMark";
import { useReveal } from "@/hooks/useReveal";

export function HeroFilm() {
  const { ref, shown } = useReveal(0.05);
  return (
    <section
      ref={ref}
      className="relative bg-background px-4 pt-28 pb-16 md:px-12 md:pt-32 md:pb-24"
    >
      <div className="mx-auto max-w-7xl">
        <div
          className={`flex flex-col items-start gap-4 transition-all duration-700 ease-out ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "hsl(var(--gold))" }}
          >
            Now Reeling
          </p>
          <h1 className="font-serif text-4xl leading-[1.05] md:text-6xl">
            A studio that <em className="italic" style={{ color: "hsl(var(--gold))" }}>
              thinks
            </em>{" "}
            in images.
          </h1>
        </div>

        <div
          className={`mt-10 transition-all duration-1000 ease-out ${
            shown ? "opacity-100 scale-100" : "opacity-0 scale-[0.98]"
          }`}
        >
          <BrandVideo
            src="/video/agentic-launch.mp4"
            poster="/video/agentic-launch.jpg"
            aspect="16/9"
          />
        </div>

        <div className="mt-8 flex items-center justify-between gap-4">
          <BrandMark variant="lockup" className="h-8 md:h-10" />
          <p className="hidden md:block text-xs uppercase tracking-[0.3em] text-muted-foreground">
            Five agents · One studio
          </p>
        </div>
      </div>
    </section>
  );
}
