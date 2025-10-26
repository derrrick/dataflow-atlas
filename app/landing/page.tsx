'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function LandingPage() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Mock email capture - in production, this would POST to an API
    console.log('Email captured:', email)
    setSubmitted(true)
    setTimeout(() => {
      setSubmitted(false)
      setEmail('')
    }, 3000)
  }

  return (
    <div className="min-h-screen bg-fa-gray-1 text-fa-gray-7">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-fa-gray-0 via-fa-gray-1 to-fa-gray-2" />

        {/* Ambient globe animation placeholder */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96  border border-fa-cyan/20 animate-pulse" />
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80  border border-fa-cyan/30 animate-pulse" style={{ animationDelay: '0.5s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16  bg-fa-cyan/10 border-2 border-fa-cyan/30 flex items-center justify-center">
              <div className="w-10 h-10  border-3 border-fa-cyan opacity-70" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-light text-fa-white mb-6 tracking-tight">
            Flow Atlas
          </h1>

          <p className="text-2xl md:text-3xl text-fa-cyan mb-4 font-light">
            The planet, in motion.
          </p>

          <p className="text-lg text-fa-gray-6 max-w-2xl mx-auto mb-12 leading-relaxed">
            For researchers, journalists, and practitioners observing infrastructure and risk, Flow Atlas presents real-time environmental and network data through a clear, disciplined interface.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/" className="btn btn-lg bg-fa-cyan text-fa-gray-1 hover:bg-fa-cyan/90 border-0 font-normal">
              View live map
            </Link>
            <button className="btn btn-lg btn-outline border-fa-gray-5 text-fa-gray-7 hover:bg-fa-gray-3 hover:border-fa-cyan font-normal">
              Explore data
            </button>
          </div>

          {/* Email Capture */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex gap-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email for early access"
                className="input flex-1 bg-fa-gray-2 border-fa-gray-4 text-fa-gray-7 focus:border-fa-cyan"
                required
              />
              <button
                type="submit"
                className="btn bg-fa-gray-3 border-fa-gray-4 text-fa-gray-7 hover:bg-fa-gray-4 hover:border-fa-cyan"
              >
                Join Waitlist
              </button>
            </div>
            {submitted && (
              <p className="text-fa-teal text-sm mt-2">Thanks! We&apos;ll be in touch soon.</p>
            )}
          </form>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-fa-gray-2">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-light text-fa-white text-center mb-16">
            Real-time understanding
          </h2>

          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-12 h-12 bg-fa-cyan/10  flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="text-xl font-normal text-fa-white mb-2">Live data</h3>
              <p className="text-fa-gray-6">
                Measured hazards, earthquakes, network outages, and latency from verified sources.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-fa-amber/10  flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-xl font-normal text-fa-white mb-2">Empirical clarity</h3>
              <p className="text-fa-gray-6">
                Structured analytics that maximize information and minimize noise.
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-fa-indigo/10  flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-normal text-fa-white mb-2">Global context</h3>
              <p className="text-fa-gray-6">
                Cross-domain visibility of energy, transport, and climate systems.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Fake Door */}
      <section className="py-24 bg-fa-gray-1">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-fa-gray-8 text-center mb-4">
            Plans for every need
          </h2>
          <p className="text-fa-gray-6 text-center mb-16">
            From ambient viewers to enterprise teams
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-fa-gray-2 border border-fa-gray-3  p-8">
              <h3 className="text-2xl font-semibold text-fa-gray-8 mb-2">Free</h3>
              <p className="text-fa-gray-6 mb-6">For curious explorers</p>
              <div className="text-3xl font-bold text-fa-gray-8 mb-6">$0</div>
              <ul className="space-y-3 mb-8 text-fa-gray-6">
                <li>✓ Hazards & earthquakes</li>
                <li>✓ Basic topo lens</li>
                <li>✓ Last 24h data</li>
                <li>✓ Attribution required</li>
              </ul>
              <button className="btn btn-block bg-fa-gray-3 border-fa-gray-4 text-fa-gray-7 hover:bg-fa-gray-4">
                Start Free
              </button>
            </div>

            {/* Plus */}
            <div className="bg-fa-gray-2 border-2 border-fa-cyan  p-8 relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-fa-cyan text-fa-gray-1 px-3 py-1  text-xs font-semibold">
                POPULAR
              </div>
              <h3 className="text-2xl font-semibold text-fa-gray-8 mb-2">Plus</h3>
              <p className="text-fa-gray-6 mb-6">For analysts & pros</p>
              <div className="text-3xl font-bold text-fa-gray-8 mb-6">$19<span className="text-base font-normal text-fa-gray-6">/mo</span></div>
              <ul className="space-y-3 mb-8 text-fa-gray-6">
                <li>✓ All Free features</li>
                <li>✓ Outages & latency layers</li>
                <li>✓ 30-day playback</li>
                <li>✓ PNG export</li>
                <li>✓ Light watermark</li>
              </ul>
              <button className="btn btn-block bg-fa-cyan text-fa-gray-1 hover:bg-fa-cyan/90 border-0">
                Join Waitlist
              </button>
            </div>

            {/* Pro */}
            <div className="bg-fa-gray-2 border border-fa-gray-3  p-8">
              <h3 className="text-2xl font-semibold text-fa-gray-8 mb-2">Pro</h3>
              <p className="text-fa-gray-6 mb-6">For teams & media</p>
              <div className="text-3xl font-bold text-fa-gray-8 mb-6">$149<span className="text-base font-normal text-fa-gray-6">/mo</span></div>
              <ul className="space-y-3 mb-8 text-fa-gray-6">
                <li>✓ All Plus features</li>
                <li>✓ Energy & exposure layers</li>
                <li>✓ CSV/SVG export</li>
                <li>✓ Ad-free embeds</li>
                <li>✓ Custom themes</li>
              </ul>
              <button className="btn btn-block bg-fa-gray-3 border-fa-gray-4 text-fa-gray-7 hover:bg-fa-gray-4">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-fa-gray-2 border-t border-fa-gray-3">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-sm text-fa-gray-6">
              © 2025 Flow Atlas. Built on open data.
            </div>
            <div className="flex gap-6 text-sm text-fa-gray-6">
              <Link href="/about" className="hover:text-fa-cyan transition-colors">About</Link>
              <Link href="/methods" className="hover:text-fa-cyan transition-colors">Methods</Link>
              <Link href="/api" className="hover:text-fa-cyan transition-colors">API</Link>
              <Link href="/privacy" className="hover:text-fa-cyan transition-colors">Privacy</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
