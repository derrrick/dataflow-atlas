import type {
  Earthquake,
  Wildfire,
  AirQuality,
  Hazard,
  Outage,
  LatencyPoint,
  UnifiedDataPoint,
  SeverityLevel,
} from '@/lib/services/dataTypes'

// Normalization functions for each data type

export function normalizeEarthquakes(earthquakes: Earthquake[]): UnifiedDataPoint[] {
  return earthquakes.map(eq => {
    // Normalize magnitude to 0-100 scale (magnitude 0-10)
    const primaryValue = Math.min(eq.magnitude * 10, 100)

    // Determine severity based on magnitude
    let severity: SeverityLevel
    if (eq.magnitude >= 7) severity = 'critical'
    else if (eq.magnitude >= 6) severity = 'high'
    else if (eq.magnitude >= 4) severity = 'medium'
    else severity = 'low'

    return {
      id: eq.id,
      coords: eq.coords,
      timestamp: eq.timestamp,
      time: eq.time,
      location: eq.location,
      primaryValue,
      secondaryValue: eq.depth,
      tertiaryValue: eq.magnitude, // Keep original for reference
      severity,
      layerType: 'earthquakes',
      layerLabel: 'Earthquakes',
      rawData: eq,
    }
  })
}

export function normalizeWildfires(wildfires: Wildfire[]): UnifiedDataPoint[] {
  return wildfires.map(fire => {
    // Use confidence as primary value (already 0-100)
    const primaryValue = fire.confidence

    // Determine severity based on confidence and brightness
    let severity: SeverityLevel
    if (fire.confidence >= 80 && fire.brightness >= 350) severity = 'critical'
    else if (fire.confidence >= 70 || fire.brightness >= 330) severity = 'high'
    else if (fire.confidence >= 50) severity = 'medium'
    else severity = 'low'

    return {
      id: fire.id,
      coords: fire.coords,
      timestamp: fire.timestamp,
      time: fire.time,
      location: fire.location,
      primaryValue,
      secondaryValue: fire.brightness,
      tertiaryValue: fire.scan,
      severity,
      layerType: 'wildfire',
      layerLabel: 'Wildfire Activity',
      rawData: fire,
    }
  })
}

export function normalizeAirQuality(airQuality: AirQuality[]): UnifiedDataPoint[] {
  return airQuality.map(aq => {
    // Normalize AQI to 0-100 scale (AQI 0-500)
    const primaryValue = Math.min((aq.aqi / 500) * 100, 100)

    // Determine severity based on AQI
    let severity: SeverityLevel
    if (aq.aqi >= 300) severity = 'critical'
    else if (aq.aqi >= 150) severity = 'high'
    else if (aq.aqi >= 100) severity = 'medium'
    else severity = 'low'

    return {
      id: aq.id,
      coords: aq.coords,
      timestamp: aq.timestamp,
      time: aq.time,
      location: aq.location,
      primaryValue,
      secondaryValue: aq.pm25,
      tertiaryValue: aq.aqi, // Keep original for reference
      severity,
      layerType: 'air-quality',
      layerLabel: 'Air Quality',
      rawData: aq,
    }
  })
}

export function normalizeHazards(hazards: Hazard[]): UnifiedDataPoint[] {
  return hazards.map(hazard => {
    // Convert severity to numeric 0-100
    const severityMap = { Low: 25, Medium: 50, High: 75 }
    const primaryValue = severityMap[hazard.severity] || 50

    return {
      id: hazard.id,
      coords: hazard.coords,
      timestamp: hazard.timestamp,
      time: hazard.time,
      location: hazard.location,
      primaryValue,
      secondaryValue: hazard.affected,
      severity: hazard.severity.toLowerCase() as SeverityLevel,
      layerType: 'hazards',
      layerLabel: 'General Hazards',
      rawData: hazard,
    }
  })
}

export function normalizeOutages(outages: Outage[]): UnifiedDataPoint[] {
  return outages.map(outage => {
    // Normalize affected count (log scale for better distribution)
    // Assuming max 10M affected users
    const primaryValue = Math.min((Math.log10(outage.affected + 1) / 7) * 100, 100)

    // Determine severity based on affected count
    let severity: SeverityLevel
    if (outage.affected >= 1000000) severity = 'critical'
    else if (outage.affected >= 100000) severity = 'high'
    else if (outage.affected >= 10000) severity = 'medium'
    else severity = 'low'

    return {
      id: outage.id,
      coords: outage.coords,
      timestamp: outage.timestamp,
      time: outage.time,
      location: outage.location,
      primaryValue,
      secondaryValue: outage.affected,
      severity,
      layerType: 'power-outages', // or 'internet-outages', 'cellular-outages'
      layerLabel: 'Power Outages',
      rawData: outage,
    }
  })
}

export function normalizeLatency(latencyPoints: LatencyPoint[]): UnifiedDataPoint[] {
  return latencyPoints.map(point => {
    // Normalize latency to 0-100 (assuming max 1000ms)
    const primaryValue = Math.min((point.latency / 1000) * 100, 100)

    // Determine severity based on latency
    let severity: SeverityLevel
    if (point.latency >= 500) severity = 'critical'
    else if (point.latency >= 200) severity = 'high'
    else if (point.latency >= 100) severity = 'medium'
    else severity = 'low'

    return {
      id: point.id,
      coords: point.coords,
      timestamp: point.timestamp,
      time: point.time,
      location: point.location,
      primaryValue,
      secondaryValue: point.latency,
      severity,
      layerType: 'latency',
      layerLabel: 'Network Latency',
      rawData: point,
    }
  })
}

// Helper function to combine all normalized data based on active layers
export function unifyAllData(params: {
  earthquakes: Earthquake[]
  wildfires: Wildfire[]
  airQuality: AirQuality[]
  hazards: Hazard[]
  outages: Outage[]
  latency: LatencyPoint[]
  activeLayers: Set<string>
}): UnifiedDataPoint[] {
  const { earthquakes, wildfires, airQuality, hazards, outages, latency, activeLayers } = params
  const unified: UnifiedDataPoint[] = []

  if (activeLayers.has('earthquakes')) {
    unified.push(...normalizeEarthquakes(earthquakes))
  }
  if (activeLayers.has('wildfire')) {
    unified.push(...normalizeWildfires(wildfires))
  }
  if (activeLayers.has('air-quality')) {
    unified.push(...normalizeAirQuality(airQuality))
  }
  if (activeLayers.has('hazards')) {
    unified.push(...normalizeHazards(hazards))
  }
  if (activeLayers.has('power-outages') || activeLayers.has('internet-outages') || activeLayers.has('cellular-outages')) {
    unified.push(...normalizeOutages(outages))
  }
  if (activeLayers.has('latency')) {
    unified.push(...normalizeLatency(latency))
  }

  // Sort by timestamp (most recent first)
  return unified.sort((a, b) => b.timestamp - a.timestamp)
}
