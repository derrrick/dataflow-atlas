import { Layer } from '@/contexts/LayerContext'
import { Leaf, Blocks, Radio } from 'lucide-react'

export interface LayerConfig {
  id: Layer
  label: string
  color: string
  updateFrequency?: string
}

export interface CategoryConfig {
  id: 'natural' | 'infrastructure' | 'systemic'
  label: string
  Icon: React.ComponentType<{ size?: number; className?: string }>
  color: string
  layers: LayerConfig[]
}

export const categories: CategoryConfig[] = [
  {
    id: 'natural',
    label: 'Natural',
    Icon: Leaf,
    color: '#FF9500',
    layers: [
      { id: 'wildfire', label: 'Wildfire Activity', color: '#FF6B35', updateFrequency: '15 min' },
      { id: 'flood', label: 'Flood & Rainfall', color: '#4A90E2', updateFrequency: '1 hr' },
      { id: 'drought', label: 'Drought Index', color: '#D4A574', updateFrequency: '1 wk' },
      { id: 'air-quality', label: 'Air Quality', color: '#A855F7', updateFrequency: '1 hr' },
      { id: 'ocean-temp', label: 'Ocean Temperature', color: '#16A085', updateFrequency: '6 hr' },
      { id: 'earthquakes', label: 'Earthquakes', color: '#FF3B3B', updateFrequency: '1 min' },
      { id: 'volcanic', label: 'Volcanic Activity', color: '#E74C3C', updateFrequency: '1 day' },
      { id: 'severe-weather', label: 'Severe Weather', color: '#9333EA', updateFrequency: '1 hr' },
    ]
  },
  {
    id: 'infrastructure',
    label: 'Infrastructure',
    Icon: Blocks,
    color: '#39D0FF',
    layers: [
      { id: 'power-grid', label: 'Power Grid', color: '#FFB800', updateFrequency: 'Static' },
      { id: 'power-outages', label: 'Power Outages', color: '#FF6B6B', updateFrequency: '15 min' },
      { id: 'internet-outages', label: 'Internet Outages', color: '#4ECDC4', updateFrequency: '5 min' },
      { id: 'cellular-outages', label: 'Cellular Outages', color: '#95E1D3', updateFrequency: '15 min' },
      { id: 'transportation', label: 'Transportation', color: '#A8E6CF', updateFrequency: 'Live' },
      { id: 'air-port', label: 'Air & Port', color: '#FFD3B6', updateFrequency: 'Live' },
      { id: 'water-systems', label: 'Water Systems', color: '#87CEEB', updateFrequency: '1 day' },
      { id: 'population', label: 'Population Density', color: '#DDA15E', updateFrequency: '1 yr' },
    ]
  },
  {
    id: 'systemic',
    label: 'Systemic',
    Icon: Radio,
    color: '#19C6A6',
    layers: [
      { id: 'latency', label: 'Latency', color: '#19C6A6', updateFrequency: '5 min' },
      { id: 'supply-chain', label: 'Supply Chain', color: '#F4A261', updateFrequency: '1 hr' },
      { id: 'gnss', label: 'GNSS Interruptions', color: '#E76F51', updateFrequency: '1 hr' },
      { id: 'temp-stress', label: 'Temperature Stress', color: '#E63946', updateFrequency: '1 hr' },
      { id: 'social-signals', label: 'Social Signals', color: '#A8DADC', updateFrequency: 'Live' },
      { id: 'risk-indices', label: 'Risk Indices', color: '#457B9D', updateFrequency: '3 mo' },
    ]
  }
]

// Flat map for quick lookups
export const layerConfigMap = new Map<Layer, LayerConfig>(
  categories.flatMap(cat => cat.layers).map(layer => [layer.id, layer])
)
