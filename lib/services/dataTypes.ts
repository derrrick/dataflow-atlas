export interface Earthquake {
  id: string
  coords: [number, number]
  magnitude: number
  depth: number
  location: string
  time: string
  timestamp: number
}

export interface Hazard {
  id: string
  coords: [number, number]
  severity: 'Low' | 'Medium' | 'High'
  affected: number
  location: string
  time: string
  timestamp: number
  type?: string
}

export interface Outage {
  id: string
  coords: [number, number]
  region: string
  affected: number
  location: string
  time: string
  timestamp: number
  provider?: string
}

export interface LatencyPoint {
  id: string
  coords: [number, number]
  latency: number
  region: string
  location: string
  time: string
  timestamp: number
}

export interface AirQuality {
  id: string
  coords: [number, number]
  pm25: number // PM2.5 concentration in µg/m³
  aqi: number // Air Quality Index (0-500)
  quality: 'Good' | 'Moderate' | 'Unhealthy for Sensitive Groups' | 'Unhealthy' | 'Very Unhealthy' | 'Hazardous'
  location: string
  time: string
  timestamp: number
}

export interface Wildfire {
  id: string
  coords: [number, number]
  brightness: number // Fire radiative power in MW
  confidence: number // Detection confidence (0-100)
  scan: number // Scan angle
  location: string
  time: string
  timestamp: number
  satellite: 'MODIS' | 'VIIRS' | 'Unknown'
}

export interface DataServiceResponse<T> {
  data: T[]
  error?: string
  timestamp: number
  cached: boolean
}

// Unified data point for dynamic chart rendering
export type SeverityLevel = 'low' | 'medium' | 'high' | 'critical'

export interface UnifiedDataPoint {
  id: string
  coords: [number, number]
  timestamp: number
  time: string
  location: string

  // Unified metrics (normalized for cross-layer comparison)
  primaryValue: number      // Main metric (magnitude, brightness, AQI, etc.) - normalized 0-100
  secondaryValue?: number   // Secondary metric (depth, confidence, PM2.5, etc.)
  tertiaryValue?: number    // Additional metric if needed
  severity: SeverityLevel   // Categorical severity level

  // Layer identification
  layerType: string         // 'earthquakes', 'wildfire', 'air-quality', etc.
  layerLabel: string        // Human-readable layer name

  // Original data preserved for specialized charts
  rawData: Earthquake | Wildfire | AirQuality | Hazard | Outage | LatencyPoint
}
