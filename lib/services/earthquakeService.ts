import { formatRelativeTime } from './apiClient'
import type { Earthquake, DataServiceResponse } from './dataTypes'
import { getRecentEventsByType } from '@/lib/supabase'

export async function fetchEarthquakes(): Promise<DataServiceResponse<Earthquake>> {
  try {
    // Fetch real earthquake data from Supabase (last 72 hours)
    const events = await getRecentEventsByType('earthquake', 72)

    const earthquakes: Earthquake[] = events
      .map(event => {
        return {
          id: event.id,
          coords: [event.location.lat, event.location.lon] as [number, number],
          magnitude: Math.round(event.primary_value * 10) / 10,
          depth: Math.round(event.secondary_value || 0),
          location: event.metadata?.place || `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
        }
      })

    console.log(`✅ Fetched ${earthquakes.length} real earthquakes from Supabase`)

    return {
      data: earthquakes,
      timestamp: Date.now(),
      cached: false,
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.warn('⚠️ Supabase unavailable. Returning empty data.')

    return {
      data: [],
      error: errorMessage,
      timestamp: Date.now(),
      cached: false,
    }
  }
}
