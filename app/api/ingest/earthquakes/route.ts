/**
 * API Route: Ingest USGS Earthquake Data
 *
 * Fetches earthquake data from USGS and stores in Supabase
 * GET /api/ingest/earthquakes?timeframe=day&magnitude=all
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchUSGSEarthquakes } from '@/lib/api/usgs'
import { insertEvents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const timeframe = (searchParams.get('timeframe') as 'hour' | 'day' | 'week' | 'month') || 'day'
    const magnitude = (searchParams.get('magnitude') as 'significant' | 'all' | '4.5' | '2.5' | '1.0') || 'all'

    console.log(`Fetching USGS earthquakes: ${magnitude}_${timeframe}`)

    // Fetch earthquake data
    const events = await fetchUSGSEarthquakes(timeframe, magnitude)

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No new earthquakes found',
        count: 0
      })
    }

    // Insert into Supabase
    const inserted = await insertEvents(events)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} earthquakes`,
      count: inserted.length,
      timeframe,
      magnitude,
      sample: inserted.slice(0, 3) // Return first 3 as sample
    })
  } catch (error) {
    console.error('Error ingesting earthquake data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
