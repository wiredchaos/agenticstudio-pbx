## Plan: Embed Videos + Animate Artifacts on Landing

Bring the generated brand assets into the live site and add motion so they feel native to the Agentic Studios reel — not bolted on.

### What gets shipped

**Three brand videos**, copied from `/mnt/documents/video/` into `public/video/`:
- `agentic-launch.mp4` → opens the page in a new **HeroFilm** above the reel
- `agentic-bio.mp4` → embedded inside a new **BrandFilm** section (between AgentsGrid and PraxisDemo) as the "manifesto" piece
- `agentic-how-to.mp4` → embedded inside Process as a "Studio tour" reveal

**Brand artifacts**, copied from `/mnt/documents/brand/` into `public/brand/`:
- `agentic-mark.png` (the gold sprocket "A")
- `agentic-lockup.png` / `agentic-lockup-on-black.png`
- `agentic-wordmark.png`

### Section-by-section changes

```text
/  (MarketingHome)
├── Navbar                    ← swap text wordmark for animated <BrandMark> (gold mark + lockup, slow shimmer)
├── HeroFilm        [NEW]     ← full-bleed agentic-launch.mp4, autoplay/muted/loop, gold sprocket overlays
├── ReelSection               ← unchanged (3D scene)
├── AgentsGrid                ← each agent card: stagger-fade on scroll, gold underline draw on hover
├── BrandFilm       [NEW]     ← agentic-bio.mp4 in a 21:9 letterbox frame with sprocket rails
│                                kinetic title "The studio, in 25 seconds." (italic gold accent word)
├── PraxisDemo                ← unchanged
├── Process                   ← inline agentic-how-to.mp4 panel ("Take the studio tour")
│                                + scroll-triggered step number reveal
├── RoutingLayer              ← animated agent badges using brand mark
├── EarlyAccess               ← lockup logo above headline, slow gold-glow pulse
└── Footer                    ← wordmark with subtle drift
```

### Motion system (consistent across all artifacts)

- **Entrance:** `IntersectionObserver` → fade + 16px rise, 600ms ease-out, staggered 80ms between siblings
- **Mark/lockup idle:** very slow gold shimmer (CSS `@keyframes shimmer` 8s linear, mask-image gradient sweep)
- **Hover on logo:** sprocket mark rotates 6° + scales 1.04 (200ms)
- **Video frames:** thin gold border draws in via `clip-path` on first scroll-into-view, sprocket dots tick along the rail at 24fps illusion
- **Reduced motion:** all of the above collapse to plain fade-in

### Video player behavior

Single shared `<BrandVideo>` component:
- `autoplay muted playsinline loop` by default for ambient sections (HeroFilm, RoutingLayer ambience)
- Click-to-unmute pill ("🔊 Sound on") in the corner — mute toggles `video.muted`
- Lazy-load via `preload="metadata"` + `IntersectionObserver` (only loads sources when within 1 viewport)
- Poster frame: extracted from each video using ffmpeg in setup step, saved as `public/video/<name>.jpg`
- Falls back to first frame of `agentic-launch.mp4` for the hero if poster generation fails
- Wrapped in a 16:9 (or 21:9 for BrandFilm) container with film-sprocket rails reused from `FilmStripRail`

### Files

**New:**
- `src/components/agentic-landing/BrandMark.tsx` — animated logo (mark + wordmark variants)
- `src/components/agentic-landing/BrandVideo.tsx` — reusable video player with sprocket frame
- `src/components/agentic-landing/HeroFilm.tsx` — top-of-page launch video
- `src/components/agentic-landing/BrandFilm.tsx` — bio video section
- `src/hooks/useReveal.ts` — IntersectionObserver-based fade-in hook
- `public/video/agentic-launch.mp4`, `agentic-bio.mp4`, `agentic-how-to.mp4` (+ matching `.jpg` posters)
- `public/brand/agentic-mark.png`, `agentic-lockup.png`, `agentic-wordmark.png`

**Edited:**
- `src/pages/MarketingHome.tsx` — insert HeroFilm + BrandFilm
- `src/components/agentic-landing/Navbar.tsx` — use `<BrandMark variant="lockup" />`
- `src/components/agentic-landing/Process.tsx` — embed how-to video panel
- `src/components/agentic-landing/AgentsGrid.tsx` — add reveal hook + hover underline
- `src/components/agentic-landing/EarlyAccess.tsx` — lockup with glow pulse
- `src/components/agentic-landing/Footer.tsx` — wordmark drift
- `src/index.css` — add `@keyframes shimmer`, `goldGlow`, `sprocketTick`, `revealRise`

### Out of scope

- Re-recording or re-editing the videos themselves
- Adding a voiceover audio track
- Any changes to `/app/*`, `/auth`, `/onboarding`, or backend
- Any new database tables, edge functions, or RLS changes
- Touching the 3D ReelScene (already has its own motion system)

### Verification

After implementation: load `/`, confirm hero video autoplays muted, scroll through and confirm each video lazy-loads + each artifact reveals on scroll, toggle `prefers-reduced-motion` and confirm motion collapses to simple fades.
