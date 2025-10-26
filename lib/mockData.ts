import { Earthquake, HazardPoint, Outage, LatencyArc, FragilityScore } from './types'

// Generate mock earthquake data (simulating USGS feed)
export function generateMockEarthquakes(count: number = 10): Earthquake[] {
  const earthquakes: Earthquake[] = []
  const now = Date.now()

  for (let i = 0; i < count; i++) {
    earthquakes.push({
      id: `eq_${Date.now()}_${i}`,
      magnitude: Math.random() * 6 + 2, // 2.0 - 8.0
      location: getRandomLocation(),
      depth: Math.random() * 100 + 5, // 5-105 km
      lat: Math.random() * 180 - 90,
      lon: Math.random() * 360 - 180,
      timestamp: now - Math.random() * 86400000, // last 24h
    })
  }

  return earthquakes.sort((a, b) => b.timestamp - a.timestamp)
}

// Generate mock hazard data (simulating NOAA/NASA GIBS)
export function generateMockHazards(count: number = 100): HazardPoint[] {
  const hazards: HazardPoint[] = []
  const now = Date.now()
  const types: ('wind' | 'precip' | 'temp')[] = ['wind', 'precip', 'temp']

  // Create clusters around storm-prone regions
  const stormRegions = [
    { lat: 25, lon: -80 }, // Caribbean
    { lat: 15, lon: 135 }, // West Pacific
    { lat: -15, lon: 160 }, // South Pacific
  ]

  stormRegions.forEach(region => {
    for (let i = 0; i < count / 3; i++) {
      hazards.push({
        lat: region.lat + (Math.random() - 0.5) * 20,
        lon: region.lon + (Math.random() - 0.5) * 20,
        intensity: Math.random() * 100,
        type: types[Math.floor(Math.random() * types.length)],
        timestamp: now,
      })
    }
  })

  return hazards
}

// Generate mock outage data (simulating Cloudflare Radar)
export function generateMockOutages(): Outage[] {
  const regions = [
    { region: 'North America', country: 'US' },
    { region: 'Europe', country: 'DE' },
    { region: 'Asia Pacific', country: 'JP' },
    { region: 'South America', country: 'BR' },
    { region: 'Middle East', country: 'AE' },
    { region: 'Africa', country: 'ZA' },
  ]

  const now = Date.now()

  return regions.map(r => ({
    region: r.region,
    country: r.country,
    severity: Math.random() * 80 + 10,
    affectedASNs: Math.floor(Math.random() * 50 + 5),
    timestamp: now,
  }))
}

// Generate mock latency arcs (simulating RIPE Atlas)
export function generateMockLatencyArcs(): LatencyArc[] {
  const nodes = [
    { lat: 40.7, lon: -74, name: 'New York' },
    { lat: 51.5, lon: -0.1, name: 'London' },
    { lat: 35.7, lon: 139.7, name: 'Tokyo' },
    { lat: -33.9, lon: 151.2, name: 'Sydney' },
    { lat: 1.3, lon: 103.8, name: 'Singapore' },
    { lat: 37.6, lon: -122.4, name: 'San Francisco' },
  ]

  const arcs: LatencyArc[] = []
  const now = Date.now()

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const distance = getDistance(nodes[i], nodes[j])
      arcs.push({
        from: nodes[i],
        to: nodes[j],
        latency: distance / 200 + Math.random() * 50, // rough estimate + jitter
        packetLoss: Math.random() * 2,
        timestamp: now,
      })
    }
  }

  return arcs
}

// Generate mock fragility scores
export function generateMockFragilityScores(): FragilityScore[] {
  const regions = [
    'North America',
    'South America',
    'Europe',
    'Africa',
    'Middle East',
    'Asia Pacific',
    'Oceania',
  ]

  return regions.map(region => ({
    region,
    hazard: Math.random() * 100,
    exposure: Math.random() * 100,
    resilience: Math.random() * 100,
    overall: 0, // will be calculated
  })).map(score => ({
    ...score,
    overall: (score.hazard * score.exposure * (100 - score.resilience)) / 10000,
  }))
}

// Helper functions
function getRandomLocation(): string {
  const locations = [
    'Near coast of California',
    'Pacific Ocean',
    'Japan region',
    'Southern Alaska',
    'Central Chile',
    'Indonesia',
    'Turkey',
    'New Zealand',
    'Peru',
    'Philippines',
  ]
  return locations[Math.floor(Math.random() * locations.length)]
}

function getDistance(a: { lat: number; lon: number }, b: { lat: number; lon: number }): number {
  const R = 6371 // Earth radius in km
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLon = ((b.lon - a.lon) * Math.PI) / 180
  const lat1 = (a.lat * Math.PI) / 180
  const lat2 = (b.lat * Math.PI) / 180

  const x = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2)
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x))

  return R * c
}
