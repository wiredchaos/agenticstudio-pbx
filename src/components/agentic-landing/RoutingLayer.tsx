export function RoutingLayer() {
  return (
    <section className="relative bg-background px-6 py-16">
      <div
        className="mx-auto max-w-4xl border p-8 text-center"
        style={{ borderColor: "hsl(var(--gold) / 0.3)" }}
      >
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          Routing Layer
        </p>
        <h3 className="mt-3 font-serif text-2xl md:text-3xl">Hermes 4 · OpenRouter</h3>
        <p className="mt-3 text-sm text-muted-foreground">
          All AI calls route through OpenRouter → NousResearch Hermes 4. Full reasoning trace, no token waste.
        </p>
      </div>
    </section>
  );
}
