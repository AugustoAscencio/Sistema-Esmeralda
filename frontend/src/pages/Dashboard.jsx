/**
 * Dashboard.jsx — Panel principal del agricultor
 */

import { useEffect } from 'react'
import useAppStore from '../store/appStore'
import ResilienceScore from '../components/ui/ResilienceScore'
import AlertCard from '../components/ui/AlertCard'
import WeatherStrip from '../components/ui/WeatherStrip'
import CreditCard from '../components/ui/CreditCard'
import NDVITimeline from '../components/charts/NDVITimeline'
import RainfallChart from '../components/charts/RainfallChart'

// Default demo bbox
const DEMO_BBOX = [-87.18, 12.64, -87.14, 12.68]

export default function Dashboard() {
  const parcelaData = useAppStore((s) => s.parcelaData)
  const fetchAnalysis = useAppStore((s) => s.fetchAnalysis)
  const isLoading = useAppStore((s) => s.isLoadingParcela)
  const isMobile = useAppStore((s) => s.isMobile)

  useEffect(() => {
    if (!parcelaData) {
      fetchAnalysis(DEMO_BBOX)
    }
  }, [])

  const ndvi = parcelaData?.ndvi || {}
  const moisture = parcelaData?.moisture || {}
  const climate = parcelaData?.climate || {}
  const resilience = parcelaData?.resilience || {}
  const alerts = parcelaData?.alerts || []
  const ndviHistory = parcelaData?.ndvi_history || []
  const source = parcelaData?.source || ''

  if (isLoading) {
    return (
      <div className="page" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '60vh',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }} className="animate-pulse">🛰️</div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.2rem',
            color: 'var(--esmeralda-bright)',
            marginBottom: '8px',
          }}>
            Consultando satélites...
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-muted)',
          }}>
            Sentinel-2 NDVI • Sentinel-1 Humedad • Open-Meteo Clima
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px',
        flexWrap: 'wrap',
        gap: '12px',
      }}>
        <div>
          <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '4px' }}>
            Panel Esmeralda
          </h1>
          <span className={`badge ${source === 'copernicus_live' ? 'badge-ok' : 'badge-info'}`}>
            {source === 'copernicus_live' ? '🛰️ Datos en vivo' : '📋 Datos demo'}
          </span>
        </div>
      </div>

      {/* Main grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : '320px 1fr',
        gap: '24px',
        alignItems: 'start',
      }}>
        {/* Left: Score + Credit */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Resilience Score */}
          <div className="card animate-fade-in" style={{
            display: 'flex',
            justifyContent: 'center',
            padding: '32px 24px',
          }}>
            <ResilienceScore
              score={resilience.score || 0}
              credit={resilience.credit || {}}
              size={isMobile ? 180 : 220}
            />
          </div>

          {/* Score components */}
          <div className="card animate-fade-in delay-1">
            <h4 style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.85rem',
              marginBottom: '12px',
              color: 'var(--text-secondary)',
            }}>
              Componentes del Score
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {[
                { label: 'Salud del cultivo', value: resilience.components?.crop_health || 0, max: 40, icon: '🌿' },
                { label: 'Estabilidad', value: resilience.components?.stability || 0, max: 25, icon: '📊' },
                { label: 'Agua disponible', value: resilience.components?.water || 0, max: 20, icon: '💧' },
                { label: 'Riesgo climático', value: resilience.components?.climate || 0, max: 15, icon: '🌡️' },
              ].map((comp, i) => (
                <div key={i}>
                  <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '4px',
                  }}>
                    <span style={{
                      fontFamily: 'var(--font-body)',
                      fontSize: '0.8rem',
                      color: 'var(--text-secondary)',
                    }}>
                      {comp.icon} {comp.label}
                    </span>
                    <span style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.75rem',
                      color: 'var(--text-primary)',
                      fontWeight: 700,
                    }}>
                      {comp.value}/{comp.max}
                    </span>
                  </div>
                  <div style={{
                    height: '6px',
                    background: 'var(--esmeralda-deep)',
                    borderRadius: '3px',
                    overflow: 'hidden',
                  }}>
                    <div style={{
                      width: `${(comp.value / comp.max) * 100}%`,
                      height: '100%',
                      background: `linear-gradient(90deg, var(--esmeralda-gem), var(--esmeralda-bright))`,
                      borderRadius: '3px',
                      transition: 'width 1s ease',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Credit card */}
          <div className="animate-fade-in delay-2">
            <CreditCard credit={resilience.credit || {}} />
          </div>
        </div>

        {/* Right: Metrics + Charts + Alerts */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Metric cards */}
          <div className="grid-3 animate-fade-in">
            {[
              {
                label: 'NDVI Actual',
                value: ndvi.ndvi_mean?.toFixed(2) || '—',
                icon: '🌿',
                sub: `Min: ${ndvi.ndvi_min?.toFixed(2) || '—'} / Max: ${ndvi.ndvi_max?.toFixed(2) || '—'}`,
                color: ndvi.ndvi_mean >= 0.4 ? 'var(--esmeralda-bright)' : 'var(--alert-orange)',
              },
              {
                label: 'Humedad Suelo',
                value: `${moisture.moisture_mean?.toFixed(0) || '—'}%`,
                icon: '💧',
                sub: moisture.moisture_critical ? '⚠️ Nivel crítico' : 'Nivel aceptable',
                color: moisture.moisture_critical ? 'var(--alert-red)' : '#38bdf8',
              },
              {
                label: 'Lluvia 7 días',
                value: `${climate.summary?.precip_7d_mm?.toFixed(0) || '—'}mm`,
                icon: '🌧️',
                sub: `Máx: ${climate.summary?.temp_max || '—'}°C`,
                color: '#38bdf8',
              },
            ].map((metric, i) => (
              <div key={i} className="card card-glow" style={{ padding: '20px' }}>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.65rem',
                  color: 'var(--text-muted)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  marginBottom: '8px',
                }}>
                  {metric.icon} {metric.label}
                </div>
                <div style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.8rem',
                  fontWeight: 800,
                  color: metric.color,
                  lineHeight: 1,
                  marginBottom: '6px',
                }}>
                  {metric.value}
                </div>
                <div style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.6rem',
                  color: 'var(--text-muted)',
                }}>
                  {metric.sub}
                </div>
              </div>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="animate-fade-in delay-1" style={{
              display: 'flex', flexDirection: 'column', gap: '8px',
            }}>
              {alerts.map((alert, i) => (
                <AlertCard key={i} alert={alert} />
              ))}
            </div>
          )}

          {/* Weather strip */}
          <div className="animate-fade-in delay-2">
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.95rem',
                marginBottom: '12px',
              }}>
                🌤️ Pronóstico 7 días
              </h4>
              <WeatherStrip days={climate.days || []} />
            </div>
          </div>

          {/* NDVI Timeline */}
          <div className="animate-fade-in delay-3">
            <NDVITimeline data={ndviHistory} />
          </div>

          {/* Rainfall */}
          <div className="animate-fade-in delay-4">
            <RainfallChart days={climate.days || []} />
          </div>
        </div>
      </div>
    </div>
  )
}
