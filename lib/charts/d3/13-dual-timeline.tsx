'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, Hazard, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface DualTimelineProps {
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  hazards?: Hazard[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function DualTimeline({
  unified,
  earthquakes = [],
  hazards = [],
  wildfires = [],
  airQuality = [],
  width = 400,
  height = 280
}: DualTimelineProps) {
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
    const svg = d3.select(svgRef.current)
    const margin = { top: 30, right: 50, bottom: 25, left: 40 }

    // Prepare data based on format
    let topData: any[], bottomData: any[]
    let topLabel: string, bottomLabel: string
    let topColor: string, bottomColor: string
    let isUnified = false

    if (unified && unified.length > 0) {
      isUnified = true
      // Group unified data by type
      const types = [...new Set(unified.map(d => d.dataType))]

      if (types.length >= 2) {
        // Use first two types
        topData = unified.filter(d => d.dataType === types[0]).sort((a, b) => a.timestamp - b.timestamp).slice(0, 50)
        bottomData = unified.filter(d => d.dataType === types[1]).sort((a, b) => a.timestamp - b.timestamp).slice(0, 50)

        topLabel = types[0] === 'earthquake' ? 'Earthquakes' : types[0] === 'wildfire' ? 'Wildfires' : types[0] === 'air_quality' ? 'Air Quality' : types[0]
        bottomLabel = types[1] === 'earthquake' ? 'Earthquakes' : types[1] === 'wildfire' ? 'Wildfires' : types[1] === 'air_quality' ? 'Air Quality' : types[1]

        topColor = topData[0]?.color || '#FF3B3B'
        bottomColor = bottomData[0]?.color || '#FFB341'
      } else if (types.length === 1) {
        // Split single type in half
        const sorted = [...unified].sort((a, b) => a.timestamp - b.timestamp)
        const mid = Math.floor(sorted.length / 2)
        topData = sorted.slice(0, mid)
        bottomData = sorted.slice(mid)

        topLabel = types[0] === 'earthquake' ? 'Earthquakes (early)' : 'Events (early)'
        bottomLabel = types[0] === 'earthquake' ? 'Earthquakes (recent)' : 'Events (recent)'

        topColor = topData[0]?.color || '#FF3B3B'
        bottomColor = bottomData[0]?.color || '#FFB341'
      } else {
        return
      }
    } else {
      // Legacy format
      const sortedEQ = [...earthquakes].sort((a, b) => a.time - b.time).slice(0, 50)
      const sortedHaz = [...hazards].sort((a, b) => a.timestamp - b.timestamp).slice(0, 50)
      const sortedFire = [...wildfires].sort((a: any, b: any) => a.timestamp - b.timestamp).slice(0, 50)

      if (sortedEQ.length > 0 && sortedHaz.length > 0) {
        topData = sortedEQ
        bottomData = sortedHaz
        topLabel = 'Earthquakes'
        bottomLabel = 'Hazards'
        topColor = '#FF3B3B'
        bottomColor = '#FFB341'
      } else if (sortedEQ.length > 0 && sortedFire.length > 0) {
        topData = sortedEQ
        bottomData = sortedFire
        topLabel = 'Earthquakes'
        bottomLabel = 'Wildfires'
        topColor = '#FF3B3B'
        bottomColor = '#FF8C00'
      } else if (sortedEQ.length > 0) {
        const mid = Math.floor(sortedEQ.length / 2)
        topData = sortedEQ.slice(0, mid)
        bottomData = sortedEQ.slice(mid)
        topLabel = 'Earthquakes (early)'
        bottomLabel = 'Earthquakes (recent)'
        topColor = '#FF3B3B'
        bottomColor = '#FF3B3B'
      } else {
        return
      }
    }

    if (!svgRef.current || (!topData.length && !bottomData.length)) return

    const allTimestamps = [
      ...topData.map(d => isUnified ? (d as UnifiedDataPoint).timestamp : (d as any).time || (d as any).timestamp),
      ...bottomData.map(d => isUnified ? (d as UnifiedDataPoint).timestamp : (d as any).time || (d as any).timestamp)
    ]

    if (allTimestamps.length === 0) return

    const x = d3.scaleTime()
      .domain(d3.extent(allTimestamps) as [Date, Date])
      .range([margin.left, width - margin.right])

    const midY = height / 2

    svg.selectAll('*').remove()

    // Center line
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', midY)
      .attr('x2', width - margin.right)
      .attr('y2', midY)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Top events (above)
    topData.forEach((d, i) => {
      const timestamp = isUnified ? (d as UnifiedDataPoint).timestamp : (d as any).time || (d as any).timestamp
      const value = isUnified ? (d as UnifiedDataPoint).primaryValue : (d as any).magnitude || 5
      const xPos = x(new Date(timestamp))
      const yOffset = (value / 10) * (midY - margin.top)

      svg.append('line')
        .attr('x1', xPos)
        .attr('y1', midY)
        .attr('x2', xPos)
        .attr('y2', midY - yOffset)
        .style('stroke', topColor)
        .style('stroke-width', '1.5px')
        .style('opacity', 0.7)
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }

          const date = new Date(timestamp)
          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            title: topLabel,
            value: `${value.toFixed(1)} • ${d3.timeFormat('%b %d, %H:%M')(date)}`,
            source: topLabel.includes('Earthquake') ? 'USGS' : topLabel.includes('Wildfire') ? 'NIFC' : 'AirNow',
            timestamp: 'Live'
          })

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

      if (value >= 6) {
        svg.append('circle')
          .attr('cx', xPos)
          .attr('cy', midY - yOffset)
          .attr('r', 3)
          .style('fill', topColor)
          .style('cursor', 'pointer')
          .on('mousemove', (event) => {
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
            }

            const date = new Date(timestamp)
            setTooltip({
              visible: true,
              x: event.clientX,
              y: event.clientY,
              title: `${topLabel} (Significant)`,
              value: `${value.toFixed(1)} • ${d3.timeFormat('%b %d, %H:%M')(date)}`,
              source: topLabel.includes('Earthquake') ? 'USGS' : topLabel.includes('Wildfire') ? 'NIFC' : 'AirNow',
              timestamp: 'Live'
            })

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
      }
    })

    // Bottom events (below)
    bottomData.forEach((d, i) => {
      const timestamp = isUnified ? (d as UnifiedDataPoint).timestamp : (d as any).time || (d as any).timestamp
      const value = isUnified ? (d as UnifiedDataPoint).primaryValue : (d as any).magnitude || (d as any).severity ? ((d as any).severity === 'High' ? 10 : (d as any).severity === 'Medium' ? 6 : 3) : 5
      const xPos = x(new Date(timestamp))
      const yOffset = (value / 10) * (height - margin.bottom - midY)

      svg.append('line')
        .attr('x1', xPos)
        .attr('y1', midY)
        .attr('x2', xPos)
        .attr('y2', midY + yOffset)
        .style('stroke', bottomColor)
        .style('stroke-width', '1.5px')
        .style('opacity', 0.7)
        .style('cursor', 'pointer')
        .on('mousemove', (event) => {
          if (hideTimeoutRef.current) {
            clearTimeout(hideTimeoutRef.current)
          }

          const date = new Date(timestamp)
          setTooltip({
            visible: true,
            x: event.clientX,
            y: event.clientY,
            title: bottomLabel,
            value: `${value.toFixed(1)} • ${d3.timeFormat('%b %d, %H:%M')(date)}`,
            source: bottomLabel.includes('Earthquake') ? 'USGS' : bottomLabel.includes('Wildfire') ? 'NIFC' : 'AirNow',
            timestamp: 'Live'
          })

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

      if (value >= 8) {
        svg.append('circle')
          .attr('cx', xPos)
          .attr('cy', midY + yOffset)
          .attr('r', 3)
          .style('fill', bottomColor)
          .style('cursor', 'pointer')
          .on('mousemove', (event) => {
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current)
            }

            const date = new Date(timestamp)
            setTooltip({
              visible: true,
              x: event.clientX,
              y: event.clientY,
              title: `${bottomLabel} (Significant)`,
              value: `${value.toFixed(1)} • ${d3.timeFormat('%b %d, %H:%M')(date)}`,
              source: bottomLabel.includes('Earthquake') ? 'USGS' : bottomLabel.includes('Wildfire') ? 'NIFC' : 'AirNow',
              timestamp: 'Live'
            })

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
      }
    })

    // Labels
    svg.append('text')
      .attr('x', margin.left)
      .attr('y', margin.top - 10)
      .style('fill', topColor)
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '600')
      .text(topLabel)

    svg.append('text')
      .attr('x', margin.left)
      .attr('y', height - 8)
      .style('fill', bottomColor)
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '600')
      .text(bottomLabel)

    // Time axis
    const xTicks = x.ticks(4)
    xTicks.forEach(tick => {
      svg.append('text')
        .attr('x', x(tick))
        .attr('y', midY - 6)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '8px')
        .style('font-family', 'Geist Mono, monospace')
        .text(d3.timeFormat('%m/%d')(tick))
    })

    // Count stats
    svg.append('text')
      .attr('x', width - margin.right)
      .attr('y', margin.top - 10)
      .attr('text-anchor', 'end')
      .style('fill', '#8F9BB0')
      .style('font-size', '9px')
      .style('font-family', 'Geist Mono, monospace')
      .text(`n=${topData.length + bottomData.length}`)

  }, [unified, earthquakes, hazards, wildfires, airQuality, width, height])

  const hasData = unified && unified.length > 0 || earthquakes.length > 0 || hazards.length > 0 || wildfires.length > 0 || airQuality.length > 0

  if (!hasData) {
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
