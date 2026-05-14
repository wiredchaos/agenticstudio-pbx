import { useEffect } from "react";
import { Navbar } from "@/components/agentic-landing/Navbar";
import { Footer } from "@/components/agentic-landing/Footer";

const SECTIONS = [
  {
    kicker: "I",
    title: "Deep Synthesis",
    body: "An agent that has read fifty sources writes differently than one that has read none. We ground every action in a citable knowledge base — no hallucinated truth, no untraceable claim.",
  },
  {
    kicker: "II",
    title: "Filmmaker DNA",
    body: "Most automated video looks cheap because the agents have no taste. Ours are conditioned on lens choice, color theory, blocking and pace — pulled from a director's own archive.",
  },
  {
    kicker: "III",
    title: "Visual Mapping",
    body: "Every published piece interlinks into a web of knowledge. The site reads as authority, not a list of articles — and AI search engines can tell the difference.",
  },
  {
    kicker: "IV",
    title: "Creator Sovereignty",
    body: "Anything made in the studio stays the artist's. Voice, likeness, archive, IP — never trained against the creator, never resold, never licensed without consent.",
  },
  {
    kicker: "V",
    title: "Human-in-the-Loop",
    body: "The agent does the ninety-five percent — grip, gaffer, runner, editor. The human does the final five — the cut, the call, the signature. No publish without sign-off.",
  },
];

export default function Manifesto() {
  useEffect(() => {
    document.title = "Manifesto — Agentic Studios";
    document.documentElement.classList.add("dark");
  }, []);

  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="px-6 pt-32 pb-24 md:pt-40 md:pb-32">
        <div className="mx-auto max-w-3xl">
          <p className="text-[10px] uppercase tracking-[0.4em]" style={{ color: "hsl(var(--gold))" }}>
            Manifesto
          </p>
          <h1 className="mt-4 font-serif text-5xl md:text-7xl leading-[1.05]">
            AI is the crew.<br />
            The human is the <em className="italic" style={{ color: "hsl(var(--gold))" }}>director</em>.
          </h1>
          <p className="mt-8 text-lg text-muted-foreground max-w-2xl">
            A studio is not a swarm. It is a chain of decisions, signed off by a name. These are the rules our agents work under.
          </p>

          <div className="mt-20 space-y-16">
            {SECTIONS.map((s) => (
              <article key={s.title} className="border-t border-border/40 pt-10">
                <div className="flex items-baseline gap-6">
                  <span className="font-serif text-3xl" style={{ color: "hsl(var(--gold))" }}>{s.kicker}</span>
                  <h2 className="font-serif text-3xl md:text-4xl">{s.title}</h2>
                </div>
                <p className="mt-5 text-base md:text-lg text-foreground/80 leading-relaxed">{s.body}</p>
              </article>
            ))}
          </div>

          <div className="mt-24 border-t border-border/40 pt-10 text-center">
            <p className="text-[10px] uppercase tracking-[0.4em] text-muted-foreground">Signed</p>
            <p className="mt-3 font-serif text-2xl">Agentic Studios · Monkey Teer</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
