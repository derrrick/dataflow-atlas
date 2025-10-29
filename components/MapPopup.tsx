'use client'

interface MapPopupProps {
  type: 'earthquake' | 'hazard' | 'outage' | 'latency' | 'powerOutage' | 'severeWeather' | 'internetOutage' | 'airQuality'
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
    country?: string
    cause?: string
    type?: string
    isps?: string[]
    aqi?: number
    pm25?: number
    quality?: string
    parameter?: string
    category?: string
  }
}

const typeColors = {
  earthquake: '#FF3B3B',
  hazard: '#FFB341',
  outage: '#5E6A81',
  latency: '#00E400',
  powerOutage: '#FFD700',
  severeWeather: '#9333EA',
  internetOutage: '#4ECDC4',
  airQuality: '#A855F7',
}

const typeLabels = {
  earthquake: 'EARTHQUAKE',
  hazard: 'HAZARD',
  outage: 'OUTAGE',
  latency: 'LATENCY',
  powerOutage: 'POWER OUTAGE',
  severeWeather: 'SEVERE WEATHER',
  internetOutage: 'INTERNET OUTAGE',
  airQuality: 'AIR QUALITY',
}

export default function MapPopup({ type, data }: MapPopupProps) {
  // Determine primary metric
  let primaryValue = ''
  let primaryLabel = ''

  if (type === 'earthquake' && data.magnitude) {
    primaryValue = data.magnitude.toFixed(1)
    primaryLabel = 'MAGNITUDE'
  } else if (type === 'hazard' && data.severity) {
    primaryValue = data.severity
    primaryLabel = 'SEVERITY'
  } else if (type === 'latency' && data.latency) {
    primaryValue = `${data.latency}ms`
    primaryLabel = 'LATENCY'
  } else if (type === 'powerOutage' && data.customers_out) {
    primaryValue = data.customers_out.toLocaleString()
    primaryLabel = 'CUSTOMERS OUT'
  } else if (type === 'severeWeather' && data.severity) {
    primaryValue = data.severity
    primaryLabel = 'SEVERITY'
  } else if (type === 'internetOutage' && data.type) {
    primaryValue = data.type
    primaryLabel = 'TYPE'
  } else if (type === 'airQuality' && data.aqi !== undefined) {
    primaryValue = data.aqi.toString()
    primaryLabel = 'AQI'
  } else if (type === 'outage' && data.affected) {
    primaryValue = data.affected.toLocaleString()
    primaryLabel = 'AFFECTED'
  }

  return `
    <div style="
      font-family: Albert Sans, sans-serif;
      background-color: #080D12;
      border: 1px solid #242C3A;
      border-top: 4px solid ${typeColors[type]};
      padding: 0;
      min-width: 240px;
      max-width: 320px;
    ">
      <!-- Header -->
      <div style="
        padding: 24px 24px 16px 24px;
        border-bottom: 1px solid #242C3A;
      ">
        <div style="
          font-size: 10px;
          font-weight: 600;
          color: #5E6A81;
          font-family: Geist Mono, monospace;
          letter-spacing: 0.5px;
          text-transform: uppercase;
          margin-bottom: 16px;
        ">${typeLabels[type]}</div>

        ${primaryValue ? `
          <div style="margin-bottom: 8px;">
            <div style="
              font-size: 10px;
              color: #5E6A81;
              font-family: Geist Mono, monospace;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 8px;
            ">${primaryLabel}</div>
            <div style="
              font-size: 32px;
              font-weight: 700;
              color: ${typeColors[type]};
              font-family: Geist Mono, monospace;
              line-height: 1;
              letter-spacing: -0.02em;
            ">${primaryValue}</div>
          </div>
        ` : ''}
      </div>

      <!-- Content -->
      <div style="padding: 16px 24px;">
        ${type === 'earthquake' && data.depth ? `
          <div style="margin-bottom: 16px;">
            <div style="
              font-size: 10px;
              color: #5E6A81;
              font-family: Geist Mono, monospace;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            ">DEPTH</div>
            <div style="
              font-size: 14px;
              color: #FFFFFF;
              font-family: Albert Sans, sans-serif;
            ">${data.depth} km</div>
          </div>
        ` : ''}

        ${type === 'hazard' && data.affected ? `
          <div style="margin-bottom: 16px;">
            <div style="
              font-size: 10px;
              color: #5E6A81;
              font-family: Geist Mono, monospace;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            ">AFFECTED</div>
            <div style="
              font-size: 14px;
              color: #FFFFFF;
              font-family: Albert Sans, sans-serif;
            ">${data.affected.toLocaleString()} people</div>
          </div>
        ` : ''}

        ${type === 'outage' && data.region ? `
          <div style="margin-bottom: 16px;">
            <div style="
              font-size: 10px;
              color: #5E6A81;
              font-family: Geist Mono, monospace;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            ">REGION</div>
            <div style="
              font-size: 14px;
              color: #FFFFFF;
              font-family: Albert Sans, sans-serif;
            ">${data.region}</div>
          </div>
        ` : ''}

        ${type === 'latency' && data.region ? `
          <div style="margin-bottom: 16px;">
            <div style="
              font-size: 10px;
              color: #5E6A81;
              font-family: Geist Mono, monospace;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              margin-bottom: 4px;
            ">REGION</div>
            <div style="
              font-size: 14px;
              color: #FFFFFF;
              font-family: Albert Sans, sans-serif;
            ">${data.region}</div>
          </div>
        ` : ''}

        ${type === 'powerOutage' ? `
          ${data.percentage_out !== undefined ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">PERCENTAGE OUT</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.percentage_out}%</div>
            </div>
          ` : ''}
          ${data.state ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">STATE</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.state}</div>
            </div>
          ` : ''}
        ` : ''}

        ${type === 'severeWeather' ? `
          ${data.event ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">EVENT</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.event}</div>
            </div>
          ` : ''}
          ${data.urgency && data.urgency !== 'Unknown' ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">URGENCY</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.urgency}</div>
            </div>
          ` : ''}
          ${data.areaDesc ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">AFFECTED AREAS</div>
              <div style="
                font-size: 12px;
                color: #8F9BB0;
                font-family: Albert Sans, sans-serif;
                line-height: 1.5;
              ">${data.areaDesc.substring(0, 120)}${data.areaDesc.length > 120 ? '...' : ''}</div>
            </div>
          ` : ''}
        ` : ''}

        ${type === 'internetOutage' ? `
          ${data.cause ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">CAUSE</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.cause.replace(/_/g, ' ')}</div>
            </div>
          ` : ''}
          ${data.country ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">COUNTRY</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.country}</div>
            </div>
          ` : ''}
          ${data.isps && data.isps.length > 0 ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">AFFECTED ISPs</div>
              <div style="
                font-size: 12px;
                color: #8F9BB0;
                font-family: Albert Sans, sans-serif;
                line-height: 1.5;
              ">${data.isps.slice(0, 3).join(', ')}${data.isps.length > 3 ? ` +${data.isps.length - 3} more` : ''}</div>
            </div>
          ` : ''}
          ${data.description ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">DESCRIPTION</div>
              <div style="
                font-size: 12px;
                color: #8F9BB0;
                font-family: Albert Sans, sans-serif;
                line-height: 1.5;
              ">${data.description.substring(0, 120)}${data.description.length > 120 ? '...' : ''}</div>
            </div>
          ` : ''}
        ` : ''}

        ${type === 'airQuality' ? `
          ${data.quality ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">CATEGORY</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.quality}</div>
            </div>
          ` : ''}
          ${data.pm25 ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">PM2.5 CONCENTRATION</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.pm25} μg/m³</div>
            </div>
          ` : ''}
          ${data.parameter ? `
            <div style="margin-bottom: 16px;">
              <div style="
                font-size: 10px;
                color: #5E6A81;
                font-family: Geist Mono, monospace;
                text-transform: uppercase;
                letter-spacing: 0.5px;
                margin-bottom: 4px;
              ">PARAMETER</div>
              <div style="
                font-size: 14px;
                color: #FFFFFF;
                font-family: Albert Sans, sans-serif;
              ">${data.parameter}</div>
            </div>
          ` : ''}
        ` : ''}
      </div>

      <!-- Footer -->
      <div style="
        padding: 16px 24px;
        border-top: 1px solid #242C3A;
        background-color: #0A0F16;
      ">
        ${data.location ? `
          <div style="
            font-size: 12px;
            color: #8F9BB0;
            font-family: Albert Sans, sans-serif;
            margin-bottom: ${data.time ? '8px' : '0'};
          ">${data.location}</div>
        ` : ''}
        ${data.time ? `
          <div style="
            font-size: 10px;
            color: #5E6A81;
            font-family: Geist Mono, monospace;
            letter-spacing: 0.5px;
          ">${data.time}</div>
        ` : ''}
      </div>
    </div>
  `
}
