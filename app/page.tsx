'use client'

import { Suspense, useState } from 'react'
import dynamic from 'next/dynamic'
import { ChartNoAxesColumn, ChevronUp, ChevronDown } from 'lucide-react'
import { LayerProvider } from '@/contexts/LayerContext'
import { DataProvider, useData } from '@/contexts/DataContext'
import { TimeProvider } from '@/contexts/TimeContext'
import LayerControls from '@/components/LayerControls'
import AnalyticalStrip from '@/components/AnalyticalStrip'
import Header from '@/components/Header'
import ExpandablePanel from '@/components/ExpandablePanel'
import ChartGrid from '@/components/ChartGrid'
import DataStatusBanner from '@/components/DataStatusBanner'
import TimeScrubber from '@/components/TimeScrubber'
import StatusChips from '@/components/StatusChips'
import RefreshIndicator from '@/components/RefreshIndicator'
import PermalinkManager from '@/components/PermalinkManager'
import { useTime } from '@/contexts/TimeContext'

const Globe = dynamic(() => import('@/components/GlobeMapLibre'), {
  ssr: false,
  loading: () => (
    <div style={{
      width: '100%',
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#141821'
    }}>
      <p style={{ fontSize: '14px', color: '#8F9BB0' }}>Loading...</p>
    </div>
  )
})

function HomeContent() {
  const { t0, t1, setTimeRange } = useTime()
  const { isRefreshing, lastRefresh } = useData()
  const [scrubberExpanded, setScrubberExpanded] = useState(false)
  const [panelExpanded, setPanelExpanded] = useState(false)

  return (
    <div style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#141821'
        }}>
          <Header />
          <DataStatusBanner />

          <div style={{
            flex: 1,
            position: 'relative',
            minHeight: 0
          }}>
            <Suspense fallback={
              <div style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#141821'
              }}>
                <p style={{ fontSize: '14px', color: '#8F9BB0' }}>Loading...</p>
              </div>
            }>
              <Globe />
            </Suspense>

            <div style={{
              position: 'absolute',
              left: '24px',
              top: '24px',
              zIndex: 100
            }}>
              <LayerControls />
            </div>

            {/* Status chips for data freshness */}
            <div style={{
              position: 'absolute',
              top: '24px',
              right: '24px',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <RefreshIndicator isRefreshing={isRefreshing} lastRefresh={lastRefresh} />
              <StatusChips />
            </div>

            {/* Time scrubber - aligned left */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              zIndex: 100
            }}>
              <TimeScrubber onChange={setTimeRange} onExpandChange={setScrubberExpanded} />
            </div>

            {/* Explore the data button */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: scrubberExpanded ? '588px' : '108px',
              zIndex: panelExpanded ? 1001 : 100,
              transition: 'left 400ms cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}>
              <button
                onClick={() => setPanelExpanded(!panelExpanded)}
                className="explore-button"
                style={{
                  padding: '14px 28px',
                  borderRadius: '100px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  cursor: 'pointer',
                  color: '#FFFFFF',
                  fontSize: '14px',
                  fontFamily: 'Albert Sans, sans-serif',
                  fontWeight: 500,
                  whiteSpace: 'nowrap',
                  height: '60px'
                }}
              >
                {panelExpanded ? (
                  <>
                    <ChevronDown size={14} />
                    <span>Back to Overview</span>
                  </>
                ) : (
                  <>
                    <ChartNoAxesColumn size={14} />
                    <span>Explore the data</span>
                    <ChevronUp size={14} />
                  </>
                )}
              </button>
            </div>

            {/* Permalink manager */}
            <PermalinkManager t0={t0} t1={t1} />
          </div>

          <ExpandablePanel
            isExpanded={panelExpanded}
            onClose={() => setPanelExpanded(false)}
            collapsedContent={
              <>
                <div style={{
                  backgroundColor: '#0A0F16', // Land mass color - same as header
                  width: '100%'
                }}>
                  <div style={{
                    maxWidth: '1536px',
                    margin: '0 auto',
                    padding: '24px'
                  }}>
                    <AnalyticalStrip />
                  </div>
                </div>

                <div style={{
                  backgroundColor: '#080D12', // Slightly darker than header/land mass
                  borderTop: '1px solid #242C3A',
                  width: '100%'
                }}>
                  <div style={{
                    maxWidth: '1536px',
                    margin: '0 auto',
                    padding: '12px 24px'
                  }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '16px',
                    fontSize: '12px',
                    color: '#5E6A81'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span>Sources: USGS, NASA FIRMS, AirNow, EIA, NOAA NWS</span>
                      <span style={{ color: '#242C3A' }}>•</span>
                      <span>License: Open Data</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
                      <span style={{ color: '#8F9BB0' }}>Dataflow Atlas v1.0</span>
                      <span style={{ color: '#242C3A' }}>•</span>
                      <span style={{ color: '#5E6A81' }}>© 2025 Derrick R. Schippert</span>
                    </div>
                  </div>
                </div>
              </div>
              </>
            }
            expandedContent={<ChartGrid showFilters={true} />}
          />
        </div>
  )
}

export default function Home() {
  return (
    <TimeProvider>
      <DataProvider>
        <LayerProvider>
          <HomeContent />
        </LayerProvider>
      </DataProvider>
    </TimeProvider>
  )
}
