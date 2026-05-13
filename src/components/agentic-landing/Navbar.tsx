import { Link } from "react-router-dom";
import { BrandMark } from "./BrandMark";

export function Navbar() {
  return (
    <header className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-5 md:px-12">
      <Link to="/" className="flex items-center gap-3 group">
        <BrandMark variant="mark" className="h-8 transition-transform duration-300 group-hover:scale-105 group-hover:rotate-3" shimmer />
        <span className="hidden sm:inline font-serif text-base tracking-[0.2em] text-foreground">
          AGENTIC <span style={{ color: "hsl(var(--gold))" }}>STUDIOS</span>
        </span>
      </Link>
      <nav className="flex items-center gap-6 text-xs uppercase tracking-[0.25em]">
        <Link to="/studios" className="text-muted-foreground hover:text-foreground transition">
          Studios
        </Link>
        <Link
          to="/auth"
          className="border px-4 py-2 text-foreground transition hover:bg-foreground/5"
          style={{ borderColor: "hsl(var(--gold) / 0.6)" }}
        >
          Sign In
        </Link>
      </nav>
    </header>
  );
}
