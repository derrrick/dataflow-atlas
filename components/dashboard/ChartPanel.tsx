'use client'

import { ReactNode } from 'react'
import { ChevronUp, ChevronDown, Maximize2, Minimize2, Grid3x3, List, LayoutGrid } from 'lucide-react'
import { useDashboard } from '@/contexts/DashboardContext'
import { panelHeights, transitions } from '@/lib/charts/core/tufte-theme'
import type { ChartLayout } from '@/contexts/DashboardContext'

interface ChartPanelProps {
  children: ReactNode
}

export function ChartPanel({ children }: ChartPanelProps) {
  const { state, expandPanel, collapsePanel, togglePanel, setChartLayout, toggleSidebar } = useDashboard()

  const getHeight = () => {
    switch (state.panelState) {
      case 'collapsed':
        return panelHeights.collapsed
      case 'half':
        return panelHeights.half
      case 'full':
        return panelHeights.full
    }
  }

  const getGridClass = () => {
    switch (state.chartLayout) {
      case 'grid':
        return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4'
      case 'list':
        return 'flex flex-col gap-4'
      case 'masonry':
        return 'columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4'
    }
  }

  const LayoutButton = ({ layout, icon: Icon }: { layout: ChartLayout; icon: typeof Grid3x3 }) => (
    <button
      onClick={() => setChartLayout(layout)}
      className={`p-2  transition-colors ${
        state.chartLayout === layout
          ? 'bg-white/10 text-white'
          : 'text-muted hover:text-foreground hover:bg-white/5'
      }`}
      title={`${layout} layout`}
    >
      <Icon size={16} />
    </button>
  )

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border overflow-hidden"
      style={{
        height: getHeight(),
        transition: `height ${transitions.panel.duration}ms ${transitions.panel.easing}`,
        zIndex: 10
      }}
    >
      {/* Control Bar */}
      <div className="h-12 border-b border-border flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          {/* Panel State Controls */}
          <div className="flex items-center gap-1 mr-4">
            {state.panelState !== 'full' && (
              <button
                onClick={() => expandPanel(state.panelState === 'collapsed' ? 'half' : 'full')}
                className="p-2 text-muted hover:text-foreground hover:bg-white/5  transition-colors"
                title="Expand panel"
              >
                <ChevronUp size={16} />
              </button>
            )}
            {state.panelState !== 'collapsed' && (
              <button
                onClick={() => state.panelState === 'full' ? expandPanel('half') : collapsePanel()}
                className="p-2 text-muted hover:text-foreground hover:bg-white/5  transition-colors"
                title="Collapse panel"
              >
                <ChevronDown size={16} />
              </button>
            )}
            {state.panelState === 'collapsed' && (
              <button
                onClick={() => expandPanel('full')}
                className="p-2 text-muted hover:text-foreground hover:bg-white/5  transition-colors"
                title="Maximize panel"
              >
                <Maximize2 size={16} />
              </button>
            )}
            {state.panelState === 'full' && (
              <button
                onClick={collapsePanel}
                className="p-2 text-muted hover:text-foreground hover:bg-white/5  transition-colors"
                title="Minimize panel"
              >
                <Minimize2 size={16} />
              </button>
            )}
          </div>

          {/* Layout Controls (only in half/full state) */}
          {state.panelState !== 'collapsed' && (
            <div className="flex items-center gap-1 border-l border-border pl-4">
              <LayoutButton layout="grid" icon={Grid3x3} />
              <LayoutButton layout="list" icon={List} />
              <LayoutButton layout="masonry" icon={LayoutGrid} />
            </div>
          )}
        </div>

        {/* Info Display */}
        <div className="flex items-center gap-4 text-xs text-muted">
          {state.selectedCharts.length > 0 && (
            <span>{state.selectedCharts.length} selected</span>
          )}
          <span className="font-mono">
            {state.panelState === 'collapsed' && '4 charts'}
            {state.panelState === 'half' && '8-12 charts'}
            {state.panelState === 'full' && 'All charts'}
          </span>
        </div>

        {/* Filter Toggle (only in half/full state) */}
        {state.panelState !== 'collapsed' && (
          <button
            onClick={toggleSidebar}
            className={`px-3 py-1.5 text-xs  transition-colors ${
              state.sidebarOpen
                ? 'bg-white/10 text-white'
                : 'text-muted hover:text-foreground hover:bg-white/5'
            }`}
          >
            Filters
          </button>
        )}
      </div>

      {/* Chart Grid */}
      <div className="h-[calc(100%-3rem)] overflow-y-auto">
        <div className="p-4">
          {state.sidebarOpen && state.panelState !== 'collapsed' && (
            <div className="flex gap-4 mb-4">
              <div className="w-64 flex-shrink-0 bg-white/5 border border-border  p-4">
                <div className="text-sm text-muted">Filter Sidebar (Coming soon)</div>
              </div>
              <div className={`flex-1 ${getGridClass()}`}>
                {children}
              </div>
            </div>
          )}
          {(!state.sidebarOpen || state.panelState === 'collapsed') && (
            <div className={getGridClass()}>
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
