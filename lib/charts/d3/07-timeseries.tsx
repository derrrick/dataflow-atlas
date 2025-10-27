'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface TimeSeriesProps {
  unified?: UnifiedDataPoint[]
  width?: number
  height?: number
}

export function TimeSeries({
  unified = [],
  width = 280,
  height = 180
}: TimeSeriesProps) {
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
    if (!svgRef.current || !unified.length) return

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    const margin = { top: 50, right: 24, bottom: 12, left: 32 }

    // Sort by timestamp
    const sortedData = [...unified]
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 20)

    const data = sortedData.map((d, i) => ({
      index: i,
      value: d.primaryValue,
      timestamp: d.timestamp,
      source: d.source,
      dataType: d.dataType
    }))

    const x = d3.scaleLinear()
      .domain([0, data.length - 1])
      .range([margin.left, width - margin.right])

    const maxValue = d3.max(data, d => d.value) || 8
    const y = d3.scaleLinear()
      .domain([0, maxValue * 1.1])
      .range([height - margin.bottom, margin.top])

    const line = d3.line<typeof data[0]>()
      .x(d => x(d.index))
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX)

    // Find largest value for annotation
    const maxPoint = data.reduce((max, d) => d.value > max.value ? d : max)
    const threshold = data[0]?.dataType === 'earthquake' ? 6.0 : maxValue * 0.7
    const anomalyCount = data.filter(d => d.value >= threshold).length

    // Get chart color based on data type
    const dataType = data[0]?.dataType || 'earthquake'
    let chartColor = '#FF3B3B'
    if (dataType === 'wildfire') chartColor = '#FFB341'
    if (dataType === 'air_quality') chartColor = '#39D0FF'

    // Title
    svg.append('text')
      .attr('x', 0)
      .attr('y', 16)
      .attr('text-anchor', 'start')
      .style('fill', '#C6CFDA')
      .style('font-size', '13px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '500')
      .style('letter-spacing', '-0.01em')
      .text(dataType === 'earthquake' ? 'Seismic Activity' :
            dataType === 'wildfire' ? 'Wildfire Activity' :
            'Air Quality Levels')

    // Subtitle with anomaly count
    svg.append('text')
      .attr('x', 0)
      .attr('y', 32)
      .attr('text-anchor', 'start')
      .style('fill', chartColor)
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '500')
      .text(dataType === 'earthquake'
        ? `${anomalyCount} event${anomalyCount !== 1 ? 's' : ''} ≥ M6.0`
        : `${anomalyCount} high-value event${anomalyCount !== 1 ? 's' : ''}`
      )

    // Minimal baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Reference line at threshold
    if (maxValue >= threshold) {
      svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', y(threshold))
        .attr('x2', width - margin.right)
        .attr('y2', y(threshold))
        .style('stroke', chartColor)
        .style('stroke-width', '1px')
        .style('stroke-dasharray', '2,3')
        .style('opacity', 0.3)

      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(threshold) + 4)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(threshold.toFixed(1))
    }

    // Main line
    svg.append('path')
      .datum(data)
      .attr('d', line)
      .style('stroke', chartColor)
      .style('stroke-width', '1.5px')
      .style('fill', 'none')

    // Hover zones for each data point
    svg.selectAll('.hover-circle')
      .data(data)
      .join('circle')
      .attr('class', 'hover-circle')
      .attr('cx', d => x(d.index))
      .attr('cy', d => y(d.value))
      .attr('r', 8)
      .style('fill', 'transparent')
      .style('cursor', 'pointer')
      .on('mousemove', (event, d) => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        const timeStr = new Date(d.timestamp).toLocaleString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          title: dataType === 'earthquake' ? `M${d.value.toFixed(1)}` : d.value.toFixed(1),
          value: timeStr,
          source: d.source,
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

    // Peak annotation
    svg.append('circle')
      .attr('cx', x(maxPoint.index))
      .attr('cy', y(maxPoint.value))
      .attr('r', 2.5)
      .style('fill', chartColor)
      .style('stroke', '#0A0F16')
      .style('stroke-width', '2px')

    svg.append('text')
      .attr('x', x(maxPoint.index) + 6)
      .attr('y', y(maxPoint.value) + 1)
      .style('fill', chartColor)
      .style('font-size', '11px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '600')
      .text(dataType === 'earthquake' ? `M${maxPoint.value.toFixed(1)}` : maxPoint.value.toFixed(1))
  }, [unified, width, height])

  if (!unified.length) {
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
