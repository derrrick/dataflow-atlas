/**
 * Power Outage Data API Integration
 *
 * Fetches power outage data from EIA (U.S. Energy Information Administration)
 * Updates: 10-15 minutes (varies by utility)
 * Coverage: United States
 */

import type { UnifiedEvent } from '@/lib/supabase'

const EIA_API_KEY = process.env.EIA_API_KEY
const EIA_BASE_URL = 'https://api.eia.gov/v2'

interface EIAOutageResponse {
  response: {
    data: Array<{
      period: string
      stateid: string
      statename: string
      'respondent-name': string
      'type-name': string
      value: number
      'value-units': string
    }>
  }
}

/**
 * Get approximate state center coordinates
 */
function getStateCoordinates(state: string): { lat: number; lon: number } {
  const coords: Record<string, { lat: number; lon: number }> = {
    'CA': { lat: 36.7783, lon: -119.4179 },
    'TX': { lat: 31.9686, lon: -99.9018 },
    'FL': { lat: 27.9944, lon: -81.7603 },
    'NY': { lat: 43.0, lon: -75.0 },
    'PA': { lat: 41.2033, lon: -77.1945 },
    'IL': { lat: 40.0, lon: -89.0 },
    'OH': { lat: 40.2, lon: -82.7 },
    'GA': { lat: 32.6, lon: -83.4 },
    'NC': { lat: 35.7, lon: -79.0 },
    'MI': { lat: 44.3, lon: -85.6 },
    'WA': { lat: 47.7511, lon: -120.7401 },
    'AZ': { lat: 34.0489, lon: -111.0937 },
    'MA': { lat: 42.4072, lon: -71.3824 },
    'TN': { lat: 35.5175, lon: -86.5804 },
    'IN': { lat: 40.2672, lon: -86.1349 },
    'MO': { lat: 37.9643, lon: -91.8318 },
    'MD': { lat: 39.0458, lon: -76.6413 },
    'WI': { lat: 43.7844, lon: -88.7879 },
  }

  return coords[state] || { lat: 39.8283, lon: -98.5795 } // US center fallback
}

/**
 * Get outage severity level
 */
function getSeverityLevel(percentageOut: number, customersOut: number): string {
  if (percentageOut >= 5.0 || customersOut > 100000) return 'Severe'
  if (percentageOut >= 2.0 || customersOut > 50000) return 'Major'
  if (percentageOut >= 1.0 || customersOut > 25000) return 'Significant'
  if (percentageOut >= 0.5 || customersOut > 10000) return 'Moderate'
  return 'Minor'
}

/**
 * Get color based on outage severity
 */
export function getOutageColor(percentageOut: number, customersOut: number): string {
  if (percentageOut >= 5.0 || customersOut > 100000) return '#8B0000' // Dark red
  if (percentageOut >= 2.0 || customersOut > 50000) return '#DC143C' // Crimson
  if (percentageOut >= 1.0 || customersOut > 25000) return '#FF6B6B' // Red
  if (percentageOut >= 0.5 || customersOut > 10000) return '#FF8C42' // Orange
  return '#FFD93D' // Yellow
}

/**
 * Fetch power outage data from EIA
 */
export async function fetchPowerOutages(): Promise<UnifiedEvent[]> {
  if (!EIA_API_KEY) {
    console.warn('⚠️ EIA_API_KEY not configured. Returning empty data.')
    return []
  }

  try {
    // EIA API v2 - Electricity disturbances (outages)
    // This endpoint tracks major disturbances/outages reported to DOE
    const url = `${EIA_BASE_URL}/electricity/electric-power-operational-data/data/?api_key=${EIA_API_KEY}&frequency=daily&data[0]=customers&facets[type][]=outage&sort[0][column]=period&sort[0][direction]=desc&length=100`

    console.log('🔌 Fetching power outage data from EIA...')

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      },
      next: { revalidate: 600 } // Cache for 10 minutes
    })

    if (!response.ok) {
      throw new Error(`EIA API error: ${response.status} ${response.statusText}`)
    }

    const data: EIAOutageResponse = await response.json()

    if (!data.response?.data || data.response.data.length === 0) {
      console.warn('⚠️ No outage data from EIA. Returning empty data.')
      return []
    }

    // Group by state and sum customers affected
    const stateOutages = new Map<string, {
      state: string
      stateName: string
      customersOut: number
      timestamp: string
    }>()

    data.response.data.forEach(item => {
      const state = item.stateid
      if (!state) return

      const existing = stateOutages.get(state)
      const customersOut = item.value || 0

      if (!existing || customersOut > existing.customersOut) {
        stateOutages.set(state, {
          state,
          stateName: item.statename || state,
          customersOut,
          timestamp: item.period
        })
      }
    })

    const events: UnifiedEvent[] = Array.from(stateOutages.values())
      .filter(outage => outage.customersOut > 1000) // Filter significant outages
      .map(outage => {
        const stateCoords = getStateCoordinates(outage.state)

        // Estimate percentage (using approximate state populations)
        // This is a rough estimate - would need actual customer count per state for accuracy
        const estimatedCustomers = 1000000 // Conservative estimate
        const percentageOut = (outage.customersOut / estimatedCustomers) * 100

        const severity = getSeverityLevel(percentageOut, outage.customersOut)
        const color = getOutageColor(percentageOut, outage.customersOut)

        return {
          id: `eia-outage-${outage.state}-${Date.now()}`,
          timestamp: new Date(outage.timestamp).getTime(),
          data_type: 'power_outage' as const,
          primary_value: outage.customersOut,
          secondary_value: Math.round(percentageOut * 100) / 100,
          location: stateCoords,
          confidence: 'high' as const,
          source: 'EIA',
          color,
          metadata: {
            state: outage.state,
            stateName: outage.stateName,
            customers_out: outage.customersOut,
            percentage_out: Math.round(percentageOut * 100) / 100,
            severity
          }
        }
      })

    console.log(`✅ Fetched ${events.length} power outages from EIA`)
    return events

  } catch (error) {
    console.error('❌ Error fetching EIA power outage data:', error)
    console.warn('⚠️ Returning empty data')
    return []
  }
}
