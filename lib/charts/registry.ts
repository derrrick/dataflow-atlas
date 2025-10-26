// Comprehensive 48-chart registry for Flow Atlas
import type { ChartMetadata } from './types'
import { Sparkline } from './d3/01-sparkline'
import { Choropleth } from './d3/02-choropleth'
import { Hexbin } from './d3/03-hexbin'
import { ProportionalCircles } from './d3/07-proportional-circles'
import { IntensityZones } from './d3/08-intensity-zones'
import { Timeline } from './d3/11-timeline'
import { Calendar } from './d3/12-calendar'
import { DualTimeline } from './d3/13-dual-timeline'
import { Slopegraph } from './d3/14-slopegraph'
import { RangePlot } from './d3/15-range-plot'
import { StepChart } from './d3/16-step-chart'
import { AreaChart } from './d3/19-area-chart'
import { Scatter } from './d3/21-scatter'
import { Bubble } from './d3/22-bubble'
import { Correlation } from './d3/23-correlation'
import { Histogram } from './d3/31-histogram'
import { BoxPlot } from './d3/32-boxplot'
import { CDF } from './d3/33-cdf'
import { BarChart } from './d3/41-bar-chart'
import { GroupedBar } from './d3/42-grouped-bar'
import { Waterfall } from './d3/43-waterfall'
import { PlaceholderChart } from './d3/placeholder'

// Wrapper components for placeholders
const makePlaceholder = (number: string, name: string) => {
  return function PlaceholderWrapper(props: any) {
    return PlaceholderChart({ chartNumber: number, chartName: name, ...props })
  }
}

export const chartRegistry: ChartMetadata[] = [
  // SPATIAL (01-10)
  {
    id: 'sparkline',
    number: '01',
    name: 'Magnitude Sparkline',
    description: 'Minimal earthquake magnitude trend',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Sparkline
  },
  {
    id: 'choropleth',
    number: '02',
    name: 'Regional Intensity',
    description: 'Color-coded regional intensity',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Choropleth
  },
  {
    id: 'hexbin',
    number: '03',
    name: 'Density Hexbin',
    description: 'Hexagonal event density',
    category: 'spatial',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 1,
    implemented: true,
    Component: Hexbin
  },
  {
    id: 'flow-map',
    number: '04',
    name: 'Event Propagation',
    description: 'Directional flow visualization',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('04', 'Event Propagation')
  },
  {
    id: 'isoline',
    number: '05',
    name: 'Magnitude Contours',
    description: 'Isoline contour map',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false,
    Component: makePlaceholder('05', 'Magnitude Contours')
  },
  {
    id: 'dot-density',
    number: '06',
    name: 'Population Affected',
    description: 'Dot density visualization',
    category: 'spatial',
    dataSources: ['earthquakes', 'outages'],
    priority: 'medium',
    phase: 2,
    implemented: false,
    Component: makePlaceholder('06', 'Population Affected')
  },
  {
    id: 'proportional-circles',
    number: '07',
    name: 'Proportional Circles',
    description: 'Circle size by magnitude',
    category: 'spatial',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: ProportionalCircles
  },
  {
    id: 'heatmap-zones',
    number: '08',
    name: 'Intensity Zones',
    description: 'Continuous heatmap',
    category: 'spatial',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: IntensityZones
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
    implemented: false,
    Component: makePlaceholder('09', 'Voronoi Diagram')
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
    implemented: false,
    Component: makePlaceholder('10', 'Infrastructure Network')
  },

  // TEMPORAL (11-20)
  {
    id: 'timeline',
    number: '11',
    name: 'Event Timeline',
    description: 'Chronological event sequence',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Timeline
  },
  {
    id: 'event-calendar',
    number: '12',
    name: 'Event Calendar',
    description: 'Calendar heatmap of events',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Calendar
  },
  {
    id: 'dual-timeline',
    number: '13',
    name: 'Dual Timeline',
    description: 'Compare earthquakes and hazards',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: DualTimeline
  },
  {
    id: 'slopegraph',
    number: '14',
    name: 'Change Over Time',
    description: 'Before/after comparison',
    category: 'temporal',
    dataSources: ['latency', 'outages'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Slopegraph
  },
  {
    id: 'range-plot',
    number: '15',
    name: 'Magnitude Range',
    description: 'Min/max magnitude bands',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 1,
    implemented: true,
    Component: RangePlot
  },
  {
    id: 'step-chart',
    number: '16',
    name: 'Cumulative Events',
    description: 'Step function accumulation',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 1,
    implemented: true,
    Component: StepChart
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
    implemented: false,
    Component: makePlaceholder('17', 'Daily Patterns')
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
    implemented: false,
    Component: makePlaceholder('18', 'Calendar View')
  },
  {
    id: 'area-chart',
    number: '19',
    name: 'Seismic Activity',
    description: 'Area chart visualization',
    category: 'temporal',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: AreaChart
  },
  {
    id: 'streamgraph',
    number: '20',
    name: 'Event Stream',
    description: 'Stacked area flow',
    category: 'temporal',
    dataSources: ['earthquakes', 'hazards', 'outages'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('20', 'Event Stream')
  },

  // CORRELATION (21-30)
  {
    id: 'scatter',
    number: '21',
    name: 'Magnitude vs Depth',
    description: 'Bivariate correlation',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Scatter
  },
  {
    id: 'bubble',
    number: '22',
    name: 'Three Variables',
    description: 'Bubble size as third dimension',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: true,
    Component: Bubble
  },
  {
    id: 'correlation-matrix',
    number: '23',
    name: 'Correlation Matrix',
    description: 'Variable correlation heatmap',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Correlation
  },
  {
    id: 'marginal-distribution',
    number: '24',
    name: 'Scatter + Histograms',
    description: 'Marginal distributions',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('24', 'Scatter + Histograms')
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
    implemented: false,
    Component: makePlaceholder('25', 'Multi-Dimensional')
  },
  {
    id: 'radar',
    number: '26',
    name: 'Multivariate Comparison',
    description: 'Radar plot attributes',
    category: 'correlation',
    dataSources: ['earthquakes', 'hazards'],
    priority: 'medium',
    phase: 2,
    implemented: false,
    Component: makePlaceholder('26', 'Multivariate Comparison')
  },
  {
    id: 'density-2d',
    number: '27',
    name: '2D Density',
    description: 'Contour density plot',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false,
    Component: makePlaceholder('27', '2D Density')
  },
  {
    id: 'correlation-grid',
    number: '28',
    name: 'Correlation Grid',
    description: 'Heatmap of correlations',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false,
    Component: makePlaceholder('28', 'Correlation Grid')
  },
  {
    id: 'regression',
    number: '29',
    name: 'Trend Line',
    description: 'Linear regression',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: false,
    Component: makePlaceholder('29', 'Trend Line')
  },
  {
    id: 'residual',
    number: '30',
    name: 'Model Residuals',
    description: 'Residual analysis plot',
    category: 'correlation',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('30', 'Model Residuals')
  },

  // DISTRIBUTION (31-40)
  {
    id: 'histogram',
    number: '31',
    name: 'Magnitude Distribution',
    description: 'Frequency histogram',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Histogram
  },
  {
    id: 'boxplot',
    number: '32',
    name: 'Statistical Summary',
    description: 'Box and whisker plot',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'medium',
    phase: 2,
    implemented: true,
    Component: BoxPlot
  },
  {
    id: 'cumulative-distribution',
    number: '33',
    name: 'Cumulative Distribution',
    description: 'CDF of magnitude',
    category: 'distribution',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: CDF
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
    implemented: false,
    Component: makePlaceholder('34', 'Individual Values')
  },
  {
    id: 'beeswarm',
    number: '35',
    name: 'Beeswarm Plot',
    description: 'Non-overlapping distribution',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('35', 'Beeswarm Plot')
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
    implemented: false,
    Component: makePlaceholder('36', 'Overlapping Distributions')
  },
  {
    id: 'cdf',
    number: '37',
    name: 'CDF',
    description: 'Cumulative distribution function',
    category: 'infrastructure',
    dataSources: ['earthquakes'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('37', 'CDF')
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
    implemented: false,
    Component: makePlaceholder('38', 'Normality Test')
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
    implemented: false,
    Component: makePlaceholder('39', 'Smoothed Distribution')
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
    implemented: false,
    Component: makePlaceholder('40', 'Demographic Comparison')
  },

  // COMPARISON (41-48)
  {
    id: 'bar-chart',
    number: '41',
    name: 'Event Distribution',
    description: 'Simple bar comparison',
    category: 'fusion',
    dataSources: ['earthquakes', 'hazards', 'outages', 'latency'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: BarChart
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
    implemented: true,
    Component: GroupedBar
  },
  {
    id: 'waterfall',
    number: '43',
    name: 'Waterfall Chart',
    description: 'Cumulative magnitude breakdown',
    category: 'comparison',
    dataSources: ['earthquakes'],
    priority: 'high',
    phase: 1,
    implemented: true,
    Component: Waterfall
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
    implemented: false,
    Component: makePlaceholder('44', 'Positive/Negative')
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
    implemented: false,
    Component: makePlaceholder('45', 'Discrete Values')
  },
  {
    id: 'bullet',
    number: '46',
    name: 'Performance Indicator',
    description: 'Bullet chart with targets',
    category: 'fusion',
    dataSources: ['latency', 'outages'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('46', 'Performance Indicator')
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
    implemented: false,
    Component: makePlaceholder('47', 'Precision Comparison')
  },
  {
    id: 'waterfall-cumulative',
    number: '48',
    name: 'Cumulative Changes',
    description: 'Waterfall visualization',
    category: 'fusion',
    dataSources: ['outages'],
    priority: 'low',
    phase: 3,
    implemented: false,
    Component: makePlaceholder('48', 'Cumulative Changes')
  }
]

export function getChartById(id: string): ChartMetadata | undefined {
  return chartRegistry.find(chart => chart.id === id)
}

export function getChartsByCategory(category: ChartMetadata['category']): ChartMetadata[] {
  return chartRegistry.filter(chart => chart.category === category)
}

export function getChartsByDataSource(dataSource: string): ChartMetadata[] {
  return chartRegistry.filter(chart => chart.dataSources.includes(dataSource as any))
}

export function getImplementedCharts(): ChartMetadata[] {
  return chartRegistry.filter(chart => chart.implemented)
}

export function getChartsByPhase(phase: number): ChartMetadata[] {
  return chartRegistry.filter(chart => chart.phase === phase)
}

export function getChartsByPriority(priority: 'high' | 'medium' | 'low'): ChartMetadata[] {
  return chartRegistry.filter(chart => chart.priority === priority)
}
