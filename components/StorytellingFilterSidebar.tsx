'use client'

import { useState } from 'react'
import { BookOpen, Zap, TrendingUp, Globe, Filter, X, Bookmark } from 'lucide-react'

export interface StoryFilters {
  // Technical filters (hidden from user)
  categories: string[]
  dataSources: string[]
  implemented: boolean | null
  priorities: string[]
  phases: number[]
  searchQuery: string

  // Story-focused filters
  storyPreset: string | null
  timeRange: 'realtime' | '24h' | 'week' | 'month' | 'all'
  severity: 'all' | 'significant' | 'moderate' | 'minor'
  region: 'global' | 'north-america' | 'asia-pacific' | 'europe' | 'custom'
  narrative: 'overview' | 'trends' | 'impacts' | 'comparisons' | 'all'
}

interface StoryPreset {
  id: string
  name: string
  description: string
  icon: React.ComponentType<any>
  filters: Partial<StoryFilters>
  color: string
}

const storyPresets: StoryPreset[] = [
  {
    id: 'breaking-now',
    name: 'Breaking Now',
    description: 'Real-time events as they happen',
    icon: Zap,
    color: '#FF3B3B',
    filters: {
      timeRange: 'realtime',
      severity: 'significant',
      narrative: 'overview',
      implemented: true,
      dataSources: ['earthquakes', 'hazards', 'severe-weather', 'power-outages']
    }
  },
  {
    id: 'global-trends',
    name: 'Global Trends',
    description: 'Patterns emerging across the world',
    icon: TrendingUp,
    color: '#39D0FF',
    filters: {
      timeRange: 'week',
      region: 'global',
      narrative: 'trends',
      implemented: true,
      categories: ['temporal', 'correlation']
    }
  },
  {
    id: 'regional-impacts',
    name: 'Regional Impacts',
    description: 'How events affect specific areas',
    icon: Globe,
    color: '#FFB341',
    filters: {
      timeRange: '24h',
      region: 'north-america',
      narrative: 'impacts',
      implemented: true,
      categories: ['spatial', 'distribution']
    }
  },
  {
    id: 'comparative-analysis',
    name: 'Comparative Analysis',
    description: 'Compare different data types side-by-side',
    icon: BookOpen,
    color: '#8F9BB0',
    filters: {
      timeRange: 'month',
      narrative: 'comparisons',
      implemented: true,
      categories: ['comparison', 'correlation']
    }
  }
]

interface StorytellingFilterSidebarProps {
  onFiltersChange: (filters: StoryFilters) => void
}

export default function StorytellingFilterSidebar({ onFiltersChange }: StorytellingFilterSidebarProps) {
  const [filters, setFilters] = useState<StoryFilters>({
    categories: [],
    dataSources: [],
    implemented: true, // Default to showing implemented charts
    priorities: [],
    phases: [],
    searchQuery: '',
    storyPreset: null,
    timeRange: 'all',
    severity: 'all',
    region: 'global',
    narrative: 'all'
  })

  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = <K extends keyof StoryFilters>(
    key: K,
    value: StoryFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters as any)
  }

  const applyPreset = (preset: StoryPreset) => {
    const newFilters: StoryFilters = {
      ...filters,
      ...preset.filters,
      storyPreset: preset.id
    }
    setFilters(newFilters)
    onFiltersChange(newFilters as any)
  }

  const clearAll = () => {
    const clearedFilters: StoryFilters = {
      categories: [],
      dataSources: [],
      implemented: true,
      priorities: [],
      phases: [],
      searchQuery: '',
      storyPreset: null,
      timeRange: 'all',
      severity: 'all',
      region: 'global',
      narrative: 'all'
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters as any)
  }

  const toggleArrayFilter = <K extends keyof StoryFilters>(
    key: K,
    value: string | number
  ) => {
    const currentArray = filters[key] as any[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as any)
  }

  const activeFilterCount =
    (filters.storyPreset ? 1 : 0) +
    (filters.timeRange !== 'all' ? 1 : 0) +
    (filters.severity !== 'all' ? 1 : 0) +
    (filters.region !== 'global' ? 1 : 0) +
    (filters.narrative !== 'all' ? 1 : 0) +
    (filters.searchQuery ? 1 : 0)

  return (
    <div style={{
      width: '340px',
      height: '100%',
      backgroundColor: '#0A0F16',
      borderRight: '1px solid #242C3A',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'Albert Sans, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        padding: '32px 24px 24px',
        borderBottom: '1px solid #242C3A'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '12px'
        }}>
          <h3 style={{
            fontSize: '16px',
            color: '#FFFFFF',
            fontWeight: 600,
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Filter size={16} color="#39D0FF" />
            Tell Your Story
          </h3>
          {activeFilterCount > 0 && (
            <button
              onClick={clearAll}
              style={{
                padding: '6px 10px',
                fontSize: '11px',
                color: '#8F9BB0',
                background: 'none',
                border: '1px solid #242C3A',
                cursor: 'pointer',
                transition: 'all 150ms ease',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#242C3A'
                e.currentTarget.style.color = '#C6CFDA'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#8F9BB0'
              }}
            >
              <X size={12} />
              Clear ({activeFilterCount})
            </button>
          )}
        </div>
        <p style={{
          fontSize: '12px',
          color: '#8F9BB0',
          margin: 0,
          lineHeight: '1.5'
        }}>
          Choose a narrative focus to explore the data through different lenses
        </p>
      </div>

      {/* Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '24px'
      }}>
        {/* Story Presets */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '11px',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '16px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}>
            <Bookmark size={12} />
            Quick Stories
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}>
            {storyPresets.map(preset => (
              <button
                key={preset.id}
                onClick={() => applyPreset(preset)}
                style={{
                  padding: '16px',
                  backgroundColor: filters.storyPreset === preset.id ? `${preset.color}15` : '#141821',
                  border: `1px solid ${filters.storyPreset === preset.id ? preset.color : '#242C3A'}`,
                  cursor: 'pointer',
                  transition: 'all 200ms ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (filters.storyPreset !== preset.id) {
                    e.currentTarget.style.backgroundColor = '#1A2332'
                    e.currentTarget.style.borderColor = preset.color
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.storyPreset !== preset.id) {
                    e.currentTarget.style.backgroundColor = '#141821'
                    e.currentTarget.style.borderColor = '#242C3A'
                  }
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: `${preset.color}15`,
                    border: `1px solid ${preset.color}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <preset.icon size={18} color={preset.color} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontSize: '13px',
                      color: '#FFFFFF',
                      fontWeight: 600,
                      marginBottom: '4px'
                    }}>
                      {preset.name}
                    </div>
                    <div style={{
                      fontSize: '11px',
                      color: '#8F9BB0',
                      lineHeight: '1.4'
                    }}>
                      {preset.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Time Range */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '11px',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Time Period
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '8px'
          }}>
            {[
              { value: 'realtime', label: 'Now', emoji: '⚡' },
              { value: '24h', label: 'Today', emoji: '📅' },
              { value: 'week', label: 'This Week', emoji: '📊' },
              { value: 'month', label: 'This Month', emoji: '📈' },
              { value: 'all', label: 'All Time', emoji: '🌐' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateFilter('timeRange', option.value as any)}
                style={{
                  padding: '10px',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: filters.timeRange === option.value ? '#FFFFFF' : '#8F9BB0',
                  backgroundColor: filters.timeRange === option.value ? '#39D0FF15' : '#141821',
                  border: `1px solid ${filters.timeRange === option.value ? '#39D0FF' : '#242C3A'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'center'
                }}
                onMouseEnter={(e) => {
                  if (filters.timeRange !== option.value) {
                    e.currentTarget.style.backgroundColor = '#1A2332'
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.timeRange !== option.value) {
                    e.currentTarget.style.backgroundColor = '#141821'
                  }
                }}
              >
                {option.emoji} {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Severity */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '11px',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Event Significance
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {[
              { value: 'all', label: 'All Events', color: '#8F9BB0' },
              { value: 'significant', label: 'Significant Events', color: '#FF3B3B' },
              { value: 'moderate', label: 'Moderate Events', color: '#FFB341' },
              { value: 'minor', label: 'Minor Events', color: '#39D0FF' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateFilter('severity', option.value as any)}
                style={{
                  padding: '12px 16px',
                  fontSize: '13px',
                  fontWeight: 500,
                  color: filters.severity === option.value ? '#FFFFFF' : '#8F9BB0',
                  backgroundColor: filters.severity === option.value ? `${option.color}15` : '#141821',
                  border: `1px solid ${filters.severity === option.value ? option.color : '#242C3A'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'left',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => {
                  if (filters.severity !== option.value) {
                    e.currentTarget.style.backgroundColor = '#1A2332'
                    e.currentTarget.style.borderColor = option.color
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.severity !== option.value) {
                    e.currentTarget.style.backgroundColor = '#141821'
                    e.currentTarget.style.borderColor = '#242C3A'
                  }
                }}
              >
                <div style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: option.color
                }} />
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Narrative Focus */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '11px',
            color: '#5E6A81',
            textTransform: 'uppercase',
            letterSpacing: '0.8px',
            marginBottom: '12px',
            fontWeight: 600
          }}>
            Narrative Focus
          </div>
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}>
            {[
              { value: 'all', label: 'All Perspectives', desc: 'Show everything' },
              { value: 'overview', label: 'Big Picture', desc: 'High-level summaries' },
              { value: 'trends', label: 'Patterns Over Time', desc: 'Temporal analysis' },
              { value: 'impacts', label: 'Geographic Impact', desc: 'Where events occur' },
              { value: 'comparisons', label: 'Side-by-Side', desc: 'Compare data types' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => updateFilter('narrative', option.value as any)}
                style={{
                  padding: '12px 16px',
                  fontSize: '13px',
                  color: filters.narrative === option.value ? '#FFFFFF' : '#8F9BB0',
                  backgroundColor: filters.narrative === option.value ? '#39D0FF15' : '#141821',
                  border: `1px solid ${filters.narrative === option.value ? '#39D0FF' : '#242C3A'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms ease',
                  textAlign: 'left'
                }}
                onMouseEnter={(e) => {
                  if (filters.narrative !== option.value) {
                    e.currentTarget.style.backgroundColor = '#1A2332'
                  }
                }}
                onMouseLeave={(e) => {
                  if (filters.narrative !== option.value) {
                    e.currentTarget.style.backgroundColor = '#141821'
                  }
                }}
              >
                <div style={{
                  fontSize: '13px',
                  fontWeight: 500,
                  marginBottom: '4px'
                }}>
                  {option.label}
                </div>
                <div style={{
                  fontSize: '11px',
                  color: '#5E6A81'
                }}>
                  {option.desc}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Advanced Filters Toggle */}
        <div style={{ marginBottom: '24px' }}>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            style={{
              width: '100%',
              padding: '12px 16px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#8F9BB0',
              backgroundColor: '#141821',
              border: '1px solid #242C3A',
              cursor: 'pointer',
              transition: 'all 150ms ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1A2332'
              e.currentTarget.style.borderColor = '#39D0FF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#141821'
              e.currentTarget.style.borderColor = '#242C3A'
            }}
          >
            <span>Advanced Filters</span>
            <span style={{ fontSize: '16px' }}>{showAdvanced ? '−' : '+'}</span>
          </button>
        </div>

        {/* Advanced Filters (Collapsible) */}
        {showAdvanced && (
          <div style={{
            padding: '20px',
            backgroundColor: '#141821',
            border: '1px solid #242C3A',
            marginBottom: '24px'
          }}>
            {/* Data Sources */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{
                fontSize: '11px',
                color: '#5E6A81',
                marginBottom: '10px',
                fontWeight: 600
              }}>
                Data Sources
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['earthquakes', 'hazards', 'outages', 'latency', 'power-outages', 'severe-weather'].map(source => (
                  <Checkbox
                    key={source}
                    label={source}
                    checked={filters.dataSources.includes(source)}
                    onChange={() => toggleArrayFilter('dataSources', source)}
                  />
                ))}
              </div>
            </div>

            {/* Categories */}
            <div>
              <div style={{
                fontSize: '11px',
                color: '#5E6A81',
                marginBottom: '10px',
                fontWeight: 600
              }}>
                Chart Categories
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {['spatial', 'temporal', 'correlation', 'distribution', 'comparison'].map(cat => (
                  <Checkbox
                    key={cat}
                    label={cat}
                    checked={filters.categories.includes(cat)}
                    onChange={() => toggleArrayFilter('categories', cat)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Checkbox({
  label,
  checked,
  onChange
}: {
  label: string
  checked: boolean
  onChange: () => void
}) {
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        cursor: 'pointer',
        fontSize: '12px',
        color: checked ? '#C6CFDA' : '#5E6A81',
        transition: 'color 150ms ease',
        padding: '4px 0'
      }}
      onMouseEnter={(e) => {
        if (!checked) {
          e.currentTarget.style.color = '#8F9BB0'
        }
      }}
      onMouseLeave={(e) => {
        if (!checked) {
          e.currentTarget.style.color = '#5E6A81'
        }
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: '14px',
          height: '14px',
          cursor: 'pointer',
          accentColor: '#39D0FF'
        }}
      />
      <span style={{ textTransform: 'capitalize' }}>{label}</span>
    </label>
  )
}
