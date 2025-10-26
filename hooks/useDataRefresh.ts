import { useState, useEffect, useCallback } from 'react'

interface UseDataRefreshOptions {
  refreshInterval?: number // in milliseconds
  onRefresh: () => Promise<void>
  autoStart?: boolean
}

export function useDataRefresh({
  refreshInterval = 2 * 60 * 1000, // 2 minutes default
  onRefresh,
  autoStart = true,
}: UseDataRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastRefresh, setLastRefresh] = useState<number>(Date.now())
  const [error, setError] = useState<string | null>(null)

  const refresh = useCallback(async () => {
    if (isRefreshing) return

    setIsRefreshing(true)
    setError(null)

    try {
      await onRefresh()
      setLastRefresh(Date.now())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refresh failed')
      console.error('Data refresh error:', err)
    } finally {
      setIsRefreshing(false)
    }
  }, [onRefresh, isRefreshing])

  useEffect(() => {
    if (!autoStart) return

    // Initial load
    refresh()

    // Set up interval
    const interval = setInterval(refresh, refreshInterval)

    // Pause when tab is not visible to save API calls
    const handleVisibilityChange = () => {
      if (document.hidden) {
        clearInterval(interval)
      } else {
        refresh()
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      clearInterval(interval)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [refresh, refreshInterval, autoStart])

  return {
    isRefreshing,
    lastRefresh,
    error,
    refresh,
  }
}
