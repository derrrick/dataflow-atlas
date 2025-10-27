# Frontend Aesthetics Guide
## Dataflow Atlas Design Principles

> Based on [Claude Cookbook: Prompting for Frontend Aesthetics](https://github.com/anthropics/claude-cookbooks/blob/main/coding/prompting_for_frontend_aesthetics.ipynb)

## Core Philosophy

**Avoid generic, conservative designs.** Dataflow Atlas demands precision, sophistication, and data-driven aesthetic choices that reflect the seriousness of real-time global monitoring.

## Design Dimensions

### 1. Typography

**Current System:**
- Primary: `Geist Mono` - Technical, precise, data-focused
- Secondary: `Albert Sans` - Clean, geometric, modern
- Avoid: Inter, Roboto, Arial, system fonts (overused and generic)

**Rules:**
- Use Geist Mono for all data displays, charts, metrics, technical UI
- Use Albert Sans for prose, headers, navigation
- Maintain consistent sizing: `11px` (labels), `12px` (body), `14px` (headers), `22px` (emphasis)
- Letter spacing: `0.5px` for uppercase labels

### 2. Color & Theme

**Inspired by:** Dark IDE themes (VS Code Dark+, Tokyo Night), satellite imagery, data visualization

**Color System:**
```css
/* Background Layers */
--ocean: #141821       /* Primary background - deep space */
--land: #0A0F16        /* Secondary background - darker regions */
--void: #080D12        /* Tertiary background - deepest */

/* UI Structure */
--border: #242C3A      /* Subtle boundaries */
--border-light: #3D4958

/* Text Hierarchy */
--text-primary: #FFFFFF
--text-secondary: #C6CFDA
--text-tertiary: #8F9BB0
--text-muted: #5E6A81

/* Data Colors */
--earthquake: #FF3B3B  /* Red - seismic */
--wildfire: #FF6B35    /* Orange - thermal */
--air-quality: #00E400 /* Green - environmental */
--power: #FFD700       /* Gold - infrastructure */
--weather: #9333EA     /* Purple - atmospheric */
--latency: #39D0FF     /* Cyan - connectivity */
```

**Rules:**
- Commit to dark theme - no light mode compromises
- Use CSS variables for all colors
- Dominant earth tones with sharp data-driven accents
- Avoid: Purple gradients on white, rainbow palettes, pastels

### 3. Motion & Animation

**Philosophy:** Precision over decoration. Every animation serves data comprehension.

**Current Animations:**
- **Ripple effects** - Pulsating circles on critical events (magnitude ≥ 5, AQI ≥ 100)
- **Hover states** - 200ms cubic-bezier transitions
- **Page load** - Staggered map initialization

**Rules:**
- CSS-only animations preferred
- Duration: 200-400ms for UI, 2000ms for data pulses
- Easing: `cubic-bezier(0.25, 0.1, 0.25, 1)` for smooth, professional feel
- Avoid: Bouncy animations, excessive micro-interactions, spinner overload

### 4. Backgrounds

**Strategy:** Layered gradients and atmospheric effects

**Current Implementation:**
```css
/* Map base */
background: radial-gradient(circle at 20% 50%, rgba(20, 24, 33, 0.8) 0%, #0A0F16 100%);

/* Panel backgrounds */
background: linear-gradient(135deg, #0A0F16 0%, #080D12 100%);
```

**Rules:**
- No solid colors for large surfaces
- Subtle gradients create depth
- Dark-to-darker gradients (never light)
- Avoid: Bright gradients, busy patterns, distracting textures

## Component Patterns

### Data Visualization Tiles

```tsx
// Header with data count
<div style={{
  padding: '12px 16px',
  borderBottom: '1px solid #242C3A',
  backgroundColor: '#080D12'
}}>
  <div style={{
    fontSize: '11px',
    fontWeight: 600,
    color: '#8F9BB0',
    fontFamily: 'Geist Mono, monospace',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }}>
    EARTHQUAKE ACTIVITY
  </div>
  <div style={{
    fontSize: '10px',
    color: '#5E6A81',
    fontFamily: 'Geist Mono, monospace'
  }}>
    156 events
  </div>
</div>
```

### Modal/Popup Design

```tsx
// FiveThirtyEight-inspired trust signals
<div style={{
  padding: '12px',
  backgroundColor: '#0A0F16',
  borderLeft: '3px solid #9333EA',
  borderRadius: '4px'
}}>
  <div style={{
    fontSize: '13px',
    color: '#FFFFFF',
    fontFamily: 'Geist Mono, monospace',
    lineHeight: '1.5',
    fontWeight: 500
  }}>
    Severe Thunderstorm Warning
  </div>
</div>
```

### Badge System

```tsx
// Color-coded event badges
<div style={{
  padding: '4px 10px',
  backgroundColor: '#8B0000', // Event-specific color
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 600,
  color: '#FFFFFF',
  fontFamily: 'Geist Mono, monospace',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
}}>
  TORNADO
</div>
```

## Anti-Patterns to Avoid

❌ **Typography:**
- Inter/Roboto for technical data
- Multiple font families in one component
- Inconsistent sizing (random 13px, 15px values)

❌ **Color:**
- Light backgrounds for data visualization
- Rainbow color schemes
- Low contrast (fails WCAG AA)
- Purple-blue gradients (cliché)

❌ **Layout:**
- Centered everything
- Excessive whitespace in data-dense views
- Generic card grids
- Floating action buttons

❌ **Animation:**
- Spinning loaders everywhere
- Bouncy spring animations
- Fade-in on scroll (overdone)

## Inspiration Sources

1. **Nate Silver's FiveThirtyEight** - Trust signals, data attribution, uncertainty visualization
2. **Bloomberg Terminal** - Information density, precision typography
3. **NASA Mission Control** - Critical data presentation, dark themes
4. **Satellite Imagery** - Natural color palettes (deep blues, earth tones)
5. **IDE Themes** - VS Code Dark+, Tokyo Night, Nord

## Implementation Checklist

When adding new features, verify:

- [ ] Uses Geist Mono for data/metrics
- [ ] Follows established color variables
- [ ] Dark theme throughout (no light compromises)
- [ ] Animations serve data comprehension
- [ ] No generic/overused patterns
- [ ] Typography hierarchy maintained
- [ ] Borders use `#242C3A`
- [ ] Hover states use 200ms transitions
- [ ] Data has proper trust signals (source, timestamp, confidence)

---

**Last Updated:** 2025-10-27
**Maintainer:** Claude Code Development Team
