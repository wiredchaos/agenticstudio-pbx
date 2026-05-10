
# Agentic Studios — Brand Artifacts & Video Suite

All outputs delivered to `/mnt/documents/` as downloadable files. Brand: black `#0A0A0A`, gold `hsl(45 56% 51%)` ≈ `#C9A53A`, Instrument Serif headlines with italic gold accent, film-strip sprocket motif.

## 1. Logo System (3 variants)

Generated as PNGs (transparent + on-black) using imagegen. Sketched concept: a stylized capital **"A"** rendered as a 3D film-production silhouette — the two diagonal legs read as klieg-light stands / camera tripod, the crossbar as a film-strip with sprocket holes, gold metallic finish on matte black.

- **`agentic-mark.png`** — 1024×1024 transparent. Standalone 3D gold "A" emblem (favicon + app icon source).
- **`agentic-lockup.png`** — 1920×640 transparent. Mark + "AGENTIC *Studios*" wordmark (Instrument Serif, italic gold "Studios").
- **`agentic-wordmark.png`** — 1920×480 transparent. Wordmark only.
- **`favicon.png`** + **`favicon.ico`** — derived from the mark, 256/64/32/16 sizes; wired into `index.html` (replaces current external GCS favicon).

## 2. Social Pack

Composed in Python/Pillow over the rendered lockup + a subtle gold-streak panorama backdrop (matches the landing skybox vibe).

- `og-1200x630.png` — link preview (Twitter/X, LinkedIn, Facebook, Slack)
- `twitter-header-1500x500.png`
- `linkedin-banner-1584x396.png`
- `instagram-square-1080x1080.png`

`index.html` `og:image` and `twitter:image` updated to the new OG asset (uploaded to a public storage bucket so previews resolve).

## 3. Three Videos (Remotion + ElevenLabs voiceover)

Shared system: 1920×1080, 30fps, Instrument Serif + Inter, black bg, gold accents, film-sprocket rails, slow editorial pacing. Voiceover via ElevenLabs `eleven_multilingual_v2`, voice **Brian** (`nPczCjzI2devNBz1zQrb`) — calm, cinematic. Each script written, narrated to MP3, then mixed under the visual track.

### a. Brand Bio Documentary — `agentic-bio.mp4` (~25s)
Origin → philosophy → the five agents → studios. Scenes: Mark reveal → "Built for directors who think in images" → NEXUS · PRAXIS · SCRIBE · ARCHITECT · EGOS chips with glyphs → MonkeY Teer device flicker → tagline.

### b. Launch Video — `agentic-launch.mp4` (~20s)
Teaser energy. Scenes: countdown sprockets → bold "AGENTIC *Studios*" reveal → "The AI Production Suite" → 5 agent names quick-cut → "Now in early access · agenticstudio.live".

### c. How-To / Studio Tour — `agentic-how-to.mp4` (~30s)
Mirrors landing flow. Scenes: 1) Land on the reel — fly past 3 device cards. 2) Pick an agent (cards animate in). 3) Try Praxis — prompt typing → result chips. 4) Process steps. 5) Request access → confirmation.

## Technical Notes

- Logo + social composed via `imagegen--generate_image` (premium for typography legibility) and Pillow.
- Videos scaffolded in `/tmp/remotion-agentic/` per the Remotion skill (musl compositor fix, ffmpeg symlinks). Source TSX kept in `remotion/` in the project for reuse.
- Voiceover: edge function not needed — generated via ElevenLabs API directly from a sandbox script, using `ELEVENLABS_API_KEY`. If not present, I'll request the secret first.
- Each video uses `<Audio src={staticFile('vo.mp3')} />` with `muted: false` in the render script; ffmpeg in the sandbox lacks libfdk_aac so I'll use `aac` codec via the default ffmpeg build (compatible) — if encoding fails I'll fall back to muted + deliver VO as a separate `.mp3`.

## Deliverables checklist

```
/mnt/documents/brand/
  agentic-mark.png
  agentic-lockup.png
  agentic-wordmark.png
  favicon.png  favicon.ico
  social/
    og-1200x630.png
    twitter-header-1500x500.png
    linkedin-banner-1584x396.png
    instagram-square-1080x1080.png
/mnt/documents/video/
  agentic-bio.mp4
  agentic-launch.mp4
  agentic-how-to.mp4
```

Plus: `index.html` updated to point favicon + og:image at the new assets.

## Out of scope

- No changes to the 3D reel, agents, auth, or `/app/*` routes.
- No new database tables or edge functions.
