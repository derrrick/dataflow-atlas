'use client'

import { useEffect, useRef, useState } from 'react'
import { X, Download, Table, BarChart3, Info, ChevronLeft, ChevronRight, Filter, ZoomIn, ZoomOut } from 'lucide-react'
import type { UnifiedDataPoint } from '@/lib/services/dataTypes'

type ModalView = 'chart' | 'data' | 'insights'

interface EnhancedChartModalProps {
  isOpen: boolean
  onClose: () => void
  chartId: string
  chartName: string
  chartDescription?: string
  chartComponent: React.ReactNode
  data: UnifiedDataPoint[]
  category?: string
  onExport?: (format: 'svg' | 'png' | 'csv' | 'json') => void
  onNavigate?: (direction: 'prev' | 'next') => void
  canNavigate?: { prev: boolean; next: boolean }
}

export default function EnhancedChartModal({
  isOpen,
  onClose,
  chartId,
  chartName,
  chartDescription,
  chartComponent,
  data,
  category,
  onExport,
  onNavigate,
  canNavigate = { prev: false, next: false }
}: EnhancedChartModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)
  const [activeView, setActiveView] = useState<ModalView>('chart')
  const [selectedDataPoint, setSelectedDataPoint] = useState<UnifiedDataPoint | null>(null)
  const [sortField, setSortField] = useState<keyof UnifiedDataPoint>('timestamp')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')
  const [filterQuery, setFilterQuery] = useState('')

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // Handle arrow key navigation
  useEffect(() => {
    const handleNavigation = (e: KeyboardEvent) => {
      if (!isOpen || !onNavigate) return

      if (e.key === 'ArrowLeft' && canNavigate.prev) {
        onNavigate('prev')
      } else if (e.key === 'ArrowRight' && canNavigate.next) {
        onNavigate('next')
      }
    }

    document.addEventListener('keydown', handleNavigation)
    return () => document.removeEventListener('keydown', handleNavigation)
  }, [isOpen, onNavigate, canNavigate])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen) return null

  // Calculate statistics
  const stats = {
    total: data.length,
    avgPrimary: data.length > 0 ? (data.reduce((sum, d) => sum + d.primaryValue, 0) / data.length).toFixed(2) : '0',
    maxPrimary: data.length > 0 ? Math.max(...data.map(d => d.primaryValue)).toFixed(2) : '0',
    minPrimary: data.length > 0 ? Math.min(...data.map(d => d.primaryValue)).toFixed(2) : '0',
    dataTypes: [...new Set(data.map(d => d.dataType))],
    timeRange: data.length > 0 ? {
      start: new Date(Math.min(...data.map(d => d.timestamp))),
      end: new Date(Math.max(...data.map(d => d.timestamp)))
    } : null
  }

  // Filter and sort data
  const filteredData = data
    .filter(d => {
      if (!filterQuery) return true
      const query = filterQuery.toLowerCase()
      return (
        d.id.toLowerCase().includes(query) ||
        d.dataType.toLowerCase().includes(query) ||
        d.source?.toLowerCase().includes(query) ||
        JSON.stringify(d.metadata || {}).toLowerCase().includes(query)
      )
    })
    .sort((a, b) => {
      const aVal = a[sortField]
      const bVal = b[sortField]

      if (aVal === undefined || bVal === undefined) return 0

      if (sortDirection === 'asc') {
        return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
      } else {
        return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
      }
    })

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.90)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(8px)',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#0A0F16',
          border: '1px solid #39D0FF',
          width: '100%',
          maxWidth: '1600px',
          maxHeight: '92vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Albert Sans, sans-serif',
          boxShadow: '0 24px 48px rgba(57, 208, 255, 0.15)',
          animation: 'modalSlideIn 300ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px 32px',
          borderBottom: '1px solid #242C3A',
          background: 'linear-gradient(to bottom, #141821, #0A0F16)'
        }}>
          <div style={{ flex: 1 }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              marginBottom: '8px'
            }}>
              <span style={{
                fontFamily: 'Geist Mono, monospace',
                fontSize: '11px',
                color: '#39D0FF',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}>
                {chartId}
              </span>
              {category && (
                <span style={{
                  fontSize: '10px',
                  color: '#5E6A81',
                  fontFamily: 'Geist Mono, monospace',
                  padding: '4px 8px',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A'
                }}>
                  {category}
                </span>
              )}
            </div>
            <h2
              id="modal-title"
              style={{
                fontSize: '24px',
                color: '#FFFFFF',
                fontWeight: 600,
                margin: 0,
                marginBottom: '4px'
              }}
            >
              {chartName}
            </h2>
            {chartDescription && (
              <p style={{
                fontSize: '13px',
                color: '#8F9BB0',
                margin: 0,
                maxWidth: '600px'
              }}>
                {chartDescription}
              </p>
            )}
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Navigation */}
            {onNavigate && (
              <>
                <button
                  onClick={() => onNavigate('prev')}
                  disabled={!canNavigate.prev}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: canNavigate.prev ? '#C6CFDA' : '#3A4559',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: canNavigate.prev ? 'pointer' : 'not-allowed',
                    transition: 'all 150ms ease',
                    opacity: canNavigate.prev ? 1 : 0.4
                  }}
                  onMouseEnter={(e) => {
                    if (canNavigate.prev) {
                      e.currentTarget.style.backgroundColor = '#242C3A'
                      e.currentTarget.style.borderColor = '#39D0FF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#242C3A'
                  }}
                  aria-label="Previous chart"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={() => onNavigate('next')}
                  disabled={!canNavigate.next}
                  style={{
                    width: '36px',
                    height: '36px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: canNavigate.next ? '#C6CFDA' : '#3A4559',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: canNavigate.next ? 'pointer' : 'not-allowed',
                    transition: 'all 150ms ease',
                    opacity: canNavigate.next ? 1 : 0.4
                  }}
                  onMouseEnter={(e) => {
                    if (canNavigate.next) {
                      e.currentTarget.style.backgroundColor = '#242C3A'
                      e.currentTarget.style.borderColor = '#39D0FF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#242C3A'
                  }}
                  aria-label="Next chart"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}

            {/* Export Menu */}
            {onExport && (
              <div style={{
                position: 'relative',
                display: 'flex',
                gap: '4px',
                marginLeft: '8px'
              }}>
                <button
                  onClick={() => onExport('png')}
                  style={{
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#C6CFDA',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#242C3A'
                    e.currentTarget.style.borderColor = '#39D0FF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#242C3A'
                  }}
                  aria-label="Export as PNG"
                >
                  <Download size={14} />
                  PNG
                </button>
                <button
                  onClick={() => onExport('csv')}
                  style={{
                    padding: '10px 14px',
                    fontSize: '12px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#C6CFDA',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 150ms ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#242C3A'
                    e.currentTarget.style.borderColor = '#39D0FF'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.borderColor = '#242C3A'
                  }}
                  aria-label="Export as CSV"
                >
                  <Download size={14} />
                  CSV
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              style={{
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#C6CFDA',
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                marginLeft: '8px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#FF3B3B'
                e.currentTarget.style.borderColor = '#FF3B3B'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.borderColor = '#242C3A'
                e.currentTarget.style.color = '#C6CFDA'
              }}
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div style={{
          display: 'flex',
          gap: '4px',
          padding: '16px 32px',
          borderBottom: '1px solid #242C3A',
          backgroundColor: '#141821'
        }}>
          {[
            { id: 'chart' as const, label: 'Visualization', icon: BarChart3 },
            { id: 'data' as const, label: 'Data Table', icon: Table },
            { id: 'insights' as const, label: 'Insights', icon: Info }
          ].map(view => (
            <button
              key={view.id}
              onClick={() => setActiveView(view.id)}
              style={{
                padding: '10px 20px',
                fontSize: '13px',
                fontWeight: 500,
                fontFamily: 'Albert Sans, sans-serif',
                color: activeView === view.id ? '#FFFFFF' : '#8F9BB0',
                backgroundColor: activeView === view.id ? '#39D0FF15' : 'transparent',
                border: `1px solid ${activeView === view.id ? '#39D0FF' : 'transparent'}`,
                cursor: 'pointer',
                transition: 'all 200ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                if (activeView !== view.id) {
                  e.currentTarget.style.backgroundColor = '#242C3A'
                }
              }}
              onMouseLeave={(e) => {
                if (activeView !== view.id) {
                  e.currentTarget.style.backgroundColor = 'transparent'
                }
              }}
            >
              <view.icon size={16} />
              {view.label}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          backgroundColor: '#0A0F16'
        }}>
          {/* Chart View */}
          {activeView === 'chart' && (
            <div style={{
              padding: '48px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: '600px'
            }}>
              {chartComponent}
            </div>
          )}

          {/* Data Table View */}
          {activeView === 'data' && (
            <div style={{ padding: '32px' }}>
              {/* Filter Bar */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '24px',
                padding: '16px',
                backgroundColor: '#141821',
                border: '1px solid #242C3A'
              }}>
                <Filter size={16} color="#8F9BB0" />
                <input
                  type="text"
                  placeholder="Filter by ID, type, source, or metadata..."
                  value={filterQuery}
                  onChange={(e) => setFilterQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    fontSize: '13px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#C6CFDA',
                    backgroundColor: '#0A0F16',
                    border: '1px solid #242C3A',
                    outline: 'none'
                  }}
                />
                <span style={{
                  fontSize: '12px',
                  color: '#5E6A81',
                  fontFamily: 'Geist Mono, monospace'
                }}>
                  {filteredData.length} / {data.length} events
                </span>
              </div>

              {/* Table */}
              <div style={{
                overflowX: 'auto',
                border: '1px solid #242C3A'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontSize: '12px',
                  fontFamily: 'Geist Mono, monospace'
                }}>
                  <thead>
                    <tr style={{
                      backgroundColor: '#141821',
                      borderBottom: '1px solid #242C3A'
                    }}>
                      {['timestamp', 'dataType', 'primaryValue', 'secondaryValue', 'source', 'location'].map(field => (
                        <th
                          key={field}
                          onClick={() => {
                            setSortField(field as keyof UnifiedDataPoint)
                            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
                          }}
                          style={{
                            padding: '12px 16px',
                            textAlign: 'left',
                            color: '#8F9BB0',
                            fontWeight: 600,
                            cursor: 'pointer',
                            textTransform: 'capitalize',
                            userSelect: 'none'
                          }}
                        >
                          {field} {sortField === field && (sortDirection === 'asc' ? '↑' : '↓')}
                        </th>
                      ))}
                      <th style={{
                        padding: '12px 16px',
                        textAlign: 'left',
                        color: '#8F9BB0',
                        fontWeight: 600
                      }}>
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 100).map((point, idx) => (
                      <tr
                        key={point.id}
                        style={{
                          backgroundColor: idx % 2 === 0 ? '#0A0F16' : '#141821',
                          borderBottom: '1px solid #242C3A',
                          transition: 'background-color 150ms ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.backgroundColor = '#1A2332'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.backgroundColor = idx % 2 === 0 ? '#0A0F16' : '#141821'
                        }}
                      >
                        <td style={{ padding: '10px 16px', color: '#C6CFDA' }}>
                          {new Date(point.timestamp).toLocaleString()}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#C6CFDA' }}>
                          <span style={{
                            padding: '4px 8px',
                            backgroundColor: point.dataType === 'earthquake' ? '#FF3B3B15' : point.dataType === 'wildfire' ? '#FFB34115' : '#39D0FF15',
                            color: point.dataType === 'earthquake' ? '#FF3B3B' : point.dataType === 'wildfire' ? '#FFB341' : '#39D0FF',
                            fontSize: '11px',
                            fontWeight: 600
                          }}>
                            {point.dataType}
                          </span>
                        </td>
                        <td style={{ padding: '10px 16px', color: '#C6CFDA' }}>
                          {point.primaryValue.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#8F9BB0' }}>
                          {point.secondaryValue?.toFixed(2) || 'N/A'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#8F9BB0' }}>
                          {point.source || 'Unknown'}
                        </td>
                        <td style={{ padding: '10px 16px', color: '#8F9BB0', fontSize: '11px' }}>
                          {point.location.lat.toFixed(2)}, {point.location.lon.toFixed(2)}
                        </td>
                        <td style={{ padding: '10px 16px' }}>
                          <button
                            onClick={() => setSelectedDataPoint(point)}
                            style={{
                              padding: '6px 12px',
                              fontSize: '11px',
                              color: '#39D0FF',
                              backgroundColor: 'transparent',
                              border: '1px solid #39D0FF',
                              cursor: 'pointer',
                              transition: 'all 150ms ease'
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = '#39D0FF15'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                          >
                            View Details
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {filteredData.length > 100 && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px',
                  textAlign: 'center',
                  color: '#5E6A81',
                  fontSize: '12px',
                  fontFamily: 'Geist Mono, monospace',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A'
                }}>
                  Showing first 100 of {filteredData.length} events
                </div>
              )}
            </div>
          )}

          {/* Insights View */}
          {activeView === 'insights' && (
            <div style={{ padding: '32px' }}>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '24px',
                marginBottom: '32px'
              }}>
                {/* Statistics Cards */}
                <div style={{
                  padding: '24px',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#5E6A81',
                    fontFamily: 'Geist Mono, monospace',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Total Events
                  </div>
                  <div style={{
                    fontSize: '36px',
                    color: '#39D0FF',
                    fontWeight: 600,
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    {stats.total}
                  </div>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#5E6A81',
                    fontFamily: 'Geist Mono, monospace',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Average Value
                  </div>
                  <div style={{
                    fontSize: '36px',
                    color: '#FFB341',
                    fontWeight: 600,
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    {stats.avgPrimary}
                  </div>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#5E6A81',
                    fontFamily: 'Geist Mono, monospace',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Maximum Value
                  </div>
                  <div style={{
                    fontSize: '36px',
                    color: '#FF3B3B',
                    fontWeight: 600,
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    {stats.maxPrimary}
                  </div>
                </div>

                <div style={{
                  padding: '24px',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A'
                }}>
                  <div style={{
                    fontSize: '11px',
                    color: '#5E6A81',
                    fontFamily: 'Geist Mono, monospace',
                    marginBottom: '8px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    Minimum Value
                  </div>
                  <div style={{
                    fontSize: '36px',
                    color: '#8F9BB0',
                    fontWeight: 600,
                    fontFamily: 'Albert Sans, sans-serif'
                  }}>
                    {stats.minPrimary}
                  </div>
                </div>
              </div>

              {/* Time Range */}
              {stats.timeRange && (
                <div style={{
                  padding: '24px',
                  backgroundColor: '#141821',
                  border: '1px solid #242C3A',
                  marginBottom: '24px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#C6CFDA',
                    fontWeight: 600,
                    marginBottom: '16px'
                  }}>
                    Time Range
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: '12px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0'
                  }}>
                    <div>
                      <span style={{ color: '#5E6A81' }}>Start: </span>
                      {stats.timeRange.start.toLocaleString()}
                    </div>
                    <div>
                      <span style={{ color: '#5E6A81' }}>End: </span>
                      {stats.timeRange.end.toLocaleString()}
                    </div>
                  </div>
                </div>
              )}

              {/* Data Types */}
              <div style={{
                padding: '24px',
                backgroundColor: '#141821',
                border: '1px solid #242C3A'
              }}>
                <div style={{
                  fontSize: '13px',
                  color: '#C6CFDA',
                  fontWeight: 600,
                  marginBottom: '16px'
                }}>
                  Data Types in this Visualization
                </div>
                <div style={{
                  display: 'flex',
                  gap: '12px',
                  flexWrap: 'wrap'
                }}>
                  {stats.dataTypes.map((type, index) => (
                    <span
                      key={`${type}-${index}`}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: type === 'earthquake' ? '#FF3B3B15' : type === 'wildfire' ? '#FFB34115' : '#39D0FF15',
                        color: type === 'earthquake' ? '#FF3B3B' : type === 'wildfire' ? '#FFB341' : '#39D0FF',
                        fontSize: '12px',
                        fontWeight: 600,
                        textTransform: 'capitalize',
                        border: `1px solid ${type === 'earthquake' ? '#FF3B3B' : type === 'wildfire' ? '#FFB341' : '#39D0FF'}`
                      }}
                    >
                      {type} ({data.filter(d => d.dataType === type).length})
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 32px',
          borderTop: '1px solid #242C3A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#5E6A81',
          fontFamily: 'Geist Mono, monospace',
          backgroundColor: '#141821'
        }}>
          <span>ESC to close {onNavigate && '• ← → to navigate charts'}</span>
          <span>{data.length} data points</span>
        </div>
      </div>

      {/* Detail Panel (when data point selected) */}
      {selectedDataPoint && (
        <div
          style={{
            position: 'fixed',
            right: '24px',
            top: '50%',
            transform: 'translateY(-50%)',
            width: '400px',
            maxHeight: '80vh',
            backgroundColor: '#141821',
            border: '1px solid #39D0FF',
            boxShadow: '0 24px 48px rgba(57, 208, 255, 0.15)',
            overflow: 'auto',
            zIndex: 2001,
            animation: 'slideInRight 250ms cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
        >
          <div style={{
            padding: '20px',
            borderBottom: '1px solid #242C3A',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <h3 style={{
              fontSize: '16px',
              color: '#FFFFFF',
              fontWeight: 600,
              margin: 0
            }}>
              Event Details
            </h3>
            <button
              onClick={() => setSelectedDataPoint(null)}
              style={{
                width: '28px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8F9BB0',
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                cursor: 'pointer'
              }}
            >
              <X size={14} />
            </button>
          </div>
          <div style={{ padding: '20px' }}>
            {Object.entries(selectedDataPoint).map(([key, value]) => (
              <div
                key={key}
                style={{
                  marginBottom: '16px',
                  paddingBottom: '16px',
                  borderBottom: '1px solid #242C3A'
                }}
              >
                <div style={{
                  fontSize: '10px',
                  color: '#5E6A81',
                  fontFamily: 'Geist Mono, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '6px'
                }}>
                  {key}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#C6CFDA',
                  fontFamily: 'Geist Mono, monospace',
                  wordBreak: 'break-word'
                }}>
                  {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes modalSlideIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateY(-50%) translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) translateX(0);
          }
        }
      `}</style>
    </div>
  )
}
