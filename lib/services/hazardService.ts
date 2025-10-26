import { formatRelativeTime } from './apiClient'
import type { Hazard, DataServiceResponse } from './dataTypes'

const HAZARD_LOCATIONS = [
  { coords: [25, -90] as [number, number], location: 'Gulf Coast', region: 'US', type: 'Storm', severity: 'Medium' as const },
  { coords: [15, 135] as [number, number], location: 'Philippines', region: 'APAC', type: 'Flood', severity: 'High' as const },
  { coords: [45, 10] as [number, number], location: 'Northern Italy', region: 'EU', type: 'Air Quality', severity: 'Low' as const },
  { coords: [-15, -48] as [number, number], location: 'Brazil', region: 'SA', type: 'Wildfire', severity: 'Medium' as const },
]

// Persistent state to maintain stable data across refreshes
let stableHazards: Hazard[] | null = null
const startTime = Date.now()

function generateStableHazards(): Hazard[] {
  if (stableHazards) {
    // Evolve existing data slightly
    return stableHazards.map(hazard => {
      // Vary affected population by ±5%
      const variation = (Math.random() - 0.5) * 0.1
      const newAffected = Math.floor(hazard.affected * (1 + variation))

      return {
        ...hazard,
        affected: newAffected,
        time: formatRelativeTime(hazard.timestamp),
      }
    })
  }

  // Initial generation with stable values
  return HAZARD_LOCATIONS.map((loc, idx) => {
    const hoursAgo = (idx + 1) * 2
    const timestamp = startTime - hoursAgo * 60 * 60 * 1000

    const baseAffected = loc.severity === 'High' ? 150000 : loc.severity === 'Medium' ? 45000 : 8000

    return {
      id: `hazard-stable-${idx}`,
      coords: loc.coords,
      severity: loc.severity,
      affected: baseAffected,
      location: loc.location,
      time: formatRelativeTime(timestamp),
      timestamp,
      type: loc.type,
    }
  })
}

export async function fetchHazards(): Promise<DataServiceResponse<Hazard>> {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 300))

  stableHazards = generateStableHazards()

  console.log(`✅ Generated ${stableHazards.length} stable hazards`)

  return {
    data: stableHazards,
    timestamp: Date.now(),
    cached: false,
  }
}
