'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'
import { useDataRefresh } from '@/hooks/useDataRefresh'
import { useTime } from '@/contexts/TimeContext'
import { fetchEarthquakes } from '@/lib/services/earthquakeService'
import { fetchOutages, fetchLatency } from '@/lib/services/networkService'
import { fetchAirQuality } from '@/lib/services/airQualityService'
import { fetchWildfires } from '@/lib/services/wildfireService'
import { fetchPowerOutages } from '@/lib/services/powerOutageService'
import { fetchSevereWeather } from '@/lib/services/severeWeatherService'
import { fetchInternetOutages } from '@/lib/services/internetOutageService'
import type { Earthquake, Outage, LatencyPoint, AirQuality, Wildfire, PowerOutage, SevereWeather, InternetOutage } from '@/lib/services/dataTypes'

interface DataContextType {
  earthquakes: Earthquake[]
  outages: Outage[]
  latencyPoints: LatencyPoint[]
  airQuality: AirQuality[]
  wildfires: Wildfire[]
  powerOutages: PowerOutage[]
  severeWeather: SevereWeather[]
  internetOutages: InternetOutage[]
  isRefreshing: boolean
  lastRefresh: number
  error: string | null
}

const DataContext = createContext<DataContextType | undefined>(undefined)

export function DataProvider({ children }: { children: ReactNode }) {
  const { t0, t1 } = useTime()
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([])
  const [outages, setOutages] = useState<Outage[]>([])
  const [latencyPoints, setLatencyPoints] = useState<LatencyPoint[]>([])
  const [airQuality, setAirQuality] = useState<AirQuality[]>([])
  const [wildfires, setWildfires] = useState<Wildfire[]>([])
  const [powerOutages, setPowerOutages] = useState<PowerOutage[]>([])
  const [severeWeather, setSevereWeather] = useState<SevereWeather[]>([])
  const [internetOutages, setInternetOutages] = useState<InternetOutage[]>([])

  const refreshData = useCallback(async () => {
    const [eqData, outageData, latencyData, aqData, fireData, powerData, weatherData, internetOutageData] = await Promise.all([
      fetchEarthquakes(t0, t1),
      fetchOutages(t0, t1),
      fetchLatency(t0, t1),
      fetchAirQuality(t0, t1),
      fetchWildfires(t0, t1),
      fetchPowerOutages(t0, t1),
      fetchSevereWeather(t0, t1),
      fetchInternetOutages(t0, t1),
    ])

    setEarthquakes(eqData.data)
    setOutages(outageData.data)
    setLatencyPoints(latencyData.data)
    setAirQuality(aqData.data)
    setWildfires(fireData.data)
    setPowerOutages(powerData.data)
    setSevereWeather(weatherData.data)
    setInternetOutages(internetOutageData.data)
  }, [t0, t1])

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
        outages,
        latencyPoints,
        airQuality,
        wildfires,
        powerOutages,
        severeWeather,
        internetOutages,
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
