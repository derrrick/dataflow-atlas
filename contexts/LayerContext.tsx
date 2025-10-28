'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

// Natural layers
export type NaturalLayer =
  | 'wildfire'
  | 'flood'
  | 'drought'
  | 'air-quality'
  | 'ocean-temp'
  | 'earthquakes'
  | 'volcanic'
  | 'severe-weather'

// Infrastructure layers
export type InfrastructureLayer =
  | 'power-grid'
  | 'power-outages'
  | 'internet-outages'
  | 'cellular-outages'
  | 'transportation'
  | 'air-port'
  | 'water-systems'
  | 'population'

// Systemic layers
export type SystemicLayer =
  | 'latency'
  | 'supply-chain'
  | 'gnss'
  | 'temp-stress'
  | 'social-signals'
  | 'risk-indices'

export type Layer = NaturalLayer | InfrastructureLayer | SystemicLayer

// Legacy layers for backwards compatibility
export type LegacyLayer = 'hazards' | 'earthquakes' | 'outages' | 'latency'

interface LayerContextType {
  activeLayers: Set<Layer | LegacyLayer>
  toggleLayer: (layerId: Layer | LegacyLayer) => void
  isLayerActive: (layerId: Layer | LegacyLayer) => boolean
}

const LayerContext = createContext<LayerContextType | undefined>(undefined)

export function LayerProvider({ children }: { children: ReactNode }) {
  // Start with all data layers that have available data turned on by default
  const [activeLayers, setActiveLayers] = useState<Set<Layer | LegacyLayer>>(
    new Set(['earthquakes', 'wildfire', 'air-quality', 'power-outages', 'severe-weather', 'latency', 'internet-outages'])
  )

  const toggleLayer = (layerId: Layer | LegacyLayer) => {
    setActiveLayers(prev => {
      const newSet = new Set(prev)
      if (newSet.has(layerId)) {
        newSet.delete(layerId)
      } else {
        newSet.add(layerId)
      }
      return newSet
    })
  }

  const isLayerActive = (layerId: Layer | LegacyLayer) => {
    return activeLayers.has(layerId)
  }

  return (
    <LayerContext.Provider value={{ activeLayers, toggleLayer, isLayerActive }}>
      {children}
    </LayerContext.Provider>
  )
}

export function useLayer() {
  const context = useContext(LayerContext)
  if (context === undefined) {
    throw new Error('useLayer must be used within a LayerProvider')
  }
  return context
}
