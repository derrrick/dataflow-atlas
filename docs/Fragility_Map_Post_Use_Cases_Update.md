# Fragility Map — MVP Plan, Costs, Brand, Architecture, and Hosting (Post-Use-Cases Update)

This document consolidates everything discussed **after** the “Persona Use Cases + Viral Mechanics” artifact.

---

## 1) MVP Plan of Attack (14 Days)

**Day 1–2: Scaffold + Observability**
- Next.js (SSG) + Three.js + TypeScript.
- App shell, feature flags, baseline telemetry (page open, frame time, layer switch, lens lock).

**Day 3–4: Globe Core**
- Unit sphere, single draw call, tile cache.
- Camera controls with tilt limits; target 60 FPS on M1.

**Day 5: Data Ingest v0**
- Fetch NOAA/NWS hazards + USGS quakes.
- Cron (GitHub Actions) → write slim JSON to `/public/data`.

**Day 6: Fragility Field v0**
- `fragility = zscore(hazard) × zscore(pop_exposure?)` (exposure optional placeholder).
- Color ramp + minimal legend.

**Day 7: Topographic Lens**
- Terrain-RGB tiles (MapTiler/ETOPO/GEBCO).
- Hover lens with feathered mask; click-to-lock; ESC to clear.

**Day 8: Outages Index**
- Cloudflare Radar country-level signal.
- Chip with tooltip showing Δ since 24h.

**Day 9: Latency Arcs**
- Sampled RIPE Atlas routes. Color by ms; subsample for performance.

**Day 10: Analytical Strip**
- Four charts (sparklines ×2, slopegraph, regional small multiples).
- PNG export for static image needs.

**Day 11: Embed v1**
- Iframe + script embed with attribution + “Open Full Map.”
- Locked chips for Plus/Pro with 60s teaser preview.

**Day 12: Landing + Fake Doors**
- Live demo, email capture, pricing cards (Plus/Pro/Enterprise) that collect intent only.

**Day 13: Perf + QA**
- Draw calls ≤10, GPU mem <300 MB, tile p95 <200 ms.
- Degraded mode when feeds are stale.

**Day 14: Soft Launch**
- Product preview post, r/dataisbeautiful seed, “Top 5 Stress Points” daily card.

**Ship criteria**
- Globe + hazards + quakes + outages + latency + lens working at 60 FPS on common hardware.
- Charts from live data.
- Embed tested on WordPress, Squarespace, and Notion.
- Metrics dashboard live.

---

## 2) Costs — Keep at $0 Until Validation

### Zero-Cost Architecture (Recommended for MVP)
- **Frontend:** Cloudflare Pages *or* Vercel Hobby (free).
- **Data:** No DB. Precompute JSON and host as static files under `/public/data`.
- **Ingest/Cron:** GitHub Actions (free for public repos).
- **Tiles:** NASA GIBS, USGS, ETOPO/GEBCO, MapTiler free tier (attribution).
- **Analytics:** Cloudflare Web Analytics or GA4 (free).
- **Email capture:** Buttondown/Tally/ConvertKit free tier.
- **CDN:** Cloudflare in front of Pages.

**Mode A — Zero backend (fastest):** fetch APIs client-side; cache in `localStorage` (watch CORS/rate limits).  
**Mode B — Static pipeline (safer, scalable):** GitHub Action every 15–30 min fetches → normalizes → commits to `/public/data` (recommended).

### Example Free Cron (GitHub Actions)
```yaml
name: ingest
on:
  schedule: [ { cron: "*/30 * * * *" } ]
  workflow_dispatch:
jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: node scripts/ingest.js  # writes to public/data/*.json
      - run: |
          git config user.name "bot"
          git config user.email "bot@users.noreply.github.com"
          git add -A
          git commit -m "data: update $(date -u '+%Y-%m-%dT%H:%M:%SZ')" || true
          git push
```

### When Costs Begin
- >150k sessions/mo or heavy embeds/tile egress.
- Cron cadence <15 min.  
- Premium tile storage and signed URL infrastructure.

For later scaling, estimated ranges (monthly): Vercel $20–$250, Supabase $25–$199, Storage/CDN $5–$150, Map tiles $0–$99. Keep these **$0** at MVP by staying static and free-tier tiles.

---

## 3) Scalable by Design — Architecture & Data Contracts

**Goal:** Start static now, evolve to tiles and gated layers without rewrites.

### Frontend
- SSG Next.js + Three.js WebGL.  
- One draw-call globe; instanced points for quakes; texture/grid for hazards.  
- Topo lens decodes Terrain‑RGB client-side; feathered mask shader.  
- Analytical strip with canvas/SVG charts.

### Data Contracts (versioned, stable keys)
```jsonc
// /public/data/meta.json
{ "v": 1, "updated_at": "2025-10-24T22:00:00Z", "layers": ["hazards","quakes","outages","latency"] }

// /public/data/hazards/today.v1.json
{ "v": 1, "updated_at": "...", "grid": { "type":"equirect", "res_deg":0.5 },
  "cells": [ { "lat":37.5,"lon":-122.0,"intensity":0.62 } ] }

// /public/data/quakes/recent.v1.json
{ "v":1,"updated_at":"...","events":[ { "ts":"...","lat":38.3,"lon":142.4,"mag":6.7,"depth_km":24 } ] }

// /public/data/outages/country.v1.json
{ "v":1,"updated_at":"...","regions":[ { "iso2":"US","outage_index":0.14,"delta_24h":0.02 } ] }

// /public/data/latency/routes.v1.json
{ "v":1,"updated_at":"...","routes":[ { "from":"SFO","to":"FRA","ms":158 } ] }
```

### Caching
- `Cache-Control: public, max-age=60, stale-while-revalidate=600` for JSON.
- Version filenames when schema changes (`*.v2.json`).

### Observability
- Emit: `perf_frame_time`, `tile_fetch_ms`, `layer_change`, `lens_lock`.
- SLOs: p95 frame ≤16 ms; p95 tile fetch ≤200 ms warm.

### Scale Path
- **Data to Tiles:** move to vector (`.pbf`) or raster (`.png`) tiles stored on R2/S3; front with Cloudflare CDN.
- **Gated Layers:** premium tiles via signed URLs (Worker generates JWT with `scope=layer` and short `exp`).  
- **History & Real-Time:** add Supabase/Postgres only for archives; keep hot path file/tiles; Cron → Workers Cron later.

---

## 4) Hosting Choice

**Pick:** **Cloudflare Pages** for MVP.  
- $0 egress + global CDN.  
- Workers + KV + R2 + Cron for tokens/tiles/auth later.  
- Static site suits current architecture.

**When Vercel wins:** if you need Next.js SSR/ISR, Image Optimization, or serverless APIs soon. Keep the repo portable so shell can move later if SSR becomes necessary.

**Best setup now**
- App on Cloudflare Pages.
- Data/tiles on R2 behind Cloudflare CDN.
- Worker for signed premium tiles and simple auth.

---

## 5) Brand and Name

**Recommended name:** **Flow Atlas**  
- Broad enough for energy, data, hazards.  
- Credible for B2C and B2B.  
- Visual metaphor aligns with arcs and lenses.

**Alternatives:** Fragility Map, Planetary Uptime, Faultwire, TerraStrain, Signal & Strain.  
**Domains:** `flowatlas.io`, `flowatlas.live`, `flowatlas.app`.

**Brand Kit v0**
- Type: Inter or IBM Plex Sans.  
- Palette: grayscale UI; cyan accent (#39D0FF) for data; hazard red for alerts.  
- Mark: circular lens cutout on a sphere grid; secondary arcs motif.  
- Tone: factual, calm, non‑alarmist.  
- Tier labels: Free, **Plus**, **Pro**, **Enterprise**. Locks read “Latency (Pro) 🔒”.

---

## 6) 48-Hour Backlog

1. Scaffold repo, Pages deploy, analytics.  
2. Add `/public/data/*` contracts; write USGS+NOAA ingest script.  
3. GitHub Action every 30 min to update JSON and redeploy.  
4. Globe with hazards + quakes; topo lens.  
5. Two sparklines in strip.  
6. `/embed` route with attribution and “Open Full Map” CTA.  
7. Landing page with waitlist and pricing fake doors.

---

**Conclusion:** Start static (Mode B), host on Cloudflare Pages, keep everything versioned and cacheable, and design contracts so you can flip to tiles and gated layers when traffic justifies it. Brand it **Flow Atlas** and ship the MVP in two weeks.
