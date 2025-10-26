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
      backgroundColor: '#141821',
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
              {activeModal === 'about' && 'About Flow Atlas'}
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
                  Flow Atlas is a live visualization of global systems—energy, data, and nature—built on open sources for public, media, and professional use.
                </p>
                <p style={{ marginBottom: '16px' }}>
                  For researchers, journalists, and practitioners observing infrastructure and risk, Flow Atlas presents real-time environmental and network data through a clear, disciplined interface.
                </p>
                <p style={{ marginBottom: '16px', fontStyle: 'italic', color: '#8F9BB0', fontSize: '14px' }}>
                  The planet, in motion.
                </p>
                <p style={{ marginBottom: '0' }}>
                  Data sources: USGS Earthquake API, simulated hazard models, synthetic network monitoring systems.
                </p>
              </>
            )}

            {activeModal === 'methods' && (
              <>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Data Collection
                </h3>
                <p style={{ marginBottom: '16px' }}>
                  • <strong>Earthquakes:</strong> Real-time data from USGS (magnitude ≥4.5, last 24 hours)<br/>
                  • <strong>Hazards:</strong> Simulated environmental threat models<br/>
                  • <strong>Outages:</strong> Synthetic network disruption data<br/>
                  • <strong>Latency:</strong> Simulated regional latency measurements
                </p>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Visualization Techniques
                </h3>
                <p style={{ marginBottom: '0' }}>
                  We follow Edward Tufte's principles of analytical design: maximize data-ink ratio, eliminate chart junk, and present data with clarity and precision. All visualizations use D3.js for dynamic, interactive charts.
                </p>
              </>
            )}

            {activeModal === 'api' && (
              <>
                <p style={{ marginBottom: '16px' }}>
                  Access Flow Atlas data programmatically through our REST API.
                </p>
                <h3 style={{ fontSize: '16px', color: '#FFFFFF', marginBottom: '12px', fontWeight: 400 }}>
                  Endpoints
                </h3>
                <div style={{
                  backgroundColor: '#0A0F16',
                  border: '1px solid #242C3A',
                  padding: '16px',
                  marginBottom: '16px',
                  fontFamily: 'monospace',
                  fontSize: '13px',
                }}>
                  <p style={{ margin: '0 0 8px 0' }}>GET /api/earthquakes</p>
                  <p style={{ margin: '0 0 8px 0' }}>GET /api/hazards</p>
                  <p style={{ margin: '0 0 8px 0' }}>GET /api/outages</p>
                  <p style={{ margin: '0' }}>GET /api/latency</p>
                </div>
                <p style={{ marginBottom: '0', fontSize: '13px', color: '#8F9BB0' }}>
                  API access requires authentication. Contact us for API keys.
                </p>
              </>
            )}

            {activeModal === 'access' && (
              <>
                <p style={{ marginBottom: '16px' }}>
                  Flow Atlas is currently in private beta. Request access to unlock:
                </p>
                <ul style={{ marginBottom: '24px', paddingLeft: '20px' }}>
                  <li style={{ marginBottom: '8px' }}>Full API access with authentication</li>
                  <li style={{ marginBottom: '8px' }}>Historical data exports (CSV, JSON)</li>
                  <li style={{ marginBottom: '8px' }}>Custom alert notifications</li>
                  <li style={{ marginBottom: '0' }}>Priority support and feature requests</li>
                </ul>
                <div style={{
                  backgroundColor: '#0A0F16',
                  border: '1px solid #242C3A',
                  padding: '16px',
                  textAlign: 'center',
                }}>
                  <p style={{ margin: '0 0 8px 0', fontSize: '13px', color: '#8F9BB0' }}>
                    Contact: access@flowatlas.io
                  </p>
                  <p style={{ margin: '0', fontSize: '13px', color: '#8F9BB0' }}>
                    Include your organization and use case
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
