// Common chart types and interfaces for Flow Atlas
import type { Earthquake, Hazard, Outage, LatencyPoint } from '@/lib/services/dataTypes'

export type DataType = 'earthquakes' | 'hazards' | 'outages' | 'latency'

export type ChartCategory = 'spatial' | 'temporal' | 'correlation' | 'infrastructure' | 'fusion'

export interface ChartBaseProps {
  width?: number
  height?: number
  margin?: { top: number; right: number; bottom: number; left: number }
  interactive?: boolean
  showLegend?: boolean
  showAxes?: boolean
}

export interface SpatialChartProps extends ChartBaseProps {
  data: Earthquake[] | Hazard[] | Outage[] | LatencyPoint[]
  zoom?: number
  center?: [number, number]
}

export interface TemporalChartProps extends ChartBaseProps {
  data: Array<Earthquake | Hazard | Outage | LatencyPoint>
  timeRange?: { start: number; end: number }
  showTimeline?: boolean
}

export interface CorrelationChartProps extends ChartBaseProps {
  dataX: number[]
  dataY: number[]
  labels?: string[]
}

export interface ChartMetadata {
  id: string
  number: string // '01', '02', etc.
  name: string
  description: string
  category: ChartCategory
  dataSources: DataType[]
  priority: 'high' | 'medium' | 'low'
  phase: number
  implemented: boolean
  Component: React.ComponentType<any>
}
