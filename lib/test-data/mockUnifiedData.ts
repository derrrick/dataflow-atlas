import type { UnifiedDataPoint } from '@/lib/services/dataTypes'

// Helper to generate timestamps over the last 24 hours
const generateTimestamps = (count: number): number[] => {
  const now = Date.now()
  const oneDayAgo = now - 24 * 60 * 60 * 1000
  return Array.from({ length: count }, (_, i) =>
    oneDayAgo + (i / count) * 24 * 60 * 60 * 1000
  )
}

// Mock Earthquake Data
export const mockEarthquakeData: UnifiedDataPoint[] = [
  {
    id: 'eq1',
    dataType: 'earthquake',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    location: { lat: 37.7749, lon: -122.4194 },
    primaryValue: 6.2,
    secondaryValue: 10.5,
    color: '#FF3B3B',
    metadata: {
      place: 'San Francisco Bay Area',
      depth: 10.5,
      significance: 850
    }
  },
  {
    id: 'eq2',
    dataType: 'earthquake',
    timestamp: Date.now() - 4 * 60 * 60 * 1000,
    location: { lat: 34.0522, lon: -118.2437 },
    primaryValue: 4.8,
    secondaryValue: 8.2,
    color: '#FF3B3B',
    metadata: {
      place: 'Los Angeles',
      depth: 8.2,
      significance: 520
    }
  },
  {
    id: 'eq3',
    dataType: 'earthquake',
    timestamp: Date.now() - 6 * 60 * 60 * 1000,
    location: { lat: 40.7128, lon: -74.0060 },
    primaryValue: 3.2,
    secondaryValue: 5.0,
    color: '#FF3B3B',
    metadata: {
      place: 'New York',
      depth: 5.0,
      significance: 180
    }
  },
  ...generateTimestamps(20).map((ts, i) => ({
    id: `eq${i + 4}`,
    dataType: 'earthquake' as const,
    timestamp: ts,
    location: {
      lat: 35 + Math.random() * 10,
      lon: -120 + Math.random() * 10
    },
    primaryValue: 2 + Math.random() * 5,
    secondaryValue: 1 + Math.random() * 15,
    color: '#FF3B3B',
    metadata: {
      place: `Location ${i}`,
      depth: 1 + Math.random() * 15,
      significance: Math.floor(Math.random() * 1000)
    }
  }))
]

// Mock Wildfire Data
export const mockWildfireData: UnifiedDataPoint[] = [
  {
    id: 'wf1',
    dataType: 'wildfire',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    location: { lat: 38.5816, lon: -121.4944 },
    primaryValue: 15000,
    secondaryValue: 35,
    color: '#FF8C00',
    metadata: {
      name: 'Creek Fire',
      acres: 15000,
      containment: 35,
      cause: 'Lightning'
    }
  },
  {
    id: 'wf2',
    dataType: 'wildfire',
    timestamp: Date.now() - 3 * 60 * 60 * 1000,
    location: { lat: 34.4208, lon: -119.6982 },
    primaryValue: 8500,
    secondaryValue: 60,
    color: '#FF8C00',
    metadata: {
      name: 'Mountain Fire',
      acres: 8500,
      containment: 60,
      cause: 'Human'
    }
  },
  {
    id: 'wf3',
    dataType: 'wildfire',
    timestamp: Date.now() - 5 * 60 * 60 * 1000,
    location: { lat: 36.7783, lon: -119.4179 },
    primaryValue: 450,
    secondaryValue: 90,
    color: '#FF8C00',
    metadata: {
      name: 'Valley Fire',
      acres: 450,
      containment: 90,
      cause: 'Unknown'
    }
  },
  ...generateTimestamps(15).map((ts, i) => ({
    id: `wf${i + 4}`,
    dataType: 'wildfire' as const,
    timestamp: ts,
    location: {
      lat: 36 + Math.random() * 6,
      lon: -122 + Math.random() * 6
    },
    primaryValue: 100 + Math.random() * 20000,
    secondaryValue: Math.random() * 100,
    color: '#FF8C00',
    metadata: {
      name: `Fire ${i}`,
      acres: 100 + Math.random() * 20000,
      containment: Math.random() * 100,
      cause: ['Lightning', 'Human', 'Unknown'][i % 3]
    }
  }))
]

// Mock Air Quality Data
export const mockAirQualityData: UnifiedDataPoint[] = [
  {
    id: 'aq1',
    dataType: 'air_quality',
    timestamp: Date.now() - 30 * 60 * 1000,
    location: { lat: 37.7749, lon: -122.4194 },
    primaryValue: 165,
    secondaryValue: 55,
    color: '#9370DB',
    metadata: {
      station: 'SF Downtown',
      aqi: 165,
      pm25: 55,
      category: 'Unhealthy'
    }
  },
  {
    id: 'aq2',
    dataType: 'air_quality',
    timestamp: Date.now() - 1 * 60 * 60 * 1000,
    location: { lat: 34.0522, lon: -118.2437 },
    primaryValue: 95,
    secondaryValue: 28,
    color: '#9370DB',
    metadata: {
      station: 'LA Central',
      aqi: 95,
      pm25: 28,
      category: 'Moderate'
    }
  },
  {
    id: 'aq3',
    dataType: 'air_quality',
    timestamp: Date.now() - 2 * 60 * 60 * 1000,
    location: { lat: 40.7128, lon: -74.0060 },
    primaryValue: 42,
    secondaryValue: 12,
    color: '#9370DB',
    metadata: {
      station: 'NYC Midtown',
      aqi: 42,
      pm25: 12,
      category: 'Good'
    }
  },
  ...generateTimestamps(25).map((ts, i) => ({
    id: `aq${i + 4}`,
    dataType: 'air_quality' as const,
    timestamp: ts,
    location: {
      lat: 37 + Math.random() * 8,
      lon: -122 + Math.random() * 8
    },
    primaryValue: 20 + Math.random() * 180,
    secondaryValue: 5 + Math.random() * 70,
    color: '#9370DB',
    metadata: {
      station: `Station ${i}`,
      aqi: 20 + Math.random() * 180,
      pm25: 5 + Math.random() * 70,
      category: ['Good', 'Moderate', 'Unhealthy'][Math.floor(Math.random() * 3)]
    }
  }))
]

// Edge Cases
export const mockEmptyData: UnifiedDataPoint[] = []

export const mockSingleDataPoint: UnifiedDataPoint[] = [
  {
    id: 'single1',
    dataType: 'earthquake',
    timestamp: Date.now(),
    location: { lat: 37.7749, lon: -122.4194 },
    primaryValue: 5.5,
    secondaryValue: 10.0,
    color: '#FF3B3B',
    metadata: {
      place: 'Single Event',
      depth: 10.0,
      significance: 500
    }
  }
]

// Mixed data types for dual timeline test
export const mockMixedData: UnifiedDataPoint[] = [
  ...mockEarthquakeData.slice(0, 5),
  ...mockWildfireData.slice(0, 5)
]
