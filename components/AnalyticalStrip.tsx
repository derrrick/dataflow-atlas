'use client'

import { useState } from 'react'
import { useData } from '@/contexts/DataContext'
import { Sparkline } from '@/lib/charts/d3/01-sparkline'
import { Slopegraph } from '@/lib/charts/d3/05-slopegraph'
import { SmallMultiples } from '@/lib/charts/d3/06-small-multiples'
import { TimeSeries } from '@/lib/charts/d3/07-timeseries'
import EnhancedChartModal from './EnhancedChartModal'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'

export default function AnalyticalStrip() {
  const { earthquakes, wildfires, airQuality, powerOutages, severeWeather } = useData()
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)

  // Convert Earthquake[] to UnifiedDataPoint[] for charts
  const earthquakeUnified: UnifiedDataPoint[] = earthquakes.map(eq => ({
    id: eq.id,
    coords: eq.coords,
    timestamp: eq.timestamp,
    time: eq.time,
    location: eq.location,
    primaryValue: eq.magnitude,
    secondaryValue: eq.depth,
    severity: eq.magnitude >= 6 ? 'critical' : eq.magnitude >= 5 ? 'high' : eq.magnitude >= 4 ? 'medium' : 'low',
    layerType: 'earthquakes',
    layerLabel: 'Earthquakes',
    rawData: eq
  }))

  // Convert Wildfire[] to UnifiedDataPoint[]
  const wildfireUnified: UnifiedDataPoint[] = wildfires.map(fire => ({
    id: fire.id,
    coords: fire.coords,
    timestamp: fire.timestamp,
    time: fire.time,
    location: fire.location,
    primaryValue: fire.brightness,
    secondaryValue: fire.confidence,
    severity: fire.brightness >= 400 ? 'critical' : fire.brightness >= 350 ? 'high' : fire.brightness >= 330 ? 'medium' : 'low',
    layerType: 'wildfire',
    layerLabel: 'Wildfires',
    rawData: fire
  }))

  // Convert AirQuality[] to UnifiedDataPoint[]
  const airQualityUnified: UnifiedDataPoint[] = airQuality.map(aq => ({
    id: aq.id,
    coords: aq.coords,
    timestamp: aq.timestamp,
    time: aq.time,
    location: aq.location,
    primaryValue: aq.aqi,
    secondaryValue: aq.pm25,
    severity: aq.aqi >= 200 ? 'critical' : aq.aqi >= 150 ? 'high' : aq.aqi >= 100 ? 'medium' : 'low',
    layerType: 'air-quality',
    layerLabel: 'Air Quality',
    rawData: aq
  }))

  // Convert PowerOutage[] to UnifiedDataPoint[]
  const powerOutageUnified: UnifiedDataPoint[] = powerOutages.map(outage => ({
    id: outage.id,
    coords: outage.coords,
    timestamp: outage.timestamp,
    time: outage.time,
    location: outage.location,
    primaryValue: outage.customers_out,
    secondaryValue: outage.percentage_out,
    severity: outage.customers_out >= 100000 ? 'critical' : outage.customers_out >= 50000 ? 'high' : outage.customers_out >= 10000 ? 'medium' : 'low',
    layerType: 'power-outages',
    layerLabel: 'Power Outages',
    rawData: outage
  }))

  // Convert SevereWeather[] to UnifiedDataPoint[]
  const severeWeatherUnified: UnifiedDataPoint[] = severeWeather.map(weather => ({
    id: weather.id,
    coords: weather.coords,
    timestamp: weather.timestamp,
    time: weather.time,
    location: weather.location,
    primaryValue: weather.severity === 'Extreme' ? 4 : weather.severity === 'Severe' ? 3 : weather.severity === 'Moderate' ? 2 : 1,
    secondaryValue: weather.urgency === 'Immediate' ? 3 : weather.urgency === 'Expected' ? 2 : 1,
    severity: weather.severity === 'Extreme' ? 'critical' : weather.severity === 'Severe' ? 'high' : weather.severity === 'Moderate' ? 'medium' : 'low',
    layerType: 'severe-weather',
    layerLabel: 'Severe Weather',
    rawData: weather
  }))


  // Dynamic tile style based on hover state
  const getTileStyle = (tileId: string) => ({
    flex: 1,
    minWidth: '280px',
    backgroundColor: hoveredTile === tileId ? '#141821' : '#0A0F16', // Ocean color on hover, land mass normally
    border: '1px solid #242C3A',
    padding: '16px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 200ms ease',
    cursor: 'pointer',
    boxShadow: hoveredTile === tileId ? '0 4px 12px rgba(0, 0, 0, 0.5)' : 'none'
  })

  // Chart metadata for modal
  const getChartMetadata = (chartId: string) => {
    switch (chartId) {
      case 'sparkline-earthquakes':
        return {
          name: 'Earthquake Activity Trends',
          description: 'Real-time seismic activity showing magnitude trends over time',
          component: <Sparkline unified={earthquakeUnified} width={1200} height={700} />,
          data: earthquakeUnified
        }
      case 'slopegraph-power':
        return {
          name: 'Power Outage Changes',
          description: 'Tracking changes in power outage severity across states',
          component: <Slopegraph unified={powerOutageUnified} width={1200} height={700} />,
          data: powerOutageUnified
        }
      case 'small-multiples-all':
        return {
          name: 'Multi-Source Comparison',
          description: 'Small multiples view comparing earthquakes, wildfires, and air quality events',
          component: (
            <SmallMultiples
              earthquakes={earthquakeUnified}
              wildfires={wildfireUnified}
              airQuality={airQualityUnified}
              width={1200}
              height={700}
            />
          ),
          data: [...earthquakeUnified, ...wildfireUnified, ...airQualityUnified]
        }
      case 'timeseries-weather':
        return {
          name: 'Severe Weather Timeline',
          description: 'Time series visualization of severe weather events and their severity',
          component: <TimeSeries unified={severeWeatherUnified} width={1200} height={700} />,
          data: severeWeatherUnified
        }
      default:
        return null
    }
  }

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {/* Sparkline - Earthquakes */}
          <div
            style={getTileStyle('sparkline-earthquakes')}
            onClick={() => setSelectedChartId('sparkline-earthquakes')}
            onMouseEnter={() => setHoveredTile('sparkline-earthquakes')}
            onMouseLeave={() => setHoveredTile(null)}
          >
            <Sparkline unified={earthquakeUnified} width={280} height={180} />
          </div>

          {/* Slopegraph - Power Outages */}
          <div
            style={getTileStyle('slopegraph-power')}
            onClick={() => setSelectedChartId('slopegraph-power')}
            onMouseEnter={() => setHoveredTile('slopegraph-power')}
            onMouseLeave={() => setHoveredTile(null)}
          >
            <Slopegraph unified={powerOutageUnified} width={280} height={180} />
          </div>

          {/* Small Multiples - All Data Sources */}
          <div
            style={getTileStyle('small-multiples-all')}
            onClick={() => setSelectedChartId('small-multiples-all')}
            onMouseEnter={() => setHoveredTile('small-multiples-all')}
            onMouseLeave={() => setHoveredTile(null)}
          >
            <SmallMultiples
              earthquakes={earthquakeUnified}
              wildfires={wildfireUnified}
              airQuality={airQualityUnified}
              width={280}
              height={180}
            />
          </div>

          {/* Time Series - Severe Weather */}
          <div
            style={getTileStyle('timeseries-weather')}
            onClick={() => setSelectedChartId('timeseries-weather')}
            onMouseEnter={() => setHoveredTile('timeseries-weather')}
            onMouseLeave={() => setHoveredTile(null)}
          >
            <TimeSeries unified={severeWeatherUnified} width={280} height={180} />
          </div>
        </div>
      </div>

      {/* Modal for expanded chart view */}
      {selectedChartId && (() => {
        const metadata = getChartMetadata(selectedChartId)
        if (!metadata) return null

        return (
          <EnhancedChartModal
            isOpen={true}
            onClose={() => setSelectedChartId(null)}
            chartId={selectedChartId}
            chartName={metadata.name}
            chartDescription={metadata.description}
            chartComponent={metadata.component}
            data={metadata.data}
          />
        )
      })()}
    </>
  )
}
