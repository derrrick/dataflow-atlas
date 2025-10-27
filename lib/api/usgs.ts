/**
 * USGS Earthquake API Integration
 *
 * Fetches real-time earthquake data from USGS GeoJSON feeds
 * Update frequency: 1-5 minutes
 * API Docs: https://earthquake.usgs.gov/earthquakes/feed/v1.0/geojson.php
 */

import { UnifiedEvent } from '../supabase'

interface USGSFeature {
  type: 'Feature'
  properties: {
    mag: number
    place: string
    time: number
    updated: number
    tz: number | null
    url: string
    detail: string
    felt: number | null
    cdi: number | null
    mmi: number | null
    alert: string | null
    status: string
    tsunami: number
    sig: number
    net: string
    code: string
    ids: string
    sources: string
    types: string
    nst: number | null
    dmin: number | null
    rms: number
    gap: number | null
    magType: string
    type: string
    title: string
  }
  geometry: {
    type: 'Point'
    coordinates: [number, number, number] // [longitude, latitude, depth]
  }
  id: string
}

interface USGSResponse {
  type: 'FeatureCollection'
  metadata: {
    generated: number
    url: string
    title: string
    status: number
    api: string
    count: number
  }
  features: USGSFeature[]
  bbox: number[]
}

/**
 * Fetch earthquake data from USGS
 * @param timeframe - 'hour' | 'day' | 'week' | 'month'
 * @param magnitude - 'significant' | 'all' | '4.5' | '2.5' | '1.0'
 */
export async function fetchUSGSEarthquakes(
  timeframe: 'hour' | 'day' | 'week' | 'month' = 'day',
  magnitude: 'significant' | 'all' | '4.5' | '2.5' | '1.0' = 'all'
): Promise<UnifiedEvent[]> {
  const url = `https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/${magnitude}_${timeframe}.geojson`

  try {
    const response = await fetch(url, {
      next: { revalidate: 300 } // Cache for 5 minutes
    })

    if (!response.ok) {
      throw new Error(`USGS API error: ${response.status}`)
    }

    const data: USGSResponse = await response.json()

    // Transform USGS features to UnifiedEvent format
    const events: UnifiedEvent[] = data.features.map(feature => {
      const [lon, lat, depth] = feature.geometry.coordinates
      const magnitude = feature.properties.mag

      // Determine confidence based on USGS status
      let confidence: 'high' | 'medium' | 'low' = 'medium'
      if (feature.properties.status === 'reviewed') {
        confidence = 'high'
      } else if (feature.properties.status === 'automatic') {
        confidence = 'medium'
      } else {
        confidence = 'low'
      }

      // Color based on magnitude (red-orange scale)
      let color = '#FFD93D' // < 3.0 (yellow)
      if (magnitude >= 7.0) color = '#8B0000' // Dark red
      else if (magnitude >= 6.0) color = '#B22222' // Firebrick
      else if (magnitude >= 5.0) color = '#DC143C' // Crimson
      else if (magnitude >= 4.0) color = '#FF6B6B' // Red
      else if (magnitude >= 3.0) color = '#FF8C42' // Orange

      return {
        id: feature.id,
        timestamp: feature.properties.time,
        data_type: 'earthquake',
        primary_value: magnitude,
        secondary_value: depth,
        location: { lat, lon },
        confidence,
        source: 'USGS',
        color,
        metadata: {
          place: feature.properties.place,
          url: feature.properties.url,
          tsunami: feature.properties.tsunami === 1,
          felt: feature.properties.felt,
          significance: feature.properties.sig,
          magType: feature.properties.magType,
          alert: feature.properties.alert
        }
      }
    })

    return events
  } catch (error) {
    console.error('Error fetching USGS earthquake data:', error)
    return []
  }
}

/**
 * Get magnitude color for earthquake
 */
export function getEarthquakeColor(magnitude: number): string {
  if (magnitude >= 7.0) return '#8B0000' // Dark red - Major
  if (magnitude >= 6.0) return '#B22222' // Firebrick - Strong
  if (magnitude >= 5.0) return '#DC143C' // Crimson - Moderate
  if (magnitude >= 4.0) return '#FF6B6B' // Red - Light
  if (magnitude >= 3.0) return '#FF8C42' // Orange - Minor
  return '#FFD93D' // Yellow - Micro
}

/**
 * Get earthquake magnitude category
 */
export function getEarthquakeCategory(magnitude: number): string {
  if (magnitude >= 8.0) return 'Great'
  if (magnitude >= 7.0) return 'Major'
  if (magnitude >= 6.0) return 'Strong'
  if (magnitude >= 5.0) return 'Moderate'
  if (magnitude >= 4.0) return 'Light'
  if (magnitude >= 3.0) return 'Minor'
  return 'Micro'
}
