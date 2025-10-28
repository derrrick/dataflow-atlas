'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { Play, Pause, SkipBack, SkipForward, Clock, CircleArrowLeft } from 'lucide-react'

type Props = {
  onChange: (t0: number, t1: number) => void
  windowMinutes?: number // default 1440 (24h)
  tick?: number // ms between playback steps
  onExpandChange?: (isExpanded: boolean) => void
}

export default function TimeScrubber({ onChange, windowMinutes = 1440, tick = 300, onExpandChange }: Props) {
  const [end, setEnd] = useState<number>(() => Date.now() - windowMinutes * 60_000)
  const [playing, setPlaying] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const raf = useRef<number | undefined>()

  useEffect(() => {
    onExpandChange?.(isExpanded)
  }, [isExpanded, onExpandChange])

  const start = useMemo(() => end - windowMinutes * 60_000, [end, windowMinutes])

  useEffect(() => {
    onChange(start, end)
  }, [start, end, onChange])

  useEffect(() => {
    if (!playing) return
    const step = () => {
      setEnd(t => {
        const next = t + tick
        // Stop at current time
        if (next > Date.now()) {
          setPlaying(false)
          return Date.now()
        }
        return next
      })
      raf.current = requestAnimationFrame(step)
    }
    raf.current = requestAnimationFrame(step)
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current)
    }
  }, [playing, tick])

  // Keyboard controls
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault()
        const isAtPresent = end >= Date.now() - 5000
        // Only allow pause if playing, or play if not at present
        if (playing || !isAtPresent) {
          setPlaying(p => !p)
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault()
        setEnd(t => Math.max(start, t - 60_000 * 60)) // Jump back 1 hour
      } else if (e.code === 'ArrowRight') {
        e.preventDefault()
        setEnd(t => Math.min(Date.now(), t + 60_000 * 60)) // Jump forward 1 hour
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [start, end, playing])

  const jumpBackward = () => {
    setEnd(t => Math.max(start, t - 60_000 * 60)) // 1 hour
  }

  const jumpForward = () => {
    setEnd(t => Math.min(Date.now(), t + 60_000 * 60)) // 1 hour
  }

  const resetToNow = () => {
    setEnd(Date.now())
    setPlaying(false)
  }

  const rewindToStart = () => {
    setEnd(Date.now() - windowMinutes * 60_000)
    setPlaying(false)
  }

  const isAtPresent = end >= Date.now() - 5000 // Within 5 seconds of now

  const formatTime = (ms: number) => {
    return new Date(ms).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const progressPercent = ((end - (Date.now() - windowMinutes * 60_000)) / (windowMinutes * 60_000)) * 100

  // Collapsed state - just the clock icon
  if (!isExpanded) {
    return (
      <button
        onClick={() => setIsExpanded(true)}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.8)'
          e.currentTarget.style.borderColor = '#39D0FF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = 'rgba(10, 15, 22, 0.5)'
          e.currentTarget.style.borderColor = '#242C3A'
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'rgba(10, 15, 22, 0.5)',
          backdropFilter: 'blur(12px)',
          border: '1px solid #242C3A',
          borderRadius: '100px',
          height: '60px',
          width: '60px',
          cursor: 'pointer',
          transition: 'all 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          color: '#8F9BB0'
        }}
        title="Open time scrubber"
      >
        <Clock size={20} />
      </button>
    )
  }

  // Expanded state - full scrubber
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        backgroundColor: 'rgba(10, 15, 22, 0.5)',
        backdropFilter: 'blur(12px)',
        border: '1px solid #242C3A',
        borderRadius: '100px',
        padding: '0 24px 0 20px',
        position: 'relative',
        overflow: 'hidden',
        height: '60px',
        width: '540px',
        boxSizing: 'border-box',
        transition: 'all 400ms cubic-bezier(0.25, 0.1, 0.25, 1)'
      }}
    >
      {/* Collapse Icon */}
      <button
        onClick={() => setIsExpanded(false)}
        onMouseEnter={(e) => {
          e.currentTarget.style.color = '#FFFFFF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.color = '#8F9BB0'
        }}
        style={{
          background: 'transparent',
          border: 'none',
          color: '#8F9BB0',
          cursor: 'pointer',
          padding: '0',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          flexShrink: 0,
          width: '20px',
          height: '20px'
        }}
        title="Collapse time scrubber"
      >
        <CircleArrowLeft size={20} />
      </button>

      {/* Playback controls group */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        flexShrink: 0
      }}>
        {/* Skip backward */}
        <button
          onClick={jumpBackward}
          disabled={end <= start + 60_000}
          onMouseEnter={(e) => {
            if (end > start + 60_000) e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = end <= start + 60_000 ? '#5E6A81' : '#8F9BB0'
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: end <= start + 60_000 ? '#5E6A81' : '#8F9BB0',
            cursor: end <= start + 60_000 ? 'not-allowed' : 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
          title="Jump back 1 hour (←)"
        >
          <SkipBack size={16} />
        </button>

        {/* Play/Pause */}
        <button
          onClick={() => {
            // Only allow pause if playing, or play if not at present
            if (playing || !isAtPresent) {
              setPlaying(p => !p)
            }
          }}
          disabled={!playing && isAtPresent}
          onMouseEnter={(e) => {
            if (!(!playing && isAtPresent)) {
              e.currentTarget.style.backgroundColor = playing ? 'rgba(255, 59, 48, 0.08)' : 'rgba(57, 208, 255, 0.08)'
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.backgroundColor = playing ? 'rgba(255, 59, 48, 0.05)' : (!playing && isAtPresent) ? 'rgba(94, 106, 129, 0.05)' : 'rgba(57, 208, 255, 0.05)'
          }}
          style={{
            backgroundColor: playing ? 'rgba(255, 59, 48, 0.05)' : (!playing && isAtPresent) ? 'rgba(94, 106, 129, 0.05)' : 'rgba(57, 208, 255, 0.05)',
            border: `1px solid ${playing ? '#FF3B30' : (!playing && isAtPresent) ? '#5E6A81' : '#39D0FF'}`,
            color: playing ? '#FF3B30' : (!playing && isAtPresent) ? '#5E6A81' : '#39D0FF',
            cursor: (!playing && isAtPresent) ? 'not-allowed' : 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100px',
            transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            width: '28px',
            height: '28px'
          }}
          title={(!playing && isAtPresent) ? "Already at present time" : "Play/Pause (Space)"}
        >
          {playing ? <Pause size={12} /> : <Play size={12} />}
        </button>

        {/* Skip forward */}
        <button
          onClick={jumpForward}
          disabled={isAtPresent}
          onMouseEnter={(e) => {
            if (!isAtPresent) e.currentTarget.style.color = '#FFFFFF'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = isAtPresent ? '#5E6A81' : '#8F9BB0'
          }}
          style={{
            background: 'transparent',
            border: 'none',
            color: isAtPresent ? '#5E6A81' : '#8F9BB0',
            cursor: isAtPresent ? 'not-allowed' : 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
          }}
          title="Jump forward 1 hour (→)"
        >
          <SkipForward size={16} />
        </button>
      </div>

      {/* Center group: Time display with dividers */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '16px',
        minWidth: 0
      }}>
        {/* Left Divider */}
        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: '#242C3A',
          flexShrink: 0
        }} />

        {/* Time range display */}
        <div
          style={{
            fontSize: '11px',
            color: '#8F9BB0',
            letterSpacing: '0.3px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontFamily: 'Geist Mono, monospace',
            flexShrink: 0,
            whiteSpace: 'nowrap',
            padding: '0 16px'
          }}
        >
          <span style={{ color: '#5E6A81' }}>{formatTime(start)}</span>
          <span style={{ color: '#39D0FF' }}>→</span>
          <span style={{ color: '#FFFFFF', fontWeight: 500 }}>{formatTime(end)}</span>
        </div>

        {/* Right Divider */}
        <div style={{
          width: '1px',
          height: '24px',
          backgroundColor: '#242C3A',
          flexShrink: 0
        }} />
      </div>

      {/* Now/Rewind button */}
      <button
        onClick={isAtPresent ? rewindToStart : resetToNow}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#39D0FF'
          e.currentTarget.style.backgroundColor = 'rgba(57, 208, 255, 0.05)'
          e.currentTarget.style.color = '#FFFFFF'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '#242C3A'
          e.currentTarget.style.backgroundColor = 'transparent'
          e.currentTarget.style.color = '#8F9BB0'
        }}
        style={{
          background: 'transparent',
          border: '1px solid #242C3A',
          color: '#8F9BB0',
          cursor: 'pointer',
          padding: '8px 16px',
          borderRadius: '100px',
          fontSize: '10px',
          fontWeight: 600,
          letterSpacing: '0.5px',
          textTransform: 'uppercase',
          transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
          fontFamily: 'Geist Mono, monospace',
          flexShrink: 0
        }}
        title={isAtPresent ? "Rewind to start" : "Jump to now"}
      >
        {isAtPresent ? 'Rewind' : 'Now'}
      </button>

      {/* Progress indicator - subtle bottom bar */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'rgba(36, 44, 58, 0.5)',
          borderRadius: '0 0 100px 100px',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            bottom: 0,
            width: `${Math.max(0, Math.min(100, progressPercent))}%`,
            background: '#39D0FF',
            transition: playing ? 'none' : 'width 300ms ease-out'
          }}
        />
      </div>
    </div>
  )
}
