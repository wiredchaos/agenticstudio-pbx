## 1. Hero video

- Copy the upload to `public/video/hero-loop.mp4`.
- `HeroFilm.tsx`: add a fixed/absolute background `<video>` (autoplay, muted, loop, playsInline, `object-cover`, ~25% opacity, behind existing copy). Falls back to current treatment under `prefers-reduced-motion`.

## 2. Footer copy

`src/components/agentic-landing/Footer.tsx` — replace the © line with:

```
AGENTICstudio · a MonKeY Teer collaboration
powered by 789 Studios · engineered by neurometax.com
```

`789 Studios` links to `https://789studios.com`, `neurometax.com` links to `https://neurometax.com`. Year stays.

## 3. Two new studios (data only)

Two `directors` rows (placeholder, `user_id = NULL`) + two `studios` rows (`is_public = true`, `tier = 'premium'` so they get the full themed profile + funnel).

**789 Studios** — `slug: 789-studios`
- Brand theme: black bg `0 0% 4%`, neon yellow accent `52 100% 55%`, **Archivo Black** display, **Inter** body, tagline "Cartoons. Chaos. Crypto.", logo at `https://789studios.com/favicon.ico`.
- Funnel: pricing CTA → `https://789studios.com`.

**NETERU** — `slug: neteru`
- Brand theme: black bg `0 0% 2%`, teal accent `170 80% 45%`, **Cormorant Garamond** display, **Inter** body, tagline "Confirmation over trust.", logo from `neteru.xyz`.
- Funnel: CTAs → `https://neteru.xyz`, `https://ntru.vercel.app`.

Both saved via `supabase--insert` (no schema changes — columns exist).

## Out of scope

- Scraping live brand assets / hosting their logos locally — uses their own URLs.
- Connecting these studios to a real owner account (placeholder directors).

## Files

- new: `public/video/hero-loop.mp4`
- edit: `src/components/agentic-landing/HeroFilm.tsx`, `src/components/agentic-landing/Footer.tsx`
- data: 2 inserts into `directors` + `studios`
