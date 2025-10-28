'use client'

import { useEffect } from 'react'
import { useLayer } from '@/contexts/LayerContext'

type Props = {
  t0: number
  t1: number
}

export default function PermalinkManager({ t0, t1 }: Props) {
  const { activeLayers } = useLayer()

  // Update URL with layer and time state
  useEffect(() => {
    if (typeof window === 'undefined') return

    const updateURL = () => {
      const url = new URL(window.location.href)

      // Store active layers as comma-separated list
      const layersArray = Array.from(activeLayers)
      if (layersArray.length > 0) {
        url.searchParams.set('layers', layersArray.join(','))
      } else {
        url.searchParams.delete('layers')
      }

      // Store time range as Unix timestamps (seconds)
      url.searchParams.set('t0', String(Math.floor(t0 / 1000)))
      url.searchParams.set('t1', String(Math.floor(t1 / 1000)))

      // Use replaceState to avoid polluting browser history
      window.history.replaceState(null, '', url.toString())
    }

    updateURL()
  }, [activeLayers, t0, t1])

  // Restore state from URL on mount
  useEffect(() => {
    if (typeof window === 'undefined') return

    const restoreFromURL = () => {
      const params = new URLSearchParams(window.location.search)

      // Restore time range
      const t0Param = params.get('t0')
      const t1Param = params.get('t1')

      if (t0Param && t1Param) {
        const t0Ms = Number(t0Param) * 1000
        const t1Ms = Number(t1Param) * 1000

        // Dispatch custom event for time restoration
        const timeEvent = new CustomEvent('permalink:time', {
          detail: { t0: t0Ms, t1: t1Ms }
        })
        window.dispatchEvent(timeEvent)
      }

      // Restore layers
      const layersParam = params.get('layers')
      if (layersParam) {
        const layerIds = layersParam.split(',').filter(Boolean)

        // Dispatch custom event for layers restoration
        const layersEvent = new CustomEvent('permalink:layers', {
          detail: { layers: layerIds }
        })
        window.dispatchEvent(layersEvent)
      }
    }

    // Small delay to ensure contexts are initialized
    setTimeout(restoreFromURL, 100)
  }, [])

  return null
}
