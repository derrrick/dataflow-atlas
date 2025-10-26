'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useDataRefresh } from '@/hooks/useDataRefresh'
import { fetchEarthquakes } from '@/lib/services/earthquakeService'
import { fetchHazards } from '@/lib/services/hazardService'
import { fetchOutages, fetchLatency } from '@/lib/services/networkService'
import { fetchAirQuality } from '@/lib/services/airQualityService'
import { fetchWildfires } from '@/lib/services/wildfireService'
import type { Earthquake, Hazard, Outage, LatencyPoint, AirQuality, Wildfire } from '@/lib/services/dataTypes'

interface DataContextType {
  earthquakes: Earthquake[]
  hazards: Hazard[]
  outages: Outage[]
  latencyPoints: LatencyPoint[]
  airQuality: AirQuality[]
  wildfires: Wildfire[]
  isRefreshing: boolean
  lastRefresh: number
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([])
  const [hazards, setHazards] = useState<Hazard[]>([])
  const [outages, setOutages] = useState<Outage[]>([])
  const [latencyPoints, setLatencyPoints] = useState<LatencyPoint[]>([])
  const [airQuality, setAirQuality] = useState<AirQuality[]>([])
  const [wildfires, setWildfires] = useState<Wildfire[]>([])

  const refreshData = useCallback(async () => {
    const [eqData, hazardData, outageData, latencyData, aqData, fireData] = await Promise.all([
      fetchEarthquakes(),
      fetchHazards(),
      fetchOutages(),
      fetchLatency(),
      fetchAirQuality(),
      fetchWildfires(),
    ])

    setEarthquakes(eqData.data)
    setHazards(hazardData.data)
    setOutages(outageData.data)
    setLatencyPoints(latencyData.data)
    setAirQuality(aqData.data)
    setWildfires(fireData.data)
  }, [])

  // Load data once on mount
  useEffect(() => {
    console.log('🔄 Loading initial data...')
    refreshData()
  }, [refreshData])

  const { isRefreshing, lastRefresh, error } = useDataRefresh({
    refreshInterval: 2 * 60 * 1000, // 2 minutes
    onRefresh: refreshData,
    autoStart: false, // Disabled auto-refresh to prevent constant updates
  })

  return (
    <DataContext.Provider
      value={{
        earthquakes,
        hazards,
        outages,
        latencyPoints,
        airQuality,
        wildfires,
        isRefreshing,
        lastRefresh,
        error,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}

export function useData() {
  const context = useContext(DataContext)
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}
