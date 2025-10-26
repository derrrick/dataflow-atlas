'use client'

import { useState } from 'react'

export interface ChartFilters {
  categories: string[]
  dataSources: string[]
  implemented: boolean | null
  priorities: string[]
  phases: number[]
  searchQuery: string
}

interface FilterSidebarProps {
  onFiltersChange: (filters: ChartFilters) => void
}

export default function FilterSidebar({ onFiltersChange }: FilterSidebarProps) {
  const [filters, setFilters] = useState<ChartFilters>({
    categories: [],
    dataSources: [],
    implemented: null,
    priorities: [],
    phases: [],
    searchQuery: ''
  })

  const updateFilter = <K extends keyof ChartFilters>(
    key: K,
    value: ChartFilters[K]
  ) => {
    const newFilters = { ...filters, [key]: value }
    setFilters(newFilters)
    onFiltersChange(newFilters)
  }

  const toggleArrayFilter = <K extends keyof ChartFilters>(
    key: K,
    value: string | number
  ) => {
    const currentArray = filters[key] as any[]
    const newArray = currentArray.includes(value)
      ? currentArray.filter((v) => v !== value)
      : [...currentArray, value]
    updateFilter(key, newArray as any)
  }

  const clearAll = () => {
    const clearedFilters: ChartFilters = {
      categories: [],
      dataSources: [],
      implemented: null,
      priorities: [],
      phases: [],
      searchQuery: ''
    }
    setFilters(clearedFilters)
    onFiltersChange(clearedFilters)
  }

  const activeFilterCount =
    filters.categories.length +
    filters.dataSources.length +
    (filters.implemented !== null ? 1 : 0) +
    filters.priorities.length +
    filters.phases.length +
    (filters.searchQuery ? 1 : 0)

  return (
    <div style={{
      width: '320px',
      height: '100%',
      backgroundColor: '#0A0F16',
      borderRight: '1px solid #242C3A',
      padding: '32px 24px',
      overflow: 'auto',
      fontFamily: 'Albert Sans, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <h3 style={{
          fontSize: '13px',
          color: '#C6CFDA',
          fontWeight: 500,
          textTransform: 'uppercase',
          letterSpacing: '0.5px',
          margin: 0
        }}>
          Filters
        </h3>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C6CFDA'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#5E6A81'}
            style={{
              fontSize: '11px',
              color: '#5E6A81',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: 0,
              transition: 'color 150ms ease'
            }}
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      {/* Search */}
      <div style={{ marginBottom: '32px' }}>
        <input
          type="text"
          placeholder="Search charts..."
          value={filters.searchQuery}
          onChange={(e) => updateFilter('searchQuery', e.target.value)}
          style={{
            width: '100%',
            padding: '12px 16px',
            fontSize: '13px',
            fontFamily: 'Albert Sans, sans-serif',
            color: '#C6CFDA',
            backgroundColor: '#141821',
            border: '1px solid #242C3A',
            outline: 'none',
            transition: 'border-color 150ms ease'
          }}
          onFocus={(e) => e.currentTarget.style.borderColor = '#39D0FF'}
          onBlur={(e) => e.currentTarget.style.borderColor = '#242C3A'}
        />
      </div>

      {/* Filter Groups */}
      <FilterGroup title="Chart Type">
        <FilterSection title="Category">
          {['spatial', 'temporal', 'correlation', 'distribution', 'comparison'].map((cat) => (
            <Checkbox
              key={cat}
              label={cat}
              checked={filters.categories.includes(cat)}
              onChange={() => toggleArrayFilter('categories', cat)}
            />
          ))}
        </FilterSection>
      </FilterGroup>

      <FilterGroup title="Data">
        <FilterSection title="Data Source">
          {['earthquakes', 'hazards', 'outages', 'latency'].map((source) => (
            <Checkbox
              key={source}
              label={source}
              checked={filters.dataSources.includes(source)}
              onChange={() => toggleArrayFilter('dataSources', source)}
            />
          ))}
        </FilterSection>
      </FilterGroup>

      <FilterGroup title="Development">
        <FilterSection title="Implementation Status">
          <Checkbox
            label="Implemented"
            checked={filters.implemented === true}
            onChange={() => updateFilter('implemented', filters.implemented === true ? null : true)}
          />
          <Checkbox
            label="Placeholder"
            checked={filters.implemented === false}
            onChange={() => updateFilter('implemented', filters.implemented === false ? null : false)}
          />
        </FilterSection>

        <FilterSection title="Priority">
          {['high', 'medium', 'low'].map((priority) => (
            <Checkbox
              key={priority}
              label={priority}
              checked={filters.priorities.includes(priority)}
              onChange={() => toggleArrayFilter('priorities', priority)}
            />
          ))}
        </FilterSection>

        <FilterSection title="Phase">
          {[1, 2, 3].map((phase) => (
            <Checkbox
              key={phase}
              label={`Phase ${phase}`}
              checked={filters.phases.includes(phase)}
              onChange={() => toggleArrayFilter('phases', phase)}
            />
          ))}
        </FilterSection>
      </FilterGroup>
    </div>
  )
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{
      marginBottom: '32px',
      paddingBottom: '24px',
      borderBottom: '1px solid #242C3A'
    }}>
      <div style={{
        fontSize: '11px',
        color: '#8F9BB0',
        textTransform: 'uppercase',
        letterSpacing: '0.8px',
        marginBottom: '20px',
        fontWeight: 600
      }}>
        {title}
      </div>
      {children}
    </div>
  )
}

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: '24px' }}>
      <div style={{
        fontSize: '12px',
        color: '#C6CFDA',
        marginBottom: '12px',
        fontWeight: 400
      }}>
        {title}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {children}
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
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        cursor: 'pointer',
        fontSize: '13px',
        color: checked ? '#C6CFDA' : '#5E6A81',
        transition: 'color 150ms ease',
        padding: '4px 0'
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        style={{
          width: '16px',
          height: '16px',
          cursor: 'pointer',
          accentColor: '#39D0FF'
        }}
      />
      <span style={{ textTransform: 'capitalize' }}>{label}</span>
    </label>
  )
}
