import { useReveal } from "@/hooks/useReveal";

const ROWS = [
  { strength: "Deep Synthesis", in: "Agents read 100 sources to find the truth.", result: "High-authority, research-backed output." },
  { strength: "Filmmaker DNA", in: "Agents follow cinematic director rules.", result: "Work that doesn't look AI-generated." },
  { strength: "Visual Mapping", in: "Agents link related ideas automatically.", result: "Content that ranks in AI-search." },
  { strength: "Creator First", in: "Human directs while AI labors.", result: "Scale without losing soul or IP." },
];

export function HybridPrinciples() {
  const { ref, shown } = useReveal();
  return (
    <section ref={ref} className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          The Hybrid Model
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">
          AI is the crew. The human is the <em className="italic" style={{ color: "hsl(var(--gold))" }}>director</em>.
        </h2>

        <div className="mt-12 border-t border-border/40">
          <div
            className={`grid grid-cols-3 gap-4 border-b border-border/40 py-3 text-[10px] uppercase tracking-[0.3em] text-muted-foreground transition-opacity duration-500 ${
              shown ? "opacity-100" : "opacity-0"
            }`}
          >
            <div>Filmmaker craft</div>
            <div>In Agentic Studios</div>
            <div>Result</div>
          </div>
          {ROWS.map((r, i) => (
            <div
              key={r.strength}
              className={`grid grid-cols-3 gap-4 border-b border-border/30 py-5 text-sm transition-all duration-700 ease-out hover:bg-[hsl(var(--gold)/0.04)] ${
                shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-2"
              }`}
              style={{ transitionDelay: `${i * 100}ms` }}
            >
              <div className="font-serif text-base md:text-lg" style={{ color: "hsl(var(--gold))" }}>
                {r.strength}
              </div>
              <div className="text-foreground/85">{r.in}</div>
              <div className="text-muted-foreground">{r.result}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
