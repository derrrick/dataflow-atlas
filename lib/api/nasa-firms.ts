/**
 * NASA FIRMS (Fire Information for Resource Management System) API Integration
 *
 * Fetches active fire/wildfire data from NASA's MODIS and VIIRS satellites
 * Update frequency: Near real-time (3-6 hours)
 * API Docs: https://firms.modaps.eosdis.nasa.gov/api/
 *
 * Note: Requires free NASA FIRMS API key
 * Get one at: https://firms.modaps.eosdis.nasa.gov/api/area/
 */

import { UnifiedEvent } from '../supabase'

interface FIRMSFeature {
  latitude: number
  longitude: number
  bright_ti4: number // Brightness temperature (Kelvin)
  scan: number // Pixel size (km)
  track: number // Along-scan size (km)
  acq_date: string // YYYY-MM-DD
  acq_time: string // HHMM
  satellite: string // 'N' (NOAA) | 'T' (Terra) | 'A' (Aqua)
  instrument: string // 'VIIRS' | 'MODIS'
  confidence: string // 'l' | 'n' | 'h' (low, nominal, high)
  version: string
  bright_ti5: number
  frp: number // Fire Radiative Power (MW)
  daynight: 'D' | 'N'
}

/**
 * Fetch active fire data from NASA FIRMS
 * @param apiKey - NASA FIRMS API key
 * @param source - 'VIIRS_SNPP_NRT' | 'MODIS_NRT' | 'VIIRS_NOAA20_NRT'
 * @param area - Geographic area (world, USA, etc)
 * @param dayRange - Number of days (1, 7, 10)
 */
export async function fetchNASAFires(
  apiKey: string,
  source: 'VIIRS_SNPP_NRT' | 'MODIS_NRT' | 'VIIRS_NOAA20_NRT' = 'VIIRS_SNPP_NRT',
  area: string = 'WORLD',
  dayRange: number = 1
): Promise<UnifiedEvent[]> {
  if (!apiKey) {
    console.error('NASA FIRMS API key is required')
    return []
  }

  const url = `https://firms.modaps.eosdis.nasa.gov/api/area/csv/${apiKey}/${source}/${area}/${dayRange}`

  try {
    const response = await fetch(url, {
      cache: 'no-store' // Disable cache - response can be >2MB for multi-day queries
    })

    if (!response.ok) {
      throw new Error(`NASA FIRMS API error: ${response.status}`)
    }

    const csvText = await response.text()
    const lines = csvText.trim().split('\n')
    const headers = lines[0].split(',')

    // Parse CSV to objects
    const fires: FIRMSFeature[] = lines.slice(1).map(line => {
      const values = line.split(',')
      const obj: any = {}
      headers.forEach((header, i) => {
        obj[header.trim()] = values[i]?.trim()
      })
      return obj as FIRMSFeature
    })

    // Transform to UnifiedEvent format
    const events: UnifiedEvent[] = fires.map(fire => {
      const lat = parseFloat(fire.latitude as any)
      const lon = parseFloat(fire.longitude as any)
      const brightness = parseFloat(fire.bright_ti4 as any)
      const frp = parseFloat(fire.frp as any)

      // Parse timestamp from date + time
      const dateTime = `${fire.acq_date}T${fire.acq_time.padStart(4, '0').slice(0, 2)}:${fire.acq_time.padStart(4, '0').slice(2)}:00Z`
      const timestamp = new Date(dateTime).getTime()

      // Map confidence
      let confidence: 'high' | 'medium' | 'low'
      if (fire.confidence === 'h') confidence = 'high'
      else if (fire.confidence === 'n') confidence = 'medium'
      else confidence = 'low'

      // Intensity based on FRP (Fire Radiative Power)
      // FRP typically ranges from 0-500 MW, scale to 0-10
      const intensity = Math.min(10, frp / 50)

      // Color based on intensity
      let color = '#FFD93D' // Low (yellow)
      if (intensity >= 8) color = '#8B0000' // Extreme (dark red)
      else if (intensity >= 6) color = '#DC143C' // Very high (crimson)
      else if (intensity >= 4) color = '#FF6B6B' // High (red)
      else if (intensity >= 2) color = '#FF8C42' // Moderate (orange)

      const id = `nasa_firms_${lat.toFixed(4)}_${lon.toFixed(4)}_${timestamp}`

      return {
        id,
        timestamp,
        data_type: 'wildfire',
        primary_value: intensity,
        secondary_value: frp,
        location: { lat, lon },
        confidence,
        source: 'NASA FIRMS',
        color,
        metadata: {
          brightness: brightness,
          frp: frp,
          satellite: fire.satellite,
          instrument: fire.instrument,
          daynight: fire.daynight,
          scan_size: parseFloat(fire.scan as any),
          track_size: parseFloat(fire.track as any)
        }
      }
    })

    return events
  } catch (error) {
    console.error('Error fetching NASA FIRMS fire data:', error)
    return []
  }
}

/**
 * Get fire intensity color based on FRP
 */
export function getFireColor(frp: number): string {
  const intensity = Math.min(10, frp / 50)
  if (intensity >= 8) return '#8B0000' // Extreme
  if (intensity >= 6) return '#DC143C' // Very high
  if (intensity >= 4) return '#FF6B6B' // High
  if (intensity >= 2) return '#FF8C42' // Moderate
  return '#FFD93D' // Low
}

/**
 * Get fire intensity category
 */
export function getFireCategory(frp: number): string {
  const intensity = Math.min(10, frp / 50)
  if (intensity >= 8) return 'Extreme'
  if (intensity >= 6) return 'Very High'
  if (intensity >= 4) return 'High'
  if (intensity >= 2) return 'Moderate'
  return 'Low'
}
