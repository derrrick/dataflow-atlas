'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { useLayer } from '@/contexts/LayerContext'
import { useData } from '@/contexts/DataContext'
import MapPopup from './MapPopup'
import RefreshIndicator from './RefreshIndicator'
import ZoomControls from './ZoomControls'

export default function GlobeMapLibre() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const mapRef = useRef<maplibregl.Map | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const popupRef = useRef<maplibregl.Popup | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [sourcesReady, setSourcesReady] = useState(false)
  const { activeLayers } = useLayer()

  const { earthquakes, hazards, outages, latencyPoints, isRefreshing, lastRefresh } = useData()

  const handleZoomIn = () => {
    if (mapRef.current) mapRef.current.zoomIn()
  }

  const handleZoomOut = () => {
    if (mapRef.current) mapRef.current.zoomOut()
  }

  const handleResetView = () => {
    if (mapRef.current) {
      mapRef.current.flyTo({ center: [0, 20], zoom: 2 })
    }
  }

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || mapRef.current) return

    console.log('🗺️ Initializing MapLibre map...')

    const style: maplibregl.StyleSpecification = {
      version: 8,
      name: 'Flow Atlas Dark',
      sources: {
        'openmaptiles': {
          type: 'vector',
          url: 'https://demotiles.maplibre.org/tiles/tiles.json'
        }
      },
      layers: [
        {
          id: 'background',
          type: 'background',
          paint: {
            'background-color': '#141821'
          }
        },
        {
          id: 'land',
          type: 'fill',
          source: 'openmaptiles',
          'source-layer': 'countries',
          paint: {
            'fill-color': '#0A0F16'
          }
        },
        {
          id: 'boundaries',
          type: 'line',
          source: 'openmaptiles',
          'source-layer': 'countries',
          paint: {
            'line-color': '#242C3A',
            'line-width': 0.8,
            'line-opacity': 0.4
          }
        }
      ]
    }

    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: style,
      center: [0, 20],
      zoom: 2,
      attributionControl: false
    })

    mapRef.current = map

    map.on('load', () => {
      console.log('✅ Map loaded')

      // Add GeoJSON sources
      map.addSource('earthquakes-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      map.addSource('hazards-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      map.addSource('outages-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      map.addSource('latency-src', {
        type: 'geojson',
        data: { type: 'FeatureCollection', features: [] }
      })

      // Add ripple layers (expanding beacon effect) with zoom-responsive sizing
      map.addLayer({
        id: 'earthquakes-ripple',
        type: 'circle',
        source: 'earthquakes-src',
        paint: {
          'circle-color': '#FF3B3B',
          'circle-opacity': 0,
          'circle-stroke-color': '#FF3B3B',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 3,
            3, 3,
            4, 1.5
          ],
          'circle-stroke-opacity': 0,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, ['*', ['get', 'magnitude'], 5],
            8, ['*', ['*', ['get', 'magnitude'], 5], 1.8]
          ]
        }
      })

      map.addLayer({
        id: 'hazards-ripple',
        type: 'circle',
        source: 'hazards-src',
        paint: {
          'circle-color': '#FFB341',
          'circle-opacity': 0,
          'circle-stroke-color': '#FFB341',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 3,
            3, 3,
            4, 1.5
          ],
          'circle-stroke-opacity': 0,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, [
              'case',
              ['==', ['get', 'severity'], 'High'], 12,
              ['==', ['get', 'severity'], 'Medium'], 9,
              6
            ],
            8, [
              '*',
              [
                'case',
                ['==', ['get', 'severity'], 'High'], 12,
                ['==', ['get', 'severity'], 'Medium'], 9,
                6
              ],
              1.8
            ]
          ]
        }
      })

      map.addLayer({
        id: 'outages-ripple',
        type: 'circle',
        source: 'outages-src',
        paint: {
          'circle-color': '#39D0FF',
          'circle-opacity': 0,
          'circle-stroke-color': '#39D0FF',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 3,
            3, 3,
            4, 1.5
          ],
          'circle-stroke-opacity': 0,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, [
              'interpolate',
              ['linear'],
              ['get', 'affected'],
              0, 4,
              50000, 8,
              200000, 14
            ],
            8, [
              '*',
              [
                'interpolate',
                ['linear'],
                ['get', 'affected'],
                0, 4,
                50000, 8,
                200000, 14
              ],
              1.8
            ]
          ]
        }
      })

      map.addLayer({
        id: 'latency-ripple',
        type: 'circle',
        source: 'latency-src',
        paint: {
          'circle-color': '#19C6A6',
          'circle-opacity': 0,
          'circle-stroke-color': '#19C6A6',
          'circle-stroke-width': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 3,
            3, 3,
            4, 1.5
          ],
          'circle-stroke-opacity': 0,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, [
              'interpolate',
              ['linear'],
              ['get', 'latency'],
              0, 3,
              100, 5,
              300, 9,
              500, 12
            ],
            8, [
              '*',
              [
                'interpolate',
                ['linear'],
                ['get', 'latency'],
                0, 3,
                100, 5,
                300, 9,
                500, 12
              ],
              1.8
            ]
          ]
        }
      })

      // Add base circle layers with zoom-responsive sizing
      map.addLayer({
        id: 'earthquakes-layer',
        type: 'circle',
        source: 'earthquakes-src',
        paint: {
          'circle-color': '#FF3B3B',
          'circle-opacity': 0.10,
          'circle-stroke-color': '#FF3B3B',
          'circle-stroke-width': 2,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, ['*', ['get', 'magnitude'], 5],
            8, ['*', ['*', ['get', 'magnitude'], 5], 1.8]
          ]
        }
      })

      map.addLayer({
        id: 'hazards-layer',
        type: 'circle',
        source: 'hazards-src',
        paint: {
          'circle-color': '#FFB341',
          'circle-opacity': 0.10,
          'circle-stroke-color': '#FFB341',
          'circle-stroke-width': 2,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, [
              'case',
              ['==', ['get', 'severity'], 'High'], 12,
              ['==', ['get', 'severity'], 'Medium'], 9,
              6
            ],
            8, [
              '*',
              [
                'case',
                ['==', ['get', 'severity'], 'High'], 12,
                ['==', ['get', 'severity'], 'Medium'], 9,
                6
              ],
              1.8
            ]
          ]
        }
      })

      map.addLayer({
        id: 'outages-layer',
        type: 'circle',
        source: 'outages-src',
        paint: {
          'circle-color': '#39D0FF',
          'circle-opacity': 0.10,
          'circle-stroke-color': '#39D0FF',
          'circle-stroke-width': 2,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, [
              'interpolate',
              ['linear'],
              ['get', 'affected'],
              0, 4,
              50000, 8,
              200000, 14
            ],
            8, [
              '*',
              [
                'interpolate',
                ['linear'],
                ['get', 'affected'],
                0, 4,
                50000, 8,
                200000, 14
              ],
              1.8
            ]
          ]
        }
      })

      map.addLayer({
        id: 'latency-layer',
        type: 'circle',
        source: 'latency-src',
        paint: {
          'circle-color': '#19C6A6',
          'circle-opacity': 0.10,
          'circle-stroke-color': '#19C6A6',
          'circle-stroke-width': 2,
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['zoom'],
            0, 4,
            3, 4,
            4, [
              'interpolate',
              ['linear'],
              ['get', 'latency'],
              0, 3,
              100, 5,
              300, 9,
              500, 12
            ],
            8, [
              '*',
              [
                'interpolate',
                ['linear'],
                ['get', 'latency'],
                0, 3,
                100, 5,
                300, 9,
                500, 12
              ],
              1.8
            ]
          ]
        }
      })

      // Add click handlers for popups
      const layers = ['earthquakes-layer', 'hazards-layer', 'outages-layer', 'latency-layer']

      layers.forEach(layerId => {
        map.on('click', layerId, (e) => {
          if (!e.features || e.features.length === 0) return

          const feature = e.features[0]
          const props = feature.properties

          if (popupRef.current) {
            popupRef.current.remove()
          }

          let popupType: 'earthquake' | 'hazard' | 'outage' | 'latency'
          let popupData: any = {}

          if (layerId === 'earthquakes-layer') {
            popupType = 'earthquake'
            popupData = {
              magnitude: props?.magnitude,
              depth: props?.depth,
              location: props?.location,
              time: props?.time
            }
          } else if (layerId === 'hazards-layer') {
            popupType = 'hazard'
            popupData = {
              severity: props?.severity,
              affected: props?.affected,
              location: props?.location,
              time: props?.time
            }
          } else if (layerId === 'outages-layer') {
            popupType = 'outage'
            popupData = {
              region: props?.region,
              affected: props?.affected,
              location: props?.location,
              time: props?.time
            }
          } else {
            popupType = 'latency'
            popupData = {
              latency: props?.latency,
              region: props?.region,
              location: props?.location,
              time: props?.time
            }
          }

          const popup = new maplibregl.Popup({ offset: 15, closeButton: false })
            .setLngLat(e.lngLat)
            .setHTML(MapPopup({ type: popupType, data: popupData }))
            .addTo(map)

          popupRef.current = popup
        })

        // Change cursor on hover
        map.on('mouseenter', layerId, () => {
          map.getCanvas().style.cursor = 'pointer'
        })

        map.on('mouseleave', layerId, () => {
          map.getCanvas().style.cursor = ''
        })
      })

      setIsLoading(false)
      setSourcesReady(true)

      // Start beacon ripple animation
      const start = performance.now()

      function animate() {
        if (!mapRef.current) return

        const t = (performance.now() - start) / 1000
        const period = 2.0 // 2 second ripple cycle
        const phase = (t % period) / period // 0 to 1

        // Ripple expands from 1x to 3x base size
        const rippleScale = 1 + (phase * 2)
        // Ripple fades out as it expands
        const rippleOpacity = Math.max(0, 0.25 * (1 - phase))

        // Animate earthquakes ripple - zoom must be at top level
        mapRef.current.setPaintProperty('earthquakes-ripple', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 4 * rippleScale,
          3, 4 * rippleScale,
          4, ['*', ['get', 'magnitude'], 5 * rippleScale],
          8, ['*', ['*', ['get', 'magnitude'], 5 * rippleScale], 1.8]
        ])
        mapRef.current.setPaintProperty('earthquakes-ripple', 'circle-stroke-opacity', rippleOpacity)

        // Animate hazards ripple
        mapRef.current.setPaintProperty('hazards-ripple', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 4 * rippleScale,
          3, 4 * rippleScale,
          4, [
            'case',
            ['==', ['get', 'severity'], 'High'], 12 * rippleScale,
            ['==', ['get', 'severity'], 'Medium'], 9 * rippleScale,
            6 * rippleScale
          ],
          8, [
            '*',
            [
              'case',
              ['==', ['get', 'severity'], 'High'], 12 * rippleScale,
              ['==', ['get', 'severity'], 'Medium'], 9 * rippleScale,
              6 * rippleScale
            ],
            1.8
          ]
        ])
        mapRef.current.setPaintProperty('hazards-ripple', 'circle-stroke-opacity', rippleOpacity)

        // Animate outages ripple
        mapRef.current.setPaintProperty('outages-ripple', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 4 * rippleScale,
          3, 4 * rippleScale,
          4, [
            'interpolate',
            ['linear'],
            ['get', 'affected'],
            0, 4 * rippleScale,
            50000, 8 * rippleScale,
            200000, 14 * rippleScale
          ],
          8, [
            '*',
            [
              'interpolate',
              ['linear'],
              ['get', 'affected'],
              0, 4 * rippleScale,
              50000, 8 * rippleScale,
              200000, 14 * rippleScale
            ],
            1.8
          ]
        ])
        mapRef.current.setPaintProperty('outages-ripple', 'circle-stroke-opacity', rippleOpacity)

        // Animate latency ripple
        mapRef.current.setPaintProperty('latency-ripple', 'circle-radius', [
          'interpolate',
          ['linear'],
          ['zoom'],
          0, 4 * rippleScale,
          3, 4 * rippleScale,
          4, [
            'interpolate',
            ['linear'],
            ['get', 'latency'],
            0, 3 * rippleScale,
            100, 5 * rippleScale,
            300, 9 * rippleScale,
            500, 12 * rippleScale
          ],
          8, [
            '*',
            [
              'interpolate',
              ['linear'],
              ['get', 'latency'],
              0, 3 * rippleScale,
              100, 5 * rippleScale,
              300, 9 * rippleScale,
              500, 12 * rippleScale
            ],
            1.8
          ]
        ])
        mapRef.current.setPaintProperty('latency-ripple', 'circle-stroke-opacity', rippleOpacity)

        mapRef.current.triggerRepaint()
        animationFrameRef.current = requestAnimationFrame(animate)
      }

      animate()
    })

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
      if (popupRef.current) {
        popupRef.current.remove()
      }
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [])

  // Update earthquake data
  useEffect(() => {
    if (!mapRef.current || !sourcesReady) return

    const source = mapRef.current.getSource('earthquakes-src') as maplibregl.GeoJSONSource
    if (!source) return

    const features = earthquakes.map(eq => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [eq.coords[1], eq.coords[0]]
      },
      properties: {
        magnitude: eq.magnitude,
        depth: eq.depth,
        location: eq.location,
        time: eq.time
      }
    }))

    source.setData({
      type: 'FeatureCollection',
      features
    })
  }, [earthquakes, sourcesReady])

  // Update hazard data
  useEffect(() => {
    if (!mapRef.current || !sourcesReady) return

    const source = mapRef.current.getSource('hazards-src') as maplibregl.GeoJSONSource
    if (!source) return

    const features = hazards.map(hazard => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [hazard.coords[1], hazard.coords[0]]
      },
      properties: {
        severity: hazard.severity,
        affected: hazard.affected,
        location: hazard.location,
        time: hazard.time
      }
    }))

    source.setData({
      type: 'FeatureCollection',
      features
    })
  }, [hazards, sourcesReady])

  // Update outage data
  useEffect(() => {
    if (!mapRef.current || !sourcesReady) return

    const source = mapRef.current.getSource('outages-src') as maplibregl.GeoJSONSource
    if (!source) return

    const features = outages.map(outage => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [outage.coords[1], outage.coords[0]]
      },
      properties: {
        region: outage.region,
        affected: outage.affected,
        location: outage.location,
        time: outage.time
      }
    }))

    source.setData({
      type: 'FeatureCollection',
      features
    })
  }, [outages, sourcesReady])

  // Update latency data
  useEffect(() => {
    if (!mapRef.current || !sourcesReady) return

    const source = mapRef.current.getSource('latency-src') as maplibregl.GeoJSONSource
    if (!source) return

    const features = latencyPoints.map(point => ({
      type: 'Feature' as const,
      geometry: {
        type: 'Point' as const,
        coordinates: [point.coords[1], point.coords[0]]
      },
      properties: {
        latency: point.latency,
        region: point.region,
        location: point.location,
        time: point.time
      }
    }))

    source.setData({
      type: 'FeatureCollection',
      features
    })
  }, [latencyPoints, sourcesReady])

  // Handle layer visibility
  useEffect(() => {
    if (!mapRef.current || !sourcesReady) return

    const earthquakeVisible = activeLayers.has('earthquakes') ? 'visible' : 'none'
    const hazardsVisible = activeLayers.has('hazards') ? 'visible' : 'none'
    const outagesVisible = activeLayers.has('outages') ? 'visible' : 'none'
    const latencyVisible = activeLayers.has('latency') ? 'visible' : 'none'

    mapRef.current.setLayoutProperty('earthquakes-layer', 'visibility', earthquakeVisible)
    mapRef.current.setLayoutProperty('earthquakes-ripple', 'visibility', earthquakeVisible)

    mapRef.current.setLayoutProperty('hazards-layer', 'visibility', hazardsVisible)
    mapRef.current.setLayoutProperty('hazards-ripple', 'visibility', hazardsVisible)

    mapRef.current.setLayoutProperty('outages-layer', 'visibility', outagesVisible)
    mapRef.current.setLayoutProperty('outages-ripple', 'visibility', outagesVisible)

    mapRef.current.setLayoutProperty('latency-layer', 'visibility', latencyVisible)
    mapRef.current.setLayoutProperty('latency-ripple', 'visibility', latencyVisible)
  }, [activeLayers, sourcesReady])

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
            fontFamily: 'Geist Mono, monospace',
          }}>
            Loading map...
          </p>
        </div>
      )}
    </div>
  )
}
