'use client'

import { useEffect, useRef, useState } from 'react'

interface TooltipProps {
  visible: boolean
  x: number
  y: number
  title: string
  value: string
  source: string
  timestamp: string
  confidence?: string
}

export function Tooltip({
  visible,
  x,
  y,
  title,
  value,
  source,
  timestamp,
  confidence
}: TooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x, y })

  useEffect(() => {
    if (!tooltipRef.current || !visible) return

    const rect = tooltipRef.current.getBoundingClientRect()
    let adjustedX = x
    let adjustedY = y

    // Avoid right edge
    if (x + rect.width + 12 > window.innerWidth) {
      adjustedX = x - rect.width - 12
    }

    // Avoid bottom edge
    if (y + rect.height + 12 > window.innerHeight) {
      adjustedY = y - rect.height - 12
    }

    setPosition({ x: adjustedX, y: adjustedY })
  }, [x, y, visible])

  if (!visible) return null

  return (
    <div
      ref={tooltipRef}
      style={{
        position: 'fixed',
        left: position.x + 12,
        top: position.y + 12,
        padding: '8px 12px',
        backgroundColor: '#0A0F16',
        border: '1px solid #39D0FF',
        fontFamily: 'Geist Mono, monospace',
        fontSize: '10px',
        color: '#C6CFDA',
        pointerEvents: 'none',
        zIndex: 10000,
        boxShadow: '0 4px 12px rgba(0,0,0,0.6)',
        maxWidth: '280px',
        borderRadius: '2px'
      }}
      role="tooltip"
      aria-live="polite"
    >
      <div style={{ fontWeight: 700, marginBottom: '4px', color: '#FFFFFF' }}>
        {title}
      </div>
      <div style={{ color: '#C6CFDA', marginBottom: '4px' }}>
        {value}
      </div>
      <div style={{ color: '#8F9BB0', fontSize: '9px' }}>
        {source} • {timestamp}{confidence ? ` • ${confidence}` : ''}
      </div>
    </div>
  )
}
