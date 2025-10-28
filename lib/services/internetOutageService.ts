import { formatRelativeTime } from './apiClient'
import type { InternetOutage, DataServiceResponse } from './dataTypes'
import { getRecentEventsByType } from '@/lib/supabase'

export async function fetchInternetOutages(t0?: number, t1?: number): Promise<DataServiceResponse<InternetOutage>> {
  try {
    // Fetch real internet outage data from Supabase
    const events = await getRecentEventsByType('internet_outage', t0 && t1 ? { t0, t1 } : { hoursBack: 720 }) // 30 days * 24 hours

    const outages: InternetOutage[] = events
      .map(event => {
        const metadata = event.metadata || {}

        return {
          id: event.id,
          coords: [event.location.lat, event.location.lon] as [number, number],
          country: metadata.country_code || 'UNKNOWN',
          description: metadata.description || 'Internet outage detected',
          cause: metadata.cause || 'UNKNOWN',
          type: metadata.type || 'UNKNOWN',
          isps: metadata.isps || [],
          asns: metadata.asns || [],
          location: metadata.location || event.metadata?.place || `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
          startDate: metadata.start_date || event.timestamp.toString(),
          endDate: metadata.end_date || null,
        }
      })

    console.log(`✅ Fetched ${outages.length} real internet outages from Supabase`)

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
