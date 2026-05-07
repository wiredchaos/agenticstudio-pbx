const STEPS = [
  { n: "01", title: "Set your DNA", desc: "Upload scripts, references, tone notes. PRAXIS learns how you direct." },
  { n: "02", title: "Brief an agent", desc: "Describe the scene. PRAXIS generates a shot list. SCRIBE builds the breakdown." },
  { n: "03", title: "Ship it", desc: "Distribute to your crew, archive every run, iterate instantly." },
];

export function Process() {
  return (
    <section className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          The Process
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">From idea to production, in seconds.</h2>

        <div className="mt-14 grid gap-12 md:grid-cols-3">
          {STEPS.map((s) => (
            <div key={s.n}>
              <div className="font-serif text-5xl" style={{ color: "hsl(var(--gold))" }}>{s.n}</div>
              <h3 className="mt-4 font-serif text-2xl">{s.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
