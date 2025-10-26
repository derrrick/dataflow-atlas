'use client'

import { createContext, useContext, useState, ReactNode, useCallback } from 'react'
import type { Earthquake, Hazard, Outage, LatencyPoint } from '@/lib/services/dataTypes'

export type DataType = 'earthquakes' | 'hazards' | 'outages' | 'latency'
export type TimePreset = '1h' | '6h' | '24h' | '7d' | 'custom'
export type Severity = 'Low' | 'Medium' | 'High'

interface FilterState {
  dataTypes: Set<DataType>
  timeRange: {
    start: number
    end: number
    preset: TimePreset
  }
  magnitude: {
    min: number
    max: number
  }
  severity: Set<Severity>
  regions: Set<string>
  metrics: {
    latency?: { min: number; max: number }
    affected?: { min: number; max: number }
  }
  chartTypes: Set<string>
}

interface FilterContextType {
  filters: FilterState
  updateFilter: <K extends keyof FilterState>(key: K, value: FilterState[K]) => void
  resetFilters: () => void
  applyFilters: <T extends Earthquake | Hazard | Outage | LatencyPoint>(data: T[]) => T[]
}

const defaultFilters: FilterState = {
  dataTypes: new Set(['earthquakes', 'hazards', 'outages', 'latency']),
  timeRange: {
    start: Date.now() - 24 * 60 * 60 * 1000,
    end: Date.now(),
    preset: '24h'
  },
  magnitude: {
    min: 4.5,
    max: 10
  },
  severity: new Set(['Low', 'Medium', 'High']),
  regions: new Set(),
  metrics: {},
  chartTypes: new Set()
}

const FilterContext = createContext<FilterContextType | undefined>(undefined)

export function FilterProvider({ children }: { children: ReactNode }) {
  const [filters, setFilters] = useState<FilterState>(defaultFilters)

  const updateFilter = useCallback(<K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }, [])

  const resetFilters = useCallback(() => {
    setFilters(defaultFilters)
  }, [])

  const applyFilters = useCallback(<T extends Earthquake | Hazard | Outage | LatencyPoint>(
    data: T[]
  ): T[] => {
    if (!data || !Array.isArray(data)) return []
    return data.filter(item => {
      // Time range filter
      if (item.timestamp < filters.timeRange.start || item.timestamp > filters.timeRange.end) {
        return false
      }

      // Type-specific filters
      if ('magnitude' in item) {
        // Earthquake filters
        if (item.magnitude < filters.magnitude.min || item.magnitude > filters.magnitude.max) {
          return false
        }
      }

      if ('severity' in item) {
        // Hazard filters
        if (!filters.severity.has(item.severity)) {
          return false
        }
      }

      if ('latency' in item && filters.metrics.latency) {
        // Latency filters
        if (item.latency < filters.metrics.latency.min || item.latency > filters.metrics.latency.max) {
          return false
        }
      }

      if ('affected' in item && filters.metrics.affected) {
        // Affected population filters
        if (item.affected < filters.metrics.affected.min || item.affected > filters.metrics.affected.max) {
          return false
        }
      }

      return true
    })
  }, [filters])

  return (
    <FilterContext.Provider value={{ filters, updateFilter, resetFilters, applyFilters }}>
      {children}
    </FilterContext.Provider>
  )
}

export function useFilters() {
  const context = useContext(FilterContext)
  if (context === undefined) {
    throw new Error('useFilters must be used within a FilterProvider')
  }
  return context
}
