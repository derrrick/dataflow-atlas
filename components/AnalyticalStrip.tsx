'use client'

import { useData } from '@/contexts/DataContext'
import { Sparkline } from '@/lib/charts/d3/01-sparkline'
import { Slopegraph } from '@/lib/charts/d3/05-slopegraph'
import { SmallMultiples } from '@/lib/charts/d3/06-small-multiples'
import { TimeSeries } from '@/lib/charts/d3/07-timeseries'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'

export default function AnalyticalStrip() {
  const { earthquakes, wildfires, airQuality } = useData()

  // Convert Earthquake[] to UnifiedDataPoint[] for charts
  const earthquakeUnified: UnifiedDataPoint[] = earthquakes.map(eq => ({
    id: eq.id,
    timestamp: eq.timestamp,
    dataType: 'earthquake' as const,
    primaryValue: eq.magnitude,
    secondaryValue: eq.depth,
    location: { lat: eq.coords[0], lon: eq.coords[1] },
    source: 'USGS',
    metadata: { place: eq.location }
  }))

  // Convert Wildfire[] to UnifiedDataPoint[]
  const wildfireUnified: UnifiedDataPoint[] = wildfires.map(fire => ({
    id: fire.id,
    timestamp: fire.timestamp,
    dataType: 'wildfire' as const,
    primaryValue: fire.intensity,
    secondaryValue: fire.containment,
    location: { lat: fire.coords[0], lon: fire.coords[1] },
    source: 'NASA FIRMS',
    metadata: {}
  }))

  // Convert AirQuality[] to UnifiedDataPoint[]
  const airQualityUnified: UnifiedDataPoint[] = airQuality.map(aq => ({
    id: aq.id,
    timestamp: aq.timestamp,
    dataType: 'air_quality' as const,
    primaryValue: aq.aqi,
    secondaryValue: aq.pm25,
    location: { lat: aq.coords[0], lon: aq.coords[1] },
    source: 'AirNow',
    metadata: { city: aq.location }
  }))


  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Sparkline */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <Sparkline unified={earthquakeUnified} width={280} height={180} />
        </div>

        {/* Slopegraph */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <Slopegraph unified={earthquakeUnified} width={280} height={180} />
        </div>

        {/* Small Multiples */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <SmallMultiples
            earthquakes={earthquakeUnified}
            wildfires={wildfireUnified}
            airQuality={airQualityUnified}
            width={280}
            height={180}
          />
        </div>

        {/* Time Series */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <TimeSeries unified={earthquakeUnified} width={280} height={180} />
        </div>
      </div>
    </div>
  )
}
