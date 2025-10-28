import type {
  Earthquake,
  Wildfire,
  AirQuality,
  Outage,
  LatencyPoint,
  PowerOutage,
  SevereWeather,
  InternetOutage,
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

export function normalizePowerOutages(powerOutages: PowerOutage[]): UnifiedDataPoint[] {
  return powerOutages.map(outage => {
    const primaryValue = Math.min((Math.log10(outage.customers_out + 1) / 7) * 100, 100)

    let severity: SeverityLevel
    if (outage.customers_out >= 100000) severity = 'critical'
    else if (outage.customers_out >= 50000) severity = 'high'
    else if (outage.customers_out >= 10000) severity = 'medium'
    else severity = 'low'

    return {
      id: outage.id,
      coords: outage.coords,
      timestamp: outage.timestamp,
      time: outage.time,
      location: outage.location,
      primaryValue,
      secondaryValue: outage.customers_out,
      severity,
      layerType: 'power-outages',
      layerLabel: 'Power Outages',
      rawData: outage,
    }
  })
}

export function normalizeSevereWeather(severeWeather: SevereWeather[]): UnifiedDataPoint[] {
  return severeWeather.map(weather => {
    const primaryValue = weather.severity === 'Extreme' ? 100 : weather.severity === 'Severe' ? 75 : weather.severity === 'Moderate' ? 50 : 25

    let severity: SeverityLevel
    if (weather.severity === 'Extreme') severity = 'critical'
    else if (weather.severity === 'Severe') severity = 'high'
    else if (weather.severity === 'Moderate') severity = 'medium'
    else severity = 'low'

    return {
      id: weather.id,
      coords: weather.coords,
      timestamp: weather.timestamp,
      time: weather.time,
      location: weather.location,
      primaryValue,
      secondaryValue: weather.urgency === 'Immediate' ? 100 : weather.urgency === 'Expected' ? 50 : 25,
      severity,
      layerType: 'severe-weather',
      layerLabel: 'Severe Weather',
      rawData: weather,
    }
  })
}

export function normalizeInternetOutages(internetOutages: InternetOutage[]): UnifiedDataPoint[] {
  return internetOutages.map(outage => {
    const primaryValue = outage.type === 'NATIONWIDE' ? 100 : outage.type === 'REGIONAL' ? 75 : outage.type === 'LOCAL' ? 50 : 25

    let severity: SeverityLevel
    if (outage.type === 'NATIONWIDE') severity = 'critical'
    else if (outage.type === 'REGIONAL') severity = 'high'
    else severity = 'medium'

    return {
      id: outage.id,
      coords: outage.coords,
      timestamp: outage.timestamp,
      time: outage.time,
      location: outage.location,
      primaryValue,
      secondaryValue: outage.cause === 'CABLE_CUT' ? 100 : outage.cause === 'ATTACK' ? 90 : outage.cause === 'POWER_OUTAGE' ? 70 : 50,
      severity,
      layerType: 'internet-outages',
      layerLabel: 'Internet Outages',
      rawData: outage,
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
  outages: Outage[]
  latency: LatencyPoint[]
  powerOutages: PowerOutage[]
  severeWeather: SevereWeather[]
  internetOutages: InternetOutage[]
  activeLayers: Set<string>
}): UnifiedDataPoint[] {
  const { earthquakes, wildfires, airQuality, outages, latency, powerOutages, severeWeather, internetOutages, activeLayers } = params
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
  if (activeLayers.has('outages')) {
    unified.push(...normalizeOutages(outages))
  }
  if (activeLayers.has('latency')) {
    unified.push(...normalizeLatency(latency))
  }
  if (activeLayers.has('power-outages')) {
    unified.push(...normalizePowerOutages(powerOutages))
  }
  if (activeLayers.has('severe-weather')) {
    unified.push(...normalizeSevereWeather(severeWeather))
  }
  if (activeLayers.has('internet-outages')) {
    unified.push(...normalizeInternetOutages(internetOutages))
  }

  // Sort by timestamp (most recent first)
  return unified.sort((a, b) => b.timestamp - a.timestamp)
}
