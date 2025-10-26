'use client'

import { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useLayer } from '@/contexts/LayerContext'
import { useData } from '@/contexts/DataContext'
import MapPopup from './MapPopup'
import RefreshIndicator from './RefreshIndicator'
import ZoomControls from './ZoomControls'

export default function Globe() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<L.Map | null>(null)
  const layerGroupsRef = useRef<Record<string, L.LayerGroup>>({})
  const [isLoading, setIsLoading] = useState(true)
  const { activeLayers } = useLayer()

  // Get shared data from DataContext
  const { earthquakes, hazards, outages, latencyPoints, isRefreshing, lastRefresh } = useData()

  // Zoom control handlers
  const handleZoomIn = () => {
    if (mapRef.current) {
      mapRef.current.zoomIn()
    }
  }

  const handleZoomOut = () => {
    if (mapRef.current) {
      mapRef.current.zoomOut()
    }
  }

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.setView([20, 0], 2)
    }
  }

  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    console.log('🗺️ Initializing Leaflet map...')

    const map = L.map(mapContainer.current, {
      center: [20, 0],
      zoom: 2,
      zoomControl: false,
      attributionControl: false,
    })

    mapRef.current = map

    // Minimal dark basemap - styled to match brand colors
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '',
      className: 'map-base-layer'
    }).addTo(map)

    // Country labels layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      attribution: '',
      className: 'map-labels-layer'
    }).addTo(map)

    // Create layer groups
    const earthquakeLayer = L.layerGroup()
    const hazardLayer = L.layerGroup()
    const outageLayer = L.layerGroup()
    const latencyLayer = L.layerGroup()

    layerGroupsRef.current = {
      earthquakes: earthquakeLayer,
      hazards: hazardLayer,
      outages: outageLayer,
      latency: latencyLayer,
    }

    console.log('✅ Map initialized with layer groups')
    setIsLoading(false)

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update markers when data changes
  useEffect(() => {
    if (!mapRef.current) return

    const earthquakeLayer = layerGroupsRef.current.earthquakes
    if (!earthquakeLayer) return

    // Clear existing markers
    earthquakeLayer.clearLayers()

    // Add earthquake markers from fetched data
    earthquakes.forEach(eq => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: ${eq.magnitude * 4}px;
          height: ${eq.magnitude * 4}px;
          background-color: #FF3B3B;
          opacity: 0.9;
          border: 1.5px solid #FFFFFF40;
          transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
          cursor: pointer;
        "></div>`,
        iconSize: [eq.magnitude * 4, eq.magnitude * 4],
      })

      const popupContent = MapPopup({
        type: 'earthquake',
        data: {
          magnitude: eq.magnitude,
          depth: eq.depth,
          location: eq.location,
          time: eq.time,
        }
      })

      L.marker(eq.coords as [number, number], { icon })
        .bindPopup(popupContent, {
          className: 'custom-popup',
          closeButton: false,
          offset: [0, -10]
        })
        .addTo(earthquakeLayer)
    })

  }, [earthquakes])

  // Update hazard markers when data changes
  useEffect(() => {
    if (!mapRef.current) return

    const hazardLayer = layerGroupsRef.current.hazards
    if (!hazardLayer) return

    hazardLayer.clearLayers()

    hazards.forEach(hazard => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 24px;
          height: 24px;
          background-color: #FFB341;
          opacity: 0.85;
          border: 1.5px solid #FFFFFF40;
          transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
          cursor: pointer;
        "></div>`,
        iconSize: [24, 24],
      })

      const popupContent = MapPopup({
        type: 'hazard',
        data: {
          severity: hazard.severity,
          affected: hazard.affected,
          location: hazard.location,
          time: hazard.time,
        }
      })

      L.marker(hazard.coords as [number, number], { icon })
        .bindPopup(popupContent, {
          className: 'custom-popup',
          closeButton: false,
          offset: [0, -10]
        })
        .addTo(hazardLayer)
    })

  }, [hazards])

  // Update outage markers when data changes
  useEffect(() => {
    if (!mapRef.current) return

    const outageLayer = layerGroupsRef.current.outages
    if (!outageLayer) return

    outageLayer.clearLayers()

    outages.forEach(outage => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 20px;
          height: 20px;
          background-color: #5E6A81;
          opacity: 0.85;
          border: 1.5px solid #FFFFFF40;
          transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
          cursor: pointer;
        "></div>`,
        iconSize: [20, 20],
      })

      const popupContent = MapPopup({
        type: 'outage',
        data: {
          region: outage.region,
          affected: outage.affected,
          location: outage.location,
          time: outage.time,
        }
      })

      L.marker(outage.coords as [number, number], { icon })
        .bindPopup(popupContent, {
          className: 'custom-popup',
          closeButton: false,
          offset: [0, -10]
        })
        .addTo(outageLayer)
    })

  }, [outages])

  // Update latency markers when data changes
  useEffect(() => {
    if (!mapRef.current) return

    const latencyLayer = layerGroupsRef.current.latency
    if (!latencyLayer) return

    latencyLayer.clearLayers()

    latencyPoints.forEach(point => {
      const icon = L.divIcon({
        className: 'custom-marker',
        html: `<div style="
          width: 18px;
          height: 18px;
          background-color: #39D0FF;
          opacity: 0.85;
          border: 1.5px solid #FFFFFF40;
          transition: all 200ms cubic-bezier(0.25, 0.1, 0.25, 1);
          cursor: pointer;
        "></div>`,
        iconSize: [18, 18],
      })

      const popupContent = MapPopup({
        type: 'latency',
        data: {
          latency: point.latency,
          region: point.region,
          location: point.location,
          time: point.time,
        }
      })

      L.marker(point.coords as [number, number], { icon })
        .bindPopup(popupContent, {
          className: 'custom-popup',
          closeButton: false,
          offset: [0, -10]
        })
        .addTo(latencyLayer)
    })

  }, [latencyPoints])

  // Handle layer visibility changes
  useEffect(() => {
    if (!mapRef.current) return

    const map = mapRef.current
    const layers = layerGroupsRef.current

    // Toggle each layer based on activeLayers state
    Object.keys(layers).forEach(layerKey => {
      const layer = layers[layerKey]
      if (activeLayers.has(layerKey as any)) {
        if (!map.hasLayer(layer)) {
          layer.addTo(map)
        }
      } else {
        if (map.hasLayer(layer)) {
          map.removeLayer(layer)
        }
      }
    })
  }, [activeLayers])

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      backgroundColor: '#141821',
      zIndex: 1
    }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          zIndex: 1
        }}
      />

      <RefreshIndicator isRefreshing={isRefreshing} lastRefresh={lastRefresh} />

      <div style={{
        position: 'absolute',
        bottom: '24px',
        right: '24px',
        zIndex: 100,
      }}>
        <ZoomControls
          onZoomIn={handleZoomIn}
          onZoomOut={handleZoomOut}
          onReset={handleResetView}
        />
      </div>

      {isLoading && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#141821',
          zIndex: 10
        }}>
          <p style={{
            fontSize: '14px',
            color: '#8F9BB0',
            margin: 0,
            fontFamily: 'Inter, sans-serif',
          }}>
            Loading map...
          </p>
        </div>
      )}
    </div>
  )
}
