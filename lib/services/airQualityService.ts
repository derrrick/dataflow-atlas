import { formatRelativeTime } from './apiClient'
import type { AirQuality, DataServiceResponse } from './dataTypes'
import { getRecentEventsByType } from '@/lib/supabase'

// Calculate AQI from PM2.5 concentration
function calculateAQI(pm25: number): number {
  // US EPA AQI breakpoints for PM2.5
  if (pm25 <= 12.0) return Math.round((50 / 12.0) * pm25)
  if (pm25 <= 35.4) return Math.round(((100 - 51) / (35.4 - 12.1)) * (pm25 - 12.1) + 51)
  if (pm25 <= 55.4) return Math.round(((150 - 101) / (55.4 - 35.5)) * (pm25 - 35.5) + 101)
  if (pm25 <= 150.4) return Math.round(((200 - 151) / (150.4 - 55.5)) * (pm25 - 55.5) + 151)
  if (pm25 <= 250.4) return Math.round(((300 - 201) / (250.4 - 150.5)) * (pm25 - 150.5) + 201)
  return Math.round(((500 - 301) / (500.4 - 250.5)) * (pm25 - 250.5) + 301)
}

// Get quality category from AQI
function getQualityCategory(aqi: number): AirQuality['quality'] {
  if (aqi <= 50) return 'Good'
  if (aqi <= 100) return 'Moderate'
  if (aqi <= 150) return 'Unhealthy for Sensitive Groups'
  if (aqi <= 200) return 'Unhealthy'
  if (aqi <= 300) return 'Very Unhealthy'
  return 'Hazardous'
}

export async function fetchAirQuality(): Promise<DataServiceResponse<AirQuality>> {
  try {
    // Fetch real air quality data from Supabase (last 72 hours)
    const events = await getRecentEventsByType('air_quality', 72)

    const airQuality: AirQuality[] = events
      .map(event => {
        const aqi = Math.round(event.primary_value)
        const pm25 = event.secondary_value || null

        return {
          id: event.id,
          coords: [event.location.lat, event.location.lon] as [number, number],
          pm25: pm25 ? Math.round(pm25 * 10) / 10 : undefined,
          aqi,
          quality: getQualityCategory(aqi),
          location: event.metadata?.city
            ? `${event.metadata.city}${event.metadata.state ? ', ' + event.metadata.state : ''}`
            : `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
        }
      })

    console.log(`✅ Fetched ${airQuality.length} real air quality observations from Supabase`)

    return {
      data: airQuality,
      timestamp: Date.now(),
      cached: false,
    }
  } catch (error) {
    console.warn('⚠️ Supabase unavailable. Returning empty data.')
    console.warn('Error:', error)
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      cached: false,
    }
  }
}
