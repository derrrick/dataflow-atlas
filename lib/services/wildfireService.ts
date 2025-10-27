import { formatRelativeTime } from './apiClient'
import type { Wildfire, DataServiceResponse } from './dataTypes'
import { getEventsByType } from '@/lib/supabase'

// NASA FIRMS API - requires API key (get from https://firms.modaps.eosdis.nasa.gov/api/area/)
// For now, we'll use demo data and can add the API key later
const NASA_FIRMS_API_URL = 'https://firms.modaps.eosdis.nasa.gov/api/area/csv'

interface FIRMSRecord {
  latitude: number
  longitude: number
  brightness: number
  scan: number
  track: number
  acq_date: string
  acq_time: string
  satellite: string
  confidence: number | string
  version: string
  bright_t31: number
  frp: number
  daynight: string
}

// Generate realistic demo wildfire data
function generateDemoWildfires(): Wildfire[] {
  const hotspots = [
    { coords: [-33.5, 150.8] as [number, number], location: 'New South Wales, Australia', brightness: 340 },
    { coords: [36.8, -119.7] as [number, number], location: 'California, USA', brightness: 325 },
    { coords: [-8.5, -55.2] as [number, number], location: 'Amazon, Brazil', brightness: 315 },
    { coords: [42.5, -122.8] as [number, number], location: 'Oregon, USA', brightness: 330 },
    { coords: [38.5, 27.8] as [number, number], location: 'Western Turkey', brightness: 310 },
    { coords: [40.2, -8.2] as [number, number], location: 'Central Portugal', brightness: 320 },
    { coords: [-15.8, -47.9] as [number, number], location: 'Cerrado, Brazil', brightness: 305 },
  ]

  const now = Date.now()
  const satellites: Wildfire['satellite'][] = ['MODIS', 'VIIRS', 'MODIS', 'VIIRS', 'MODIS', 'VIIRS', 'MODIS']

  return hotspots.map((hotspot, idx) => {
    const hoursAgo = idx * 2 + Math.floor(Math.random() * 3)
    const timestamp = now - hoursAgo * 60 * 60 * 1000

    return {
      id: `demo-fire-${idx}`,
      coords: hotspot.coords,
      brightness: hotspot.brightness + Math.floor(Math.random() * 20) - 10,
      confidence: 70 + Math.floor(Math.random() * 30), // 70-100
      scan: 0.5 + Math.random() * 1.5, // 0.5-2.0 degrees
      location: hotspot.location,
      time: formatRelativeTime(timestamp),
      timestamp,
      satellite: satellites[idx],
    }
  })
}

// Parse CSV data from FIRMS
function parseFIRMSCSV(csvText: string): FIRMSRecord[] {
  const lines = csvText.trim().split('\n')
  if (lines.length < 2) return []

  const headers = lines[0].split(',').map(h => h.trim())
  const records: FIRMSRecord[] = []

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',')
    if (values.length !== headers.length) continue

    const record: any = {}
    headers.forEach((header, idx) => {
      const value = values[idx].trim()
      // Convert numeric fields
      if (['latitude', 'longitude', 'brightness', 'scan', 'track', 'bright_t31', 'frp'].includes(header)) {
        record[header] = parseFloat(value)
      } else if (header === 'confidence') {
        // Confidence can be numeric or string (for VIIRS: 'l', 'n', 'h')
        record[header] = isNaN(parseFloat(value)) ? value : parseFloat(value)
      } else {
        record[header] = value
      }
    })
    records.push(record as FIRMSRecord)
  }

  return records
}

export async function fetchWildfires(apiKey?: string): Promise<DataServiceResponse<Wildfire>> {
  try {
    // Fetch real wildfire data from Supabase
    const events = await getEventsByType('wildfire')

    const wildfires: Wildfire[] = events
      .map(event => {
        const brightness = event.metadata?.brightness || 300 + event.primary_value * 10
        const confidence = event.confidence === 'high' ? 90 : event.confidence === 'medium' ? 60 : 30

        return {
          id: event.id,
          coords: [event.location.lat, event.location.lon] as [number, number],
          brightness: Math.round(brightness),
          confidence,
          scan: event.metadata?.scan_size || 1.0,
          location: event.metadata?.name || `${event.location.lat.toFixed(2)}, ${event.location.lon.toFixed(2)}`,
          time: formatRelativeTime(event.timestamp),
          timestamp: event.timestamp,
          satellite: (event.metadata?.instrument === 'VIIRS' ? 'VIIRS' : 'MODIS') as 'VIIRS' | 'MODIS',
        }
      })
      .slice(0, 50) // Limit to 50 fire detections

    console.log(`✅ Fetched ${wildfires.length} real wildfire detections from Supabase`)

    return {
      data: wildfires.length > 0 ? wildfires : generateDemoWildfires(),
      timestamp: Date.now(),
      cached: false,
    }
  } catch (error) {
    console.warn('⚠️ Supabase unavailable. Using demo wildfire data.')
    return {
      data: generateDemoWildfires(),
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      cached: false,
    }
  }
}
