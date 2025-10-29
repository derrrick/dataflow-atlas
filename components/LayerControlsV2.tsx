'use client'

import { useState, useRef, useEffect } from 'react'
import { useLayer } from '@/contexts/LayerContext'
import { useTime } from '@/contexts/TimeContext'
import { ChevronRight, ChevronDown, Check, Play, Pause, SkipBack, SkipForward } from 'lucide-react'
import { categories } from '@/lib/layerConfig'

const timeWindows = [
  { label: '1D', minutes: 24 * 60 },
  { label: '7D', minutes: 7 * 24 * 60 },
  { label: '30D', minutes: 30 * 24 * 60 },
  { label: '90D', minutes: 90 * 24 * 60 },
  { label: '180D', minutes: 180 * 24 * 60 },
  { label: '1Y', minutes: 365 * 24 * 60 },
]

export default function LayerControlsV2() {
  const { isLayerActive, toggleLayer } = useLayer()
  const { windowMinutes, setWindowMinutes, setTimeRange } = useTime()
  const [layersExpanded, setLayersExpanded] = useState(false)
  const [timeExpanded, setTimeExpanded] = useState(false)
  const [openPopover, setOpenPopover] = useState<string | null>(null)
  const [playing, setPlaying] = useState(false)
  const [end, setEnd] = useState<number>(() => Date.now())
  const [isDragging, setIsDragging] = useState(false)
  const popoverRefs = useRef<Map<string, HTMLDivElement>>(new Map())
  const progressBarRef = useRef<HTMLDivElement>(null)
  const raf = useRef<number | undefined>()

  const start = end - windowMinutes * 60_000
  const progressPercent = ((end - (Date.now() - windowMinutes * 60_000)) / (windowMinutes * 60_000)) * 100

  const getActiveCount = (category: CategoryConfig) =>
    category.layers.filter(layer => isLayerActive(layer.id)).length

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (openPopover) {
        const ref = popoverRefs.current.get(openPopover)
        if (ref && !ref.contains(event.target as Node)) {
          setOpenPopover(null)
        }
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [openPopover])

  // Playback functionality
  useEffect(() => {
    if (!playing) return
    const step = () => {
      setEnd(t => {
        const next = t + 300 // 300ms steps
        if (next > Date.now()) {
          setPlaying(false)
          return Date.now()
        }
        return next
      })
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing])

  // Update TimeContext when end changes
  useEffect(() => {
    const start = end - windowMinutes * 60_000
    setTimeRange(start, end)
  }, [end, windowMinutes, setTimeRange])

  const jumpBackward = () => {
    setEnd(t => Math.max(Date.now() - windowMinutes * 60_000, t - 60_000 * 60))
  }

  const jumpForward = () => {
    setEnd(t => Math.min(Date.now(), t + 60_000 * 60))
  }

  const resetToNow = () => {
    setEnd(Date.now())
    setPlaying(false)
  }

  const isAtPresent = end >= Date.now() - 5000

  const formatTime = (ms: number) => {
    return new Date(ms).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  // Handle progress bar dragging
  const handleProgressBarInteraction = (clientX: number) => {
    if (!progressBarRef.current) return

    const rect = progressBarRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
    const minTime = Date.now() - windowMinutes * 60_000
    const maxTime = Date.now()
    const newEnd = minTime + (maxTime - minTime) * percent

    setEnd(newEnd)
    setPlaying(false)
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true)
    handleProgressBarInteraction(e.clientX)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      handleProgressBarInteraction(e.clientX)
    }
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  // Add/remove global mouse listeners for dragging
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
      return () => {
        document.removeEventListener('mousemove', handleMouseMove)
        document.removeEventListener('mouseup', handleMouseUp)
      }
    }
  }, [isDragging])

  return (
    <div style={{
      width: '280px',
      backgroundColor: 'rgba(10, 15, 22, 0.5)',
      border: '1px solid #242C3A',
      borderRadius: '24px'
    }}>
      {/* Header: DATA CONTROLS + LIVE */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        borderBottom: '1px solid #242C3A',
        borderRadius: '24px 24px 0 0'
      }}>
        <div style={{
          fontSize: '11px',
          fontWeight: 600,
          fontFamily: 'Albert Sans, sans-serif',
          color: '#C6CFDA',
          letterSpacing: '0.02em'
        }}>
          Map Controls
        </div>
        {/* LIVE indicator with pulse */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 8px',
          backgroundColor: 'rgba(25, 198, 166, 0.08)',
          border: '1px solid rgba(25, 198, 166, 0.3)',
          borderRadius: '100px'
        }}>
          <span style={{
            width: '4px',
            height: '4px',
            backgroundColor: '#19C6A6',
            borderRadius: '50%',
            animation: 'pulse 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite'
          }} />
          <span style={{
            fontSize: '8px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#19C6A6',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            LIVE
          </span>
        </div>
      </div>

      {/* LAYERS Accordion Header */}
      <button
        onClick={() => setLayersExpanded(!layersExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(57, 208, 255, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        style={{
          width: '100%',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: '1px solid #242C3A',
          cursor: 'pointer',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        <div style={{
          fontSize: '9px',
          fontWeight: 600,
          fontFamily: 'Geist Mono, monospace',
          color: '#5E6A81',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          LAYERS
        </div>
        <ChevronDown
          size={10}
          style={{
            color: '#5E6A81',
            transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            transform: layersExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Categories */}
      {layersExpanded && (
        <div style={{ borderBottom: '1px solid #242C3A' }}>
          {categories.map(category => {
            const activeCount = getActiveCount(category)
            const isOpen = openPopover === category.id

            return (
              <div
                key={category.id}
                ref={(el) => {
                  if (el) popoverRefs.current.set(category.id, el)
                }}
                style={{ position: 'relative' }}
              >
                <button
                  onClick={() => setOpenPopover(isOpen ? null : category.id)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(57, 208, 255, 0.05)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderTop: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                  }}
                >
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <category.Icon
                      size={12}
                      style={{ color: '#FFFFFF' }}
                    />
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 500,
                      fontFamily: 'Geist Mono, monospace',
                      color: '#C6CFDA',
                      letterSpacing: '0.02em'
                    }}>
                      {category.label}
                    </span>
                    <span style={{
                      fontSize: '9px',
                      fontFamily: 'Geist Mono, monospace',
                      color: '#5E6A81',
                      letterSpacing: '0.02em'
                    }}>
                      ({activeCount}/{category.layers.length})
                    </span>
                  </div>
                  <ChevronRight
                    size={10}
                    style={{ color: '#5E6A81' }}
                  />
                </button>

                {/* Popover */}
                {isOpen && (
                  <div style={{
                    position: 'absolute',
                    left: '100%',
                    top: 0,
                    marginLeft: '8px',
                    width: '280px',
                    backgroundColor: '#0A0F16',
                    border: '1px solid #242C3A',
                    borderRadius: '16px',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
                    overflow: 'hidden',
                    zIndex: 1000
                  }}>
                    {/* Popover Header */}
                    <div style={{
                      padding: '12px 16px',
                      borderBottom: '1px solid #242C3A',
                      backgroundColor: '#080D12',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      <category.Icon
                        size={10}
                        style={{ color: category.color }}
                      />
                      <div style={{
                        fontSize: '9px',
                        fontWeight: 600,
                        fontFamily: 'Geist Mono, monospace',
                        color: category.color,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px'
                      }}>
                        {category.label}
                      </div>
                    </div>

                    {/* Layer List */}
                    <div style={{
                      maxHeight: '320px',
                      overflowY: 'auto'
                    }}>
                      {category.layers.map((layer, index) => {
                        const isActive = isLayerActive(layer.id)
                        return (
                          <button
                            key={layer.id}
                            onClick={() => toggleLayer(layer.id)}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = 'rgba(57, 208, 255, 0.05)'
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent'
                            }}
                            style={{
                              width: '100%',
                              padding: '10px 16px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              backgroundColor: 'transparent',
                              border: 'none',
                              borderTop: index === 0 ? 'none' : '1px solid #242C3A',
                              cursor: 'pointer',
                              transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                            }}
                          >
                            {/* Checkbox */}
                            <div style={{
                              width: '12px',
                              height: '12px',
                              border: isActive ? 'none' : '1px solid #3A4559',
                              backgroundColor: isActive ? layer.color : 'transparent',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              flexShrink: 0,
                              transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                            }}>
                              {isActive && (
                                <Check size={8} strokeWidth={3} style={{ color: '#0A0F16' }} />
                              )}
                            </div>

                            {/* Label */}
                            <div style={{
                              flex: 1,
                              textAlign: 'left',
                              minWidth: 0
                            }}>
                              <div style={{
                                fontSize: '9px',
                                fontWeight: isActive ? 500 : 400,
                                fontFamily: 'Geist Mono, monospace',
                                color: isActive ? '#FFFFFF' : '#8F9BB0',
                                transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                                letterSpacing: '0.02em',
                                marginBottom: '2px'
                              }}>
                                {layer.label}
                              </div>
                              <div style={{
                                fontSize: '8px',
                                fontFamily: 'Geist Mono, monospace',
                                color: '#5E6A81',
                                letterSpacing: '0.02em'
                              }}>
                                {layer.updateFrequency}
                              </div>
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
        </div>
      )}

      {/* TIME Section */}
      <button
        onClick={() => setTimeExpanded(!timeExpanded)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(57, 208, 255, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'transparent'
        }}
        style={{
          width: '100%',
          padding: '16px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: 'transparent',
          border: 'none',
          borderBottom: timeExpanded ? 'none' : '1px solid #242C3A',
          borderRadius: timeExpanded ? '0' : '0 0 24px 24px',
          cursor: 'pointer',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        <div style={{
          fontSize: '9px',
          fontWeight: 600,
          fontFamily: 'Geist Mono, monospace',
          color: '#5E6A81',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          TIME
        </div>
        <ChevronDown
          size={10}
          style={{
            color: '#5E6A81',
            transition: 'transform 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            transform: timeExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
          }}
        />
      </button>

      {/* Time Controls (when expanded) */}
      {timeExpanded && (
        <div>
          {/* Window Selector */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(6, 1fr)',
            gap: 0,
            borderBottom: '1px solid #242C3A'
          }}>
            {timeWindows.map(window => {
              const isActive = windowMinutes === window.minutes
              return (
                <button
                  key={window.label}
                  onClick={() => setWindowMinutes(window.minutes)}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#FFFFFF'
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.color = '#8F9BB0'
                    }
                  }}
                  style={{
                    padding: '10px 8px',
                    fontSize: '9px',
                    fontWeight: isActive ? 600 : 400,
                    fontFamily: 'Geist Mono, monospace',
                    color: isActive ? '#FFFFFF' : '#8F9BB0',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRight: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    textAlign: 'center'
                  }}
                >
                  {window.label}
                </button>
              )
            })}
          </div>

          {/* Playback Controls */}
          <div style={{
            padding: '12px 16px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {/* Control Buttons */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              {/* Skip Backward */}
              <button
                onClick={jumpBackward}
                disabled={end <= Date.now() - windowMinutes * 60_000 + 60_000}
                onMouseEnter={(e) => {
                  if (end > Date.now() - windowMinutes * 60_000 + 60_000) {
                    e.currentTarget.style.color = '#FFFFFF'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = end <= Date.now() - windowMinutes * 60_000 + 60_000 ? '#5E6A81' : '#8F9BB0'
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: end <= Date.now() - windowMinutes * 60_000 + 60_000 ? '#5E6A81' : '#8F9BB0',
                  cursor: end <= Date.now() - windowMinutes * 60_000 + 60_000 ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                }}
                title="Jump back 1 hour"
              >
                <SkipBack size={14} />
              </button>

              {/* Play/Pause */}
              <button
                onClick={() => {
                  if (playing || !isAtPresent) {
                    setPlaying(p => !p)
                  }
                }}
                disabled={!playing && isAtPresent}
                onMouseEnter={(e) => {
                  if (!(!playing && isAtPresent)) {
                    e.currentTarget.style.backgroundColor = playing ? 'rgba(255, 59, 48, 0.08)' : 'rgba(57, 208, 255, 0.08)'
                  }
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = playing ? 'rgba(255, 59, 48, 0.05)' : (!playing && isAtPresent) ? 'rgba(94, 106, 129, 0.05)' : 'rgba(57, 208, 255, 0.05)'
                }}
                style={{
                  backgroundColor: playing ? 'rgba(255, 59, 48, 0.05)' : (!playing && isAtPresent) ? 'rgba(94, 106, 129, 0.05)' : 'rgba(57, 208, 255, 0.05)',
                  border: `1px solid ${playing ? '#FF3B30' : (!playing && isAtPresent) ? '#5E6A81' : '#39D0FF'}`,
                  color: playing ? '#FF3B30' : (!playing && isAtPresent) ? '#5E6A81' : '#39D0FF',
                  cursor: (!playing && isAtPresent) ? 'not-allowed' : 'pointer',
                  padding: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '100px',
                  transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                  width: '24px',
                  height: '24px'
                }}
                title={(!playing && isAtPresent) ? "Already at present time" : "Play/Pause"}
              >
                {playing ? <Pause size={10} /> : <Play size={10} />}
              </button>

              {/* Skip Forward */}
              <button
                onClick={jumpForward}
                disabled={isAtPresent}
                onMouseEnter={(e) => {
                  if (!isAtPresent) e.currentTarget.style.color = '#FFFFFF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isAtPresent ? '#5E6A81' : '#8F9BB0'
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: isAtPresent ? '#5E6A81' : '#8F9BB0',
                  cursor: isAtPresent ? 'not-allowed' : 'pointer',
                  padding: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                }}
                title="Jump forward 1 hour"
              >
                <SkipForward size={14} />
              </button>

              {/* Flex spacer */}
              <div style={{ flex: 1 }} />

              {/* Now Button */}
              <button
                onClick={resetToNow}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#39D0FF'
                  e.currentTarget.style.color = '#FFFFFF'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#242C3A'
                  e.currentTarget.style.color = '#8F9BB0'
                }}
                style={{
                  background: 'transparent',
                  border: '1px solid #242C3A',
                  color: '#8F9BB0',
                  cursor: 'pointer',
                  padding: '4px 12px',
                  borderRadius: '100px',
                  fontSize: '9px',
                  fontWeight: 600,
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase',
                  transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                  fontFamily: 'Geist Mono, monospace'
                }}
                title="Jump to now"
              >
                Now
              </button>
            </div>

            {/* Time Display */}
            <div style={{
              fontSize: '9px',
              fontFamily: 'Geist Mono, monospace',
              letterSpacing: '0.02em',
              textAlign: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px'
            }}>
              <span style={{ color: '#5E6A81' }}>{formatTime(start)}</span>
              <span style={{ color: '#39D0FF' }}>→</span>
              <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{formatTime(end)}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            ref={progressBarRef}
            onMouseDown={handleMouseDown}
            style={{
              position: 'relative',
              height: '14px',
              background: 'rgba(36, 44, 58, 0.5)',
              borderRadius: '0 0 24px 24px',
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                bottom: 0,
                width: `${Math.max(0, Math.min(100, progressPercent))}%`,
                background: '#39D0FF',
                transition: playing ? 'none' : 'width 300ms ease-out',
                pointerEvents: 'none'
              }}
            />
            {/* Draggable Handle */}
            <div
              style={{
                position: 'absolute',
                left: `${Math.max(0, Math.min(100, progressPercent))}%`,
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '12px',
                height: '12px',
                backgroundColor: '#39D0FF',
                border: '2px solid #0A0F16',
                borderRadius: '50%',
                cursor: 'grab',
                transition: playing ? 'none' : 'left 300ms ease-out',
                pointerEvents: 'none',
                boxShadow: '0 2px 8px rgba(57, 208, 255, 0.4)'
              }}
            />
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.4;
          }
        }
      `}</style>
    </div>
  )
}
