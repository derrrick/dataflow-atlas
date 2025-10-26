'use client'

interface PlaceholderChartProps {
  chartNumber: string
  chartName: string
  width?: number
  height?: number
}

export function PlaceholderChart({ chartNumber, chartName, width = 280, height = 160 }: PlaceholderChartProps) {
  return (
    <div style={{
      width,
      height,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      backgroundColor: 'rgba(255, 255, 255, 0.01)',
      border: '1px dashed #242C3A',
    }}>
      <div style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: '24px',
        color: '#242C3A',
        fontWeight: '300'
      }}>
        {chartNumber}
      </div>
      <div style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: '10px',
        color: '#3A4559',
        textAlign: 'center',
        maxWidth: '80%'
      }}>
        {chartName}
      </div>
      <div style={{
        fontFamily: 'Geist Mono, monospace',
        fontSize: '9px',
        color: '#2F394B',
        marginTop: '4px'
      }}>
        Coming Soon
      </div>
    </div>
  )
}
