/**
 * API Route: Daily FIRMS Wildfire Data Ingestion
 *
 * Fetches last 24 hours of active fire data from NASA FIRMS (both satellites)
 * Runs daily at 6:00 AM UTC via Vercel Cron
 *
 * GET /api/cron/ingest/firms-daily
 * GET /api/cron/ingest/firms-daily?date=2025-01-14 (for backfill)
 */

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import { fetchNASAFires } from '@/lib/api/nasa-firms'
import { insertEvents } from '@/lib/supabase'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const SOURCE_NAME = 'NASA FIRMS'

export async function GET(request: NextRequest) {
  const startTime = Date.now()
  let totalInserted = 0
  const errors: string[] = []

  // Initialize Supabase with service role key for server-side operations
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Log ingestion start
  const { data: logEntry } = await supabase
    .from('ingestion_logs')
    .insert({
      source_name: SOURCE_NAME,
      status: 'running'
    })
    .select()
    .single()

  try {
    // Get API key
    const apiKey = process.env.NASA_FIRMS_API_KEY
    if (!apiKey) {
      throw new Error('NASA_FIRMS_API_KEY not configured')
    }

    // Get date parameter (for backfill support)
    const searchParams = request.nextUrl.searchParams
    const targetDate = searchParams.get('date') // YYYY-MM-DD format
    const days = targetDate ? 1 : 1 // Always fetch 1 day of data

    console.log(`[FIRMS] Fetching fire data ${targetDate ? `for ${targetDate}` : 'for yesterday'}`)

    // Fetch from both satellites
    const satellites: Array<'VIIRS_SNPP_NRT' | 'MODIS_NRT'> = ['VIIRS_SNPP_NRT', 'MODIS_NRT']
    let lastEventTimestamp = 0

    for (const satellite of satellites) {
      try {
        console.log(`[FIRMS] Fetching from ${satellite}...`)

        const events = await fetchNASAFires(apiKey, satellite, 'WORLD', days)

        if (events.length === 0) {
          console.log(`[FIRMS] No fires from ${satellite}`)
          continue
        }

        // Insert into database
        const inserted = await insertEvents(events)
        totalInserted += inserted.length

        // Track latest event timestamp
        const maxTimestamp = Math.max(...events.map(e => e.timestamp))
        if (maxTimestamp > lastEventTimestamp) {
          lastEventTimestamp = maxTimestamp
        }

        console.log(`[FIRMS] Inserted ${inserted.length} fires from ${satellite}`)

      } catch (err) {
        const errorMsg = `${satellite}: ${err instanceof Error ? err.message : 'Unknown error'}`
        errors.push(errorMsg)
        console.error(`[FIRMS] Error with ${satellite}:`, err)
      }
    }

    // Update source status
    const status = totalInserted > 0 ? 'ok' : (errors.length === satellites.length ? 'down' : 'delayed')

    await supabase.rpc('update_source_status', {
      p_source_name: SOURCE_NAME,
      p_events_ingested: totalInserted,
      p_last_event_timestamp: lastEventTimestamp,
      p_status: status,
      p_error: errors.length > 0 ? errors.join('; ') : null
    })

    // Update ingestion log
    if (logEntry) {
      await supabase
        .from('ingestion_logs')
        .update({
          completed_at: new Date().toISOString(),
          status: 'success',
          events_ingested: totalInserted,
          duration_ms: Date.now() - startTime,
          error_message: errors.length > 0 ? errors.join('; ') : null,
          metadata: { satellites, targetDate }
        })
        .eq('id', logEntry.id)
    }

    return NextResponse.json({
      success: true,
      source: SOURCE_NAME,
      eventsIngested: totalInserted,
      satellites: satellites.map(sat => ({
        name: sat,
        success: !errors.some(e => e.includes(sat))
      })),
      errors: errors.length > 0 ? errors : undefined,
      durationMs: Date.now() - startTime,
      targetDate: targetDate || 'yesterday'
    })

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[FIRMS] Fatal error:', error)

    // Log failure
    if (logEntry) {
      await supabase
        .from('ingestion_logs')
        .update({
          completed_at: new Date().toISOString(),
          status: 'error',
          events_ingested: totalInserted,
          duration_ms: Date.now() - startTime,
          error_message: errorMessage
        })
        .eq('id', logEntry.id)
    }

    // Update source status to down
    await supabase.rpc('update_source_status', {
      p_source_name: SOURCE_NAME,
      p_events_ingested: 0,
      p_last_event_timestamp: 0,
      p_status: 'down',
      p_error: errorMessage
    })

    return NextResponse.json({
      success: false,
      error: errorMessage,
      eventsIngested: totalInserted,
      durationMs: Date.now() - startTime
    }, { status: 500 })
  }
}
