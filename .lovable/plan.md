## Goal

Replace ALL Mindloop content on the public landing (`/`) with **Agentic Studios** — matched 1:1 to the Replit reference (https://agentic-studio.replit.app/). Add a **WebGPU 360° equirectangular procedural panorama** as the hero background, with **drag-to-orbit + scroll-to-explore + mouse parallax**. Wire core backend pieces (early-access capture + PRAXIS demo).

Reference visual language (from screenshot):
- Pure black bg, gold accent `#C9A53A`-ish, cream serif headline (Instrument/Playfair-style), film-strip sprocket rails on far left/right edges, faint vanishing-point light streaks.
- Wordmark "AGENTIC **STUDIOS**" top-left; "STUDIOS" + "SIGN IN" top-right (gold-bordered button).
- Hero copy: "MONKEY TEER STUDIOS · POWERED BY AGENTIC STUDIOS" eyebrow → "The AI _Production_ Suite." → "Five agents. One studio. Built for directors who think in images." → [Get Early Access →] [Browse Studios] → "Drag to orbit · Scroll to explore".

---

## Scope

### 1. Rip out Mindloop from the landing
- `src/pages/MarketingHome.tsx` no longer renders any `components/mindloop/*`.
- Delete the `mindloop` folder usage from the route (files can stay on disk; route stops importing them — keeps git diff small and unblocks reverts). New components live in `src/components/agentic-landing/`.
- Drop the `.mindloop` wrapper class.
- Update `<title>` / meta to "Agentic Studios — The AI Production Suite."

### 2. New section components (1:1 with reference)

`src/components/agentic-landing/`
- `Navbar.tsx` — left wordmark, right links (Studios, Sign In gold-bordered).
- `Hero.tsx` — eyebrow, serif headline with italic "Production", subhead, dual CTA, hint line. Renders `PanoramaBackground` behind it.
- `AgentsGrid.tsx` — "Five Agents — Your studio, staffed." 5 cards: NEXUS Orchestrator, PRAXIS Director's Twin, SCRIBE Line Producer, ARCHITECT World Builder, EGOS Designer.
- `PraxisDemo.tsx` — "Try PRAXIS" textarea (max 500), submit → calls edge function `praxis-demo`, streams shot list. Rate-limit hint "3 free demo runs per hour".
- `Process.tsx` — 01 Set your DNA · 02 Brief an agent · 03 Ship it.
- `RoutingLayer.tsx` — "Hermes 4 · OpenRouter" trust strip.
- `EarlyAccess.tsx` — magic-link email capture → writes to `early_access` table + triggers Supabase magic-link email.
- `Footer.tsx` — minimal.

### 3. WebGPU panoramic 360° background — `PanoramaBackground.tsx`

Renders a fullscreen canvas behind the hero (and continuing as the page-long fixed bg).

- **Renderer**: WebGPU first via `navigator.gpu.requestAdapter()`. WGSL fragment shader generates a **procedural equirectangular panorama** (no video file needed — meets "generative procedural").
- **Procedural look**: dark cinematic vignette with slow-drifting volumetric light streaks (matches the gold vanishing-point streaks in the reference) + film-grain noise + subtle nebula gradient using fbm noise. Gold accent colour driven by a uniform.
- **Camera**: equirectangular sampling via fragment shader — yaw/pitch uniforms map screen UV → spherical direction → sample procedural sky. No mesh needed; full-screen triangle with WGSL doing the math (cheaper than a sphere mesh, perfect for a backdrop).
- **Interaction**:
  - **Drag-to-orbit**: pointerdown/move updates target yaw/pitch. Pitch clamped ±60°.
  - **Mouse parallax** (no drag): pointer position adds ±5° micro-offset.
  - **Scroll-to-explore**: `window.scrollY` → forward "dolly" uniform (FOV narrows + parallax depth increases) so panorama feels like it's pulling in as the user scrolls through sections.
  - Per-frame `lerp(current, target, 0.08)` smoothing.
- **Fallbacks** (CRITICAL — the sandbox preview has no GPU adapter):
  1. `navigator.gpu` missing → WebGL2 fragment-shader fallback (same GLSL port of the WGSL).
  2. WebGL2 missing → static CSS gradient + film-strip rails so the page still ships.
- **Perf**: `dpr` capped at 1.75, render loop pauses when tab hidden + when no interaction & scroll for >2s.
- **WGSL hygiene**: avoid reserved words (`meta`, `target`); use `info`, `dest`. Pad `vec3` uniforms to `vec4`.

### 4. Backend (Lovable Cloud)

Migration via the database tool:

```sql
-- early_access signups
create table public.early_access (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  source text default 'landing',
  created_at timestamptz default now()
);
alter table public.early_access enable row level security;
create policy "anon insert" on public.early_access
  for insert to anon with check (true);
-- no select policy → list stays private

-- praxis_demo_runs (rate limit: 3/hour/IP)
create table public.praxis_demo_runs (
  id uuid primary key default gen_random_uuid(),
  ip_hash text not null,
  prompt text not null,
  output text,
  created_at timestamptz default now()
);
alter table public.praxis_demo_runs enable row level security;
-- only edge function (service role) writes; no client policies
create index on public.praxis_demo_runs (ip_hash, created_at desc);
```

Edge functions (auto-deployed, `verify_jwt = false` in `supabase/config.toml`):
- `supabase/functions/early-access/index.ts` — validates email, inserts row, triggers `supabase.auth.signInWithOtp` so user gets the magic link.
- `supabase/functions/praxis-demo/index.ts` — hashes IP, checks `praxis_demo_runs` count in last 60min (≥3 → 429), then streams a shot list via **Lovable AI Gateway** using `google/gemini-2.5-flash` (no API key needed). Logs the run.

### 5. Memory updates

- `mem://index.md` Core: replace the Mindloop landing line with: *"Public landing `/` is Agentic Studios (1:1 with replit ref): black bg, gold accent, serif headline, film-strip rails, WebGPU procedural 360° panorama hero (drag/scroll/parallax)."*
- New file `mem://design/agentic-landing` with tokens (colors, fonts, sprocket-rail spec, panorama interaction params).
- Mark `mem://design/mindloop-landing` as **superseded — landing replaced by Agentic Studios**.

---

## Files

**Create**
- `src/components/agentic-landing/{Navbar,Hero,AgentsGrid,PraxisDemo,Process,RoutingLayer,EarlyAccess,Footer,FilmStripRail}.tsx`
- `src/components/agentic-landing/panorama/{PanoramaBackground.tsx,webgpu.ts,webgl-fallback.ts,shaders.wgsl.ts,shaders.glsl.ts}`
- `supabase/functions/early-access/index.ts`
- `supabase/functions/praxis-demo/index.ts`
- `mem://design/agentic-landing`

**Edit**
- `src/pages/MarketingHome.tsx` — swap to Agentic sections.
- `src/index.css` / `tailwind.config.ts` — add `--accent-gold: 45 56% 51%`, serif font (Instrument Serif via Google Fonts in `index.html`).
- `index.html` — title, meta, font preconnect.
- `supabase/config.toml` — function blocks for the two new edge functions.
- `mem://index.md` — Core line + memories list.

**Untouched**
- `/app/*`, `/auth`, `/studios`, `/onboarding`. Agentic Studios product app stays exactly as is.

---

## Acceptance

- `/` is Agentic Studios — zero Mindloop strings on screen.
- Hero matches reference: black bg, gold sprocket rails, eyebrow + cream-serif headline with gold italic "Production", dual CTA, hint line.
- Panorama: WebGPU when available, WebGL2 fallback otherwise, CSS gradient last-resort. Drag rotates, scroll dollies, mouse parallaxes. No console errors in sandbox preview (fallback engages).
- Early-access form writes to `early_access` and sends magic link.
- PRAXIS demo returns a streamed shot list and enforces 3/hr/IP.
- `/app/*` and other routes unchanged.
