## Goal

Each studio inherits its own brand aesthetic (colors, typography, logo, hero media) and unlocks features based on a tier. Existing `basic` studios stay on the default Agentic look; `premium` studios (starting with MonkeY Teer) get the full funnel: custom theme, hero video, public profile, lead magnet, model routes, distribution.

## 1. Schema (one migration)

Add to `public.studios`:
- `brand_theme jsonb NOT NULL DEFAULT '{}'::jsonb`
  ```json
  {
    "primary": "0 0% 90%",       // hsl triplet
    "accent":  "45 56% 51%",
    "background": "0 0% 4%",
    "foreground": "0 0% 98%",
    "display_font": "Instrument Serif",
    "body_font":    "Inter",
    "logo_url":     "/brand/agentic-mark.png",
    "wordmark_url": "/brand/agentic-wordmark.png",
    "hero_media_url": null,
    "hero_media_kind": "image"   // "image" | "video"
  }
  ```
- `tier text NOT NULL DEFAULT 'basic'` — values: `basic`, `premium`.
- `funnel jsonb NOT NULL DEFAULT '{}'::jsonb` — per-feature flags (`lead_magnet`, `custom_domain_cta`, `email_capture`, `pricing_block`, `testimonials`, `cta_buttons[]`).

Seed `MonkeY Teer` row with `tier='premium'` and a brand_theme inspired by devinteer.com (dark, gold/amber accent, Instrument Serif display) plus hero video URL pointing at one of the existing `/video/agentic-*.mp4` assets.

## 2. Theme runtime

New `src/lib/studioTheme.ts`:
- `applyStudioTheme(theme)` — sets CSS variables on a scoped root: `--primary`, `--accent`, `--background`, `--foreground`, `--brand-display`, `--brand-body`. Loads display/body fonts from Google Fonts on demand (idempotent `<link>` injection).
- `useStudioTheme(studio)` hook — applies on mount, restores Agentic defaults on unmount.

New `src/components/studio/StudioThemeProvider.tsx`:
- Wraps children in a `<div data-studio-theme>` whose inline `style` carries the HSL vars + `font-family` overrides.
- Exposes `useBrand()` for logo/wordmark/hero.

CSS additions in `index.css`:
- `[data-studio-theme]` selector re-binds the same tokens used by Tailwind/Agentic components, so any Agentic primitive (`bg-background`, `text-foreground`, `border-primary`) automatically restyles inside a themed scope. Gold-specific selectors fall back to `--accent`.

## 3. Surfaces that adopt the studio theme

- **Public**: `/studios/:slug` (`StudioPublic.tsx`) — wrap entire page in `StudioThemeProvider`. Replace the hardcoded "Agentic Studios" wordmark with the studio's logo. Hero block renders studio's `hero_media` (video autoplays muted+loop on premium, image on basic). Premium adds: lead-magnet email capture (writes to `early_access` with `source = studio:<slug>`), pricing/CTA block, testimonial strip, custom-domain CTA. Basic stays minimal (current layout).
- **In-app**: `AppLayout.tsx` — wrap in `StudioThemeProvider` keyed by active studio so the dashboard adopts the brand's primary/accent. Sidebar logo swaps to studio's `logo_url`.
- **Studios directory** (`StudiosDirectory.tsx`): each card renders in its own theme swatch (mini preview).

## 4. Funnel feature gating

`src/lib/tier.ts` — `hasFeature(studio, key)` reads `funnel` for premium, returns `false` for basic by default (with a small allowlist so basic still gets `email_capture` minimally).

Premium-only blocks rendered conditionally on the public profile:
- Hero video reel (basic = static cover)
- Lead magnet form (free download / waitlist)
- Pricing / CTA buttons array
- Testimonials carousel
- "Powered by Agentic Studios" lockup at the bottom (basic shows it prominently, premium can hide / co-brand)

## 5. In-app brand editor (premium only)

Extend `src/pages/app/Settings.tsx` with a **Brand** card visible only when `tier === 'premium'`:
- Color pickers (primary / accent / background) → stored as HSL triplets
- Display + body font selectors (curated list of Google Fonts)
- Logo + wordmark URL inputs
- Hero media URL + kind toggle
- Funnel toggles (lead magnet, pricing, testimonials, custom-domain CTA)
- Live preview pane wrapped in `StudioThemeProvider`

Basic studios see a locked "Upgrade to premium" card describing what unlocks (no payment wiring in this pass — just a CTA that opens early-access).

## 6. Data seed

`supabase--insert` after migration:
- Update existing MonkeY Teer studio row with `tier='premium'` and a fully populated `brand_theme` + `funnel` (lead_magnet, pricing, testimonials, hero video pointing at `/video/agentic-launch.mp4`, accent gold `45 70% 55%`, display `Instrument Serif`, body `Inter`).

## 7. Memory

Update `mem://index.md` Core with: studios carry `brand_theme` + `tier`; `StudioThemeProvider` re-themes `/studios/:slug` and `/app/*` per active studio; MonkeY Teer is `premium`, all others `basic`.

## Out of scope

- Auto-extracting brand from a URL (can ship later as an edge function feeding `brand_theme`).
- Real payments / Stripe upgrade flow.
- Per-studio custom domains (CTA only).

## Technical notes

```text
studios
 ├── tier: 'basic' | 'premium'
 ├── brand_theme: { primary, accent, background, foreground,
 │                  display_font, body_font, logo_url,
 │                  wordmark_url, hero_media_url, hero_media_kind }
 └── funnel: { lead_magnet, pricing_block, testimonials,
               custom_domain_cta, cta_buttons[] }

StudioThemeProvider
 └── injects CSS vars + font links, scoped to <div data-studio-theme>

hasFeature(studio, key)
 └── basic  → allowlist-only
 └── premium → reads studio.funnel
```

New files:
- `src/lib/studioTheme.ts`
- `src/lib/tier.ts`
- `src/components/studio/StudioThemeProvider.tsx`
- `src/components/studio/BrandHero.tsx`
- `src/components/studio/LeadMagnet.tsx`
- `src/components/studio/PricingBlock.tsx`
- `src/components/app/BrandSettings.tsx`

Edited files:
- `supabase` migration (1)
- `src/index.css` (scoped token bindings)
- `src/pages/StudioPublic.tsx`
- `src/pages/app/AppLayout.tsx`
- `src/pages/app/Settings.tsx`
- `src/pages/StudiosDirectory.tsx`
- `mem://index.md`
