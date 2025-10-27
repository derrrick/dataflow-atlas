/**
 * Supabase Client Configuration
 *
 * Provides initialized Supabase client for database operations.
 * Uses environment variables for configuration.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client for public read operations (uses anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Admin client for server-side writes (uses service role key, bypasses RLS)
export const supabaseAdmin = supabaseServiceKey
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  : supabase // Fallback to regular client if service key not available

/**
 * Database Types
 *
 * Unified event data structure matching our UnifiedDataPoint format
 */

export interface UnifiedEvent {
  id: string
  timestamp: number
  data_type: 'earthquake' | 'wildfire' | 'air_quality' | 'power_outage' | 'severe_weather'
  primary_value: number
  secondary_value?: number
  location: {
    lat: number
    lon: number
  }
  confidence?: 'high' | 'medium' | 'low'
  source?: string
  color: string
  metadata?: Record<string, any>
  created_at?: string
}

/**
 * Fetch all events from the database
 */
export async function getAllEvents(): Promise<UnifiedEvent[]> {
  const { data, error } = await supabase
    .from('unified_events')
    .select('*')
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching events:', error)
    return []
  }

  return data || []
}

/**
 * Fetch events by type
 */
export async function getEventsByType(
  dataType: 'earthquake' | 'wildfire' | 'air_quality'
): Promise<UnifiedEvent[]> {
  const { data, error } = await supabase
    .from('unified_events')
    .select('*')
    .eq('data_type', dataType)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching events by type:', error)
    return []
  }

  return data || []
}

/**
 * Insert new event(s) - uses upsert to handle duplicates
 * Uses admin client to bypass RLS for server-side operations
 */
export async function insertEvents(
  events: Omit<UnifiedEvent, 'created_at'>[]
): Promise<UnifiedEvent[]> {
  if (events.length === 0) return []

  const { data, error} = await supabaseAdmin
    .from('unified_events')
    .upsert(events, {
      onConflict: 'id',
      ignoreDuplicates: false
    })
    .select()

  if (error) {
    console.error('Error inserting events:', error)
    return []
  }

  return data || []
}

/**
 * Get events within time range
 */
export async function getEventsByTimeRange(
  startTime: number,
  endTime: number
): Promise<UnifiedEvent[]> {
  const { data, error } = await supabase
    .from('unified_events')
    .select('*')
    .gte('timestamp', startTime)
    .lte('timestamp', endTime)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching events by time range:', error)
    return []
  }

  return data || []
}

/**
 * Get recent events by type (last 72 hours)
 */
export async function getRecentEventsByType(
  dataType: 'earthquake' | 'wildfire' | 'air_quality' | 'power_outage' | 'severe_weather',
  hoursBack: number = 72
): Promise<UnifiedEvent[]> {
  const now = Date.now()
  const startTime = now - (hoursBack * 60 * 60 * 1000)

  const { data, error } = await supabase
    .from('unified_events')
    .select('*')
    .eq('data_type', dataType)
    .gte('timestamp', startTime)
    .order('timestamp', { ascending: false })

  if (error) {
    console.error('Error fetching recent events by type:', error)
    return []
  }

  return data || []
}
