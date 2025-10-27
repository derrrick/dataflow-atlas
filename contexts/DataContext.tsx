'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useDataRefresh } from '@/hooks/useDataRefresh'
import { fetchEarthquakes } from '@/lib/services/earthquakeService'
import { fetchHazards } from '@/lib/services/hazardService'
import { fetchOutages, fetchLatency } from '@/lib/services/networkService'
import { fetchAirQuality } from '@/lib/services/airQualityService'
import { fetchWildfires } from '@/lib/services/wildfireService'
import { fetchPowerOutages } from '@/lib/services/powerOutageService'
import { fetchSevereWeather } from '@/lib/services/severeWeatherService'
import type { Earthquake, Hazard, Outage, LatencyPoint, AirQuality, Wildfire, PowerOutage, SevereWeather } from '@/lib/services/dataTypes'

interface DataContextType {
  earthquakes: Earthquake[]
  hazards: Hazard[]
  outages: Outage[]
  latencyPoints: LatencyPoint[]
  airQuality: AirQuality[]
  wildfires: Wildfire[]
  powerOutages: PowerOutage[]
  severeWeather: SevereWeather[]
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
  const [powerOutages, setPowerOutages] = useState<PowerOutage[]>([])
  const [severeWeather, setSevereWeather] = useState<SevereWeather[]>([])

  const refreshData = useCallback(async () => {
    const [eqData, hazardData, outageData, latencyData, aqData, fireData, powerData, weatherData] = await Promise.all([
      fetchEarthquakes(),
      fetchHazards(),
      fetchOutages(),
      fetchLatency(),
      fetchAirQuality(),
      fetchWildfires(),
      fetchPowerOutages(),
      fetchSevereWeather(),
    ])

    setEarthquakes(eqData.data)
    setHazards(hazardData.data)
    setOutages(outageData.data)
    setLatencyPoints(latencyData.data)
    setAirQuality(aqData.data)
    setWildfires(fireData.data)
    setPowerOutages(powerData.data)
    setSevereWeather(weatherData.data)
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
        powerOutages,
        severeWeather,
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
