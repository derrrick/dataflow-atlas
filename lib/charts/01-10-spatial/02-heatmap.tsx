'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { tufteColors } from '@/lib/charts/core/tufte-theme'
import type { Earthquake, Hazard, Outage, LatencyPoint } from '@/lib/services/dataTypes'

interface HeatmapProps {
  data: (Earthquake | Hazard | Outage | LatencyPoint)[]
  width?: number
  height?: number
  interactive?: boolean
}

export function Heatmap({ data, width, height = 300, interactive = true }: HeatmapProps) {
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
            magnitude: 'magnitude' in item ? item.magnitude : 5
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

        // Add heatmap layer
        map.current.addLayer({
          id: 'events-heat',
          type: 'heatmap',
          source: 'events',
          paint: {
            // Increase weight as magnitude increases
            'heatmap-weight': [
              'interpolate',
              ['linear'],
              ['get', 'magnitude'],
              0, 0,
              6, 1
            ],
            // Increase intensity as zoom level increases
            'heatmap-intensity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 1,
              9, 3
            ],
            // Color ramp - Tufte monochrome intensity scale
            'heatmap-color': [
              'interpolate',
              ['linear'],
              ['heatmap-density'],
              0, 'rgba(0, 0, 0, 0)',
              0.2, tufteColors.intensityScale[0],
              0.4, tufteColors.intensityScale[1],
              0.6, tufteColors.intensityScale[2],
              0.8, tufteColors.intensityScale[3]
            ],
            // Adjust radius by zoom level
            'heatmap-radius': [
              'interpolate',
              ['linear'],
              ['zoom'],
              0, 2,
              9, 20
            ],
            // Transition from heatmap to circle layer by zoom level
            'heatmap-opacity': [
              'interpolate',
              ['linear'],
              ['zoom'],
              7, 1,
              9, 0
            ]
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
