'use client'

import { useState } from 'react'
import Image from 'next/image'

type ModalType = 'about' | 'methods' | 'api' | 'access' | null

export default function Header() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)
  const [showBetaForm, setShowBetaForm] = useState(false)

  const openModal = (modal: ModalType) => {
    setActiveModal(modal)
    setShowBetaForm(false) // Reset when opening modal
  }
  const closeModal = () => {
    setActiveModal(null)
    setShowBetaForm(false)
  }

  return (
    <>
    <header style={{
      width: '100%',
      backgroundColor: '#0A0F16',
      borderBottom: '1px solid #242C3A',
      position: 'sticky',
      top: 0,
      zIndex: 50
    }}>
      <div style={{
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/dataflowatlas3.svg"
            alt="Atlasflow"
            width={150}
            height={26}
            style={{ height: 'auto' }}
            priority
          />
        </div>

        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <button
            onClick={() => openModal('about')}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C6CFDA'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8F9BB0'}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Albert Sans, sans-serif',
              color: '#8F9BB0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}>
            About
          </button>
          <button
            onClick={() => openModal('methods')}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C6CFDA'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8F9BB0'}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Albert Sans, sans-serif',
              color: '#8F9BB0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}>
            Methods
          </button>
          <button
            onClick={() => openModal('api')}
            onMouseEnter={(e) => e.currentTarget.style.color = '#C6CFDA'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#8F9BB0'}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Albert Sans, sans-serif',
              color: '#8F9BB0',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              transition: 'color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}>
            API
          </button>
          <button
            onClick={() => openModal('access')}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 1)'
              e.currentTarget.style.boxShadow = '0 0 24px rgba(8, 13, 18, 0.6), 0 4px 12px rgba(8, 13, 18, 0.3)'
              e.currentTarget.style.transform = 'translateY(-1px)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.2)'
              e.currentTarget.style.boxShadow = 'none'
              e.currentTarget.style.transform = 'translateY(0)'
            }}
            style={{
              padding: '10px 24px',
              fontSize: '14px',
              fontWeight: 700,
              fontFamily: 'Albert Sans, sans-serif',
              color: '#FFFFFF',
              backgroundColor: '#0A0F16',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: '100px',
              cursor: 'pointer',
              transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
              marginLeft: '24px'
            }}>
            Get custom alerts
          </button>
        </nav>
      </div>
    </header>

    {/* Side Blade Modals (About, Methods, API) */}
    {activeModal && activeModal !== 'access' && (
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'flex-end',
          zIndex: 200,
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#0A0F16',
            width: '700px',
            height: '100vh',
            overflowY: 'auto',
            fontFamily: 'Albert Sans, sans-serif',
            animation: 'slideInRight 300ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            display: 'flex',
            flexDirection: 'column',
          }}>
          <div style={{
            padding: '32px',
            borderBottom: '1px solid #242C3A',
            backgroundColor: '#080D12',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <div>
              <div style={{
                fontSize: '10px',
                fontFamily: 'Geist Mono, monospace',
                color: '#39D0FF',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                {activeModal === 'about' && '01'}
                {activeModal === 'methods' && '02'}
                {activeModal === 'api' && '03'}
                {activeModal === 'access' && '04'}
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 400,
                fontFamily: 'Albert Sans, sans-serif',
                color: '#FFFFFF',
                margin: 0,
                lineHeight: '1.2'
              }}>
                {activeModal === 'about' && 'About'}
                {activeModal === 'methods' && 'Methods'}
                {activeModal === 'api' && 'API'}
                {activeModal === 'access' && 'Custom Alerts'}
              </h2>
            </div>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                color: '#C6CFDA',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF3B3B'
                e.currentTarget.style.backgroundColor = '#FF3B3B'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#242C3A'
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#C6CFDA'
              }}
            >
              ×
            </button>
          </div>

          <div style={{
            flex: 1,
            padding: '64px',
            color: '#C6CFDA',
            fontSize: '14px',
            lineHeight: '1.6',
            overflowY: 'auto'
          }}>
            {activeModal === 'about' && (
              <>
                {/* Lede */}
                <p style={{
                  marginBottom: '48px',
                  fontSize: '20px',
                  lineHeight: '1.5',
                  color: '#FFFFFF',
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}>
                  Dataflow Atlas is a real-time visualization platform tracking global environmental events through trusted open data sources.
                </p>

                {/* Body Copy */}
                <p style={{
                  marginBottom: '32px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#C6CFDA'
                }}>
                  Built for researchers, journalists, emergency responders, and data analysts who need immediate access to critical environmental intelligence. Our platform integrates live data from USGS, NASA, and EPA into a unified, interactive interface.
                </p>

                {/* Pull Quote */}
                <div style={{
                  margin: '64px 0',
                  padding: '0 0 0 32px',
                  borderLeft: '4px solid #39D0FF'
                }}>
                  <p style={{
                    margin: 0,
                    fontSize: '28px',
                    lineHeight: '1.3',
                    color: '#FFFFFF',
                    fontWeight: 300,
                    fontStyle: 'italic',
                    letterSpacing: '-0.02em'
                  }}>
                    The planet, in motion—visualized with precision.
                  </p>
                </div>

                {/* Section Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #242C3A 50%, transparent)',
                  margin: '64px 0 48px'
                }} />

                {/* Subhead */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '32px',
                  letterSpacing: '-0.01em'
                }}>
                  Data Sources
                </h3>

                {/* Source List - More Editorial */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px'
                }}>
                  {[
                    { name: 'USGS Earthquake Hazards Program', detail: 'Magnitude ≥4.5, updated every 15 minutes', color: '#FF3B3B' },
                    { name: 'NASA FIRMS Active Fire Data', detail: 'VIIRS/MODIS satellites, 3-hour latency', color: '#FFB341' },
                    { name: 'EPA AirNow Air Quality Index', detail: '2,000+ monitoring stations, hourly updates', color: '#39D0FF' }
                  ].map((source, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: '16px',
                        color: '#FFFFFF',
                        marginBottom: '8px',
                        fontWeight: 500
                      }}>
                        {source.name}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#8F9BB0',
                        lineHeight: '1.6'
                      }}>
                        {source.detail}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Design Philosophy Callout */}
                <div style={{
                  marginTop: '64px',
                  padding: '32px',
                  backgroundColor: '#080D12',
                  border: '1px solid #242C3A'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#8F9BB0',
                    lineHeight: '1.7'
                  }}>
                    Designed with <strong style={{ color: '#FFFFFF' }}>Nate Silver's analytical principles</strong> and <strong style={{ color: '#FFFFFF' }}>Edward Tufte's data visualization theory</strong>: clarity over decoration, trust signals embedded throughout, and narrative-driven exploration.
                  </div>
                </div>
              </>
            )}

            {activeModal === 'methods' && (
              <>
                {/* Lede */}
                <p style={{
                  marginBottom: '48px',
                  fontSize: '20px',
                  lineHeight: '1.5',
                  color: '#FFFFFF',
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}>
                  Every data point on Dataflow Atlas comes from authoritative government sources, updated in near-real-time.
                </p>

                {/* Data Sources - Editorial List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '48px',
                  marginBottom: '64px'
                }}>
                  {[
                    {
                      type: 'Earthquakes',
                      source: 'USGS Earthquake Hazards Program',
                      narrative: 'Seismic events with magnitude 4.5 or greater are ingested every 15 minutes from the U.S. Geological Survey\'s authoritative earthquake catalog.',
                      color: '#FF3B3B'
                    },
                    {
                      type: 'Wildfires',
                      source: 'NASA FIRMS Active Fire Data',
                      narrative: 'Thermal anomalies detected by VIIRS and MODIS satellites aboard NASA and NOAA spacecraft, with approximately 3-hour latency from satellite overpass to data availability.',
                      color: '#FFB341'
                    },
                    {
                      type: 'Air Quality',
                      source: 'EPA AirNow',
                      narrative: 'Real-time Air Quality Index measurements from over 2,000 monitoring stations nationwide, updated hourly by the Environmental Protection Agency.',
                      color: '#39D0FF'
                    }
                  ].map((item, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: '11px',
                        fontFamily: 'Geist Mono, monospace',
                        color: item.color,
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        marginBottom: '12px'
                      }}>
                        {item.type}
                      </div>
                      <h4 style={{
                        fontSize: '18px',
                        color: '#FFFFFF',
                        marginBottom: '16px',
                        fontWeight: 400,
                        letterSpacing: '-0.01em'
                      }}>
                        {item.source}
                      </h4>
                      <p style={{
                        fontSize: '14px',
                        color: '#C6CFDA',
                        lineHeight: '1.7',
                        margin: 0
                      }}>
                        {item.narrative}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Section Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #242C3A 50%, transparent)',
                  margin: '64px 0 48px'
                }} />

                {/* Philosophy Section */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '32px',
                  letterSpacing: '-0.01em'
                }}>
                  Design Philosophy
                </h3>

                <p style={{
                  marginBottom: '32px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#C6CFDA'
                }}>
                  Our visualization approach draws from <strong style={{ color: '#FFFFFF' }}>Nate Silver's analytical rigor</strong> and <strong style={{ color: '#FFFFFF' }}>Edward Tufte's data-ink principles</strong>—every pixel serves comprehension.
                </p>

                {/* Principles - Simple List */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '24px'
                }}>
                  {[
                    { title: 'Maximize Signal', desc: 'Data-ink ratio prioritized. Chart decoration eliminated.' },
                    { title: 'Trust Signals', desc: 'Sources, timestamps, and confidence levels embedded throughout.' },
                    { title: 'Interactive Context', desc: 'Tooltips reveal granular detail without cluttering the primary view.' },
                    { title: 'Narrative First', desc: 'Filter design optimized for storytelling, not just querying.' },
                    { title: 'Precision Rendering', desc: 'D3.js ensures mathematically accurate, performant visualizations.' }
                  ].map((principle, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: '15px',
                        color: '#FFFFFF',
                        marginBottom: '6px',
                        fontWeight: 500
                      }}>
                        {principle.title}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#8F9BB0',
                        lineHeight: '1.6'
                      }}>
                        {principle.desc}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {activeModal === 'api' && (
              <>
                {/* Lede */}
                <p style={{
                  marginBottom: '48px',
                  fontSize: '20px',
                  lineHeight: '1.5',
                  color: '#FFFFFF',
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}>
                  Access the same environmental data powering Dataflow Atlas through our REST API.
                </p>

                <p style={{
                  marginBottom: '64px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#C6CFDA'
                }}>
                  All endpoints return unified JSON structures optimized for analysis and visualization. Public read access is available now—no authentication required for queries.
                </p>

                {/* Endpoints */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '32px',
                  letterSpacing: '-0.01em'
                }}>
                  Available Endpoints
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  marginBottom: '64px'
                }}>
                  {[
                    { endpoint: '/api/ingest/earthquakes', desc: 'USGS seismic events, magnitude ≥4.5' },
                    { endpoint: '/api/ingest/wildfires', desc: 'NASA FIRMS thermal anomalies' },
                    { endpoint: '/api/ingest/air-quality', desc: 'EPA AirNow AQI measurements' },
                    { endpoint: '/api/events', desc: 'Unified event stream across all sources' }
                  ].map((api, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: '14px',
                        fontFamily: 'Geist Mono, monospace',
                        color: '#39D0FF',
                        marginBottom: '8px',
                        fontWeight: 500
                      }}>
                        GET {api.endpoint}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#8F9BB0',
                        lineHeight: '1.6'
                      }}>
                        {api.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Parameters */}
                <div style={{
                  padding: '32px',
                  backgroundColor: '#080D12',
                  border: '1px solid #242C3A',
                  marginBottom: '64px'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Query Parameters
                  </div>
                  <div style={{
                    fontSize: '14px',
                    color: '#C6CFDA',
                    fontFamily: 'Geist Mono, monospace',
                    lineHeight: '1.7'
                  }}>
                    ?limit &nbsp;&nbsp; ?days &nbsp;&nbsp; ?source
                  </div>
                </div>

                {/* Status */}
                <div style={{
                  padding: '32px',
                  backgroundColor: '#080D12',
                  border: '1px solid #242C3A'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#8F9BB0',
                    lineHeight: '1.7'
                  }}>
                    <strong style={{ color: '#FFFFFF' }}>Current Status:</strong> Public read access available. Write access and authentication coming soon.
                  </div>
                </div>
              </>
            )}

          </div>
        </div>
      </div>
    )}

    {/* Full-Page Custom Alerts Modal (Slides up from bottom) */}
    {activeModal === 'access' && (
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.9)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          zIndex: 200,
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#0A0F16',
            width: '100vw',
            height: '100vh',
            fontFamily: 'Albert Sans, sans-serif',
            animation: 'slideInUp 400ms cubic-bezier(0.25, 0.1, 0.25, 1)',
            display: 'flex',
            flexDirection: 'column',
          }}>

          {/* Header - Fixed */}
          <div style={{
            padding: '32px 64px',
            borderBottom: '1px solid #242C3A',
            backgroundColor: '#080D12',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexShrink: 0
          }}>
            <div>
              <div style={{
                fontSize: '10px',
                fontFamily: 'Geist Mono, monospace',
                color: '#39D0FF',
                fontWeight: 600,
                letterSpacing: '0.5px',
                textTransform: 'uppercase',
                marginBottom: '8px'
              }}>
                04
              </div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 400,
                fontFamily: 'Albert Sans, sans-serif',
                color: '#FFFFFF',
                margin: 0,
                lineHeight: '1.2'
              }}>
                Custom Alerts
              </h2>
            </div>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: 'transparent',
                border: '1px solid #242C3A',
                color: '#C6CFDA',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '8px',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#FF3B3B'
                e.currentTarget.style.backgroundColor = '#FF3B3B'
                e.currentTarget.style.color = '#FFFFFF'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#242C3A'
                e.currentTarget.style.backgroundColor = 'transparent'
                e.currentTarget.style.color = '#C6CFDA'
              }}
            >
              ×
            </button>
          </div>

          {/* Content - Scrollable */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div style={{
              padding: '64px',
              maxWidth: '900px',
              width: '100%'
            }}>
            {!showBetaForm ? (
              <>
                {/* Editorial Content + Beta CTA */}
                <p style={{
                  marginBottom: '48px',
                  fontSize: '20px',
                  lineHeight: '1.5',
                  color: '#FFFFFF',
                  fontWeight: 300,
                  letterSpacing: '-0.01em'
                }}>
                  Never miss a critical environmental event. Configure custom alerts to receive real-time notifications when thresholds are crossed.
                </p>

                <p style={{
                  marginBottom: '64px',
                  fontSize: '15px',
                  lineHeight: '1.7',
                  color: '#C6CFDA'
                }}>
                  Whether you're monitoring seismic activity in a specific region, tracking wildfire spread, or staying informed about air quality changes—custom alerts put you in control.
                </p>

                {/* Section Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #242C3A 50%, transparent)',
                  margin: '64px 0 48px'
                }} />

                {/* Capabilities */}
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: 400,
                  color: '#FFFFFF',
                  marginBottom: '32px',
                  letterSpacing: '-0.01em'
                }}>
                  What You Can Monitor
                </h3>

                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '32px',
                  marginBottom: '64px'
                }}>
                  {[
                    {
                      type: 'Seismic Activity',
                      desc: 'Receive alerts when earthquakes exceed magnitude thresholds in specific regions.',
                    },
                    {
                      type: 'Wildfire Spread',
                      desc: 'Track thermal anomalies as they develop, with confidence-level filtering.',
                    },
                    {
                      type: 'Air Quality Changes',
                      desc: 'Monitor AQI levels in your area or nationwide when hazardous conditions emerge.',
                    }
                  ].map((capability, i) => (
                    <div key={i}>
                      <div style={{
                        fontSize: '16px',
                        color: '#FFFFFF',
                        marginBottom: '8px',
                        fontWeight: 500
                      }}>
                        {capability.type}
                      </div>
                      <div style={{
                        fontSize: '13px',
                        color: '#8F9BB0',
                        lineHeight: '1.6'
                      }}>
                        {capability.desc}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Beta Access Card */}
                <div style={{
                  padding: '48px',
                  backgroundColor: '#080D12',
                  border: '1px solid #242C3A',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '13px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#39D0FF',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Beta Access Available
                  </div>
                  <p style={{
                    fontSize: '16px',
                    color: '#FFFFFF',
                    lineHeight: '1.6',
                    maxWidth: '500px',
                    margin: '0 auto 32px'
                  }}>
                    Custom alerts are in active development. Test the beta functionality and help us refine the experience.
                  </p>
                  <button
                    onClick={() => setShowBetaForm(true)}
                    style={{
                      padding: '16px 48px',
                      fontSize: '11px',
                      fontFamily: 'Geist Mono, monospace',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: '#080D12',
                      backgroundColor: '#39D0FF',
                      border: 'none',
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#39D0FF'
                    }}
                  >
                    Try Beta Access
                  </button>
                </div>
              </>
            ) : (
              <>
                {/* Beta Alert Configuration Form */}
                <div style={{
                  marginBottom: '48px'
                }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    marginBottom: '16px',
                    letterSpacing: '-0.01em'
                  }}>
                    Configure Your Alert
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#8F9BB0',
                    lineHeight: '1.6',
                    marginBottom: '48px'
                  }}>
                    Set your monitoring parameters and authentication preferences below.
                  </p>
                </div>

                {/* Event Type Selection */}
                <div style={{ marginBottom: '48px' }}>
                  <div style={{
                    fontSize: '13px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Event Type
                  </div>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {[
                      { type: 'Earthquakes', desc: 'Magnitude ≥ threshold', color: '#FF3B3B' },
                      { type: 'Wildfires', desc: 'Confidence level ≥ threshold', color: '#FFB341' },
                      { type: 'Air Quality', desc: 'AQI ≥ threshold', color: '#39D0FF' }
                    ].map((item, i) => (
                      <div key={i} style={{
                        padding: '20px',
                        backgroundColor: '#080D12',
                        border: '1px solid #242C3A',
                        borderLeft: `3px solid ${item.color}`,
                        cursor: 'pointer',
                        transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#141821'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#080D12'
                      }}
                      >
                        <div style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <div>
                            <div style={{
                              fontSize: '15px',
                              color: '#FFFFFF',
                              marginBottom: '6px',
                              fontWeight: 500
                            }}>
                              {item.type}
                            </div>
                            <div style={{
                              fontSize: '12px',
                              color: '#8F9BB0',
                              fontFamily: 'Geist Mono, monospace'
                            }}>
                              {item.desc}
                            </div>
                          </div>
                          <div style={{
                            width: '20px',
                            height: '20px',
                            border: '2px solid #39D0FF',
                            backgroundColor: 'transparent'
                          }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Threshold Configuration */}
                <div style={{ marginBottom: '48px' }}>
                  <div style={{
                    fontSize: '13px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Threshold Value
                  </div>
                  <input
                    type="text"
                    placeholder="e.g., 5.0 for earthquakes, 300 for AQI"
                    style={{
                      width: '100%',
                      padding: '18px',
                      fontSize: '14px',
                      fontFamily: 'Geist Mono, monospace',
                      color: '#FFFFFF',
                      backgroundColor: '#080D12',
                      border: '1px solid #242C3A',
                      outline: 'none',
                      transition: 'border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#39D0FF'
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = '#242C3A'
                    }}
                  />
                </div>

                {/* Geographic Bounds */}
                <div style={{ marginBottom: '64px' }}>
                  <div style={{
                    fontSize: '13px',
                    fontFamily: 'Geist Mono, monospace',
                    color: '#8F9BB0',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    marginBottom: '16px'
                  }}>
                    Geographic Bounds (Optional)
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    {['Min Latitude', 'Max Latitude', 'Min Longitude', 'Max Longitude'].map((label, i) => (
                      <input
                        key={i}
                        type="text"
                        placeholder={label}
                        style={{
                          padding: '16px',
                          fontSize: '13px',
                          fontFamily: 'Geist Mono, monospace',
                          color: '#FFFFFF',
                          backgroundColor: '#080D12',
                          border: '1px solid #242C3A',
                          outline: 'none',
                          transition: 'border-color 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                        }}
                        onFocus={(e) => {
                          e.currentTarget.style.borderColor = '#39D0FF'
                        }}
                        onBlur={(e) => {
                          e.currentTarget.style.borderColor = '#242C3A'
                        }}
                      />
                    ))}
                  </div>
                </div>

                {/* Section Divider */}
                <div style={{
                  height: '1px',
                  background: 'linear-gradient(to right, transparent, #242C3A 50%, transparent)',
                  margin: '64px 0 48px'
                }} />

                {/* Authentication */}
                <div style={{ marginBottom: '48px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: 400,
                    color: '#FFFFFF',
                    marginBottom: '16px',
                    letterSpacing: '-0.01em'
                  }}>
                    Secure Your Account
                  </h3>
                  <p style={{
                    fontSize: '14px',
                    color: '#8F9BB0',
                    lineHeight: '1.6',
                    marginBottom: '32px'
                  }}>
                    Choose your preferred authentication method to receive alerts.
                  </p>

                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '16px',
                    marginBottom: '32px'
                  }}>
                    <button
                      style={{
                        padding: '20px',
                        fontSize: '13px',
                        fontFamily: 'Geist Mono, monospace',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        backgroundColor: '#080D12',
                        border: '1px solid #242C3A',
                        cursor: 'pointer',
                        transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#39D0FF'
                        e.currentTarget.style.backgroundColor = '#141821'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#242C3A'
                        e.currentTarget.style.backgroundColor = '#080D12'
                      }}
                    >
                      Continue with Google
                    </button>
                    <button
                      style={{
                        padding: '20px',
                        fontSize: '13px',
                        fontFamily: 'Geist Mono, monospace',
                        fontWeight: 600,
                        letterSpacing: '0.5px',
                        textTransform: 'uppercase',
                        color: '#FFFFFF',
                        backgroundColor: '#080D12',
                        border: '1px solid #242C3A',
                        cursor: 'pointer',
                        transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = '#39D0FF'
                        e.currentTarget.style.backgroundColor = '#141821'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = '#242C3A'
                        e.currentTarget.style.backgroundColor = '#080D12'
                      }}
                    >
                      Continue with GitHub
                    </button>
                  </div>

                  <div style={{
                    textAlign: 'center',
                    margin: '32px 0',
                    fontSize: '12px',
                    color: '#5E6A81',
                    fontFamily: 'Geist Mono, monospace',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    or
                  </div>

                  <button
                    style={{
                      width: '100%',
                      padding: '20px',
                      fontSize: '13px',
                      fontFamily: 'Geist Mono, monospace',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: '#FFFFFF',
                      backgroundColor: '#080D12',
                      border: '1px solid #242C3A',
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#39D0FF'
                      e.currentTarget.style.backgroundColor = '#141821'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#242C3A'
                      e.currentTarget.style.backgroundColor = '#080D12'
                    }}
                  >
                    Sign in with One-Time Code
                  </button>
                </div>

                {/* Already have account */}
                <div style={{
                  padding: '32px',
                  backgroundColor: '#080D12',
                  border: '1px solid #242C3A',
                  textAlign: 'center'
                }}>
                  <div style={{
                    fontSize: '13px',
                    color: '#8F9BB0',
                    marginBottom: '16px'
                  }}>
                    Already configured alerts?
                  </div>
                  <button
                    style={{
                      padding: '12px 32px',
                      fontSize: '11px',
                      fontFamily: 'Geist Mono, monospace',
                      fontWeight: 600,
                      letterSpacing: '0.5px',
                      textTransform: 'uppercase',
                      color: '#39D0FF',
                      backgroundColor: 'transparent',
                      border: '1px solid #39D0FF',
                      cursor: 'pointer',
                      transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#39D0FF'
                      e.currentTarget.style.color = '#080D12'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'transparent'
                      e.currentTarget.style.color = '#39D0FF'
                    }}
                  >
                    Sign In to Manage Alerts
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      </div>
    )}

    <style jsx global>{`
      @keyframes slideInRight {
        from {
          transform: translateX(100%);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }

      @keyframes slideInUp {
        from {
          transform: translateY(100%);
          opacity: 0;
        }
        to {
          transform: translateY(0);
          opacity: 1;
        }
      }
    `}</style>
    </>
  )
}
