'use client'

interface MapPopupProps {
  type: 'earthquake' | 'hazard' | 'outage' | 'latency'
  data: {
    location?: string
    magnitude?: number
    depth?: number
    time?: string
    severity?: string
    affected?: number
    latency?: number
    region?: string
  }
}

const typeColors = {
  earthquake: '#FF3B3B',
  hazard: '#FFB341',
  outage: '#5E6A81',
  latency: '#39D0FF',
}

const typeLabels = {
  earthquake: 'Earthquake',
  hazard: 'Hazard',
  outage: 'Outage',
  latency: 'Latency',
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
