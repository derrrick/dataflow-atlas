'use client'

import { ZoomIn, ZoomOut, RotateCcw } from 'lucide-react'

interface ZoomControlsProps {
  onZoomIn: () => void
  onZoomOut: () => void
  onReset: () => void
}

export default function ZoomControls({ onZoomIn, onZoomOut, onReset }: ZoomControlsProps) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      gap: '1px',
      backgroundColor: '#141821',
      border: '1px solid #242C3A',
      overflow: 'hidden',
    }}>
      <button
        onClick={onZoomIn}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#39D0FF15'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#39D0FF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#141821'
          e.currentTarget.style.boxShadow = 'none'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#C6CFDA'
        }}
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#141821',
          border: 'none',
          borderBottom: '1px solid #242C3A',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
        title="Zoom in"
      >
        <ZoomIn size={18} color="#C6CFDA" style={{ transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)' }} />
      </button>
      <button
        onClick={onZoomOut}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#39D0FF15'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#39D0FF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#141821'
          e.currentTarget.style.boxShadow = 'none'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#C6CFDA'
        }}
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#141821',
          border: 'none',
          borderBottom: '1px solid #242C3A',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
        title="Zoom out"
      >
        <ZoomOut size={18} color="#C6CFDA" style={{ transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)' }} />
      </button>
      <button
        onClick={onReset}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#39D0FF15'
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#39D0FF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#141821'
          e.currentTarget.style.boxShadow = 'none'
          const svg = e.currentTarget.querySelector('svg')
          if (svg) svg.style.color = '#C6CFDA'
        }}
        style={{
          width: '40px',
          height: '40px',
          backgroundColor: '#141821',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
        }}
        title="Reset view"
      >
        <RotateCcw size={18} color="#C6CFDA" style={{ transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)' }} />
      </button>
    </div>
  )
}
