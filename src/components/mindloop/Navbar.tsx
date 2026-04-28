import { Instagram, Linkedin, Twitter } from "lucide-react";
import { MindloopLogo } from "./Logo";

const NAV = [
  { label: "Home", href: "#home" },
  { label: "How It Works", href: "#how" },
  { label: "Philosophy", href: "#philosophy" },
  { label: "Use Cases", href: "#use-cases" },
];

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-6 md:px-28 py-4 bg-transparent">
      <div className="flex items-center justify-between gap-4">
        <a href="#home" className="flex items-center gap-3 shrink-0">
          <MindloopLogo />
          <span className="font-bold text-foreground tracking-tight text-lg">Mindloop</span>
        </a>
        <div className="hidden md:flex items-center gap-2 text-sm">
          {NAV.map((n, i) => (
            <span key={n.label} className="flex items-center gap-2">
              <a href={n.href} className="text-muted-foreground hover:text-foreground transition-colors">{n.label}</a>
              {i < NAV.length - 1 && <span className="text-muted-foreground">•</span>}
            </span>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {[Instagram, Linkedin, Twitter].map((Icon, i) => (
            <a key={i} href="#" aria-label="social" className="liquid-glass w-10 h-10 rounded-full flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors">
              <Icon className="w-4 h-4" />
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
