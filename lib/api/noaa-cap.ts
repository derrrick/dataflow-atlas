/**
 * NOAA NWS CAP (Common Alerting Protocol) API Integration
 *
 * Fetches active weather alerts from NOAA National Weather Service
 * Update frequency: Hourly (alerts update in real-time)
 * API Docs: https://www.weather.gov/documentation/services-web-api
 */

import { UnifiedEvent } from '../supabase'

interface NOAAAlert {
  id: string
  type: 'Feature'
  geometry: {
    type: 'Polygon' | 'Point' | null
    coordinates: number[][][] | number[] | null
  }
  properties: {
    '@id': string
    id: string
    areaDesc: string
    geocode: {
      SAME: string[]
      UGC: string[]
    }
    affectedZones: string[]
    sent: string
    effective: string
    onset: string
    expires: string
    ends: string | null
    status: string
    messageType: string
    category: string
    severity: 'Extreme' | 'Severe' | 'Moderate' | 'Minor' | 'Unknown'
    certainty: 'Observed' | 'Likely' | 'Possible' | 'Unlikely' | 'Unknown'
    urgency: 'Immediate' | 'Expected' | 'Future' | 'Past' | 'Unknown'
    event: string
    sender: string
    senderName: string
    headline: string | null
    description: string
    instruction: string | null
    response: string
    parameters: Record<string, string[]>
  }
}

interface NOAAResponse {
  '@context': any[]
  type: 'FeatureCollection'
  features: NOAAAlert[]
  title: string
  updated: string
}

/**
 * Fetch active weather alerts from NOAA NWS
 */
export async function fetchNOAAWeatherAlerts(): Promise<UnifiedEvent[]> {
  const url = 'https://api.weather.gov/alerts/active'

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'DataflowAtlas/1.0 (contact@dataflowatlas.org)' // NOAA requires User-Agent
      },
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`NOAA API error: ${response.status}`)
    }

    const data: NOAAResponse = await response.json()

    // Transform NOAA alerts to UnifiedEvent format
    const events: UnifiedEvent[] = data.features
      .filter(alert => {
        // Only include severe weather events (exclude test messages, etc.)
        return (
          alert.properties.status === 'Actual' &&
          alert.properties.messageType !== 'Cancel' &&
          (alert.properties.severity === 'Severe' || alert.properties.severity === 'Extreme' || alert.properties.severity === 'Moderate')
        )
      })
      .map(alert => {
        // Extract center point from geometry
        const location = extractCenterPoint(alert.geometry)

        // Determine confidence based on certainty
        let confidence: 'high' | 'medium' | 'low' = 'medium'
        if (alert.properties.certainty === 'Observed') confidence = 'high'
        else if (alert.properties.certainty === 'Likely') confidence = 'high'
        else if (alert.properties.certainty === 'Possible') confidence = 'medium'
        else confidence = 'low'

        // Color based on severity
        const color = getAlertColor(alert.properties.severity, alert.properties.event)

        // Numeric severity for primary_value
        const severityScore = getSeverityScore(alert.properties.severity, alert.properties.urgency)

        return {
          id: alert.id,
          timestamp: new Date(alert.properties.sent).getTime(),
          data_type: 'severe_weather',
          primary_value: severityScore,
          secondary_value: alert.properties.urgency === 'Immediate' ? 1 : 0,
          location,
          confidence,
          source: 'NOAA NWS',
          color,
          metadata: {
            event: alert.properties.event,
            headline: alert.properties.headline,
            description: alert.properties.description,
            instruction: alert.properties.instruction,
            severity: alert.properties.severity,
            urgency: alert.properties.urgency,
            certainty: alert.properties.certainty,
            areaDesc: alert.properties.areaDesc,
            expires: alert.properties.expires,
            senderName: alert.properties.senderName
          }
        }
      })

    return events
  } catch (error) {
    console.error('Error fetching NOAA weather alert data:', error)
    return []
  }
}

/**
 * Extract center point from NOAA geometry
 */
function extractCenterPoint(geometry: NOAAAlert['geometry']): { lat: number; lon: number } {
  if (!geometry || !geometry.coordinates) {
    // Default to US center if no geometry
    return { lat: 39.8283, lon: -98.5795 }
  }

  if (geometry.type === 'Point') {
    const [lon, lat] = geometry.coordinates as number[]
    return { lat, lon }
  }

  if (geometry.type === 'Polygon') {
    // Calculate centroid of polygon
    const coords = (geometry.coordinates as number[][][])[0]
    if (!coords || coords.length === 0) {
      return { lat: 39.8283, lon: -98.5795 }
    }

    let sumLon = 0
    let sumLat = 0
    for (const [lon, lat] of coords) {
      sumLon += lon
      sumLat += lat
    }

    return {
      lat: sumLat / coords.length,
      lon: sumLon / coords.length
    }
  }

  return { lat: 39.8283, lon: -98.5795 }
}

/**
 * Get color based on alert severity and type
 */
function getAlertColor(severity: string, eventType: string): string {
  // Tornado warnings are always dark red
  if (eventType.toLowerCase().includes('tornado')) {
    return '#8B0000' // Dark red
  }

  // Hurricane/typhoon warnings
  if (eventType.toLowerCase().includes('hurricane') || eventType.toLowerCase().includes('typhoon')) {
    return '#800080' // Purple
  }

  // Flood warnings
  if (eventType.toLowerCase().includes('flood')) {
    return '#4169E1' // Royal blue
  }

  // Fire/heat warnings
  if (eventType.toLowerCase().includes('fire') || eventType.toLowerCase().includes('heat')) {
    return '#FF4500' // Orange red
  }

  // Severity-based colors for other events
  switch (severity) {
    case 'Extreme':
      return '#8B0000' // Dark red
    case 'Severe':
      return '#DC143C' // Crimson
    case 'Moderate':
      return '#FF8C42' // Orange
    case 'Minor':
      return '#FFD93D' // Yellow
    default:
      return '#8F9BB0' // Gray
  }
}

/**
 * Get numeric severity score
 */
function getSeverityScore(severity: string, urgency: string): number {
  let score = 0

  // Base score from severity
  switch (severity) {
    case 'Extreme': score += 100; break
    case 'Severe': score += 75; break
    case 'Moderate': score += 50; break
    case 'Minor': score += 25; break
    default: score += 10
  }

  // Urgency bonus
  switch (urgency) {
    case 'Immediate': score += 50; break
    case 'Expected': score += 25; break
    case 'Future': score += 10; break
    default: score += 0
  }

  return score
}

/**
 * Get weather alert category
 */
export function getWeatherCategory(event: string): string {
  const lower = event.toLowerCase()

  if (lower.includes('tornado')) return 'Tornado'
  if (lower.includes('hurricane') || lower.includes('typhoon')) return 'Hurricane'
  if (lower.includes('flood')) return 'Flood'
  if (lower.includes('fire')) return 'Fire Weather'
  if (lower.includes('snow') || lower.includes('blizzard')) return 'Winter Storm'
  if (lower.includes('thunderstorm') || lower.includes('severe')) return 'Severe Thunderstorm'
  if (lower.includes('heat')) return 'Excessive Heat'
  if (lower.includes('wind')) return 'High Wind'

  return 'Weather Alert'
}
