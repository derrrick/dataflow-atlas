'use client'

import { useState } from 'react'
import { Info } from 'lucide-react'
import { Sparkline } from '@/lib/charts/d3/01-sparkline'
import { Choropleth } from '@/lib/charts/d3/02-choropleth'
import { Bubble } from '@/lib/charts/d3/22-bubble'
import { Waterfall } from '@/lib/charts/d3/43-waterfall'
import { DualTimeline } from '@/lib/charts/d3/13-dual-timeline'
import { BoxPlot } from '@/lib/charts/d3/32-boxplot'
import { CDF } from '@/lib/charts/d3/33-cdf'
import { StepChart } from '@/lib/charts/d3/16-step-chart'
import { ChartAttribution } from '@/components/ChartAttribution'
import {
  mockEarthquakeData,
  mockWildfireData,
  mockAirQualityData,
  mockEmptyData,
  mockSingleDataPoint,
  mockMixedData
} from '@/lib/test-data/mockUnifiedData'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'

type DataType = 'earthquake' | 'wildfire' | 'air_quality' | 'empty' | 'single' | 'mixed'

export default function TestChartsPage() {
  const [activeData, setActiveData] = useState<DataType>('earthquake')
  const [hoveredInfo, setHoveredInfo] = useState<string | null>(null)

  const getData = (): UnifiedDataPoint[] => {
    switch (activeData) {
      case 'earthquake':
        return mockEarthquakeData
      case 'wildfire':
        return mockWildfireData
      case 'air_quality':
        return mockAirQualityData
      case 'empty':
        return mockEmptyData
      case 'single':
        return mockSingleDataPoint
      case 'mixed':
        return mockMixedData
      default:
        return mockEarthquakeData
    }
  }

  const data = getData()

  const getAttribution = () => {
    const dataType = data[0]?.dataType || 'earthquake'

    switch (dataType) {
      case 'earthquake':
        return {
          source: 'USGS',
          lastUpdate: Date.now() - (3 * 60 * 60 * 1000), // 3 hours ago
          confidence: 'High' as const,
          coverage: 'Global M2.5+'
        }
      case 'wildfire':
        return {
          source: 'NIFC',
          lastUpdate: Date.now() - (1 * 60 * 60 * 1000), // 1 hour ago
          confidence: 'High' as const,
          coverage: 'US & Canada'
        }
      case 'air_quality':
        return {
          source: 'AirNow',
          lastUpdate: Date.now() - (30 * 60 * 1000), // 30 minutes ago
          confidence: 'Medium' as const,
          coverage: 'US Cities'
        }
      default:
        return {
          source: 'Mock Data',
          lastUpdate: Date.now(),
          confidence: 'High' as const
        }
    }
  }

  const getInfoText = (chartType: string) => {
    const dataType = data[0]?.dataType || 'earthquake'

    if (chartType === 'sparkline') {
      if (dataType === 'earthquake') return 'Four stacked sparklines showing seismic activity trends: magnitude intensity, depth underground, significance scores, and event frequency per hour over the last 24 hours.'
      if (dataType === 'wildfire') return 'Four stacked sparklines tracking wildfire metrics: total acres burned, containment percentage, number of active fires, and average fire size over time.'
      if (dataType === 'air_quality') return 'Four stacked sparklines monitoring air quality: AQI index levels, PM2.5 particulate concentration, number of reporting stations, and overall air quality health percentage.'
    } else if (chartType === 'choropleth') {
      if (dataType === 'earthquake') return 'Geographic heatmap showing average earthquake magnitude intensity by region. Warmer colors indicate higher magnitude events, with the top 3 regions labeled.'
      if (dataType === 'wildfire') return 'Geographic heatmap displaying wildfire activity by region. Color intensity represents total acres burned, with the most affected areas labeled.'
      if (dataType === 'air_quality') return 'Geographic heatmap of air quality conditions by region. Color scale shows average AQI levels, with the most polluted areas highlighted.'
    } else if (chartType === 'bubble') {
      if (dataType === 'earthquake') return 'Bubble chart plotting earthquake magnitude vs depth. Each bubble size represents magnitude intensity, revealing the relationship between seismic strength and underground depth.'
      if (dataType === 'wildfire') return 'Bubble chart showing wildfire acres burned vs containment progress. Bubble size indicates fire magnitude, helping identify containment efficiency patterns.'
      if (dataType === 'air_quality') return 'Bubble chart correlating AQI levels with PM2.5 concentrations. Bubble size represents air quality severity, showing pollution distribution patterns.'
    } else if (chartType === 'waterfall') {
      return 'Waterfall chart showing cumulative changes over time, with each bar representing incremental increases or decreases from the baseline.'
    } else if (chartType === 'dual-timeline') {
      return 'Dual timeline comparing two different data types simultaneously, revealing temporal correlations and divergences between event streams.'
    } else if (chartType === 'boxplot') {
      return 'Box plot displaying statistical distribution: median, quartiles, and outliers, providing insight into data spread and central tendency.'
    } else if (chartType === 'cdf') {
      return 'Cumulative Distribution Function showing the probability that values fall below each point, useful for understanding data distribution patterns.'
    } else if (chartType === 'step') {
      return 'Step chart displaying discrete value changes over time, emphasizing sudden shifts rather than gradual transitions.'
    }
    return 'Chart visualization'
  }

  const attribution = getAttribution()

  const ChartHeader = ({ title, infoKey }: { title: string; infoKey: string }) => (
    <div>
      <h3 style={{
        fontSize: '14px',
        fontWeight: 600,
        color: '#C6CFDA',
        marginBottom: '4px',
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        position: 'relative'
      }}>
        {title}
        <div
          style={{ position: 'relative', display: 'flex' }}
          onMouseEnter={() => setHoveredInfo(infoKey)}
          onMouseLeave={() => setHoveredInfo(null)}
        >
          <Info size={14} color="#8F9BB0" style={{ cursor: 'help' }} />
          {hoveredInfo === infoKey && (
            <div style={{
              position: 'absolute',
              top: 20,
              right: 0,
              width: '320px',
              padding: '12px',
              backgroundColor: '#141821',
              border: '1px solid #39D0FF',
              fontSize: '11px',
              color: '#C6CFDA',
              fontFamily: 'Geist Mono, monospace',
              lineHeight: '1.5',
              zIndex: 1000,
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
            }}>
              {getInfoText(infoKey)}
            </div>
          )}
        </div>
      </h3>
      <ChartAttribution {...attribution} />
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#0A0F16',
      padding: '32px',
      fontFamily: 'Albert Sans, sans-serif'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: 600,
          color: '#FFFFFF',
          marginBottom: '8px'
        }}>
          Unified Charts Test Page
        </h1>
        <p style={{
          fontSize: '14px',
          color: '#8F9BB0',
          marginBottom: '24px'
        }}>
          Testing all migrated charts with unified data format
        </p>

        {/* Data Type Switcher */}
        <div style={{
          display: 'flex',
          gap: '12px',
          flexWrap: 'wrap'
        }}>
          {(['earthquake', 'wildfire', 'air_quality', 'empty', 'single', 'mixed'] as DataType[]).map(type => (
            <button
              key={type}
              onClick={() => setActiveData(type)}
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'Albert Sans, sans-serif',
                color: activeData === type ? '#FFFFFF' : '#8F9BB0',
                backgroundColor: activeData === type ? '#39D0FF15' : 'transparent',
                border: `1px solid ${activeData === type ? '#39D0FF' : '#242C3A'}`,
                cursor: 'pointer',
                transition: 'all 200ms ease'
              }}
              onMouseEnter={(e) => {
                if (activeData !== type) {
                  e.currentTarget.style.borderColor = '#39D0FF'
                }
              }}
              onMouseLeave={(e) => {
                if (activeData !== type) {
                  e.currentTarget.style.borderColor = '#242C3A'
                }
              }}
            >
              {type === 'earthquake' && '🌍 Earthquakes'}
              {type === 'wildfire' && '🔥 Wildfires'}
              {type === 'air_quality' && '💨 Air Quality'}
              {type === 'empty' && '∅ Empty Data'}
              {type === 'single' && '• Single Point'}
              {type === 'mixed' && '🔀 Mixed Data'}
            </button>
          ))}
        </div>

        {/* Data Info */}
        <div style={{
          marginTop: '16px',
          padding: '12px 16px',
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          fontSize: '12px',
          color: '#8F9BB0'
        }}>
          <strong style={{ color: '#C6CFDA' }}>Data Points:</strong> {data.length} |
          <strong style={{ color: '#C6CFDA', marginLeft: '16px' }}>Type:</strong> {data[0]?.dataType || 'N/A'}
        </div>
      </div>

      {/* Charts Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
        gap: '24px'
      }}>
        {/* Sparkline */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="01 - Sparkline" infoKey="sparkline" />
          <div style={{ width: '100%', height: '277px' }}>
            <Sparkline unified={data} width={400} height={277} />
          </div>
        </div>

        {/* Choropleth */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="02 - Choropleth" infoKey="choropleth" />
          <div style={{ width: '100%', height: '300px' }}>
            <Choropleth unified={data} width={400} height={300} />
          </div>
        </div>

        {/* Bubble */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="22 - Bubble Chart" infoKey="bubble" />
          <div style={{ width: '100%', height: '300px' }}>
            <Bubble unified={data} width={400} height={300} />
          </div>
        </div>

        {/* Waterfall */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="43 - Waterfall" infoKey="waterfall" />
          <div style={{ width: '100%', height: '280px' }}>
            <Waterfall unified={data} width={400} height={280} />
          </div>
        </div>

        {/* Dual Timeline */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px',
          gridColumn: 'span 2'
        }}>
          <ChartHeader title="13 - Dual Timeline (Mixed Data)" infoKey="dual-timeline" />
          <div style={{ width: '100%', height: '300px' }}>
            <DualTimeline unified={mockMixedData} width={820} height={300} />
          </div>
        </div>

        {/* BoxPlot */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="32 - Box Plot" infoKey="boxplot" />
          <div style={{ width: '100%', height: '280px', display: 'flex', justifyContent: 'center' }}>
            <BoxPlot unified={data} width={320} height={280} />
          </div>
        </div>

        {/* CDF */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="33 - CDF" infoKey="cdf" />
          <div style={{ width: '100%', height: '280px' }}>
            <CDF unified={data} width={400} height={280} />
          </div>
        </div>

        {/* Step Chart */}
        <div style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          padding: '16px'
        }}>
          <ChartHeader title="16 - Step Chart" infoKey="step" />
          <div style={{ width: '100%', height: '280px' }}>
            <StepChart unified={data} width={400} height={280} />
          </div>
        </div>
      </div>

      {/* Console Reminder */}
      <div style={{
        marginTop: '32px',
        padding: '16px',
        backgroundColor: '#FFB34115',
        border: '1px solid #FFB341',
        fontSize: '13px',
        color: '#FFB341'
      }}>
        <strong>🔍 Testing Checklist:</strong>
        <ul style={{ marginTop: '8px', paddingLeft: '20px' }}>
          <li>Open browser console (F12) to check for errors</li>
          <li>Switch between all data types and verify colors/labels update</li>
          <li>Check "Empty Data" and "Single Point" edge cases</li>
          <li>Verify "Mixed Data" works with Dual Timeline</li>
          <li>Look for any visual glitches or layout issues</li>
        </ul>
      </div>
    </div>
  )
}
