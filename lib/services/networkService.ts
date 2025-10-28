import { formatRelativeTime } from './apiClient'
import type { Outage, LatencyPoint, DataServiceResponse } from './dataTypes'

const OUTAGE_LOCATIONS = [
  { coords: [40, -75] as [number, number], region: 'US Northeast', location: 'New York area', provider: 'Comcast', baseAffected: 850000 },
  { coords: [51, -0.1] as [number, number], region: 'UK', location: 'London', provider: 'BT', baseAffected: 1200000 },
  { coords: [-23, -46] as [number, number], region: 'South America', location: 'São Paulo', provider: 'TIM Brasil', baseAffected: 650000 },
]

const LATENCY_LOCATIONS = [
  { coords: [1, 103] as [number, number], region: 'Singapore', location: '1°N 103°E', baseLatency: 145 },
  { coords: [19, 72] as [number, number], region: 'Mumbai', location: '19°N 72°E', baseLatency: 220 },
  { coords: [-34, 151] as [number, number], region: 'Sydney', location: '34°S 151°E', baseLatency: 185 },
  { coords: [55, 37] as [number, number], region: 'Moscow', location: '55°N 37°E', baseLatency: 165 },
  { coords: [52, 13] as [number, number], region: 'Berlin', location: '52°N 13°E', baseLatency: 125 },
]

// Persistent state
let stableOutages: Outage[] | null = null
let stableLatency: LatencyPoint[] | null = null
const startTime = Date.now()

function generateStableOutages(): Outage[] {
  if (stableOutages) {
    // Evolve existing data slightly (±3% change in affected users)
    return stableOutages.map(outage => {
      const variation = (Math.random() - 0.5) * 0.06
      const newAffected = Math.floor(outage.affected * (1 + variation))

      return {
        ...outage,
        affected: newAffected,
        time: formatRelativeTime(outage.timestamp),
      }
    })
  }

  // Initial generation with stable values
  return OUTAGE_LOCATIONS.map((loc, idx) => {
    const hoursAgo = (idx + 1) * 1.5
    const timestamp = startTime - hoursAgo * 60 * 60 * 1000

    return {
      id: `outage-stable-${idx}`,
      coords: loc.coords,
      region: loc.region,
      affected: loc.baseAffected,
      location: loc.location,
      time: formatRelativeTime(timestamp),
      timestamp,
      provider: loc.provider,
    }
  })
}

function generateStableLatency(): LatencyPoint[] {
  if (stableLatency) {
    // Evolve existing latency slightly (±8% variation)
    return stableLatency.map(point => {
      const variation = (Math.random() - 0.5) * 0.16
      const newLatency = Math.floor(point.latency * (1 + variation))

      return {
        ...point,
        latency: Math.max(50, newLatency), // Minimum 50ms
        time: formatRelativeTime(point.timestamp),
      }
    })
  }

  // Initial generation with stable values
  return LATENCY_LOCATIONS.map((loc, idx) => {
    const minutesAgo = (idx + 1) * 3
    const timestamp = startTime - minutesAgo * 60 * 1000

    return {
      id: `latency-stable-${idx}`,
      coords: loc.coords,
      latency: loc.baseLatency,
      region: loc.region,
      location: loc.location,
      time: formatRelativeTime(timestamp),
      timestamp,
    }
  })
}

export async function fetchOutages(t0?: number, t1?: number): Promise<DataServiceResponse<Outage>> {
  // Simulate API call delay
  // Note: t0/t1 parameters unused as this generates demo data
  await new Promise(resolve => setTimeout(resolve, 250))

  stableOutages = generateStableOutages()

  console.log(`✅ Generated ${stableOutages.length} stable outages`)

  return {
    data: stableOutages,
    timestamp: Date.now(),
    cached: false,
  }
}

export async function fetchLatency(t0?: number, t1?: number): Promise<DataServiceResponse<LatencyPoint>> {
  // Simulate API call delay
  // Note: t0/t1 parameters unused as this generates demo data
  await new Promise(resolve => setTimeout(resolve, 200))

  stableLatency = generateStableLatency()

  console.log(`✅ Generated ${stableLatency.length} stable latency points`)

  return {
    data: stableLatency,
    timestamp: Date.now(),
    cached: false,
  }
}
