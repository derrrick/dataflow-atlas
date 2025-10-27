# Fragility Map — Ticketized Backlog (v1)

## Epic 1 — Product research & kill criteria (P0)
**Goal:** Validate jobs, define success and stop rules.  
**Owner:** PM  
**Est.:** 3 days  

**Tasks**
- [ ] Problem taxonomy: top 10 user questions the map must answer. (0.5d)
- [ ] Interview guide; schedule 10 analyst + 5 newsroom calls. (0.5d)
- [ ] Run 8 sessions; synthesize insights. (1.5d)
- [ ] Define kill criteria and success thresholds. (0.5d)

**Accept:** Doc with jobs, quotes, metrics; invites set; kill criteria signed.

---

## Epic 2 — Repo & engineering hygiene (P0)
**Owner:** ENG  
**Est.:** 1 day  

**Tasks**
- [ ] Prettier, ESLint, TS strict, commitlint, CODEOWNERS, branch rules. (0.5d)
- [ ] CI: lint, typecheck, unit tests, Lighthouse CI, bundle budget gate. (0.5d)

**Accept:** CI green; PRs blocked without checks; bundle <180KB gzip.

---

## Epic 3 — Data contracts & provenance (P0)
**Owner:** DS  
**Est.:** 2 days  

**Tasks**
- [ ] Versioned schemas for `/public/data/*` with examples. (0.5d)
- [ ] Provenance JSON template per layer. (0.5d)
- [ ] Color scales + z-score clamp rules. (0.5d)
- [ ] Validation script for schema drift. (0.5d)

**Accept:** Schemas v1 published; validator passes; sample files committed.

---

## Epic 4 — Resilience model v0 (P1)
**Owner:** DS  
**Est.:** 3 days  

**Tasks**
- [ ] Feature selection (redundancy, governance, income, grid reserve). (0.5d)
- [ ] Weighting proposal + rationale. (0.5d)
- [ ] Back-test on 3 historical events. (1.5d)
- [ ] Method notes page. (0.5d)

**Accept:** Reproducible calc; back-test summary; notes page live.

---

## Epic 5 — Sub-national outage prototype (P1)
**Owner:** DS  
**Est.:** 3 days  

**Tasks**
- [ ] Evaluate IODA, BGPStream, Ookla, ThousandEyes options. (0.5d)
- [ ] Build proxy index at region level; document error bars. (1.5d)
- [ ] Compare with ground-truth events. (1d)

**Accept:** Region-level JSON with confidence; comparison chart.

---

## Epic 6 — Static ingest pipeline hardening (P0)
**Owner:** ENG  
**Est.:** 2 days  

**Tasks**
- [ ] GitHub Actions cron (30 min) fetch USGS/NOAA/Cloudflare/RIPE. (0.5d)
- [ ] Retry/backoff; write versioned JSON with `updated_at`. (0.5d)
- [ ] Cache keys + `stale-while-revalidate` headers. (0.5d)
- [ ] Synthetic quiet-day generator. (0.5d)

**Accept:** CI job stable; JSON updated on schedule; synthetic switch works.

---

## Epic 7 — Security & compliance baseline (P0)
**Owner:** ENG + LEG  
**Est.:** 2 days  

**Tasks**
- [ ] CSP, HSTS, SRI, Referrer-Policy, Permissions-Policy. (0.5d)
- [ ] Embed origin allow-list. (0.5d)
- [ ] Signed URL stub for premium tiles (JWT scope+exp). (0.5d)
- [ ] Privacy + ToS drafts; cookie posture. (0.5d)

**Accept:** Headers verified; signed URL demo works; policies published.

---

## Epic 8 — Legal & licensing (P1)
**Owner:** LEG  
**Est.:** 2 days  

**Tasks**
- [ ] Licensing matrix (OSM/ODbL, NASA, USGS, MapTiler, RIPE, Cloudflare). (1d)
- [ ] Attribution string generator. (0.5d)
- [ ] Name clearance + trademark search. (0.5d)

**Accept:** Matrix signed; attribution auto-renders; name cleared.

---

## Epic 9 — Performance & QA (P0)
**Owner:** ENG  
**Est.:** 2 days  

**Tasks**
- [ ] Device matrix; scripted perf run. (0.5d)
- [ ] WebGL context-loss handler; antimeridian seam fix; tile gutters. (1d)
- [ ] Visual regression for charts. (0.5d)

**Accept:** p95 frame ≤16ms on target devices; seams fixed; tests green.

---

## Epic 10 — Accessibility & i18n prep (P1)
**Owner:** ENG + PD  
**Est.:** 1.5 days  

**Tasks**
- [ ] Keyboard nav for chips/lens; focus order; ARIA. (1d)
- [ ] Reduced-motion toggle; copy externalization. (0.5d)

**Accept:** WCAG checklist items pass; tab flow works; motion toggle works.

---

## Epic 11 — Growth stack (P1)
**Owner:** MKT + ENG  
**Est.:** 2 days  

**Tasks**
- [ ] Social card generator endpoint + shortlink domain. (1d)
- [ ] Programmatic SEO template (region×hazard×time). (1d)

**Accept:** OG cards deterministic by URL; 10 SEO pages live.

---

## Epic 12 — Monetization plumbing (P2)
**Owner:** ENG + PM  
**Est.:** 2 days  

**Tasks**
- [ ] Stripe test flows; trials; metering events. (1d)
- [ ] Ads stack baseline with CLS guardrails. (1d)

**Accept:** Test checkout works; events fire; ads lazy-load, no layout shift.

---

## Epic 13 — Brand & naming (P0)
**Owner:** PD  
**Est.:** 1 day  

**Tasks**
- [ ] Decide name; register domain(s). (0.5d)
- [ ] Logo SVG, tokens (color, type scale), chart palette CVD-safe. (0.5d)

**Accept:** Domain live; tokens in repo; logo renders in app.

---

## Epic 14 — Ops/SRE (P1)
**Owner:** ENG  
**Est.:** 1.5 days  

**Tasks**
- [ ] Runbooks: ingest fail, tile 5xx, CDN purge, token leak. (0.5d)
- [ ] Alerts to email/Slack; status page. (1d)

**Accept:** Drill executed; status page shows feed freshness.

---

## Epic 15 — Enterprise readiness (P2)
**Owner:** ENG + PM  
**Est.:** 2 days  

**Tasks**
- [ ] Per-origin embed token; theme overrides; rate limits. (1d)
- [ ] SLA draft + usage reporting by domain. (1d)

**Accept:** Demo tenant works; SLA doc ready; usage report exports CSV.

---

## Epic 16 — Custom Alerts & User Authentication (P1)
**Goal:** Enable authenticated users to create custom threshold-based alerts for real-time environmental data.
**Owner:** ENG + PM
**Est.:** 4 days

**Tasks**
- [ ] Supabase Auth setup: enable email/OAuth providers (Google, GitHub). (0.5d)
- [ ] Resend integration for magic link OTP authentication flow. (0.5d)
- [ ] User session management + protected routes/API endpoints. (0.5d)
- [ ] Alert subscription schema: data types, thresholds, notification preferences. (0.5d)
- [ ] Alert creation UI: form for selecting data type, location, threshold values. (1d)
- [ ] Real-time monitoring service: Supabase Edge Functions polling unified_events. (1d)
- [ ] Email notification pipeline via Resend when thresholds exceeded. (0.5d)
- [ ] User dashboard: manage alerts, view history, update notification settings. (0.5d)

**Accept:** Users can sign in, create magnitude/AQI/brightness alerts, receive emails when triggered; dashboard shows alert history.

**Dependencies:**
- Epic 3 (Data contracts must be stable)
- Epic 7 (Security baseline required for auth flows)

**Future enhancements:**
- SMS/Slack/webhook notifications
- Geographic radius-based alerts
- Multi-condition logic (AND/OR operators)
- Alert templates library

---

## Sequence plan (30/60/90)
- **Days 0–14 (MVP):** Epics 1,2,3,6,7,9,13.  
- **Days 15–30:** Epics 4,5,8,10,11,14.  
- **Days 31–60:** Epics 12,15 + iterate on 4,5; tile migration prep.  
- **Days 61–90:** Paid layers GA, SEO scale, sponsor + first enterprise pilot.

---

## Owner legend
PM = Product · PD = Product Design · ENG = Engineering · DS = Data Science · MKT = Marketing · LEG = Legal

---

## Roll-up estimate
- P0 total: ~12.5 days
- P1 total: ~13.5 days (includes Epic 16: Custom Alerts)
- P2 total: ~4 days
Parallelizable; solo pace ≈ 5–7 weeks elapsed.
