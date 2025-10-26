'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import { useData } from '@/contexts/DataContext'

export default function AnalyticalStrip() {
  const sparklineRef = useRef<SVGSVGElement>(null)
  const slopegraphRef = useRef<SVGSVGElement>(null)
  const multiplesRef = useRef<SVGSVGElement>(null)
  const timeseriesRef = useRef<SVGSVGElement>(null)

  const { earthquakes, hazards, outages, latencyPoints } = useData()

  useEffect(() => {
    // Tufte-style Sparkline: Earthquake magnitude trend
    if (sparklineRef.current && earthquakes.length > 0) {
      const svg = d3.select(sparklineRef.current)
      const width = 280
      const height = 180
      const margin = { top: 50, right: 40, bottom: 30, left: 40 }

      const sortedEarthquakes = [...earthquakes]
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, 24)

      const data = sortedEarthquakes.map((eq, i) => ({
        index: i,
        value: eq.magnitude,
      }))

      const avgMagnitude = d3.mean(data, d => d.value) || 0
      const maxMagnitude = d3.max(data, d => d.value) || 0
      const minMagnitude = d3.min(data, d => d.value) || 0

      const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([margin.left, width - margin.right])

      const y = d3.scaleLinear()
        .domain([Math.floor(minMagnitude - 0.5), Math.ceil(maxMagnitude + 0.5)])
        .range([height - margin.bottom, margin.top])

      const line = d3.line<typeof data[0]>()
        .x(d => x(d.index))
        .y(d => y(d.value))
        .curve(d3.curveMonotoneX)

      svg.selectAll('*').remove()

      // Title
      svg.append('text')
        .attr('x', 0)
        .attr('y', 16)
        .style('fill', '#C6CFDA')
        .style('font-size', '13px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '500')
        .style('letter-spacing', '-0.01em')
        .text('Earthquake Magnitude')

      // Subtitle with stats
      svg.append('text')
        .attr('x', 0)
        .attr('y', 32)
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '400')
        .text(`${earthquakes.length} events • Avg M${avgMagnitude.toFixed(1)}`)

      // Minimal baseline
      svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', height - margin.bottom)
        .attr('x2', width - margin.right)
        .attr('y2', height - margin.bottom)
        .style('stroke', '#242C3A')
        .style('stroke-width', '1px')

      // Subtle reference line for average
      svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', y(avgMagnitude))
        .attr('x2', width - margin.right)
        .attr('y2', y(avgMagnitude))
        .style('stroke', '#2F394B')
        .style('stroke-width', '1px')
        .style('stroke-dasharray', '2,3')
        .style('opacity', 0.5)

      // Main line - thinner, more elegant
      svg.append('path')
        .datum(data)
        .attr('d', line)
        .style('stroke', '#FF3B3B')
        .style('stroke-width', '1.5px')
        .style('fill', 'none')

      // Direct label for max point
      const maxPoint = data.reduce((max, d) => d.value > max.value ? d : max)
      svg.append('circle')
        .attr('cx', x(maxPoint.index))
        .attr('cy', y(maxPoint.value))
        .attr('r', 2.5)
        .style('fill', '#FF3B3B')
        .style('stroke', '#0A0F16')
        .style('stroke-width', '2px')

      svg.append('text')
        .attr('x', x(maxPoint.index) + 6)
        .attr('y', y(maxPoint.value) + 1)
        .style('fill', '#FF3B3B')
        .style('font-size', '11px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(`M${maxPoint.value.toFixed(1)}`)

      // Y-axis labels - minimal, direct
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(maxMagnitude) + 4)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .text(maxMagnitude.toFixed(1))

      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(minMagnitude) + 4)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .text(minMagnitude.toFixed(1))
    }

    // Slopegraph: Regional latency comparison
    if (slopegraphRef.current && latencyPoints.length > 0) {
      const svg = d3.select(slopegraphRef.current)
      const width = 280
      const height = 180
      const margin = { top: 40, right: 56, bottom: 24, left: 56 }

      // Group latency points by region and calculate averages
      const regionData = d3.rollup(
        latencyPoints,
        v => d3.mean(v, d => d.latency) || 0,
        d => d.region
      )

      // Create slope data (simulate "before" as 90% of current for visualization)
      const data = Array.from(regionData, ([region, current]) => ({
        region,
        start: current * 0.9,
        end: current,
      })).slice(0, 4)

      if (data.length === 0) return

      const maxLatency = d3.max(data, d => Math.max(d.start, d.end)) || 100
      const highlighted = data.reduce((max, d) =>
        (d.end - d.start) > (max.end - max.start) ? d : max
      )

      const y = d3.scaleLinear()
        .domain([0, maxLatency * 1.1])
        .range([height - margin.bottom, margin.top])

      const x1 = margin.left
      const x2 = width - margin.right

      svg.selectAll('*').remove()

      const change = ((highlighted.end - highlighted.start) / highlighted.start) * 100

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
        .text('Regional Latency')

      // Subtitle showing largest change
      svg.append('text')
        .attr('x', 0)
        .attr('y', 32)
        .attr('text-anchor', 'start')
        .style('fill', '#39D0FF')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '500')
        .text(`${highlighted.region} ${change > 0 ? '+' : ''}${change.toFixed(1)}%`)

      // Minimal baseline
      svg.append('line')
        .attr('x1', x1)
        .attr('y1', height - margin.bottom)
        .attr('x2', x2)
        .attr('y2', height - margin.bottom)
        .style('stroke', '#242C3A')
        .style('stroke-width', '1px')

      // Lines with minimal style
      svg.selectAll('.slope-line')
        .data(data)
        .join('line')
        .attr('x1', x1)
        .attr('y1', d => y(d.start))
        .attr('x2', x2)
        .attr('y2', d => y(d.end))
        .style('stroke', d => d.region === highlighted.region ? '#39D0FF' : '#3F4B5E')
        .style('stroke-width', d => d.region === highlighted.region ? '2px' : '1px')
        .style('opacity', d => d.region === highlighted.region ? 1 : 0.4)

      // Start labels - minimal, direct
      svg.selectAll('.start-label')
        .data(data)
        .join('text')
        .attr('x', x1 - 8)
        .attr('y', d => y(d.start))
        .attr('text-anchor', 'end')
        .attr('alignment-baseline', 'middle')
        .style('fill', d => d.region === highlighted.region ? '#C6CFDA' : '#5E6A81')
        .style('font-size', '11px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', d => d.region === highlighted.region ? '500' : '400')
        .text(d => `${d.start.toFixed(0)}ms`)

      // End labels with values
      svg.selectAll('.end-label')
        .data(data)
        .join('text')
        .attr('x', x2 + 8)
        .attr('y', d => y(d.end))
        .attr('text-anchor', 'start')
        .attr('alignment-baseline', 'middle')
        .style('fill', d => d.region === highlighted.region ? '#39D0FF' : '#5E6A81')
        .style('font-size', '11px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', d => d.region === highlighted.region ? '500' : '400')
        .text(d => `${d.end.toFixed(0)}ms`)
    }

    // Small multiples: Event type distribution
    if (multiplesRef.current) {
      const svg = d3.select(multiplesRef.current)
      const width = 280
      const height = 180
      const margin = { top: 50, bottom: 20, left: 16, right: 16 }

      const eventTypes = [
        { name: 'Earthquakes', abbr: 'EQ', count: earthquakes.length, color: '#FF3B3B' },
        { name: 'Hazards', abbr: 'HAZ', count: hazards.length, color: '#FFB341' },
        { name: 'Outages', abbr: 'OUT', count: outages.length, color: '#39D0FF' },
        { name: 'Latency', abbr: 'LAT', count: latencyPoints.length, color: '#19C6A6' },
      ]

      const cellWidth = (width - margin.left - margin.right) / eventTypes.length
      const maxCount = d3.max(eventTypes, d => d.count) || 10
      const totalEvents = eventTypes.reduce((sum, d) => sum + d.count, 0)

      svg.selectAll('*').remove()

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
        .text('Event Distribution')

      // Subtitle with total
      svg.append('text')
        .attr('x', 0)
        .attr('y', 32)
        .attr('text-anchor', 'start')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '400')
        .text(`${totalEvents} total events`)

      // Minimal baseline
      svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', height - margin.bottom)
        .attr('x2', width - margin.right)
        .attr('y2', height - margin.bottom)
        .style('stroke', '#242C3A')
        .style('stroke-width', '1px')

      eventTypes.forEach((type, i) => {
        const barHeight = (type.count / maxCount) * (height - margin.top - margin.bottom)
        const x = margin.left + i * cellWidth + cellWidth / 2
        const y = height - margin.bottom - barHeight

        // Minimal bar
        svg.append('rect')
          .attr('x', x - 10)
          .attr('y', y)
          .attr('width', 20)
          .attr('height', barHeight)
          .style('fill', type.color)
          .style('opacity', 0.9)

        // Direct count label above bar
        svg.append('text')
          .attr('x', x)
          .attr('y', y - 6)
          .attr('text-anchor', 'middle')
          .style('fill', type.color)
          .style('font-size', '13px')
          .style('font-family', 'Geist Mono, monospace')
          .style('font-weight', '600')
          .text(type.count)

        // Type abbreviation below
        svg.append('text')
          .attr('x', x)
          .attr('y', height - 4)
          .attr('text-anchor', 'middle')
          .style('fill', '#5E6A81')
          .style('font-size', '10px')
          .style('font-family', 'Geist Mono, monospace')
          .style('font-weight', '400')
          .text(type.abbr)
      })
    }

    // Time series: Earthquake timeline with annotations
    if (timeseriesRef.current && earthquakes.length > 0) {
      const svg = d3.select(timeseriesRef.current)
      const width = 280
      const height = 180
      const margin = { top: 50, right: 24, bottom: 12, left: 32 }

      // Sort earthquakes by timestamp
      const sortedEarthquakes = [...earthquakes]
        .sort((a, b) => a.timestamp - b.timestamp)
        .slice(0, 20)

      const data = sortedEarthquakes.map((eq, i) => ({
        index: i,
        magnitude: eq.magnitude,
        timestamp: eq.timestamp,
      }))

      const x = d3.scaleLinear()
        .domain([0, data.length - 1])
        .range([margin.left, width - margin.right])

      const maxMagnitude = d3.max(data, d => d.magnitude) || 8
      const y = d3.scaleLinear()
        .domain([0, maxMagnitude])
        .range([height - margin.bottom, margin.top])

      const line = d3.line<typeof data[0]>()
        .x(d => x(d.index))
        .y(d => y(d.magnitude))
        .curve(d3.curveMonotoneX)

      svg.selectAll('*').remove()

      // Find largest earthquake for annotation
      const maxEarthquake = data.reduce((max, eq) => eq.magnitude > max.magnitude ? eq : max)
      const anomalyCount = data.filter(d => d.magnitude >= 6.0).length

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
        .text('Seismic Activity')

      // Subtitle with anomaly count
      svg.append('text')
        .attr('x', 0)
        .attr('y', 32)
        .attr('text-anchor', 'start')
        .style('fill', '#FF3B3B')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '500')
        .text(`${anomalyCount} event${anomalyCount !== 1 ? 's' : ''} ≥ M6.0`)

      // Minimal baseline
      svg.append('line')
        .attr('x1', margin.left)
        .attr('y1', height - margin.bottom)
        .attr('x2', width - margin.right)
        .attr('y2', height - margin.bottom)
        .style('stroke', '#242C3A')
        .style('stroke-width', '1px')

      // Reference line at M6.0 threshold
      if (maxMagnitude >= 6.0) {
        svg.append('line')
          .attr('x1', margin.left)
          .attr('y1', y(6.0))
          .attr('x2', width - margin.right)
          .attr('y2', y(6.0))
          .style('stroke', '#FF3B3B')
          .style('stroke-width', '1px')
          .style('stroke-dasharray', '2,3')
          .style('opacity', 0.3)

        svg.append('text')
          .attr('x', margin.left - 8)
          .attr('y', y(6.0) + 4)
          .attr('text-anchor', 'end')
          .style('fill', '#5E6A81')
          .style('font-size', '9px')
          .style('font-family', 'Geist Mono, monospace')
          .text('6.0')
      }

      // Main line - elegant and thin
      svg.append('path')
        .datum(data)
        .attr('d', line)
        .style('stroke', '#FF3B3B')
        .style('stroke-width', '1.5px')
        .style('fill', 'none')

      // Direct annotation for peak
      svg.append('circle')
        .attr('cx', x(maxEarthquake.index))
        .attr('cy', y(maxEarthquake.magnitude))
        .attr('r', 2.5)
        .style('fill', '#FF3B3B')
        .style('stroke', '#0A0F16')
        .style('stroke-width', '2px')

      svg.append('text')
        .attr('x', x(maxEarthquake.index) + 6)
        .attr('y', y(maxEarthquake.magnitude) + 1)
        .style('fill', '#FF3B3B')
        .style('font-size', '11px')
        .style('font-family', 'Geist Mono, monospace')
        .style('font-weight', '600')
        .text(`M${maxEarthquake.magnitude.toFixed(1)}`)
    }
  }, [earthquakes, hazards, outages, latencyPoints])

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', gap: '16px' }}>
        {/* Sparkline */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <svg ref={sparklineRef} width="280" height="180" />
        </div>

        {/* Slopegraph */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <svg ref={slopegraphRef} width="280" height="180" />
        </div>

        {/* Small Multiples */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <svg ref={multiplesRef} width="280" height="180" />
        </div>

        {/* Time Series */}
        <div style={{
          flex: 1,
          minWidth: '280px',
          backgroundColor: '#0A0F16',
          border: '1px solid #242C3A',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'box-shadow 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'}
        onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'none'}>
          <svg ref={timeseriesRef} width="280" height="180" />
        </div>
      </div>
    </div>
  )
}
