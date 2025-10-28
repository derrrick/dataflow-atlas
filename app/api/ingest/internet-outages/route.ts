/**
 * API Route: Ingest Internet Outage Data from Cloudflare Radar
 *
 * POST /api/ingest/internet-outages - Accept events from Python script
 * GET /api/ingest/internet-outages?days=7 - Fetch directly from Cloudflare
 */

import { NextRequest, NextResponse } from 'next/server'
import { insertEvents } from '@/lib/supabase'
import { randomUUID } from 'crypto'

export const dynamic = 'force-dynamic'
export const revalidate = 0

/**
 * POST handler - Accept events from Python ingestion script
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const events = body.events || []

    if (!Array.isArray(events) || events.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No events provided'
      }, { status: 400 })
    }

    console.log(`📥 Receiving ${events.length} internet outage events from Python script`)

    // Transform Python format to Supabase format
    const transformedEvents = events.map((event: any) => ({
      id: randomUUID(),
      data_type: 'internet_outage' as const,
      source: event.source || 'cloudflare_radar',
      timestamp: new Date(event.timestamp).getTime(), // Convert ISO string to Unix timestamp
      primary_value: 1, // Count as 1 outage
      color: '#4ECDC4',
      location: {
        lat: event.location.lat,
        lon: event.location.lon
      },
      metadata: event.metadata || {}
    }))

    // Insert into Supabase
    const inserted = await insertEvents(transformedEvents)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} internet outage events`,
      inserted: inserted.length,
      skipped: events.length - inserted.length,
      sample: inserted.slice(0, 3)
    })
  } catch (error) {
    console.error('❌ Error ingesting internet outage data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

/**
 * GET handler - Fetch directly from Cloudflare Radar API (optional)
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const days = parseInt(searchParams.get('days') || '7')

    const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN

    if (!CLOUDFLARE_API_TOKEN) {
      throw new Error('CLOUDFLARE_API_TOKEN not configured')
    }

    console.log(`🌐 Fetching internet outages from Cloudflare Radar (last ${days} days)`)

    // Fetch from Cloudflare Radar
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/radar/annotations/outages?dateRange=${days}d&limit=100`,
      {
        headers: {
          'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    if (!response.ok) {
      throw new Error(`Cloudflare API error: ${response.statusText}`)
    }

    const data = await response.json()

    if (!data.success) {
      throw new Error(`Cloudflare API returned error: ${JSON.stringify(data.errors)}`)
    }

    const annotations = data.result?.annotations || []

    // Country centroids mapping - comprehensive coverage of major countries
    const countryCoords: Record<string, [number, number]> = {
      // North America
      'US': [37.0902, -95.7129], 'CA': [56.1304, -106.3468], 'MX': [23.6345, -102.5528],

      // South America
      'BR': [-14.2350, -51.9253], 'AR': [-38.4161, -63.6167], 'CL': [-35.6751, -71.5430],
      'CO': [4.5709, -74.2973], 'PE': [-9.1900, -75.0152], 'VE': [6.4238, -66.5897],

      // Europe
      'GB': [55.3781, -3.4360], 'FR': [46.2276, 2.2137], 'DE': [51.1657, 10.4515],
      'IT': [41.8719, 12.5674], 'ES': [40.4637, -3.7492], 'PL': [51.9194, 19.1451],
      'UA': [48.3794, 31.1656], 'RO': [45.9432, 24.9668], 'NL': [52.1326, 5.2913],
      'BE': [50.5039, 4.4699], 'GR': [39.0742, 21.8243], 'PT': [39.3999, -8.2245],
      'SE': [60.1282, 18.6435], 'NO': [60.4720, 8.4689], 'FI': [61.9241, 25.7482],
      'DK': [56.2639, 9.5018], 'IE': [53.4129, -8.2439], 'AT': [47.5162, 14.5501],
      'CH': [46.8182, 8.2275], 'CZ': [49.8175, 15.4730], 'HU': [47.1625, 19.5033],

      // Asia
      'CN': [35.8617, 104.1954], 'IN': [20.5937, 78.9629], 'JP': [36.2048, 138.2529],
      'KR': [35.9078, 127.7669], 'TH': [15.8700, 100.9925], 'VN': [14.0583, 108.2772],
      'PH': [12.8797, 121.7740], 'ID': [-0.7893, 113.9213], 'MY': [4.2105, 101.9758],
      'SG': [1.3521, 103.8198], 'PK': [30.3753, 69.3451], 'BD': [23.6850, 90.3563],
      'TR': [38.9637, 35.2433], 'SA': [23.8859, 45.0792], 'AE': [23.4241, 53.8478],
      'IL': [31.0461, 34.8516], 'IQ': [33.2232, 43.6793], 'IR': [32.4279, 53.6880],
      'KZ': [48.0196, 66.9237], 'UZ': [41.3775, 64.5853],

      // Africa
      'CM': [7.3697, 12.3547], 'NG': [9.0820, 8.6753], 'ZA': [-30.5595, 22.9375],
      'EG': [26.8206, 30.8025], 'KE': [-0.0236, 37.9062], 'ET': [9.1450, 40.4897],
      'GH': [7.9465, -1.0232], 'TZ': [-6.3690, 34.8888], 'DZ': [28.0339, 1.6596],
      'MA': [31.7917, -7.0926], 'SD': [12.8628, 30.2176], 'UG': [1.3733, 32.2903],

      // Oceania
      'AU': [-25.2744, 133.7751], 'NZ': [-40.9006, 174.8860], 'PG': [-6.3150, 143.9555],

      // Russia and neighbors
      'RU': [61.5240, 105.3188], 'BY': [53.7098, 27.9534], 'GE': [42.3154, 43.3569],
      'AM': [40.0691, 45.0382], 'AZ': [40.1431, 47.5769],

      // Middle East additional
      'JO': [30.5852, 36.2384], 'LB': [33.8547, 35.8623], 'KW': [29.3117, 47.4818],
      'OM': [21.4735, 55.9754], 'QA': [25.3548, 51.1839], 'BH': [26.0667, 50.5577],
    }

    // Transform to our format
    const events = annotations
      .filter((event: any) => event.locations && event.locations.length > 0)
      .map((event: any) => {
        const countryCode = event.locations[0]
        const coords = countryCoords[countryCode] || [0, 0]

        return {
          id: randomUUID(),
          data_type: 'internet_outage' as const,
          source: 'cloudflare_radar',
          timestamp: new Date(event.startDate).getTime(), // Convert ISO string to Unix timestamp
          primary_value: 1, // Count as 1 outage
          color: '#4ECDC4',
          location: {
            lat: coords[0],
            lon: coords[1]
          },
          metadata: {
            event_id: event.id,
            description: event.description || 'Internet outage detected',
            cause: event.outage?.outageCause || 'UNKNOWN',
            type: event.outage?.outageType || 'UNKNOWN',
            country_code: countryCode,
            isps: event.asnsDetails?.slice(0, 5).map((asn: any) => asn.name) || [],
            asns: event.asns || [],
            start_date: event.startDate,
            end_date: event.endDate,
            linked_url: event.linkedUrl
          }
        }
      })

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No outages found',
        count: 0
      })
    }

    // Insert into Supabase
    const inserted = await insertEvents(events)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} internet outage events`,
      count: inserted.length,
      days,
      sample: inserted.slice(0, 3)
    })
  } catch (error) {
    console.error('❌ Error fetching internet outages:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
