## Plan: Compress landing-page videos

### Current state
- `hero-loop.mp4` — **26 MB**, 1280×720, ~10.6 Mbps (massively over-encoded for an opacity-40 background loop)
- `agentic-launch.mp4` — 1.8 MB, 1920×1080, 0.7 Mbps ✅ already lean
- `agentic-bio.mp4` — 1.4 MB, 1920×1080, 0.4 Mbps ✅ already lean
- `agentic-how-to.mp4` — 1.3 MB, 1920×1080, 0.3 Mbps ✅ already lean

Total now: ~30 MB. The only real win is `hero-loop.mp4`.

### Steps

1. Re-encode `public/video/hero-loop.mp4` in place with ffmpeg:
   - H.264 High, `-crf 28 -preset slow`, `-pix_fmt yuv420p`
   - Scale to 1280×720 (already), strip audio (`-an`), `+faststart` for fast start
   - Target output: ~1.5–3 MB (10×+ smaller)
2. Lightly re-encode the three `agentic-*.mp4` clips with the same settings to (a) normalize codec profile and (b) shave another ~30–40% — purely optional, but keeps the whole `/video/` folder under ~5 MB total.
3. Generate a JPEG poster for `hero-loop.mp4` from frame 0 → `public/video/hero-loop.jpg` so first paint isn't blank while the video loads, and wire it as `poster` on the `<video>` in `HeroFilm.tsx`.
4. Verify: list new file sizes, play the page in the preview, confirm the loop is visually identical and seamless.

### Out of scope
- Changing crop, duration, opacity, or visual treatment of any clip.
- Swapping codecs (no AV1/WebM dual-source) — keeps it single-file and broadly compatible.
- Touching `BrandHero` per-studio video uploads (those are user-supplied via Storage, not in repo).

### Technical notes
Command per file (example for hero):
```bash
ffmpeg -y -i public/video/hero-loop.mp4 \
  -vf "scale=1280:720" -c:v libx264 -profile:v high -preset slow -crf 28 \
  -pix_fmt yuv420p -an -movflags +faststart \
  /tmp/hero-loop.mp4 && mv /tmp/hero-loop.mp4 public/video/hero-loop.mp4
```
