'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

export type PanelState = 'collapsed' | 'half' | 'full'
export type ChartLayout = 'grid' | 'list' | 'masonry'

interface DashboardState {
  panelState: PanelState
  selectedCharts: string[] // Chart IDs
  chartLayout: ChartLayout
  modalChart: string | null
  sidebarOpen: boolean
}

interface DashboardContextType {
  state: DashboardState
  expandPanel: (target: 'half' | 'full') => void
  collapsePanel: () => void
  togglePanel: () => void
  toggleChart: (chartId: string) => void
  setSelectedCharts: (chartIds: string[]) => void
  openModal: (chartId: string) => void
  closeModal: () => void
  toggleSidebar: () => void
  setChartLayout: (layout: ChartLayout) => void
}

const DashboardContext = createContext<DashboardContextType | undefined>(undefined)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<DashboardState>({
    panelState: 'half', // Start in half mode so charts are visible
    selectedCharts: [],
    chartLayout: 'grid',
    modalChart: null,
    sidebarOpen: false
  })

  const expandPanel = (target: 'half' | 'full') => {
    setState(prev => ({ ...prev, panelState: target }))
  }

  const collapsePanel = () => {
    setState(prev => ({ ...prev, panelState: 'collapsed' }))
  }

  const togglePanel = () => {
    setState(prev => ({
      ...prev,
      panelState: prev.panelState === 'collapsed'
        ? 'half'
        : prev.panelState === 'half'
        ? 'full'
        : 'collapsed'
    }))
  }

  const toggleChart = (chartId: string) => {
    setState(prev => ({
      ...prev,
      selectedCharts: prev.selectedCharts.includes(chartId)
        ? prev.selectedCharts.filter(id => id !== chartId)
        : [...prev.selectedCharts, chartId]
    }))
  }

  const setSelectedCharts = (chartIds: string[]) => {
    setState(prev => ({ ...prev, selectedCharts: chartIds }))
  }

  const openModal = (chartId: string) => {
    setState(prev => ({ ...prev, modalChart: chartId }))
  }

  const closeModal = () => {
    setState(prev => ({ ...prev, modalChart: null }))
  }

  const toggleSidebar = () => {
    setState(prev => ({ ...prev, sidebarOpen: !prev.sidebarOpen }))
  }

  const setChartLayout = (layout: ChartLayout) => {
    setState(prev => ({ ...prev, chartLayout: layout }))
  }

  return (
    <DashboardContext.Provider
      value={{
        state,
        expandPanel,
        collapsePanel,
        togglePanel,
        toggleChart,
        setSelectedCharts,
        openModal,
        closeModal,
        toggleSidebar,
        setChartLayout
      }}
    >
      {children}
    </DashboardContext.Provider>
  )
}

export function useDashboard() {
  const context = useContext(DashboardContext)
  if (context === undefined) {
    throw new Error('useDashboard must be used within a DashboardProvider')
  }
  return context
}
