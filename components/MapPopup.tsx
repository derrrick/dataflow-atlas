'use client'

interface MapPopupProps {
  type: 'earthquake' | 'hazard' | 'outage' | 'latency' | 'powerOutage' | 'severeWeather'
  data: {
    location?: string
    magnitude?: number
    depth?: number
    time?: string
    severity?: string
    affected?: number
    latency?: number
    region?: string
    customers_out?: number
    percentage_out?: number
    state?: string
    event?: string
    urgency?: string
    headline?: string
    certainty?: string
    expires?: string
    description?: string
    instruction?: string
    areaDesc?: string
  }
}

// Helper functions for severe weather
function getEventCategory(event: string): string {
  const lower = event.toLowerCase()
  if (lower.includes('tornado')) return 'Tornado'
  if (lower.includes('hurricane') || lower.includes('typhoon')) return 'Hurricane'
  if (lower.includes('flood')) return 'Flood'
  if (lower.includes('fire')) return 'Fire'
  if (lower.includes('snow') || lower.includes('blizzard')) return 'Winter Storm'
  if (lower.includes('thunderstorm')) return 'Severe T-Storm'
  if (lower.includes('heat')) return 'Heat'
  if (lower.includes('wind')) return 'High Wind'
  return event.split(' ')[0] // First word
}

function getEventBadgeColor(event: string): string {
  const lower = event.toLowerCase()
  if (lower.includes('tornado')) return '#8B0000'
  if (lower.includes('hurricane') || lower.includes('typhoon')) return '#800080'
  if (lower.includes('flood')) return '#4169E1'
  if (lower.includes('fire')) return '#FF4500'
  if (lower.includes('snow') || lower.includes('blizzard')) return '#4682B4'
  if (lower.includes('heat')) return '#FF6347'
  if (lower.includes('wind')) return '#708090'
  return '#9333EA'
}

function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'Extreme': return '#8B0000'
    case 'Severe': return '#DC143C'
    case 'Moderate': return '#FF8C42'
    case 'Minor': return '#FFD93D'
    default: return '#8F9BB0'
  }
}

function formatExpiration(expires: string): string {
  try {
    const expireDate = new Date(expires)
    const now = new Date()
    const diffMs = expireDate.getTime() - now.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffMins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

    if (diffMs < 0) return 'Expired'
    if (diffHours === 0) return `${diffMins}m remaining`
    if (diffHours < 24) return `${diffHours}h ${diffMins}m remaining`

    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays}d ${diffHours % 24}h remaining`
  } catch {
    return expires
  }
}

const typeColors = {
  earthquake: '#FF3B3B',
  hazard: '#FFB341',
  outage: '#5E6A81',
  latency: '#39D0FF',
  powerOutage: '#FFD700',
  severeWeather: '#9333EA',
}

const typeLabels = {
  earthquake: 'Earthquake',
  hazard: 'Hazard',
  outage: 'Outage',
  latency: 'Latency',
  powerOutage: 'Power Outage',
  severeWeather: 'Severe Weather',
}

export default function MapPopup({ type, data }: MapPopupProps) {
  return `
    <div style="
      font-family: Geist Mono, monospace;
      background-color: #141821;
      border: 1px solid #242C3A;
      padding: 16px;
      min-width: 200px;
      max-width: 280px;
    ">
      <div style="
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        padding-bottom: 8px;
        border-bottom: 1px solid #242C3A;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background-color: ${typeColors[type]};
        "></div>
        <span style="
          font-size: 14px;
          font-weight: 600;
          color: #FFFFFF;
          font-family: Geist Mono, monospace;
        ">${typeLabels[type]}</span>
      </div>

      ${type === 'earthquake' ? `
        ${data.magnitude ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Magnitude</span>
            <div style="font-size: 22px; font-weight: 600; color: #FF3B3B; font-family: Geist Mono, monospace;">${data.magnitude}</div>
          </div>
        ` : ''}
        ${data.depth ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Depth</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.depth} km</div>
          </div>
        ` : ''}
      ` : ''}

      ${type === 'hazard' ? `
        ${data.severity ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Severity</span>
            <div style="font-size: 14px; color: #FFB341; font-weight: 600; font-family: Geist Mono, monospace;">${data.severity}</div>
          </div>
        ` : ''}
        ${data.affected ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Affected</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.affected.toLocaleString()} people</div>
          </div>
        ` : ''}
      ` : ''}

      ${type === 'outage' ? `
        ${data.region ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Region</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.region}</div>
          </div>
        ` : ''}
        ${data.affected ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Users affected</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.affected.toLocaleString()}</div>
          </div>
        ` : ''}
      ` : ''}

      ${type === 'latency' ? `
        ${data.latency ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Latency</span>
            <div style="font-size: 18px; font-weight: 600; color: #39D0FF; font-family: Geist Mono, monospace;">${data.latency} ms</div>
          </div>
        ` : ''}
        ${data.region ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Region</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.region}</div>
          </div>
        ` : ''}
      ` : ''}

      ${type === 'powerOutage' ? `
        ${data.customers_out ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Customers Out</span>
            <div style="font-size: 18px; font-weight: 600; color: #FFD700; font-family: Geist Mono, monospace;">${data.customers_out.toLocaleString()}</div>
          </div>
        ` : ''}
        ${data.percentage_out !== undefined ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Percentage</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.percentage_out}%</div>
          </div>
        ` : ''}
        ${data.severity ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Severity</span>
            <div style="font-size: 14px; color: #FFD700; font-weight: 600; font-family: Geist Mono, monospace;">${data.severity}</div>
          </div>
        ` : ''}
        ${data.state ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">State</span>
            <div style="font-size: 14px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.state}</div>
          </div>
        ` : ''}
      ` : ''}

      ${type === 'severeWeather' ? `
        ${data.headline ? `
          <div style="margin-bottom: 12px; padding: 12px; background-color: #0A0F16; border-left: 3px solid #9333EA; border-radius: 4px;">
            <div style="font-size: 13px; color: #FFFFFF; font-family: Geist Mono, monospace; line-height: 1.5; font-weight: 500;">${data.headline}</div>
          </div>
        ` : ''}
        <div style="display: flex; gap: 8px; margin-bottom: 12px; flex-wrap: wrap;">
          ${data.event ? `
            <div style="padding: 4px 10px; background-color: ${getEventBadgeColor(data.event)}; border-radius: 4px; font-size: 11px; font-weight: 600; color: #FFFFFF; font-family: Geist Mono, monospace; text-transform: uppercase; letter-spacing: 0.5px;">
              ${getEventCategory(data.event)}
            </div>
          ` : ''}
          ${data.severity && data.severity !== 'Unknown' ? `
            <div style="padding: 4px 10px; background-color: ${getSeverityColor(data.severity)}; border-radius: 4px; font-size: 11px; font-weight: 600; color: #FFFFFF; font-family: Geist Mono, monospace;">
              ${data.severity}
            </div>
          ` : ''}
          ${data.urgency && data.urgency !== 'Unknown' ? `
            <div style="padding: 4px 10px; background-color: #2A3441; border: 1px solid #3D4958; border-radius: 4px; font-size: 11px; font-weight: 500; color: #C6CFDA; font-family: Geist Mono, monospace;">
              ${data.urgency === 'Immediate' ? '🚨 ' : ''}${data.urgency}
            </div>
          ` : ''}
        </div>
        ${data.areaDesc ? `
          <div style="margin-bottom: 12px; padding: 10px; background-color: #1A2332; border-radius: 4px; border: 1px solid #242C3A;">
            <div style="font-size: 11px; color: #8F9BB0; font-family: Geist Mono, monospace; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Affected Areas</div>
            <div style="font-size: 12px; color: #C6CFDA; font-family: Geist Mono, monospace; line-height: 1.4;">${data.areaDesc}</div>
          </div>
        ` : ''}
        ${data.description ? `
          <div style="margin-bottom: 12px; padding: 10px; background-color: #1A2332; border-radius: 4px; border: 1px solid #242C3A; max-height: 120px; overflow-y: auto;">
            <div style="font-size: 11px; color: #8F9BB0; font-family: Geist Mono, monospace; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Details</div>
            <div style="font-size: 11px; color: #C6CFDA; font-family: Geist Mono, monospace; line-height: 1.5;">${data.description.substring(0, 400)}${data.description.length > 400 ? '...' : ''}</div>
          </div>
        ` : ''}
        ${data.instruction ? `
          <div style="margin-bottom: 12px; padding: 10px; background-color: #1A2332; border-left: 3px solid #FFB341; border-radius: 4px;">
            <div style="font-size: 11px; color: #FFB341; font-family: Geist Mono, monospace; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px; font-weight: 600;">⚠️ Safety Instructions</div>
            <div style="font-size: 11px; color: #C6CFDA; font-family: Geist Mono, monospace; line-height: 1.5;">${data.instruction.substring(0, 300)}${data.instruction.length > 300 ? '...' : ''}</div>
          </div>
        ` : ''}
        ${data.certainty ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Certainty</span>
            <div style="font-size: 13px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.certainty}</div>
          </div>
        ` : ''}
        ${data.expires ? `
          <div style="margin-bottom: 8px;">
            <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Expires</span>
            <div style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">${formatExpiration(data.expires)}</div>
          </div>
        ` : ''}
      ` : ''}

      ${data.location ? `
        <div style="margin-bottom: 8px;">
          <span style="font-size: 12px; color: #8F9BB0; font-family: Geist Mono, monospace;">Location</span>
          <div style="font-size: 12px; color: #C6CFDA; font-family: Geist Mono, monospace;">${data.location}</div>
        </div>
      ` : ''}

      ${data.time ? `
        <div style="margin-top: 12px; padding-top: 8px; border-top: 1px solid #242C3A;">
          <span style="font-size: 11px; color: #5E6A81; font-family: Geist Mono, monospace;">${data.time}</span>
        </div>
      ` : ''}
    </div>
  `
}
