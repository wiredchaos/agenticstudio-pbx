# Agentic Studios — Full Build on the MOJJU Foundation

Replace all template content with the Agentic Studios product while preserving the cinematic dark aesthetic (Bagel Fat display font, glass-effect surfaces, dark background, hero video, slow framer-motion animations). MOJJU's moon video stays in the hero for now — to be swapped for Devin's reel before the deck.

## What you'll get

A fully clickable product where:
- **Marketing site at `/`** speaks as Agentic Studios with new copy, CTAs, and section flow.
- **App at `/app/*`** lives behind magic-link auth with a left sidebar and 11 working pages.
- **Real backend** (Lovable Cloud): 11 tables with row-level security, magic-link auth, studio onboarding, Realtime channels for agent activity.
- **Agent outputs are mocked but feel real** — no Lorem Ipsum, realistic film-industry copy, streaming-style "thinking" log lines, three-action approve/distribute/inscribe flow on every output.

## Aesthetic rules (non-negotiable)

- Keep Bagel Fat One for display, dark background, `glass-effect` / `glass-navbar` utilities, slow framer-motion entrances.
- Marketing pages = full-bleed cinematic. App pages = cinematic-adjacent: dark sidebar + dark panels + glass cards, no white SaaS chrome.
- No new fonts, no light theme, no bright accents beyond the existing red CTA and the accent-blue/emerald/purple already in the system.

## Marketing site (`/`)

Rewrite the existing single-page sections in place — same component shells, new content:

- **Hero** — Keep moon video. Headline: "THE STUDIO RUNS ITSELF. SO YOU CAN DIRECT." Subtitle: "Agentic Studios — a platform of director-owned AI studios. Built on open infrastructure." Primary CTA "Open Your Studio" → `/auth`. Secondary CTA "See Devin Teer's Studio" → `/studios/monkey-teer`. Nav becomes: Studios · Agents · Process · Manifesto · Open Your Studio.
- **Studios strip** (replaces Portfolio) — MonkeY Teer Studio featured card + 3 placeholder "sister studio" cards ("Coming soon").
- **The Five Agents** (replaces Awards) — NEXUS, PRAXIS, SCRIBE, ARCHITECT, EGOS as five dark glass cards with one-line job descriptions and the agent's model footprint.
- **Process / Manifesto** (reuses About) — "Directors keep the archive. Models query, never store. Approvals first-class. Open infrastructure." Mood-poetry copy, not feature bullets.
- **Capabilities** (reuses Services) — Director's Twin, Line Producing, World Building, Wardrobe & Character, Distribution.
- **Founders** (reuses Team) — Devin Teer + placeholder slots, keeps the "Most Wanted" treatment.
- **Contact / Open Your Studio** — CTA section pushing to `/auth`. Existing form stays for press inquiries.
- **Footer** — Updated brand, links to /studios, /manifesto, social placeholders.

## App shell

- `react-router-dom` with `BrowserRouter` in `main.tsx`.
- Routes: `/` (marketing), `/auth` (magic link), `/onboarding` (create studio), `/app/*` (protected).
- `/app` layout: `SidebarProvider` + dark `AppSidebar` with sections **Workspace** (Dashboard, Archive, DNA, Distribution), **Agents** (Nexus, Praxis, Scribe, Architect, Egos), **Platform** (Studios, Settings). Always-visible `SidebarTrigger` in a slim top bar that also shows current studio name + Day Back counter.
- `ProtectedRoute` wrapper redirects to `/auth` if no session; redirects to `/onboarding` if session but no studio yet.

## The 11 pages

Every page is real, scrollable, and clickable. Agent outputs are read from seeded mock data so the UI behaves like the real product.

1. **`/app/dashboard` — NEXUS home.** Active projects grid, live "Agent activity" feed (subscribed to Realtime `studios.{id}.runs`), "Decisions awaiting your approval" stack with approve/reject inline, Runway credits meter, Day Back counter (hours saved this week, animated tick-up).
2. **`/app/agents/praxis` — Director's Twin.** Script/scene textarea → "Generate shot list" button → mocked 12-shot list (lens, framing, movement, duration). Each shot has a previz placeholder card with side-by-side "generic prompt" vs "your DNA loaded" comparison. Per-shot Approve / Send to Distribution / Inscribe buttons. Collapsible `<think>` panel showing streaming reasoning.
3. **`/app/agents/scribe` — Writer + Line Producer.** Script upload (file picker, mocked parse). Returns editable spreadsheet (shadcn Table): scene breakdown, cast + agency-fee estimates, locations + costs, props, E&O insurance, marketing budget. Totals row. Export button (mocked).
4. **`/app/agents/architect` — World Builder.** Location/mood input. ShotDeck-style grid of plate references (placeholder images with realistic captions: "Magic hour, Mojave, 35mm"). "Suggested real locations" panel with map pin list.
5. **`/app/agents/egos` — Designer.** Pinterest-style masonry moodboard of wardrobe + character sheets. Per-character mini profiles. Add/remove cards.
6. **`/app/archive` — Director's library.** Criterion-shelf visual layout. Ingestion progress bars: frames extracted, dialogue transcribed, vision tagging, embeddings. Big "X TB indexed" stat. Footnote: "Archive stays on your infrastructure. Models query, never store."
7. **`/app/dna` — Director DNA.** Editable fields: lens preferences, color palette (swatches), pacing, lighting, blocking habits, recurring motifs. Version history list. Public/private toggle.
8. **`/app/distribution` — Outputs queue.** Per-channel columns (Social, Festivals, Web3 Inscription, Licensing). Cards move through Queued → Processing → Sent. All mocked.
9. **`/app/studios` — Public directory.** Grid of studio cards. MonkeY Teer is real; sisters are placeholders. Public route — also reachable at `/studios` without auth.
10. **`/studios/:slug` — Public studio profile.** Founder, recent projects, DNA preview if public toggle is on. Public route, no auth.
11. **`/app/settings` — Keys + infrastructure.** Forms for Runway API key, Hermes/OpenRouter, Anthropic, model routes (default = Hermes 4 stack), Web3 wallet, archive ingestion preferences, Managed vs Sovereign toggle. Keys saved as Lovable Cloud secrets, never in plain DB columns.

## Auth + onboarding

- Email magic link via Supabase. `signInWithOtp({ email, options: { emailRedirectTo: window.location.origin + '/onboarding' } })`.
- `onboarding` form: studio name, founder name, archive size estimate, optional Web3 wallet, style notes → creates `studios` row and `directors` row, then routes to `/app/dashboard`.
- `useAuth` hook sets up `onAuthStateChange` before `getSession`.

## Database (Lovable Cloud)

11 tables, all with RLS. Director can only see their own studio's data; public studio profiles readable by anyone.

`directors` (1:1 with `auth.users`), `studios` (owner = director), `projects`, `agents` (5 seeded rows: nexus/praxis/scribe/architect/egos), `agent_runs` (with `status`, `input`, `output`, `thinking_log`, `awaiting_approval`), `assets` (links to runs, has `approval_state`), `archive_items` (ingestion progress per file), `director_dna` (jsonb profile, `is_public` flag, version), `runway_calls` (mocked usage tracking), `distribution_handoffs` (channel + status), `model_routes` (per-agent model overrides).

Realtime publication on `agent_runs`, `assets`, `director_dna` so dashboard activity feed and approval stack update live.

Seeded data: MonkeY Teer Studio + Devin Teer director + 3 sample projects + ~20 agent_runs + DNA profile + ~8 archive_items + a few distribution_handoffs, so a logged-in demo account sees a populated product immediately.

## Three things flagged from your message

- **Moon video stays.** TODO marker in `Hero.tsx` so it's easy to swap when Devin's reel arrives.
- **Marketing vs app aesthetic divergence is expected.** Marketing pages full-bleed cinematic; app pages dark glass + sidebar. Same color and type system — different density. Not a bug.
- **Screenshots before the deck.** After build, dashboard and PRAXIS are the two screens to send Devin first.

## Out of scope for v1

- Real Runway / Hermes / Anthropic API calls — all mocked behind the agent_run pattern so swapping in real calls later only touches the agent edge functions.
- Real Web3 inscription — "Inscribe to chain" button shows a success toast and writes a mock entry.
- Real file upload to archive — picker is wired, but ingestion progress is simulated.
- Real distribution to social/festivals/licensing — queue UI works, sending is mocked.
- Email templates customization — defaults until you ask.

## Honest expectations

11 pages + auth + 11 tables + realtime + marketing rewrite is a large single-pass build. Expect:
- Some pages (Dashboard, PRAXIS, Studios) will feel polished.
- Others (Distribution, Settings, Egos) will be functional but want a second pass for visual richness.
- After the first build lands, plan 2–3 follow-up prompts for: (a) PRAXIS depth, (b) marketing copy polish to match MOJJU mood-poetry, (c) sidebar/app-shell visual tightening.

## Technical notes

- `BrowserRouter` in `main.tsx`, `Routes` moved into `App.tsx`. Marketing sections extracted into a `<MarketingHome />` page so `/` stays unchanged structurally.
- Roles: even though there's only one role today (`director`), use the `user_roles` + `app_role` enum + `has_role()` security-definer pattern from the start so future `admin` / `viewer` additions don't require migration.
- API keys (`RUNWAY_API_KEY`, etc.) stored as Lovable Cloud secrets, settings page writes through an edge function — never to a DB column.
- Realtime: enable replication on `agent_runs`, `assets`, `director_dna`; subscribe per-studio with channel filters.
- Use `tanstack-query` (already installed) for all DB reads; Realtime subscriptions invalidate queries.
- Animations stay slow per existing preference (8s film grain, gentle wobbles); new pages reuse `gentle-animation`, `glass-effect`, `pulse-glow`.
