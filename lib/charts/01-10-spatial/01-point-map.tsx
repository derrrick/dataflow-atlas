'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { tufteColors } from '@/lib/charts/core/tufte-theme'
import type { Earthquake, Hazard, Outage, LatencyPoint } from '@/lib/services/dataTypes'

interface PointMapProps {
  data: (Earthquake | Hazard | Outage | LatencyPoint)[]
  width?: number
  height?: number
  interactive?: boolean
}

export function PointMap({ data, width, height = 300, interactive = true }: PointMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<maplibregl.Map | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'carto-dark': {
            type: 'raster',
            tiles: [
              'https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png',
              'https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png'
            ],
            tileSize: 256,
            attribution: '&copy; OpenStreetMap, &copy; CARTO'
          }
        },
        layers: [
          {
            id: 'carto-dark-layer',
            type: 'raster',
            source: 'carto-dark',
            minzoom: 0,
            maxzoom: 22
          }
        ]
      },
      center: [0, 20],
      zoom: 1.5,
      interactive,
      attributionControl: false
    })

    return () => {
      map.current?.remove()
      map.current = null
    }
  }, [interactive])

  useEffect(() => {
    if (!map.current || !data.length) return

    // Wait for map to load
    if (!map.current.loaded()) {
      map.current.once('load', () => updateData())
      return
    }

    updateData()

    function updateData() {
      if (!map.current) return

      // Convert data to GeoJSON
      const geojson: GeoJSON.FeatureCollection = {
        type: 'FeatureCollection',
        features: data.map((item) => ({
          type: 'Feature',
          geometry: {
            type: 'Point',
            coordinates: [item.longitude, item.latitude]
          },
          properties: {
            timestamp: item.timestamp,
            magnitude: 'magnitude' in item ? item.magnitude : undefined,
            severity: 'severity' in item ? item.severity : undefined,
            type: 'magnitude' in item ? 'earthquake' : 'severity' in item ? 'hazard' : 'affected' in item ? 'outage' : 'latency'
          }
        }))
      }

      // Add or update source
      if (map.current.getSource('events')) {
        (map.current.getSource('events') as maplibregl.GeoJSONSource).setData(geojson)
      } else {
        map.current.addSource('events', {
          type: 'geojson',
          data: geojson
        })

        // Add circle layer
        map.current.addLayer({
          id: 'events-layer',
          type: 'circle',
          source: 'events',
          paint: {
            'circle-radius': [
              'case',
              ['has', 'magnitude'],
              ['*', ['get', 'magnitude'], 2],
              4
            ],
            'circle-color': [
              'case',
              ['==', ['get', 'type'], 'earthquake'],
              tufteColors.earthquakes,
              ['==', ['get', 'type'], 'hazard'],
              tufteColors.hazards,
              ['==', ['get', 'type'], 'outage'],
              tufteColors.outages,
              tufteColors.latency
            ],
            'circle-opacity': 0.7,
            'circle-stroke-width': 1,
            'circle-stroke-color': '#FFFFFF',
            'circle-stroke-opacity': 0.3
          }
        })
      }
    }
  }, [data])

  return (
    <div
      ref={mapContainer}
      style={{
        width: width || '100%',
        height: `${height}px`,
        overflow: 'hidden'
      }}
    />
  )
}
