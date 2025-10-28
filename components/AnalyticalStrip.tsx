'use client'

import { useState, useMemo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useLayer } from '@/contexts/LayerContext'
import { Sparkline } from '@/lib/charts/d3/01-sparkline'
import { Slopegraph } from '@/lib/charts/d3/05-slopegraph'
import { SmallMultiples } from '@/lib/charts/d3/06-small-multiples'
import { TimeSeries } from '@/lib/charts/d3/07-timeseries'
import EnhancedChartModal from './EnhancedChartModal'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'

export default function AnalyticalStrip() {
  const { earthquakes, wildfires, airQuality, powerOutages, severeWeather, internetOutages } = useData()
  const { activeLayers } = useLayer()
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)
  const [hoveredTile, setHoveredTile] = useState<string | null>(null)

  // Filter data based on active layers
  const filteredEarthquakes = useMemo(() =>
    activeLayers.has('earthquakes') ? earthquakes : []
  , [earthquakes, activeLayers])

  const filteredWildfires = useMemo(() =>
    activeLayers.has('wildfire') ? wildfires : []
  , [wildfires, activeLayers])

  const filteredAirQuality = useMemo(() =>
    activeLayers.has('air-quality') ? airQuality : []
  , [airQuality, activeLayers])

  const filteredPowerOutages = useMemo(() =>
    activeLayers.has('power-outages') ? powerOutages : []
  , [powerOutages, activeLayers])

  const filteredSevereWeather = useMemo(() =>
    activeLayers.has('severe-weather') ? severeWeather : []
  , [severeWeather, activeLayers])

  const filteredInternetOutages = useMemo(() =>
    activeLayers.has('internet-outages') ? internetOutages : []
  , [internetOutages, activeLayers])

  // Convert Earthquake[] to UnifiedDataPoint[] for charts
  const earthquakeUnified: UnifiedDataPoint[] = filteredEarthquakes.map(eq => ({
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
  const wildfireUnified: UnifiedDataPoint[] = filteredWildfires.map(fire => ({
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
  const airQualityUnified: UnifiedDataPoint[] = filteredAirQuality.map(aq => ({
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
  const powerOutageUnified: UnifiedDataPoint[] = filteredPowerOutages.map(outage => ({
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
  const severeWeatherUnified: UnifiedDataPoint[] = filteredSevereWeather.map(weather => ({
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

  // Convert InternetOutage[] to UnifiedDataPoint[]
  const internetOutageUnified: UnifiedDataPoint[] = filteredInternetOutages.map(outage => ({
    id: outage.id,
    coords: outage.coords,
    timestamp: outage.timestamp,
    time: outage.time,
    location: outage.location,
    primaryValue: outage.cause === 'CABLE_CUT' ? 4 : outage.cause === 'ATTACK' ? 3 : outage.cause === 'POWER_OUTAGE' ? 2 : 1,
    secondaryValue: outage.type === 'NATIONWIDE' ? 3 : outage.type === 'REGIONAL' ? 2 : 1,
    severity: outage.type === 'NATIONWIDE' ? 'critical' : outage.type === 'REGIONAL' ? 'high' : 'medium',
    layerType: 'internet-outages',
    layerLabel: 'Internet Outages',
    rawData: outage
  }))


  // Dynamic tile style based on hover state
  const getTileStyle = (tileId: string) => ({
    flex: 1,
    minWidth: '280px',
    backgroundColor: hoveredTile === tileId ? '#141821' : '#0A0F16', // Ocean color on hover, land mass normally
    border: '1px solid #242C3A',
    padding: '0',
    display: 'flex',
    flexDirection: 'column' as const,
    transition: 'background-color 200ms ease',
    cursor: 'pointer',
    boxShadow: hoveredTile === tileId ? '0 4px 12px rgba(0, 0, 0, 0.5)' : 'none',
    overflow: 'hidden'
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
      case 'sparkline-wildfires':
        return {
          name: 'Wildfire Activity Trends',
          description: 'Real-time wildfire detection showing brightness and intensity patterns',
          component: <Sparkline unified={wildfireUnified} width={1200} height={700} />,
          data: wildfireUnified
        }
      case 'sparkline-air-quality':
        return {
          name: 'Air Quality Trends',
          description: 'Air Quality Index (AQI) measurements across major cities',
          component: <Sparkline unified={airQualityUnified} width={1200} height={700} />,
          data: airQualityUnified
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
      case 'sparkline-internet-outages':
        return {
          name: 'Internet Outage Activity',
          description: 'Real-time internet outages from Cloudflare Radar showing network disruptions',
          component: <Sparkline unified={internetOutageUnified} width={1200} height={700} />,
          data: internetOutageUnified
        }
      default:
        return null
    }
  }

  // Define all available charts with their data requirements and priority
  const availableCharts = [
    {
      id: 'sparkline-earthquakes',
      name: 'Earthquake Activity',
      component: <Sparkline unified={earthquakeUnified} width={280} height={180} />,
      hasData: earthquakeUnified.length >= 2,
      priority: earthquakeUnified.length * 3, // Higher priority for more data
      dataCount: earthquakeUnified.length
    },
    {
      id: 'slopegraph-power',
      name: 'Power Outages',
      component: <Slopegraph unified={powerOutageUnified} width={280} height={180} />,
      hasData: powerOutageUnified.length >= 2,
      priority: powerOutageUnified.length * 2.5,
      dataCount: powerOutageUnified.length
    },
    {
      id: 'small-multiples-all',
      name: 'Multi-Source View',
      component: (
        <SmallMultiples
          earthquakes={earthquakeUnified}
          wildfires={wildfireUnified}
          airQuality={airQualityUnified}
          width={280}
          height={180}
        />
      ),
      hasData: (earthquakeUnified.length + wildfireUnified.length + airQualityUnified.length) >= 3,
      priority: (earthquakeUnified.length + wildfireUnified.length + airQualityUnified.length) * 2,
      dataCount: earthquakeUnified.length + wildfireUnified.length + airQualityUnified.length
    },
    {
      id: 'timeseries-weather',
      name: 'Severe Weather',
      component: <TimeSeries unified={severeWeatherUnified} width={280} height={180} />,
      hasData: severeWeatherUnified.length >= 2,
      priority: severeWeatherUnified.length * 2.8,
      dataCount: severeWeatherUnified.length
    },
    {
      id: 'sparkline-wildfires',
      name: 'Wildfire Activity',
      component: <Sparkline unified={wildfireUnified} width={280} height={180} />,
      hasData: wildfireUnified.length >= 2,
      priority: wildfireUnified.length * 2.6,
      dataCount: wildfireUnified.length
    },
    {
      id: 'sparkline-air-quality',
      name: 'Air Quality Trends',
      component: <Sparkline unified={airQualityUnified} width={280} height={180} />,
      hasData: airQualityUnified.length >= 2,
      priority: airQualityUnified.length * 2.4,
      dataCount: airQualityUnified.length
    },
    {
      id: 'sparkline-internet-outages',
      name: 'Internet Outages',
      component: <Sparkline unified={internetOutageUnified} width={280} height={180} />,
      hasData: internetOutageUnified.length >= 2,
      priority: internetOutageUnified.length * 2.7,
      dataCount: internetOutageUnified.length
    }
  ]

  // Select top 4 charts with data, prioritized by data count and type
  // Group by chart type to avoid duplicates (e.g., multiple sparklines)
  const selectedCharts = availableCharts
    .filter(chart => chart.hasData)
    .sort((a, b) => b.priority - a.priority)
    .reduce((acc, chart) => {
      // Extract chart type from ID (e.g., 'sparkline', 'slopegraph', 'small-multiples', 'timeseries')
      const chartType = chart.id.split('-')[0]

      // Only add if we don't already have this chart type OR if it's a significantly better data source
      const existingOfType = acc.find(c => c.id.split('-')[0] === chartType)
      if (!existingOfType || chart.priority > existingOfType.priority * 1.5) {
        // Replace if significantly better, otherwise skip
        if (existingOfType && chart.priority > existingOfType.priority * 1.5) {
          const index = acc.indexOf(existingOfType)
          acc[index] = chart
        } else if (!existingOfType) {
          acc.push(chart)
        }
      }
      return acc
    }, [] as typeof availableCharts)
    .slice(0, 4)

  // If we have fewer than 4 charts with data, fill with best available
  const chartsToShow = selectedCharts.length >= 3 ? selectedCharts :
    availableCharts.filter(c => c.hasData).slice(0, 4)

  return (
    <>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ display: 'flex', gap: '16px' }}>
          {chartsToShow.map(chart => (
            <div
              key={chart.id}
              style={getTileStyle(chart.id)}
              onClick={() => setSelectedChartId(chart.id)}
              onMouseEnter={() => setHoveredTile(chart.id)}
              onMouseLeave={() => setHoveredTile(null)}
            >
              {/* Chart Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid #242C3A',
                backgroundColor: '#080D12'
              }}>
                <div style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#8F9BB0',
                  fontFamily: 'Geist Mono, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '4px'
                }}>
                  {chart.name}
                </div>
                <div style={{
                  fontSize: '10px',
                  color: '#5E6A81',
                  fontFamily: 'Geist Mono, monospace'
                }}>
                  {chart.dataCount} event{chart.dataCount !== 1 ? 's' : ''}
                </div>
              </div>

              {/* Chart Content */}
              <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '16px'
              }}>
                {chart.component}
              </div>
            </div>
          ))}
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
