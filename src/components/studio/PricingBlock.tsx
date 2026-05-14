import type { StudioFunnel } from "@/lib/studioTheme";

export function PricingBlock({ funnel }: { funnel?: StudioFunnel | null }) {
  const ctas = funnel?.cta_buttons || [];
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-4xl text-center">
        <p className="text-[10px] uppercase tracking-[0.4em] opacity-60">Work with the studio</p>
        <h2 className="mt-3 text-3xl md:text-4xl" style={{ fontFamily: "var(--brand-display)" }}>
          Direct access. No agency layer.
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          {ctas.map((c) => (
            <a
              key={c.href}
              href={c.href}
              target={c.href.startsWith("http") ? "_blank" : undefined}
              rel="noreferrer"
              className="px-6 py-3 rounded-md text-sm font-semibold border transition hover:opacity-80"
              style={{ borderColor: `hsl(var(--accent))`, color: `hsl(var(--accent))` }}
            >
              {c.label}
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
