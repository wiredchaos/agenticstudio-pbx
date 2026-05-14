import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-border/30 bg-background px-6 py-10 flex flex-col items-center gap-4">
      <img
        src="/brand/agentic-wordmark.png"
        alt="Agentic Studios"
        className="h-5 w-auto opacity-70 brand-drift"
      />
      <nav className="flex items-center gap-6 text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        <Link to="/manifesto" className="hover:text-foreground transition">Manifesto</Link>
        <Link to="/studios" className="hover:text-foreground transition">Studios</Link>
        <Link to="/auth" className="hover:text-foreground transition">Sign In</Link>
      </nav>
      <p className="text-center text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
        © {new Date().getFullYear()} Agentic Studios · Monkey Teer Studios
      </p>
    </footer>
  );
}
