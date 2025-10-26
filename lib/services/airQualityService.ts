import { fetchWithCache, formatRelativeTime } from './apiClient'
import type { AirQuality, DataServiceResponse } from './dataTypes'

const OPENAQ_API_URL = 'https://api.openaq.org/v2/latest'

interface OpenAQMeasurement {
  parameter: string
  value: number
  lastUpdated: string
  unit: string
}

interface OpenAQLocation {
  id: number
  name: string
  city: string
  country: string
  coordinates: {
    latitude: number
    longitude: number
  }
  measurements: OpenAQMeasurement[]
}

interface OpenAQResponse {
  results: OpenAQLocation[]
}

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

// Generate demo air quality data
function generateDemoAirQuality(): AirQuality[] {
  const cities = [
    { coords: [34.05, -118.24] as [number, number], location: 'Los Angeles, USA', pm25: 45 },
    { coords: [39.91, 116.40] as [number, number], location: 'Beijing, China', pm25: 85 },
    { coords: [19.43, -99.13] as [number, number], location: 'Mexico City, Mexico', pm25: 62 },
    { coords: [28.61, 77.21] as [number, number], location: 'Delhi, India', pm25: 155 },
    { coords: [51.51, -0.13] as [number, number], location: 'London, UK', pm25: 28 },
    { coords: [35.68, 139.65] as [number, number], location: 'Tokyo, Japan', pm25: 18 },
  ]

  const now = Date.now()

  return cities.map((city, idx) => {
    const aqi = calculateAQI(city.pm25)
    return {
      id: `demo-aq-${idx}`,
      coords: city.coords,
      pm25: city.pm25,
      aqi,
      quality: getQualityCategory(aqi),
      location: city.location,
      time: formatRelativeTime(now - idx * 30 * 60 * 1000), // Stagger by 30 min
      timestamp: now - idx * 30 * 60 * 1000,
    }
  })
}

export async function fetchAirQuality(): Promise<DataServiceResponse<AirQuality>> {
  // Get major cities worldwide
  const params = new URLSearchParams({
    limit: '100',
    parameter: 'pm25',
    sort: 'desc',
    order_by: 'lastUpdated',
  })

  const url = `${OPENAQ_API_URL}?${params}`

  try {
    const { data, cached } = await fetchWithCache<OpenAQResponse>(
      url,
      {
        mode: 'cors',
        cache: 'no-cache',
      },
      5 * 60 * 1000 // 5 min cache
    )

    const airQuality: AirQuality[] = data.results
      .filter(location => {
        // Ensure we have valid coordinates and PM2.5 measurement
        const pm25Measurement = location.measurements.find(m => m.parameter === 'pm25')
        return (
          location.coordinates &&
          location.coordinates.latitude &&
          location.coordinates.longitude &&
          pm25Measurement &&
          pm25Measurement.value !== null
        )
      })
      .map((location, idx) => {
        const pm25Measurement = location.measurements.find(m => m.parameter === 'pm25')!
        const pm25 = Math.round(pm25Measurement.value * 10) / 10
        const aqi = calculateAQI(pm25)
        const timestamp = new Date(pm25Measurement.lastUpdated).getTime()

        return {
          id: `openaq-${location.id}`,
          coords: [
            location.coordinates.latitude,
            location.coordinates.longitude,
          ] as [number, number],
          pm25,
          aqi,
          quality: getQualityCategory(aqi),
          location: `${location.city}, ${location.country}`,
          time: formatRelativeTime(timestamp),
          timestamp,
        }
      })
      .slice(0, 50) // Limit to 50 stations

    return {
      data: airQuality.length > 0 ? airQuality : generateDemoAirQuality(),
      timestamp: Date.now(),
      cached,
    }
  } catch (error) {
    console.warn('⚠️ OpenAQ API unavailable. Using demo data.')
    console.warn('Error:', error)
    return {
      data: generateDemoAirQuality(),
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      cached: false,
    }
  }
}
