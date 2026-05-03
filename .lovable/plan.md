## Wire real MonkeY Teer films into the reel — with real titles + captions

Replace placeholder IDs in `src/components/mindloop/DevinReel.tsx` with the real catalog you've pasted, and add a richer caption (title + role) under each card so the work reads like a filmmaker portfolio, not a playlist.

### Mapped IDs → titles + Devin's role

From your screenshots + descriptions:

| # | YouTube ID | Title | Devin's role |
|---|---|---|---|
| 1 | `4sn-nB52bGE` | Once Upon a Time in America — Fashion Film | Production / Cast (Monkey Teer) |
| 2 | `OH8ajVijDM8` | Bizzarro e Fantastico — Short Film | Monkey Teer production |
| 3 | `YVOVWfuJ68Y` | L'imposteur du 16 Rue Ravignan — Teaser | Monkey Teer production |
| 4 | `0iiwUgv2U0o` | Off-Key | Monkey Teer production |
| 5 | `ocklAzBhZQM` | Parenthesis | Cinematographer |
| 6 | `a5nX0nCCIes` | Him \| Batman Thriller Short | Monkey Teer entertainment |
| 7 | `CiOmC95OnRA` | Him & Her — Drama Short | Monkey Teer entertainment |
| 8 | `V6RIdwkjE_c` | Son of Sheba — Historical Fiction | Executive Producer |

### Two unresolved IDs

- `okf0wKINsvM` — no description sent. Will label `MonkeY Teer — Untitled` with role `Monkey Teer production` as a safe placeholder. Easy to rename when you tell me what it is.
- `6L9esv2doHw` — same situation.

### Note on the URL list vs. descriptions

Your original 9-link message did NOT include `V6RIdwkjE_c` (Son of Sheba), but the description block clearly references it via the screenshot. I'll **include it** as item #8 since you went to the trouble of pasting its synopsis. If you don't want it, say "drop Sheba" and I'll cut it.

Final count: **10 videos** in the reel (8 fully captioned + 2 placeholders). Drops to 8 if you want me to remove the two unresolved ones.

### Code change (single file)

`src/components/mindloop/DevinReel.tsx`:
- Replace `VIDEOS` array with the 10 entries above, each shaped `{ id, title, role }`.
- Update `VideoCard` to render a 2-line caption: title in `text-foreground text-sm`, role in `text-muted-foreground text-xs uppercase tracking-[2px] mt-1`.
- Drop the `// TODO: Replace these placeholder IDs` comment; replace with `// Source: youtube.com/@monkeyteer`.

### Memory update

`mem://index.md` — change the "placeholder IDs — TODO swap" line to: "DevinReel.tsx wired with 10 real MonkeY Teer films (2 still need titles: `okf0wKINsvM`, `6L9esv2doHw`)."

### Out of scope

- No font swap, no token change, no new sections.
- Not building the Rubik / SVG-button hero spec from earlier.
- Not touching `/app/*`, Praxis, or anything backend.

### Decisions I need from you (or I default as noted)

1. **Include Son of Sheba (`V6RIdwkjE_c`)?** Default: **yes**, since you pasted the synopsis.
2. **What to do with the 2 unlabeled IDs?** Default: **keep them with generic captions**. Alternative: drop them.
3. **Caption format** — Default: `Title` + `Role` (e.g. "Parenthesis" / "CINEMATOGRAPHER"). Alternative: title only.

Approve and I'll ship it in one edit.