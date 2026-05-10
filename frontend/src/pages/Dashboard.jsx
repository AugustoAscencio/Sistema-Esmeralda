/**
 * Dashboard v4 — Satellite image viewer, hover tooltips, high contrast, dark accent panels
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

function Tip({ children, text }) {
  return (
    <div className="tooltip-wrap">
      {children}
      <div className="tooltip-content">{text}</div>
    </div>
  )
}

function SatelliteViewer({ bbox }) {
  const [view, setView] = useState('ndvi')
  const [expanded, setExpanded] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgSrc, setImgSrc] = useState(null)
  const [error, setError] = useState(false)

  const loadImage = async (type) => {
    setView(type); setLoading(true); setError(false)
    try {
      const ep = type === 'ndvi' ? 'ndvi-image' : 'true-color'
      const res = await fetch(`http://localhost:8000/api/v1/parcela/${ep}?bbox=${bbox.join(',')}`)
      if (!res.ok) throw new Error()
      const blob = await res.blob()
      setImgSrc(URL.createObjectURL(blob))
    } catch {
      setImgSrc(null); setError(true)
    }
    setLoading(false)
  }

  return (
    <div className={expanded ? 'card-dark animate-scale' : 'card-dark'} style={{
      position: expanded ? 'fixed' : 'relative',
      inset: expanded ? '24px' : 'auto', zIndex: expanded ? 200 : 1,
      display: 'flex', flexDirection: 'column', gap: '12px',
      ...(expanded ? { borderRadius: 'var(--r-xl)' } : {}),
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h4 style={{ margin: 0 }}>Imagenes Satelitales</h4>
        <div style={{ display: 'flex', gap: '6px' }}>
          <button className="btn btn-sm" onClick={() => loadImage('ndvi')}
            style={{ background: view === 'ndvi' ? 'var(--emerald-600)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontSize: '0.7rem' }}>NDVI</button>
          <button className="btn btn-sm" onClick={() => loadImage('truecolor')}
            style={{ background: view === 'truecolor' ? 'var(--emerald-600)' : 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontSize: '0.7rem' }}>Color Real</button>
          <button className="btn btn-sm" onClick={() => setExpanded(!expanded)}
            style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', fontSize: '0.7rem' }}>{expanded ? 'Cerrar' : 'Ampliar'}</button>
        </div>
      </div>
      <div style={{
        flex: expanded ? 1 : 'none', height: expanded ? 'auto' : '220px',
        borderRadius: 'var(--r-md)', overflow: 'hidden', position: 'relative',
        background: '#0a2e1f',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {loading && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', border: '3px solid var(--emerald-400)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', margin: '0 auto 8px' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--emerald-300)' }}>Descargando imagen Sentinel-2...</span>
          </div>
        )}
        {imgSrc && !loading && (
          <img src={imgSrc} alt={`Vista ${view}`} style={{
            width: '100%', height: '100%', objectFit: 'contain',
            animation: 'fadeIn 0.5s ease',
          }} />
        )}
        {error && !loading && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <p style={{ color: 'var(--emerald-300)', fontSize: '0.85rem', marginBottom: '8px' }}>Imagenes no disponibles sin backend Copernicus</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--emerald-500)' }}>Ejecuta el servidor con credenciales CDSE para ver imagenes reales</p>
            <div style={{
              marginTop: '16px', padding: '24px', borderRadius: 'var(--r-md)',
              background: 'linear-gradient(135deg, rgba(16,185,129,0.15), rgba(5,150,105,0.1))',
              border: '1px solid rgba(16,185,129,0.3)',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--emerald-200)', marginBottom: '4px' }}>REPRESENTACION SIMULADA</div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(8, 1fr)', gap: '2px' }}>
                {Array.from({ length: 64 }).map((_, i) => {
                  const h = (i % 8) * 15 + Math.random() * 20 + 100
                  return <div key={i} style={{ width: '100%', aspectRatio: '1', borderRadius: '2px', background: `hsl(${h}, 60%, ${30 + Math.random() * 30}%)`, opacity: 0.8 }} />
                })}
              </div>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--emerald-400)', marginTop: '6px', textAlign: 'center' }}>Mosaico NDVI · {view === 'ndvi' ? 'Indice Vegetacion' : 'True Color'}</div>
            </div>
          </div>
        )}
        {!imgSrc && !loading && !error && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ color: 'var(--emerald-300)', fontSize: '0.85rem', marginBottom: '8px' }}>Haz clic en NDVI o Color Real para cargar</p>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--emerald-500)' }}>Imagenes del satelite Sentinel-2 Level-2A</p>
          </div>
        )}
      </div>
      {expanded && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: -1 }} onClick={() => setExpanded(false)} />}
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

          {/* Satellite Image Viewer */}
          {currentBbox && (
            <div className="animate-in d2"><SatelliteViewer bbox={currentBbox} /></div>
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
