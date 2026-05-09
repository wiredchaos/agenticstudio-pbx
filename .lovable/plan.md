## Problem

Right now each device plane is rotated with a fixed yaw (±0.45 rad), so as the camera flies past on the S‑curve, most of the time the user only sees the device edge‑on. There is also no in‑world title — the video name only appears as an HTML caption to the side.

## Goals

1. Each device should rotate to **face the camera** as the camera approaches it, so the YouTube thumbnail is fully readable at the "hero" moment of its scroll segment.
2. Add **3D typography in the scene** that displays the current video's title, animated in/out as that device's segment becomes active.

## Plan

### 1. Devices face forward (`ReelScene.tsx`)

- Replace the static `rotation` prop on `<DeviceCard>` with a billboard‑style behavior driven by scroll proximity:
  - In `DeviceCard`, accept the device's world position and a `scrollRef` + its segment center `t` value.
  - Each frame, compute `proximity = 1 - clamp(|scroll - center| * 6, 0, 1)`.
  - Compute the "facing" rotation by `lookAt(camera.position)` into a temp object, then `slerp` between the resting yaw (the current ±0.45 angled pose, looks cinematic from afar) and the camera‑facing pose using `proximity` as the weight.
  - This means: far away → angled / cinematic; near its hero moment → squarely facing the camera so the thumbnail is fully visible.
- Also bump device scale slightly (1.0 → 1.15) at the hero moment via the same `proximity` weight, so the active card "presents" itself.
- Keep the gentle float/sway, but reduce its amplitude when `proximity` is high so the active card is steady and readable.

### 2. 3D typography for the active title

- Add `troika-three-text` (already pulled in by `@react-three/drei`'s `<Text>` helper) via drei's `<Text>` component — no new dependency needed.
- New `<DeviceTitle3D>` child inside each `<DeviceCard>`:
  - Renders the device title as 3D text positioned just above the card (`y = +1.4`), using the existing serif feel (load the same Instrument Serif woff/ttf used on the page, falling back to drei's default if unavailable).
  - Color: `#c9a53a` (gold token), `outlineColor` black for contrast over the panorama.
  - Opacity & scale driven by the same `proximity` value: invisible when far, fades up + scales from 0.6 → 1.0 as the user reaches that device's segment.
  - Subtitle line below it (smaller, white, 0.5x size) shows `device.role`.
- Because it's parented to the card group, it inherits the billboard rotation, so the title turns to face the camera together with the device.

### 3. Scrolling title "marquee" between segments (optional secondary effect)

- Add a single `<GlobalScrollTitle>` mesh in `ReelScene` that always sits ~6 units in front of the camera using `useFrame` (camera‑relative offset).
- Its text is the title of whichever device segment is currently closest to `scrollRef.current`.
- It crossfades (opacity tween) when the active index changes, giving a continuous on‑screen typographic "ticker" while flying between devices, even before any single card is fully facing.

### 4. Caption cleanup (`ReelSection.tsx`)

- The HTML `DeviceCaption` is now redundant with in‑scene 3D text — remove it (or keep only the `01 ·` index number, smaller, as an accessibility/SEO fallback).
- Keep the bottom "Scroll to fly the reel · Click a device to play" hint and the top filmmaker line unchanged.

### 5. Reduced‑motion fallback

- Unchanged: still renders the static gallery grid; titles already shown there.

## Out of scope

- No changes to backend, routing, agents grid, or any `/app/*` code.
- No new npm packages — `<Text>` ships with `@react-three/drei` already installed.

## Files touched

- `src/components/agentic-landing/reel/ReelScene.tsx` — billboard logic, 3D `<Text>` per card, optional global scroll title.
- `src/components/agentic-landing/reel/ReelSection.tsx` — remove/slim `DeviceCaption`.
