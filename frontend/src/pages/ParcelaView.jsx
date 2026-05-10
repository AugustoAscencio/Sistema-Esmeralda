/**
 * ParcelaView.jsx — Vista satelital con mapa interactivo
 */

import { useState } from 'react'
import ParcelaMap from '../components/map/ParcelaMap'
import useAppStore from '../store/appStore'

export default function ParcelaView() {
  const [selectedBbox, setSelectedBbox] = useState(null)
  const fetchAnalysis = useAppStore((s) => s.fetchAnalysis)
  const parcelaData = useAppStore((s) => s.parcelaData)
  const isLoading = useAppStore((s) => s.isLoadingParcela)
  const isMobile = useAppStore((s) => s.isMobile)

  const handleBboxSelected = async (bbox) => {
    setSelectedBbox(bbox)
    await fetchAnalysis(bbox)
  }

  const area = parcelaData?.area_ha || 0
  const ndvi = parcelaData?.ndvi || {}

  return (
    <div className="page" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div>
        <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '4px' }}>
          🛰️ Mi Parcela
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
          Selecciona tu parcela con 2 clics para ver la imagen satelital real
        </p>
      </div>

      <div style={{
        height: isMobile ? '45vh' : '65vh',
        borderRadius: 'var(--radius-lg)',
        overflow: 'hidden',
        border: '1px solid var(--glass-border)',
      }}>
        <ParcelaMap onBboxSelected={handleBboxSelected} bbox={selectedBbox} />
      </div>

      {selectedBbox && (
        <div className="grid-3 animate-fade-in">
          <div className="card" style={{ padding: '20px' }}>
            <div className="text-mono text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>📍 Coordenadas</div>
            <div className="text-mono" style={{ fontSize: '0.75rem', lineHeight: 1.8 }}>
              <div>Lon: {selectedBbox[0].toFixed(4)}° — {selectedBbox[2].toFixed(4)}°</div>
              <div>Lat: {selectedBbox[1].toFixed(4)}° — {selectedBbox[3].toFixed(4)}°</div>
            </div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div className="text-mono text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>📐 Área</div>
            <div className="text-display text-bright" style={{ fontSize: '1.8rem', fontWeight: 800 }}>{area.toFixed(1)} ha</div>
          </div>
          <div className="card" style={{ padding: '20px' }}>
            <div className="text-mono text-muted" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>🌿 NDVI</div>
            <div className="text-display" style={{ fontSize: '1.8rem', fontWeight: 800, color: ndvi.ndvi_mean >= 0.4 ? 'var(--esmeralda-bright)' : 'var(--alert-orange)' }}>
              {ndvi.ndvi_mean?.toFixed(3) || '—'}
            </div>
          </div>
        </div>
      )}

      {isLoading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <span className="animate-pulse text-bright text-display">🛰️ Descargando imagen satelital...</span>
        </div>
      )}
    </div>
  )
}
