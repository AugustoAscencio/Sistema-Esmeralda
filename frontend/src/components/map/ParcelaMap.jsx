/**
 * ParcelaMap — MapLibre GL con dibujo de bbox y overlay NDVI
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'

export default function ParcelaMap({ onBboxSelected, bbox = null }) {
  const mapContainer = useRef(null)
  const map = useRef(null)
  const [drawing, setDrawing] = useState(false)
  const [startPoint, setStartPoint] = useState(null)
  const [viewMode, setViewMode] = useState('ndvi') // ndvi | truecolor
  const [hasOverlay, setHasOverlay] = useState(false)

  useEffect(() => {
    if (map.current) return

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          'osm': {
            type: 'raster',
            tiles: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png'],
            tileSize: 256,
            attribution: '© OpenStreetMap'
          }
        },
        layers: [{ id: 'osm-tiles', type: 'raster', source: 'osm' }]
      },
      center: [-87.16, 12.66],
      zoom: 13,
    })
    map.current.addControl(new maplibregl.NavigationControl(), 'top-left')

    // Click handler
    map.current.on('click', (e) => {
      if (!drawing) return

      if (!startPoint) {
        setStartPoint([e.lngLat.lng, e.lngLat.lat])

        // Add marker
        new maplibregl.Marker({ color: '#1de98b' })
          .setLngLat([e.lngLat.lng, e.lngLat.lat])
          .addTo(map.current)
      } else {
        const bboxResult = [
          Math.min(startPoint[0], e.lngLat.lng),
          Math.min(startPoint[1], e.lngLat.lat),
          Math.max(startPoint[0], e.lngLat.lng),
          Math.max(startPoint[1], e.lngLat.lat),
        ]
        setDrawing(false)
        setStartPoint(null)

        // Draw rectangle
        drawBboxRect(bboxResult)

        if (onBboxSelected) {
          onBboxSelected(bboxResult)
        }

        // Load NDVI overlay
        loadOverlay(bboxResult, 'ndvi')
      }
    })

    return () => {
      if (map.current) map.current.remove()
      map.current = null
    }
  }, [])

  const drawBboxRect = (b) => {
    const m = map.current
    if (!m) return

    // Remove existing
    if (m.getSource('bbox-rect')) {
      m.removeLayer('bbox-fill')
      m.removeLayer('bbox-outline')
      m.removeSource('bbox-rect')
    }

    m.addSource('bbox-rect', {
      type: 'geojson',
      data: {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [[
            [b[0], b[1]], [b[2], b[1]], [b[2], b[3]], [b[0], b[3]], [b[0], b[1]]
          ]]
        }
      }
    })

    m.addLayer({
      id: 'bbox-fill',
      type: 'fill',
      source: 'bbox-rect',
      paint: { 'fill-color': '#10b46c', 'fill-opacity': 0.08 }
    })

    m.addLayer({
      id: 'bbox-outline',
      type: 'line',
      source: 'bbox-rect',
      paint: {
        'line-color': '#1de98b',
        'line-width': 2,
        'line-dasharray': [3, 2],
      }
    })
  }

  const loadOverlay = async (b, mode) => {
    const m = map.current
    if (!m) return

    const endpoint = mode === 'ndvi' ? 'ndvi-image' : 'true-color'
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/parcela/${endpoint}?bbox=${b.join(',')}`
      )
      if (!response.ok) return

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)

      if (m.getSource('satellite-overlay')) {
        m.removeLayer('satellite-layer')
        m.removeSource('satellite-overlay')
      }

      m.addSource('satellite-overlay', {
        type: 'image',
        url,
        coordinates: [
          [b[0], b[3]], [b[2], b[3]],
          [b[2], b[1]], [b[0], b[1]]
        ]
      })

      m.addLayer({
        id: 'satellite-layer',
        type: 'raster',
        source: 'satellite-overlay',
        paint: { 'raster-opacity': 0.75, 'raster-fade-duration': 300 }
      }, 'bbox-fill')

      setHasOverlay(true)
    } catch (err) {
      console.error('Error loading overlay:', err)
    }
  }

  const toggleViewMode = () => {
    const newMode = viewMode === 'ndvi' ? 'truecolor' : 'ndvi'
    setViewMode(newMode)
    if (bbox) {
      loadOverlay(bbox, newMode)
    }
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      <div
        ref={mapContainer}
        style={{
          width: '100%', height: '100%',
          borderRadius: 'var(--radius-lg)',
          cursor: drawing ? 'crosshair' : 'grab',
        }}
      />

      {/* Controls overlay */}
      <div style={{
        position: 'absolute', top: 12, right: 12,
        display: 'flex', flexDirection: 'column', gap: '8px',
        zIndex: 10,
      }}>
        <button
          onClick={() => {
            setDrawing(!drawing)
            setStartPoint(null)
          }}
          style={{
            padding: '10px 16px',
            background: drawing ? 'var(--esmeralda-bright)' : 'rgba(15, 36, 23, 0.9)',
            color: drawing ? 'var(--esmeralda-deep)' : 'var(--text-primary)',
            border: '1px solid var(--esmeralda-gem)',
            borderRadius: 'var(--radius-sm)',
            fontFamily: 'var(--font-display)',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            backdropFilter: 'blur(8px)',
            transition: 'all 0.2s ease',
          }}
        >
          {drawing
            ? (startPoint ? '📍 Clic segundo punto...' : '📍 Clic primer punto...')
            : '✏️ Seleccionar parcela'}
        </button>

        {hasOverlay && (
          <button
            onClick={toggleViewMode}
            style={{
              padding: '10px 16px',
              background: 'rgba(15, 36, 23, 0.9)',
              color: 'var(--text-primary)',
              border: '1px solid var(--esmeralda-mid)',
              borderRadius: 'var(--radius-sm)',
              fontFamily: 'var(--font-display)',
              fontSize: '0.75rem',
              fontWeight: 600,
              cursor: 'pointer',
              backdropFilter: 'blur(8px)',
            }}
          >
            {viewMode === 'ndvi' ? '🌿 NDVI' : '📷 Color Real'}
          </button>
        )}
      </div>

      {/* Drawing instruction */}
      {drawing && (
        <div style={{
          position: 'absolute', bottom: 20, left: '50%', transform: 'translateX(-50%)',
          padding: '10px 20px',
          background: 'rgba(10, 26, 18, 0.9)',
          border: '1px solid var(--esmeralda-gem)',
          borderRadius: 'var(--radius-md)',
          fontFamily: 'var(--font-body)',
          fontSize: '0.85rem',
          color: 'var(--esmeralda-bright)',
          backdropFilter: 'blur(8px)',
          zIndex: 10,
          whiteSpace: 'nowrap',
        }}>
          {startPoint
            ? '🎯 Haz clic en la esquina opuesta de tu parcela'
            : '📍 Haz clic en una esquina de tu parcela'}
        </div>
      )}
    </div>
  )
}
