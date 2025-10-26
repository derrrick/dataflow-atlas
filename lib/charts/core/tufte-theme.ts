// Tufte design system tokens for Flow Atlas
// Based on Edward Tufte's principles of data visualization

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

export const tufteMargins = {
  sparkline: { top: 2, right: 0, bottom: 2, left: 0 },
  small: { top: 20, right: 20, bottom: 30, left: 35 },
  medium: { top: 30, right: 30, bottom: 40, left: 50 },
  large: { top: 40, right: 40, bottom: 50, left: 60 }
}

export const chartDimensions = {
  mobile: { min: 320, max: 768 },
  tablet: { min: 768, max: 1024 },
  desktop: { min: 1024, max: Infinity },

  smallMultiples: {
    min: { width: 200, height: 150 },
    ideal: { width: 280, height: 210 }, // 4:3 ratio
    max: { width: 400, height: 300 }
  }
}

export const panelHeights = {
  collapsed: '300px',
  half: '50vh',
  full: '85vh'
}

export const transitions = {
  panel: {
    duration: 400,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)' // Tufte-style smooth
  },
  modal: {
    duration: 200,
    easing: 'cubic-bezier(0.25, 0.1, 0.25, 1)'
  }
}
