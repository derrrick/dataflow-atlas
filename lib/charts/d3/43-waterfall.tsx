'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface WaterfallProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function Waterfall({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 400,
  height = 280
}: WaterfallProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [tooltip, setTooltip] = useState({
    visible: false,
    x: 0,
    y: 0,
    title: '',
    value: '',
    source: '',
    timestamp: ''
  })
  const hideTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const sourceData = unified || data || earthquakes || wildfires || airQuality || []
    if (!svgRef.current || !sourceData.length) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, right: 16, bottom: 30, left: 40 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let buckets: { label: string; min: number; max: number }[], chartColor: string, totalColor: string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        buckets = [
          { label: '<4', min: 0, max: 4 },
          { label: '4-5', min: 4, max: 5 },
          { label: '5-6', min: 5, max: 6 },
          { label: '6-7', min: 6, max: 7 },
          { label: '7+', min: 7, max: 10 }
        ]
        chartColor = '#FF3B3B'
        totalColor = '#39D0FF'
      } else if (dataType === 'wildfire') {
        buckets = [
          { label: '<100', min: 0, max: 100 },
          { label: '100-1k', min: 100, max: 1000 },
          { label: '1k-5k', min: 1000, max: 5000 },
          { label: '5k-10k', min: 5000, max: 10000 },
          { label: '10k+', min: 10000, max: 100000 }
        ]
        chartColor = '#FF8C00'
        totalColor = '#FFB341'
      } else if (dataType === 'air_quality') {
        buckets = [
          { label: '0-50', min: 0, max: 50 },
          { label: '50-100', min: 50, max: 100 },
          { label: '100-150', min: 100, max: 150 },
          { label: '150-200', min: 150, max: 200 },
          { label: '200+', min: 200, max: 500 }
        ]
        chartColor = '#9370DB'
        totalColor = '#B695E5'
      } else {
        buckets = [
          { label: '<4', min: 0, max: 4 },
          { label: '4-5', min: 4, max: 5 },
          { label: '5-6', min: 5, max: 6 },
          { label: '6-7', min: 6, max: 7 },
          { label: '7+', min: 7, max: 10 }
        ]
        chartColor = '#FF3B3B'
        totalColor = '#39D0FF'
      }
    } else {
      buckets = [
        { label: '<4', min: 0, max: 4 },
        { label: '4-5', min: 4, max: 5 },
        { label: '5-6', min: 5, max: 6 },
        { label: '6-7', min: 6, max: 7 },
        { label: '7+', min: 7, max: 10 }
      ]
      chartColor = '#FF3B3B'
      totalColor = '#39D0FF'
    }

    const counts = buckets.map(b => ({
      label: b.label,
      value: sourceData.filter(e => {
        const value = isUnified ? (e as UnifiedDataPoint).primaryValue : (e as Earthquake).magnitude
        return value >= b.min && value < b.max
      }).length
    }))

    // Calculate cumulative positions
    let cumulative = 0
    const waterfallData = counts.map(d => {
      const start = cumulative
      cumulative += d.value
      return {
        label: d.label,
        value: d.value,
        start,
        end: cumulative
      }
    })

    // Add total
    waterfallData.push({
      label: 'Total',
      value: cumulative,
      start: 0,
      end: cumulative
    })

    const x = d3.scaleBand()
      .domain(waterfallData.map(d => d.label))
      .range([margin.left, width - margin.right])
      .padding(0.2)

    const y = d3.scaleLinear()
      .domain([0, cumulative])
      .range([height - margin.bottom, margin.top])
      .nice()

    svg.selectAll('*').remove()

    // Baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Bars
    waterfallData.forEach((d, i) => {
      const isTotal = d.label === 'Total'
      const dataType = isUnified ? (sourceData as UnifiedDataPoint[])[0]?.dataType : 'earthquake'
      const source = dataType === 'earthquake' ? 'USGS' : dataType === 'wildfire' ? 'NIFC' : 'AirNow'

      // Bar
      svg.append('rect')
        .attr('x', x(d.label) || 0)
        .attr('y', isTotal ? y(d.end) : y(d.end))
        .attr('width', x.bandwidth())
        .attr('height', isTotal ? height - margin.bottom - y(d.end) : y(d.start) - y(d.end))
        .style('fill', isTotal ? totalColor : chartColor)
        .style('opacity', isTotal ? 1 : 0.9)
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          // Clear existing timeout
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }

          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            title: d.label,
            value: isTotal ? `${d.value} total events` : `${d.value} events (${((d.value / waterfallData[waterfallData.length - 1].value) * 100).toFixed(1)}%)`,
            source,
            timestamp: 'Live'
          })

          // Auto-hide after 2 seconds
          hideTimeoutRef.current = setTimeout(() => {
            setTooltip(prev => ({ ...prev, visible: false }))
          }, 2000)
        })
        .on('mouseleave', () => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }
          setTooltip(prev => ({ ...prev, visible: false }))
        })

      // Connector line (except for last)
      if (i < waterfallData.length - 1 && !isTotal) {
        const nextX = x(waterfallData[i + 1].label) || 0
        svg.append('line')
          .attr('x1', (x(d.label) || 0) + x.bandwidth())
          .attr('y1', y(d.end))
          .attr('x2', nextX)
          .attr('y2', y(d.end))
          .style('stroke', '#5E6A81')
          .style('stroke-width', '1px')
          .style('stroke-dasharray', '2,2')
      }

      // Value label
      svg.append('text')
        .attr('x', (x(d.label) || 0) + x.bandwidth() / 2)
        .attr('y', isTotal ? y(d.end) - 6 : y(d.end) - 6)
        .attr('text-anchor', 'middle')
        .style('fill', isTotal ? totalColor : chartColor)
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(isTotal ? d.value : `+${d.value}`)
    })

    // X-axis labels
    waterfallData.forEach(d => {
      svg.append('text')
        .attr('x', (x(d.label) || 0) + x.bandwidth() / 2)
        .attr('y', height - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(d.label)
    })

    // Y-axis labels
    const yTicks = y.ticks(4)
    yTicks.forEach(tick => {
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(tick)
    })

  }, [data, unified, earthquakes, wildfires, airQuality, width, height])

  const sourceData = unified || data || earthquakes || wildfires || airQuality || []

  if (!sourceData.length) {
    return (
      <div style={{
        width,
        height,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#5E6A81',
        fontSize: '11px',
        fontFamily: 'Geist Mono, monospace'
      }}>
        No data
      </div>
    )
  }

  return (
    <>
      <svg ref={svgRef} width={width} height={height} />
      <Tooltip
        visible={tooltip.visible}
        x={tooltip.x}
        y={tooltip.y}
        title={tooltip.title}
        value={tooltip.value}
        source={tooltip.source}
        timestamp={tooltip.timestamp}
      />
    </>
  )
}
