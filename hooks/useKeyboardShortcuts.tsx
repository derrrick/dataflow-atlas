import { useEffect } from 'react'

interface KeyboardShortcut {
  key: string
  ctrlKey?: boolean
  metaKey?: boolean
  shiftKey?: boolean
  altKey?: boolean
  action: () => void
  description: string
}

interface UseKeyboardShortcutsOptions {
  enabled?: boolean
  preventDefault?: boolean
}

/**
 * Custom hook for keyboard shortcuts
 *
 * @example
 * useKeyboardShortcuts([
 *   { key: 'Escape', action: closeModal, description: 'Close modal' },
 *   { key: 'f', ctrlKey: true, action: focusSearch, description: 'Focus search' },
 * ])
 */
export function useKeyboardShortcuts(
  shortcuts: KeyboardShortcut[],
  options: UseKeyboardShortcutsOptions = {}
) {
  const { enabled = true, preventDefault = true } = options

  useEffect(() => {
    if (!enabled) return

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement

      // Don't trigger shortcuts when typing in inputs
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.contentEditable === 'true'
      ) {
        return
      }

      for (const shortcut of shortcuts) {
        const keyMatch = event.key === shortcut.key
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey
        const altMatch = shortcut.altKey ? event.altKey : !event.altKey

        // Check if modifier keys that aren't specified are not pressed
        const noExtraModifiers =
          (!shortcut.ctrlKey && !shortcut.metaKey) ||
          (shortcut.ctrlKey && event.ctrlKey) ||
          (shortcut.metaKey && event.metaKey)

        if (
          keyMatch &&
          ctrlMatch &&
          metaMatch &&
          shiftMatch &&
          altMatch &&
          noExtraModifiers
        ) {
          if (preventDefault) {
            event.preventDefault()
          }
          shortcut.action()
          break
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [shortcuts, enabled, preventDefault])
}

/**
 * Global keyboard shortcuts for the dashboard
 */
export function useDashboardKeyboardShortcuts({
  onExpandPanel,
  onCollapsePanel,
  onFocusFilter,
  onToggleHelp,
  enabled = true
}: {
  onExpandPanel?: () => void
  onCollapsePanel?: () => void
  onFocusFilter?: () => void
  onToggleHelp?: () => void
  enabled?: boolean
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Escape',
      action: () => onCollapsePanel?.(),
      description: 'Close modal / collapse panel'
    },
    {
      key: ' ',
      action: () => onExpandPanel?.(),
      description: 'Expand panel to next state'
    },
    {
      key: 'f',
      ctrlKey: true,
      action: () => onFocusFilter?.(),
      description: 'Focus filter search'
    },
    {
      key: 'f',
      metaKey: true,
      action: () => onFocusFilter?.(),
      description: 'Focus filter search (Mac)'
    },
    {
      key: '?',
      shiftKey: true,
      action: () => onToggleHelp?.(),
      description: 'Show keyboard shortcuts'
    }
  ]

  useKeyboardShortcuts(shortcuts.filter(s => s.action), { enabled })
}

/**
 * Chart modal keyboard shortcuts
 */
export function useChartModalKeyboardShortcuts({
  onClose,
  onNavigateNext,
  onNavigatePrev,
  onExport,
  enabled = true
}: {
  onClose?: () => void
  onNavigateNext?: () => void
  onNavigatePrev?: () => void
  onExport?: (format: 'svg' | 'png' | 'csv') => void
  enabled?: boolean
}) {
  const shortcuts: KeyboardShortcut[] = [
    {
      key: 'Escape',
      action: () => onClose?.(),
      description: 'Close modal'
    },
    {
      key: 'ArrowRight',
      action: () => onNavigateNext?.(),
      description: 'Navigate to next chart'
    },
    {
      key: 'ArrowLeft',
      action: () => onNavigatePrev?.(),
      description: 'Navigate to previous chart'
    },
    {
      key: 's',
      ctrlKey: true,
      action: () => onExport?.('svg'),
      description: 'Export as SVG'
    },
    {
      key: 's',
      metaKey: true,
      action: () => onExport?.('svg'),
      description: 'Export as SVG (Mac)'
    },
    {
      key: 'e',
      ctrlKey: true,
      action: () => onExport?.('png'),
      description: 'Export as PNG'
    },
    {
      key: 'e',
      metaKey: true,
      action: () => onExport?.('png'),
      description: 'Export as PNG (Mac)'
    }
  ]

  useKeyboardShortcuts(shortcuts.filter(s => s.action), { enabled })
}

/**
 * Display keyboard shortcuts help overlay
 */
export function KeyboardShortcutsHelp({ shortcuts }: { shortcuts: KeyboardShortcut[] }) {
  const formatKey = (shortcut: KeyboardShortcut): string => {
    const keys: string[] = []

    if (shortcut.ctrlKey) keys.push('Ctrl')
    if (shortcut.metaKey) keys.push('⌘')
    if (shortcut.altKey) keys.push('Alt')
    if (shortcut.shiftKey) keys.push('Shift')

    keys.push(shortcut.key === ' ' ? 'Space' : shortcut.key)

    return keys.join(' + ')
  }

  return (
    <div style={{
      backgroundColor: '#141821',
      border: '1px solid #242C3A',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '500px'
    }}>
      <h3 style={{
        fontSize: '16px',
        color: '#C6CFDA',
        fontWeight: 500,
        marginBottom: '16px',
        fontFamily: 'Albert Sans, sans-serif'
      }}>
        Keyboard Shortcuts
      </h3>

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {shortcuts.map((shortcut, index) => (
          <div
            key={index}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '8px 0',
              borderBottom: index < shortcuts.length - 1 ? '1px solid #242C3A' : 'none'
            }}
          >
            <span style={{
              fontSize: '13px',
              color: '#8F9BB0',
              fontFamily: 'Albert Sans, sans-serif'
            }}>
              {shortcut.description}
            </span>
            <kbd style={{
              fontSize: '12px',
              color: '#C6CFDA',
              backgroundColor: '#242C3A',
              padding: '4px 8px',
              borderRadius: '4px',
              fontFamily: 'Geist Mono, monospace',
              border: '1px solid #3A4559'
            }}>
              {formatKey(shortcut)}
            </kbd>
          </div>
        ))}
      </div>
    </div>
  )
}
