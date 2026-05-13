import { useReveal } from "@/hooks/useReveal";

const AGENTS = [
  { code: "NEXUS", role: "Orchestrator", desc: "Routes and coordinates all agents across your studio." },
  { code: "PRAXIS", role: "Director's Twin", desc: "Shot lists conditioned on your creative DNA." },
  { code: "SCRIBE", role: "Line Producer", desc: "Script breakdown, budget, schedule." },
  { code: "ARCHITECT", role: "World Builder", desc: "Plates, locations, production design." },
  { code: "EGOS", role: "Designer", desc: "Wardrobe, character moodboards, stills." },
];

export function AgentsGrid() {
  const { ref, shown } = useReveal();
  return (
    <section ref={ref} className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          Five Agents
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Your studio, staffed.</h2>

        <div className="mt-14 grid gap-px bg-border/60 md:grid-cols-2 lg:grid-cols-5">
          {AGENTS.map((a, i) => (
            <div
              key={a.code}
              className={`group relative bg-background p-8 transition-all duration-700 ease-out ${
                shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "hsl(var(--gold))" }}
              >
                {a.code}
              </div>
              <h3 className="mt-4 font-serif text-2xl">{a.role}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{a.desc}</p>
              <span
                className="absolute bottom-0 left-8 right-8 h-px origin-left scale-x-0 transition-transform duration-500 ease-out group-hover:scale-x-100"
                style={{ background: "hsl(var(--gold))" }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
