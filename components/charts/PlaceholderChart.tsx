'use client'

interface PlaceholderChartProps {
  height?: number
}

export function PlaceholderChart({ height = 200 }: PlaceholderChartProps) {
  return (
    <div
      className="w-full flex items-center justify-center bg-white/[0.02] border border-border/50 "
      style={{ height: `${height}px` }}
    >
      <div className="text-center">
        <div className="text-xs text-muted font-mono">Chart Preview</div>
        <div className="text-[10px] text-muted/50 mt-1">Coming soon</div>
      </div>
    </div>
  )
}
