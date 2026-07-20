# NETERU APINAYA Entertainment Integration

## Canon

NETERU APINAYA is a mature transmedia property produced through **NTRU Studios** inside the AGENTROPOLIS Entertainment District.

- **Application:** `neteru.xyz`
- **Application repo:** `wiredchaos/ntru`
- **Programming identity:** `NTRUtv`
- **Streaming destination:** `NTRU-OTT`
- **Game:** `NETERU APINAYA: FRACTURE`
- **Publishing:** ebooks and graphic novels

NTRUtv is the channel and programming identity. NTRU-OTT is the mature streaming destination. They are related but not interchangeable.

## Production ownership

| Capability | Owner |
|---|---|
| Canon, lore, characters, chapters and property UI | `wiredchaos/ntru` |
| Studio registry, production jobs, assets and publishing queue | Entertainment District backend |
| Scripts, storyboards, panels, ebook packages and renders | AGENTROPOLIS-CREATOR |
| Tool execution and scoped credentials | AGENTROPOLIS-AGENT-MCP |
| Property campaign generation | NTRU GTM |
| Cross-city campaign distribution | AGENTROPOLIS-GTM |
| Runtime policy, approvals and receipts | Agentropolis Mission Control |

## Required property endpoints

```text
GET  /api/properties/neteru-apinaya
GET  /api/properties/neteru-apinaya/shows
GET  /api/properties/neteru-apinaya/episodes
GET  /api/properties/neteru-apinaya/assets
GET  /api/properties/neteru-apinaya/publications
POST /api/properties/neteru-apinaya/production-jobs
POST /api/properties/neteru-apinaya/publish
```

All write operations require an approved mandate, a scoped actor, validation and a receipt.

## Media classes

```text
ntru.tv.episode
ntru.tv.trailer
ntru.tv.clip
ntru.ebook.volume
ntru.ebook.chapter
ntru.graphic-novel.issue
ntru.graphic-novel.page
ntru.graphic-novel.panel
ntru.game.cinematic
ntru.game.replay
ntru.audio.transmission
```

## Canonical production flow

```text
NETERU canon scene
  -> NTRU Studios production mandate
  -> Agentic Studios production job
  -> Creator asset generation
  -> MCP policy and tool routing
  -> human review
  -> NTRUtv programming package
  -> NTRU-OTT publication when mature
  -> selected public-safe transmission to AGENT TV NETWORK
  -> receipt to Mission Control
```

## Audience boundary

NETERU APINAYA does not route through 789 Studios. Public-safe trailers, interviews and selected transmissions may appear on AGENT TV NETWORK only after classification and approval.
