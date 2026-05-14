## Goal

Translate the strategy doc into shipped surface area across landing, content, in-app, and backend — without breaking the existing Agentic Studios aesthetic (black + gold, Instrument Serif, sprocket rails).

## 1. Landing — new "Studio Stack" section

Insert between `Process` and `RoutingLayer` in `MarketingHome.tsx`.

`src/components/agentic-landing/StudioStack.tsx`
- Header: *"The studio runs on a stack of agents."* (italic gold accent on "stack")
- 5 department cards in a film-strip row (sprocket rail top/bottom):
  - Research & Lore → Exa
  - Script & Memory → Fastio
  - Voice → Chatterbox
  - Visual FX → Flux / NanoBanana / LTX Lipdub
  - Automation → Playwright
- Each card: dept name, MCP name, one-line "what it does in the studio", status pill (`Live` / `Scaffolded` / `Planned`).
- Below: horizontal pipeline diagram `Research → Script → Voice → VFX → Distribution` with animated gold pulse traveling left→right (CSS keyframes, respects `prefers-reduced-motion`).

## 2. Landing — Hybrid principles strip

`src/components/agentic-landing/HybridPrinciples.tsx`, inserted after `AgentsGrid`.
4-column responsive grid rendering the Ponder × Agentic table:
| Ponder strength | In Agentic Studios | Result |
Plain semantic table styled with `border-white/10`, gold row hover.

## 3. New `/manifesto` page

`src/pages/Manifesto.tsx` + route in `App.tsx`.
- Hero: *"AI is the crew. The human is the director."*
- Sections: Deep Synthesis · Filmmaker DNA · Visual Mapping · Creator Sovereignty · Human-in-the-Loop policy.
- Footer link added in `Footer.tsx`; navbar gets `Manifesto` link.

## 4. In-app — Studio Pipeline view

New tile on `/app/dashboard` above existing stats:
- 5 department lanes (Research / Script / Voice / VFX / Distribution).
- Each lane reads recent `agent_runs` filtered by a new `department` text column → status dot + last action.
- Click a lane → drawer with last 10 runs.

Migration:
```sql
ALTER TABLE public.agent_runs ADD COLUMN IF NOT EXISTS department text;
CREATE INDEX IF NOT EXISTS idx_agent_runs_department ON public.agent_runs(department);
```

## 5. MCP bridge edge functions (scaffolded, no keys required yet)

Create `supabase/functions/mcp-bridge/index.ts` — single dispatcher:
- `POST { provider: 'exa'|'fastio'|'pexels'|'openlibrary', action, params }`
- Routes to provider sub-handlers. Exa/Fastio handlers return `501 { error: 'not_configured', missing_secret: 'EXA_API_KEY' }` until secrets added.
- Pexels + Open Library handlers work immediately (Open Library is keyless; Pexels uses a publishable-style key — will prompt later).
- CORS, Zod validation, `verify_jwt = false` not needed (default fine).

No secrets requested in this pass — surfaces are scaffolded so the user can decide which providers to wire.

## 6. Memory updates

After build, append to `mem://index.md` Core: "Landing has StudioStack + HybridPrinciples; `/manifesto` page; Dashboard has Pipeline lanes; `mcp-bridge` edge function dispatches Exa/Fastio/Pexels/OpenLibrary."

## Out of scope (this pass)

- Real Exa/Fastio/Chatterbox/ComfyUI integration (needs accounts + keys — follow-up).
- Sequential Thinking MCP orchestration runtime.
- ComfyUI / LTX Lipdub local runner.
- Changes to ReelScene 3D or Auth.

## Technical notes

- All new components use existing tokens (`--gold`, `font-instrument`, `glass-effect`, `brand-sprocket-rail`).
- Pipeline animation: 8s linear infinite, paused under `prefers-reduced-motion`.
- New route lazy-loaded in `App.tsx`.
- `agent_runs.department` nullable; existing rows untouched.
