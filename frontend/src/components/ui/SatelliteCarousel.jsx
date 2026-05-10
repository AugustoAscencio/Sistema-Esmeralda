/**
 * SatelliteCarousel v1 — Premium satellite image viewer with 5 layers,
 * zoom, download, dynamic legend, auto-load, geological analysis panel
 */
import { useState, useEffect, useRef, useCallback } from 'react'

const LAYERS = [
  { id: 'truecolor', endpoint: 'true-color', label: 'Color Real', icon: ' ', desc: 'Imagen real RGB del satélite Sentinel-2', legend: [{ color: '#4a7c59', label: 'Vegetación' }, { color: '#8B7355', label: 'Suelo' }, { color: '#4682B4', label: 'Agua' }, { color: '#D3D3D3', label: 'Nubes/Urbano' }] },
  { id: 'ndvi', endpoint: 'ndvi-image', label: 'NDVI', icon: ' ', desc: 'Índice de vegetación — salud del cultivo', legend: [{ color: '#0d8050', label: '> 0.6 Muy sano' }, { color: '#66cc33', label: '0.4-0.6 Sano' }, { color: '#cc9933', label: '0.2-0.4 Estrés' }, { color: '#cc3333', label: '< 0.2 Crítico' }] },
  { id: 'evi', endpoint: 'evi-image', label: 'EVI', icon: ' ', desc: 'Vegetación mejorada — preciso en zonas densas', legend: [{ color: '#008000', label: '> 0.6 Denso' }, { color: '#66cc33', label: '0.4-0.6 Moderado' }, { color: '#cccc33', label: '0.2-0.4 Escaso' }, { color: '#cc9966', label: '< 0.2 Mínimo' }] },
  { id: 'swir', endpoint: 'swir-image', label: 'SWIR', icon: ' ', desc: 'Infrarrojo — estrés hídrico y estructura', legend: [{ color: '#ff6633', label: 'Suelo seco' }, { color: '#33cc66', label: 'Vegetación activa' }, { color: '#3366cc', label: 'Agua/Humedad' }, { color: '#996633', label: 'Suelo desnudo' }] },
  { id: 'mndwi', endpoint: 'mndwi-image', label: 'Humedales', icon: ' ', desc: 'MNDWI — detección de agua y humedales', legend: [{ color: '#0033cc', label: '> 0.3 Agua' }, { color: '#0080e6', label: '0.1-0.3 Humedal' }, { color: '#55b380', label: '0-0.1 Húmedo' }, { color: '#b3994d', label: '< 0 Seco' }] },
]

export default function SatelliteCarousel({ bbox, autoLoad = true }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [images, setImages] = useState({})
  const [loading, setLoading] = useState(null)
  const [expanded, setExpanded] = useState(false)
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [geoData, setGeoData] = useState(null)
  const imgRef = useRef(null)
  const dragRef = useRef(null)

  const activeLayer = LAYERS[activeIdx]

  const loadImage = useCallback(async (layer) => {
    if (!bbox) return
    const key = layer.id
    if (images[key]) return
    setLoading(key)
    try {
      const res = await fetch(`http://localhost:8000/api/v1/parcela/${layer.endpoint}?bbox=${bbox.join(',')}`)
      if (!res.ok) {
        const ct = res.headers.get('content-type') || ''
        if (ct.includes('json')) throw new Error('API error')
        throw new Error('HTTP ' + res.status)
      }
      const blob = await res.blob()
      if (blob.type && !blob.type.startsWith('image')) throw new Error('Not an image')
      setImages(prev => ({ ...prev, [key]: URL.createObjectURL(blob) }))
    } catch {
      setImages(prev => ({ ...prev, [key]: null }))
    }
    setLoading(null)
  }, [bbox, images])

  // Auto-load first two images when bbox changes
  useEffect(() => {
    if (!bbox || !autoLoad) return
    setImages({})
    setGeoData(null)
    const load = async () => {
      await loadImage(LAYERS[0])
      await loadImage(LAYERS[1])
      // Load geological analysis
      try {
        const res = await fetch(`http://localhost:8000/api/v1/parcela/geological-analysis?bbox=${bbox.join(',')}`)
        if (res.ok) setGeoData(await res.json())
      } catch { }
    }
    load()
  }, [bbox])

  const selectLayer = (idx) => {
    setActiveIdx(idx)
    setZoom(1)
    setPan({ x: 0, y: 0 })
    loadImage(LAYERS[idx])
  }

  const handleWheel = (e) => {
    e.preventDefault()
    setZoom(z => Math.max(1, Math.min(5, z + (e.deltaY > 0 ? -0.3 : 0.3))))
  }

  const handleMouseDown = (e) => {
    if (zoom <= 1) return
    dragRef.current = { startX: e.clientX - pan.x, startY: e.clientY - pan.y }
  }
  const handleMouseMove = (e) => {
    if (!dragRef.current) return
    setPan({ x: e.clientX - dragRef.current.startX, y: e.clientY - dragRef.current.startY })
  }
  const handleMouseUp = () => { dragRef.current = null }

  const downloadImage = () => {
    const url = images[activeLayer.id]
    if (!url) return
    const a = document.createElement('a')
    a.href = url
    a.download = `esmeralda_${activeLayer.id}_${Date.now()}.png`
    a.click()
  }

  const imgSrc = images[activeLayer.id]
  const isLoading = loading === activeLayer.id

  return (
    <div className={expanded ? 'card-dark' : 'card-dark'} style={{
      position: expanded ? 'fixed' : 'relative',
      inset: expanded ? '16px' : 'auto',
      zIndex: expanded ? 200 : 1,
      display: 'flex', flexDirection: 'column', gap: '0',
      ...(expanded ? { borderRadius: 'var(--r-xl)' } : {}),
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{ padding: '16px 20px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '1rem' }}>Análisis Satelital Sentinel-2</h4>
          <p style={{ margin: '2px 0 0', fontSize: '0.7rem', color: 'var(--emerald-400)' }}>Imágenes en tiempo real · Copernicus CDSE</p>
        </div>
        <div style={{ display: 'flex', gap: '6px' }}>
          {imgSrc && (
            <button onClick={downloadImage} style={{
              padding: '6px 12px', borderRadius: 'var(--r-sm)', border: '1px solid rgba(16,185,129,0.3)',
              background: 'rgba(16,185,129,0.1)', color: '#6ee7b7', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
            }}>⬇ Descargar</button>
          )}
          <button onClick={() => { setExpanded(!expanded); setZoom(1); setPan({ x: 0, y: 0 }) }} style={{
            padding: '6px 12px', borderRadius: 'var(--r-sm)', border: '1px solid rgba(255,255,255,0.15)',
            background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: '0.7rem', fontWeight: 600, cursor: 'pointer',
          }}>{expanded ? '✕ Cerrar' : '⛶ Ampliar'}</button>
        </div>
      </div>

      {/* Layer tabs — carousel style */}
      <div style={{
        display: 'flex', gap: '4px', padding: '0 20px 12px',
        overflowX: 'auto', scrollbarWidth: 'none',
      }}>
        {LAYERS.map((layer, idx) => (
          <button key={layer.id} onClick={() => selectLayer(idx)} style={{
            padding: '8px 14px', borderRadius: 'var(--r-sm)',
            background: idx === activeIdx ? 'linear-gradient(135deg, #10b981, #059669)' : 'rgba(255,255,255,0.06)',
            border: idx === activeIdx ? '1.5px solid #34d399' : '1px solid rgba(255,255,255,0.1)',
            color: idx === activeIdx ? '#fff' : 'rgba(255,255,255,0.6)',
            fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.25s', whiteSpace: 'nowrap', fontFamily: 'var(--font-sans)',
            boxShadow: idx === activeIdx ? '0 2px 12px rgba(16,185,129,0.3)' : 'none',
            transform: idx === activeIdx ? 'scale(1.02)' : 'scale(1)',
          }}>
            <span style={{ marginRight: '4px' }}>{layer.icon}</span>
            {layer.label}
          </button>
        ))}
      </div>

      {/* Image viewport */}
      <div
        ref={imgRef}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          flex: expanded ? 1 : 'none',
          height: expanded ? 'auto' : '320px',
          background: '#071f17',
          position: 'relative', overflow: 'hidden',
          cursor: zoom > 1 ? 'grab' : 'default',
          borderTop: '1px solid rgba(16,185,129,0.15)',
          borderBottom: '1px solid rgba(16,185,129,0.15)',
        }}
      >
        {isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', zIndex: 2 }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', border: '3px solid var(--emerald-400)', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite', marginBottom: '12px' }} />
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--emerald-300)' }}>Descargando {activeLayer.label}...</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--emerald-500)', marginTop: '4px' }}>Sentinel-2 Level-2A · Copernicus</span>
          </div>
        )}
        {imgSrc && !isLoading && (
          <img src={imgSrc} alt={activeLayer.label}
            draggable={false}
            style={{
              width: '100%', height: '100%', objectFit: 'contain',
              transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
              transition: dragRef.current ? 'none' : 'transform 0.2s ease',
              animation: 'fadeIn 0.4s ease',
            }} />
        )}
        {imgSrc === null && !isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🛰️</div>
            <p style={{ color: 'var(--emerald-300)', fontSize: '0.85rem', textAlign: 'center', maxWidth: '300px' }}>
              Imagen no disponible. Verifica que el backend esté activo con las credenciales Copernicus.
            </p>
            <button onClick={() => { setImages(prev => { const n = { ...prev }; delete n[activeLayer.id]; return n }); loadImage(activeLayer) }}
              style={{ marginTop: '10px', padding: '8px 16px', borderRadius: 'var(--r-sm)', background: 'var(--emerald-600)', color: '#fff', border: 'none', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
              Reintentar
            </button>
          </div>
        )}
        {imgSrc === undefined && !isLoading && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <p style={{ color: 'var(--emerald-400)', fontSize: '0.85rem' }}>Cargando capa {activeLayer.label}...</p>
          </div>
        )}

        {/* Zoom indicator */}
        {zoom > 1 && (
          <div style={{
            position: 'absolute', bottom: 8, right: 8, padding: '4px 10px',
            background: 'rgba(0,0,0,0.7)', borderRadius: 'var(--r-sm)',
            fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: '#6ee7b7',
          }}>{zoom.toFixed(1)}x</div>
        )}
      </div>

      {/* Bottom panel: legend + description + geo analysis */}
      <div style={{ padding: '14px 20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
        {/* Layer info */}
        <div style={{ flex: '1 1 200px', minWidth: '180px' }}>
          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--emerald-400)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '6px' }}>
            {activeLayer.icon} {activeLayer.label}
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--emerald-200)', margin: '0 0 10px', lineHeight: 1.5 }}>
            {activeLayer.desc}
          </p>
          {/* Legend */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {activeLayer.legend.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <div style={{ width: '12px', height: '12px', borderRadius: '2px', background: item.color, flexShrink: 0 }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'rgba(255,255,255,0.6)' }}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Geological analysis */}
        {geoData && (
          <div style={{ flex: '1 1 280px', display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
            <div style={{ padding: '10px', background: 'rgba(16,185,129,0.08)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(16,185,129,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--emerald-400)', textTransform: 'uppercase', marginBottom: '4px' }}>Vegetación</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#34d399' }}>{geoData.vegetation_pct}%</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(59,130,246,0.08)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(59,130,246,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#60a5fa', textTransform: 'uppercase', marginBottom: '4px' }}>Humedales</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#60a5fa' }}>{geoData.wetland_pct}%</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(234,88,12,0.08)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(234,88,12,0.2)' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#fb923c', textTransform: 'uppercase', marginBottom: '4px' }}>Suelo exp.</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fb923c' }}>{geoData.bare_soil_pct}%</div>
            </div>
            <div style={{ padding: '10px', background: geoData.drought_risk === 'ALTO' ? 'rgba(220,38,38,0.1)' : 'rgba(16,185,129,0.06)', borderRadius: 'var(--r-sm)', border: `1px solid ${geoData.drought_risk === 'ALTO' ? 'rgba(220,38,38,0.3)' : 'rgba(16,185,129,0.15)'}`, gridColumn: 'span 1' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--emerald-400)', textTransform: 'uppercase', marginBottom: '4px' }}>R. Sequía</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: geoData.drought_risk === 'ALTO' ? '#f87171' : geoData.drought_risk === 'MEDIO' ? '#fbbf24' : '#34d399' }}>{geoData.drought_risk}</div>
            </div>
            <div style={{ padding: '10px', background: geoData.water_risk === 'ALTO' ? 'rgba(59,130,246,0.12)' : 'rgba(16,185,129,0.06)', borderRadius: 'var(--r-sm)', border: `1px solid ${geoData.water_risk === 'ALTO' ? 'rgba(59,130,246,0.3)' : 'rgba(16,185,129,0.15)'}`, gridColumn: 'span 1' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: '#60a5fa', textTransform: 'uppercase', marginBottom: '4px' }}>R. Inundación</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: geoData.water_risk === 'ALTO' ? '#60a5fa' : geoData.water_risk === 'MEDIO' ? '#fbbf24' : '#34d399' }}>{geoData.water_risk}</div>
            </div>
            <div style={{ padding: '10px', background: 'rgba(16,185,129,0.06)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(16,185,129,0.15)', gridColumn: 'span 1' }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'var(--emerald-400)', textTransform: 'uppercase', marginBottom: '4px' }}>MNDWI</div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#6ee7b7' }}>{geoData.mndwi_mean}</div>
            </div>
          </div>
        )}
      </div>

      {/* Expanded backdrop */}
      {expanded && <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', zIndex: -1 }} onClick={() => setExpanded(false)} />}
    </div>
  )
}
