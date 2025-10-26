# Supabase Setup Guide

## Overview

This guide walks through setting up the Supabase database for Dataflow Atlas. The database uses a unified table structure inspired by FiveThirtyEight's data philosophy: data separated from presentation, explicitly versioned, and source-attributed.

## Prerequisites

- Supabase project created: `https://ptgfpwtdarfznvliqgkb.supabase.co`
- Environment variables configured in `.env.local`
- @supabase/supabase-js installed (`npm install @supabase/supabase-js`)

## Step 1: Create Database Table

1. Navigate to your Supabase project dashboard:
   ```
   https://supabase.com/dashboard/project/ptgfpwtdarfznvliqgkb
   ```

2. Go to **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy and paste the contents of `supabase/schema.sql` (or use the SQL below)

5. Click **Run** to execute

### Database Schema

```sql
-- See supabase/schema.sql for full schema with comments
CREATE TABLE IF NOT EXISTS unified_events (
  id TEXT PRIMARY KEY,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  data_type TEXT NOT NULL CHECK (data_type IN ('earthquake', 'wildfire', 'air_quality')),
  primary_value NUMERIC NOT NULL,
  secondary_value NUMERIC,
  location JSONB NOT NULL,
  confidence TEXT CHECK (confidence IN ('high', 'medium', 'low')),
  source TEXT,
  color TEXT,
  metadata JSONB
);

-- Indexes
CREATE INDEX idx_unified_events_timestamp ON unified_events (timestamp DESC);
CREATE INDEX idx_unified_events_data_type ON unified_events (data_type);
CREATE INDEX idx_unified_events_type_time ON unified_events (data_type, timestamp DESC);
CREATE INDEX idx_unified_events_location ON unified_events USING GIN (location);

-- Row-level security
ALTER TABLE unified_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read access" ON unified_events FOR SELECT USING (true);
CREATE POLICY "Authenticated insert" ON unified_events FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "Authenticated update" ON unified_events FOR UPDATE USING (auth.role() = 'service_role');
CREATE POLICY "Authenticated delete" ON unified_events FOR DELETE USING (auth.role() = 'service_role');
```

## Step 2: Verify Table Creation

1. Go to **Table Editor** in the left sidebar
2. You should see `unified_events` table listed
3. Click on it to view the structure

## Step 3: (Optional) Seed Test Data

For testing the integration, you can insert sample data:

```sql
INSERT INTO unified_events (id, timestamp, data_type, primary_value, secondary_value, location, confidence, source, color, metadata)
VALUES
  ('usgs_test_1', 1729965600000, 'earthquake', 5.2, 10.0, '{"lat": 37.7749, "lon": -122.4194}', 'high', 'USGS', '#FF6B6B', '{"region": "San Francisco Bay Area"}'),
  ('nifc_test_1', 1729965600000, 'wildfire', 8.5, 1250.0, '{"lat": 34.0522, "lon": -118.2437}', 'medium', 'NIFC', '#FF8C42', '{"name": "Test Fire"}'),
  ('airnow_test_1', 1729965600000, 'air_quality', 125.0, 45.0, '{"lat": 40.7128, "lon": -74.0060}', 'high', 'AirNow', '#FFBE0B', '{"city": "New York"}');
```

## Step 4: Test the Integration

Create a test page or add to existing page:

```typescript
import { getAllEvents, getEventsByType } from '@/lib/supabase'

export default async function TestPage() {
  // Fetch all events
  const allEvents = await getAllEvents()

  // Fetch only earthquakes
  const earthquakes = await getEventsByType('earthquake')

  return (
    <div>
      <h1>Test Supabase Integration</h1>
      <p>Total events: {allEvents.length}</p>
      <p>Earthquakes: {earthquakes.length}</p>

      <pre>{JSON.stringify(allEvents, null, 2)}</pre>
    </div>
  )
}
```

## Database Design Philosophy

Following FiveThirtyEight's approach:

### 1. **Separation of Data and Presentation**
- Raw data stored in `unified_events` table
- Presentation logic handled by chart components
- Color values stored with data but can be overridden

### 2. **Source Attribution**
- Every record includes `source` field (USGS, NIFC, AirNow)
- `confidence` level explicitly tracked
- `created_at` timestamp for data lineage

### 3. **Modular Organization**
- Single table with `data_type` discriminator
- Extensible `metadata` JSONB field for type-specific attributes
- Consistent schema across all event types

### 4. **Version Control & Licensing**
- Database schema versioned in `supabase/schema.sql`
- Row-level security enforces public read, authenticated write
- Open data philosophy: public by default

## Data Structure Reference

### UnifiedEvent Interface

```typescript
interface UnifiedEvent {
  id: string                        // Event identifier (source-specific)
  timestamp: number                 // Unix milliseconds
  data_type: 'earthquake' | 'wildfire' | 'air_quality'
  primary_value: number             // Magnitude/Intensity/AQI
  secondary_value?: number          // Depth/Size/PM2.5
  location: {                       // Geographic coordinates
    lat: number
    lon: number
  }
  confidence?: 'high' | 'medium' | 'low'
  color: string                     // Hex color for visualization
  metadata?: Record<string, any>    // Extensible attributes
  created_at?: string               // ISO 8601 timestamp
}
```

### Field Mapping by Type

| Field | Earthquake | Wildfire | Air Quality |
|-------|-----------|----------|-------------|
| **primary_value** | Magnitude (Richter) | Intensity (0-10) | AQI (0-500) |
| **secondary_value** | Depth (km) | Size (acres) | PM2.5 (μg/m³) |
| **source** | USGS | NIFC | AirNow |
| **color** | Red-orange scale | Orange-red scale | Yellow-red scale |

## Helper Functions

See `lib/supabase.ts` for full implementations:

- `getAllEvents()` - Fetch all events, ordered by timestamp
- `getEventsByType(dataType)` - Fetch events of specific type
- `insertEvents(events)` - Bulk insert new events
- `getEventsByTimeRange(start, end)` - Fetch events within time window

## Next Steps

1. **Real-time Subscriptions**
   ```typescript
   supabase
     .channel('unified-events')
     .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'unified_events' },
       payload => console.log('New event:', payload.new)
     )
     .subscribe()
   ```

2. **API Integration**
   - Create API routes to fetch data from USGS, NIFC, AirNow
   - Transform to UnifiedEvent format
   - Insert via `insertEvents()`

3. **Data Archiving**
   - Set up periodic archival of old events
   - Partition table by timestamp for performance
   - Export historical data to CSV/JSON

4. **Performance Optimization**
   - Add spatial indexes for geographic queries
   - Implement caching layer (Redis/Vercel KV)
   - Use database functions for aggregations

## Troubleshooting

### Can't connect to Supabase
- Verify environment variables in `.env.local`
- Check Supabase project is active (not paused)
- Confirm API keys are correct

### RLS Policy Issues
- Ensure policies are created (`\dp unified_events` in SQL editor)
- Use service role key for inserts (not anon key)
- Check auth context in server components

### Performance Issues
- Verify indexes are created (`\d unified_events` in SQL editor)
- Monitor query performance in Supabase dashboard
- Consider materialized views for complex aggregations

## Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Row Level Security Guide](https://supabase.com/docs/guides/auth/row-level-security)
- [JSONB Performance](https://www.postgresql.org/docs/current/datatype-json.html)
- Project Dashboard: https://supabase.com/dashboard/project/ptgfpwtdarfznvliqgkb
