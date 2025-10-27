/**
 * AirNow API Integration
 *
 * Fetches real-time air quality data from EPA's AirNow system
 * Update frequency: Hourly
 * API Docs: https://docs.airnowapi.org/
 *
 * Note: Requires free AirNow API key
 * Get one at: https://docs.airnowapi.org/account/request/
 */

import { UnifiedEvent } from '../supabase'

interface AirNowObservation {
  DateObserved: string // YYYY-MM-DD
  HourObserved: number // 0-23
  LocalTimeZone: string // e.g., "EST"
  ReportingArea: string // City name
  StateCode: string // 2-letter state code
  Latitude: number
  Longitude: number
  ParameterName: string // "O3" | "PM2.5" | "PM10"
  AQI: number // Air Quality Index (0-500)
  Category: {
    Number: number // 1-6
    Name: string // "Good" | "Moderate" | "Unhealthy for Sensitive Groups" | "Unhealthy" | "Very Unhealthy" | "Hazardous"
  }
}

/**
 * Major US cities to query for air quality
 */
const US_CITIES = [
  { lat: 40.7128, lon: -74.0060, name: 'New York' },
  { lat: 34.0522, lon: -118.2437, name: 'Los Angeles' },
  { lat: 41.8781, lon: -87.6298, name: 'Chicago' },
  { lat: 29.7604, lon: -95.3698, name: 'Houston' },
  { lat: 33.4484, lon: -112.0740, name: 'Phoenix' },
  { lat: 39.7392, lon: -104.9903, name: 'Denver' },
  { lat: 47.6062, lon: -122.3321, name: 'Seattle' },
  { lat: 37.7749, lon: -122.4194, name: 'San Francisco' },
  { lat: 25.7617, lon: -80.1918, name: 'Miami' },
  { lat: 42.3601, lon: -71.0589, name: 'Boston' },
]

/**
 * Fetch current air quality observations from AirNow
 * @param apiKey - AirNow API key
 */
export async function fetchAirNowData(apiKey: string): Promise<UnifiedEvent[]> {
  if (!apiKey) {
    console.error('AirNow API key is required')
    return []
  }

  const allObservations: AirNowObservation[] = []

  // Query multiple cities in parallel for better US coverage
  const promises = US_CITIES.map(async city => {
    const url = `https://www.airnowapi.org/aq/observation/latLong/current/?format=application/json&latitude=${city.lat}&longitude=${city.lon}&distance=100&API_KEY=${apiKey}`

    try {
      const response = await fetch(url, {
        next: { revalidate: 3600 } // Cache for 1 hour
      })

      if (!response.ok) {
        console.warn(`AirNow API error for ${city.name}: ${response.status}`)
        return []
      }

      return await response.json() as AirNowObservation[]
    } catch (error) {
      console.error(`Error fetching air quality for ${city.name}:`, error)
      return []
    }
  })

  const results = await Promise.all(promises)
  results.forEach(obs => allObservations.push(...obs))

  // Group by location and keep highest AQI per location
  const locationMap = new Map<string, AirNowObservation>()
  allObservations.forEach(obs => {
      const key = `${obs.Latitude.toFixed(2)}_${obs.Longitude.toFixed(2)}`
      const existing = locationMap.get(key)
      if (!existing || obs.AQI > existing.AQI) {
        locationMap.set(key, obs)
      }
    })

    // Transform to UnifiedEvent format
    const events: UnifiedEvent[] = Array.from(locationMap.values()).map(obs => {
      const lat = obs.Latitude
      const lon = obs.Longitude
      const aqi = obs.AQI

      // Parse timestamp
      const dateTime = `${obs.DateObserved}T${obs.HourObserved.toString().padStart(2, '0')}:00:00`
      const timestamp = new Date(dateTime).getTime()

      // Confidence based on parameter (PM2.5 is most reliable)
      let confidence: 'high' | 'medium' | 'low' = 'medium'
      if (obs.ParameterName === 'PM2.5') confidence = 'high'
      else if (obs.ParameterName === 'O3') confidence = 'medium'
      else confidence = 'low'

      // Color based on AQI category
      let color = '#00E400' // Good (0-50)
      if (aqi >= 301) color = '#7E0023' // Hazardous (301+)
      else if (aqi >= 201) color = '#99004C' // Very Unhealthy (201-300)
      else if (aqi >= 151) color = '#FF0000' // Unhealthy (151-200)
      else if (aqi >= 101) color = '#FF7E00' // Unhealthy for Sensitive (101-150)
      else if (aqi >= 51) color = '#FFFF00' // Moderate (51-100)

      // PM2.5 concentration (approximate from AQI)
      let pm25: number | undefined
      if (obs.ParameterName === 'PM2.5') {
        pm25 = aqiToPM25(aqi)
      }

      const id = `airnow_${lat.toFixed(2)}_${lon.toFixed(2)}_${timestamp}`

      return {
        id,
        timestamp,
        data_type: 'air_quality',
        primary_value: aqi,
        secondary_value: pm25,
        location: { lat, lon },
        confidence,
        source: 'AirNow',
        color,
        metadata: {
          city: obs.ReportingArea,
          state: obs.StateCode,
          parameter: obs.ParameterName,
          category: obs.Category.Name,
          categoryNumber: obs.Category.Number
        }
      }
    })

    return events
  } catch (error) {
    console.error('Error fetching AirNow data:', error)
    return []
  }
}

/**
 * Convert AQI to approximate PM2.5 concentration (μg/m³)
 * Based on EPA breakpoints
 */
function aqiToPM25(aqi: number): number {
  if (aqi <= 50) return (aqi / 50) * 12.0
  if (aqi <= 100) return 12.0 + ((aqi - 50) / 50) * 23.4
  if (aqi <= 150) return 35.4 + ((aqi - 100) / 50) * 19.1
  if (aqi <= 200) return 55.4 + ((aqi - 150) / 50) * 94.6
  if (aqi <= 300) return 150.4 + ((aqi - 200) / 100) * 99.6
  return 250.4 + ((aqi - 300) / 200) * 249.6
}

/**
 * Get AQI color
 */
export function getAQIColor(aqi: number): string {
  if (aqi >= 301) return '#7E0023' // Hazardous
  if (aqi >= 201) return '#99004C' // Very Unhealthy
  if (aqi >= 151) return '#FF0000' // Unhealthy
  if (aqi >= 101) return '#FF7E00' // Unhealthy for Sensitive
  if (aqi >= 51) return '#FFFF00' // Moderate
  return '#00E400' // Good
}

/**
 * Get AQI category name
 */
export function getAQICategory(aqi: number): string {
  if (aqi >= 301) return 'Hazardous'
  if (aqi >= 201) return 'Very Unhealthy'
  if (aqi >= 151) return 'Unhealthy'
  if (aqi >= 101) return 'Unhealthy for Sensitive Groups'
  if (aqi >= 51) return 'Moderate'
  return 'Good'
}
