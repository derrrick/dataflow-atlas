'use client'

import { ReactNode, useEffect } from 'react'
import { X, Download, Share2, Copy } from 'lucide-react'
import { useDashboard } from '@/contexts/DashboardContext'
import { transitions } from '@/lib/charts/core/tufte-theme'
import type { ChartMetadata } from '@/lib/charts/types'

interface ChartModalProps {
  chart: ChartMetadata
  children: ReactNode
}

export function ChartModal({ chart, children }: ChartModalProps) {
  const { state, closeModal } = useDashboard()
  const isOpen = state.modalChart === chart.id

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeModal()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, closeModal])

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleExportPNG = () => {
    // TODO: Implement PNG export
    console.log('Export PNG:', chart.id)
  }

  const handleExportSVG = () => {
    // TODO: Implement SVG export
    console.log('Export SVG:', chart.id)
  }

  const handleExportData = () => {
    // TODO: Implement data export (CSV/JSON)
    console.log('Export Data:', chart.id)
  }

  const handleCopyLink = () => {
    // TODO: Implement copy link with chart state
    console.log('Copy Link:', chart.id)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40"
        onClick={closeModal}
        style={{
          transition: `opacity ${transitions.modal.duration}ms ${transitions.modal.easing}`
        }}
      />

      {/* Modal */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        onClick={closeModal}
      >
        <div
          className="bg-background border border-border  w-[95vw] h-[90vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
          style={{
            transition: `transform ${transitions.modal.duration}ms ${transitions.modal.easing}, opacity ${transitions.modal.duration}ms ${transitions.modal.easing}`
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border">
            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted">{chart.number}</span>
                  <h2 className="text-base font-light text-white">{chart.name}</h2>
                </div>
                <p className="text-xs text-muted mt-1">{chart.description}</p>
              </div>
              <div className="flex items-center gap-1.5 ml-4">
                <span className="px-2 py-1 bg-white/5  text-[10px] text-muted">
                  {chart.category}
                </span>
                {chart.dataSources.map(source => (
                  <span key={source} className="px-2 py-1 bg-white/5  text-[10px] text-muted">
                    {source}
                  </span>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportPNG}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-white/5  transition-colors flex items-center gap-1.5"
                title="Export as PNG"
              >
                <Download size={14} />
                PNG
              </button>
              <button
                onClick={handleExportSVG}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-white/5  transition-colors flex items-center gap-1.5"
                title="Export as SVG"
              >
                <Download size={14} />
                SVG
              </button>
              <button
                onClick={handleExportData}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-white/5  transition-colors flex items-center gap-1.5"
                title="Export data"
              >
                <Share2 size={14} />
                Data
              </button>
              <button
                onClick={handleCopyLink}
                className="px-3 py-1.5 text-xs text-muted hover:text-foreground hover:bg-white/5  transition-colors flex items-center gap-1.5"
                title="Copy link"
              >
                <Copy size={14} />
                Link
              </button>
              <div className="w-px h-6 bg-border mx-1" />
              <button
                onClick={closeModal}
                className="p-2 text-muted hover:text-foreground hover:bg-white/5  transition-colors"
                title="Close (ESC)"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chart Content */}
          <div className="flex-1 overflow-auto p-6">
            <div className="h-full flex items-center justify-center">
              {children}
            </div>
          </div>

          {/* Footer with keyboard shortcuts */}
          <div className="px-6 py-3 border-t border-border flex items-center justify-between text-[10px] text-muted">
            <div className="flex items-center gap-4">
              <span className="font-mono">Phase {chart.phase}</span>
              <span>Priority: {chart.priority}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-mono">ESC to close</span>
              <span className="font-mono">⌘ + S to export</span>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
