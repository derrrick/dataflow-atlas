/**
 * Vercel Cron Job: Automated Data Ingestion
 *
 * This endpoint is triggered by Vercel Cron on a schedule.
 * It runs all data ingestion jobs to keep the database fresh.
 *
 * Schedule: Every 5 minutes (configured in vercel.json)
 * GET /api/cron/ingest
 */

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // Verify the request is from Vercel Cron
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET

    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      console.error('Unauthorized cron request')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔄 Starting scheduled data ingestion...')
    const startTime = Date.now()

    // Get the base URL for API calls
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'

    // Run all ingestion jobs in parallel
    const [earthquakeRes, airQualityRes, wildfireRes, powerOutageRes, severeWeatherRes, internetOutageRes] = await Promise.allSettled([
      // Earthquakes: Fetch 7-day window for better global coverage (service layer filters to 72h)
      fetch(`${baseUrl}/api/ingest/earthquakes?timeframe=week&magnitude=all`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }),

      // Air Quality: Every 5 minutes (AirNow updates hourly, but we check frequently)
      fetch(`${baseUrl}/api/ingest/air-quality`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }),

      // Wildfires: Every 5 minutes (NASA FIRMS updates every 3-6 hours)
      fetch(`${baseUrl}/api/ingest/wildfires?source=VIIRS_SNPP_NRT&days=1`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }),

      // Power Outages: Every 5 minutes (EIA updates every 10-15 minutes)
      fetch(`${baseUrl}/api/ingest/power-outages`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }),

      // Severe Weather: Every 5 minutes (NOAA NWS updates in real-time)
      fetch(`${baseUrl}/api/ingest/severe-weather`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      }),

      // Internet Outages: Every 5 minutes (Cloudflare Radar updates frequently)
      fetch(`${baseUrl}/api/ingest/internet-outages?days=7`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      })
    ])

    // Process results
    const results = {
      earthquakes: { status: 'unknown', count: 0, message: '' },
      airQuality: { status: 'unknown', count: 0, message: '' },
      wildfires: { status: 'unknown', count: 0, message: '' },
      powerOutages: { status: 'unknown', count: 0, message: '' },
      severeWeather: { status: 'unknown', count: 0, message: '' },
      internetOutages: { status: 'unknown', count: 0, message: '' }
    }

    // Parse earthquake results
    if (earthquakeRes.status === 'fulfilled' && earthquakeRes.value.ok) {
      const data = await earthquakeRes.value.json()
      results.earthquakes = {
        status: 'success',
        count: data.count || 0,
        message: data.message || ''
      }
    } else {
      results.earthquakes = {
        status: 'error',
        count: 0,
        message: earthquakeRes.status === 'rejected' ? earthquakeRes.reason : 'Failed to fetch'
      }
    }

    // Parse air quality results
    if (airQualityRes.status === 'fulfilled' && airQualityRes.value.ok) {
      const data = await airQualityRes.value.json()
      results.airQuality = {
        status: 'success',
        count: data.count || 0,
        message: data.message || ''
      }
    } else {
      results.airQuality = {
        status: 'error',
        count: 0,
        message: airQualityRes.status === 'rejected' ? airQualityRes.reason : 'Failed to fetch'
      }
    }

    // Parse wildfire results
    if (wildfireRes.status === 'fulfilled' && wildfireRes.value.ok) {
      const data = await wildfireRes.value.json()
      results.wildfires = {
        status: 'success',
        count: data.count || 0,
        message: data.message || ''
      }
    } else {
      results.wildfires = {
        status: 'error',
        count: 0,
        message: wildfireRes.status === 'rejected' ? wildfireRes.reason : 'Failed to fetch'
      }
    }

    // Parse power outage results
    if (powerOutageRes.status === 'fulfilled' && powerOutageRes.value.ok) {
      const data = await powerOutageRes.value.json()
      results.powerOutages = {
        status: 'success',
        count: data.count || 0,
        message: data.message || ''
      }
    } else {
      results.powerOutages = {
        status: 'error',
        count: 0,
        message: powerOutageRes.status === 'rejected' ? powerOutageRes.reason : 'Failed to fetch'
      }
    }

    // Parse severe weather results
    if (severeWeatherRes.status === 'fulfilled' && severeWeatherRes.value.ok) {
      const data = await severeWeatherRes.value.json()
      results.severeWeather = {
        status: 'success',
        count: data.count || 0,
        message: data.message || ''
      }
    } else {
      results.severeWeather = {
        status: 'error',
        count: 0,
        message: severeWeatherRes.status === 'rejected' ? severeWeatherRes.reason : 'Failed to fetch'
      }
    }

    // Parse internet outage results
    if (internetOutageRes.status === 'fulfilled' && internetOutageRes.value.ok) {
      const data = await internetOutageRes.value.json()
      results.internetOutages = {
        status: 'success',
        count: data.count || 0,
        message: data.message || ''
      }
    } else {
      results.internetOutages = {
        status: 'error',
        count: 0,
        message: internetOutageRes.status === 'rejected' ? internetOutageRes.reason : 'Failed to fetch'
      }
    }

    const duration = Date.now() - startTime

    console.log(`✅ Scheduled ingestion complete in ${duration}ms:`)
    console.log(`   - Earthquakes: ${results.earthquakes.count} events (${results.earthquakes.status})`)
    console.log(`   - Air Quality: ${results.airQuality.count} observations (${results.airQuality.status})`)
    console.log(`   - Wildfires: ${results.wildfires.count} detections (${results.wildfires.status})`)
    console.log(`   - Power Outages: ${results.powerOutages.count} incidents (${results.powerOutages.status})`)
    console.log(`   - Severe Weather: ${results.severeWeather.count} alerts (${results.severeWeather.status})`)
    console.log(`   - Internet Outages: ${results.internetOutages.count} outages (${results.internetOutages.status})`)

    return NextResponse.json({
      success: true,
      duration,
      timestamp: new Date().toISOString(),
      results
    })

  } catch (error) {
    console.error('❌ Cron job failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }, { status: 500 })
  }
}
