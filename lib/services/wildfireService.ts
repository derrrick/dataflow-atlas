import { fetchWithCache, formatRelativeTime } from './apiClient'
import type { Wildfire, DataServiceResponse } from './dataTypes'

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
  // For demo purposes, return demo data unless API key is provided
  if (!apiKey) {
    console.warn('⚠️ NASA FIRMS API key not configured. Using demo wildfire data.')
    console.warn('To use live data, get an API key from: https://firms.modaps.eosdis.nasa.gov/api/')
    return {
      data: generateDemoWildfires(),
      timestamp: Date.now(),
      cached: false,
    }
  }

  // Fetch last 24 hours of active fires worldwide using MODIS
  const params = new URLSearchParams({
    MAP_KEY: apiKey,
    source: 'MODIS_NRT', // Near real-time MODIS data
    day: '1', // Last 24 hours
    date: new Date().toISOString().split('T')[0], // Today's date
  })

  const url = `${NASA_FIRMS_API_URL}?${params}`

  try {
    const response = await fetch(url, {
      mode: 'cors',
      cache: 'no-cache',
    })

    if (!response.ok) {
      throw new Error(`FIRMS API error: ${response.status}`)
    }

    const csvText = await response.text()
    const records = parseFIRMSCSV(csvText)

    const wildfires: Wildfire[] = records
      .filter(record => {
        // Filter for high-confidence detections
        const confidence = typeof record.confidence === 'number'
          ? record.confidence
          : record.confidence === 'h' ? 100 : record.confidence === 'n' ? 50 : 0
        return confidence >= 50 && record.frp > 5 // Fire radiative power > 5 MW
      })
      .map((record, idx) => {
        const timestamp = new Date(`${record.acq_date}T${record.acq_time}`).getTime()
        const confidence = typeof record.confidence === 'number'
          ? record.confidence
          : record.confidence === 'h' ? 100 : record.confidence === 'n' ? 50 : 0

        return {
          id: `firms-${record.satellite}-${idx}-${timestamp}`,
          coords: [record.latitude, record.longitude] as [number, number],
          brightness: Math.round(record.brightness),
          confidence,
          scan: Math.round(record.scan * 100) / 100,
          location: `Lat: ${record.latitude.toFixed(2)}, Lon: ${record.longitude.toFixed(2)}`,
          time: formatRelativeTime(timestamp),
          timestamp,
          satellite: record.satellite.includes('Aqua') || record.satellite.includes('Terra')
            ? 'MODIS'
            : record.satellite.includes('VIIRS')
            ? 'VIIRS'
            : 'Unknown',
        }
      })
      .slice(0, 100) // Limit to 100 most recent fires

    return {
      data: wildfires.length > 0 ? wildfires : generateDemoWildfires(),
      timestamp: Date.now(),
      cached: false,
    }
  } catch (error) {
    console.warn('⚠️ NASA FIRMS API unavailable. Using demo data.')
    console.warn('Error:', error)
    return {
      data: generateDemoWildfires(),
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: Date.now(),
      cached: false,
    }
  }
}
