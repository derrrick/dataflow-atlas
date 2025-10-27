'use client'

import { formatRelativeTime } from '@/lib/services/apiClient'

interface RefreshIndicatorProps {
  lastRefresh: number
  isRefreshing: boolean
}

export default function RefreshIndicator({ lastRefresh, isRefreshing }: RefreshIndicatorProps) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      padding: '8px 16px',
      backgroundColor: 'rgba(10, 15, 22, 0.5)',
      border: '1px solid #242C3A',
      borderRadius: '100px',
      position: 'absolute',
      top: '24px',
      right: '24px',
      zIndex: 100,
      fontFamily: 'Albert Sans, sans-serif',
    }}>
      <div style={{
        width: '6px',
        height: '6px',
        backgroundColor: isRefreshing ? '#39D0FF' : '#19C6A6',
        borderRadius: '100%',
        display: 'block',
        animation: isRefreshing ? 'pulse 2s cubic-bezier(0.25, 0.1, 0.25, 1) infinite' : 'none',
      }} />
      <span style={{
        fontSize: '12px',
        fontWeight: 400,
        color: '#8F9BB0',
        letterSpacing: '0.01em'
      }}>
        {isRefreshing ? 'Updating...' : `Updated ${formatRelativeTime(lastRefresh)}`}
      </span>
    </div>
  )
}
