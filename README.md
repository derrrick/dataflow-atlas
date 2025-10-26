# Dataflow Atlas

> A live, open platform visualizing global data flows across hazards, infrastructure, and connectivity

[![License: CC-BY-4.0](https://img.shields.io/badge/License-CC--BY--4.0-lightgrey.svg)](https://creativecommons.org/licenses/by/4.0/)
[![Next.js](https://img.shields.io/badge/Next.js-16.0-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)](https://www.typescriptlang.org/)

![Flow Atlas](https://via.placeholder.com/1200x600/141821/39D0FF?text=Flow+Atlas)

## 🌍 Overview

Flow Atlas is an interactive 3D globe that visualizes:

- **Hazards**: Real-time weather events, storms, and temperature anomalies (NOAA/NASA)
- **Earthquakes**: Live seismic activity from USGS
- **Internet Outages**: Global connectivity disruptions (Cloudflare Radar)
- **Network Latency**: Inter-regional network performance (RIPE Atlas)

The interface features a **Topographic Lens** that reveals terrain elevation on hover, and an **Analytical Strip** with Tufte-style charts for data-driven insights.

## ✨ Key Features

### 🗺️ Interactive Globe
- Built with **L7** (AntV geospatial library)
- Smooth WebGL rendering with auto-rotation
- Dynamic layer switching (hazards, quakes, outages, latency)
- High-performance rendering optimized for 60 FPS

### 📊 Analytical Charts
- **Sparklines**: 24-hour hazard intensity trends
- **Slopegraphs**: Regional before/after comparisons
- **Small Multiples**: Regional variation over time
- **Annotated Time Series**: Event timeline with highlights
- Built with **D3.js** following Edward Tufte's principles

### 🎨 Design System
- Flow Atlas custom brand tokens
- **daisyUI** component library
- Dark theme by default (light theme ready)
- Color-blind safe palettes
- High data-ink ratio visualizations

### 🔌 Embeddable
- Iframe embed support at `/embed`
- Attribution footer with "Open Full Map" CTA
- Clean, minimal interface for third-party sites

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm
- Modern browser with WebGL support

### Installation

```bash
# Clone or navigate to the project
cd flow-atlas

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) (or 3001 if 3000 is in use)

### Build for Production

```bash
npm run build
npm start
```

## 📂 Project Structure

```
flow-atlas/
├── app/
│   ├── globals.css           # Global styles and brand tokens
│   ├── layout.tsx             # Root layout with metadata
│   ├── page.tsx               # Main globe + analytical strip
│   ├── landing/page.tsx       # Marketing landing page
│   └── embed/page.tsx         # Embeddable globe view
├── components/
│   ├── Header.tsx             # Site header with navigation
│   ├── LayerControls.tsx      # Layer chip controls
│   ├── Globe.tsx              # L7 globe component
│   └── AnalyticalStrip.tsx    # D3 chart strip
├── lib/
│   ├── types.ts               # TypeScript data types
│   └── mockData.ts            # Mock data generators
├── public/
│   └── data/                  # Static data files (future)
├── tailwind.config.ts         # Tailwind + daisyUI config
├── tsconfig.json              # TypeScript configuration
└── next.config.ts             # Next.js + Turbopack config
```

## 🎯 Roadmap

### MVP (Current)
- [x] WebGL globe with L7
- [x] Layer controls for 4 data types
- [x] Analytical strip with 4 chart types
- [x] Landing page with email capture
- [x] Embed support
- [x] Mock data structure

### Phase 2 (Next 2-4 weeks)
- [ ] Real API integration (USGS, NOAA, Cloudflare, RIPE)
- [ ] Topographic lens implementation
- [ ] 30-day playback timeline
- [ ] Performance optimization (Web Workers)
- [ ] CSV/PNG export

### Phase 3 (Next 1-3 months)
- [ ] Energy grid overlays
- [ ] Population exposure layers
- [ ] Stripe payment integration
- [ ] SSO for enterprise embeds
- [ ] Webhook alerts
- [ ] Historical archives

## 🛠️ Technology Stack

| Category | Technology |
|----------|-----------|
| Framework | Next.js 16 (App Router) |
| Globe Rendering | L7 (AntV) |
| Charts | D3.js |
| Styling | Tailwind CSS + daisyUI |
| Language | TypeScript |
| Build Tool | Turbopack |

## 📊 Data Sources

| Layer | Source | Update Frequency |
|-------|--------|------------------|
| Hazards | NOAA/NASA GIBS | 5-15 min |
| Earthquakes | USGS | 1-5 min |
| Outages | Cloudflare Radar | 15 min |
| Latency | RIPE Atlas | 15-30 min |
| Topography | MapTiler / ETOPO | Static |

All data is subject to source licensing (open data compatible).

## 🎨 Brand & Design

Flow Atlas follows a **calm, empirical, non-alarmist** design philosophy:

- **Colors**: Cyan primary (`#39D0FF`), grayscale base, CVD-safe accents
- **Typography**: Inter, tabular numerals for metrics
- **Voice**: Factual, sparse, active voice
- **Inspiration**: Edward Tufte (high data-ink ratio)

See `Flow_Atlas_Brand_Package.md` for complete design system.

## 🔒 Performance Budgets

- Initial JS: < 200 KB gzip
- First paint: < 2s on median network
- Frame time: p95 ≤ 16ms (60 FPS)
- Draw calls: ≤ 10
- GPU memory: < 300 MB

## 📄 License

This project is currently private. Licensing TBD.

Data sources have individual licenses (see provenance documentation).

## 🤝 Contributing

This is currently a solo/small-team project. Contributions are not yet accepted publicly.

For questions or partnership inquiries, please contact via the website.

## 🙏 Acknowledgments

- **Edward Tufte** for visualization principles
- **AntV Team** for L7
- **Mike Bostock** for D3.js
- Data providers: USGS, NOAA, NASA, Cloudflare, RIPE NCC

---

Built with care. Made to last. Open by default.

© 2025 Flow Atlas
