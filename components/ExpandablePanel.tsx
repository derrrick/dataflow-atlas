'use client'

import { ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'

interface ExpandablePanelProps {
  collapsedContent: ReactNode
  expandedContent: ReactNode
  isExpanded: boolean
  onClose: () => void
}

export default function ExpandablePanel({ collapsedContent, expandedContent, isExpanded, onClose }: ExpandablePanelProps) {

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
      {/* Back to Map button - only visible when expanded */}
      {isExpanded && (
        <div style={{
          position: 'fixed',
          top: '44px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 1001
        }}>
          <button
            onClick={onClose}
            style={{
              padding: '14px 28px',
              border: '1px solid #242C3A',
              backgroundColor: '#0A0F16',
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
              e.currentTarget.style.backgroundColor = '#0A0F16'
              e.currentTarget.style.borderColor = '#242C3A'
            }}
          >
            <ChevronDown size={14} />
            <span>Back to Map</span>
          </button>
        </div>
      )}

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
