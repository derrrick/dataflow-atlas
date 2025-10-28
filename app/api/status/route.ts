import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'
export const revalidate = 0

type FeedStatus = {
  source: string
  status: 'ok' | 'delayed' | 'down'
  last_update: string
  age_min: number
  count?: number
  msg?: string
}

// Expected update cadences per source (in minutes)
const EXPECTED_CADENCES = {
  'NASA FIRMS': { ok: 180, warn: 360 },      // 3 hours OK, 6 hours warning
  'AirNow': { ok: 120, warn: 240 },          // 2 hours OK, 4 hours warning
  'USGS': { ok: 5, warn: 15 },               // 5 minutes OK, 15 minutes warning
  'NOAA NWS': { ok: 60, warn: 120 },         // 1 hour OK, 2 hours warning
  'Cloudflare': { ok: 15, warn: 45 },        // 15 minutes OK, 45 minutes warning
  'EIA': { ok: 180, warn: 360 },             // 3 hours OK, 6 hours warning
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Query latest timestamps and counts per source
    const sourceQueries = [
      { source: 'NASA FIRMS', table: 'unified_events', type: 'wildfire' },
      { source: 'AirNow', table: 'unified_events', type: 'air_quality' },
      { source: 'USGS', table: 'unified_events', type: 'earthquake' },
      { source: 'NOAA NWS', table: 'unified_events', type: 'severe_weather' },
      { source: 'Cloudflare', table: 'unified_events', type: 'internet_outage' },
      { source: 'EIA', table: 'unified_events', type: 'power_outage' },
    ]

    const statuses: FeedStatus[] = []

    for (const { source, table, type } of sourceQueries) {
      try {
        // Get latest event and count for this source
        const { data, error } = await supabase
          .from(table)
          .select('timestamp, created_at')
          .eq('data_type', type)
          .order('timestamp', { ascending: false })
          .limit(1)
          .single()

        if (error || !data) {
          // No data found - mark as down
          statuses.push({
            source,
            status: 'down',
            last_update: new Date(0).toISOString(),
            age_min: 999999,
            count: 0,
            msg: 'No data'
          })
          continue
        }

        // Get count for this source
        const { count } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true })
          .eq('data_type', type)

        const lastUpdate = new Date(data.timestamp)
        const ageMs = Date.now() - lastUpdate.getTime()
        const ageMin = ageMs / 60_000

        const cadence = EXPECTED_CADENCES[source as keyof typeof EXPECTED_CADENCES]

        let status: 'ok' | 'delayed' | 'down'
        if (ageMin <= cadence.ok) {
          status = 'ok'
        } else if (ageMin <= cadence.warn) {
          status = 'delayed'
        } else {
          status = 'down'
        }

        statuses.push({
          source,
          status,
          last_update: lastUpdate.toISOString(),
          age_min: ageMin,
          count: count || 0
        })
      } catch (err) {
        console.error(`Error checking status for ${source}:`, err)
        statuses.push({
          source,
          status: 'down',
          last_update: new Date(0).toISOString(),
          age_min: 999999,
          msg: 'Error fetching'
        })
      }
    }

    // Sort by status severity (down first, then delayed, then ok)
    const statusOrder = { down: 0, delayed: 1, ok: 2 }
    statuses.sort((a, b) => statusOrder[a.status] - statusOrder[b.status])

    return NextResponse.json(statuses)
  } catch (error) {
    console.error('Status endpoint error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
