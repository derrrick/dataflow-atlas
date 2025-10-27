import { formatRelativeTime } from './apiClient'
import type { PowerOutage, DataServiceResponse } from './dataTypes'
import { getEventsByType } from '@/lib/supabase'

export async function fetchPowerOutages(): Promise<DataServiceResponse<PowerOutage>> {
  try {
    // Fetch real power outage data from Supabase
    const events = await getEventsByType('power_outage')

    const outages: PowerOutage[] = events
      .map(event => {
        return {
          id: event.id,
          coords: [event.location.lat, event.location.lon] as [number, number],
          customers_out: Math.round(event.primary_value),
          percentage_out: Math.round((event.secondary_value || 0) * 100) / 100,
          state: event.metadata?.state || 'Unknown',
          location: event.metadata?.state || `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
          severity: event.metadata?.severity || 'Minor',
        }
      })
      .slice(0, 20) // Limit to 20 most recent

    console.log(`✅ Fetched ${outages.length} real power outages from Supabase`)

    return {
      data: outages,
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
