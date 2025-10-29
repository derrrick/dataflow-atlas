# Session Notes - Map Controls Redesign (Oct 28, 2025)

## Current State Summary

### Completed Work

#### 1. LayerControlsV2 Component (`/components/LayerControlsV2.tsx`)
- **Design**: Compact vertical panel (280px width, 24px border radius)
- **Structure**:
  - Header: "Map Controls" with animated LIVE badge
  - LAYERS accordion section (collapsible)
  - TIME section (collapsible) with playback controls
  - Integrated time window selector (1D, 7D, 30D, 90D, 180D, 1Y)
  - Draggable progress bar with teal handle
- **Features**:
  - Category-based layer selection (Natural, Infrastructure, Systemic)
  - Popovers for individual layer toggles
  - Play/pause/skip/NOW playback controls
  - White category icons
  - Teal accent color (#39D0FF)
  - All transitions: 200ms cubic-bezier(0.25, 0.1, 0.25, 1)

#### 2. Google Maps-Style Search (`/app/page.tsx`)
- **Collapsed**: 48px circle with search icon
- **Expanded**: 400px wide input field
- **Animation**: Smooth 250ms width transition, 200ms opacity fade
- **Positioning**: Top-left at 24px, 24px
- **Currently**: Non-functional (no search implementation yet)

#### 3. Main Page Layout (`/app/page.tsx`)
- LayerControlsV2 positioned top-left
- Status chips (RefreshIndicator, StatusChips) positioned top-right
- "Explore the data" button bottom-left
- All components properly wired to TimeContext and LayerContext

#### 4. Data Ingestion (`/app/api/cron/ingest/route.ts`)
- Fixed to support all 6 data sources:
  - Earthquakes
  - Air Quality
  - Wildfires
  - Power Outages
  - Severe Weather
  - Internet Outages
- Runs every 5 minutes via Vercel Cron

### Key Design Decisions
- **Typography**: Albert Sans (prose), Geist Mono (data/technical)
- **Colors**:
  - Background: #0A0F16, #141821
  - Borders: #242C3A
  - Text: #FFFFFF, #C6CFDA, #8F9BB0, #5E6A81
  - Accent: #39D0FF (teal)
  - LIVE: #19C6A6 (green)
- **Spacing**: 8px base unit, mathematical grids
- **Animations**: cubic-bezier(0.25, 0.1, 0.25, 1) for smooth motion

### Completed Tasks (Session 3 - Oct 28, 2025)
1. ✅ Fixed DataFeedStatus z-index (1000 → 10)
   - Component was appearing above modals
   - Now properly positioned in stacking context
   - Changed in `/app/page.tsx:443`
2. ✅ Deployed to Vercel Production
   - URL: https://dataflow-atlas-kp25gvhae-derricks-projects-7b5c3a91.vercel.app
   - Automatic cron jobs disabled (Hobby plan limit: 2 crons max across all projects)
   - Manual data refresh available via: `/api/cron/ingest` endpoint
   - All UI improvements and components successfully deployed
3. ✅ Cleaned up duplicate dev server processes
   - Killed old node processes
   - Started fresh dev server on port 3001

### Notes
- **Vercel Cron Limitation**: Hobby plan allows max 2 cron jobs across all projects
  - Account already has 2 crons configured on other projects
  - To enable automatic data refresh: Remove unused cron jobs OR upgrade to Pro plan
  - Alternative: Set up external cron service (GitHub Actions, cron-job.org) to hit the endpoint

### Completed Tasks (Session 2 - Oct 28, 2025)
1. ✅ Moved search to top-left (24px, 24px)
2. ✅ Search always open (300px width, no expand/collapse)
3. ✅ Replaced map controls with sliders-horizontal icon button
4. ✅ Positioned filter icon to the LEFT of search (12px gap)
5. ✅ Icon expands downward to show LayerControlsV2
6. ✅ Removed click-outside-to-dismiss (only closes via icon click)
   - Allows playback/time scrubber interaction without dismissing
7. ✅ Fixed progress bar overflow in LayerControlsV2
   - Changed from padding to flexbox centering
   - Progress bar now stays within 24px rounded corners
8. ✅ Removed stroke extruding below scrubber
   - Removed `borderBottom: '1px solid #242C3A'` from TIME controls wrapper (LayerControlsV2.tsx:542)
   - Progress bar now flush with container bottom
9. ✅ Active Layer Pills System (Swiss Modernist design)
   - Created `/lib/layerConfig.ts` for shared layer configuration
   - Implemented dismissible pills showing active layers
   - Pills use layer-specific border colors, Geist Mono typography
   - Null state: 48px circular + button when no layers active
   - Click pill to dismiss layer, click + to open controls
   - 32px height pills (8px grid), 100px border radius
   - Proper spacing: 12px gaps between all elements
   - Updated LayerControlsV2 to use shared config
10. ✅ Google Maps-Style Horizontal Scrolling
   - Horizontal scrollable container for pills (overflow handling)
   - Left/Right navigation arrows (32px, 16px border radius)
   - Arrows appear/disappear based on scroll position
   - Smooth scroll behavior (200px increments)
   - Hidden scrollbar (scrollbarWidth: none)
   - Dynamic padding (40px) when arrows visible
   - Flex layout with flexShrink: 0 for pills
   - Overflow detection via scroll event listeners
11. ✅ DataFeedStatus Component (Swiss Modernist table design)
   - Created `/components/DataFeedStatus.tsx` combining RefreshIndicator + StatusChips
   - Repositioned from top-right to bottom-left (24px, 24px)
   - Two states: Collapsed (compact) and Expanded (table view)
   - **Collapsed**: Database icon, feed count (6/6), pulse indicator
   - **Expanded**: 360px table with precise grid layout
   - Grid columns: 8px status dot, source name, event count, age
   - Color-coded status indicators (green/yellow/red circles)
   - Geist Mono typography throughout (8px-11px sizes)
   - Mathematical spacing: 8px, 12px, 16px (all multiples of 8)
   - Bloomberg Terminal-inspired data table aesthetic
   - Header/footer structure with proper hierarchy
   - Removed StatusChips and RefreshIndicator from top-right

### Completed Tasks (Session 1 - Oct 28, 2025)
1. ✅ Centered "Explore the data" button in viewport (left: 50%, transform: translateX(-50%))
2. ✅ Moved map controls to bottom-left (bottom: 108px)
3. ✅ Matched Map Controls background opacity to zoom controls (rgba(10, 15, 22, 0.5))
4. ✅ Applied same opacity to search background (rgba(10, 15, 22, 0.5))
5. ✅ Implemented search functionality:
   - Geocoding via Nominatim (OpenStreetMap)
   - Custom event system ('map:search')
   - Enter key triggers search
   - Map flyTo animation (1500ms duration, zoom 8)
   - Search collapses after successful search
6. ✅ Set default time window to 7D (10080 minutes in TimeContext)

### Important Files
- `/components/LayerControlsV2.tsx` - Main controls component
- `/components/TimeWindowSelector.tsx` - Time window buttons (integrated into LayerControlsV2)
- `/components/DataFeedStatus.tsx` - Data feed status table (bottom-left)
- `/app/page.tsx` - Main page layout, search, active layer pills, and data status
- `/contexts/TimeContext.tsx` - Time state management
- `/contexts/LayerContext.tsx` - Layer visibility state
- `/lib/layerConfig.ts` - Shared layer configuration (categories, labels, colors)
- `/app/api/cron/ingest/route.ts` - Data ingestion cron job

### Known Issues
- Search icon centering required manual offset (left: 1px, top: 1px)
- Progress bar required overflow masking
- Popover positioning required removing overflow: hidden from container

### Design Philosophy
- Swiss Modernist principles
- Nate Silver data visualization approach
- FiveThirtyEight-inspired (data separated from presentation)
- Minimal decoration, maximum utility
