'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'
import { LayerProvider } from '@/contexts/LayerContext'
import { DataProvider } from '@/contexts/DataContext'
import LayerControls from '@/components/LayerControls'
import AnalyticalStrip from '@/components/AnalyticalStrip'
import Header from '@/components/Header'
import ExpandablePanel from '@/components/ExpandablePanel'
import ChartGrid from '@/components/ChartGrid'
import DataStatusBanner from '@/components/DataStatusBanner'

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

export default function Home() {
  return (
    <DataProvider>
      <LayerProvider>
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
          </div>

          <ExpandablePanel
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
      </LayerProvider>
    </DataProvider>
  )
}
