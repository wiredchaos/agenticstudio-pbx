const AGENTS = [
  { code: "NEXUS", role: "Orchestrator", desc: "Routes and coordinates all agents across your studio." },
  { code: "PRAXIS", role: "Director's Twin", desc: "Shot lists conditioned on your creative DNA." },
  { code: "SCRIBE", role: "Line Producer", desc: "Script breakdown, budget, schedule." },
  { code: "ARCHITECT", role: "World Builder", desc: "Plates, locations, production design." },
  { code: "EGOS", role: "Designer", desc: "Wardrobe, character moodboards, stills." },
];

export function AgentsGrid() {
  return (
    <section className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          Five Agents
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">Your studio, staffed.</h2>

        <div className="mt-14 grid gap-px bg-border/60 md:grid-cols-2 lg:grid-cols-5">
          {AGENTS.map((a) => (
            <div key={a.code} className="bg-background p-8">
              <div
                className="text-[10px] uppercase tracking-[0.3em]"
                style={{ color: "hsl(var(--gold))" }}
              >
                {a.code}
              </div>
              <h3 className="mt-4 font-serif text-2xl">{a.role}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
