# Storytelling Filter System - Oct 26, 2025

## Vision

Transform data exploration from a technical task into a **narrative journey**. Instead of asking "Which chart type do I need?", users ask "What story do I want to tell?"

---

## 🎭 Philosophy: Data as Narrative

### The Problem with Technical Filters
Traditional filters (categories, data sources, implementation status) assume users:
- Know what chart types exist
- Understand technical classifications
- Think in terms of data schemas
- Want to explore mechanically

### The Storytelling Approach
Our filters empower users to:
- **Ask narrative questions**: "What's happening right now?" → Breaking Now preset
- **Explore through lenses**: "How have patterns changed?" → Trends focus
- **Compare perspectives**: "Where are events occurring?" → Regional Impacts
- **Tell better stories**: Pre-configured filter combinations for common narratives

---

## ✨ Features

### 1. **Story Presets** (One-Click Narratives)

Pre-configured filter combinations that instantly tell a specific story:

#### **⚡ Breaking Now**
- **Story**: "What's happening right now that matters?"
- **Filters**: Real-time data + Significant events + Overview charts
- **Color**: Red (#FF3B3B)
- **Use Cases**:
  - Emergency response dashboards
  - News briefings
  - Real-time monitoring

#### **📈 Global Trends**
- **Story**: "What patterns are emerging across the world?"
- **Filters**: Week timeframe + Global region + Trend-focused charts
- **Color**: Cyan (#39D0FF)
- **Use Cases**:
  - Research analysis
  - Long-term planning
  - Pattern recognition

#### **🌍 Regional Impacts**
- **Story**: "How are specific areas being affected?"
- **Filters**: 24h timeframe + Regional focus + Spatial charts
- **Color**: Orange (#FFB341)
- **Use Cases**:
  - Local news coverage
  - Regional emergency planning
  - Community impact reports

#### **📊 Comparative Analysis**
- **Story**: "How do different event types compare?"
- **Filters**: Month timeframe + Comparison charts + All data types
- **Color**: Gray (#8F9BB0)
- **Use Cases**:
  - Academic research
  - Statistical analysis
  - Policy recommendations

---

### 2. **Time Period Filters** (When is the story?)

Instead of raw timestamps, users think in narrative time:

| Filter | User Thinking | Technical Translation |
|--------|--------------|----------------------|
| ⚡ **Now** | "What's happening right now?" | Last 15 minutes |
| 📅 **Today** | "What happened today?" | Last 24 hours |
| 📊 **This Week** | "This week's events" | Last 7 days |
| 📈 **This Month** | "Monthly patterns" | Last 30 days |
| 🌐 **All Time** | "Historical context" | All available data |

**Visual Design:**
- Grid layout (2 columns)
- Emoji + label for quick scanning
- Selected state: Cyan border + subtle background
- Hover state: Darkened background

---

### 3. **Event Significance** (What matters?)

Severity-based filtering using human language:

| Level | Description | Color | Primary Value Range |
|-------|------------|-------|---------------------|
| 🔴 **Significant Events** | Major events worth immediate attention | Red (#FF3B3B) | Earthquakes >6.0M, High AQI |
| 🟠 **Moderate Events** | Notable but not critical | Orange (#FFB341) | Earthquakes 4.5-6.0M, Moderate AQI |
| 🔵 **Minor Events** | Background activity | Cyan (#39D0FF) | Earthquakes <4.5M, Low AQI |
| ⚪ **All Events** | No filtering | Gray (#8F9BB0) | Everything |

**Visual Design:**
- Stacked buttons with color-coded left borders
- Colored dot indicator
- Two-line layout: Label + description
- Semantic colors matching data visualization palette

---

### 4. **Narrative Focus** (How to tell the story?)

Guides users to chart types that support their narrative goal:

#### **📋 All Perspectives**
- No filtering
- Show every chart type
- For comprehensive exploration

#### **🎯 Big Picture** (Overview)
- Emphasis on: Summary statistics, totals, high-level patterns
- Charts: Sparklines, small multiples, overview dashboards
- Story: "Give me the headlines"

#### **📈 Patterns Over Time** (Trends)
- Emphasis on: Time series, timelines, rate of change
- Charts: Dual timeline, step chart, time series
- Story: "How has this evolved?"

#### **🌍 Geographic Impact** (Impacts)
- Emphasis on: Maps, spatial distribution, regional analysis
- Charts: Choropleth, bubble maps, regional comparisons
- Story: "Where is this happening?"

#### **⚖️ Side-by-Side** (Comparisons)
- Emphasis on: Correlation, slopegraphs, comparative views
- Charts: Slopegraph, dual timeline, comparison matrices
- Story: "How do these relate?"

---

### 5. **Advanced Filters** (For Power Users)

Collapsible section preserving technical control:
- **Data Sources**: Earthquakes, Wildfires, Air Quality, etc.
- **Chart Categories**: Spatial, Temporal, Correlation, etc.
- **Only visible when expanded** (default: hidden)
- Maintains backwards compatibility with technical users

**Design Pattern:**
- Collapsed by default to reduce cognitive load
- "+" icon indicates expandable
- Darker background to visually separate from narrative filters
- Same checkbox UI as before for familiarity

---

## 🎨 Visual Design System

### **Header**
- Bold title: "Tell Your Story"
- Filter icon (lucide-react)
- Subtitle explaining the narrative approach
- Clear/Reset button showing active filter count

### **Quick Stories Section**
- Large, tappable preset cards
- Icon + color coding for each story
- Two-line text: Bold title + description
- Selected state: Colored border + background tint
- Hover state: Smooth color transition

### **Filter Groups**
- Uppercase section labels (11px, gray)
- Clear visual hierarchy
- Consistent spacing (8px gaps, 12px margins)
- Smooth transitions on all interactive elements

### **Color Palette**
- **Accents**: Match data viz colors (red for earthquakes, orange for wildfires, cyan for air quality)
- **Backgrounds**: Dark navy (#0A0F16) with lighter panels (#141821)
- **Text**: White (#FFFFFF) to muted gray (#5E6A81) gradient

---

## 🔄 User Flows

### **Scenario 1: Journalist Writing Breaking News**
1. Opens chart library with filters
2. Sees "Breaking Now" preset highlighted
3. Clicks it → Instantly filters to:
   - Real-time data (last 15 min)
   - Significant events only
   - Overview/summary charts
4. Chart grid updates to show 3-4 relevant visualizations
5. Clicks Dual Timeline chart → Enhanced modal opens
6. Switches to Data Table view → Finds highest magnitude event
7. Exports chart as PNG for article
8. Downloads CSV for fact-checking

**Time to insight**: <30 seconds

### **Scenario 2: Researcher Analyzing Monthly Trends**
1. Clicks "Global Trends" preset
2. Adjusts time period to "This Month"
3. Changes narrative focus to "Patterns Over Time"
4. Advanced filters → Selects only Earthquakes data source
5. Chart grid shows temporal analysis visualizations
6. Opens Time Series chart → Insights view shows statistics
7. Notes maximum value and time range
8. Navigates to next chart (Step Chart) using → key
9. Compares cumulative patterns
10. Exports both charts for presentation

**Time to insight**: ~2 minutes

### **Scenario 3: Emergency Manager During Wildfire Season**
1. Custom configuration:
   - Time: Today
   - Severity: Significant Events
   - Narrative: Geographic Impact
   - Advanced → Data Sources: Wildfires only
2. Chart grid shows only spatial wildfires visualizations
3. Opens Choropleth → See regional concentration
4. Switches to Data Table → Filters for California
5. Clicks "View Details" on highest intensity fire
6. Detail panel shows: Location, confidence, satellite source
7. Notes coordinates for field team deployment

**Time to insight**: ~1 minute

---

## 🧩 Integration with Existing System

### **ChartGrid Component**
```typescript
<ChartGrid
  showFilters={true}
  storytellingMode={true}  // New prop
/>
```

- **storytellingMode=true** (default): StorytellingFilterSidebar
- **storytellingMode=false**: Classic FilterSidebar
- Backwards compatible with existing implementations

### **Filter Logic**
Story filters internally map to technical filters:

```typescript
// Story Preset: "Breaking Now"
{
  timeRange: 'realtime',      // → Last 15 min filter
  severity: 'significant',    // → Primary value > threshold
  narrative: 'overview',      // → Categories: ['summary', 'overview']
  implemented: true           // → Implementation status filter
}
```

### **Chart Registry Updates** (Future)
Charts can optionally tag themselves with narrative categories:

```typescript
{
  id: 'dual-timeline',
  name: 'Dual Timeline',
  category: 'temporal',
  narrativeTags: ['trends', 'comparisons'],  // NEW
  suggestedStories: ['breaking-now', 'global-trends']  // NEW
}
```

---

## 📊 Success Metrics

### **User Engagement**
- **Preset usage**: % of sessions using story presets vs custom filters
- **Time to first chart**: Median time from page load to chart interaction
- **Filter changes per session**: Lower = better UX (users find what they need faster)

### **Narrative Adoption**
- **Most popular stories**: Which presets are used most often?
- **Time period distribution**: Are users exploring real-time vs historical?
- **Severity filtering**: Do users prefer "all events" or focused views?

### **User Satisfaction**
- **Chart relevance**: Do filtered charts match user intent?
- **Export rate**: % increase when using narrative filters
- **Return users**: Do storytelling filters encourage repeat visits?

---

## 🚀 Future Enhancements

### **Phase 1: Smart Defaults** (Next Week)
- [ ] Remember user's last preset
- [ ] Suggest presets based on current data
- [ ] Time-aware defaults (morning = Today, evening = Now)

### **Phase 2: Dynamic Narratives** (Next Month)
- [ ] AI-generated story suggestions
- [ ] "Similar stories" recommendations
- [ ] Trending narratives based on data activity
- [ ] Saved custom presets per user

### **Phase 3: Guided Exploration** (Next Quarter)
- [ ] "Start Here" tutorial for first-time users
- [ ] Narrative flow wizard (step-by-step story building)
- [ ] Share preset configurations via URL
- [ ] Collaborative filtering for teams

---

## 🎯 Design Principles

### **1. Narrative First, Technical Second**
- Lead with human questions ("What story do I want to tell?")
- Hide technical complexity behind collapsible sections
- Use familiar language (Today, Now, This Week vs timestamps)

### **2. Progressive Disclosure**
- Show most common needs upfront (presets)
- Reveal power user features on demand (advanced filters)
- Don't overwhelm with options

### **3. Visual Hierarchy**
- Story presets are most prominent (large, colorful cards)
- Narrative filters are mid-tier (clearly labeled sections)
- Advanced filters are de-emphasized (collapsed by default)

### **4. Immediate Feedback**
- Filter changes update chart grid instantly
- Active filter count in header
- Clear visual states (selected, hover, disabled)

### **5. Escape Hatches**
- "Clear all" button always visible when filters active
- Can still use technical filters if preferred
- Original FilterSidebar preserved for backwards compatibility

---

## 📝 Documentation & Onboarding

### **In-App Help**
- Tooltip on "Tell Your Story" header explaining approach
- Hover descriptions on each preset card
- Inline help text under narrative focus options

### **User Guide** (To be created)
- "Getting Started with Storytelling Filters"
- "5 Data Stories You Can Tell Right Now"
- Video walkthrough of common workflows

### **Developer Docs**
- Integration guide for new chart types
- How to tag charts with narrative categories
- Custom preset creation API

---

## 🔗 Related Documentation

- **MODAL_IMPROVEMENTS.md**: Drill-down functionality for detailed exploration
- **INTERACTIVITY_PRINCIPLES.md**: Overall design philosophy (Nate Silver's approach)
- **PRODUCTION_READY.md**: Real data integration and deployment status

---

**Status**: ✅ Implemented and integrated into ChartGrid
**Default Mode**: Storytelling (can be toggled to technical mode)
**Last Updated**: Oct 26, 2025 @ 4:24 PM PST
