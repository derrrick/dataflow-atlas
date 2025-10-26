'use client'

import { useState, ReactNode } from 'react'
import { ChevronUp, ChevronDown } from 'lucide-react'

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
      {/* Toggle Arrow - Top Center */}
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
            width: '32px',
            height: '32px',
            border: '1px solid #242C3A',
            backgroundColor: '#141821',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#8F9BB0',
            transition: 'all 200ms ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#C6CFDA'
            e.currentTarget.style.backgroundColor = '#1A202E'
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.3)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = '#8F9BB0'
            e.currentTarget.style.backgroundColor = '#141821'
            e.currentTarget.style.boxShadow = 'none'
          }}
        >
          {isExpanded ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
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
