'use client'

import { useEffect, useRef } from 'react'

interface ChartModalProps {
  isOpen: boolean
  onClose: () => void
  chartId: string
  chartName: string
  chartComponent: React.ReactNode
  onExport?: (format: 'svg' | 'png' | 'csv' | 'json') => void
}

export default function ChartModal({
  isOpen,
  onClose,
  chartId,
  chartName,
  chartComponent,
  onExport
}: ChartModalProps) {
  const modalRef = useRef<HTMLDivElement>(null)

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

  // Focus trap
  useEffect(() => {
    if (isOpen && modalRef.current) {
      const focusableElements = modalRef.current.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
      const firstElement = focusableElements[0] as HTMLElement
      const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement

      const handleTab = (e: KeyboardEvent) => {
        if (e.key === 'Tab') {
          if (e.shiftKey) {
            if (document.activeElement === firstElement) {
              e.preventDefault()
              lastElement?.focus()
            }
          } else {
            if (document.activeElement === lastElement) {
              e.preventDefault()
              firstElement?.focus()
            }
          }
        }
      }

      document.addEventListener('keydown', handleTab)
      firstElement?.focus()

      return () => document.removeEventListener('keydown', handleTab)
    }
  }, [isOpen])

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

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.85)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2000,
        backdropFilter: 'blur(4px)',
        padding: '24px'
      }}
      onClick={onClose}
    >
      <div
        ref={modalRef}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#141821',
          border: '1px solid #242C3A',
          width: '100%',
          maxWidth: '1400px',
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          fontFamily: 'Albert Sans, sans-serif',
          animation: 'fadeIn 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid #242C3A'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <span style={{
              fontFamily: 'Geist Mono, monospace',
              fontSize: '11px',
              color: '#5E6A81',
              fontWeight: 500
            }}>
              {chartId}
            </span>
            <h2
              id="modal-title"
              style={{
                fontSize: '18px',
                color: '#C6CFDA',
                fontWeight: 300,
                margin: 0
              }}
            >
              {chartName}
            </h2>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {/* Export Menu */}
            {onExport && (
              <div style={{
                position: 'relative',
                display: 'flex',
                gap: '4px'
              }}>
                <button
                  onClick={() => onExport('svg')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#242C3A'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  aria-label="Export as SVG"
                >
                  SVG
                </button>
                <button
                  onClick={() => onExport('png')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#242C3A'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  aria-label="Export as PNG"
                >
                  PNG
                </button>
                <button
                  onClick={() => onExport('csv')}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#242C3A'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '12px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    backgroundColor: 'transparent',
                    border: '1px solid #242C3A',
                    cursor: 'pointer',
                    transition: 'all 150ms ease'
                  }}
                  aria-label="Export as CSV"
                >
                  CSV
                </button>
              </div>
            )}

            {/* Close Button */}
            <button
              onClick={onClose}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#242C3A'
                e.currentTarget.style.color = '#FFFFFF'
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#8F9BB0'
                e.currentTarget.style.boxShadow = 'none'
              }}
              style={{
                width: '32px',
                height: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px',
                color: '#8F9BB0',
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                cursor: 'pointer',
                transition: 'all 150ms ease'
              }}
              aria-label="Close modal"
            >
              ×
            </button>
          </div>
        </div>

        {/* Chart Content */}
        <div style={{
          flex: 1,
          overflow: 'auto',
          padding: '32px',
          backgroundColor: '#0A0F16'
        }}>
          {chartComponent}
        </div>

        {/* Footer with keyboard shortcuts hint */}
        <div style={{
          padding: '12px 24px',
          borderTop: '1px solid #242C3A',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '11px',
          color: '#5E6A81',
          fontFamily: 'Geist Mono, monospace'
        }}>
          <span>Press ESC to close</span>
          <span>Use ← → to navigate between charts</span>
        </div>
      </div>
    </div>
  )
}
