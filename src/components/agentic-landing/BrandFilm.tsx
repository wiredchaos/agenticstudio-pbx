import { BrandVideo } from "./BrandVideo";
import { useReveal } from "@/hooks/useReveal";

export function BrandFilm() {
  const { ref, shown } = useReveal();
  return (
    <section ref={ref} className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <div
          className={`max-w-2xl transition-all duration-700 ease-out ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p
            className="text-[10px] uppercase tracking-[0.4em]"
            style={{ color: "hsl(var(--gold))" }}
          >
            The Manifesto
          </p>
          <h2 className="mt-3 font-serif text-4xl md:text-5xl">
            The studio, in{" "}
            <em className="italic" style={{ color: "hsl(var(--gold))" }}>
              twenty-five
            </em>{" "}
            seconds.
          </h2>
          <p className="mt-4 text-muted-foreground">
            Five agents. One director. Built for the directors who still believe
            the frame matters.
          </p>
        </div>

        <div
          className={`mt-12 transition-all duration-1000 ease-out delay-150 ${
            shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
          }`}
        >
          <BrandVideo
            src="/video/agentic-bio.mp4"
            poster="/video/agentic-bio.jpg"
            aspect="21/9"
          />
        </div>
      </div>
    </section>
  );
}
