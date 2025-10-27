# Edward Tufte Chart Library - Flow Atlas
**Comprehensive Implementation Plan**

Version: 1.0
Last Updated: 2025-10-25

---

## Table of Contents

1. [Philosophy & Architecture](#philosophy--architecture)
2. [Technology Stack](#technology-stack)
3. [Chart Library (01-48)](#chart-library-01-48)
4. [Data Type Mapping](#data-type-mapping)
5. [Interactive Dashboard Architecture](#interactive-dashboard-architecture)
6. [Design System](#design-system)
7. [Implementation Phases](#implementation-phases)
8. [Component Structure](#component-structure)
9. [State Management](#state-management)
10. [Accessibility & Keyboard Shortcuts](#accessibility--keyboard-shortcuts)

---

## Philosophy & Architecture

### Edward Tufte Design Principles

1. **Maximize data-ink ratio** - Every pixel should represent data
2. **Eliminate chartjunk** - Remove decorative elements
3. **Small multiples** - Use repetition for comparison
4. **Layering & separation** - Clear visual hierarchy
5. **Micro/macro readings** - Detail and overview simultaneously
6. **Integration of text & graphics** - Labels as part of the data

### Chart Organization by Storytelling Role

Each chart serves a specific analytical narrative:

- **01-10:** Spatial density & spread (where events cluster)
- **11-20:** Temporal motion & rhythm (how patterns evolve)
- **21-30:** Cross-metric correlation (relationships between variables)
- **31-40:** Infrastructure topology (network structure & flows)
- **41-48:** Integrated, experimental views (novel perspectives)

---

## Technology Stack

### Current Dependencies (Installed)

- **MapLibre GL 5.9.0** - Spatial layers, base map
- **D3.js 7.9.0** - Dynamic overlays, custom visualizations
- **React 19.2.0** - Component architecture
- **TypeScript 5.9.3** - Type safety
- **Next.js 16.0.0** - Framework with Turbopack
- **Lucide React** - Icon library

### Dependencies to Install

```bash
npm install three recharts d3-hexbin d3-contour topojson-client
npm install --save-dev @types/three @types/d3-hexbin
```

**Packages:**
- **three.js** - 3D terrain extrusions, globe projections
- **Recharts** - Dashboard components (React-friendly, smaller bundle than ECharts)
- **d3-hexbin** - Hexagonal binning for spatial charts
- **d3-contour** - Contour/isoline generation
- **topojson-client** - Geographic topology simplification

---

## Chart Library (01-48)

### 01-10: Spatial Density & Spread
**Library:** MapLibre GL + D3 overlays

#### 01. Point Map (Individual Events)
- **Purpose:** Show exact earthquake locations
- **Data:** earthquakes.coords, magnitude
- **Tufte principle:** Minimal markers, data-driven sizing
- **Tech:** MapLibre circle layer
- **Status:** ✅ Already implemented

#### 02. Graduated Symbol Map (Magnitude Scaling)
- **Purpose:** Visual magnitude comparison
- **Data:** earthquakes.magnitude → circle radius
- **Tufte principle:** Proportional symbols, no fill decoration
- **Tech:** MapLibre circle layer with zoom-responsive sizing
- **Status:** ✅ Already implemented

#### 03. Cluster Map (Aggregated Events)
- **Purpose:** Reduce visual clutter at global zoom
- **Data:** Aggregate nearby earthquakes
- **Tufte principle:** Simplify without losing data density
- **Tech:** MapLibre cluster source

#### 04. Heatmap (Intensity Surface)
- **Purpose:** Show concentration zones
- **Data:** earthquakes density, magnitude weights
- **Tufte principle:** Monochrome gradient, no rainbow colors
- **Tech:** MapLibre heatmap layer

#### 05. Hexbin Density Map (Event Frequency Grid)
- **Purpose:** Spatial binning for pattern recognition
- **Data:** Event counts per hexagon
- **Tufte principle:** Regular grid shows distribution objectively
- **Tech:** D3 + d3-hexbin, rendered as SVG overlay

#### 06. Kernel Density Surface (Stress Zones)
- **Purpose:** Smooth probability surface
- **Data:** earthquakes with depth weighting
- **Tufte principle:** Continuous gradient shows likelihood
- **Tech:** D3 + custom KDE algorithm

#### 07. Voronoi Region Map (Influence Zones)
- **Purpose:** Show nearest-event boundaries
- **Data:** earthquakes.coords → Voronoi polygons
- **Tufte principle:** Tessellation reveals spatial structure
- **Tech:** D3 delaunay/voronoi

#### 08. Contour Map (Gradient Isolines)
- **Purpose:** Magnitude or air quality levels
- **Data:** Interpolated surfaces from points
- **Tufte principle:** Labeled contours like topographic maps
- **Tech:** D3 + d3-contour

#### 09. Choropleth Map (Severity by Region)
- **Purpose:** Regional aggregation (countries/states)
- **Data:** hazards.severity grouped by region
- **Tufte principle:** Minimal color steps, clear breaks
- **Tech:** MapLibre fill layer with GeoJSON

#### 10. Bubble Overlay (Affected Populations)
- **Purpose:** Show impact scale independent of geography
- **Data:** outages.affected → bubble size
- **Tufte principle:** Overlapping circles show overlap in impact
- **Tech:** D3 force simulation + SVG overlay

---

### 11-20: Temporal Motion & Rhythm
**Library:** D3.js + MapLibre animations

#### 11. Sparklines per Region (Inline Metrics)
- **Purpose:** Compact time-series for dashboards
- **Data:** latency.latency over last 24h per region
- **Tufte principle:** Wordlike graphics, no axes needed
- **Tech:** D3 line generator, SVG in 50x15px containers

#### 12. Horizon Graph (Multi-Location Comparison)
- **Purpose:** Compare 5+ latency streams compactly
- **Data:** latency.latency for all 5 nodes over time
- **Tufte principle:** Layered bands maximize data density
- **Tech:** D3 custom rendering with clipping

#### 13. Time Slider Map (24h Playback)
- **Purpose:** Replay earthquake sequence
- **Data:** earthquakes.timestamp → animation frames
- **Tufte principle:** Minimal scrubber, focus on events
- **Tech:** MapLibre + React state for time control

#### 14. Animated Timeline Map (Events Unfolding)
- **Purpose:** Show propagation over time
- **Data:** earthquakes appear chronologically
- **Tufte principle:** Motion shows causality
- **Tech:** MapLibre filters + requestAnimationFrame

#### 15. Ripple Effect Animation (Epicenter Propagation)
- **Purpose:** Visualize seismic wave spread
- **Data:** earthquakes.coords → expanding circles
- **Tufte principle:** Physical metaphor for wave motion
- **Tech:** MapLibre circle layer with animated radius
- **Status:** ✅ Already implemented

#### 16. Pulse Map (Live Heartbeat)
- **Purpose:** Show active latency probes
- **Data:** latency.latency → pulse frequency
- **Tufte principle:** Rhythm conveys data freshness
- **Tech:** MapLibre + CSS animations or canvas

#### 17. Event Heat Timeline (Temporal Density)
- **Purpose:** Show when events cluster
- **Data:** earthquakes.timestamp → hour bins
- **Tufte principle:** Calendar heatmap style
- **Tech:** D3 rect grid (24h × 7d)

#### 18. Rolling Bar Race (Outage Severity Over Time)
- **Purpose:** Show ranking changes
- **Data:** outages.affected over refresh cycles
- **Tufte principle:** Minimal, no decorative icons
- **Tech:** D3 transitions on bar chart

#### 19. Temporal Chord Diagram (Event Connections)
- **Purpose:** Show temporal co-occurrence
- **Data:** earthquakes within N hours → chords
- **Tufte principle:** Connections show relationships
- **Tech:** D3 chord layout

#### 20. Radial Time Wheel (24h Cycle)
- **Purpose:** Circular calendar view
- **Data:** earthquakes.timestamp → polar coordinates
- **Tufte principle:** Circular time is intuitive for cycles
- **Tech:** D3 arc generator

---

### 21-30: Cross-Metric Correlation
**Library:** D3.js + Recharts

#### 21. Scatterplot Map (Depth vs Magnitude)
- **Purpose:** Find magnitude-depth patterns
- **Data:** earthquakes.depth (x) vs magnitude (y)
- **Tufte principle:** Direct labeling, no legend needed
- **Tech:** D3 scatterplot with spatial color encoding

#### 22. Bivariate Choropleth (Severity + Population)
- **Purpose:** Show dual metrics per region
- **Data:** hazards.severity × hazards.affected
- **Tufte principle:** 2D color matrix (low/low → high/high)
- **Tech:** D3 + custom bivariate scale

#### 23. Parallel Coordinates (Multi-Metric Comparison)
- **Purpose:** Compare earthquakes across 4+ dimensions
- **Data:** magnitude, depth, time, distance
- **Tufte principle:** Brushing reveals patterns
- **Tech:** D3 parallel coordinates layout

#### 24. Violin Plot (Distribution Shapes)
- **Purpose:** Show magnitude distribution by region
- **Data:** earthquakes.magnitude grouped by location
- **Tufte principle:** Mirrored density curves
- **Tech:** D3 + KDE + area generator

#### 25. Ridgeline Plot (Temporal Density by Region)
- **Purpose:** Compare latency distributions across hubs
- **Data:** latency.latency per region over time
- **Tufte principle:** Stacked density curves (Joy Division style)
- **Tech:** D3 area generator + vertical offset

#### 26. Matrix Heatmap (Regions × Hazard Types)
- **Purpose:** Show hazard type frequency
- **Data:** hazards.type × hazards.location
- **Tufte principle:** Grid shows all combinations
- **Tech:** D3 rect grid with color scale

#### 27. Treemap (Event Share by Type)
- **Purpose:** Show proportions of hazard types
- **Data:** hazards.type → rectangle area
- **Tufte principle:** Space-filling shows hierarchy
- **Tech:** D3 treemap layout

#### 28. Small Multiples Map (Region Comparison)
- **Purpose:** Side-by-side spatial comparison
- **Data:** Same metric across 4 regions
- **Tufte principle:** Repetition enables comparison
- **Tech:** 4× MapLibre instances or 4× D3 projections

#### 29. Connected Scatter (Latency vs Time per Node)
- **Purpose:** Show trajectory of individual nodes
- **Data:** latency.latency over time, connected lines
- **Tufte principle:** Slopegraph shows change
- **Tech:** D3 line + scatterplot hybrid

#### 30. Streamgraph (Hazard Composition)
- **Purpose:** Show changing hazard mix over time
- **Data:** hazards.type stacked by timestamp
- **Tufte principle:** Flowing organic shapes
- **Tech:** D3 stack + area generator

---

### 31-40: Infrastructure Topology
**Library:** D3.js force layouts + MapLibre

#### 31. Network Topology Map (Nodes + Outage Edges)
- **Purpose:** Show ISP connectivity
- **Data:** latency nodes + outages as edges
- **Tufte principle:** Graph overlay on geography
- **Tech:** MapLibre points + D3 line overlay

#### 32. Sankey Diagram (Data Flow Disruptions)
- **Purpose:** Show rerouting due to outages
- **Data:** latency.region → flow paths
- **Tufte principle:** Flow width = bandwidth/traffic
- **Tech:** D3 sankey layout

#### 33. Force-Directed Graph (ISP Relationships)
- **Purpose:** Show network clustering
- **Data:** outages.provider → nodes, links by shared regions
- **Tufte principle:** Physics reveals community structure
- **Tech:** D3 force simulation

#### 34. Radial Link Map (Global Latency Interconnections)
- **Purpose:** Hub-and-spoke visualization
- **Data:** latency.region → central hub with radial links
- **Tufte principle:** Radial shows centrality
- **Tech:** D3 radial layout

#### 35. Path Latency Plot (Source–Destination Delay)
- **Purpose:** Show latency between all pairs
- **Data:** latency.latency between each hub pair
- **Tufte principle:** Matrix or arc diagram
- **Tech:** D3 arc or adjacency matrix

#### 36. Outage Ring Map (Impact Radius)
- **Purpose:** Show geographic reach of outage
- **Data:** outages.coords + radius from affected count
- **Tufte principle:** Circles show zone of influence
- **Tech:** MapLibre circle layer with scaled radius

#### 37. Dependency Tree (Failure Propagation)
- **Purpose:** Show cascade effects
- **Data:** outages → dependent services (simulated)
- **Tufte principle:** Tree shows hierarchy
- **Tech:** D3 tree layout

#### 38. Grid Overlay (Network Coverage)
- **Purpose:** Show ISP coverage areas
- **Data:** outages.provider → coverage polygons
- **Tufte principle:** Grid shows infrastructure
- **Tech:** MapLibre fill layer

#### 39. Flow Map (Traffic Rerouting)
- **Purpose:** Show data path changes during outages
- **Data:** latency before/after outage → curved flows
- **Tufte principle:** Bézier curves show movement
- **Tech:** D3 curves on MapLibre

#### 40. Edge Bundling Graph (Connectivity Simplification)
- **Purpose:** Reduce visual clutter in network
- **Data:** All latency connections bundled
- **Tufte principle:** Bundling reveals main corridors
- **Tech:** D3 hierarchical edge bundling

---

### 41-48: Integrated, Experimental Views
**Library:** three.js + D3 + MapLibre fusion

#### 41. Layered Hazard Stack Map (Multi-Layer Overlap)
- **Purpose:** Show simultaneous hazards
- **Data:** earthquakes + hazards + outages stacked
- **Tufte principle:** Transparency shows intersection
- **Tech:** MapLibre multiple layers with blend modes

#### 42. Magnitude–Impact Scatter (Color by Hazard Type)
- **Purpose:** Correlate earthquake size with casualties
- **Data:** earthquakes.magnitude × hazards.affected, colored by hazards.type
- **Tufte principle:** Color encodes third dimension
- **Tech:** D3 scatterplot

#### 43. Pulse Grid (Live Node Activity Dashboard)
- **Purpose:** Real-time status board
- **Data:** All 4 data types in small multiples grid
- **Tufte principle:** Dense dashboard, minimal chrome
- **Tech:** Recharts or custom D3 grid

#### 44. 3D Terrain Seismic Extrusion (Depth Visualization)
- **Purpose:** Show earthquake depth in 3D
- **Data:** earthquakes.depth → vertical extrusion
- **Tufte principle:** 3D when it adds understanding
- **Tech:** three.js with MapLibre base

#### 45. Globe Projection with Arcs (Latency Between Hubs)
- **Purpose:** Show global network in 3D
- **Data:** latency.region → arc heights by latency
- **Tufte principle:** Globe shows true distances
- **Tech:** three.js globe + arc geometry

#### 46. Ternary Plot (Hazard Severity Composition)
- **Purpose:** Show 3-way severity breakdown
- **Data:** hazards.severity (Low/Medium/High) → ternary space
- **Tufte principle:** Triangle shows 3-part composition
- **Tech:** D3 custom projection

#### 47. Bubble Timeline (Events × Time × Magnitude)
- **Purpose:** 3D scatterplot over time
- **Data:** earthquakes.timestamp (x) × depth (y) × magnitude (size)
- **Tufte principle:** Animated reveals time dimension
- **Tech:** D3 with time slider

#### 48. Isoline Mesh (Latency/Air Quality Gradients)
- **Purpose:** 3D surface of interpolated values
- **Data:** latency.latency → interpolated surface → 3D mesh
- **Tufte principle:** Continuous surface from discrete points
- **Tech:** three.js + D3 contour

---

## Data Type Mapping

### Current Data Sources

1. **Earthquakes** - Real-time USGS API, global, depth + magnitude
2. **Hazards** - Simulated environmental data, 4 fixed points, severity + affected
3. **Outages** - Network infrastructure, 3 metro areas, provider-based
4. **Latency** - 5 global nodes, real-time, continuous values

### Recommended Charts by Data Type

#### 1. Earthquakes (Real-time, Global, Depth + Magnitude)

**Primary Trio (Build First):**
- **Spatial:** 04. Heatmap (regional quake density)
- **Temporal:** 15. Ripple Map (propagation animation) ✅ *Already implemented*
- **Analytic:** 21. Scatterplot (depth vs magnitude)

**Secondary Charts:**
- 01. Point map ✅ *Already implemented*
- 02. Graduated symbol map ✅ *Already implemented*
- 08. Contour map (seismic intensity field)
- 05. Hexbin density map (cluster frequency)
- 44. 3D extrusion map (depth as vertical drop)
- 13. Time slider playback
- 14. Animated timeline map
- 20. Radial time wheel
- 25. Ridgeline plot (frequency by region)
- 24. Violin plot (magnitude distribution)
- 17. Event heat timeline
- 28. Small multiples (region comparison)

**Most Insightful:** Heatmap + 3D depth extrusion + ripple animation

---

#### 2. Hazards (Simulated, 4 Fixed Points, Severity + Affected)

**Primary Trio (Build First):**
- **Spatial:** 09. Choropleth (severity by location)
- **Temporal:** 30. Streamgraph (severity mix over time)
- **Analytic:** 27. Treemap (population share by type)

**Secondary Charts:**
- 10. Bubble overlay (affected population)
- 41. Layered hazard stack (type overlays)
- 07. Voronoi region map (influence zones)
- 11. Sparklines (each hazard's trend)
- 12. Horizon graph (variation comparison)
- 26. Matrix heatmap (region × type)
- 46. Ternary plot (composition of impacts)

**Most Insightful:** Choropleth + Treemap + Streamgraph

---

#### 3. Outages (Network Infrastructure, 3 Metro Areas)

**Primary Trio (Build First):**
- **Spatial:** 03. Cluster map (affected hubs)
- **Temporal:** 18. Rolling bar race (provider impact over time)
- **Analytic:** 33. Force-directed graph (ISP relationships)

**Secondary Charts:**
- 10. Bubble map (affected users)
- 39. Flow map (rerouted traffic)
- 36. Outage ring map (impact radius)
- 16. Pulse map (real-time activity)
- 17. Timeline heat (incident intensity)
- 31. Network topology map (nodes + edges)
- 37. Dependency tree (failure propagation)

**Most Insightful:** Cluster map + Force-directed network + Outage ring map

---

#### 4. Latency (5 Global Nodes, Real-time, Continuous Values)

**Primary Trio (Build First):**
- **Spatial:** 45. Arc map (hub-to-hub delay) - *Globe projection with arcs*
- **Temporal:** 12. Horizon graph (multi-node trends)
- **Analytic:** 23. Parallel coordinates (multi-metric comparison)

**Secondary Charts:**
- 39. Flow map (latency routes)
- 10. Bubble overlay (color/size = latency)
- 48. Isoline mesh (latency contour gradients)
- 11. Sparklines per node
- 30. Streamgraph (traffic fluctuation)
- 43. Pulse grid (node heartbeat dashboard)
- 21. Scatter (latency vs distance)
- 29. Connected scatter (trajectory over time)

**Most Insightful:** Arc map + Horizon graph + Parallel coordinates

---

#### 5. Cross-Type Fusion (Multi-Source Integration)

**Priority Charts:**
- 41. Layered hazard stack (Hazards + Earthquakes)
- 22. Bivariate choropleth (Outages + Latency)
- 45. Globe arcs (Latency between quake zones)
- 06. Kernel density surface (Earthquake + Hazard overlap)

---

## Dynamic Chart Architecture (Layer-Based Data System)

### Overview

**Status:** ⚠️ **PARTIALLY IMPLEMENTED** (2025-10-26)

To support the full 22-layer data ecosystem (8 Natural, 8 Infrastructure, 6 Systemic layers), we've implemented a **unified data normalization architecture** that allows all 48 charts to dynamically respond to layer selection changes.

### ⚠️ IMPORTANT: Current Implementation Coverage

**Architecture Status:** ✅ **FULLY READY** - The unified data system is production-ready and extensible

**Normalization Coverage:** ⚠️ **6 of 22 layers implemented (27%)**

#### Implemented Layers:
- ✅ **Natural (3/8):** earthquakes, wildfire, air-quality
- ✅ **Infrastructure (3/8):** power-outages, internet-outages, cellular-outages
- ✅ **Systemic (1/6):** latency

#### Pending Layers (16 remaining):
- ❌ **Natural (5):** flood, drought, ocean-temp, volcanic, severe-weather
- ❌ **Infrastructure (5):** power-grid, transportation, air-port, water-systems, population
- ❌ **Systemic (5):** supply-chain, gnss, temp-stress, social-signals, risk-indices

**What This Means:**
- ✅ The architecture is production-ready and works for all implemented layers
- ✅ Charts automatically adapt when users toggle between the 6 active layers
- ✅ Adding new layers only requires: (1) data type interface, (2) normalization function, (3) add to `unifyAllData()`
- ⚠️ **Charts will show "No data" for the 16 pending layers until their normalization functions are implemented**
- 📋 Each new data source integration requires adding its normalization function to `lib/utils/dataNormalization.ts`

**Priority:** As new data sources come online, implement their normalization functions following the established pattern (see "Adding Future Layers" section below).

### The Problem

Originally, charts were hardcoded to specific data types:
- Earthquakes → magnitude, depth
- Wildfires → brightness, confidence
- Air Quality → AQI, PM2.5
- Each had different value ranges and meanings

With 22 different layer types, we needed charts to:
1. Work with any combination of active layers
2. Normalize different metrics to comparable scales
3. Preserve original data for specialized visualizations
4. Update automatically when users toggle layers

### The Solution: Unified Data Interface

#### 1. UnifiedDataPoint Type

**File:** `lib/services/dataTypes.ts:73-95`

```typescript
export interface UnifiedDataPoint {
  id: string
  coords: [number, number]
  timestamp: number
  time: string
  location: string

  // Normalized metrics (0-100 scale for cross-layer comparison)
  primaryValue: number      // Main metric (magnitude, AQI, confidence, etc.)
  secondaryValue?: number   // Secondary metric (depth, PM2.5, brightness, etc.)
  tertiaryValue?: number    // Additional metric if needed
  severity: 'low' | 'medium' | 'high' | 'critical'

  // Layer identification
  layerType: string         // 'earthquakes', 'wildfire', 'air-quality', etc.
  layerLabel: string        // Human-readable layer name

  // Original data preserved for specialized charts
  rawData: Earthquake | Wildfire | AirQuality | Hazard | Outage | LatencyPoint
}
```

**Key Design Decisions:**
- **primaryValue** normalized to 0-100 scale enables cross-layer comparison
- **severity** categorical levels work across all data types
- **rawData** preserved so specialized charts can access original values
- **layerType** enables charts to adapt rendering (colors, labels, etc.)

#### 2. Data Normalization Functions

**File:** `lib/utils/dataNormalization.ts`

Each data type has a normalization function that converts to UnifiedDataPoint:

**Earthquakes:**
```typescript
primaryValue: magnitude * 10  // 0-10 magnitude → 0-100 scale
secondaryValue: depth
severity: magnitude >= 7 ? 'critical' : magnitude >= 6 ? 'high' : ...
```

**Wildfires:**
```typescript
primaryValue: confidence  // Already 0-100
secondaryValue: brightness
severity: confidence >= 80 && brightness >= 350 ? 'critical' : ...
```

**Air Quality:**
```typescript
primaryValue: (aqi / 500) * 100  // 0-500 AQI → 0-100 scale
secondaryValue: pm25
severity: aqi >= 300 ? 'critical' : aqi >= 150 ? 'high' : ...
```

**Master Unification Function:**
```typescript
export function unifyAllData(params: {
  earthquakes: Earthquake[]
  wildfires: Wildfire[]
  airQuality: AirQuality[]
  hazards: Hazard[]
  outages: Outage[]
  latency: LatencyPoint[]
  activeLayers: Set<string>
}): UnifiedDataPoint[]
```

This function:
- Takes all available data sources
- Checks `activeLayers` from LayerContext
- Only normalizes and includes active layers
- Returns sorted unified array (most recent first)

#### 3. ChartGrid Integration

**File:** `components/ChartGrid.tsx:104-326`

ChartGrid monitors layer selection and creates unified data:

```typescript
const { activeLayers } = useLayer()
const { earthquakes, wildfires, airQuality, hazards, outages, latencyPoints } = useData()

// Create unified data based on active layers
const unifiedData = useMemo(() => {
  return unifyAllData({
    earthquakes: earthquakes || [],
    wildfires: wildfires || [],
    airQuality: airQuality || [],
    hazards: hazards || [],
    outages: outages || [],
    latency: latencyPoints || [],
    activeLayers,
  })
}, [earthquakes, wildfires, airQuality, hazards, outages, latencyPoints, activeLayers])
```

Charts receive both formats for backwards compatibility:
```typescript
<LazyChartWrapper
  Component={Component}
  data={sampledData.unified || []}          // New: unified format
  unified={sampledData.unified || []}
  earthquakes={sampledData.earthquakes || []}  // Legacy: original types
  airQuality={sampledData.airQuality || []}
  wildfires={sampledData.wildfires || []}
  activeLayers={activeLayers}
/>
```

#### 4. Chart Adaptation Pattern (Sparkline Example)

**File:** `lib/charts/d3/01-sparkline.tsx:7-42`

Charts detect data format and adapt:

```typescript
interface SparklineProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  width?: number
  height?: number
}

export function Sparkline({ data, unified, earthquakes, width, height }: SparklineProps) {
  useEffect(() => {
    // Prefer unified, fallback to legacy
    const sourceData = unified || data || earthquakes || []

    const chartData = sourceData.map((item, i) => {
      // Auto-detect format
      const value = 'primaryValue' in item
        ? item.primaryValue / 10     // UnifiedDataPoint (scale back from 0-100)
        : (item as Earthquake).magnitude  // Legacy Earthquake

      return { index: i, value }
    })

    // D3 rendering code uses normalized chartData...
  }, [data, unified, earthquakes, width, height])
}
```

### How It Works (User Flow)

1. **User clicks layer in LayerControls**
   - e.g., activates "Wildfire Activity" + "Air Quality"

2. **LayerContext updates activeLayers Set**
   - `activeLayers = Set(['wildfire', 'air-quality'])`

3. **ChartGrid detects change via useMemo**
   - Calls `unifyAllData()` with new activeLayers
   - Returns array of `UnifiedDataPoint[]` with only wildfire + air quality data

4. **Charts receive new unified data**
   - Sparkline re-renders with combined wildfire confidence + AQI values
   - Histogram shows distribution across both metrics
   - Scatter plot can correlate the two data types

5. **User toggles off "Wildfire Activity"**
   - Unified data updates to only air quality
   - All charts automatically update to show only AQI data

### Benefits

✅ **Scalable** - Add new layers by creating one normalization function
✅ **Backwards Compatible** - Existing charts continue working unchanged
✅ **Type-Safe** - Full TypeScript support with proper interfaces
✅ **Dynamic** - Charts update automatically when layers change
✅ **Flexible** - Charts can use unified OR original data as needed
✅ **Cross-Layer Correlations** - Can visualize relationships between any layer types
✅ **Consistent UX** - All charts respond to same layer selection controls

### Implementation Status

| Component | Status | File |
|-----------|--------|------|
| UnifiedDataPoint interface | ✅ Complete | `lib/services/dataTypes.ts:73-95` |
| Normalization functions | ✅ Complete | `lib/utils/dataNormalization.ts` |
| ChartGrid integration | ✅ Complete | `components/ChartGrid.tsx:104-326` |
| Sparkline (proof of concept) | ✅ Complete | `lib/charts/d3/01-sparkline.tsx` |
| DataContext exports | ✅ Complete | `contexts/DataContext.tsx:8-95` |

### Normalization Mappings

| Layer Type | Primary Value | Secondary Value | Severity Logic |
|------------|---------------|-----------------|----------------|
| Earthquakes | magnitude * 10 | depth | magnitude >= 7 = critical |
| Wildfires | confidence | brightness | confidence >= 80 && brightness >= 350 = critical |
| Air Quality | (aqi / 500) * 100 | pm25 | aqi >= 300 = critical |
| Hazards | Low=25, Med=50, High=75 | affected | severity field |
| Power Outages | log10(affected) / 7 * 100 | affected | affected >= 1M = critical |
| Network Latency | (latency / 1000) * 100 | latency | latency >= 500ms = critical |

### Next Steps for Future Layers

When adding a new layer (e.g., "Flood & Rainfall"):

1. **Add interface** to `dataTypes.ts`:
   ```typescript
   export interface Flood {
     id: string
     coords: [number, number]
     waterLevel: number  // meters
     rainfall: number    // mm/hr
     timestamp: number
     // ...
   }
   ```

2. **Create normalization function** in `dataNormalization.ts`:
   ```typescript
   export function normalizeFloods(floods: Flood[]): UnifiedDataPoint[] {
     return floods.map(flood => ({
       primaryValue: (flood.waterLevel / 10) * 100,  // Normalize water level
       secondaryValue: flood.rainfall,
       severity: flood.waterLevel >= 5 ? 'critical' : ...,
       layerType: 'flood',
       layerLabel: 'Flood & Rainfall',
       rawData: flood,
       // ... standard fields
     }))
   }
   ```

3. **Add to unifyAllData** function:
   ```typescript
   if (activeLayers.has('flood')) {
     unified.push(...normalizeFloods(floods))
   }
   ```

4. **Update ChartGrid** to pass flood data to unifyAllData

5. **Charts automatically work** with flood data via unified interface!

### Chart Migration Path

To update an existing chart to use unified data:

1. **Update props interface:**
   ```typescript
   interface ChartProps {
     data?: OriginalType[] | UnifiedDataPoint[]
     unified?: UnifiedDataPoint[]
     [originalType]?: OriginalType[]  // Keep for backwards compat
   }
   ```

2. **Add data source selection:**
   ```typescript
   const sourceData = unified || data || [originalType] || []
   ```

3. **Add format detection:**
   ```typescript
   const value = 'primaryValue' in item
     ? item.primaryValue / normalizer  // UnifiedDataPoint
     : item.originalMetric             // Original type
   ```

4. **Test with multiple layer combinations**

### Performance Considerations

- **Memoization** - `unifiedData` only recalculates when inputs change
- **Sampling** - ChartGrid limits to 50 data points per chart (configurable)
- **Lazy loading** - Charts only render when visible (IntersectionObserver)
- **Efficient filtering** - Set operations for layer checking

### Future Enhancements

- [ ] **Layer-specific chart metadata** - Dynamic titles/labels based on active layers
- [ ] **Multi-layer correlation charts** - Dedicated charts for cross-layer analysis
- [ ] **Smart severity aggregation** - Combined severity when multiple layers active
- [ ] **Layer color blending** - Visual encoding of layer combinations
- [ ] **Export with layer context** - Include active layers in exported data

---

## Interactive Dashboard Architecture

### Three Panel States

#### Collapsed (Current State)
- **Height:** ~300px (fits 4 charts + footer)
- **Map Height:** ~70% of viewport
- **Shows:** 4 primary charts in a row
- **Grid:** 1 column (mobile), 2 columns (tablet), 4 columns (desktop)

#### Half-Expanded
- **Height:** 50vh (half viewport)
- **Map Height:** 50vh
- **Shows:** 8-12 charts in 2 rows, filter sidebar appears
- **Grid:** 1 column (mobile), 2 columns (tablet), 3 columns (desktop), 4 columns (wide)

#### Full-Expanded
- **Height:** 85vh (nearly full screen)
- **Map Height:** 15vh (minimal context)
- **Shows:** All available charts in grid, full filter controls
- **Grid:** 2 columns (mobile), 3 columns (tablet), 4 columns (desktop), 5 columns (wide)

### Panel Visual Layout

```
┌─────────────────────────────────────────────────────┐
│ ▼ Analytics Dashboard     [−][□][✕]  [Filter ≡]    │ ← Header
├─────────────────────────────────────────────────────┤
│ ┌─────┐                                    ┌──────┐ │
│ │     │ [Filters Sidebar]                  │      │ │
│ │Filt │ • Data Type: ☑ Earthquakes         │      │ │
│ │ers  │              ☑ Hazards             │      │ │
│ │     │              ☐ Outages             │Chart │ │
│ │     │ • Time: Last 24h [slider]          │ Grid │ │
│ │     │ • Magnitude: 4.5 - 7.5 [range]     │      │ │
│ └─────┘ • Region: [dropdown]               │      │ │
│         • Chart Type: [All ▾]              └──────┘ │
│                                                      │
│ [Chart Grid - Responsive 2, 3, 4, or 5 columns]    │
└─────────────────────────────────────────────────────┘
```

### Chart Modal for Detailed Views

```
┌────────────────────────────────────────────────────────────┐
│ [←] 04. Heatmap - Earthquake Density        [↓ Export] [✕] │
├────────────────────────────────────────────────────────────┤
│                                                             │
│                                                             │
│                                                             │
│              [FULL-SIZE CHART]                             │
│              (3× larger than grid view)                    │
│                                                             │
│                                                             │
│                                                             │
├────────────────────────────────────────────────────────────┤
│ Filters: [⚙] Data: 24h | Magnitude: 4.5-7.5 | All Regions │
│                                                             │
│ Details:                                                    │
│ • Data points: 45 earthquakes                              │
│ • Time range: Last 24 hours                                │
│ • Density calculation: Kernel bandwidth 50km               │
│ • Color scale: Monochrome intensity                        │
└────────────────────────────────────────────────────────────┘
```

### Filter System

#### Filter Context State

```typescript
interface FilterState {
  dataTypes: Set<'earthquakes' | 'hazards' | 'outages' | 'latency'>
  timeRange: {
    start: number
    end: number
    preset: '1h' | '6h' | '24h' | '7d' | 'custom'
  }
  magnitude: {
    min: number
    max: number
  }
  severity: Set<'Low' | 'Medium' | 'High'>
  regions: Set<string>
  metrics: {
    latency?: { min: number, max: number }
    affected?: { min: number, max: number }
  }
  chartTypes: Set<string> // '01', '02', '04', etc.
}
```

#### Filter Components

1. **TimeRangeFilter** - Preset buttons (1h, 6h, 24h, 7d) + custom range
2. **DataTypeFilter** - Checkboxes with badge color indicators
3. **SeverityFilter** - Range sliders with distribution histograms
4. **RegionFilter** - Dropdown with geographic regions
5. **MetricFilter** - Custom ranges for latency, affected users

### Modal Features

1. **Export Options**
   - SVG (vector for print)
   - PNG (raster for presentations)
   - CSV (raw data)
   - JSON (filtered dataset)

2. **Annotation Tools** (Future)
   - Add text labels
   - Draw circles/rectangles
   - Highlight specific points
   - Save annotated version

3. **Advanced Filters**
   - All standard filters
   - Chart-specific options (contour levels, bin size, etc.)

---

## Design System

### Color Palette (Tufte-inspired)

```typescript
// /lib/charts/core/tufte-theme.ts
export const tufteColors = {
  // Base (existing app theme)
  background: '#141821',
  foreground: '#C6CFDA',
  muted: '#8F9BB0',
  border: '#242C3A',

  // Data categories
  earthquakes: '#FF3B3B',
  hazards: '#FFB341',
  outages: '#39D0FF',
  latency: '#19C6A6',

  // Intensity gradients (monochrome)
  intensityScale: [
    '#5E6A81',  // Low
    '#8F9BB0',  // Medium-low
    '#C6CFDA',  // Medium
    '#FFFFFF'   // High
  ],

  // Diverging (for +/-)
  diverging: {
    negative: '#FF3B3B',
    neutral: '#8F9BB0',
    positive: '#19C6A6'
  }
}
```

### Typography Standards

```typescript
export const tufteTypography = {
  fontFamily: 'Geist Mono, monospace',

  // Chart elements
  label: {
    fontSize: 10,
    fontWeight: 400,
    color: '#8F9BB0',
    letterSpacing: 0
  },

  value: {
    fontSize: 12,
    fontWeight: 600,
    color: '#C6CFDA',
    letterSpacing: '-0.01em'
  },

  title: {
    fontSize: 13,
    fontWeight: 300,
    color: '#FFFFFF',
    letterSpacing: '-0.025em'
  },

  annotation: {
    fontSize: 9,
    fontWeight: 400,
    color: '#5E6A81',
    letterSpacing: 0
  }
}
```

### Chart Margins (Minimal)

```typescript
export const tufteMargins = {
  sparkline: { top: 2, right: 0, bottom: 2, left: 0 },
  small: { top: 20, right: 20, bottom: 30, left: 35 },
  medium: { top: 30, right: 30, bottom: 40, left: 50 },
  large: { top: 40, right: 40, bottom: 50, left: 60 }
}
```

### Chart Dimensions

```typescript
// Responsive breakpoints
const breakpoints = {
  mobile: '320-768px',  // Full width
  tablet: '768-1024px', // 50% width, 2 columns
  desktop: '1024px+'    // 33% width, 3 columns
}

// Small multiples
const smallMultiples = {
  min: { width: 200, height: 150 },
  ideal: { width: 280, height: 210 }, // 4:3 ratio
  max: { width: 400, height: 300 }
}
```

### Panel States Visual Language

```typescript
export const panelTheme = {
  collapsed: {
    height: '300px',
    headerIcon: '▲',
    headerText: 'Analytics',
    gridColumns: { mobile: 1, tablet: 2, desktop: 4 }
  },
  half: {
    height: '50vh',
    headerIcon: '▲▲',
    headerText: 'Analytics Dashboard',
    gridColumns: { mobile: 1, tablet: 2, desktop: 3, wide: 4 }
  },
  full: {
    height: '85vh',
    headerIcon: '▼▼',
    headerText: 'Analytics Dashboard - Full View',
    gridColumns: { mobile: 2, tablet: 3, desktop: 4, wide: 5 }
  }
}
```

### Filter Component Styling

```typescript
export const filterStyles = {
  sidebar: {
    width: '280px',
    backgroundColor: '#0A0F16',
    border: '1px solid #242C3A',
    borderRadius: '24px',
    padding: '20px'
  },

  filterGroup: {
    marginBottom: '20px',
    borderBottom: '1px solid #242C3A',
    paddingBottom: '16px'
  },

  filterLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#8F9BB0',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: '8px'
  },

  checkbox: {
    accentColor: '#39D0FF',
    border: '1px solid #242C3A'
  },

  slider: {
    trackColor: '#242C3A',
    thumbColor: '#39D0FF',
    fillColor: '#39D0FF'
  }
}
```

---

## Implementation Phases

### Phase 0: Setup (Week 1)
**Goal:** Install dependencies and create directory structure

**Tasks:**
- [ ] Install dependencies: `npm install three recharts d3-hexbin d3-contour topojson-client`
- [ ] Install dev dependencies: `npm install --save-dev @types/three @types/d3-hexbin`
- [ ] Create directory structure:
  ```
  /lib/charts/
    /01-10-spatial/
    /11-20-temporal/
    /21-30-correlation/
    /31-40-infrastructure/
    /41-48-experimental/
    /core/
    types.ts
  /components/dashboard/
  /components/filters/
  /components/transitions/
  /contexts/
    DashboardContext.tsx
    FilterContext.tsx
  /hooks/
    useDashboard.ts
    useFilters.ts
    useChartModal.ts
  ```
- [ ] Create Tufte design tokens (`/lib/charts/core/tufte-theme.ts`)

**Deliverable:** Project structure ready for development

---

### Phase 0.5: Dashboard Infrastructure (Week 1)
**Goal:** Build interactive layer before charts

**Tasks:**
- [ ] Create DashboardContext for state management
- [ ] Build ChartPanel with 3 states (collapsed/half/full)
- [ ] Implement smooth panel expansion animation
- [ ] Create ChartCard wrapper component with click handler
- [ ] Build basic ChartModal component
- [ ] Add FilterContext for centralized filtering

**Deliverable:** Interactive panel shell ready for charts

---

### Phase 1: Earthquakes + Dashboard Integration (Week 2)
**Goal:** Complete earthquake primary trio with full interactivity

**Tasks:**
- [ ] 04. Heatmap (MapLibre heatmap layer)
- [ ] 21. Scatterplot (D3 depth vs magnitude)
- [ ] Wrap all 3 charts in ChartCard components
- [ ] Connect to FilterContext
- [ ] Test modal view for each chart
- [ ] Implement TimeRangeFilter component

**Charts:** 01 ✅, 02 ✅, 04 ✅, 15 ✅, 21 ✅
**Deliverable:** 5 interactive earthquake charts in expandable panel

---

### Phase 2: Filters + Latency Dashboard (Week 3)
**Goal:** Add full filtering system and latency monitoring

**Tasks:**
- [ ] Build TimeRangeFilter component
- [ ] Build DataTypeFilter component
- [ ] Build SeverityFilter component
- [ ] Create ChartSelector sidebar
- [ ] Implement filter persistence
- [ ] 11. Sparklines (latency per node)
- [ ] 12. Horizon graph (multi-node comparison)
- [ ] 43. Pulse grid (live dashboard)

**Charts:** 11 ✅, 12 ✅, 43 ✅
**Deliverable:** Full filter system + 8 total charts

---

### Phase 3: Hazard Analysis (Week 4)
**Goal:** Static hazards need clear severity communication

**Tasks:**
- [ ] 09. Choropleth (MapLibre fill layer)
- [ ] 27. Treemap (D3 treemap layout)
- [ ] 30. Streamgraph (D3 stack + area)
- [ ] Integrate with filter system
- [ ] Add to ChartSelector

**Charts:** 09 ✅, 27 ✅, 30 ✅
**Deliverable:** Hazard analysis panel, 11 total charts

---

### Phase 4: Network Infrastructure (Week 5)
**Goal:** Visualize outage topology

**Tasks:**
- [ ] 03. Cluster map (MapLibre cluster source)
- [ ] 33. Force-directed graph (D3 force simulation)
- [ ] 31. Network topology map (D3 overlay)
- [ ] Integrate with filter system

**Charts:** 03 ✅, 31 ✅, 33 ✅
**Deliverable:** Network status dashboard, 14 total charts

---

### Phase 5: Advanced Spatial (Week 6-7)
**Goal:** Sophisticated spatial analysis

**Tasks:**
- [ ] 05. Hexbin density map (D3 hexbin)
- [ ] 08. Contour map (D3 contour)
- [ ] 44. 3D extrusion (three.js)
- [ ] 36. Outage ring map (MapLibre circles)

**Charts:** 05 ✅, 08 ✅, 36 ✅, 44 ✅
**Deliverable:** Advanced spatial visualization suite, 18 total charts

---

### Phase 6: Temporal Animations (Week 8)
**Goal:** Time-based storytelling

**Tasks:**
- [ ] 13. Time slider (MapLibre filter + UI)
- [ ] 14. Animated timeline (requestAnimationFrame)
- [ ] 18. Rolling bar race (D3 transitions)

**Charts:** 13 ✅, 14 ✅, 18 ✅
**Deliverable:** Temporal animation tools, 21 total charts

---

### Phase 7: Multi-Source Fusion (Week 9)
**Goal:** Cross-dataset insights

**Tasks:**
- [ ] 45. Globe arcs (three.js globe)
- [ ] 41. Layered stack (MapLibre blend modes)
- [ ] 22. Bivariate choropleth (D3 custom scale)
- [ ] 23. Parallel coordinates (D3 parallel layout)

**Charts:** 22 ✅, 23 ✅, 41 ✅, 45 ✅
**Deliverable:** Fusion visualization suite, 25 total charts

---

### Phase 8: Complete Remaining Charts (Week 10-12)
**Goal:** Fill in the remaining 23 charts based on user feedback

**Charts to complete:** 06, 07, 10, 16, 17, 19, 20, 24, 25, 26, 28, 29, 32, 34, 35, 37, 38, 39, 40, 42, 46, 47, 48

**Deliverable:** Complete 48-chart library

---

## Component Structure

### Directory Organization

```
/lib/
  /charts/
    /core/
      tufte-theme.ts          # Design system tokens
      scales.ts               # D3 scales with Tufte conventions
      axes.ts                 # Minimal axis components
      colors.ts               # Color palette utilities
      typography.ts           # Font specifications
      tufte-utils.ts          # Data-ink optimization helpers

    /01-10-spatial/
      01-point-map.tsx
      02-graduated-symbol.tsx
      03-cluster-map.tsx
      04-heatmap.tsx
      05-hexbin.tsx
      06-kernel-density.tsx
      07-voronoi.tsx
      08-contour.tsx
      09-choropleth.tsx
      10-bubble-overlay.tsx

    /11-20-temporal/
      11-sparklines.tsx
      12-horizon-graph.tsx
      13-time-slider.tsx
      14-animated-timeline.tsx
      15-ripple-effect.tsx
      16-pulse-map.tsx
      17-event-heat-timeline.tsx
      18-rolling-bar-race.tsx
      19-temporal-chord.tsx
      20-radial-time-wheel.tsx

    /21-30-correlation/
      21-scatterplot.tsx
      22-bivariate-choropleth.tsx
      23-parallel-coordinates.tsx
      24-violin-plot.tsx
      25-ridgeline-plot.tsx
      26-matrix-heatmap.tsx
      27-treemap.tsx
      28-small-multiples.tsx
      29-connected-scatter.tsx
      30-streamgraph.tsx

    /31-40-infrastructure/
      31-network-topology.tsx
      32-sankey.tsx
      33-force-directed.tsx
      34-radial-link.tsx
      35-path-latency.tsx
      36-outage-ring.tsx
      37-dependency-tree.tsx
      38-grid-overlay.tsx
      39-flow-map.tsx
      40-edge-bundling.tsx

    /41-48-experimental/
      41-layered-stack.tsx
      42-magnitude-impact.tsx
      43-pulse-grid.tsx
      44-3d-extrusion.tsx
      45-globe-arcs.tsx
      46-ternary-plot.tsx
      47-bubble-timeline.tsx
      48-isoline-mesh.tsx

    types.ts                  # Chart prop interfaces
    registry.ts               # Chart metadata registry

/components/
  /dashboard/
    index.ts                  # Barrel export
    ChartPanel.tsx            # Main expandable container
    ChartGrid.tsx             # Responsive grid layout
    ChartCard.tsx             # Individual chart wrapper
    ChartModal.tsx            # Detail view modal
    PanelHeader.tsx           # Header with expand controls
    ChartSelector.tsx         # Chart picker sidebar
    ExportMenu.tsx            # Export dropdown component

  /filters/
    index.ts
    FilterSidebar.tsx         # Main filter container
    TimeRangeFilter.tsx
    DataTypeFilter.tsx
    SeverityFilter.tsx
    RegionFilter.tsx
    MetricFilter.tsx
    FilterPresets.tsx         # Saved filter combinations

  /transitions/
    AnimatedPanel.tsx         # Reusable expansion animation
    FadeTransition.tsx        # Modal fade wrapper
    SlideTransition.tsx       # Sidebar slide in/out

/contexts/
  DashboardContext.tsx        # Panel state, selected charts
  FilterContext.tsx           # Global filter state

/hooks/
  useDashboard.ts             # Dashboard state hook
  useFilters.ts               # Filter state hook
  useChartModal.ts            # Modal open/close logic
  useKeyboardShortcuts.ts     # Keyboard navigation
  useChartSelection.ts        # Chart picker logic
  useChartDimensions.ts       # Responsive sizing
  useChartData.ts             # Filtered data hook
  useChartInteraction.ts      # Hover/click handlers
```

---

## State Management

### Dashboard Context

```typescript
// /contexts/DashboardContext.tsx
interface DashboardState {
  panelState: 'collapsed' | 'half' | 'full'
  selectedCharts: string[] // Chart IDs to display
  chartLayout: 'grid' | 'list' | 'masonry'
  modalChart: string | null
  sidebarOpen: boolean
}

interface DashboardContextType {
  state: DashboardState
  expandPanel: (target: 'half' | 'full') => void
  collapsePanel: () => void
  toggleChart: (chartId: string) => void
  openModal: (chartId: string) => void
  closeModal: () => void
  toggleSidebar: () => void
}
```

### Filter Context

```typescript
// /contexts/FilterContext.tsx
interface FilterState {
  dataTypes: Set<'earthquakes' | 'hazards' | 'outages' | 'latency'>
  timeRange: {
    start: number
    end: number
    preset: '1h' | '6h' | '24h' | '7d' | 'custom'
  }
  magnitude: {
    min: number
    max: number
  }
  severity: Set<'Low' | 'Medium' | 'High'>
  regions: Set<string>
  metrics: {
    latency?: { min: number, max: number }
    affected?: { min: number, max: number }
  }
  chartTypes: Set<string> // '01', '02', '04', etc.
}

interface FilterContextType {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => void
  resetFilters: () => void
  applyFilters: (data: any[]) => any[]
}
```

### Chart Registry

```typescript
// /lib/charts/registry.ts
interface ChartMetadata {
  id: string
  number: string // '01', '02', etc.
  name: string
  description: string
  category: 'spatial' | 'temporal' | 'correlation' | 'infrastructure' | 'fusion'
  dataSources: Array<'earthquakes' | 'hazards' | 'outages' | 'latency'>
  priority: 'high' | 'medium' | 'low'
  phase: number
  implemented: boolean
  component: React.ComponentType<any>
}

export const chartRegistry: ChartMetadata[] = [
  {
    id: 'point-map',
    number: '01',
    name: 'Point Map',
    description: 'Individual event locations',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    component: PointMap
  },
  // ... all 48 charts
]
```

---

## Accessibility & Keyboard Shortcuts

### Keyboard Navigation

```
Esc         Close modal / collapse panel
Space       Expand panel to next state
Cmd/Ctrl+F  Focus filter search
Cmd/Ctrl+E  Export current view
←/→         Navigate between charts in modal
1-9         Quick-select chart categories
Tab         Navigate through interactive elements
Enter       Activate focused element
```

### Accessibility Requirements

- [x] ARIA labels on all interactive elements
- [x] Focus trap in modal
- [x] Keyboard navigation through chart grid
- [x] Screen reader announcements for filter changes
- [x] High contrast mode support
- [x] Reduced motion preference respect
- [x] SVG accessibility (titles, descriptions)
- [x] Color-blind friendly palettes (monochrome + accents)

### Screen Reader Support

```typescript
// Example ARIA labels
<button
  aria-label="Expand analytics panel to half screen"
  aria-expanded={panelState !== 'collapsed'}
  onClick={() => expandPanel('half')}
>
  {panelState === 'collapsed' ? '▲' : '▼'}
</button>

<div
  role="region"
  aria-label="Earthquake heatmap visualization"
  aria-describedby="chart-04-description"
>
  <Heatmap data={filteredEarthquakes} />
</div>

<span id="chart-04-description" className="sr-only">
  Heatmap showing earthquake density over the last 24 hours.
  45 earthquakes detected with magnitudes ranging from 4.5 to 7.2.
</span>
```

---

## Implementation Priority Matrix

| Chart # | Name | Earthquakes | Hazards | Outages | Latency | Priority | Phase |
|---------|------|:-----------:|:-------:|:-------:|:-------:|----------|-------|
| 01 | Point map | ✅ Primary | - | - | - | HIGH | ✅ Done |
| 02 | Graduated symbol | ✅ Primary | - | - | - | HIGH | ✅ Done |
| 03 | Cluster map | Secondary | - | ✅ Primary | - | HIGH | 4 |
| 04 | Heatmap | ✅ Primary | - | - | - | HIGH | 1 |
| 05 | Hexbin density | Secondary | - | - | - | MEDIUM | 5 |
| 06 | Kernel density | Secondary | - | - | - | MEDIUM | 8 |
| 07 | Voronoi | - | Secondary | - | - | LOW | 8 |
| 08 | Contour map | Secondary | - | - | - | MEDIUM | 5 |
| 09 | Choropleth | - | ✅ Primary | - | - | HIGH | 3 |
| 10 | Bubble overlay | - | Secondary | Secondary | Secondary | MEDIUM | 8 |
| 11 | Sparklines | - | Secondary | - | ✅ Primary | HIGH | 2 |
| 12 | Horizon graph | - | Secondary | - | ✅ Primary | HIGH | 2 |
| 13 | Time slider | ✅ Secondary | - | - | - | MEDIUM | 6 |
| 14 | Animated timeline | Secondary | - | - | - | MEDIUM | 6 |
| 15 | Ripple effect | ✅ Primary | - | - | - | HIGH | ✅ Done |
| 16 | Pulse map | - | - | Secondary | - | MEDIUM | 8 |
| 17 | Event heat timeline | Secondary | - | Secondary | - | MEDIUM | 8 |
| 18 | Rolling bar race | - | - | ✅ Primary | - | HIGH | 6 |
| 19 | Temporal chord | - | - | - | - | LOW | 8 |
| 20 | Radial time wheel | Secondary | - | - | - | LOW | 8 |
| 21 | Scatterplot | ✅ Primary | - | - | Secondary | HIGH | 1 |
| 22 | Bivariate choropleth | - | - | ✅ Fusion | ✅ Fusion | HIGH | 7 |
| 23 | Parallel coordinates | - | - | - | ✅ Primary | HIGH | 7 |
| 24 | Violin plot | Secondary | - | - | - | MEDIUM | 8 |
| 25 | Ridgeline plot | Secondary | - | - | - | MEDIUM | 8 |
| 26 | Matrix heatmap | - | Secondary | - | - | MEDIUM | 8 |
| 27 | Treemap | - | ✅ Primary | - | - | HIGH | 3 |
| 28 | Small multiples | Secondary | - | - | - | MEDIUM | 8 |
| 29 | Connected scatter | - | - | - | Secondary | LOW | 8 |
| 30 | Streamgraph | - | ✅ Primary | - | Secondary | HIGH | 3 |
| 31 | Network topology | - | - | ✅ Secondary | - | HIGH | 4 |
| 32 | Sankey | - | - | - | - | LOW | 8 |
| 33 | Force-directed | - | - | ✅ Primary | - | HIGH | 4 |
| 34 | Radial link | - | - | - | - | LOW | 8 |
| 35 | Path latency | - | - | - | - | LOW | 8 |
| 36 | Outage ring | - | - | ✅ Secondary | - | MEDIUM | 5 |
| 37 | Dependency tree | - | - | Secondary | - | LOW | 8 |
| 38 | Grid overlay | - | - | - | - | LOW | 8 |
| 39 | Flow map | - | - | Secondary | Secondary | MEDIUM | 8 |
| 40 | Edge bundling | - | - | - | - | LOW | 8 |
| 41 | Layered stack | ✅ Fusion | ✅ Fusion | - | - | HIGH | 7 |
| 42 | Magnitude-impact | ✅ Fusion | ✅ Fusion | - | - | MEDIUM | 8 |
| 43 | Pulse grid | - | - | - | ✅ Secondary | HIGH | 2 |
| 44 | 3D extrusion | ✅ Secondary | - | - | - | MEDIUM | 5 |
| 45 | Globe arcs | ✅ Fusion | - | - | ✅ Primary | HIGH | 7 |
| 46 | Ternary plot | - | Secondary | - | - | LOW | 8 |
| 47 | Bubble timeline | ✅ Fusion | - | - | - | MEDIUM | 8 |
| 48 | Isoline mesh | - | - | - | Secondary | LOW | 8 |

---

## Summary: Deliverables by Phase

**Week 1 (Phase 0 + 0.5):** Project setup + Interactive dashboard shell
**Week 2 (Phase 1):** Earthquakes complete (5 charts with full interactivity)
**Week 3 (Phase 2):** Latency dashboard + Full filter system (8 total charts)
**Week 4 (Phase 3):** Hazards analysis panel (11 total charts)
**Week 5 (Phase 4):** Network infrastructure views (14 total charts)
**Week 6-7 (Phase 5):** Advanced spatial suite (18 total charts)
**Week 8 (Phase 6):** Temporal animations (21 total charts)
**Week 9 (Phase 7):** Multi-source fusion views (25 total charts)
**Week 10-12 (Phase 8):** Complete remaining 23 charts (48 total charts)

---

## Notes & Best Practices

### Development Guidelines

1. **Always start with data-ink ratio** - Remove everything that doesn't convey data
2. **Test with real data first** - Ensure charts work with actual API responses
3. **Mobile-first responsive design** - All charts must work on mobile
4. **Performance budgets** - Each chart should render in <100ms
5. **Accessibility from day one** - ARIA labels, keyboard nav, screen readers
6. **Export functionality** - All charts should be exportable as SVG/PNG/CSV
7. **Progressive enhancement** - Basic charts work without JS, enhanced with interactions

### Code Style

- Use TypeScript strict mode
- Prefer functional components with hooks
- Extract reusable logic to custom hooks
- Use D3 for calculations, React for rendering
- Inline styles for consistency with existing codebase
- Minimal external dependencies

### Testing Strategy

1. **Unit tests** - Test data transformations and scales
2. **Visual regression tests** - Screenshot comparison
3. **Accessibility tests** - Automated ARIA/keyboard testing
4. **Performance tests** - Render time benchmarks
5. **Cross-browser tests** - Chrome, Firefox, Safari, Edge

### Documentation

Each chart should include:
- Purpose and use case
- Data requirements
- Configuration options
- Accessibility features
- Export formats
- Example usage
- Performance notes

---

## Resources & References

### Edward Tufte Books
- *The Visual Display of Quantitative Information* (1983)
- *Envisioning Information* (1990)
- *Visual Explanations* (1997)
- *Beautiful Evidence* (2006)

### Technical Documentation
- [D3.js API Reference](https://d3js.org/)
- [MapLibre GL JS Documentation](https://maplibre.org/)
- [Three.js Documentation](https://threejs.org/)
- [Recharts Documentation](https://recharts.org/)

### Inspiration
- [Observable D3 Gallery](https://observablehq.com/@d3/gallery)
- [Mike Bostock's Blocks](https://bl.ocks.org/mbostock)
- [FlowingData](https://flowingdata.com/)
- [Information is Beautiful](https://informationisbeautiful.net/)

---

**End of Document**
