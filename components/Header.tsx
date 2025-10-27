'use client'

import { useState } from 'react'
import Image from 'next/image'

type ModalType = 'about' | 'methods' | 'api' | 'access' | null

export default function Header() {
  const [activeModal, setActiveModal] = useState<ModalType>(null)

  const openModal = (modal: ModalType) => setActiveModal(modal)
  const closeModal = () => setActiveModal(null)

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
        maxWidth: '1536px',
        margin: '0 auto',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Image
            src="/images/dataflowatlas.svg"
            alt="Atlasflow"
            width={180}
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
          <div style={{
            width: '1px',
            height: '16px',
            backgroundColor: '#242C3A',
            margin: '0 8px'
          }} />
          <button
            onClick={() => openModal('access')}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#39D0FF15'
              e.currentTarget.style.borderColor = '#39D0FF'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
              e.currentTarget.style.borderColor = '#242C3A'
            }}
            style={{
              padding: '8px 16px',
              fontSize: '14px',
              fontWeight: 400,
              fontFamily: 'Albert Sans, sans-serif',
              color: '#FFFFFF',
              backgroundColor: 'transparent',
              border: '1px solid #242C3A',
              cursor: 'pointer',
              transition: 'all 200ms cubic-bezier(0.25, 0.1, 0.25, 1)'
            }}>
            Get access
          </button>
        </nav>
      </div>
    </header>

    {activeModal && (
      <div
        onClick={closeModal}
        style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 200,
          backdropFilter: 'blur(4px)',
        }}>
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: '#141821',
            border: '1px solid #242C3A',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            padding: '32px',
            fontFamily: 'Albert Sans, sans-serif',
          }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '24px',
          }}>
            <h2 style={{
              fontSize: '22px',
              fontWeight: 300,
              color: '#FFFFFF',
              margin: 0,
            }}>
              {activeModal === 'about' && 'About Dataflow Atlas'}
              {activeModal === 'methods' && 'Data Methods'}
              {activeModal === 'api' && 'API Documentation'}
              {activeModal === 'access' && 'Get Access'}
            </h2>
            <button
              onClick={closeModal}
              style={{
                backgroundColor: 'transparent',
                border: 'none',
                color: '#8F9BB0',
                fontSize: '24px',
                cursor: 'pointer',
                padding: '4px 8px',
              }}>
              ×
            </button>
          </div>

          <div style={{
            color: '#C6CFDA',
            fontSize: '14px',
            lineHeight: '1.6',
          }}>
            {activeModal === 'about' && (
              <>
                <p style={{ marginBottom: '16px' }}>
                  Dataflow Atlas is a real-time visualization platform tracking global environmental events through trusted open data sources. Built for researchers, journalists, emergency responders, and data analysts who need immediate access to critical environmental intelligence.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  Our platform integrates live data from USGS (earthquakes), NASA FIRMS (wildfires), and AirNow (air quality) into a unified, interactive interface designed with Nate Silver's analytical principles: clarity, trust signals, and narrative-driven exploration.
                </p>
                <p style={{ marginBottom: '16px', fontStyle: 'italic', color: '#8F9BB0', fontSize: '13px' }}>
                  The planet, in motion—visualized with precision.
                </p>
                <p style={{ marginBottom: '0', fontSize: '13px' }}>
                  <strong>Current Data Sources:</strong> USGS Earthquake API, NASA FIRMS Active Fire Data, EPA AirNow Air Quality Index
                </p>
              </>
            )}

            {activeModal === 'methods' && (
              <>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Data Collection
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  • <strong>Earthquakes:</strong> USGS Earthquake Hazards Program API (magnitude ≥4.5, updated every 15 minutes)<br/>
                  • <strong>Wildfires:</strong> NASA FIRMS Active Fire Data via VIIRS/MODIS satellites (near real-time, 3-hour latency)<br/>
                  • <strong>Air Quality:</strong> EPA AirNow API for current AQI measurements (hourly updates across 2,000+ monitoring stations)
                </p>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Visualization Philosophy
                </h3>
                <p style={{ marginBottom: '12px' }}>
                  We follow <strong>Nate Silver's analytical design principles</strong> and <strong>Edward Tufte's data visualization theory</strong>:
                </p>
                <p style={{ marginBottom: '0', fontSize: '13px', lineHeight: '1.7' }}>
                  • Maximize data-ink ratio, eliminate chart junk<br/>
                  • Show trust signals (sources, timestamps, confidence levels)<br/>
                  • Interactive tooltips with contextual data<br/>
                  • Storytelling-first filter design for narrative exploration<br/>
                  • Built with D3.js for precise, dynamic visualizations
                </p>
              </>
            )}

            {activeModal === 'api' && (
              <>
                <p style={{ marginBottom: '16px' }}>
                  Access real-time environmental data programmatically through our REST API. All endpoints return unified JSON structures optimized for analysis and visualization.
                </p>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Data Ingestion Endpoints
                </h3>
                <div style={{
                  backgroundColor: '#0A0F16',
                  border: '1px solid #242C3A',
                  padding: '16px',
                  marginBottom: '12px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}>
                  <p style={{ margin: '0 0 6px 0', color: '#C6CFDA' }}>GET /api/ingest/earthquakes</p>
                  <p style={{ margin: '0 0 6px 0', color: '#C6CFDA' }}>GET /api/ingest/wildfires</p>
                  <p style={{ margin: '0 0 6px 0', color: '#C6CFDA' }}>GET /api/ingest/air-quality</p>
                  <p style={{ margin: '0', color: '#8F9BB0', fontSize: '11px' }}>Parameters: ?limit, ?days, ?source</p>
                </div>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Query Endpoints
                </h3>
                <div style={{
                  backgroundColor: '#0A0F16',
                  border: '1px solid #242C3A',
                  padding: '16px',
                  marginBottom: '16px',
                  fontFamily: 'monospace',
                  fontSize: '12px',
                }}>
                  <p style={{ margin: '0 0 6px 0', color: '#C6CFDA' }}>GET /api/events</p>
                  <p style={{ margin: '0', color: '#8F9BB0', fontSize: '11px' }}>Returns all unified event data</p>
                </div>
                <p style={{ marginBottom: '0', fontSize: '13px', color: '#8F9BB0' }}>
                  <strong>Current Status:</strong> Public read access available. Write access requires authentication (coming soon).
                </p>
              </>
            )}

            {activeModal === 'access' && (
              <>
                <p style={{ marginBottom: '16px' }}>
                  Dataflow Atlas is currently in <strong>public beta</strong>. The platform is free to use with read-only API access. Enhanced features coming soon:
                </p>
                <ul style={{ marginBottom: '24px', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li style={{ marginBottom: '8px' }}><strong>API Authentication:</strong> Write access and custom data ingestion</li>
                  <li style={{ marginBottom: '8px' }}><strong>Historical Exports:</strong> Download multi-year datasets (CSV, JSON, GeoJSON)</li>
                  <li style={{ marginBottom: '8px' }}><strong>Custom Alerts:</strong> Real-time notifications for threshold events</li>
                  <li style={{ marginBottom: '8px' }}><strong>Advanced Filtering:</strong> Multi-parameter queries and custom visualizations</li>
                  <li style={{ marginBottom: '0' }}><strong>Embeddable Widgets:</strong> Integrate charts directly into your applications</li>
                </ul>
                <div style={{
                  backgroundColor: '#0A0F16',
                  border: '1px solid #242C3A',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#C6CFDA' }}>
                    <strong>Contact:</strong> <a href="mailto:contact@dataflowatlas.io" style={{ color: '#39D0FF', textDecoration: 'none' }}>contact@dataflowatlas.io</a>
                  </p>
                  <p style={{ margin: '0', fontSize: '12px', color: '#8F9BB0' }}>
                    Include your organization, use case, and feature requests
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  )
}
