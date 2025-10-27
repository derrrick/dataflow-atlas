import { formatRelativeTime } from './apiClient'
import type { SevereWeather, DataServiceResponse } from './dataTypes'
import { getRecentEventsByType } from '@/lib/supabase'

export async function fetchSevereWeather(): Promise<DataServiceResponse<SevereWeather>> {
  try {
    // Fetch real severe weather data from Supabase (last 72 hours)
    const events = await getRecentEventsByType('severe_weather', 72)

    const weather: SevereWeather[] = events
      .map(event => {
        return {
          id: event.id,
          coords: [event.location.lat, event.location.lon] as [number, number],
          event: event.metadata?.event || 'Weather Alert',
          severity: event.metadata?.severity || 'Unknown',
          urgency: event.metadata?.urgency || 'Unknown',
          certainty: event.metadata?.certainty,
          headline: event.metadata?.headline || event.metadata?.event || 'Weather Alert',
          description: event.metadata?.description,
          instruction: event.metadata?.instruction,
          areaDesc: event.metadata?.areaDesc,
          location: event.metadata?.areaDesc || `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
          expires: event.metadata?.expires || new Date(event.timestamp + 3600000).toISOString(),
        }
      })

    console.log(`✅ Fetched ${weather.length} real severe weather alerts from Supabase`)

    return {
      data: weather,
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
