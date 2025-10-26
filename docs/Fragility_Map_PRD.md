# Fragility Map — PRD

## 1. Summary
A live, ambient globe that visualizes hazard × infrastructure × connectivity fragility in real time. WebGL hero, “topo lens” interaction, analytical strip below, embeddable widget, paid layers.

## 2. Problem
Existing maps are static, siloed, and slow. Users need a single live surface to see where systems are weak, what is failing now, and how stress propagates.

## 3. Vision
Make invisible systems visible. One surface. Real time. Calm UI. Credible analytics.

## 4. Goals
- G1: Ship a fast public MVP that people leave open.
- G2: Prove repeat use and email capture.
- G3: Validate demand for paid layers and embeds.

### Non-goals
- Full scientific hazard modeling.
- Historical archives before MVP.
- Mobile native apps.

## 5. Users and JTBD
- **Ambient viewers:** “Show me what is happening now. Keep it beautiful.”
- **Analysts/infra:** “Spot risk, compare regions, export signals.”
- **Media/educators:** “Embed clean visuals with attribution.”

## 6. Success metrics
- NSM: avg open duration per session.
- A1: 20% 7-day return rate.
- A2: ≥300 email signups in 2 weeks post-launch.
- A3: ≥10 Pro/Embed waitlist signups with use cases.
- RUM: p95 frame time ≤ 16 ms on mid-range GPUs.

## 7. Scope v1 (MVP)
- **Globe:** WebGL sphere, one draw call, dynamic lighting.
- **Layers:**
  - Hazards (wind/precip proxy)
  - Earthquakes (real time)
  - Internet outages index (country level)
  - Latency arcs between regions
- **Topo Lens:** circular hover lens that switches to hillshade + contours; click to lock.
- **Analytical strip:** four compact charts (sparklines, slopegraph, small multiples, annotated series).
- **Embed:** iframe + script embed with basic params.
- **Landing:** simple pitch, live demo, email capture.
- **Pricing fake doors:** Plus, Pro, Enterprise (no paywall yet, collect intent).
- **Analytics:** full funnel + performance telemetry.

## 8. Future scope (post-MVP)
- 7–30 day playback.
- Energy grid overlays.
- Population exposure.
- PNG/SVG/CSV export.
- Paid tiers and SSO embeds.
- Alerts and webhooks.

## 9. Data and APIs
- **Hazards:** NOAA/NWS, NASA GIBS. 5–15 min pulls.
- **Quakes:** USGS real time. 1–5 min pulls.
- **Outages:** Cloudflare Radar aggregate. 15 min pulls.
- **Latency:** RIPE Atlas probes. 15–30 min pulls.
- **Topo tiles:** MapTiler Terrain-RGB or ETOPO/GEBCO baked tiles.
- **Exposure later:** WorldPop or GHSL grids. Daily or static.
- **Model:** `fragility = hazard_intensity × exposure × (1 - resilience_score)`  
  MVP: start with hazard × exposure. Add resilience later.

### Data model (MVP)
- `grid_cell`: id, lat, lon, z.
- `layer_snapshot`: grid_cell_id, layer, value, ts.
- `region_metric`: region_id, metric, value, ts.
- `event_log`: type, region, magnitude, ts.
- `provenance`: source, license, refresh_cadence, last_pull.

## 10. Architecture
- **Frontend:** Next.js + Three.js (or deck.gl). D3 for charts. Web Workers for parsing.  
- **Backend:** Node/TypeScript. Ingestors on cron or serverless.  
- **Store:** Postgres or Supabase for metadata + aggregates. Static JSON tiles on object storage + CDN.  
- **API:** `/tiles/{layer}/{z}/{x}/{y}.png|json`, `/metrics/today`, `/events/top`.  
- **Security:** signed URLs for paid tiles. JWT with scope and 15 min exp.  
- **Observability:** logs, metrics, synthetic checks on ingest and tiles.

## 11. UX specs
- **Hero:** full-bleed globe. Minimal HUD.  
- **Controls:** layer chip row, time chip, lens toggle, share, fullscreen.  
- **Lens:** soft feather, 2 sizes, multi-lock, ESC clear.  
- **States:** loading shimmer, stale badges, degraded mode when data late.  
- **Accessibility:** keyboard focus for chips, space to lock lens, high-contrast theme toggle, alt text.

## 12. Performance budgets
- Initial JS < 200 KB gzip for MVP page shell.  
- First pixels < 2 s on median network.  
- Tile fetch p95 < 200 ms after warm.  
- Draw calls ≤ 10.  
- GPU memory < 300 MB.

## 13. Embed spec v1
- **Iframe:** `src=/embed?layer=hazards&lens=topo&live=1`  
- **Script embed:** data-attrs for layer, lens, theme, attribution, CTA.  
- **Attribution:** slim footer + “Open full map” CTA.  
- **Gating:** locked chips with preview timer.  
- **Telemetry:** referrer, domain, view time, interactions.

## 14. Pricing and tiers (alpha)
- **Free:** Hazards, quakes, basic lens, last 24 h, ads, attribution.  
- **Plus 9–19/mo:** outages, latency, 7–30 d playback, dual lens, PNG export, light watermark.  
- **Pro 49–149/mo:** energy, exposure, annotations, CSV/SVG export, ad-free, themes, higher-res tiles.  
- **Enterprise:** SSO embeds, alerts, hourly archives, SLA.

## 15. Analytics plan
Events: `app_open`, `layer_change`, `lens_toggle`, `lens_lock`, `tile_fetch`, `embed_open`, `embed_cta_click`, `chart_expand`, `email_submit`, `fake_door_click`, `perf_frame_time`.  
Cohorts: referrer, device class, country, first vs returning.  
Dashboards: daily active views, open duration, layer engagement, embed adoption.

## 16. Experiments
- Name test on landing.  
- Auto “Top 5 stress points” daily card for social.  
- Lens preview timer vs static lock.  
- Pricing points by geography.  
- Ad slot placement A/B in embed bar.

## 17. Rollout
- Week 0–1: scaffold, globe, hazards.  
- Week 2: quakes, outages index.  
- Week 3: latency arcs, topo lens.  
- Week 4: analytical strip, landing, analytics.  
- Week 5: embeds, fake doors, soft launch.  
- Week 6: traffic push, interviews, decision memo.

## 18. Risks and mitigations
- **API rate limits:** cache, stagger pulls, backfill overnight.  
- **Licensing:** track provenance, stick to open terms, add attribution.  
- **Perf variance:** reduce overdraw, atlas tiles, drop to LOD under load.  
- **Monetization:** keep free valuable, make upgrades obvious, add sponsor slots.  
- **Credibility:** visible sources, method notes, consistent units.

## 19. Acceptance criteria (MVP)
- 60 FPS on M1 and mid-tier Windows GPUs.  
- Globe with 4 layers and topo lens.  
- Analytical strip renders with real data.  
- Embed works on top 5 CMS.  
- Landing with email capture and working fake doors.  
- Metrics dashboard live.

## 20. Open questions
- Best public outage signal at sub-national granularity.  
- Which resilience proxy to start with for MVP.  
- Tile licensing choice for topo at scale.  
- Price points for Plus and Pro after tests.

---

End of PRD.
