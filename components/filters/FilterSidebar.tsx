'use client'

import { useFilters } from '@/contexts/FilterContext'
import { RotateCcw } from 'lucide-react'
import type { DataType, TimePreset, Severity } from '@/contexts/FilterContext'

export function FilterSidebar() {
  const { filters, updateFilter, resetFilters } = useFilters()

  const timePresets: { value: TimePreset; label: string }[] = [
    { value: '1h', label: '1 Hour' },
    { value: '6h', label: '6 Hours' },
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
  ]

  const dataTypes: { value: DataType; label: string; color: string }[] = [
    { value: 'earthquakes', label: 'Earthquakes', color: '#FF3B3B' },
    { value: 'hazards', label: 'Hazards', color: '#FFB341' },
    { value: 'outages', label: 'Outages', color: '#39D0FF' },
    { value: 'latency', label: 'Latency', color: '#19C6A6' },
  ]

  const severityLevels: Severity[] = ['Low', 'Medium', 'High']

  const toggleDataType = (type: DataType) => {
    const newTypes = new Set(filters.dataTypes)
    if (newTypes.has(type)) {
      newTypes.delete(type)
    } else {
      newTypes.add(type)
    }
    updateFilter('dataTypes', newTypes)
  }

  const toggleSeverity = (severity: Severity) => {
    const newSeverity = new Set(filters.severity)
    if (newSeverity.has(severity)) {
      newSeverity.delete(severity)
    } else {
      newSeverity.add(severity)
    }
    updateFilter('severity', newSeverity)
  }

  const setTimePreset = (preset: TimePreset) => {
    const now = Date.now()
    let start = now

    switch (preset) {
      case '1h':
        start = now - 60 * 60 * 1000
        break
      case '6h':
        start = now - 6 * 60 * 60 * 1000
        break
      case '24h':
        start = now - 24 * 60 * 60 * 1000
        break
      case '7d':
        start = now - 7 * 24 * 60 * 60 * 1000
        break
    }

    updateFilter('timeRange', { start, end: now, preset })
  }

  return (
    <div className="w-64 flex-shrink-0 bg-white/[0.02] border border-border  p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-light text-white">Filters</h3>
        <button
          onClick={resetFilters}
          className="p-1.5 text-muted hover:text-foreground hover:bg-white/5  transition-colors"
          title="Reset all filters"
        >
          <RotateCcw size={14} />
        </button>
      </div>

      {/* Data Types */}
      <div>
        <label className="text-xs text-muted mb-2 block">Data Types</label>
        <div className="space-y-1.5">
          {dataTypes.map(({ value, label, color }) => (
            <button
              key={value}
              onClick={() => toggleDataType(value)}
              className={`w-full flex items-center gap-2 px-2 py-1.5  text-xs transition-colors ${
                filters.dataTypes.has(value)
                  ? 'bg-white/10 text-white'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              <span
                className="w-2 h-2 "
                style={{ backgroundColor: color }}
              />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Time Range */}
      <div>
        <label className="text-xs text-muted mb-2 block">Time Range</label>
        <div className="grid grid-cols-2 gap-1.5">
          {timePresets.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setTimePreset(value)}
              className={`px-2 py-1.5  text-xs transition-colors ${
                filters.timeRange.preset === value
                  ? 'bg-white/10 text-white'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Magnitude Range */}
      <div>
        <label className="text-xs text-muted mb-2 block">
          Magnitude: {filters.magnitude.min.toFixed(1)} - {filters.magnitude.max.toFixed(1)}
        </label>
        <div className="space-y-2">
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filters.magnitude.min}
            onChange={(e) => updateFilter('magnitude', { ...filters.magnitude, min: parseFloat(e.target.value) })}
            className="w-full h-1 bg-white/10  appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
          <input
            type="range"
            min="0"
            max="10"
            step="0.1"
            value={filters.magnitude.max}
            onChange={(e) => updateFilter('magnitude', { ...filters.magnitude, max: parseFloat(e.target.value) })}
            className="w-full h-1 bg-white/10  appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
          />
        </div>
      </div>

      {/* Severity */}
      <div>
        <label className="text-xs text-muted mb-2 block">Severity</label>
        <div className="flex gap-1.5">
          {severityLevels.map((severity) => (
            <button
              key={severity}
              onClick={() => toggleSeverity(severity)}
              className={`flex-1 px-2 py-1.5  text-xs transition-colors ${
                filters.severity.has(severity)
                  ? 'bg-white/10 text-white'
                  : 'text-muted hover:text-foreground hover:bg-white/5'
              }`}
            >
              {severity}
            </button>
          ))}
        </div>
      </div>

      {/* Active Filters Count */}
      <div className="pt-4 border-t border-border">
        <div className="text-xs text-muted">
          <span className="font-mono">{filters.dataTypes.size}</span> data types
          <span className="mx-2">·</span>
          <span className="font-mono">{filters.severity.size}</span> severity levels
        </div>
      </div>
    </div>
  )
}
