## Pivot: Replace site with Mindloop landing + Devin's YouTube content

You want to scrap the current Agentic Studios marketing layout and rebuild the landing as **Mindloop** — a dark monochrome newsletter/content platform — and weave Devin Teer's YouTube videos (https://youtube.com/@monkeyteer) in as a horizontal carousel.

Below is what I'll build, what I need to flag, and what stays vs. goes.

---

### What gets replaced

- `src/pages/MarketingHome.tsx` becomes the Mindloop landing (7 sections, top to bottom).
- All `src/components/marketing/*` (MarketingHero, FiveAgents, Manifesto, Capabilities, Founders, OpenStudio, StudiosStrip, MarketingFooter) are deleted.
- `src/index.css` design tokens are rewritten to pure-monochrome HSL values you specified.
- `tailwind.config.ts` font families switch to **Inter** (sans) + **Instrument Serif** (serif italic accents). 'Bagel Fat One' is removed from the marketing surface.
- Memory entries for the Agentic cinematic aesthetic (hero video, animation prefs, design system, founders/awards/process styling) get rewritten to reflect Mindloop.

### What stays

- All `/app/*` pages, `/auth`, `/onboarding`, `/studios`, `/studios/:slug`, Lovable Cloud backend, auth, and DB schema are untouched. The pivot is **landing-only**.
- shadcn/ui, framer-motion, react-router are already installed.

---

### The 7 Mindloop sections (built per your spec)

1. **Navbar** — fixed transparent, concentric-circles logo + "Mindloop", center nav (Home • How It Works • Philosophy • Use Cases), 3 social icons (Instagram, LinkedIn, Twitter) in `liquid-glass` circular buttons.
2. **Hero** — full viewport, autoplay muted MP4 background (`hf_20260325_120549_...mp4`), avatar trio + "7,000+ subscribed", `text-7xl` heading "Get **Inspired** with Us" (Inspired = serif italic), email subscribe form in liquid-glass pill.
3. **"Search has changed. Have you?"** — 3 platform cards (ChatGPT, Perplexity, Google AI). *Note: I'll use placeholder icons (lucide or simple SVG circles) instead of `icon-chatgpt.png` / `icon-perplexity.png` / `icon-google.png` since you didn't supply those PNGs — easy swap later.*
4. **Mission** — 800x800 looping video + scroll-driven word-by-word reveal using `useScroll` / `useTransform`. Words "curiosity / meets / clarity" highlight white; rest fades from 0.15 → 1 opacity.
5. **Solution** — "SOLUTION" eyebrow, "The platform for **meaningful** content" heading, 3:1 aspect rounded video, 4-column feature grid (Curated Feed, Writer Tools, Community, Distribution).
6. **🎬 Devin's Reel — horizontal carousel** *(your YouTube ask, woven in here)* — placed between Solution and CTA as a dark monochrome strip. Title: "Watch the work" (serif italic on "work"). Horizontal scroll of 16:9 YouTube embeds in `liquid-glass` cards with subtle white border. Click → inline iframe play. *See video-source caveat below.*
7. **CTA** — HLS-streamed background video (`stream.mux.com/...m3u8`) via hls.js, dark overlay, concentric logo, "Start Your **Journey**", two buttons (Subscribe Now solid white + Start Writing liquid-glass).
8. **Footer** — © 2026 Mindloop + Privacy / Terms / Contact links.

### Design system rewrite (`src/index.css`)

- All HSL tokens swapped to your monochrome palette (`--background: 0 0% 0%`, `--foreground: 0 0% 100%`, `--accent: 170 15% 45%`, etc.).
- New global `.liquid-glass` class with the inset highlight + masked gradient border you specified.
- New `fadeUp(delay)` helper exported from `src/lib/animations.ts` for reuse.

### Dependencies to install

- `hls.js` — for the CTA streaming background.
- `@fontsource/inter` (400/500/600/700) + `@fontsource/instrument-serif` (400 + 400-italic) — imported in `main.tsx`.
- framer-motion is already installed.

---

### ⚠️ Critical caveat on Devin's YouTube videos

You sent the channel URL `youtube.com/@monkeyteer`. **I cannot scrape YouTube to fetch his actual video IDs** — there's no YouTube API key configured and scraping the channel page from an edge function is fragile and against ToS.

**Options for the carousel content** (pick one — I'll default to option B if you don't say):

- **A.** You paste 4–8 specific YouTube URLs/IDs from his channel into the next message, and I hardcode them into the carousel.
- **B.** I ship the carousel with **6 placeholder YouTube IDs** (a mix of well-known cinematic/film-related videos as visual stand-ins) and clearly comment `// TODO: replace with Devin's video IDs` so you can swap them in 30 seconds.
- **C.** I add a small admin-only edit UI on `/app/settings` where you paste IDs and they save to a new `featured_videos` Supabase table — slower to build (~adds ~15 min), but no code edit needed later.

### Effects on rest of the app

- The `/app/*` cinematic dark-glass theme uses CSS tokens that are about to change. I'll **scope the new Mindloop tokens to the marketing route only** (via a wrapper class like `.mindloop` on `MarketingHome` root) so the app surfaces keep their existing look. No app pages need touching.
- The `MarketingHero` Open-Your-Studio CTA going to `/auth` is replaced by Mindloop's "Subscribe Now" / "Start Writing" — both will route to `/auth` so the funnel still works.

### Memory updates

- Rewrite Core memory: brand becomes "Mindloop — dark monochrome newsletter platform". Move "Agentic Studios" to a legacy memory file in case you pivot back.
- New memory: `mem://style/mindloop-tokens` (HSL palette + liquid-glass class).
- Delete stale memory: hero-video (S3 moon webm), founders/awards/process styling, Bagel Fat One reference.

---

### Open questions before I build

1. **Video IDs for Devin's carousel — A, B, or C above?**
2. **Keep `/app/*` Agentic Studios product as-is, or also rebrand the in-app surfaces to Mindloop?** (Recommend keep as-is for now — the app works and rebranding it is a separate ~30 min job.)
3. **Hero subscribe form** — should it actually subscribe (write to a new `subscribers` table in Lovable Cloud) or just route to `/auth`? (Spec implies real subscribe.)

Approve to proceed, or answer the 3 questions and I'll incorporate before building.