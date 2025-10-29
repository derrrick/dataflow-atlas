'use client'

import { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react'

interface TimeContextType {
  t0: number
  t1: number
  setTimeRange: (t0: number, t1: number) => void
  windowMinutes: number
  setWindowMinutes: (minutes: number) => void
}

const TimeContext = createContext<TimeContextType | undefined>(undefined)

export function TimeProvider({ children }: { children: ReactNode }) {
  // Default: last 7 days
  const [t1, setT1] = useState(() => Date.now())
  const [windowMinutes, setWindowMinutes] = useState(10080) // 7 days (7 * 24 * 60)

  const t0 = t1 - windowMinutes * 60_000

  const setTimeRange = useCallback((newT0: number, newT1: number) => {
    setT1(newT1)
    setWindowMinutes(Math.round((newT1 - newT0) / 60_000))
  }, [])

  // Listen for permalink time restoration
  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const { t0: restoredT0, t1: restoredT1 } = e.detail
      setTimeRange(restoredT0, restoredT1)
    }

    window.addEventListener('permalink:time' as any, handler as EventListener)
    return () => window.removeEventListener('permalink:time' as any, handler as EventListener)
  }, [setTimeRange])

  return (
    <TimeContext.Provider
      value={{
        t0,
        t1,
        setTimeRange,
        windowMinutes,
        setWindowMinutes,
      }}
    >
      {children}
    </TimeContext.Provider>
  )
}

export function useTime() {
  const context = useContext(TimeContext)
  if (context === undefined) {
    throw new Error('useTime must be used within a TimeProvider')
  }
  return context
}
