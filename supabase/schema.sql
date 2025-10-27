-- Dataflow Atlas - Unified Events Table
-- Run this in Supabase SQL Editor to create the database table

-- Drop existing table if you need to start fresh (CAUTION: deletes all data)
-- DROP TABLE IF EXISTS unified_events;

-- Create the main table
CREATE TABLE unified_events (
  id TEXT PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_type TEXT NOT NULL,
  primary_value NUMERIC NOT NULL,
  secondary_value NUMERIC,
  location JSONB NOT NULL,
  confidence TEXT,
  source TEXT,
  color TEXT,
  metadata JSONB
);

-- Add indexes for performance
CREATE INDEX idx_unified_events_timestamp ON unified_events (timestamp DESC);
CREATE INDEX idx_unified_events_data_type ON unified_events (data_type);
CREATE INDEX idx_unified_events_type_time ON unified_events (data_type, timestamp DESC);
CREATE INDEX idx_unified_events_location ON unified_events USING GIN (location);

-- Enable Row Level Security
ALTER TABLE unified_events ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Allow public read access"
  ON unified_events FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow service role insert"
  ON unified_events FOR INSERT
  TO service_role
  WITH CHECK (true);

CREATE POLICY "Allow authenticated insert"
  ON unified_events FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Allow authenticated update"
  ON unified_events FOR UPDATE
  TO authenticated
  USING (true);

CREATE POLICY "Allow authenticated delete"
  ON unified_events FOR DELETE
  TO authenticated
  USING (true);
