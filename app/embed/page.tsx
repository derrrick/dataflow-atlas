'use client'

import { Suspense } from 'react'
import dynamic from 'next/dynamic'

const Globe = dynamic(() => import('@/components/Globe'), {
  ssr: false,
  loading: () => <div className="w-full h-full loading-shimmer" />
})

export default function EmbedPage() {
  return (
    <div className="w-screen h-screen overflow-hidden bg-fa-gray-1 flex flex-col">
      {/* Embedded Globe */}
      <div className="flex-1 relative">
        <Suspense fallback={<div className="w-full h-full loading-shimmer" />}>
          <Globe />
        </Suspense>
      </div>

      {/* Embed Footer Bar */}
      <div className="h-12 bg-fa-gray-2/95 backdrop-blur-sm border-t border-fa-gray-3 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-6 h-6  bg-fa-cyan/10 border border-fa-cyan/30 flex items-center justify-center">
            <div className="w-4 h-4  border-2 border-fa-cyan opacity-70" />
          </div>
          <span className="text-xs text-fa-gray-6">Flow Atlas</span>
          <span className="text-xs text-fa-gray-5">·</span>
          <span className="text-xs text-fa-gray-5">Data: USGS, NOAA, Cloudflare, RIPE</span>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs text-fa-cyan hover:text-fa-cyan/80 transition-colors"
        >
          Open Full Map →
        </a>
      </div>
    </div>
  )
}
