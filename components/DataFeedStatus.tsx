'use client'

import { useState, useEffect, useRef } from 'react'
import { formatRelativeTime } from '@/lib/services/apiClient'
import { Database, Circle } from 'lucide-react'

type FeedStatus = {
  source: string
  status: 'ok' | 'delayed' | 'down'
  last_update: string
  age_min: number
  count?: number
  msg?: string
}

interface DataFeedStatusProps {
  lastRefresh: number
  isRefreshing: boolean
}

export default function DataFeedStatus({ lastRefresh, isRefreshing }: DataFeedStatusProps) {
  const [statuses, setStatuses] = useState<FeedStatus[]>([])
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

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

    fetchStatus()
    const interval = setInterval(fetchStatus, 30_000)
    return () => clearInterval(interval)
  }, [])

  // Close when clicking outside
  useEffect(() => {
    if (!isOpen) return

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [isOpen])

  const formatAge = (ageMin: number) => {
    if (ageMin < 1) return '<1m'
    if (ageMin < 60) return `${Math.round(ageMin)}m`
    const hours = Math.floor(ageMin / 60)
    const mins = Math.round(ageMin % 60)
    if (hours < 24) return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
    const days = Math.floor(hours / 24)
    return `${days}d`
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ok': return '#19C6A6'
      case 'delayed': return '#FF9F0A'
      case 'down': return '#FF3B30'
      default: return '#5E6A81'
    }
  }

  const activeFeeds = statuses.filter(s => s.status === 'ok').length

  if (!isOpen) {
    // Collapsed state: compact indicator
    return (
      <button
        ref={containerRef}
        onClick={() => setIsOpen(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#39D0FF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#242C3A'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '12px 16px',
          backgroundColor: 'rgba(10, 15, 22, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #242C3A',
          borderRadius: '100px',
          cursor: 'pointer',
          transition: 'border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
        title="View data feed status"
      >
        <Database size={16} style={{ color: '#8F9BB0' }} />

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '2px'
        }}>
          <span style={{
            fontSize: '9px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            DATA FEEDS
          </span>
          <span style={{
            fontSize: '11px',
            fontWeight: 500,
            fontFamily: 'Geist Mono, monospace',
            color: '#C6CFDA',
            letterSpacing: '0.02em'
          }}>
            {activeFeeds}/{statuses.length}
          </span>
        </div>

        <div style={{
          width: '6px',
          height: '6px',
          backgroundColor: isRefreshing ? '#39D0FF' : '#19C6A6',
          borderRadius: '100%',
          marginLeft: '4px',
          animation: isRefreshing ? 'pulse 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite' : 'none'
        }} />
      </button>
    )
  }

  // Expanded state: detailed table view
  return (
    <div
      ref={containerRef}
      style={{
        width: '360px',
        backgroundColor: 'rgba(10, 15, 22, 0.95)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #242C3A',
        borderRadius: '16px',
        overflow: 'hidden'
      }}
    >
      {/* Header */}
      <button
        onClick={() => setIsOpen(false)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(57, 208, 255, 0.05)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#0A0F16'
        }}
        style={{
          width: '100%',
          padding: '12px 16px',
          backgroundColor: '#0A0F16',
          borderBottom: '1px solid #242C3A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          transition: 'background-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          border: 'none'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Database size={14} style={{ color: '#8F9BB0' }} />
          <span style={{
            fontSize: '9px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            DATA FEEDS
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#C6CFDA',
            letterSpacing: '0.02em'
          }}>
            {activeFeeds}/{statuses.length}
          </span>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '6px',
            height: '6px',
            backgroundColor: isRefreshing ? '#39D0FF' : '#19C6A6',
            borderRadius: '100%',
            animation: isRefreshing ? 'pulse 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite' : 'none'
          }} />
          <span style={{
            fontSize: '9px',
            fontFamily: 'Geist Mono, monospace',
            color: '#5E6A81',
            letterSpacing: '0.02em'
          }}>
            {isRefreshing ? 'Updating...' : `Updated ${formatRelativeTime(lastRefresh)}`}
          </span>
        </div>
      </button>

      {/* Table */}
      <div style={{ padding: '8px' }}>
        {/* Table Header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '8px 1fr auto auto',
          gap: '12px',
          padding: '8px 12px',
          borderBottom: '1px solid #242C3A'
        }}>
          <div />
          <span style={{
            fontSize: '8px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            Source
          </span>
          <span style={{
            fontSize: '8px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textAlign: 'right'
          }}>
            Events
          </span>
          <span style={{
            fontSize: '8px',
            fontWeight: 600,
            fontFamily: 'Geist Mono, monospace',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            textAlign: 'right',
            minWidth: '48px'
          }}>
            Age
          </span>
        </div>

        {/* Table Rows */}
        {statuses.map((feed, index) => (
          <div
            key={feed.source}
            style={{
              display: 'grid',
              gridTemplateColumns: '8px 1fr auto auto',
              gap: '12px',
              padding: '10px 12px',
              borderBottom: index < statuses.length - 1 ? '1px solid rgba(36, 44, 58, 0.5)' : 'none',
              transition: 'background-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}
          >
            {/* Status indicator */}
            <div style={{
              display: 'flex',
              alignItems: 'center'
            }}>
              <Circle
                size={8}
                fill={getStatusColor(feed.status)}
                style={{ color: getStatusColor(feed.status) }}
              />
            </div>

            {/* Source name */}
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              fontFamily: 'Geist Mono, monospace',
              color: '#FFFFFF',
              letterSpacing: '0.02em'
            }}>
              {feed.source}
            </span>

            {/* Event count */}
            <span style={{
              fontSize: '10px',
              fontWeight: 400,
              fontFamily: 'Geist Mono, monospace',
              color: '#8F9BB0',
              letterSpacing: '0.02em',
              textAlign: 'right',
              whiteSpace: 'nowrap'
            }}>
              {feed.count !== undefined ? feed.count.toLocaleString() : '—'}
            </span>

            {/* Age */}
            <span style={{
              fontSize: '10px',
              fontWeight: 500,
              fontFamily: 'Geist Mono, monospace',
              color: getStatusColor(feed.status),
              letterSpacing: '0.02em',
              textAlign: 'right',
              minWidth: '48px'
            }}>
              {formatAge(feed.age_min)}
            </span>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        padding: '8px 16px',
        borderTop: '1px solid #242C3A',
        backgroundColor: '#080D12',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: '8px',
          fontFamily: 'Geist Mono, monospace',
          color: '#5E6A81',
          letterSpacing: '0.02em'
        }}>
          Updates every 30s
        </span>
      </div>

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
