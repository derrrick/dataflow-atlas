/**
 * API Route: Ingest NASA FIRMS Wildfire Data
 *
 * Fetches active fire data from NASA FIRMS and stores in Supabase
 * GET /api/ingest/wildfires?source=VIIRS_SNPP_NRT&days=1
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchNASAFires } from '@/lib/api/nasa-firms'
import { insertEvents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const source = (searchParams.get('source') as 'VIIRS_SNPP_NRT' | 'MODIS_NRT' | 'VIIRS_NOAA20_NRT') || 'VIIRS_SNPP_NRT'
    const days = parseInt(searchParams.get('days') || '1')

    // Get API key from environment
    const apiKey = process.env.NASA_FIRMS_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'NASA_FIRMS_API_KEY not configured'
      }, { status: 500 })
    }

    console.log(`Fetching NASA FIRMS fires: ${source}, ${days} day(s)`)

    // Fetch fire data
    const events = await fetchNASAFires(apiKey, source, 'WORLD', days)

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No active fires found',
        count: 0
      })
    }

    // Insert into Supabase
    const inserted = await insertEvents(events)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} active fires`,
      count: inserted.length,
      source,
      days,
      sample: inserted.slice(0, 3)
    })
  } catch (error) {
    console.error('Error ingesting wildfire data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
