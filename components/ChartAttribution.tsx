'use client'

interface ChartAttributionProps {
  source: string
  lastUpdate: number // timestamp in milliseconds
  confidence?: 'High' | 'Medium' | 'Low' | 'Preliminary'
  coverage?: string
}

export function ChartAttribution({
  source,
  lastUpdate,
  confidence,
  coverage
}: ChartAttributionProps) {
  const now = Date.now()
  const ageMs = now - lastUpdate
  const ageHours = Math.floor(ageMs / (1000 * 60 * 60))
  const ageMinutes = Math.floor((ageMs % (1000 * 60 * 60)) / (1000 * 60))

  // Determine staleness
  const isStale = ageHours >= 6

  // Format age
  let ageText = ''
  if (ageHours > 0) {
    ageText = `${ageHours}h ago`
  } else if (ageMinutes > 0) {
    ageText = `${ageMinutes}m ago`
  } else {
    ageText = 'just now'
  }

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '10px',
      fontFamily: 'Geist Mono, monospace',
      color: '#8F9BB0',
      marginBottom: '8px'
    }}>
      {/* Source */}
      <span style={{
        fontWeight: 600,
        color: '#C6CFDA'
      }}>
        {source}
      </span>

      <span style={{ color: '#3A4559' }}>·</span>

      {/* Last Update */}
      <span style={{
        color: isStale ? '#FFB341' : '#8F9BB0'
      }}>
        {isStale && '⚠️ '}
        Updated {ageText}
      </span>

      {/* Confidence (optional) */}
      {confidence && (
        <>
          <span style={{ color: '#3A4559' }}>·</span>
          <span style={{
            color: confidence === 'High' ? '#19C6A6' :
                   confidence === 'Medium' ? '#FFB341' :
                   confidence === 'Low' ? '#FF6B6B' : '#8F9BB0',
            fontSize: '9px',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {confidence}
          </span>
        </>
      )}

      {/* Coverage (optional) */}
      {coverage && (
        <>
          <span style={{ color: '#3A4559' }}>·</span>
          <span style={{
            fontSize: '9px',
            color: '#5E6A81'
          }}>
            {coverage}
          </span>
        </>
      )}
    </div>
  )
}
