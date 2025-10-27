'use client'

import { useState } from 'react'

export default function DataStatusBanner() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div style={{
      position: 'fixed',
      top: 64, // Below header
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 1000,
      maxWidth: '600px',
      width: 'calc(100% - 32px)',
      backgroundColor: '#1A2332',
      border: '1px solid #FFA500',
      borderRadius: '4px',
      padding: '12px 16px',
      fontSize: '12px',
      color: '#C6CFDA',
      display: 'flex',
      alignItems: 'flex-start',
      gap: '12px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
    }}>
      <div style={{
        color: '#FFA500',
        fontSize: '16px',
        lineHeight: '1',
        marginTop: '2px'
      }}>
        ⚠️
      </div>
      <div style={{ flex: 1 }}>
        <div style={{
          fontWeight: 600,
          color: '#FFA500',
          marginBottom: '4px'
        }}>
          Data Source Update
        </div>
        <div style={{ lineHeight: '1.5' }}>
          Some government data sources (NASA FIRMS wildfires, EPA air quality) may be experiencing delays.
          USGS earthquake data continues to update normally.
        </div>
      </div>
      <button
        onClick={() => setDismissed(true)}
        style={{
          background: 'none',
          border: 'none',
          color: '#8F9BB0',
          cursor: 'pointer',
          padding: '4px',
          fontSize: '18px',
          lineHeight: '1',
          marginTop: '-2px'
        }}
        aria-label="Dismiss"
      >
        ×
      </button>
    </div>
  )
}
