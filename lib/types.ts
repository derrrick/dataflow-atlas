// Data types for Flow Atlas

export interface Earthquake {
  id: string
  magnitude: number
  location: string
  depth: number
  lat: number
  lon: number
  timestamp: number
}

export interface HazardPoint {
  lat: number
  lon: number
  intensity: number // 0-100
  type: 'wind' | 'precip' | 'temp'
  timestamp: number
}

export interface Outage {
  region: string
  country: string
  severity: number // 0-100
  affectedASNs: number
  timestamp: number
}

export interface LatencyArc {
  from: { lat: number; lon: number; name: string }
  to: { lat: number; lon: number; name: string }
  latency: number // in ms
  packetLoss: number // percentage
  timestamp: number
}

export interface FragilityScore {
  region: string
  hazard: number
  exposure: number
  resilience: number
  overall: number
}

export interface Provenance {
  source: string
  license: string
  refreshCadence: string
  lastPull: number
}
