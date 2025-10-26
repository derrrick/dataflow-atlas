/**
 * Supabase Database Test Page
 *
 * Tests the connection to Supabase and displays data from unified_events table.
 * Use this page to verify integration and insert test data.
 */

import { getAllEvents, getEventsByType } from '@/lib/supabase'

export default async function TestDBPage() {
  // Fetch all events from database
  const allEvents = await getAllEvents()
  const earthquakes = await getEventsByType('earthquake')
  const wildfires = await getEventsByType('wildfire')
  const airQuality = await getEventsByType('air_quality')

  return (
    <div style={{
      padding: '40px',
      fontFamily: 'monospace',
      maxWidth: '1200px',
      margin: '0 auto',
      color: '#C6CFDA',
      backgroundColor: '#0A0F16'
    }}>
      <h1 style={{ color: '#39D0FF', marginBottom: '8px' }}>Supabase Database Test</h1>
      <p style={{ color: '#8F9BB0', marginBottom: '32px' }}>
        Testing connection to unified_events table
      </p>

      {/* Summary Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '16px',
        marginBottom: '32px'
      }}>
        <div style={{
          padding: '16px',
          border: '1px solid #39D0FF',
          backgroundColor: '#141821'
        }}>
          <div style={{ fontSize: '12px', color: '#8F9BB0' }}>Total Events</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFFFFF' }}>
            {allEvents.length}
          </div>
        </div>

        <div style={{
          padding: '16px',
          border: '1px solid #FF6B6B',
          backgroundColor: '#141821'
        }}>
          <div style={{ fontSize: '12px', color: '#8F9BB0' }}>Earthquakes</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FF6B6B' }}>
            {earthquakes.length}
          </div>
        </div>

        <div style={{
          padding: '16px',
          border: '1px solid #FF8C42',
          backgroundColor: '#141821'
        }}>
          <div style={{ fontSize: '12px', color: '#8F9BB0' }}>Wildfires</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FF8C42' }}>
            {wildfires.length}
          </div>
        </div>

        <div style={{
          padding: '16px',
          border: '1px solid #FFBE0B',
          backgroundColor: '#141821'
        }}>
          <div style={{ fontSize: '12px', color: '#8F9BB0' }}>Air Quality</div>
          <div style={{ fontSize: '32px', fontWeight: 700, color: '#FFBE0B' }}>
            {airQuality.length}
          </div>
        </div>
      </div>

      {/* Connection Status */}
      <div style={{
        padding: '16px',
        backgroundColor: allEvents.length >= 0 ? '#0D3B2E' : '#3B0D0D',
        border: `1px solid ${allEvents.length >= 0 ? '#4ADE80' : '#FF6B6B'}`,
        marginBottom: '32px'
      }}>
        <strong style={{ color: allEvents.length >= 0 ? '#4ADE80' : '#FF6B6B' }}>
          {allEvents.length >= 0 ? '✓ Connected to Supabase' : '✗ Connection Failed'}
        </strong>
        <p style={{ margin: '8px 0 0 0', fontSize: '12px', color: '#8F9BB0' }}>
          {allEvents.length === 0
            ? 'Table is empty. Insert test data using SQL Editor or the insert query below.'
            : `Successfully retrieved ${allEvents.length} event(s) from database.`
          }
        </p>
      </div>

      {/* Insert Test Data Instructions */}
      {allEvents.length === 0 && (
        <div style={{
          padding: '16px',
          backgroundColor: '#141821',
          border: '1px solid #39D0FF',
          marginBottom: '32px'
        }}>
          <h2 style={{ color: '#39D0FF', fontSize: '16px', marginBottom: '12px' }}>
            Insert Test Data
          </h2>
          <p style={{ fontSize: '12px', color: '#8F9BB0', marginBottom: '12px' }}>
            Run this SQL in your Supabase SQL Editor to add sample events:
          </p>
          <pre style={{
            backgroundColor: '#0A0F16',
            padding: '12px',
            overflow: 'auto',
            fontSize: '11px',
            border: '1px solid #2A3441'
          }}>
{`INSERT INTO unified_events (id, timestamp, data_type, primary_value, secondary_value, location, confidence, source, color, metadata)
VALUES
  ('usgs_test_1', 1729965600000, 'earthquake', 5.2, 10.0, '{"lat": 37.7749, "lon": -122.4194}', 'high', 'USGS', '#FF6B6B', '{"region": "San Francisco Bay Area"}'),
  ('usgs_test_2', 1729965660000, 'earthquake', 4.8, 15.0, '{"lat": 34.0522, "lon": -118.2437}', 'high', 'USGS', '#FF6B6B', '{"region": "Los Angeles"}'),
  ('nifc_test_1', 1729965600000, 'wildfire', 8.5, 1250.0, '{"lat": 39.7392, "lon": -104.9903}', 'medium', 'NIFC', '#FF8C42', '{"name": "Test Fire"}'),
  ('nifc_test_2', 1729965660000, 'wildfire', 6.2, 850.0, '{"lat": 36.1699, "lon": -115.1398}', 'medium', 'NIFC', '#FF8C42', '{"name": "Desert Fire"}'),
  ('airnow_test_1', 1729965600000, 'air_quality', 125.0, 45.0, '{"lat": 40.7128, "lon": -74.0060}', 'high', 'AirNow', '#FFBE0B', '{"city": "New York"}'),
  ('airnow_test_2', 1729965660000, 'air_quality', 95.0, 35.0, '{"lat": 41.8781, "lon": -87.6298}', 'high', 'AirNow', '#FFBE0B', '{"city": "Chicago"}');`}
          </pre>
        </div>
      )}

      {/* Event Data Table */}
      {allEvents.length > 0 && (
        <div>
          <h2 style={{ color: '#39D0FF', fontSize: '16px', marginBottom: '12px' }}>
            Event Data ({allEvents.length} records)
          </h2>
          <div style={{
            overflowX: 'auto',
            border: '1px solid #2A3441'
          }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              fontSize: '11px'
            }}>
              <thead>
                <tr style={{ backgroundColor: '#141821' }}>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #2A3441' }}>ID</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #2A3441' }}>Type</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #2A3441' }}>Primary Value</th>
                  <th style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #2A3441' }}>Secondary Value</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #2A3441' }}>Location</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #2A3441' }}>Source</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #2A3441' }}>Confidence</th>
                  <th style={{ padding: '8px', textAlign: 'left', borderBottom: '1px solid #2A3441' }}>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {allEvents.map((event, i) => (
                  <tr key={event.id} style={{
                    backgroundColor: i % 2 === 0 ? '#0A0F16' : '#141821'
                  }}>
                    <td style={{ padding: '8px', borderBottom: '1px solid #2A3441' }}>{event.id}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #2A3441' }}>
                      <span style={{
                        padding: '2px 6px',
                        backgroundColor: event.data_type === 'earthquake' ? '#FF6B6B' :
                                       event.data_type === 'wildfire' ? '#FF8C42' : '#FFBE0B',
                        color: '#000',
                        borderRadius: '2px',
                        fontSize: '10px',
                        fontWeight: 700
                      }}>
                        {event.data_type}
                      </span>
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #2A3441' }}>
                      {event.primary_value}
                    </td>
                    <td style={{ padding: '8px', textAlign: 'right', borderBottom: '1px solid #2A3441' }}>
                      {event.secondary_value || '—'}
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #2A3441' }}>
                      {event.location.lat.toFixed(2)}, {event.location.lon.toFixed(2)}
                    </td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #2A3441' }}>{event.source}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #2A3441' }}>{event.confidence || '—'}</td>
                    <td style={{ padding: '8px', borderBottom: '1px solid #2A3441' }}>
                      {new Date(event.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* JSON View */}
          <details style={{ marginTop: '24px' }}>
            <summary style={{
              cursor: 'pointer',
              color: '#39D0FF',
              fontSize: '14px',
              marginBottom: '12px'
            }}>
              View Raw JSON
            </summary>
            <pre style={{
              backgroundColor: '#0A0F16',
              padding: '16px',
              overflow: 'auto',
              fontSize: '10px',
              border: '1px solid #2A3441',
              maxHeight: '400px'
            }}>
              {JSON.stringify(allEvents, null, 2)}
            </pre>
          </details>
        </div>
      )}

      {/* Navigation */}
      <div style={{ marginTop: '32px', paddingTop: '16px', borderTop: '1px solid #2A3441' }}>
        <a href="/" style={{ color: '#39D0FF', textDecoration: 'none' }}>← Back to App</a>
        {' | '}
        <a href="/test-charts" style={{ color: '#39D0FF', textDecoration: 'none' }}>View Test Charts</a>
      </div>
    </div>
  )
}
