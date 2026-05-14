## Revised plan — drop ElevenLabs, use built-in/free audio

Lovable AI Gateway covers text + images but **not music generation**. So instead of generating tracks at build time, we ship the 5 ambient mixes as **curated royalty-free streams** referenced by URL — no API key, no edge function, no asset bundling needed up front.

### 1. Audio source

Use 5 CC0 / royalty-free loops hosted on a public CDN (e.g. `cdn.pixabay.com/audio/...` or `freesound.org` direct MP3s). One short looping track per genre:

- **EDM** — driving 4-on-the-floor loop
- **World** — global percussion + flute
- **Lofi Hip Hop** — mellow beats
- **Samba** — Brazilian percussion
- **Afrobass** — afrobeat groove

Stored as a constant map in `src/components/audio/mixTracks.ts`:

```ts
export const MIX_TRACKS = {
  lofi:     { label: "Lofi Hip Hop", url: "https://cdn.pixabay.com/...mp3" },
  edm:      { label: "EDM",          url: "..." },
  world:    { label: "World",        url: "..." },
  samba:    { label: "Samba",        url: "..." },
  afrobass: { label: "Afrobass",     url: "..." },
} as const;
```

If a URL ever 404s, swap it — no rebuild of audio assets.

### 2. `MixPlayer.tsx` (new)

Bottom-right floating glass pill, visible only over the 3D reel:

- Genre buttons (5) + mute toggle
- Single `<audio loop>` element; switching genre = swap `src` + fade gain via WebAudio
- Default **muted** (browser autoplay policy); first user click unmutes and starts playback
- Reads default genre from `studio.brand_theme.audio_mix` (landing default = `lofi`)
- Persists last choice in `localStorage("mix:genre")`

### 3. 3D reel as premium per-studio feature

Refactor `src/components/agentic-landing/reel/`:

- `ReelSection` accepts props `{ videos, heading, subheading, accentHsl, ctaHref?, ctaLabel?, defaultMix? }` instead of importing `DEVICES`.
- `ReelScene` accepts `{ videos, accentHsl, scrollRef, onOpen }` — accent color drives frame/glow/text instead of hardcoded gold.
- New `src/components/studio/StudioReel.tsx` reads active studio's `funnel.reel_videos` + `brand_theme.accent` + `brand_theme.audio_mix` and renders `<ReelSection>`.
- `MarketingHome.tsx` passes the existing `DEVICES` constant + `lofi` default explicitly.

### 4. Premium gating

- `src/lib/tier.ts` — add `reel_3d` to the premium-only feature set.
- `StudioPublic.tsx` — render `<StudioReel />` when `hasFeature(studio,'reel_3d')` and `funnel.reel_videos?.length > 0`.
- Basic studios: nothing extra. Premium with no videos configured: small owner-only "Add YouTube reel in Settings" hint.

### 5. Studio settings (premium only)

Extend `BrandSettings.tsx`:

- **Reel videos** editor — list of up to 10 entries (YouTube ID, Title, Role). Stored in `studios.funnel.reel_videos`.
- **Default audio mix** — `<select>` of the 5 genres. Stored in `brand_theme.audio_mix`.
- **Enable 3D Reel** toggle — sets `funnel.reel_3d`.
- Basic tier sees the existing "Upgrade" lock card.

### 6. Schema

No migration. `funnel` and `brand_theme` are already `jsonb`; new keys (`reel_videos`, `audio_mix`, `reel_3d`) are additive.

### Files

- **new**: `src/components/studio/StudioReel.tsx`, `src/components/audio/MixPlayer.tsx`, `src/components/audio/mixTracks.ts`
- **edit**: `src/components/agentic-landing/reel/ReelSection.tsx`, `src/components/agentic-landing/reel/ReelScene.tsx`, `src/lib/tier.ts`, `src/lib/studioTheme.ts` (add `audio_mix` to `BrandTheme`, `reel_videos`/`reel_3d` to `StudioFunnel`), `src/pages/StudioPublic.tsx`, `src/components/app/BrandSettings.tsx`, `src/pages/MarketingHome.tsx`

### Out of scope

- Generating original music (deferred — can add ElevenLabs later if you want unique tracks)
- Per-track volume/EQ
- User-uploaded audio
