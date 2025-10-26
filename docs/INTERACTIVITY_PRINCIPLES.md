# Dataflow Atlas — Interactivity & Nate Silver's Design Principles

**Version:** 1.0
**Last Updated:** 2025-10-26
**Purpose:** Define interaction philosophy and implementation strategy for Dataflow Atlas charts

---

## 1. Nate Silver's Six Design Principles

From "The Best American Infographics 2014" introduction:

### 1.1 Readable Complexity
**Principle:** "The most essential elements of the graphic jump out immediately, but the infographic rewards a closer read."

**Application:**
- **Macro View (3 seconds):** Immediate insight visible without interaction (e.g., Choropleth shows top 3 hotspots)
- **Meso View (30 seconds):** Hover reveals contextual detail without leaving view
- **Micro View (3 minutes):** Modal drill-down enables temporal/spatial exploration

**Anti-pattern:** All detail visible at once; user overwhelmed before understanding core insight.

---

### 1.2 Signal vs. Noise
**Principle:** "More isn't always better. An infographic can include a ton of material and yet be readable, but ... a superfluous axis ... can distract."

**Application:**
- **Default State:** Minimal controls. Show only 1-2 data layers.
- **Layer Limits:** Max 3 simultaneous active layers in modal (Environmental, Infrastructure, Connectivity).
- **Auto-adjust Opacity:** As layers increase, reduce opacity of each to maintain legibility.
- **Control Audit:** Track usage; remove unused toggles/filters.

**Anti-pattern:** Exposing every possible control upfront. Infinite filter combinations.

---

### 1.3 Trustworthy Clarity
**Principle:** "Well-executed examples ... show the viewer something rather than telling her something. They cite their sources and optimize time-to-comprehension."

**Application:**
- **Persistent Trust Signals:** Every state (static, hover, modal) shows data source, timestamp, confidence.
- **ChartAttribution Component:** Displays source (USGS, NIFC, AirNow), time since update, confidence level.
- **Tooltip Metadata:** Hover shows exact value + provenance.
- **Uncertainty Encoding:** Use opacity/dashes for low-confidence data.

**Anti-pattern:** Hiding sources in footnotes. Making users hunt for "last updated" timestamp.

---

### 1.4 Design Ethics
**Principle:** "Does the infographic tell the truth? Does it withhold data to make its point? Does it exaggerate?"

**Application:**
- **Honest Scales:** Y-axis always starts at zero for quantities; clearly labeled if truncated.
- **No Cherry-picking:** Show all data in time range, not just dramatic peaks.
- **Uncertainty Visible:** If confidence is "Low" or "Preliminary," visually encode (ChartAttribution shows color-coded confidence).
- **Audit Trail:** Log user interactions to identify if certain views mislead users.

**Anti-pattern:** Zooming Y-axis to exaggerate trends. Hiding uncertainty. Animating for dramatic effect without informational value.

---

### 1.5 Medium Necessity
**Principle:** "Would text alone suffice? ... The story being told must require the medium."

**Application:**
- **Interaction Justification Test:** Only add interactivity if it reveals insight unavailable in static form.
  - **Example (YES):** Sparkline modal with timeline scrubber → reveals acceleration/deceleration patterns.
  - **Example (NO):** Box plot modal showing... the same box plot larger → adds no insight.
- **Chart Type Selection:** Only visualize what needs visualization. Don't chart data that's clearer in a table.

**Anti-pattern:** "Chartjunk" interactions (e.g., 3D rotation that obscures data). Adding tooltips just because it's possible.

---

### 1.6 Hierarchy of Perception
**Principle:** "The graphic must guide the reader through the data, establishing a hierarchy that shows the most important elements first."

**Application:**
- **Visual Hierarchy:** Default view highlights critical data (e.g., Choropleth mutes 70% of regions to 30% opacity, focuses on top 3).
- **Interaction Hierarchy:** Macro → Meso → Micro progression. Each tier adds one dimension without losing context.
- **Attention Guidance:** Use color, size, opacity to guide eye to signal. Trend arrows (↗↘→) in Sparkline direct attention to change.

**Anti-pattern:** Flat visual hierarchy. All elements same size/color. User doesn't know where to look first.

---

## 2. Interaction Philosophy

### 2.1 Core Principles

| Principle | Implementation Rule |
|-----------|---------------------|
| **Story Over Novelty** | Every control must reveal an insight (time progression, spatial relation, cause → effect). No ornamental motion. |
| **Progressive Disclosure** | Default = clean snapshot. Interaction unlocks detail only when requested. |
| **Bounded Complexity** | Max 3 simultaneous active layers per view. |
| **Persistence of Trust** | Every state shows data source, timestamp, and confidence. |
| **Reversibility** | Always include one-click Reset View / Undo. |
| **Touch Parity** | Every hover interaction has equivalent tap behavior. |

### 2.2 When to Add Interaction

**Add interaction if it enables:**
1. **Temporal Exploration:** Scrubbing through time reveals evolution, acceleration, or inflection points.
2. **Spatial Drill-down:** Zooming into region reveals clustering or local patterns.
3. **Relational Discovery:** Filtering/toggling layers reveals correlations.
4. **Threshold Tuning:** Slider enables "what-if" scenarios (e.g., "What % of earthquakes are >M5?").

**Skip interaction if:**
1. Static view already tells the complete story.
2. Interaction adds complexity without insight.
3. Text or table would be clearer.

---

## 3. Three-Tier Interaction Hierarchy

### Tier 1: Macro View (3-Second Glance)
**Goal:** Answer "What's happening now?"

**Implementation:**
- **Static chart** with clean visual hierarchy
- **Trust signals visible:** ChartAttribution component shows source, timestamp, confidence
- **Key insight immediate:** Top-level metric or hotspot highlighted

**Example (Choropleth):**
- Top 3 regions at 100% opacity, rest at 30%
- No interaction required to see critical zones

**User Action:** Passive viewing

---

### Tier 2: Meso View (30-Second Scan)
**Goal:** Answer "Where and why?"

**Implementation:**
- **Hover/tap reveals contextual tooltip**
- Tooltip shows: exact value, source, timestamp, metadata
- **Other elements fade** to maintain focus
- **No navigation away from chart**

**Example (Sparkline):**
- Hover on data point → tooltip shows "M4.2 | USGS | 3h ago | High confidence"
- Hover on trend arrow → "↗ +15% vs 3-point avg"

**User Action:** Hover/tap for detail

**Technical Specs:**
- Tooltip appears in <100ms
- Auto-hides after 2s of no cursor movement
- Never obscures cursor
- Touch: tap to reveal, tap outside to dismiss

---

### Tier 3: Micro View (3-Minute Deep-Dive)
**Goal:** Answer "How is it evolving?"

**Implementation:**
- **Click opens full-screen modal** with expanded chart
- **Timeline scrubber** with play/pause animation
- **Layer toggles** (max 3 active)
- **Export options** (screenshot, CSV)
- **Trust signals persist** (ChartAttribution visible in modal)

**Example (Dual Timeline):**
- Click → modal opens
- Scrubber reveals lead/lag relationships between event types
- Toggle overlay mode to compare on same axis

**User Action:** Click to drill down

**Technical Specs:**
- Modal opens in <300ms
- Timeline playback: 24-60fps
- Keyboard accessible (ESC to close, Tab to navigate)
- Focus trapped in modal

---

## 4. Interaction Types

### A. Hover / Tap Reveal (Meso)

**Purpose:** Expose detail without leaving context.

**Behavior:**
- Hover on data element → tooltip appears
- Tooltip shows: value, source, timestamp, confidence
- Other elements fade to 20% opacity for focus
- Auto-hide after 2s of no movement

**Visual Cue:**
- Soft glow or pulse on hovered element
- Crosshair lines (for CDF, Bubble Chart)

**Accessibility:**
- Touch: tap to reveal, tap outside to dismiss
- Keyboard: focus + Enter shows tooltip
- ARIA: `role="tooltip"`, `aria-describedby`

---

### B. Drill-Down Modal (Micro)

**Trigger:** Click or tap on chart element.

**Includes:**
1. **Expanded chart** (larger, more detail)
2. **Timeline scrubber** with play/pause controls
3. **Layer toggles** (max 3, checkboxes)
4. **Metrics panel** showing values + uncertainty
5. **ChartAttribution** (source, timestamp, confidence)
6. **Export buttons** (PNG, CSV)
7. **Reset/Close controls** (X button, ESC key)

**Visual Design:**
- Darkened background (rgba(10, 15, 22, 0.92))
- Modal: 90vw × 80vh, max-width 1200px
- Border: 1px solid #39D0FF
- Focus light on modal content

**Accessibility:**
- `role="dialog"`, `aria-modal="true"`
- Focus trap (Tab cycles within modal)
- ESC key closes modal
- Click outside closes modal

---

### C. Time Scrubbing / Animation (Micro)

**Purpose:** Show evolution, acceleration, inflection points.

**Controls:**
- **Play/Pause button**
- **Scrubber bar** (drag to jump to timestamp)
- **Speed control** (0.5×, 1×, 2×)
- **Time window selector** (6h, 12h, 24h, 7d)

**Behavior:**
- Default: play 3-day window loop
- Timestamp label updates synchronously
- Chart re-renders at 24-60fps

**Visual Feedback:**
- Playhead indicator on scrubber
- Current timestamp displayed
- Animated transition between frames

**Design Constraint:**
- No motion blur trails (can obscure data)
- Respect `prefers-reduced-motion` (disable auto-play)

---

### D. Layer Management (Micro)

**Control Surface:** Bottom or side dock in modal.

**States:**
- Environmental (earthquakes, wildfires, air quality)
- Infrastructure (power grid, roads, ports)
- Connectivity (network links, supply chains)

**Rules:**
- **Max 3 visible layers** simultaneously
- **Auto-adjust opacity:** As layers increase, reduce opacity to preserve legibility
- **Color coding:** Each layer has distinct color
- **Legend visible:** Shows what each layer represents

**Interaction:**
- Checkbox toggles layer on/off
- Disabled checkbox if 3 already active (must disable one first)

---

### E. Tooltip System

**Structure:**
```
[Title]
Value | Source | Timestamp
[Confidence Indicator]
```

**Style:**
- Background: #0A0F16 (dark)
- Border: 1px solid #39D0FF (cyan)
- Font: Geist Mono, 10px
- Color: #C6CFDA (light gray)
- Padding: 8px 12px
- Shadow: 0 4px 12px rgba(0,0,0,0.6)

**Dynamic Placement:**
- Position relative to cursor
- Avoid cursor occlusion (offset by 12px)
- Flip horizontally if near right edge
- Flip vertically if near bottom edge

---

## 5. Chart-by-Chart Interaction Design

### 5.1 Sparkline (01) — Time Trends

**Primary Insight:** "Is this metric getting worse?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Trend arrows show direction (↗↘→) |
| **Meso** | Hover on sparkline | Exact value + timestamp at point |
| **Meso** | Hover on trend arrow | Explanation ("↗ +15% vs 3-point avg") |
| **Micro** | Click → modal | Timeline scrubber, adjustable window (6h-7d), inflection point markers |

**Justification:** Timeline exploration reveals acceleration/deceleration patterns not visible in static view.

**Priority:** HIGH

---

### 5.2 Choropleth (02) — Geographic Intensity

**Primary Insight:** "Where are the worst hotspots?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Top 3 regions highlighted, rest muted to 30% |
| **Meso** | Hover on region | Intensity value, event count, lat/lon range |
| **Micro** | Click region → modal | Individual events in cell, time distribution, comparison to adjacent regions |

**Justification:** Reveals spatial clustering and temporal patterns within hotspot.

**Priority:** HIGH

---

### 5.3 Bubble Chart (22) — Relationships

**Primary Insight:** "Does depth correlate with magnitude?" (earthquakes)

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Scatter plot with sized bubbles |
| **Meso** | Hover on bubble | Exact x/y values + metadata; other bubbles fade to 20% |
| **Micro** | Click → modal | Brush selection (zoom), toggle outliers, optional regression line |

**Justification:** Zoom reveals clustering patterns not visible at default scale.

**Priority:** MEDIUM

---

### 5.4 Waterfall (43) — Cumulative Breakdown

**Primary Insight:** "How do severity buckets contribute to total?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Stacked bars showing accumulation |
| **Meso** | Hover on bar segment | Count + percentage of total |
| **Micro** | Click bar → modal | List of events in bucket, time distribution |

**Justification:** Reveals whether bucket is dominated by recent or old events.

**Priority:** LOW

---

### 5.5 Dual Timeline (13) — Correlation

**Primary Insight:** "Do two event types correlate over time?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Mirrored timeline (top/bottom) |
| **Meso** | Hover on spike | Timestamp, event type, magnitude; highlight corresponding time on opposite timeline |
| **Micro** | Click → modal | Synchronized scrubber, play animation, toggle overlay mode |

**Justification:** Animation reveals lead/lag relationships and temporal correlation.

**Priority:** HIGH

---

### 5.6 Box Plot (32) — Distribution

**Primary Insight:** "What's the typical value and spread?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Box-and-whisker showing quartiles |
| **Meso** | Hover on box | Q1, median, Q3 values |
| **Meso** | Hover on whisker | Min/max values |
| **Micro** | Click → modal | Beeswarm overlay (actual data points), compare to historical distribution |

**Justification:** Dots reveal multimodal distributions or gaps.

**Priority:** LOW

---

### 5.7 CDF (33) — Probability

**Primary Insight:** "What % of events are below threshold X?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Cumulative curve |
| **Meso** | Hover on curve | Crosshair showing x-value and cumulative %; dynamic threshold line follows cursor |
| **Micro** | Click → modal | Threshold slider, input custom value → see probability, compare to historical CDF |

**Justification:** Slider enables threshold exploration (e.g., "What if we only alert on M5+?").

**Priority:** MEDIUM

---

### 5.8 Step Chart (16) — Event Accumulation

**Primary Insight:** "How fast are events accumulating?"

| Tier | Interaction | Reveals |
|------|-------------|---------|
| **Macro** | None (static) | Step function showing cumulative count |
| **Meso** | Hover on step | Timestamp, cumulative count, rate at moment |
| **Micro** | Click → modal | Time scrubber with animation, toggle rate (derivative) overlay, highlight acceleration periods |

**Justification:** Rate overlay reveals surge periods.

**Priority:** MEDIUM

---

## 6. Performance & Accessibility

### 6.1 Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| Tooltip render time | <100ms (p95) | Chrome DevTools Performance |
| Modal open time | <300ms (p95) | User Timing API |
| Timeline scrubbing | ≥24fps (p95) | requestAnimationFrame tracking |
| Chart re-render (modal) | <200ms (p95) | React Profiler |

**Optimization Strategies:**
- Debounce hover events (50ms)
- Use `requestAnimationFrame` for animations
- Lazy-load modal content (render on open, not on mount)
- Memoize D3 scales and generators

---

### 6.2 Accessibility Checklist

- [ ] **Keyboard Navigation:** Tab, Enter, Esc work for all interactions
- [ ] **ARIA Labels:** Tooltips (`role="tooltip"`), modals (`role="dialog"`)
- [ ] **Focus Management:** Focus trap in modal, restore focus on close
- [ ] **Color Contrast:** ≥4.5:1 for all text (WCAG AA)
- [ ] **Touch Targets:** ≥44×44px for all interactive elements
- [ ] **Screen Reader:** Announces tooltip/modal content
- [ ] **Reduced Motion:** Respect `prefers-reduced-motion` (disable animations)
- [ ] **Keyboard Shortcuts:** Document and support (e.g., Space = play/pause)

**Testing:**
- Lighthouse accessibility audit (target: 100/100)
- axe DevTools scan (0 violations)
- Manual keyboard-only navigation test
- Screen reader test (VoiceOver on macOS, NVDA on Windows)

---

## 7. Instrumentation & Analytics

### 7.1 Events to Track

```typescript
// Tier 2 (Meso) — Hover/Tap
interface TooltipEvent {
  event: 'tooltip_hover'
  chartType: 'sparkline' | 'choropleth' | 'bubble' | ...
  dataType: 'earthquake' | 'wildfire' | 'air_quality'
  duration: number // milliseconds hovered
  timestamp: number
}

// Tier 3 (Micro) — Modal
interface ModalOpenEvent {
  event: 'modal_open'
  chartType: string
  dataType: string
  timestamp: number
}

interface TimeScrubEvent {
  event: 'time_scrub'
  chartType: string
  targetTimestamp: number
  playbackSpeed: number // 0.5x, 1x, 2x
  timestamp: number
}

interface LayerToggleEvent {
  event: 'layer_toggle'
  layerName: 'environmental' | 'infrastructure' | 'connectivity'
  state: 'on' | 'off'
  activeLayerCount: number
  timestamp: number
}

interface ExportEvent {
  event: 'export_click'
  chartType: string
  format: 'png' | 'csv'
  timestamp: number
}

interface ResetEvent {
  event: 'reset_click'
  chartType: string
  timestamp: number
}
```

### 7.2 Analysis Goals

**Questions to Answer:**
1. Which charts get the most tooltip hovers? (indicates user interest)
2. Which charts get the most modal opens? (indicates need for deeper exploration)
3. Which layer toggles are never used? (candidates for removal)
4. Average time spent in modal per chart type? (indicates engagement)
5. Do users prefer scrubbing or animation? (informs default behavior)
6. Export usage by format? (indicates data usage patterns)

**Dashboard Metrics:**
- Tooltip engagement rate (% of views with hover)
- Modal engagement rate (% of views with click)
- Average time in modal
- Layer toggle frequency
- Export rate by chart type

**Optimization:**
- If tooltip hover rate <10%, consider removing tooltip (not useful)
- If modal open rate <5%, reconsider modal necessity
- If layer never toggled in 30 days, remove from UI

---

## 8. Design Ethics & Transparency

### 8.1 Ethical Interaction Design

**Principles:**
1. **Never hide uncertainty:** If data is "Preliminary" or "Low confidence," show in all states (tooltip, modal).
2. **No deceptive defaults:** Time range should default to "all available data" unless there's a compelling reason.
3. **Honest animations:** Never animate purely for dramatic effect. Motion must reveal change.
4. **Accessible to all:** Interactions must work for keyboard-only, screen reader, and low-vision users.
5. **No dark patterns:** Don't make it hard to exit modal or reset view.

### 8.2 Trust Signal Persistence

**In Every Interaction State:**
- **Static view:** ChartAttribution component visible
- **Hover tooltip:** Shows source + timestamp inline
- **Modal:** ChartAttribution component visible + additional metadata panel

**Example:**
```
Tooltip:
M4.2 | USGS | 3h ago | High Confidence

Modal Header:
[Chart Title]
Data Source: USGS Earthquake Hazards Program
Last Updated: 3 hours ago
Confidence: High
Coverage: Global M2.5+
```

---

## 9. Implementation Roadmap

### Phase A: Tooltip System (Foundation)
**Timeline:** 1-2 days
**Scope:** Implement Meso (hover) for all charts

**Deliverables:**
- [ ] `/components/Tooltip.tsx` — reusable component
- [ ] Add `.on('mouseover')` handlers to all chart types
- [ ] Cursor occlusion avoidance logic
- [ ] Touch device support (tap to reveal)
- [ ] Accessibility: ARIA labels, keyboard support

**Success Criteria:**
- Tooltip renders in <100ms
- Works on touch devices
- Never obscures cursor
- Passes accessibility audit

---

### Phase B: Modal System (Deep Dive)
**Timeline:** 3-4 days
**Scope:** Implement Micro (click) for HIGH priority charts

**Deliverables:**
- [ ] `/components/ChartModal.tsx` — modal container
- [ ] `/components/TimelineScrubber.tsx` — scrubber with play/pause
- [ ] `/components/LayerToggle.tsx` — max 3 active layers
- [ ] Sparkline modal (timeline exploration)
- [ ] Choropleth modal (region drill-down)
- [ ] Dual Timeline modal (correlation animation)

**Success Criteria:**
- Modal opens in <300ms
- Timeline scrubbing ≥24fps
- Export functionality works
- Accessibility: focus trap, ESC closes, keyboard navigation

---

### Phase C: Advanced Interactions (Optional)
**Timeline:** 2-3 days
**Scope:** Implement Micro for MEDIUM priority charts

**Deliverables:**
- [ ] Bubble Chart brush selection + zoom
- [ ] CDF threshold slider
- [ ] Step Chart rate overlay

**Success Criteria:**
- Each interaction adds measurable insight
- Performance targets met
- Accessibility maintained

---

### Phase D: Analytics & Optimization
**Timeline:** 1-2 days
**Scope:** Instrumentation and usage tracking

**Deliverables:**
- [ ] Event tracking implementation
- [ ] Analytics dashboard
- [ ] A/B test framework (if needed)
- [ ] Usage report (30-day review)

**Success Criteria:**
- All interaction events captured
- Dashboard shows engagement metrics
- Identify unused features for removal

---

## 10. Open Questions & Decisions

### 10.1 Technical Decisions

| Question | Options | Recommendation |
|----------|---------|----------------|
| **Timeline Playback Speed** | 24fps vs 60fps | 60fps (modern devices handle it; fallback to 24fps if performance issues) |
| **Modal Default Time Window** | Last 24h vs All data | Last 24h (most actionable; user can expand if needed) |
| **Export Formats** | PNG only vs PNG + SVG + CSV | PNG + CSV (PNG for sharing, CSV for analysis) |
| **Mobile Modal Layout** | Full-screen vs Bottom sheet | Full-screen (more space for timeline scrubber) |
| **Layer Toggle Placement** | Bottom dock vs Side panel | Bottom dock (more horizontal space for timeline) |

### 10.2 Design Decisions

| Question | Options | Recommendation |
|----------|---------|----------------|
| **Tooltip Auto-hide Duration** | 1s, 2s, 3s, or never | 2s (balances discoverability and clutter) |
| **Animation Default** | Auto-play vs Manual | Manual (respect user control; auto-play if `prefers-reduced-motion: no-preference`) |
| **Layer Opacity Strategy** | Fixed 50% vs Dynamic (reduces as layers increase) | Dynamic (maintains legibility) |
| **Reset Button Placement** | Top-right (with close X) vs Bottom-left | Top-right (standard pattern) |

---

## 11. Testing Strategy

### 11.1 Unit Tests
- Tooltip component renders with correct content
- Modal opens/closes on click/ESC
- Timeline scrubber updates chart on drag
- Layer toggle respects max-3 rule

### 11.2 Integration Tests
- Click chart → modal opens → scrubber works → export saves file
- Hover chart → tooltip appears → auto-hides after 2s
- Keyboard navigation: Tab → Enter opens modal → ESC closes

### 11.3 Performance Tests
- Lighthouse audit (target: Performance 90+, Accessibility 100)
- Timeline scrubbing frame rate (≥24fps)
- Modal open time (<300ms)

### 11.4 Accessibility Tests
- Keyboard-only navigation (no mouse)
- Screen reader test (VoiceOver, NVDA)
- Color contrast audit (≥4.5:1)
- Touch target size audit (≥44×44px)

### 11.5 User Testing
- Task: "Find the region with the highest earthquake intensity" (should use hover)
- Task: "Identify when the event rate accelerated" (should use modal + scrubber)
- Observe: Do users find interactions or struggle?
- Measure: Time to complete, success rate, satisfaction (1-5)

---

## 12. Success Metrics

### 12.1 Qualitative Goals
- Users can answer "where is it worst?" without leaving chart (hover)
- Users can answer "how is it evolving?" with modal timeline
- No user reports feeling "lost" or "overwhelmed" by controls
- Users understand data provenance at all interaction levels

### 12.2 Quantitative Targets

| Metric | Target |
|--------|--------|
| Tooltip engagement rate | ≥25% of chart views |
| Modal engagement rate | ≥10% of chart views |
| Tooltip render time (p95) | <100ms |
| Modal open time (p95) | <300ms |
| Timeline scrubbing (p95) | ≥24fps |
| Accessibility score (Lighthouse) | 100/100 |
| Export success rate | ≥95% |

---

## 13. References

### 13.1 Nate Silver's Work
- Silver, Nate. "Introduction." *The Best American Infographics 2014*. Mariner Books, 2014.
- The Marginalian: [Analysis of Silver's principles](https://www.themarginalian.org)

### 13.2 Design Resources
- Edward Tufte: "The Visual Display of Quantitative Information"
- Stephen Few: "Information Dashboard Design"
- Mike Bostock: D3.js documentation on interaction patterns

### 13.3 Web Standards
- WCAG 2.1 (Web Content Accessibility Guidelines)
- WAI-ARIA 1.2 (Accessible Rich Internet Applications)
- MDN Web Docs: Keyboard-navigable JavaScript widgets

---

## 14. Appendix: Code Examples

### 14.1 Tooltip Component

```tsx
// /components/Tooltip.tsx
'use client'

import { useEffect, useRef, useState } from 'react'

interface TooltipProps {
  visible: boolean
  x: number
  y: number
  title: string
  value: string
  source: string
  timestamp: string
  confidence: string
}

export function Tooltip({
  visible,
  x,
  y,
  title,
  value,
  source,
  timestamp,
  confidence
}: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  useEffect(() => {
    if (!tooltipRef.current) return

    const rect = tooltipRef.current.getBoundingClientRect()
    let adjustedX = x
    let adjustedY = y

    // Avoid right edge
    if (x + rect.width > window.innerWidth) {
      adjustedX = x - rect.width - 12
    }

    // Avoid bottom edge
    if (y + rect.height > window.innerHeight) {
      adjustedY = y - rect.height - 12
    }

    setPosition({ x: adjustedX, y: adjustedY })
  }, [x, y, visible])

  if (!visible) return null

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: position.x + 12,
        top: position.y + 12,
        padding: '8px 12px',
        backgroundColor: '#0A0F16',
        border: '1px solid #39D0FF',
        fontFamily: 'Geist Mono, monospace',
        fontSize: '10px',
        color: '#C6CFDA',
        pointerEvents: 'none',
        zIndex: 10000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        maxWidth: '280px'
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div style={{ fontWeight: 700, marginBottom: '4px', color: '#FFFFFF' }}>
        {title}
      </div>
      <div style={{ color: '#C6CFDA', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ color: '#8F9BB0', fontSize: '9px' }}>
        {source} • {timestamp} • {confidence}
      </div>
    </div>
  )
}
```

### 14.2 Chart Modal Component

```tsx
// /components/ChartModal.tsx
'use client'

import { useEffect, useRef } from 'react'
import { X } from 'lucide-react'

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
}

export function ChartModal({
  isOpen,
  onClose,
  title,
  children
}: ChartModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
        onClose()
      }
    }

    // Focus trap
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const firstElement = focusableElements?.[0] as HTMLElement
    const lastElement = focusableElements?.[focusableElements.length - 1] as HTMLElement

    const handleTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return

      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault()
        lastElement?.focus()
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('keydown', handleTab)
    document.addEventListener('mousedown', handleClickOutside)

    firstElement?.focus()

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('keydown', handleTab)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(10, 15, 22, 0.92)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        ref={modalRef}
        style={{
          width: '90vw',
          maxWidth: '1200px',
          height: '80vh',
          backgroundColor: '#0A0F16',
          border: '1px solid #39D0FF',
          padding: '32px',
          position: 'relative',
          overflow: 'auto'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#8F9BB0',
            padding: '8px'
          }}
          aria-label="Close modal"
        >
          <X size={24} />
        </button>

        <h2
          id="modal-title"
          style={{
            fontSize: '24px',
            fontWeight: 600,
            color: '#FFFFFF',
            marginBottom: '24px',
            fontFamily: 'Albert Sans, sans-serif'
          }}
        >
          {title}
        </h2>

        {children}
      </div>
    </div>
  )
}
```

---

**End of Document**
