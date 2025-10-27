-- Migration: Fix data_type check constraint
-- Date: 2025-10-27
-- Purpose: Add support for all data types including severe_weather

-- Drop existing check constraint if it exists
ALTER TABLE unified_events DROP CONSTRAINT IF EXISTS unified_events_data_type_check;

-- Add new check constraint with all supported data types
ALTER TABLE unified_events ADD CONSTRAINT unified_events_data_type_check
  CHECK (data_type IN (
    'earthquake',
    'wildfire',
    'air_quality',
    'power_outage',
    'severe_weather'
  ));

-- Verify the constraint
SELECT conname, pg_get_constraintdef(oid)
FROM pg_constraint
WHERE conrelid = 'unified_events'::regclass
  AND conname = 'unified_events_data_type_check';
