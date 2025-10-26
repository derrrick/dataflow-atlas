# Fragility Map Project

## Overview
A real-time, WebGL-powered visualization revealing the Earth's physical, infrastructural, and digital fragility. The concept evolved from TufteGL (faithful, analytical chart recreation) toward an immersive, live data-art hybrid that surfaces global interdependencies and vulnerabilities.

---

## Concept Evolution
**Stage 1: TufteGL**
- Idea: recreate Edward Tufte’s iconic visualizations (Minard’s Napoleon March, Sparklines, Slopegraphs) with modern WebGL and D3.js.
- Goal: blend analytical clarity with technical depth.
- Outcome: foundation for combining minimal design with advanced rendering.

**Stage 2: Subsea Atlas**
- Inspiration: user's experience at TeleGeography and awareness of undersea cable mapping.
- Realization: infrastructure maps draw traffic and monetize through ads, data licensing, or sponsorships.

**Stage 3: The Fragility Map**
- Convergence of natural, digital, and human networks.
- Purpose: visualize how global systems behave, fail, and recover.
- Philosophy: make the invisible infrastructure of the planet visible—and alive.

---

## Core Experience
- Interactive 3D globe with dynamic overlays for hazard, energy, and data fragility.
- “Lens” hover state reveals topographic maps, elevation, slope, or bathymetry.
- Smooth transitions and ambient lighting create a living, cinematic quality.
- Analytical strip below the globe: minimalist Tufte-style charts summarizing live metrics.

---

## Target Audiences

### 1. General / Ambient Users
- Motivations: curiosity, beauty, real-time world activity.
- Analogues: Earth.nullschool, Windy.com.
- Monetization: ads, sponsorships, affiliate partnerships.
- Key trait: viral shareability.

### 2. Analysts and Infrastructure Professionals
- Use case: network planning, climate risk, and disaster response.
- Potential: data/API subscriptions, Pro dashboards, consulting.

### 3. Media and Education
- Need: visuals for reporting and teaching.
- Monetization: embed licensing, high-res exports, museum displays.

---

## Technical Architecture

### Stack
- **Frontend:** Three.js or Deck.gl (for globe and overlays)
- **Backend:** Node.js + Supabase/Postgres for data caching
- **Charts:** D3.js for Tufte-style sparklines, slopegraphs, and small multiples
- **Hosting:** Vercel with CDN caching; n8n or cron for data ingestion
- **Realtime Rendering:** WebGL shaders for smooth transitions and data blending

### Data Fusion Model
`fragility = hazard_intensity × exposure × (1 - resilience_score)`
- **Hazard:** storms, quakes, floods (NOAA, NASA, Copernicus)
- **Exposure:** population and infrastructure concentration (WorldPop, OSM)
- **Resilience:** redundancy, GDP, governance (World Bank, WRI)

---

## APIs and Data Sources

| Domain | Source / API | Access | Notes |
|--------|---------------|--------|-------|
| Weather | NOAA, NASA GIBS | ✅ Free | Storms, temperature anomalies |
| Seismic | USGS Earthquake API | ✅ Free | Real-time global events |
| Climate | Copernicus C3S | ✅ Free | Long-term climate indices |
| Infrastructure | OpenInfraMap | ✅ Free | Power, telecom, pipelines |
| Internet | Cloudflare Radar, RIPE Atlas | ✅ Free | Outages, latency |
| Energy | ENTSO-E, EIA, IRENA | ✅ Free | Grid generation and load |
| Transport | OpenSky Network, MarineTraffic | 🟡 Limited | Flight and shipping data |
| Population | WorldPop, GHSL | ✅ Free | 1 km grid population |
| Socioeconomic | World Bank, UN | ✅ Free | GDP, governance |
| Disasters | ReliefWeb API | ✅ Free | Emergency reports |

---

## Topographic Lens Interaction

### Behavior
- Hover: circular “lens” reveals alternate data mode (terrain, slope, contour, bathymetry).
- Click: lock multiple lenses; ESC clears.
- Drag: dynamic sampling of high-resolution tiles.

### Implementation
- **Libraries:** Three.js / OGL.
- **Data:** MapTiler or ETOPO1 Terrain-RGB tiles.
- **Shader Logic:** blend base fragility texture with topography using `smoothstep` mask.
- **Performance:** GPU texture atlas + worker prefetch for seamless motion.

---

## Analytical Layer (Tufte Influence)

| Visualization | Purpose |
|----------------|----------|
| Sparklines | Daily hazard or outage intensity |
| Slopegraphs | Before/after comparisons |
| Small multiples | Regional variation over time |
| Dot/strip plots | Recovery time distributions |
| Annotated time series | Highlight major global events |

**Principles**
- High data-ink ratio.
- Labels over legends.
- Grayscale base, one accent color.
- Minimal gridlines.
- Charts communicate single insights per view.

---

## Monetization Model
1. **Public Site (Ads):** ad impressions and affiliate sponsorship.
2. **Pro API Access:** enterprise dashboards and regional fragility scores.
3. **Media Licensing:** paid embeds and custom versions for networks.
4. **Educational Integration:** installations, classrooms, and exhibits.

---

## Implementation Roadmap
| Phase | Duration | Deliverables |
|--------|-----------|--------------|
| MVP (1 region) | 8 weeks | Basic globe, live NOAA + USGS data, fragility score calc |
| Global Prototype | 4 months | Multi-layer rendering, topographic lens, analytical charts |
| Production Site | 6–10 months | Ad integration, SEO, Pro API, export tools |

---

## Success Probability

| Dimension | Likelihood | Notes |
|------------|-------------|-------|
| MVP launch | 95% | Straightforward build |
| Viral traffic (>100k/mo) | 70% | Strong visual novelty |
| Sustained engagement | 60% | Requires evolving visuals |
| Ad revenue ($500–2k/mo) | 45% | CPM dependent |
| Enterprise adoption | 25% | Slower B2B cycle |
| Overall ROI | 55% | Above-average creative project potential |

---

## Differentiation and White Space
- Existing maps (FSI, GIRI) are static and coarse.
- No live system fuses natural + digital + infrastructure fragility.
- Few treat data visualization as *art*—an ambient sensory dashboard of the planet.

---

## Design Philosophy
- Data should feel **alive**, not academic.
- Blend **aesthetic beauty** (WebGL motion) with **empirical clarity** (Tufte charts).
- Avoid excess interface: hover, observe, learn.
- Every pixel serves meaning; every chart answers one question.

---

## Next Steps
1. Choose rendering library (Three.js or Deck.gl).
2. Build live globe prototype with sample APIs (NOAA + USGS + Cloudflare).
3. Add topographic lens (MapTiler terrain tiles).
4. Construct analytical strip with four Tufte charts.
5. Deploy on Vercel and soft-launch.
6. Gather feedback, tune data cadence, and monetize.

---

© 2025. Fragility Map Concept — Draft for internal exploration.
