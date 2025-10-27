/**
 * API Route: Ingest NOAA Severe Weather Alerts
 *
 * Fetches active weather alerts from NOAA NWS CAP and stores in Supabase
 * GET /api/ingest/severe-weather
 */

import { NextResponse } from 'next/server'
import { fetchNOAAWeatherAlerts } from '@/lib/api/noaa-cap'
import { insertEvents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Fetching NOAA severe weather alerts')

    // Fetch weather alert data
    const events = await fetchNOAAWeatherAlerts()

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active severe weather alerts found',
        count: 0
      })
    }

    // Insert into Supabase
    const inserted = await insertEvents(events)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} severe weather alerts`,
      count: inserted.length,
      sample: inserted.slice(0, 3) // Return first 3 as sample
    })
  } catch (error) {
    console.error('Error ingesting severe weather data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
