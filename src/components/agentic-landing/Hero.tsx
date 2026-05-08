import { Link } from "react-router-dom";

export function Hero() {
  return (
    <section className="pointer-events-none relative isolate flex min-h-screen items-center justify-center text-foreground">
      <div className="pointer-events-auto relative z-20 mx-auto flex max-w-5xl flex-col items-center justify-center px-6 text-center">
        <p
          className="mb-8 text-[10px] uppercase tracking-[0.4em] md:text-xs"
          style={{ color: "hsl(var(--gold))" }}
        >
          Monkey Teer Studios · Powered by Agentic Studios
        </p>

        <h1 className="font-serif text-5xl leading-[0.95] md:text-7xl lg:text-8xl">
          The AI{" "}
          <em className="italic font-serif" style={{ color: "hsl(var(--gold))" }}>
            Production
          </em>{" "}
          Suite.
        </h1>

        <p className="mt-8 max-w-xl text-base text-muted-foreground md:text-lg">
          Watch the work. Then enter the studio.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#early-access"
            className="px-7 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:opacity-90"
            style={{ background: "hsl(var(--gold))" }}
          >
            Get Early Access →
          </a>
          <Link
            to="/studios"
            className="border px-7 py-3 text-xs uppercase tracking-[0.25em] text-foreground transition hover:bg-foreground/5"
            style={{ borderColor: "hsl(var(--gold) / 0.6)" }}
          >
            Browse Studios
          </Link>
        </div>

        <p className="mt-12 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
          Drag to orbit · Scroll to explore
        </p>
      </div>
    </section>
  );
}
