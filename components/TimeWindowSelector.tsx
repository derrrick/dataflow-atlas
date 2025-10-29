'use client'

import { useTime } from '@/contexts/TimeContext'

interface TimeWindow {
  label: string
  minutes: number
}

const timeWindows: TimeWindow[] = [
  { label: '1D', minutes: 24 * 60 },
  { label: '7D', minutes: 7 * 24 * 60 },
  { label: '30D', minutes: 30 * 24 * 60 },
  { label: '90D', minutes: 90 * 24 * 60 },
  { label: '180D', minutes: 180 * 24 * 60 },
  { label: '1Y', minutes: 365 * 24 * 60 },
]

export default function TimeWindowSelector() {
  const { windowMinutes, setWindowMinutes } = useTime()

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      gap: 0
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
              borderBottom: '1px solid #242C3A',
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
  )
}
