'use client'

import { LayerProvider } from '@/contexts/LayerContext'
import { TimeProvider } from '@/contexts/TimeContext'
import LayerControlsV2 from '@/components/LayerControlsV2'

export default function LayerControlsTestPage() {
  return (
    <TimeProvider>
      <LayerProvider>
        <div style={{
          width: '100vw',
          height: '100vh',
          backgroundColor: '#141821',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px'
        }}>
          <LayerControlsV2 />
        </div>
      </LayerProvider>
    </TimeProvider>
  )
}
