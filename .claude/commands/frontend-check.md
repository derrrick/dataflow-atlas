---
description: Review frontend aesthetics guidelines before starting UI/design work
---

# Frontend Aesthetics Check

Before proceeding with any frontend/UI changes, review the project's design system:

## Quick Reference Checklist

**Typography:**
- [ ] Using Geist Mono for data/metrics/technical UI?
- [ ] Using Albert Sans for prose/headers?
- [ ] Avoiding Inter, Roboto, Arial, system fonts?
- [ ] Consistent sizing: 11px (labels), 12px (body), 14px (headers)?
- [ ] Letter-spacing: 0.5px for uppercase labels?

**Color System:**
- [ ] Using CSS variables from design system?
- [ ] Dark theme maintained (no light compromises)?
- [ ] Borders use `#242C3A`?
- [ ] Text hierarchy: `#FFFFFF` > `#C6CFDA` > `#8F9BB0` > `#5E6A81`?
- [ ] Data colors appropriate: earthquake (#FF3B3B), wildfire (#FF6B35), etc.?

**Motion & Animation:**
- [ ] Animations serve data comprehension (not decoration)?
- [ ] Duration: 200-400ms for UI, 2000ms for data pulses?
- [ ] Using `cubic-bezier(0.25, 0.1, 0.25, 1)` easing?
- [ ] CSS-only animations preferred?

**Layout & Components:**
- [ ] Following established component patterns?
- [ ] Data tiles have headers showing name + count?
- [ ] Modals include trust signals (source, timestamp)?
- [ ] Avoiding generic card grids and centered layouts?

**Anti-Patterns to Avoid:**
- ❌ Light backgrounds for data visualization
- ❌ Purple-blue gradients (cliché)
- ❌ Multiple font families in one component
- ❌ Bouncy/excessive micro-interactions
- ❌ Generic UI without context-specific character

## Full Documentation

See `docs/FRONTEND_AESTHETICS.md` for complete design system documentation including:
- Color palette with CSS variables
- Component patterns with code examples
- Inspiration sources (FiveThirtyEight, Bloomberg Terminal, NASA Mission Control)
- Implementation checklist

## Current Design Philosophy

**Dataflow Atlas demands:**
- Precision and sophistication
- Data-driven aesthetic choices
- Dark IDE theme inspiration (VS Code Dark+, Tokyo Night)
- FiveThirtyEight-style trust signals and attribution
- Information density without clutter

---

✅ **Checklist Complete?** Proceed with frontend changes following established patterns.
