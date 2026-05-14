import { useReveal } from "@/hooks/useReveal";
import { Search, FileText, Mic, Sparkles, Bot } from "lucide-react";

const DEPTS = [
  { icon: Search, dept: "Research & Lore", mcp: "Exa", line: "Pulls cinematic references and period-accurate detail.", status: "Scaffolded" },
  { icon: FileText, dept: "Script & Memory", mcp: "Fastio", line: "Persistent cloud bible — agents never forget the plot.", status: "Scaffolded" },
  { icon: Mic, dept: "Voice", mcp: "Chatterbox", line: "Cloned voice + dialogue rendered to .wav.", status: "Planned" },
  { icon: Sparkles, dept: "Visual FX", mcp: "Flux · NanoBanana · LTX", line: "Concept art, virtual try-on, lipdub render.", status: "Planned" },
  { icon: Bot, dept: "Automation", mcp: "Playwright", line: "Browser-driven scraping and editor automation.", status: "Scaffolded" },
];

const PIPELINE = ["Research", "Script", "Voice", "VFX", "Distribution"];

export function StudioStack() {
  const { ref, shown } = useReveal();
  return (
    <section ref={ref} className="relative bg-background px-6 py-24 md:py-32">
      <div className="mx-auto max-w-6xl">
        <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
          The Stack
        </p>
        <h2 className="mt-3 font-serif text-4xl md:text-5xl">
          The studio runs on a <em className="italic" style={{ color: "hsl(var(--gold))" }}>stack</em> of agents.
        </h2>
        <p className="mt-4 max-w-2xl text-sm text-muted-foreground">
          Five departments. One pipeline. Each agent's output becomes the next agent's input — research feeds script, script feeds voice, voice feeds picture.
        </p>

        <div className="mt-14 brand-sprocket-rail py-6">
          <div className="grid gap-4 md:grid-cols-5">
            {DEPTS.map((d, i) => (
              <div
                key={d.dept}
                className={`group relative border border-border/40 bg-card/30 p-5 transition-all duration-700 ease-out hover:border-[hsl(var(--gold)/0.5)] ${
                  shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${i * 80}ms` }}
              >
                <d.icon className="h-5 w-5" style={{ color: "hsl(var(--gold))" }} />
                <p className="mt-3 text-[10px] uppercase tracking-[0.25em] text-muted-foreground">{d.dept}</p>
                <h3 className="mt-1 font-serif text-xl">{d.mcp}</h3>
                <p className="mt-2 text-xs text-muted-foreground/80 leading-relaxed">{d.line}</p>
                <span
                  className="mt-4 inline-block border px-2 py-0.5 text-[9px] uppercase tracking-[0.2em]"
                  style={{
                    borderColor: d.status === "Scaffolded" ? "hsl(var(--gold) / 0.5)" : "hsl(var(--border))",
                    color: d.status === "Scaffolded" ? "hsl(var(--gold))" : "hsl(var(--muted-foreground))",
                  }}
                >
                  {d.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16">
          <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Pipeline</p>
          <div className="relative mt-4 overflow-hidden border border-border/30 bg-card/20 p-6">
            <div className="flex items-center justify-between gap-2 text-xs uppercase tracking-[0.2em]">
              {PIPELINE.map((p, i) => (
                <div key={p} className="flex items-center gap-2 md:gap-4">
                  <span className="text-foreground/80">{p}</span>
                  {i < PIPELINE.length - 1 && (
                    <span className="text-muted-foreground/40">→</span>
                  )}
                </div>
              ))}
            </div>
            <div className="pipeline-pulse mt-4 h-px w-full" />
          </div>
        </div>
      </div>
    </section>
  );
}
