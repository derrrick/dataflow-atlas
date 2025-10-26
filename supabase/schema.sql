-- Dataflow Atlas - Unified Events Table
--
-- This table stores all event data (earthquakes, wildfires, air quality)
-- in a unified format for visualization and analysis.
--
-- Design Philosophy (FiveThirtyEight-inspired):
-- - Data separated from presentation
-- - Explicitly versioned and timestamped
-- - Source attribution built-in
-- - Modular organization by data_type

CREATE TABLE IF NOT EXISTS unified_events (
  -- Primary key
  id TEXT PRIMARY KEY,

  -- Temporal data
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),

  -- Event classification
  data_type TEXT NOT NULL CHECK (data_type IN ('earthquake', 'wildfire', 'air_quality')),

  -- Core values
  primary_value NUMERIC NOT NULL,      -- Magnitude/Intensity/AQI
  secondary_value NUMERIC,              -- Depth/Size/PM2.5

  -- Geospatial data (stored as JSONB for flexibility)
  location JSONB NOT NULL,              -- { lat: number, lon: number }

  -- Trust signals
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  source TEXT,                          -- 'USGS', 'NIFC', 'AirNow'

  -- Visualization
  color TEXT,

  -- Extensible metadata (for future fields without schema changes)
  metadata JSONB
);

-- Indexes for common queries
CREATE INDEX IF NOT EXISTS idx_unified_events_timestamp ON unified_events (timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_unified_events_data_type ON unified_events (data_type);
CREATE INDEX IF NOT EXISTS idx_unified_events_type_time ON unified_events (data_type, timestamp DESC);

-- Spatial index for location-based queries (using GiST on JSONB)
CREATE INDEX IF NOT EXISTS idx_unified_events_location ON unified_events USING GIN (location);

-- Comments for documentation
COMMENT ON TABLE unified_events IS 'Unified storage for all event types (earthquakes, wildfires, air quality)';
COMMENT ON COLUMN unified_events.id IS 'Event identifier (e.g., USGS event ID, NIFC fire ID)';
COMMENT ON COLUMN unified_events.timestamp IS 'Event occurrence time (Unix milliseconds)';
COMMENT ON COLUMN unified_events.data_type IS 'Event type: earthquake, wildfire, or air_quality';
COMMENT ON COLUMN unified_events.primary_value IS 'Main metric: magnitude (earthquake), intensity (wildfire), AQI (air quality)';
COMMENT ON COLUMN unified_events.secondary_value IS 'Secondary metric: depth (earthquake), size (wildfire), PM2.5 (air quality)';
COMMENT ON COLUMN unified_events.location IS 'Geographic coordinates as JSONB: { lat: number, lon: number }';
COMMENT ON COLUMN unified_events.confidence IS 'Data quality indicator: high, medium, or low';
COMMENT ON COLUMN unified_events.source IS 'Data provider: USGS, NIFC, AirNow, etc.';
COMMENT ON COLUMN unified_events.metadata IS 'Extensible JSON field for source-specific attributes';

-- Row-level security (RLS) policies
ALTER TABLE unified_events ENABLE ROW LEVEL SECURITY;

-- Allow public read access (data is open by default)
CREATE POLICY "Public read access" ON unified_events
  FOR SELECT
  USING (true);

-- Restrict insert/update/delete to authenticated users with service role
CREATE POLICY "Authenticated insert" ON unified_events
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');

CREATE POLICY "Authenticated update" ON unified_events
  FOR UPDATE
  USING (auth.role() = 'service_role');

CREATE POLICY "Authenticated delete" ON unified_events
  FOR DELETE
  USING (auth.role() = 'service_role');
