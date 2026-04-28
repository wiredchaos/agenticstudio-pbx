export function Footer() {
  return (
    <footer className="py-12 px-6 md:px-28 flex flex-col md:flex-row items-center justify-between gap-4 border-t border-border/30">
      <p className="text-muted-foreground text-sm">© 2026 Mindloop. All rights reserved.</p>
      <div className="flex items-center gap-6 text-sm">
        {["Privacy", "Terms", "Contact"].map((l) => (
          <a key={l} href="#" className="text-muted-foreground hover:text-foreground transition-colors">{l}</a>
        ))}
      </div>
    </footer>
  );
}
