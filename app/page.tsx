'use client'

import { Suspense, useState, useRef, useEffect } from 'react'
import dynamic from 'next/dynamic'
import { ChartNoAxesColumn, ChevronUp, ChevronDown, Search, SlidersHorizontal, X, Plus, ChevronLeft, ChevronRight } from 'lucide-react'
import { LayerProvider, useLayer, type Layer } from '@/contexts/LayerContext'
import { DataProvider, useData } from '@/contexts/DataContext'
import { TimeProvider } from '@/contexts/TimeContext'
import { layerConfigMap } from '@/lib/layerConfig'
import LayerControlsV2 from '@/components/LayerControlsV2'
import AnalyticalStrip from '@/components/AnalyticalStrip'
import Header from '@/components/Header'
import ExpandablePanel from '@/components/ExpandablePanel'
import ChartGrid from '@/components/ChartGrid'
import DataStatusBanner from '@/components/DataStatusBanner'
import DataFeedStatus from '@/components/DataFeedStatus'
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
  const { t0, t1 } = useTime()
  const { isRefreshing, lastRefresh } = useData()
  const { activeLayers, toggleLayer } = useLayer()
  const [panelExpanded, setPanelExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [controlsExpanded, setControlsExpanded] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)
  const controlsContainerRef = useRef<HTMLDivElement>(null)
  const pillsScrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Convert activeLayers Set to array and get configs
  const activeLayerConfigs = Array.from(activeLayers)
    .map(layerId => layerConfigMap.get(layerId as Layer))
    .filter((config): config is NonNullable<typeof config> => config !== undefined)

  // Check scroll position and update arrow states
  const checkScroll = () => {
    if (!pillsScrollRef.current) return
    const { scrollLeft, scrollWidth, clientWidth } = pillsScrollRef.current
    const hasOverflow = scrollWidth > clientWidth

    setCanScrollLeft(scrollLeft > 1)
    setCanScrollRight(hasOverflow && scrollLeft < scrollWidth - clientWidth - 1)
  }

  // Scroll pills left or right
  const scrollPills = (direction: 'left' | 'right') => {
    if (!pillsScrollRef.current) return
    const scrollAmount = 200
    const newScrollLeft = pillsScrollRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount)
    pillsScrollRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    })
  }

  // Check scroll on mount and when pills change
  useEffect(() => {
    // Initial check with delay to ensure DOM is ready
    const timer = setTimeout(checkScroll, 100)

    const scrollContainer = pillsScrollRef.current
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', checkScroll)

      // Also check on window resize
      window.addEventListener('resize', checkScroll)

      // Use ResizeObserver for better detection
      const resizeObserver = new ResizeObserver(checkScroll)
      resizeObserver.observe(scrollContainer)

      return () => {
        clearTimeout(timer)
        scrollContainer.removeEventListener('scroll', checkScroll)
        window.removeEventListener('resize', checkScroll)
        resizeObserver.disconnect()
      }
    }

    return () => clearTimeout(timer)
  }, [activeLayerConfigs])

  // Handle search submission
  const handleSearch = async () => {
    if (!searchQuery.trim()) return

    try {
      // Use Nominatim geocoding API (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`,
        {
          headers: {
            'User-Agent': 'DataflowAtlas/1.0'
          }
        }
      )
      const data = await response.json()

      if (data && data.length > 0) {
        const { lat, lon } = data[0]
        // Dispatch custom event for map to listen to
        const event = new CustomEvent('map:search', {
          detail: {
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            zoom: 8
          }
        })
        window.dispatchEvent(event)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  // Handle Enter key press in search
  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

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

            {/* Filter and Search Field - Top Left */}
            <div style={{
              position: 'absolute',
              left: '24px',
              top: '24px',
              zIndex: 100,
              display: 'flex',
              gap: '12px'
            }}>
              {/* Map Controls Button */}
              <div
                ref={controlsContainerRef}
                style={{
                  position: 'relative'
                }}
              >
                {/* Sliders Icon Button */}
                <button
                  onClick={() => setControlsExpanded(!controlsExpanded)}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(10, 15, 22, 0.5)',
                    border: '1px solid #242C3A',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0
                  }}
                >
                  <SlidersHorizontal size={20} style={{ color: '#8F9BB0' }} />
                </button>

                {/* Expanded Map Controls */}
                {controlsExpanded && (
                  <div style={{
                    position: 'absolute',
                    top: '60px',
                    left: '0'
                  }}>
                    <LayerControlsV2 />
                  </div>
                )}
              </div>

              {/* Search Field */}
              <div style={{
                position: 'relative',
                width: '300px',
                height: '48px',
                backgroundColor: 'rgba(10, 15, 22, 0.5)',
                border: '1px solid #242C3A',
                borderRadius: '24px',
                display: 'flex',
                alignItems: 'center',
                boxSizing: 'border-box'
              }}>
                {/* Search Icon */}
                <div style={{
                  minWidth: '46px',
                  width: '46px',
                  height: '46px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  position: 'relative',
                  left: '1px',
                  top: '1px'
                }}>
                  <Search size={20} style={{ color: '#8F9BB0', display: 'block' }} />
                </div>

                {/* Input Field */}
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={handleSearchKeyDown}
                  placeholder="Search locations..."
                  style={{
                    flex: 1,
                    height: '100%',
                    padding: '0 16px 0 0',
                    fontSize: '14px',
                    fontFamily: 'Albert Sans, sans-serif',
                    color: '#FFFFFF',
                    backgroundColor: 'transparent',
                    border: 'none',
                    outline: 'none'
                  }}
                />
              </div>

              {/* Active Layer Pills or Add Button */}
              {activeLayerConfigs.length === 0 ? (
                // Null state: + button to add layers
                <button
                  onClick={() => setControlsExpanded(true)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#39D0FF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#242C3A'
                  }}
                  style={{
                    width: '48px',
                    height: '48px',
                    backgroundColor: 'rgba(10, 15, 22, 0.5)',
                    border: '1px solid #242C3A',
                    borderRadius: '24px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    padding: 0,
                    transition: 'border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                  }}
                  title="Add layers"
                >
                  <Plus size={20} style={{ color: '#8F9BB0' }} />
                </button>
              ) : (
                // Active layers: scrollable pills with nav arrows
                <div style={{
                  position: 'relative',
                  flex: 1,
                  maxWidth: 'calc(100vw - 24px - 48px - 12px - 300px - 12px - 24px)', // viewport - padding - filter - gap - search - gap - padding
                  display: 'flex',
                  alignItems: 'center'
                }}>
                  {/* Left navigation arrow */}
                  {canScrollLeft && (
                    <button
                      onClick={() => scrollPills('left')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.8)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.5)'
                      }}
                      style={{
                        position: 'absolute',
                        left: '0',
                        zIndex: 10,
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(10, 15, 22, 0.5)',
                        border: '1px solid #242C3A',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      title="Scroll left"
                    >
                      <ChevronLeft size={18} style={{ color: '#8F9BB0' }} />
                    </button>
                  )}

                  {/* Scrollable pills container */}
                  <div
                    ref={pillsScrollRef}
                    style={{
                      display: 'flex',
                      gap: '8px',
                      overflowX: 'auto',
                      overflowY: 'hidden',
                      scrollbarWidth: 'none',
                      msOverflowStyle: 'none',
                      paddingLeft: canScrollLeft ? '40px' : '0',
                      paddingRight: canScrollRight ? '40px' : '0',
                      transition: 'padding 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                    className="hide-scrollbar"
                  >
                    {activeLayerConfigs.map((config) => (
                      <button
                        key={config.id}
                        onClick={() => toggleLayer(config.id)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.8)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.5)'
                        }}
                        style={{
                          height: '32px',
                          padding: '0 12px',
                          backgroundColor: 'rgba(10, 15, 22, 0.5)',
                          border: `1px solid ${config.color}`,
                          borderRadius: '100px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          cursor: 'pointer',
                          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                          whiteSpace: 'nowrap',
                          flexShrink: 0
                        }}
                        title={`Remove ${config.label}`}
                      >
                        <span style={{
                          fontSize: '9px',
                          fontWeight: 500,
                          fontFamily: 'Geist Mono, monospace',
                          color: '#FFFFFF',
                          letterSpacing: '0.02em'
                        }}>
                          {config.label}
                        </span>
                        <X size={12} style={{ color: '#8F9BB0', flexShrink: 0 }} />
                      </button>
                    ))}
                  </div>

                  {/* Right navigation arrow */}
                  {canScrollRight && (
                    <button
                      onClick={() => scrollPills('right')}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.8)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.5)'
                      }}
                      style={{
                        position: 'absolute',
                        right: '0',
                        zIndex: 10,
                        width: '32px',
                        height: '32px',
                        backgroundColor: 'rgba(10, 15, 22, 0.5)',
                        border: '1px solid #242C3A',
                        borderRadius: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        padding: 0,
                        transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      title="Scroll right"
                    >
                      <ChevronRight size={18} style={{ color: '#8F9BB0' }} />
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Hide scrollbar globally */}
            <style jsx>{`
              .hide-scrollbar::-webkit-scrollbar {
                display: none;
              }
            `}</style>

            {/* Data Feed Status - Bottom Left */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '24px',
              zIndex: 10
            }}>
              <DataFeedStatus isRefreshing={isRefreshing} lastRefresh={lastRefresh} />
            </div>

            {/* Explore the data button */}
            <div style={{
              position: 'absolute',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              zIndex: panelExpanded ? 1001 : 100
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
