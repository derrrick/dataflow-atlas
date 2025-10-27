/**
 * API Route: Ingest Power Outage Data
 *
 * Fetches power outage data and stores in Supabase
 * GET /api/ingest/power-outages
 */

import { NextResponse } from 'next/server'
import { fetchPowerOutages } from '@/lib/api/poweroutage'
import { insertEvents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET() {
  try {
    console.log('Fetching power outage data')

    // Fetch power outage data
    const events = await fetchPowerOutages()

    if (events.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'No significant power outages found',
        count: 0
      })
    }

    // Insert into Supabase
    const inserted = await insertEvents(events)

    return NextResponse.json({
      success: true,
      message: `Ingested ${inserted.length} power outage events`,
      count: inserted.length,
      sample: inserted.slice(0, 3) // Return first 3 as sample
    })
  } catch (error) {
    console.error('Error ingesting power outage data:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
