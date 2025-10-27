'use client'

import { useState, ReactNode } from 'react'
import { ChevronUp, ChevronDown, Map, BookOpen } from 'lucide-react'

interface ExpandablePanelProps {
  collapsedContent: ReactNode
  expandedContent: ReactNode
}

export default function ExpandablePanel({ collapsedContent, expandedContent }: ExpandablePanelProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  const toggleExpanded = () => {
    setIsExpanded(!isExpanded)
  }

  return (
    <div style={{
      width: '100%',
      borderTop: '1px solid #242C3A',
      backgroundColor: '#141821',
      position: isExpanded ? 'fixed' : 'relative',
      top: isExpanded ? '68px' : 'auto',
      left: isExpanded ? 0 : 'auto',
      height: isExpanded ? 'calc(100vh - 68px)' : 'auto',
      transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: isExpanded ? 'hidden' : 'visible',
      zIndex: isExpanded ? 1000 : 'auto'
    }}>
      {/* Toggle CTA - Top Center */}
      <div style={{
        position: isExpanded ? 'fixed' : 'absolute',
        top: isExpanded ? '52px' : '-64px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: isExpanded ? 1001 : 101
      }}>
        <button
          onClick={toggleExpanded}
          style={{
            padding: '14px 28px',
            border: '1px solid #242C3A',
            backgroundColor: isExpanded ? '#0A0F16' : 'rgba(10, 15, 22, 0.5)',
            borderRadius: '100px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#FFFFFF',
            transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            fontSize: '14px',
            fontFamily: 'Albert Sans, sans-serif',
            fontWeight: 500,
            whiteSpace: 'nowrap',
            boxShadow: 'none'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.backgroundColor = '#141821'
            e.currentTarget.style.borderColor = '#39D0FF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = isExpanded ? '#0A0F16' : 'rgba(10, 15, 22, 0.5)'
            e.currentTarget.style.borderColor = '#242C3A'
          }}
        >
          {isExpanded ? (
            <>
              <Map size={14} />
              <span>Back to Map</span>
              <ChevronDown size={14} />
            </>
          ) : (
            <>
              <BookOpen size={14} />
              <span>Explore the data</span>
              <ChevronUp size={14} />
            </>
          )}
        </button>
      </div>

      {/* Content */}
      <div style={{
        height: '100%',
        overflow: isExpanded ? 'auto' : 'visible'
      }}>
        {isExpanded ? expandedContent : collapsedContent}
      </div>
    </div>
  )
}
