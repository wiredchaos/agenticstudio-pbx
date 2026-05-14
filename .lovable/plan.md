## Plan

Swap the fixed-viewport hero ambient background video on the landing page with your newly uploaded clip.

### Steps

1. Copy `user-uploads://cm9p76nfl0b044k01s1v25in9_1-2.mp4` → `public/video/hero-loop.mp4` (overwrite existing 26 MB file).
2. No code changes needed — `HeroFilm.tsx` already references `/video/hero-loop.mp4` as the fixed full-viewport background (40% opacity behind a dark gradient veil, hidden under `prefers-reduced-motion`).
3. Verify the new file plays and loops cleanly in the preview.

### Out of scope

- Trimming, transcoding, or generating a poster image for the new clip.
- Changing opacity, gradient, or placement of the background video.
