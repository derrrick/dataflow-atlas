// Comprehensive 48-chart registry for Flow Atlas
import type { ChartMetadata } from './types'

// Placeholder component for charts not yet implemented
const PlaceholderChart = () => null

export const fullChartRegistry: Omit<ChartMetadata, 'Component'>[] = [
  // SPATIAL CHARTS (01-10)
  {
    id: 'sparkline',
    number: '01',
    name: 'Magnitude Sparkline',
    description: 'Minimal earthquake magnitude trend',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'choropleth',
    number: '02',
    name: 'Regional Intensity',
    description: 'Color-coded regional seismic intensity',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 2,
    implemented: false
  },
  {
    id: 'hexbin',
    number: '03',
    name: 'Density Hexbin',
    description: 'Hexagonal binning of event density',
    category: 'spatial',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'flow-map',
    number: '04',
    name: 'Event Propagation',
    description: 'Directional flow of seismic events',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'isoline',
    number: '05',
    name: 'Magnitude Contours',
    description: 'Isoline contours of magnitude',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'dot-density',
    number: '06',
    name: 'Population Affected',
    description: 'Dot density for affected areas',
    category: 'spatial',
    dataSources: ['earthquakes', 'outages'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'graduated-symbols',
    number: '07',
    name: 'Proportional Circles',
    description: 'Circle size by magnitude',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'spatial-heatmap',
    number: '08',
    name: 'Intensity Zones',
    description: 'Continuous heat map of intensity',
    category: 'spatial',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'voronoi',
    number: '09',
    name: 'Voronoi Diagram',
    description: 'Spatial proximity analysis',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'network-map',
    number: '10',
    name: 'Infrastructure Network',
    description: 'Connected infrastructure nodes',
    category: 'spatial',
    dataSources: ['outages', 'latency'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },

  // TEMPORAL CHARTS (11-20)
  {
    id: 'timeline',
    number: '11',
    name: 'Event Timeline',
    description: 'Chronological event sequence',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'horizon-chart',
    number: '12',
    name: 'Horizon Chart',
    description: 'Multi-series temporal comparison',
    category: 'temporal',
    dataSources: ['earthquakes', 'latency'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'temporal-small-multiples',
    number: '13',
    name: 'Regional Timelines',
    description: 'Small multiples of regional trends',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'slopegraph',
    number: '14',
    name: 'Change Over Time',
    description: 'Before/after comparison slopes',
    category: 'temporal',
    dataSources: ['latency', 'outages'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'range-plot',
    number: '15',
    name: 'Magnitude Range',
    description: 'Min/max magnitude bands',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'step-chart',
    number: '16',
    name: 'Cumulative Events',
    description: 'Step function of accumulation',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'cycle-plot',
    number: '17',
    name: 'Daily Patterns',
    description: 'Cyclical daily/weekly patterns',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'calendar-heatmap',
    number: '18',
    name: 'Calendar View',
    description: 'Temporal density calendar',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'time-series',
    number: '19',
    name: 'Seismic Activity',
    description: 'Continuous monitoring timeline',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'streamgraph',
    number: '20',
    name: 'Event Stream',
    description: 'Stacked area of event types',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'low',
    phase: 3,
    implemented: false
  },

  // CORRELATION CHARTS (21-30)
  {
    id: 'scatter',
    number: '21',
    name: 'Magnitude vs Depth',
    description: 'Bivariate correlation analysis',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'bubble-chart',
    number: '22',
    name: 'Three Variables',
    description: 'Bubble size as third dimension',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'connected-scatter',
    number: '23',
    name: 'Temporal Scatter',
    description: 'Connected dots showing sequence',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'marginal-distribution',
    number: '24',
    name: 'Scatter + Histograms',
    description: 'Scatter with marginal distributions',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'parallel-coordinates',
    number: '25',
    name: 'Multi-Dimensional',
    description: 'Parallel coordinate plot',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'radar-chart',
    number: '26',
    name: 'Multivariate Comparison',
    description: 'Radar plot of attributes',
    category: 'correlation',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'density-plot',
    number: '27',
    name: '2D Density',
    description: 'Contour density visualization',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'correlation-matrix',
    number: '28',
    name: 'Correlation Grid',
    description: 'Heatmap of correlations',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'regression-plot',
    number: '29',
    name: 'Trend Line',
    description: 'Linear regression with confidence',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'residual-plot',
    number: '30',
    name: 'Model Residuals',
    description: 'Residual analysis plot',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },

  // DISTRIBUTION CHARTS (31-40)
  {
    id: 'histogram',
    number: '31',
    name: 'Magnitude Distribution',
    description: 'Frequency histogram',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'box-plot',
    number: '32',
    name: 'Statistical Summary',
    description: 'Box and whisker plot',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'violin-plot',
    number: '33',
    name: 'Distribution Shape',
    description: 'Violin plot of densities',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'strip-plot',
    number: '34',
    name: 'Individual Values',
    description: 'One-dimensional scatter',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'beeswarm',
    number: '35',
    name: 'Beeswarm Plot',
    description: 'Non-overlapping value distribution',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'ridgeline',
    number: '36',
    name: 'Overlapping Distributions',
    description: 'Ridgeline density curves',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'cumulative-distribution',
    number: '37',
    name: 'CDF',
    description: 'Cumulative distribution function',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'qq-plot',
    number: '38',
    name: 'Normality Test',
    description: 'Quantile-quantile plot',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'density-curve',
    number: '39',
    name: 'Smoothed Distribution',
    description: 'Kernel density estimate',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'population-pyramid',
    number: '40',
    name: 'Demographic Comparison',
    description: 'Back-to-back histogram',
    category: 'infrastructure',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'low',
    phase: 3,
    implemented: false
  },

  // COMPARISON CHARTS (41-48)
  {
    id: 'bar-chart',
    number: '41',
    name: 'Category Comparison',
    description: 'Simple bar chart',
    category: 'fusion',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'high',
    phase: 1,
    implemented: false
  },
  {
    id: 'grouped-bar',
    number: '42',
    name: 'Multi-Series Bars',
    description: 'Grouped bar comparison',
    category: 'fusion',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'stacked-bar',
    number: '43',
    name: 'Part-to-Whole',
    description: 'Stacked bar chart',
    category: 'fusion',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'diverging-bar',
    number: '44',
    name: 'Positive/Negative',
    description: 'Diverging bar chart',
    category: 'fusion',
    dataSources: ['latency'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'lollipop',
    number: '45',
    name: 'Discrete Values',
    description: 'Lollipop chart',
    category: 'fusion',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'bullet-chart',
    number: '46',
    name: 'Performance Indicator',
    description: 'Bullet chart with targets',
    category: 'fusion',
    dataSources: ['latency', 'outages'],
    priority: 'low',
    phase: 3,
    implemented: false
  },
  {
    id: 'dot-plot',
    number: '47',
    name: 'Precision Comparison',
    description: 'Cleveland dot plot',
    category: 'fusion',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false
  },
  {
    id: 'waterfall',
    number: '48',
    name: 'Cumulative Changes',
    description: 'Waterfall visualization',
    category: 'fusion',
    dataSources: ['outages'],
    priority: 'low',
    phase: 3,
    implemented: false
  }
]
