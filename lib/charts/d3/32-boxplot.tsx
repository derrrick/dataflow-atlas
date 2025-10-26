'use client'

import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import type { Earthquake, UnifiedDataPoint } from '@/lib/services/dataTypes'
import { Tooltip } from '@/components/Tooltip'

interface BoxPlotProps {
  data?: Earthquake[] | UnifiedDataPoint[]
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function BoxPlot({
  data,
  unified,
  earthquakes,
  wildfires,
  airQuality,
  width = 280,
  height = 160
}: BoxPlotProps) {
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
    const margin = { top: 20, right: 16, bottom: 25, left: 30 }

    // Detect data format
    const isUnified = sourceData.length > 0 && 'primaryValue' in sourceData[0]

    let chartColor: string, valueLabel: string

    if (isUnified) {
      const unifiedData = sourceData as UnifiedDataPoint[]
      const dataType = unifiedData[0]?.dataType || 'earthquake'

      if (dataType === 'earthquake') {
        chartColor = '#FF3B3B'
        valueLabel = 'M'
      } else if (dataType === 'wildfire') {
        chartColor = '#FF8C00'
        valueLabel = ''
      } else if (dataType === 'air_quality') {
        chartColor = '#9370DB'
        valueLabel = 'AQI'
      } else {
        chartColor = '#FF3B3B'
        valueLabel = ''
      }
    } else {
      chartColor = '#FF3B3B'
      valueLabel = 'M'
    }

    const values = sourceData.map(d => {
      return isUnified ? (d as UnifiedDataPoint).primaryValue : (d as Earthquake).magnitude
    }).sort(d3.ascending)

    const q1 = d3.quantile(values, 0.25) || 0
    const median = d3.quantile(values, 0.5) || 0
    const q3 = d3.quantile(values, 0.75) || 0
    const iqr = q3 - q1
    const min = Math.max(d3.min(values) || 0, q1 - 1.5 * iqr)
    const max = Math.min(d3.max(values) || 10, q3 + 1.5 * iqr)

    const y = d3.scaleLinear()
      .domain([min - 0.5, max + 0.5])
      .range([height - margin.bottom, margin.top])

    const centerX = width / 2
    const boxWidth = 40

    svg.selectAll('*').remove()

    // Baseline
    svg.append('line')
      .attr('x1', margin.left)
      .attr('y1', height - margin.bottom)
      .attr('x2', width - margin.right)
      .attr('y2', height - margin.bottom)
      .style('stroke', '#242C3A')
      .style('stroke-width', '1px')

    // Whiskers
    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', y(min))
      .attr('x2', centerX)
      .attr('y2', y(q1))
      .style('stroke', '#5E6A81')
      .style('stroke-width', '1px')

    svg.append('line')
      .attr('x1', centerX)
      .attr('y1', y(max))
      .attr('x2', centerX)
      .attr('y2', y(q3))
      .style('stroke', '#5E6A81')
      .style('stroke-width', '1px')

    // Min/max caps
    svg.append('line')
      .attr('x1', centerX - 8)
      .attr('y1', y(min))
      .attr('x2', centerX + 8)
      .attr('y2', y(min))
      .style('stroke', '#5E6A81')
      .style('stroke-width', '1px')

    svg.append('line')
      .attr('x1', centerX - 8)
      .attr('y1', y(max))
      .attr('x2', centerX + 8)
      .attr('y2', y(max))
      .style('stroke', '#5E6A81')
      .style('stroke-width', '1px')

    // Get data type for source
    const dataType = isUnified ? (sourceData as UnifiedDataPoint[])[0]?.dataType : 'earthquake'
    const source = dataType === 'earthquake' ? 'USGS' : dataType === 'wildfire' ? 'NIFC' : 'AirNow'

    // Box
    svg.append('rect')
      .attr('x', centerX - boxWidth / 2)
      .attr('y', y(q3))
      .attr('width', boxWidth)
      .attr('height', y(q1) - y(q3))
      .style('fill', 'none')
      .style('stroke', chartColor)
      .style('stroke-width', '2px')
      .style('cursor', 'pointer')
      .on('mousemove', (event) => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          title: 'Interquartile Range',
          value: `Q1: ${valueLabel}${q1.toFixed(1)} → Q3: ${valueLabel}${q3.toFixed(1)} • IQR: ${iqr.toFixed(2)}`,
          source,
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

    // Median line
    svg.append('line')
      .attr('x1', centerX - boxWidth / 2)
      .attr('y1', y(median))
      .attr('x2', centerX + boxWidth / 2)
      .attr('y2', y(median))
      .style('stroke', chartColor)
      .style('stroke-width', '2px')
      .style('cursor', 'pointer')
      .on('mousemove', (event) => {
        if (hideTimeoutRef.current) {
          clearTimeout(hideTimeoutRef.current)
        }

        setTooltip({
          visible: true,
          x: event.clientX,
          y: event.clientY,
          title: 'Median (Q2)',
          value: `${valueLabel}${median.toFixed(1)}`,
          source,
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

    // Labels
    svg.append('text')
      .attr('x', centerX + boxWidth / 2 + 8)
      .attr('y', y(median) + 3)
      .attr('text-anchor', 'start')
      .style('fill', chartColor)
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .style('font-weight', '600')
      .text(valueLabel ? `${valueLabel}${median.toFixed(1)}` : median.toFixed(1))

    // Stats annotation
    svg.append('text')
      .attr('x', width / 2)
      .attr('y', 12)
      .attr('text-anchor', 'middle')
      .style('fill', '#8F9BB0')
      .style('font-size', '10px')
      .style('font-family', 'Geist Mono, monospace')
      .text(`n=${values.length} • IQR=${iqr.toFixed(2)}`)
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
