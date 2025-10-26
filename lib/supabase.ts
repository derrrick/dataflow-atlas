/**
 * Supabase Client Configuration
 *
 * Provides initialized Supabase client for database operations.
 * Uses environment variables for configuration.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

/**
 * Database Types
 *
 * Unified event data structure matching our UnifiedDataPoint format
 */

export interface UnifiedEvent {
  id: string
  timestamp: number
  data_type: 'earthquake' | 'wildfire' | 'air_quality'
  primary_value: number
  secondary_value?: number
  location: {
    lat: number
    lon: number
  }
  confidence?: 'high' | 'medium' | 'low'
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
 * Insert new event(s)
 */
export async function insertEvents(
  events: Omit<UnifiedEvent, 'created_at'>[]
): Promise<UnifiedEvent[]> {
  const { data, error } = await supabase
    .from('unified_events')
    .insert(events)
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
