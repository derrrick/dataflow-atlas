/**
 * API Route: Ingest AirNow Air Quality Data
 *
 * Fetches air quality data from AirNow and stores in Supabase
 * GET /api/ingest/air-quality
 */

import { NextRequest, NextResponse } from 'next/server'
import { fetchAirNowData } from '@/lib/api/airnow'
import { insertEvents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Get API key from environment
    const apiKey = process.env.AIRNOW_API_KEY

    if (!apiKey) {
      return NextResponse.json({
        success: false,
        error: 'AIRNOW_API_KEY not configured'
      }, { status: 500 })
    }

    console.log('Fetching AirNow air quality data')

    // Fetch air quality data
    const events = await fetchAirNowData(apiKey)

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No air quality data found',
        count: 0
      })
    }

    // Insert into Supabase
    const inserted = await insertEvents(events)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} air quality observations`,
      count: inserted.length,
      sample: inserted.slice(0, 3)
    })
  } catch (error) {
    console.error('Error ingesting air quality data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
