## What's wrong now

The Agentic Studios landing kept the procedural panorama background but **dropped all of Devin Teer's MonkeY Teer YouTube reel** (the original `DevinReel.tsx` content with 10 video IDs). It also never built the **scroll-driven 3D environment** described in the Claude Opus screenshots — a curved camera track flying through floating "devices" (one per video), each owned by a DOM section.

## What we'll build

A single cohesive 3D scroll experience that **uses every MonkeY Teer YouTube video as a floating cinematic device** inside the existing WebGPU/WebGL panorama world.

### Structure (page = `~700vh` tall, fixed canvas + scrolling DOM)

```text
0–100vh    Hero        equirectangular panorama, gold streaks, "The AI Production Suite"
100–600vh  Reel Track  scroll fires camera along curved spline through 10 floating
                       devices (one per Devin Teer video) — each device renders the
                       YouTube thumbnail as a texture, glowing gold edge, slight
                       tilt + parallax. Active device snaps center, plays on click
                       in a modal (YouTube iframe).
600–700vh  Outro       camera pulls back, all 10 devices visible in formation,
                       MonkeY Teer credit + "Enter the Studio" CTA
Below      DOM         AgentsGrid → PraxisDemo → Process → RoutingLayer →
                       EarlyAccess → Footer (unchanged)
```

### New 3D component: `src/components/agentic-landing/reel/ReelScene.tsx`

- React Three Fiber (`three@0.160`, `@react-three/fiber@^8.18`, `@react-three/drei@^9.122` — already-allowed pinned versions).
- WebGPU detection → uses Three's `WebGPURenderer` when available, otherwise WebGL2 (Three handles fallback).
- Inverted `SphereGeometry` (radius 500) skybox with a procedural shader material reusing the existing `shaders.ts` panorama (ported to a `ShaderMaterial`) so the gold-streak look stays consistent.
- 10 `<Device>` meshes (rounded plane ~1.6:1 ratio, beveled border) positioned along a `THREE.CatmullRomCurve3` spline. Each loads `https://i.ytimg.com/vi/{id}/hqdefault.jpg` as a `TextureLoader` texture mapped to the screen, with a thin gold emissive frame.
- Camera animated by scroll: `t = scrollY / (pageHeight - vh)` clamped 0..1; position = `curve.getPointAt(t)`, lookAt = `curve.getPointAt(t + 0.02)`. Smoothed via `lerp` per frame.
- Mouse parallax: small additive yaw/pitch on camera (±3°).
- Hue drift: panorama shader gets a `uEra` uniform (0→1→2 dawn→dusk→vapor) tied to scroll.
- Idle/hidden tab pauses the render loop; `dpr` capped at 1.75; `prefers-reduced-motion` falls back to a static grid of thumbnails.

### New: `src/components/agentic-landing/reel/devices.ts`

Exports the 10 MonkeY Teer videos copied verbatim from the existing `src/components/mindloop/DevinReel.tsx` (`4sn-nB52bGE`, `OH8ajVijDM8`, `YVOVWfuJ68Y`, `0iiwUgv2U0o`, `ocklAzBhZQM`, `a5nX0nCCIes`, `CiOmC95OnRA`, `V6RIdwkjE_c`, `okf0wKINsvM`, `6L9esv2doHw`) with `title` and `role`.

### New: `src/components/agentic-landing/reel/ReelSection.tsx`

- Wraps `ReelScene` in a `position: fixed; inset: 0; z-index: 0` container.
- Renders 10 scroll "owner" sections (one per device), each `100vh`, with the device's title/role/credit overlaid as text on the right column. The text fades in as that device's `t` window is centered.
- Click on the device (raycast hit in R3F) or the overlay title → opens a YouTube iframe modal (reused dialog from shadcn).

### Hero update

`Hero.tsx` becomes section 1 of the reel. Subtitle changes to **"Watch the work. Then enter the studio."** CTAs remain `Get Early Access` + `Browse Studios`. The "Drag to orbit · Scroll to explore" hint stays.

### MarketingHome update

Insert `<ReelSection />` between `<Hero />` and `<AgentsGrid />`. Remove the standalone `<PanoramaBackground />` from `Hero` because `ReelSection` now owns the global fixed canvas (Hero just becomes a transparent overlay over it).

### Cleanup

- Delete unused `src/components/mindloop/*` files (Hero, CTA, Footer, Logo, Mission, Navbar, SearchChanged, Solution, DevinReel) — Mindloop is fully retired.
- Drop `@fontsource` mindloop-only imports if any (check; Instrument Serif / Inter stay).

### Memory

Update `mem://index.md` Core to note: "Landing reel = fixed R3F scene, scroll-driven curved camera through 10 MonkeY Teer YouTube devices, panorama skybox, click-to-play modal." Mark `mindloop-landing` memory removed.

## Out of scope

No backend changes. No new tables / edge functions. `/app/*`, `/auth`, `/studios` untouched.

## Risk notes

- WebGPU on Three is still experimental; fallback to standard WebGL2 renderer is the default path — WebGPU is opportunistic only.
- YouTube thumbnails are CORS-safe for `TextureLoader` from `i.ytimg.com` (tested pattern). If a thumbnail 404s we fall back to `mqdefault.jpg`.
