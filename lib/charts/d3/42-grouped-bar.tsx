'use client'

import { useEffect, useRef } from 'react'
import * as d3 from 'd3'
import type { Earthquake, Hazard, UnifiedDataPoint } from '@/lib/services/dataTypes'

interface GroupedBarProps {
  unified?: UnifiedDataPoint[]
  earthquakes?: Earthquake[]
  hazards?: Hazard[]
  wildfires?: any[]
  airQuality?: any[]
  width?: number
  height?: number
}

export function GroupedBar({
  unified,
  earthquakes = [],
  hazards = [],
  wildfires = [],
  airQuality = [],
  width = 280,
  height = 160
}: GroupedBarProps) {
  const svgRef = useRef<SVGSVGElement>(null)

  useEffect(() => {
    if (!svgRef.current) return

    const svg = d3.select(svgRef.current)
    const margin = { top: 20, bottom: 30, left: 30, right: 16 }

    let categories: string[]
    let data: any[]
    let dataTypes: Array<{ key: string; label: string; color: string }>

    if (unified && unified.length > 0) {
      // Group unified data by dataType and severity
      const grouped = unified.reduce((acc, item) => {
        let severity: string
        if (item.dataType === 'earthquake') {
          if (item.primaryValue < 5) severity = 'Low'
          else if (item.primaryValue < 6.5) severity = 'Med'
          else severity = 'High'
        } else if (item.dataType === 'wildfire') {
          if (item.primaryValue < 100) severity = 'Low'
          else if (item.primaryValue < 1000) severity = 'Med'
          else severity = 'High'
        } else if (item.dataType === 'air_quality') {
          if (item.primaryValue < 50) severity = 'Low'
          else if (item.primaryValue < 150) severity = 'Med'
          else severity = 'High'
        } else {
          severity = 'Med'
        }

        const key = `${severity}_${item.dataType}`
        acc[key] = (acc[key] || 0) + 1
        return acc
      }, {} as Record<string, number>)

      // Determine which data types are present
      const presentTypes = [...new Set(unified.map(d => d.dataType))]
      dataTypes = []
      if (presentTypes.includes('earthquake')) {
        dataTypes.push({ key: 'earthquake', label: 'EQ', color: '#FF3B3B' })
      }
      if (presentTypes.includes('wildfire')) {
        dataTypes.push({ key: 'wildfire', label: 'FIRE', color: '#FF8C00' })
      }
      if (presentTypes.includes('air_quality')) {
        dataTypes.push({ key: 'air_quality', label: 'AQI', color: '#9370DB' })
      }

      categories = ['Low', 'Med', 'High']
      data = categories.map(cat => {
        const obj: any = { category: cat }
        dataTypes.forEach(type => {
          obj[type.key] = grouped[`${cat}_${type.key}`] || 0
        })
        return obj
      })
    } else {
      // Legacy format
      const eqLow = earthquakes.filter(e => e.magnitude < 5).length
      const eqMed = earthquakes.filter(e => e.magnitude >= 5 && e.magnitude < 6.5).length
      const eqHigh = earthquakes.filter(e => e.magnitude >= 6.5).length

      const hazLow = hazards.filter(h => h.severity === 'Low').length
      const hazMed = hazards.filter(h => h.severity === 'Medium').length
      const hazHigh = hazards.filter(h => h.severity === 'High').length

      const fireLow = wildfires.filter((w: any) => w.acres < 100).length
      const fireMed = wildfires.filter((w: any) => w.acres >= 100 && w.acres < 1000).length
      const fireHigh = wildfires.filter((w: any) => w.acres >= 1000).length

      dataTypes = [
        { key: 'eq', label: 'EQ', color: '#FF3B3B' },
        { key: 'haz', label: 'HAZ', color: '#FFB341' },
        { key: 'fire', label: 'FIRE', color: '#FF8C00' }
      ]

      categories = ['Low', 'Med', 'High']
      data = [
        { category: 'Low', eq: eqLow, haz: hazLow, fire: fireLow },
        { category: 'Med', eq: eqMed, haz: hazMed, fire: fireMed },
        { category: 'High', eq: eqHigh, haz: hazHigh, fire: fireHigh }
      ]
    }

    const x0 = d3.scaleBand()
      .domain(categories)
      .range([margin.left, width - margin.right])
      .padding(0.2)

    const x1 = d3.scaleBand()
      .domain(dataTypes.map(d => d.key))
      .range([0, x0.bandwidth()])
      .padding(0.1)

    const maxValue = d3.max(data, d => {
      return Math.max(...dataTypes.map(type => d[type.key] || 0))
    }) || 10

    const y = d3.scaleLinear()
      .domain([0, maxValue])
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

    // Groups
    const groups = svg.selectAll('.group')
      .data(data)
      .join('g')
      .attr('transform', d => `translate(${x0(d.category)},0)`)

    // Bars for each data type
    dataTypes.forEach(type => {
      groups.append('rect')
        .attr('x', x1(type.key) || 0)
        .attr('y', (d: any) => y(d[type.key] || 0))
        .attr('width', x1.bandwidth())
        .attr('height', (d: any) => height - margin.bottom - y(d[type.key] || 0))
        .style('fill', type.color)
        .style('opacity', 0.9)
    })

    // Category labels
    categories.forEach(cat => {
      svg.append('text')
        .attr('x', (x0(cat) || 0) + x0.bandwidth() / 2)
        .attr('y', height - 8)
        .attr('text-anchor', 'middle')
        .style('fill', '#5E6A81')
        .style('font-size', '10px')
        .style('font-family', 'Geist Mono, monospace')
        .text(cat)
    })

    // Y labels
    const yTicks = y.ticks(3)
    yTicks.forEach(tick => {
      if (tick === 0) return
      svg.append('text')
        .attr('x', margin.left - 8)
        .attr('y', y(tick) + 3)
        .attr('text-anchor', 'end')
        .style('fill', '#5E6A81')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(tick)
    })

    // Legend
    dataTypes.forEach((type, i) => {
      svg.append('rect')
        .attr('x', width - margin.right - 40)
        .attr('y', margin.top + i * 12)
        .attr('width', 8)
        .attr('height', 8)
        .style('fill', type.color)

      svg.append('text')
        .attr('x', width - margin.right - 28)
        .attr('y', margin.top + i * 12 + 7)
        .style('fill', '#8F9BB0')
        .style('font-size', '9px')
        .style('font-family', 'Geist Mono, monospace')
        .text(type.label)
    })
  }, [unified, earthquakes, hazards, wildfires, airQuality, width, height])

  return <svg ref={svgRef} width={width} height={height} />
}
