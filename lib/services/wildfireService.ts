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

    console.log(`✅ Fetched ${wildfires.length} real wildfire detections from Supabase`)

    return {
      data: wildfires,
      timestamp: Date.now(),
      cached: false,
    }
  } catch (error) {
    console.warn('⚠️ Supabase unavailable. Returning empty data.')
    return {
      data: [],
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      cached: false,
    }
  }
}
