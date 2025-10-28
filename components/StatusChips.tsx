'use client'

import { useState, useEffect } from 'react'
import { AlertCircle, CheckCircle, Clock } from 'lucide-react'

type FeedStatus = {
  source: string
  status: 'ok' | 'delayed' | 'down'
  last_update: string
  age_min: number
  count?: number
  msg?: string
}

export default function StatusChips() {
  const [statuses, setStatuses] = useState<FeedStatus[]>([])
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch('/api/status')
        if (res.ok) {
          const data = await res.json()
          setStatuses(data)
        }
      } catch (err) {
        console.error('Failed to fetch status:', err)
      }
    }

    // Initial fetch
    fetchStatus()

    // Refresh every 30 seconds
    const interval = setInterval(fetchStatus, 30_000)
    return () => clearInterval(interval)
  }, [])

  if (statuses.length === 0) return null

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ok':
        return <CheckCircle size={12} />
      case 'delayed':
        return <Clock size={12} />
      case 'down':
        return <AlertCircle size={12} />
      default:
        return <AlertCircle size={12} />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok':
        return {
          bg: 'rgba(52, 199, 89, 0.15)',
          border: '#34C759',
          text: '#34C759'
        }
      case 'delayed':
        return {
          bg: 'rgba(255, 159, 10, 0.15)',
          border: '#FF9F0A',
          text: '#FF9F0A'
        }
      case 'down':
        return {
          bg: 'rgba(255, 59, 48, 0.15)',
          border: '#FF3B30',
          text: '#FF3B30'
        }
      default:
        return {
          bg: 'rgba(142, 142, 147, 0.15)',
          border: '#8E8E93',
          text: '#8E8E93'
        }
    }
  }

  const formatAge = (ageMin: number) => {
    if (ageMin < 1) return '<1m'
    if (ageMin < 60) return `${Math.round(ageMin)}m`
    const hours = Math.floor(ageMin / 60)
    const mins = Math.round(ageMin % 60)
    if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  // Count by status
  const okCount = statuses.filter(s => s.status === 'ok').length
  const delayedCount = statuses.filter(s => s.status === 'delayed').length
  const downCount = statuses.filter(s => s.status === 'down').length

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        alignItems: 'flex-end'
      }}
    >
      {/* Summary chip */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 16px',
          backgroundColor: 'rgba(10, 15, 22, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #242C3A',
          borderRadius: '100px',
          cursor: 'pointer',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          fontFamily: 'Geist Mono, monospace',
          fontSize: '11px',
          fontWeight: 600
        }}
        onMouseEnter={e => {
          e.currentTarget.style.borderColor = '#39D0FF'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.borderColor = '#242C3A'
        }}
      >
        <span style={{ color: '#8F9BB0', letterSpacing: '0.5px' }}>DATA FEEDS</span>

        {okCount > 0 && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#34C759'
            }}
          >
            <CheckCircle size={12} />
            {okCount}
          </span>
        )}

        {delayedCount > 0 && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#FF9F0A'
            }}
          >
            <Clock size={12} />
            {delayedCount}
          </span>
        )}

        {downCount > 0 && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              color: '#FF3B30'
            }}
          >
            <AlertCircle size={12} />
            {downCount}
          </span>
        )}
      </button>

      {/* Expanded status details */}
      {expanded && (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            padding: '12px',
            backgroundColor: 'rgba(10, 15, 22, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid #242C3A',
            borderRadius: '12px',
            minWidth: '280px',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
          }}
        >
          {statuses.map(s => {
            const colors = getStatusColor(s.status)
            return (
              <div
                key={s.source}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '8px 12px',
                  backgroundColor: colors.bg,
                  border: `1px solid ${colors.border}`,
                  borderRadius: '8px',
                  fontFamily: 'Geist Mono, monospace',
                  fontSize: '10px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: colors.text }}>
                    {getStatusIcon(s.status)}
                  </span>
                  <span style={{ color: '#FFFFFF', fontWeight: 600, letterSpacing: '0.3px' }}>
                    {s.source}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {s.count !== undefined && (
                    <span style={{ color: '#8F9BB0' }}>
                      {s.count.toLocaleString()} events
                    </span>
                  )}
                  <span style={{ color: colors.text, fontWeight: 600 }}>
                    {formatAge(s.age_min)}
                  </span>
                </div>
              </div>
            )
          })}

          <div
            style={{
              marginTop: '4px',
              paddingTop: '8px',
              borderTop: '1px solid #242C3A',
              fontSize: '9px',
              color: '#5E6A81',
              textAlign: 'center',
              fontFamily: 'Geist Mono, monospace'
            }}
          >
            Updates every 30s
          </div>
        </div>
      )}
    </div>
  )
}
