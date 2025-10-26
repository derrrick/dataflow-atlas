# Fragility Map — Gap Closure Plan + Extended Considerations (v1.0)

This document consolidates what’s missing, adds a concrete plan to close gaps, and introduces extra considerations to harden the MVP into a scalable, credible product.

---

## 1) Gap Closure Checklist

### A. Data & Methodology
- **Sub‑national outages:** evaluate Country→Region proxies. Options: Cloudflare Radar regional cuts (where available), IODA, ThousandEyes (partnership), Ookla (licensing), BGPStream + geolocation heuristics.
- **Resilience score v0:** publish a simple transparent model.  
  `resilience_score = normalize( w1*redundancy + w2*governance + w3*income + w4*grid_reserve )`  
  Proxies: redundancy (AS density, IXPs per capita), governance (WGI), income (GDP per capita PPP), grid reserve (EIA/ENTSO-E where available). Calibrate weights with expert interviews.
- **Normalization rules:** z‑score within layer; clamp at ±3σ; document units; color scale rationale.
- **Validation:** back‑test on known events (e.g., Tonga cable cut, Texas 2021 freeze, Pakistan 2023 grid failure). Record precision/recall of “elevated fragility” flags.
- **Provenance:** per‑layer JSON with source, license, refresh cadence, and last_updated.
- **Synthetic data:** small generator for demo/outage simulation when live feeds are quiet; clearly labeled as simulated.

### B. Legal & Compliance
- **Licenses & attribution:** ODbL (OSM/OpenInfraMap), NASA/USGS (public domain with attribution), MapTiler (free tier terms), RIPE/Cloudflare (terms). Centralize required attribution strings.
- **ToS & Privacy:** no PII, aggregated analytics, opt‑out link; cookie disclosure if using non‑essential cookies.
- **Name & trademark:** search and file; reserve domains; write brand use guidelines.
- **Data usage limits:** respect rate limits; implement exponential backoff; cache aggressively.

### C. Architecture Hardening
- WebGL context‑loss handler; Safari/WebKit workarounds; antimeridian seam fix; tile gutters; polar behavior of lens; high‑zoom precision.
- Versioned data contracts with migration notes; cache keys tied to version.
- Error budgets per upstream API; graceful “stale” UI states with badge and timestamp.

### D. Performance & QA
- **Device matrix:** low‑end laptop, M1/M2, mid GPU PC, iPad, Android mid‑tier.
- **Automated tests:** CI perf budget (p95 frame ≤16 ms; memory cap ≤300 MB); visual regression for charts; cross‑browser suite.
- **Load testing:** 5k concurrent sessions on static hosting; measure CDN hit ratio.

### E. Security & Abuse
- Signed tile URLs for premium layers; short‑lived JWT (`scope=layer`, `exp<=15m`).
- Embed origin allow‑list; rate limits per token; anti‑hotlink watermark for premium tiles.
- Strict headers: CSP, SRI, HSTS, Referrer‑Policy, Permissions‑Policy; CORS only for embed hosts.
- Payments, trials, metering, refunds; trial‑abuse throttles; basic bot defense.

### F. Content & Editorial
- Template for daily “Top 5 stress points” copy; neutral tone; avoid sensationalism.
- Method notes page per layer; last‑updated badge; confidence score quick legend.
- Press kit: logo pack, screenshots, 15‑sec loop, embed snippet; style guide.

### G. Growth & SEO
- Programmatic pages per region × hazard × time; canonical URLs; structured data; XML sitemaps.
- Social card generator (server endpoint) + shortlinks.
- Sponsor rate card, outreach list, case‑study plan.

### H. Brand System
- Final name and mark; color tokens; type scale; iconography.
- Embed themes: light/dark/auto; responsive safe areas.

### I. Ops / SRE
- Runbooks for ingest failures; alerts to email/Slack; incident status page (static + Twitter/X fallback).
- Backups for data artifacts and Worker KV/R2; dependency scanning in CI; weekly library update policy.

### J. Accessibility & i18n
- Keyboard navigation for chips/lens; proper focus order; ARIA labels.
- High‑contrast theme; reduced‑motion mode.
- Copy externalized for later localization; units and dates in ISO‑8601; screen‑reader alt text for charts.

### K. Mobile & Low‑Power
- Degrade path to static raster under load; battery‑saver toggle.
- Touch gestures for lens lock/unlock; tooltip alternatives.

---

## 2) Extended Considerations (new)

### Ethics & Impact
- Disaster communications policy: do not publish user‑identifiable harm; avoid panic language; link to official guidance where relevant.
- Bias & fairness: publish methodology; avoid framing low‑income regions as “worse” without context; show resilience as a continuum.

### Data Governance
- No PII; log only aggregate analytics; retention policy 90 days for raw logs; provenance retained indefinitely.
- Open a public “data issues” tracker for corrections and takedown requests.

### Security Hardening
- Regular third‑party dependency audit; Snyk/GH Dependabot.  
- Secret rotation schedule; least‑privilege tokens; audit embeds for XSS vectors.

### Reliability Engineering
- SLOs per layer; error budget policy; chaos tests (drop a feed, verify stale state + badge).

### Financial Resilience
- Revenue diversification: ads + sponsor + Plus/Pro + embeds; cap sponsor share to <40%.
- Ad‑block aware value (embeds, email digest) to reduce volatility.

### Open vs Proprietary
- Consider open‑sourcing the viewer core and keeping premium tiles/algorithms proprietary. Encourages community contributions without sacrificing monetization.

### Partnerships & Community
- Target collaborations: Cloudflare Radar, RIPE Atlas, university hazard labs, museums.  
- Public roadmap; feedback forum; periodic community calls for power users.

### Communications Playbook
- Escalation ladder for breaking events; pre‑approved copy; 30/60/90‑second video templates; media contact channel.

### Environmental Footprint
- Track compute/network usage; choose green hosting where possible; publish a brief sustainability note.

### Visual Accessibility
- Color palettes safe for common CVDs; non‑color encodings for critical signals (patterns, dashes).

### Map Design
- Prefer globe or equal‑area projections for fairness. Provide projection note in method pages.

### Legal Safeguards
- “Not for Emergency Use” disclaimer; liability limitation; acceptable use policy to prevent misuse.

---

## 3) 30/60/90 Execution Plan to Close Gaps

### Days 0–14 (MVP ship — already scoped)
- Deliver globe + hazards + quakes + outages + latency + topo lens + charts + embed + landing.
- Baseline telemetry and analytics live.

### Days 15–30 (Gap‑closure Wave 1)
- Legal: ToS/Privacy, attribution lines, trademark search; provenance JSON per layer.
- Security: CSP/HSTS/SRI; embed origin allow‑list; signed‑URL stub for premium tiles.
- Content: method notes pages; “Top 5 stress points” generator; press kit v0.
- Perf/QA: device matrix tests; automated perf checks in CI; cross‑browser suite.
- A11y: keyboard focus, ARIA, reduced‑motion toggle.
- Growth: social card generator; shortlink domain; initial programmatic SEO pages.

**Milestone A:** Public soft‑launch with press kit; collect first sponsor interest and 10 Pro/Embed waitlist signups.

### Days 31–60 (Wave 2)
- Data: resilience v0 with published formula; back‑tests on 3 historical events.
- Product: 7–30d playback; PNG/SVG export; dual‑lens compare (Pro).  
- Infra: move hazards to raster tiles; CDN rules; cache headers; stale‑while‑revalidate.
- Security: rate limits; token rotation; bot defense; trial‑abuse throttles.
- Ops: runbooks, alerts, status page; backup/restore drill.

**Milestone B:** 100k+ monthly sessions; ≥3:00 avg open; 300+ emails; 5 paid Plus, 2 Pro trials.

### Days 61–90 (Wave 3)
- Enterprise: alerts/webhooks; SSO embed; SLA draft.  
- Data: sub‑national outages prototype; energy layer pilot (ENTSO‑E/EIA).  
- SEO: scale programmatic pages; localized variants.  
- Partnerships: finalize first sponsor; 1 newsroom embed; 2 university pilots.

**Milestone C:** $3k–$10k MRR blended; first enterprise pilot signed; sponsor #1 live.

---

## 4) Costs & Free‑Tier Strategy (recap)
- **Stay $0** initially: Cloudflare Pages + GitHub Actions + free tiles (NASA/USGS/ETOPO; MapTiler free) + GA4/Cloudflare Analytics + Buttondown.
- Costs begin with heavy traffic, frequent crons, premium tiles, or DB archives. Keep hot path static as long as possible.

---

## 5) Hosting Decision
- **Cloudflare Pages** for MVP. Workers + KV + R2 + Cron for tokens/tiles/auth later.  
- Move to Vercel only if you require SSR/ISR imminently. Keep repo portable.

---

## 6) Brand
- **Recommended:** **Flow Atlas**. Domains: `flowatlas.io`, `.live`, `.app`.  
- Mark: circular lens cutout on a sphere grid; arcs as secondary motif.  
- Tone: factual, calm, non‑alarmist. Grayscale UI, cyan accent, hazard red for alerts.

---

## 7) Appendices

### A. Sample Provenance JSON
```json
{
  "layer": "quakes",
  "v": 1,
  "source": "USGS Earthquake API",
  "license": "Public domain (attribution requested)",
  "refresh_cadence": "1-5 minutes",
  "last_updated": "2025-10-24T22:00:00Z",
  "notes": "Magnitude >= 2.5, global feed"
}
```

### B. Color Scales
- Hazards: blue→yellow→red (sequential, perceptually uniform).  
- Outages: gray→purple.  
- Resilience: red→gray→green with midpoint at global median.

### C. Resilience Weights (v0 example)
```
w1 redundancy: 0.40
w2 governance: 0.25
w3 income:     0.20
w4 grid_reserve: 0.15
```
Publish justification; expect to recalibrate with expert feedback.

### D. Status Page Blueprint
- `/status` route with current feeds, last updated, backlog of incidents, and uptime chart.

---

**Bottom line:** Close legal, security, and methodology gaps in the next 30 days while keeping the product static and free. Publish the resilience method, lock data contracts, and ship a credible soft‑launch with press kit and social card engine. This positions **Flow Atlas** to scale to tiles, premium layers, and enterprise without a rewrite.
