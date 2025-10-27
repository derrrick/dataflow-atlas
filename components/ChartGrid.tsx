'use client'

import { useState, useMemo, useRef, useEffect, memo } from 'react'
import { useData } from '@/contexts/DataContext'
import { useLayer } from '@/contexts/LayerContext'
import { chartRegistry } from '@/lib/charts/registry'
import FilterSidebar, { ChartFilters } from './FilterSidebar'
import ChartModal from './ChartModal'
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
}

export default function ChartGrid({ showFilters = false }: ChartGridProps) {
  const { earthquakes, hazards, outages, latencyPoints, airQuality, wildfires } = useData()
  const { activeLayers } = useLayer()
  const [chartsToShow, setChartsToShow] = useState(9) // Only show 9 charts initially
  const [selectedChartId, setSelectedChartId] = useState<string | null>(null)
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
      {showFilters && <FilterSidebar onFiltersChange={setFilters} />}

      {/* Chart Grid */}
      <div style={{
        flex: 1,
        overflow: 'auto',
        backgroundColor: '#0A0F16'
      }}>
        {/* Results Count */}
        {showFilters && (
          <div style={{
            padding: '16px 24px',
            borderBottom: '1px solid #242C3A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span style={{
              fontSize: '11px',
              color: '#8F9BB0',
              fontFamily: 'Geist Mono, monospace'
            }}>
              {filteredCharts.length} of {chartRegistry.length} charts
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
              padding: '60px 24px',
              textAlign: 'center',
              color: '#5E6A81',
              fontSize: '12px',
              fontFamily: 'Geist Mono, monospace'
            }}>
              No charts match the selected filters
            </div>
          ) : (
            filteredCharts.slice(0, chartsToShow).map((chart) => {
        const Component = chart.Component
        const gridColumnSpan = chart.gridColumn || 1
        const gridRowSpan = chart.gridRow || 1
        const chartHeight = chart.height || 400

        return (
          <div
            key={chart.id}
            ref={(el) => {
              if (el) chartRefs.current.set(chart.id, el)
            }}
            onClick={() => setSelectedChartId(chart.id)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              border: '1px solid #242C3A',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              height: `${chartHeight}px`,
              gridColumn: `span ${gridColumnSpan}`,
              gridRow: `span ${gridRowSpan}`,
              transition: 'all 200ms ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)'
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
              e.currentTarget.style.transform = 'translateY(-2px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.02)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
          >
            {/* Header */}
            <div style={{
              padding: '12px 16px',
              borderBottom: '1px solid #242C3A',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <span style={{
                fontFamily: 'monospace',
                fontSize: '10px',
                color: '#5E6A81',
                fontWeight: 500
              }}>
                {chart.number}
              </span>
              <h3 style={{
                fontSize: '13px',
                color: '#C6CFDA',
                fontWeight: 300,
                margin: 0,
                flex: 1
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
              padding: '8px 16px',
              borderTop: '1px solid #242C3A',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <span style={{
                fontSize: '10px',
                color: '#5E6A81',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {chart.category}
              </span>
              <span style={{
                fontSize: '9px',
                color: '#3A4559',
                fontFamily: 'monospace'
              }}>
                Phase {chart.phase}
              </span>
            </div>
          </div>
        )
      }))}
        </div>

        {/* Load More Button */}
        {chartsToShow < filteredCharts.length && (
          <div style={{
            padding: '32px',
            textAlign: 'center'
          }}>
            <button
              onClick={() => setChartsToShow(prev => prev + 9)}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#39D0FF15'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.boxShadow = 'none'
              }}
              style={{
                padding: '12px 24px',
                fontSize: '13px',
                fontWeight: 400,
                fontFamily: 'Albert Sans, sans-serif',
                color: '#FFFFFF',
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}>
              Load More Charts ({filteredCharts.length - chartsToShow} remaining)
            </button>
          </div>
        )}
      </div>

      {/* Chart Modal */}
      {selectedChartId && (() => {
        const selectedChart = filteredCharts.find(c => c.id === selectedChartId)
        if (!selectedChart) return null

        const Component = selectedChart.Component
        const currentIndex = filteredCharts.findIndex(c => c.id === selectedChartId)

        return (
          <ChartModal
            isOpen={true}
            onClose={() => setSelectedChartId(null)}
            chartId={selectedChart.number}
            chartName={selectedChart.name}
            chartComponent={
              <Component
                data={sampledData.earthquakes || []}
                earthquakes={sampledData.earthquakes || []}
                hazards={sampledData.hazards || []}
                outages={sampledData.outages || []}
                latency={sampledData.latency || []}
                width={1200}
                height={700}
              />
            }
            onExport={(format) => {
              const chartRef = chartRefs.current.get(selectedChartId)
              if (chartRef) {
                exportChartContainer(
                  chartRef,
                  format,
                  sampledData.earthquakes || [], // Pass data for CSV/JSON export
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
