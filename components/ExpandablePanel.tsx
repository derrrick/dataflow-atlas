'use client'

import { useState, ReactNode } from 'react'
import { ChevronUp, ChevronDown, BookOpen } from 'lucide-react'

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
      top: isExpanded ? '60px' : 'auto',
      left: isExpanded ? 0 : 'auto',
      height: isExpanded ? 'calc(100vh - 60px)' : 'auto',
      transition: 'height 300ms cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: isExpanded ? 'hidden' : 'visible',
      zIndex: isExpanded ? 1000 : 'auto'
    }}>
      {/* Toggle CTA - Top Center */}
      <div style={{
        position: isExpanded ? 'fixed' : 'absolute',
        top: isExpanded ? '44px' : '-16px',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: isExpanded ? 1001 : 101
      }}>
        <button
          onClick={toggleExpanded}
          style={{
            height: '32px',
            padding: '0 16px',
            border: '1px solid #242C3A',
            backgroundColor: '#141821',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            color: '#8F9BB0',
            transition: 'all 200ms ease',
            fontSize: '12px',
            fontFamily: 'Albert Sans, sans-serif',
            fontWeight: 500,
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FFFFFF'
            e.currentTarget.style.backgroundColor = '#39D0FF15'
            e.currentTarget.style.borderColor = '#39D0FF'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(57, 208, 255, 0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8F9BB0'
            e.currentTarget.style.backgroundColor = '#141821'
            e.currentTarget.style.borderColor = '#242C3A'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {isExpanded ? (
            <>
              <ChevronDown size={14} />
              <span>Back to Overview</span>
            </>
          ) : (
            <>
              <BookOpen size={14} />
              <span>Explore Data Stories</span>
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
