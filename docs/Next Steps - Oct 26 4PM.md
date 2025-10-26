# Dataflow Atlas — Next Steps (Oct 26, 4PM)

**Last Updated:** October 26, 2025 @ 4:00 PM
**Status:** Phase A (Tooltips) Complete ✅

---

## 🎯 What We've Accomplished Today

### Phase 1: Trust Signals & Chart Refinements ✅ COMPLETE
**Completed:** Earlier today (morning/afternoon)

1. **ChartAttribution Component** (`/components/ChartAttribution.tsx`)
   - Shows data source (USGS, NIFC, AirNow)
   - Time since update with staleness warnings
   - Confidence indicators (High/Medium/Low)
   - Coverage metadata

2. **Chart Refinements (Nate Silver Principles Applied)**
   - **Sparkline:** Added trend arrows (↗↘→) with color coding
   - **Choropleth:** Top 3 region focus, muted rest to 30% opacity
   - **All Charts:** Removed gridlines for noise reduction

3. **Documentation**
   - Created `/docs/INTERACTIVITY_PRINCIPLES.md` (comprehensive guide)

---

### Phase A: Interactive Tooltips (Tier 2 - Meso) ✅ COMPLETE
**Completed:** Just now (4:00 PM)

**Implementation:** All 8 charts now have interactive hover tooltips

| Chart | Tooltip Behavior | Status |
|-------|------------------|--------|
| **01 - Sparkline** | Hover on any sparkline → shows exact value at point | ✅ |
| **02 - Choropleth** | Hover on region → shows intensity + location + event count | ✅ |
| **22 - Bubble** | Hover on bubble → focus effect (fade others to 20%) + exact x/y values | ✅ |
| **43 - Waterfall** | Hover on bar → shows count + percentage of total | ✅ |
| **13 - Dual Timeline** | Hover on event line/circle → shows magnitude + timestamp | ✅ |
| **32 - BoxPlot** | Hover on box/median → shows quartile values + IQR | ✅ |
| **33 - CDF** | Interactive crosshair → shows value → cumulative % | ✅ |
| **16 - Step Chart** | Hover anywhere → shows cumulative count + timestamp + rate | ✅ |

**Key Features Delivered:**
- ✅ Reusable Tooltip component with ARIA accessibility
- ✅ Auto-hide after 2 seconds
- ✅ Cursor occlusion avoidance (repositions at edges)
- ✅ Trust signals in every tooltip (source + timestamp)
- ✅ Focus effects (Bubble chart)
- ✅ Performance optimized (debounced handlers)

**Files Modified:**
- `/components/Tooltip.tsx` (NEW)
- `/lib/charts/d3/01-sparkline.tsx`
- `/lib/charts/d3/02-choropleth.tsx`
- `/lib/charts/d3/22-bubble.tsx`
- `/lib/charts/d3/43-waterfall.tsx`
- `/lib/charts/d3/13-dual-timeline.tsx`
- `/lib/charts/d3/32-boxplot.tsx`
- `/lib/charts/d3/33-cdf.tsx`
- `/lib/charts/d3/16-step-chart.tsx`

---

## 🚀 Next Steps — Priority Order

### Immediate: Testing & Validation
**Priority:** HIGH
**Estimated Time:** 30 minutes

**Tasks:**
1. **Browser Testing**
   - Navigate to `http://localhost:3000/test-charts`
   - Test each tooltip across all chart types
   - Switch between data types (earthquakes, wildfires, air quality)
   - Verify auto-hide works (2 seconds)
   - Test near screen edges (repositioning)

2. **Edge Cases**
   - Empty data states
   - Single data point
   - Mobile/tablet viewport sizes
   - Touch device behavior

3. **Performance Check**
   - Tooltip render time (<100ms target)
   - Memory leaks (check for orphaned timeouts)
   - Scroll performance with many tooltips

**Success Criteria:**
- ✅ All tooltips render correctly
- ✅ No console errors
- ✅ Auto-hide works consistently
- ✅ Positioning avoids cursor occlusion
- ✅ Data source shows correctly for each data type

---

### Phase B: Modal System (Tier 3 - Micro) — Deep Dive Interactions
**Priority:** MEDIUM-HIGH
**Estimated Time:** 3-4 days

**Goal:** Enable "3-minute deep-dive" exploration with drill-down modals

#### **1. Core Modal Infrastructure (Day 1)**

**Components to Build:**
- `/components/ChartModal.tsx` — Full-screen modal container
- `/components/TimelineScrubber.tsx` — Playback controls
- `/components/LayerToggle.tsx` — Max 3 active layers
- `/components/ExportMenu.tsx` — PNG + CSV export

**Features:**
- Darkened overlay (92% opacity)
- ESC key closes
- Click outside closes
- Focus trap (keyboard navigation)
- Restore focus on close

**Technical Specs:**
- Modal size: 90vw × 80vh (max 1200px width)
- Open animation: <300ms
- Close animation: <200ms
- ARIA: `role="dialog"`, `aria-modal="true"`

---

#### **2. High-Priority Chart Modals (Day 2-3)**

**Sparkline Modal** (HIGH)
- Timeline scrubber with play/pause
- Time window selector (6h, 12h, 24h, 7d)
- Inflection point markers
- Rate calculation overlay
- **Justification:** Reveals acceleration/deceleration patterns

**Choropleth Modal** (HIGH)
- Click region → drill-down
- Individual events in grid cell (list view)
- Time distribution histogram
- Comparison to adjacent regions
- **Justification:** Reveals spatial clustering + temporal patterns

**Dual Timeline Modal** (HIGH)
- Synchronized time scrubber
- Play animation (24-60fps)
- Toggle overlay mode (both on same axis)
- Lead/lag correlation indicators
- **Justification:** Reveals temporal correlation + causality

---

#### **3. Medium-Priority Chart Modals (Day 4)**

**CDF Modal** (MEDIUM)
- Threshold slider (interactive)
- Input custom value → see probability
- Compare to historical CDF (dotted overlay)
- **Justification:** Enables threshold tuning (e.g., "alert only on M5+")

**Bubble Modal** (MEDIUM)
- Brush selection (draw box to zoom)
- Toggle outliers on/off
- Optional regression line
- **Justification:** Reveals clustering patterns at scale

**Step Chart Modal** (MEDIUM)
- Time scrubber with animation
- Rate derivative overlay (dashed line)
- Highlight acceleration periods (steep steps)
- **Justification:** Reveals surge periods

---

#### **4. Modal Features Checklist**

**Must-Have:**
- [ ] Timeline scrubber (play/pause/speed controls)
- [ ] ChartAttribution visible in modal
- [ ] Export buttons (PNG, CSV)
- [ ] Reset/Close controls
- [ ] Trust signals persist

**Nice-to-Have:**
- [ ] Layer toggles (Environmental, Infrastructure, Connectivity)
- [ ] Time range selection (6h, 12h, 24h, 7d, custom)
- [ ] Keyboard shortcuts (Space = play/pause, ← → = scrub)
- [ ] Fullscreen toggle

**Accessibility:**
- [ ] Focus trap (Tab cycles within modal)
- [ ] ESC key closes
- [ ] Screen reader announces modal open/close
- [ ] ARIA labels for all controls
- [ ] Color contrast ≥4.5:1

---

### Phase C: Status Cards (Dashboard Summary)
**Priority:** MEDIUM
**Estimated Time:** 2-3 days

**Goal:** "3-second glance" KPI cards before chart exploration

**Design:**
```
┌─────────────────────────────────────┐
│ 🌍 Earthquakes                      │
│ 23 events • 5 significant • ↗ +15% │
│                                     │
│ [Mini Sparkline ———————————]        │
│                                     │
│ Top Hotspot: 45.2°N, -122.4°W       │
│ USGS • Updated 3h ago • High        │
└─────────────────────────────────────┘
```

**Components:**
- `/components/StatusCard.tsx` — Individual KPI card
- `/components/StatusCardGrid.tsx` — Layout container

**Cards to Build:**
1. Earthquakes status
2. Wildfires status
3. Air Quality status
4. Infrastructure status (future)

**Features:**
- Click card → expands to chart modal
- Mini sparkline preview
- Trend indicator (↗↘→)
- Trust signals inline

---

### Phase D: Advanced Features (Future)
**Priority:** LOW
**Estimated Time:** 1-2 weeks

**Features to Consider:**
1. **Real-time Data Integration**
   - WebSocket connections to live APIs
   - Auto-refresh at configurable intervals
   - Notification system for significant events

2. **Historical Comparison**
   - Overlay "same time yesterday/last week"
   - Seasonal trend analysis
   - Anomaly detection

3. **Custom Alerts**
   - User-defined thresholds
   - Email/SMS notifications
   - Alert history log

4. **Data Export & Sharing**
   - Generate shareable links
   - Embed charts in external sites (iframe)
   - PDF report generation

5. **Mobile App**
   - Native iOS/Android apps
   - Push notifications
   - Offline data caching

---

## 📊 Technical Debt & Refactoring

### Immediate Cleanup (Before Phase B)
**Priority:** MEDIUM
**Estimated Time:** 1 day

1. **TypeScript Strictness**
   - Add strict null checks
   - Remove `any` types in chart components
   - Add prop validation

2. **Performance Optimization**
   - Memoize D3 scales and generators
   - Use `useMemo` for expensive calculations
   - Implement virtual scrolling for large datasets

3. **Code Organization**
   - Extract common D3 logic to `/lib/charts/utils/`
   - Create shared hooks (`useTooltip`, `useD3Chart`)
   - Consolidate color scales

4. **Testing**
   - Unit tests for Tooltip component
   - Integration tests for chart interactions
   - E2E tests for modal workflows

---

## 🧪 Testing Strategy

### Manual Testing (Now)
- [ ] Browser testing (Chrome, Firefox, Safari)
- [ ] Mobile viewport testing
- [ ] Touch device testing (iPad, iPhone)
- [ ] Accessibility audit (screen reader)

### Automated Testing (Phase B)
- [ ] Unit tests (Jest + React Testing Library)
- [ ] Visual regression tests (Percy/Chromatic)
- [ ] E2E tests (Playwright/Cypress)
- [ ] Performance tests (Lighthouse CI)

---

## 📈 Success Metrics

### Phase A (Tooltips) — Target vs Actual
| Metric | Target | Actual | Status |
|--------|--------|--------|--------|
| Tooltip render time (p95) | <100ms | TBD | ⏳ |
| Charts with tooltips | 8/8 | 8/8 | ✅ |
| ARIA compliance | 100% | TBD | ⏳ |
| Auto-hide functionality | Working | ✅ | ✅ |

### Phase B (Modals) — Targets
| Metric | Target |
|--------|--------|
| Modal open time (p95) | <300ms |
| Timeline scrubbing (p95) | ≥24fps |
| Accessibility score | 100/100 |
| Charts with modals | 3-6 |

### Phase C (Status Cards) — Targets
| Metric | Target |
|--------|--------|
| Time-to-insight | <3 seconds |
| Card click-through rate | ≥25% |
| Mobile performance | 90+ Lighthouse |

---

## 🔍 Open Questions & Decisions Needed

### Technical Decisions
1. **Timeline Playback Speed**
   - 24fps (per spec) vs 60fps (modern devices)
   - **Recommendation:** 60fps with 24fps fallback

2. **Modal Default Time Window**
   - Last 24h vs All available data
   - **Recommendation:** Last 24h (most actionable)

3. **Export Formats**
   - PNG only vs PNG + SVG + CSV
   - **Recommendation:** PNG + CSV (sharing + analysis)

4. **Mobile Modal Layout**
   - Full-screen vs Bottom sheet
   - **Recommendation:** Full-screen (more space for controls)

### Design Decisions
1. **Tooltip Auto-hide Duration**
   - Current: 2 seconds
   - Alternatives: 1s, 3s, never
   - **Status:** Keep at 2s (good balance)

2. **Animation Default**
   - Auto-play vs Manual start
   - **Recommendation:** Manual (respect user control)

3. **Layer Opacity Strategy**
   - Fixed 50% vs Dynamic (reduces as layers increase)
   - **Recommendation:** Dynamic (maintains legibility)

---

## 📝 Notes & Considerations

### User Feedback to Gather
- Are tooltips discoverable? (do users find them?)
- Is 2-second auto-hide too fast/slow?
- Do users want tooltips to "stick" (click to pin)?
- Which charts need modals most urgently?

### Performance Considerations
- Tooltip state management (React context vs local state)
- D3 re-rendering optimization (only update changed data)
- Memory management for long-running sessions
- Bundle size (current D3 imports, tree-shaking)

### Accessibility Priorities
- Screen reader testing with VoiceOver + NVDA
- Keyboard-only navigation audit
- Color contrast verification (all text ≥4.5:1)
- Touch target size audit (all buttons ≥44×44px)

---

## 🎨 Design System Evolution

### Current Status
- Color palette defined
- Typography system in place (Geist Mono, Albert Sans)
- Spacing/margin conventions established

### Future Needs
- Modal animation library (Framer Motion?)
- Icon system expansion (more Lucide icons)
- Loading states & skeleton screens
- Error state designs
- Empty state illustrations

---

## 🚦 Risk Assessment

### Low Risk
- Tooltip implementation (already working)
- Static chart refinements (complete)
- Documentation (comprehensive)

### Medium Risk
- Modal performance with large datasets
- Timeline scrubber animation smoothness
- Export functionality (file size limits)

### High Risk
- Real-time data integration (API rate limits)
- Mobile performance (complex D3 charts)
- Cross-browser consistency (Safari quirks)

---

## 📅 Timeline Estimate

**Week 1 (Current):**
- ✅ Trust Signals (Complete)
- ✅ Chart Refinements (Complete)
- ✅ Interactive Tooltips (Complete)
- 🔄 Testing & validation

**Week 2:**
- Modal infrastructure (Day 1-2)
- High-priority modals (Day 3-5)

**Week 3:**
- Medium-priority modals (Day 1-2)
- Polish & accessibility (Day 3-4)
- Testing & bug fixes (Day 5)

**Week 4:**
- Status Cards (Day 1-3)
- Integration & final testing (Day 4-5)

---

## 🎯 Definition of Done

### Phase A (Tooltips)
- [x] All 8 charts have hover tooltips
- [x] Tooltip component is reusable
- [x] Trust signals in every tooltip
- [ ] Accessibility audit passed (in progress)
- [ ] Browser testing complete (pending)
- [ ] Performance benchmarks met (pending)

### Phase B (Modals)
- [ ] 3+ chart modals implemented
- [ ] Timeline scrubber working
- [ ] Export functionality
- [ ] Accessibility score 100/100
- [ ] Performance targets met
- [ ] User testing complete

### Phase C (Status Cards)
- [ ] 3+ status cards built
- [ ] Click-to-expand working
- [ ] Mini sparklines rendering
- [ ] Mobile responsive
- [ ] Performance optimized

---

## 🔗 Related Documentation

- [INTERACTIVITY_PRINCIPLES.md](./INTERACTIVITY_PRINCIPLES.md) — Comprehensive guide (created today)
- [README.md](../README.md) — Project overview
- Test page: `http://localhost:3000/test-charts`

---

## 💡 Ideas for Future Exploration

1. **AI-Powered Insights**
   - Automated anomaly detection
   - Natural language summaries ("Unusual activity in California...")
   - Predictive modeling (forecast next 24h)

2. **Collaboration Features**
   - Shared dashboards with team members
   - Comments/annotations on charts
   - Version history

3. **Custom Visualizations**
   - User-defined chart types
   - Drag-and-drop chart builder
   - Template library

4. **API & Integrations**
   - Public API for external access
   - Zapier/IFTTT integrations
   - Slack/Discord notifications

---

**End of Document**

*Last reviewed: October 26, 2025 @ 4:00 PM*
*Next review: After Phase B completion*
