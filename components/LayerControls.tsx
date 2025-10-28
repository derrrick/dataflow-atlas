'use client'

import { useState, useRef, useEffect } from 'react'
import { useLayer, type Layer, type NaturalLayer, type InfrastructureLayer, type SystemicLayer } from '@/contexts/LayerContext'
import { ChevronDown, Leaf, Blocks, Radio } from 'lucide-react'

interface LayerConfig {
  id: Layer
  label: string
  color: string
  description?: string
  updateFrequency?: string
}

interface CategoryConfig {
  id: 'natural' | 'infrastructure' | 'systemic'
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  layers: LayerConfig[]
}

const categories: CategoryConfig[] = [
  {
    id: 'natural',
    label: 'Natural',
    Icon: Leaf,
    color: '#FF9500',
    layers: [
      { id: 'wildfire', label: 'Wildfire Activity', color: '#FF6B35', updateFrequency: '15 min – 3 hr' },
      { id: 'flood', label: 'Flood & Rainfall', color: '#4A90E2', updateFrequency: 'Hourly' },
      { id: 'drought', label: 'Drought Index', color: '#D4A574', updateFrequency: 'Weekly' },
      { id: 'air-quality', label: 'Air Quality / PM2.5', color: '#9B59B6', updateFrequency: '1–2 hr' },
      { id: 'ocean-temp', label: 'Ocean Temperature', color: '#16A085', updateFrequency: '6 hr – Daily' },
      { id: 'earthquakes', label: 'Earthquakes / Seismic', color: '#FF3B3B', updateFrequency: '<1 min' },
      { id: 'volcanic', label: 'Volcanic Activity', color: '#E74C3C', updateFrequency: 'Daily' },
      { id: 'severe-weather', label: 'Severe Weather', color: '#9333EA', updateFrequency: 'Hourly' },
    ]
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    Icon: Blocks,
    color: '#39D0FF',
    layers: [
      { id: 'power-grid', label: 'Power Grid Topology', color: '#FFB800', updateFrequency: 'Static' },
      { id: 'power-outages', label: 'Power Outages', color: '#FF6B6B', updateFrequency: '10–15 min' },
      { id: 'internet-outages', label: 'Internet Outages', color: '#4ECDC4', updateFrequency: '5–15 min' },
      { id: 'cellular-outages', label: 'Cellular Outages', color: '#95E1D3', updateFrequency: '15–60 min' },
      { id: 'transportation', label: 'Transportation Networks', color: '#A8E6CF', updateFrequency: 'Live' },
      { id: 'air-port', label: 'Air & Port Disruptions', color: '#FFD3B6', updateFrequency: 'Live–Hourly' },
      { id: 'water-systems', label: 'Water / Wastewater', color: '#87CEEB', updateFrequency: 'Daily' },
      { id: 'population', label: 'Population Density', color: '#DDA15E', updateFrequency: 'Annual' },
    ]
  },
  {
    id: 'systemic',
    label: 'Systemic',
    Icon: Radio,
    color: '#19C6A6',
    layers: [
      { id: 'latency', label: 'Latency / Internet Performance', color: '#19C6A6', updateFrequency: '5–10 min' },
      { id: 'supply-chain', label: 'Supply Chain Congestion', color: '#F4A261', updateFrequency: 'Hourly–Daily' },
      { id: 'gnss', label: 'GNSS Signal Interruptions', color: '#E76F51', updateFrequency: 'Hourly' },
      { id: 'temp-stress', label: 'Temperature / Seismic Stress', color: '#E63946', updateFrequency: 'Hourly–Daily' },
      { id: 'social-signals', label: 'Social Media Signals', color: '#A8DADC', updateFrequency: 'Real time' },
      { id: 'risk-indices', label: 'Insurance / Risk Indices', color: '#457B9D', updateFrequency: 'Quarterly' },
    ]
  }
]

export default function LayerControls() {
  const { isLayerActive, toggleLayer } = useLayer()
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const dropdownRefs = useRef<Map<string, HTMLDivElement>>(new Map())

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openCategory) {
        const ref = dropdownRefs.current.get(openCategory)
        if (ref && !ref.contains(event.target as Node)) {
          setOpenCategory(null)
        }
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openCategory])

  const toggleCategory = (categoryId: string) => {
    setOpenCategory(openCategory === categoryId ? null : categoryId)
  }

  const getActiveCount = (category: CategoryConfig): number => {
    return category.layers.filter(layer => isLayerActive(layer.id)).length
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      backgroundColor: 'rgba(10, 15, 22, 0.5)',
      border: '1px solid #242C3A',
      borderRadius: '100px',
      padding: '12px 16px',
      position: 'relative',
      zIndex: 100
    }}>
      {categories.map(category => {
        const activeCount = getActiveCount(category)
        const isOpen = openCategory === category.id

        return (
          <div
            key={category.id}
            ref={(el) => {
              if (el) dropdownRefs.current.set(category.id, el)
            }}
            style={{ position: 'relative' }}
          >
            {/* Category Button */}
            <button
              onClick={() => toggleCategory(category.id)}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#39D0FF'
                e.currentTarget.style.backgroundColor = activeCount > 0 ? 'rgba(255, 255, 255, 0.08)' : 'rgba(57, 208, 255, 0.05)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#242C3A'
                e.currentTarget.style.backgroundColor = activeCount > 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent'
              }}
              style={{
                padding: '8px 18px',
                fontSize: '12px',
                fontWeight: activeCount > 0 ? 500 : 400,
                fontFamily: 'Albert Sans, sans-serif',
                color: activeCount > 0 ? '#FFFFFF' : '#8F9BB0',
                backgroundColor: activeCount > 0 ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                border: '1px solid #242C3A',
                borderRadius: '100px',
                cursor: 'pointer',
                transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span style={{
                color: activeCount > 0 ? '#FFFFFF' : '#8F9BB0',
                transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <category.Icon size={14} />
              </span>
              {category.label}
              {activeCount > 0 && (
                <span style={{
                  fontSize: '10px',
                  fontWeight: 600,
                  color: '#FFFFFF',
                  backgroundColor: '#080D12',
                  padding: '2px 6px',
                  borderRadius: '100px'
                }}>
                  {activeCount}
                </span>
              )}
              <ChevronDown
                size={14}
                style={{
                  transition: 'transform 200ms ease',
                  transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
                }}
              />
            </button>

            {/* Dropdown */}
            {isOpen && (
              <div style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                left: 0,
                minWidth: '280px',
                maxWidth: '320px',
                backgroundColor: '#141821',
                border: '1px solid #242C3A',
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                overflow: 'hidden',
                animation: 'fadeIn 150ms ease-out'
              }}>
                {/* Header */}
                <div style={{
                  padding: '12px 16px',
                  borderBottom: '1px solid #242C3A',
                  backgroundColor: '#0A0F16'
                }}>
                  <div style={{
                    fontSize: '11px',
                    fontWeight: 600,
                    fontFamily: 'Geist Mono, monospace',
                    color: category.color,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <category.Icon size={12} />
                    {category.label} Layers
                  </div>
                </div>

                {/* Layer List */}
                <div style={{
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {category.layers.map(layer => {
                    const isActive = isLayerActive(layer.id)
                    return (
                      <button
                        key={layer.id}
                        onClick={() => toggleLayer(layer.id)}
                        onMouseEnter={(e) => {
                          const checkbox = e.currentTarget.querySelector('[data-layer-checkbox]') as HTMLElement
                          if (checkbox) {
                            checkbox.style.border = `2px solid ${layer.color}`
                          }
                        }}
                        onMouseLeave={(e) => {
                          const checkbox = e.currentTarget.querySelector('[data-layer-checkbox]') as HTMLElement
                          if (checkbox) {
                            checkbox.style.border = isActive ? 'none' : '2px solid #3A4559'
                          }
                        }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: 'transparent',
                          border: 'none',
                          borderBottom: '1px solid #242C3A',
                          cursor: 'pointer',
                          transition: 'all 150ms ease',
                          textAlign: 'left'
                        }}
                      >
                        {/* Checkbox */}
                        <div
                          data-layer-checkbox
                          style={{
                            width: '16px',
                            height: '16px',
                            border: isActive ? 'none' : '2px solid #3A4559',
                            backgroundColor: isActive ? layer.color : 'transparent',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'all 150ms ease',
                            flexShrink: 0
                          }}>
                          {isActive && (
                            <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                              <path
                                d="M1.5 5L4 7.5L8.5 2.5"
                                stroke="#0A0F16"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          )}
                        </div>

                        {/* Color Indicator */}
                        <div style={{
                          width: '8px',
                          height: '8px',
                          backgroundColor: layer.color,
                          opacity: isActive ? 1 : 0.4,
                          flexShrink: 0
                        }} />

                        {/* Label & Info */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            data-layer-label
                            style={{
                              fontSize: '13px',
                              fontWeight: isActive ? 500 : 400,
                              fontFamily: 'Albert Sans, sans-serif',
                              color: '#C6CFDA',
                              marginBottom: '2px'
                            }}>
                            {layer.label}
                          </div>
                          {layer.updateFrequency && (
                            <div style={{
                              fontSize: '10px',
                              fontFamily: 'Geist Mono, monospace',
                              color: '#5E6A81',
                              letterSpacing: '0.02em'
                            }}>
                              Updates: {layer.updateFrequency}
                            </div>
                          )}
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )
      })}

      {/* Divider */}
      <div style={{
        width: '1px',
        height: '16px',
        backgroundColor: '#242C3A',
        margin: '0 8px'
      }} />

      {/* Live Indicator */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '0 8px'
      }}>
        <span style={{
          width: '6px',
          height: '6px',
          backgroundColor: '#19C6A6',
          borderRadius: '100%',
          display: 'block',
          animation: 'pulse 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite'
        }} />
        <span style={{
          fontSize: '12px',
          fontWeight: 400,
          fontFamily: 'Albert Sans, sans-serif',
          color: '#8F9BB0',
          letterSpacing: '0.05em'
        }}>
          LIVE
        </span>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(0.85);
          }
        }
      `}</style>
    </div>
  )
}
