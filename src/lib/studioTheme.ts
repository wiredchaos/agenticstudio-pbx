export type BrandTheme = {
  primary?: string;       // HSL triplet "H S% L%"
  accent?: string;
  background?: string;
  foreground?: string;
  display_font?: string;
  body_font?: string;
  logo_url?: string;
  wordmark_url?: string;
  hero_media_url?: string | null;
  hero_media_kind?: "image" | "video";
};

export type StudioFunnel = {
  lead_magnet?: boolean;
  pricing_block?: boolean;
  testimonials?: boolean;
  custom_domain_cta?: boolean;
  email_capture?: boolean;
  cta_buttons?: { label: string; href: string }[];
};

export const DEFAULT_THEME: Required<Omit<BrandTheme, "hero_media_url">> & { hero_media_url: string | null } = {
  primary: "0 0% 90%",
  accent: "45 56% 51%",
  background: "0 0% 4%",
  foreground: "0 0% 98%",
  display_font: "Instrument Serif",
  body_font: "Inter",
  logo_url: "/brand/agentic-mark.png",
  wordmark_url: "/brand/agentic-wordmark.png",
  hero_media_url: null,
  hero_media_kind: "image",
};

export function mergeTheme(t?: BrandTheme | null) {
  return { ...DEFAULT_THEME, ...(t || {}) };
}

const loaded = new Set<string>();
export function ensureFont(family?: string) {
  if (typeof document === "undefined" || !family) return;
  if (loaded.has(family)) return;
  loaded.add(family);
  const id = `font-${family.replace(/\s+/g, "-").toLowerCase()}`;
  if (document.getElementById(id)) return;
  const link = document.createElement("link");
  link.id = id;
  link.rel = "stylesheet";
  link.href = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}:ital,wght@0,400;0,600;0,700;1,400&display=swap`;
  document.head.appendChild(link);
}

export function themeStyle(t?: BrandTheme | null): React.CSSProperties {
  const m = mergeTheme(t);
  ensureFont(m.display_font);
  ensureFont(m.body_font);
  return {
    // Override Tailwind tokens via CSS variables (HSL functional notation).
    ["--background" as any]: `hsl(${m.background})`,
    ["--foreground" as any]: `hsl(${m.foreground})`,
    ["--primary" as any]: `hsl(${m.primary})`,
    ["--primary-foreground" as any]: `hsl(${m.background})`,
    ["--accent" as any]: `hsl(${m.accent})`,
    ["--accent-foreground" as any]: `hsl(${m.background})`,
    ["--ring" as any]: `hsl(${m.accent})`,
    ["--gold" as any]: m.accent, // legacy gold tokens read raw triplet via hsl(var(--gold))
    ["--brand-display" as any]: `'${m.display_font}', Georgia, serif`,
    ["--brand-body" as any]: `'${m.body_font}', system-ui, sans-serif`,
    backgroundColor: `hsl(${m.background})`,
    color: `hsl(${m.foreground})`,
    fontFamily: `'${m.body_font}', system-ui, sans-serif`,
  };
}
