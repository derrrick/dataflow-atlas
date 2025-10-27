'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

export default function DataStatusBanner() {
  const [dismissed, setDismissed] = useState(false)
  const [isLinkHovered, setIsLinkHovered] = useState(false)
  const [isDismissHovered, setIsDismissHovered] = useState(false)

  if (dismissed) return null

  return (
    <div style={{
        position: 'fixed',
        top: 'calc(50% - 200px)',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: 1000,
        width: '520px',
        height: '520px',
        backgroundColor: '#0A0F16',
        border: '1px solid #242C3A',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)',
        display: 'grid',
        gridTemplateColumns: '1fr',
        gridTemplateRows: 'auto 1fr auto',
        padding: '48px',
        gap: '32px'
      }}>
        {/* Dismiss Button - Top Right */}
        <button
          onClick={() => setDismissed(true)}
          onMouseEnter={() => setIsDismissHovered(true)}
          onMouseLeave={() => setIsDismissHovered(false)}
          style={{
            position: 'absolute',
            top: '24px',
            right: '24px',
            background: 'transparent',
            border: 'none',
            color: isDismissHovered ? '#FFFFFF' : '#5E6A81',
            cursor: 'pointer',
            padding: '8px',
            fontSize: '14px',
            lineHeight: '1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            zIndex: 1
          }}
          aria-label="Dismiss notification"
        >
          <X size={20} />
        </button>

        {/* Warning Strip */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '4px',
          backgroundColor: '#FFA500'
        }} />

        {/* Header */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
            fontSize: '64px',
            fontWeight: 700,
            fontFamily: 'Geist Mono, monospace',
            color: '#FFA500',
            lineHeight: '1',
            letterSpacing: '-0.02em'
          }}>
            ⚠
          </div>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#FFFFFF',
            lineHeight: '1.2',
            letterSpacing: '0.5px',
            textTransform: 'uppercase'
          }}>
            Federal<br/>Shutdown<br/>Impact
          </div>
        </div>

        {/* Content */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          gap: '24px'
        }}>
          <div style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#C6CFDA',
            fontFamily: 'Albert Sans, sans-serif'
          }}>
            Due to the <a
              href="https://www.whitehouse.gov/government-shutdown-clock/"
              target="_blank"
              rel="noopener noreferrer"
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
              style={{
                color: isLinkHovered ? '#FFFFFF' : '#39D0FF',
                textDecoration: 'none',
                borderBottom: `1px solid ${isLinkHovered ? '#FFFFFF' : '#39D0FF'}`,
                fontWeight: 600,
                transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                paddingBottom: '2px'
              }}
            >2025 federal government shutdown</a>, NASA FIRMS wildfire data and EPA AirNow air quality updates may be delayed or unavailable.
          </div>

          <div style={{
            fontSize: '12px',
            lineHeight: '1.5',
            color: '#8F9BB0',
            fontFamily: 'Geist Mono, monospace',
            paddingTop: '16px',
            borderTop: '1px solid #242C3A'
          }}>
            USGS earthquake monitoring continues to operate normally.
          </div>
        </div>

        {/* Footer Timestamp */}
        <div style={{
          fontSize: '10px',
          fontFamily: 'Geist Mono, monospace',
          color: '#5E6A81',
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          alignSelf: 'end'
        }}>
          Updated: 2025-01-27
        </div>
      </div>
  )
}
