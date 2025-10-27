'use client'

import { useState, useMemo, useRef, useEffect, memo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useLayer } from '@/contexts/LayerContext'
import { chartRegistry } from '@/lib/charts/registry'
import FilterSidebar, { ChartFilters } from './FilterSidebar'
import StorytellingFilterSidebar from './StorytellingFilterSidebar'
import EnhancedChartModal from './EnhancedChartModal'
import { exportChartContainer } from '@/lib/utils/chartExport'
import { unifyAllData } from '@/lib/utils/dataNormalization'

// Lazy loading chart wrapper with Intersection Observer
const LazyChartWrapper = memo(function LazyChartWrapper({ Component, ...props }: any) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [hasRendered, setHasRendered] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 400, height: 280 })

  useEffect(() => {
    if (!containerRef.current) return

    // Intersection Observer for lazy loading
    const observer = new IntersectionObserver(
      ([entry]) => {
        // Only render when actually in viewport
        if (entry.isIntersecting && entry.intersectionRatio > 0) {
          setIsVisible(true)
          setHasRendered(true)
        } else if (hasRendered) {
          // Keep rendered charts in memory but mark as not visible
          setIsVisible(false)
        }
      },
      {
        rootMargin: '50px', // Reduced from 100px - only load when very close
        threshold: 0.01 // Trigger as soon as 1% is visible
      }
    )

    observer.observe(containerRef.current)

    return () => observer.disconnect()
  }, [hasRendered])

  useEffect(() => {
    if (!containerRef.current || !isVisible) return

    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()

    const resizeObserver = new ResizeObserver(updateDimensions)
    resizeObserver.observe(containerRef.current)

    return () => resizeObserver.disconnect()
  }, [isVisible])

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      {hasRendered ? (
        <Component {...props} width={dimensions.width} height={dimensions.height} />
      ) : (
        <div style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#5E6A81',
          fontSize: '11px',
          fontFamily: 'Geist Mono, monospace'
        }}>
          Loading...
        </div>
      )}
    </div>
  )
})

interface ChartGridProps {
  showFilters?: boolean
  storytellingMode?: boolean // Use narrative-focused filters instead of technical
}

export default function ChartGrid({ showFilters = false, storytellingMode = true }: ChartGridProps) {
  const { earthquakes, hazards, outages, latencyPoints, airQuality, wildfires } = useData()
  const { activeLayers } = useLayer()
  const [chartsToShow, setChartsToShow] = useState(9) // Only show 9 charts initially
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)
  const [hoveredChartId, setHoveredChartId] = useState<string | null>(null)
  const chartRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const [filters, setFilters] = useState<ChartFilters>({
    categories: [],
    dataSources: [],
    implemented: true, // Default to only showing implemented charts
    priorities: [],
    phases: [],
    searchQuery: ''
  })

  // Create unified data based on active layers
  const unifiedData = useMemo(() => {
    return unifyAllData({
      earthquakes: earthquakes || [],
      wildfires: wildfires || [],
      airQuality: airQuality || [],
      hazards: hazards || [],
      outages: outages || [],
      latency: latencyPoints || [],
      activeLayers,
    })
  }, [earthquakes, wildfires, airQuality, hazards, outages, latencyPoints, activeLayers])

  // Limit data size for performance - sample if too large
  const sampledData = useMemo(() => {
    const maxDataPoints = 50 // Reduced from 100 to 50

    // Keep both unified and legacy format for backwards compatibility
    const unified = unifiedData.length > maxDataPoints
      ? unifiedData.slice(0, maxDataPoints)
      : unifiedData

    return {
      unified,
      // Legacy format (keep for existing charts)
      earthquakes: earthquakes?.length > maxDataPoints
        ? earthquakes.slice(0, maxDataPoints)
        : (earthquakes || []),
      hazards: hazards?.length > maxDataPoints
        ? hazards.slice(0, maxDataPoints)
        : (hazards || []),
      outages: outages?.length > maxDataPoints
        ? outages.slice(0, maxDataPoints)
        : (outages || []),
      latency: latencyPoints?.length > maxDataPoints
        ? latencyPoints.slice(0, maxDataPoints)
        : (latencyPoints || []),
      airQuality: airQuality?.length > maxDataPoints
        ? airQuality.slice(0, maxDataPoints)
        : (airQuality || []),
      wildfires: wildfires?.length > maxDataPoints
        ? wildfires.slice(0, maxDataPoints)
        : (wildfires || []),
    }
  }, [unifiedData, earthquakes, hazards, outages, latencyPoints, airQuality, wildfires])

  // Apply filters to chart registry
  const filteredCharts = useMemo(() => {
    return chartRegistry.filter((chart) => {
      // Search query filter
      if (filters.searchQuery) {
        const query = filters.searchQuery.toLowerCase()
        const matchesName = chart.name.toLowerCase().includes(query)
        const matchesNumber = chart.number.toLowerCase().includes(query)
        const matchesCategory = chart.category.toLowerCase().includes(query)
        if (!matchesName && !matchesNumber && !matchesCategory) {
          return false
        }
      }

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(chart.category)) {
        return false
      }

      // Data source filter
      if (filters.dataSources.length > 0) {
        const hasMatchingDataSource = chart.dataSources.some((ds) =>
          filters.dataSources.includes(ds)
        )
        if (!hasMatchingDataSource) return false
      }

      // Implementation status filter
      if (filters.implemented !== null && chart.implemented !== filters.implemented) {
        return false
      }

      // Priority filter
      if (filters.priorities.length > 0 && !filters.priorities.includes(chart.priority)) {
        return false
      }

      // Phase filter
      if (filters.phases.length > 0 && !filters.phases.includes(chart.phase)) {
        return false
      }

      return true
    })
  }, [filters])

  return (
    <div style={{
      display: 'flex',
      height: '100%',
      overflow: 'hidden'
    }}>
      {/* Filter Sidebar */}
      {showFilters && (
        storytellingMode ? (
          <StorytellingFilterSidebar onFiltersChange={setFilters as any} />
        ) : (
          <FilterSidebar onFiltersChange={setFilters} />
        )
      )}

      {/* Chart Grid */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#0A0F16'
      }}>
        {/* Results Count */}
        {showFilters && (
          <div style={{
            padding: '24px 32px',
            borderBottom: '1px solid #242C3A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#080D12'
          }}>
            <span style={{
              fontSize: '11px',
              color: '#5E6A81',
              fontFamily: 'Geist Mono, monospace',
              letterSpacing: '0.5px',
              textTransform: 'uppercase'
            }}>
              Showing {filteredCharts.length} / {chartRegistry.length}
            </span>
          </div>
        )}

        {/* Charts */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '24px',
          padding: '32px',
          gridAutoRows: 'minmax(400px, auto)'
        }}>
          {filteredCharts.length === 0 ? (
            <div style={{
              gridColumn: '1 / -1',
              padding: '96px 32px',
              textAlign: 'center'
            }}>
              <div style={{
                fontSize: '48px',
                color: '#242C3A',
                marginBottom: '16px'
              }}>
                ∅
              </div>
              <div style={{
                fontSize: '11px',
                color: '#5E6A81',
                fontFamily: 'Geist Mono, monospace',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                No charts match filters
              </div>
            </div>
          ) : (
            filteredCharts.slice(0, chartsToShow).map((chart) => {
        const Component = chart.Component
        const gridColumnSpan = chart.gridColumn || 1
        const gridRowSpan = chart.gridRow || 1
        const chartHeight = chart.height || 400
        const isHovered = hoveredChartId === chart.id

        return (
          <div
            key={chart.id}
            ref={(el) => {
              if (el) chartRefs.current.set(chart.id, el)
            }}
            onClick={() => setSelectedChartId(chart.id)}
            onMouseEnter={() => setHoveredChartId(chart.id)}
            onMouseLeave={() => setHoveredChartId(null)}
            style={{
              backgroundColor: '#0A0F16',
              border: '1px solid #242C3A',
              borderLeft: isHovered ? '2px solid #39D0FF' : '1px solid #242C3A',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: `${chartHeight}px`,
              gridColumn: `span ${gridColumnSpan}`,
              gridRow: `span ${gridRowSpan}`,
              transition: 'border-left 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              cursor: 'pointer'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '16px',
              borderBottom: '1px solid #242C3A',
              backgroundColor: '#080D12',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px'
            }}>
              <span style={{
                fontFamily: 'Geist Mono, monospace',
                fontSize: '10px',
                color: '#39D0FF',
                fontWeight: 600,
                letterSpacing: '0.5px'
              }}>
                {chart.number}
              </span>
              <h3 style={{
                fontSize: '14px',
                color: '#FFFFFF',
                fontWeight: 400,
                fontFamily: 'Albert Sans, sans-serif',
                margin: 0,
                lineHeight: '1.3'
              }}>
                {chart.name}
              </h3>
            </div>

            {/* Chart Content */}
            <div style={{
              flex: 1,
              padding: '16px',
              position: 'relative',
              minHeight: 0
            }}>
              <LazyChartWrapper
                Component={Component}
                data={sampledData.unified || []}
                unified={sampledData.unified || []}
                earthquakes={sampledData.earthquakes || []}
                hazards={sampledData.hazards || []}
                outages={sampledData.outages || []}
                latency={sampledData.latency || []}
                airQuality={sampledData.airQuality || []}
                wildfires={sampledData.wildfires || []}
                activeLayers={activeLayers}
              />
            </div>

            {/* Footer */}
            <div style={{
              padding: '12px 16px',
              borderTop: '1px solid #242C3A',
              backgroundColor: '#080D12',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '10px',
                color: '#5E6A81',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                fontFamily: 'Geist Mono, monospace',
                fontWeight: 600
              }}>
                {chart.category}
              </span>
              <span style={{
                fontSize: '10px',
                color: '#5E6A81',
                fontFamily: 'Geist Mono, monospace',
                letterSpacing: '0.5px'
              }}>
                P{chart.phase}
              </span>
            </div>
          </div>
        )
      }))}
        </div>

        {/* Load More Button */}
        {chartsToShow < filteredCharts.length && (
          <div style={{
            padding: '48px 32px',
            display: 'flex',
            justifyContent: 'center',
            borderTop: '1px solid #242C3A',
            backgroundColor: '#080D12'
          }}>
            <button
              onClick={() => setChartsToShow(prev => prev + 9)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#39D0FF'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#242C3A'
                e.currentTarget.style.color = '#8F9BB0'
              }}
              style={{
                padding: '16px 48px',
                fontSize: '11px',
                fontWeight: 600,
                fontFamily: 'Geist Mono, monospace',
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                color: '#8F9BB0',
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}>
              Load {filteredCharts.length - chartsToShow} More
            </button>
          </div>
        )}
      </div>

      {/* Enhanced Chart Modal */}
      {selectedChartId && (() => {
        const selectedChart = filteredCharts.find(c => c.id === selectedChartId)
        if (!selectedChart) return null

        const Component = selectedChart.Component
        const currentIndex = filteredCharts.findIndex(c => c.id === selectedChartId)

        return (
          <EnhancedChartModal
            isOpen={true}
            onClose={() => setSelectedChartId(null)}
            chartId={selectedChart.number}
            chartName={selectedChart.name}
            chartDescription={selectedChart.description}
            category={selectedChart.category}
            data={sampledData.unified || []}
            chartComponent={
              <Component
                unified={sampledData.unified || []}
                data={sampledData.unified || []}
                earthquakes={sampledData.earthquakes || []}
                hazards={sampledData.hazards || []}
                outages={sampledData.outages || []}
                latency={sampledData.latency || []}
                airQuality={sampledData.airQuality || []}
                wildfires={sampledData.wildfires || []}
                width={1200}
                height={700}
              />
            }
            onNavigate={(direction) => {
              if (direction === 'prev' && currentIndex > 0) {
                setSelectedChartId(filteredCharts[currentIndex - 1].id)
              } else if (direction === 'next' && currentIndex < filteredCharts.length - 1) {
                setSelectedChartId(filteredCharts[currentIndex + 1].id)
              }
            }}
            canNavigate={{
              prev: currentIndex > 0,
              next: currentIndex < filteredCharts.length - 1
            }}
            onExport={(format) => {
              const chartRef = chartRefs.current.get(selectedChartId)
              if (chartRef) {
                exportChartContainer(
                  chartRef,
                  format,
                  sampledData.unified || [],
                  `${selectedChart.number}-${selectedChart.name.toLowerCase().replace(/\s+/g, '-')}`
                )
              }
            }}
          />
        )
      })()}
    </div>
  )
}
