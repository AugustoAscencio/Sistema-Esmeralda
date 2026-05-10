/**
 * Dashboard v5 — SatelliteCarousel integration, auto-load images,
 * geological analysis, hover tooltips, high contrast
 */
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAppStore from '../store/appStore'
import ResilienceScore from '../components/ui/ResilienceScore'
import AlertCard from '../components/ui/AlertCard'
import WeatherStrip from '../components/ui/WeatherStrip'
import CreditCard from '../components/ui/CreditCard'
import NDVITimeline from '../components/charts/NDVITimeline'
import RainfallChart from '../components/charts/RainfallChart'
import SatelliteCarousel from '../components/ui/SatelliteCarousel'

function Tip({ children, text }) {
  return (
    <div className="tooltip-wrap">
      {children}
      <div className="tooltip-content">{text}</div>
    </div>
  )
}

export default function Dashboard() {
  const nav = useNavigate()
  const parcelaData = useAppStore((s) => s.parcelaData)
  const analysisReady = useAppStore((s) => s.analysisReady)
  const isLoading = useAppStore((s) => s.isLoadingParcela)
  const currentBbox = useAppStore((s) => s.currentBbox)
  const isMobile = useAppStore((s) => s.isMobile)

  if (!analysisReady && !isLoading) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '65vh', textAlign: 'center' }}>
        <div className="animate-float" style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--emerald-100), var(--emerald-200))', border: '3px solid var(--emerald-300)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px', boxShadow: 'var(--shadow-emerald)' }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--emerald-600)" strokeWidth="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
        </div>
        <h2 style={{ marginBottom: '8px' }}>Selecciona tu parcela</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '420px', marginBottom: '28px', fontSize: '0.95rem' }}>
          Para ver el analisis completo, primero selecciona un area en el visor satelital. Todos los datos se calcularan automaticamente.
        </p>
        <button className="btn btn-primary" onClick={() => nav('/parcela')}>Ir al Visor Satelital</button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div className="card-emerald animate-glow" style={{ padding: '48px', textAlign: 'center' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '4px solid var(--emerald-500)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--emerald-800)' }}>Consultando satelites</div>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--emerald-600)', marginTop: '4px' }}>Sentinel-2 + Sentinel-1 + Open-Meteo</div>
        </div>
      </div>
    )
  }

  const ndvi = parcelaData?.ndvi || {}
  const moisture = parcelaData?.moisture || {}
  const climate = parcelaData?.climate || {}
  const resilience = parcelaData?.resilience || {}
  const alerts = parcelaData?.alerts || []
  const ndviHistory = parcelaData?.ndvi_history || []
  const source = parcelaData?.source || ''

  return (
    <div className="page">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '8px' }}>
        <div>
          <h1 style={{ marginBottom: '6px' }}>Panel de Control</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span className={`badge ${source === 'copernicus_live' ? 'badge-ok' : 'badge-info'}`}>{source === 'copernicus_live' ? 'Datos en vivo' : 'Datos demo'}</span>
            <span className="badge badge-ok">{parcelaData?.area_ha?.toFixed(1)} ha</span>
          </div>
        </div>
        <button className="btn btn-outline btn-sm" onClick={() => nav('/parcela')}>Cambiar parcela</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '300px 1fr', gap: '20px', alignItems: 'start' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card-emerald animate-in" style={{ display: 'flex', justifyContent: 'center', padding: '28px 16px' }}>
            <ResilienceScore score={resilience.score || 0} credit={resilience.credit || {}} size={isMobile ? 170 : 200} />
          </div>
          <div className="card animate-in d1" style={{ padding: '22px' }}>
            <h4 style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>Componentes del Score</h4>
            {[
              { label: 'Salud del cultivo', value: resilience.components?.crop_health || 0, max: 40, tip: 'Medido por NDVI satelital. Refleja la cantidad de clorofila activa en tus plantas.' },
              { label: 'Estabilidad', value: resilience.components?.stability || 0, max: 25, tip: 'Variacion del NDVI en las ultimas semanas. Menos variacion = cultivo mas estable.' },
              { label: 'Agua disponible', value: resilience.components?.water || 0, max: 20, tip: 'Combinacion de humedad del suelo (radar Sentinel-1) y lluvia pronosticada.' },
              { label: 'Riesgo climatico', value: resilience.components?.climate || 0, max: 15, tip: 'Basado en temperaturas extremas previstas. Calor > 38C reduce este puntaje.' },
            ].map((c, i) => (
              <Tip key={i} text={c.tip}>
                <div style={{ marginBottom: '12px', cursor: 'help' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{c.label}</span>
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-800)' }}>{c.value}/{c.max}</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${(c.value / c.max) * 100}%` }} /></div>
                </div>
              </Tip>
            ))}
          </div>
          <div className="animate-in d2"><CreditCard credit={resilience.credit || {}} /></div>
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Key metrics with tooltips */}
          <div className="grid-3 animate-in">
            {[
              { label: 'NDVI actual', value: ndvi.ndvi_mean?.toFixed(3) || '--', sub: `Rango: ${ndvi.ndvi_min?.toFixed(2) || '--'} - ${ndvi.ndvi_max?.toFixed(2) || '--'}`, color: ndvi.ndvi_mean >= 0.4 ? 'var(--emerald-700)' : 'var(--orange)', tip: 'NDVI mide la salud de la vegetacion. Arriba de 0.5 es saludable. Debajo de 0.3 indica estres severo. Se mide cada 5 dias con Sentinel-2.' },
              { label: 'Humedad suelo', value: `${moisture.moisture_mean?.toFixed(0) || '--'}%`, sub: moisture.moisture_critical ? 'Nivel critico' : 'Aceptable', color: moisture.moisture_critical ? 'var(--red)' : 'var(--blue)', tip: 'Porcentaje de agua en los primeros 10cm de suelo. Medido por radar SAR de Sentinel-1. Debajo de 25% es critico para la mayoria de cultivos.' },
              { label: 'Lluvia 7 dias', value: `${climate.summary?.precip_7d_mm?.toFixed(0) || '--'}mm`, sub: `Max: ${climate.summary?.temp_max || '--'}C`, color: 'var(--blue)', tip: 'Precipitacion total acumulada prevista para los proximos 7 dias, segun Open-Meteo. Menos de 5mm con calor alto indica riesgo de sequia.' },
            ].map((m, i) => (
              <Tip key={i} text={m.tip}>
                <div className="card" style={{ padding: '20px', cursor: 'help', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '8px' }}>{m.label}</div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: m.color, lineHeight: 1, marginBottom: '4px' }}>{m.value}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)' }}>{m.sub}</div>
                </div>
              </Tip>
            ))}
          </div>

          {/* Alerts */}
          {alerts.length > 0 && (
            <div className="animate-in d1" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {alerts.map((a, i) => <AlertCard key={i} alert={a} />)}
            </div>
          )}

          {/* Satellite Carousel — auto-loads images */}
          {currentBbox && (
            <div className="animate-in d2">
              <SatelliteCarousel bbox={currentBbox} autoLoad={true} />
            </div>
          )}

          <div className="animate-in d3">
            <div className="card" style={{ padding: '20px' }}>
              <h4 style={{ fontSize: '0.9rem', marginBottom: '14px' }}>Pronostico 7 dias</h4>
              <WeatherStrip days={climate.days || []} />
            </div>
          </div>

          <div className="animate-in d4"><NDVITimeline data={ndviHistory} /></div>
          <div className="animate-in d5"><RainfallChart days={climate.days || []} /></div>
        </div>
      </div>
    </div>
  )
}
