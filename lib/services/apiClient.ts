interface CacheEntry<T> {
  data: T
  timestamp: number
}

const cache = new Map<string, CacheEntry<any>>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export async function fetchWithCache<T>(
  url: string,
  options?: RequestInit,
  cacheDuration: number = CACHE_TTL
): Promise<{ data: T; cached: boolean }> {
  // Check cache
  const cached = cache.get(url)
  if (cached && Date.now() - cached.timestamp < cacheDuration) {
    return { data: cached.data, cached: true }
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = await response.json()

    // Store in cache
    cache.set(url, { data, timestamp: Date.now() })

    return { data, cached: false }
  } catch (error) {
    // If we have stale cache, return it with a warning
    if (cached) {
      console.warn(`API error, returning stale cache for ${url}:`, error)
      return { data: cached.data, cached: true }
    }

    throw error
  }
}

export function clearCache(url?: string) {
  if (url) {
    cache.delete(url)
  } else {
    cache.clear()
  }
}

export function formatRelativeTime(timestamp: number): string {
  const now = Date.now()
  const diff = now - timestamp
  const minutes = Math.floor(diff / (1000 * 60))
  const hours = Math.floor(diff / (1000 * 60 * 60))
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  if (hours < 24) return `${hours} hour${hours !== 1 ? 's' : ''} ago`
  return `${days} day${days !== 1 ? 's' : ''} ago`
}
