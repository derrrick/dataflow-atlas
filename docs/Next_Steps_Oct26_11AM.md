# Flow Atlas - Next Steps (Oct 26, 11AM)

## Current Status

### ✅ Completed
- **Dynamic Chart Architecture** - Unified data normalization system implemented
- **6 of 22 Layers Active** - earthquakes, wildfire, air-quality, power/internet/cellular-outages, latency
- **23 Charts Implemented** - Full Tufte-inspired visualization suite
- **1 Chart Migrated to Unified Data** - Sparkline (01) serves as proof-of-concept pattern

### ⚠️ Partial Implementation
- **Chart Migration:** Only 1 of 23 implemented charts uses unified data format
- **Layer Coverage:** 16 of 22 layers still need normalization functions
- **Data Sources:** 3 of 22 live data feeds connected (earthquakes, air quality, wildfires)

---

## Prioritized Next Steps

### Option 1: **Migrate Charts to Unified Data** 🎯 **STARTING HERE**

**Goal:** Update remaining 22 implemented charts to use UnifiedDataPoint format

**Impact:** Makes all charts dynamically respond to layer toggles across all 6 active layers

**Effort:** ~5-10 minutes per chart following established Sparkline pattern

**Priority Charts to Migrate:**
1. **Timeline (11)** - Temporal, Phase 1
2. **Scatter (21)** - Correlation, Phase 1
3. **Histogram (31)** - Statistical, Phase 1
4. **Calendar (12)** - Temporal, Phase 1
5. **Slopegraph (14)** - Temporal, Phase 1
6. **Bubble (22)** - Correlation, Phase 1
7. **Correlation (23)** - Correlation, Phase 1
8. **BoxPlot (32)** - Statistical, Phase 1
9. **CDF (33)** - Statistical, Phase 1
10. **BarChart (41)** - Categorical, Phase 2
11. **GroupedBar (42)** - Categorical, Phase 2
12. **Waterfall (43)** - Categorical, Phase 2
13. **Choropleth (02)** - Spatial, Phase 1
14. **Hexbin (03)** - Spatial, Phase 1
15. **ProportionalCircles (07)** - Spatial, Phase 1
16. **IntensityZones (08)** - Spatial, Phase 1
17. **DualTimeline (13)** - Temporal, Phase 1
18. **RangePlot (15)** - Temporal, Phase 1
19. **StepChart (16)** - Temporal, Phase 1
20. **AreaChart (19)** - Temporal, Phase 1

**Migration Pattern (from Sparkline):**
```typescript
// 1. Update props interface
interface ChartProps {
  data?: LegacyType[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]  // Keep for backwards compat
  // ... other legacy props
}

// 2. Add data source selection
const sourceData = unified || data || earthquakes || []

// 3. Add format detection with type guard
const chartData = sourceData.map((item) => {
  const value = 'primaryValue' in item
    ? item.primaryValue / 10  // Scale unified data appropriately
    : (item as LegacyType).legacyField

  return { /* transformed data */ }
})

// 4. Update useEffect dependencies
}, [data, unified, earthquakes, width, height])
```

---

### Option 2: **Add More Data Source Integrations**

**Goal:** Implement normalization functions for remaining 16 layers

**Impact:** Enables richer multi-layer visualizations

**High-Priority Data Sources:**
- **Flood Extent** - NOAA NWS, NASA GPM (hourly-daily)
- **Drought Index** - US Drought Monitor, NASA SMAP (weekly)
- **Severe Weather** - NOAA NWS CAP alerts (hourly)
- **Ocean Temperature** - NOAA Coral Reef Watch (6hr-daily)
- **Volcanic Activity** - Smithsonian GVP, USGS (daily)

**Implementation Per Source:**
1. Create data type interface in `lib/services/dataTypes.ts`
2. Create data service in `lib/services/`
3. Write normalization function in `lib/utils/dataNormalization.ts`
4. Add to `unifyAllData()` with layer ID check
5. Add to DataContext provider
6. Charts automatically receive the new data

---

### Option 3: **Enhance LayerControls UI**

**Goal:** Improve UX for managing 22-layer ecosystem

**Improvements:**
- Visual indicators for live data vs pending layers
- Data freshness timestamps per layer
- Active layer count display
- Category collapse/expand for Natural/Infrastructure/Systemic
- "Select All/None" per category
- Layer search/filter capability
- Tooltips explaining each layer's data source

**Files to Update:**
- `components/LayerControls.tsx`
- `contexts/LayerContext.tsx`

---

## Technical Architecture Recap

### Unified Data Flow
```
User toggles layer → LayerContext updates activeLayers
  ↓
ChartGrid.unifyAllData() processes active layers
  ↓
Each data type normalized to 0-100 scale
  ↓
Charts receive unified[] + legacy props
  ↓
Type guard detects format: 'primaryValue' in item
  ↓
Chart renders dynamically
```

### Files Modified So Far
- ✅ `lib/services/dataTypes.ts` - UnifiedDataPoint interface
- ✅ `lib/utils/dataNormalization.ts` - 6 normalization functions
- ✅ `components/ChartGrid.tsx` - Unified data generation
- ✅ `lib/charts/d3/01-sparkline.tsx` - Proof of concept
- ✅ `contexts/DataContext.tsx` - Added airQuality, wildfires
- ✅ `Tufte_Charts.md` - Full architecture documentation

### Key Metrics
- **22 charts** need migration (23 total - 1 done)
- **16 layers** need normalization functions (22 total - 6 done)
- **19 data sources** need integration (22 total - 3 done)

---

## Decision: Starting with Option 1

**Timeline:** Migrate 5-7 high-priority charts today
**Target:** Timeline, Scatter, Histogram, Calendar, Slopegraph
**Success Metric:** Charts visually respond to layer toggles in real-time
