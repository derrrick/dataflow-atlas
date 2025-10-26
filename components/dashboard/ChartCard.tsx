'use client'

import { ReactNode, useState } from 'react'
import { Maximize2, Check } from 'lucide-react'
import { useDashboard } from '@/contexts/DashboardContext'
import type { ChartMetadata } from '@/lib/charts/types'

interface ChartCardProps {
  chart: ChartMetadata
  children: ReactNode
  compact?: boolean
}

export function ChartCard({ chart, children, compact = false }: ChartCardProps) {
  const { state, openModal, toggleChart } = useDashboard()
  const [isHovered, setIsHovered] = useState(false)
  const isSelected = state.selectedCharts.includes(chart.id)

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation()
    openModal(chart.id)
  }

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggleChart(chart.id)
  }

  return (
    <div
      className={`relative bg-white/[0.02] border border-border  overflow-hidden transition-all ${
        isSelected ? 'ring-2 ring-white/20' : ''
      } ${isHovered ? 'border-white/20' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        breakInside: 'avoid',
        marginBottom: state.chartLayout === 'masonry' ? '1rem' : undefined,
        minHeight: compact ? '180px' : '250px'
      }}
    >
      {/* Chart Header */}
      <div className="flex items-start justify-between px-3 py-2 border-b border-border/50">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono text-muted">{chart.number}</span>
            <h3 className="text-xs font-light text-foreground truncate">{chart.name}</h3>
          </div>
          {!compact && (
            <p className="text-[10px] text-muted mt-0.5 line-clamp-1">{chart.description}</p>
          )}
        </div>

        {/* Actions (visible on hover or when selected) */}
        {(isHovered || isSelected) && (
          <div className="flex items-center gap-1 ml-2">
            <button
              onClick={handleSelect}
              className={`p-1.5  transition-colors ${
                isSelected
                  ? 'bg-white/10 text-white'
                  : 'hover:bg-white/5 text-muted hover:text-foreground'
              }`}
              title={isSelected ? 'Deselect chart' : 'Select chart'}
            >
              <Check size={12} />
            </button>
            <button
              onClick={handleMaximize}
              className="p-1.5 hover:bg-white/5 text-muted hover:text-foreground  transition-colors"
              title="View full screen"
            >
              <Maximize2 size={12} />
            </button>
          </div>
        )}
      </div>

      {/* Chart Content */}
      <div
        className={`relative cursor-pointer ${compact ? 'p-2' : 'p-4'}`}
        onClick={handleMaximize}
      >
        {children}
      </div>

      {/* Footer with metadata (only in non-compact mode) */}
      {!compact && (
        <div className="px-3 py-1.5 border-t border-border/50 flex items-center justify-between text-[9px] text-muted">
          <div className="flex items-center gap-2">
            <span className="px-1.5 py-0.5 bg-white/5 ">
              {chart.category}
            </span>
            {chart.dataSources.map(source => (
              <span key={source} className="px-1.5 py-0.5 bg-white/5 ">
                {source}
              </span>
            ))}
          </div>
          <span className="font-mono">
            Phase {chart.phase}
          </span>
        </div>
      )}
    </div>
  )
}
