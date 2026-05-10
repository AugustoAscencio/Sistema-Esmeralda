/**
 * Methodology.jsx — Apartado técnico semioculto para evaluadores
 */

export default function Methodology() {
  return (
    <div className="page" style={{ maxWidth: '900px' }}>
      <h1 style={{ marginBottom: '8px' }}>🔬 Metodología Técnica</h1>
      <p className="text-secondary" style={{ marginBottom: '32px', fontSize: '0.9rem' }}>
        Documentación técnica del Sistema Esmeralda para evaluadores del hackathon
      </p>

      {/* NDVI */}
      <section className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 className="text-display text-bright" style={{ marginBottom: '12px' }}>1. Índice NDVI</h3>
        <div className="text-mono" style={{ padding: '12px 16px', background: 'rgba(10,26,18,0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem', color: 'var(--esmeralda-pale)', marginBottom: '12px' }}>
          NDVI = (B08 - B04) / (B08 + B04)
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Donde B08 es la banda infrarroja cercana y B04 es la banda roja de Sentinel-2 Level-2A.
          Valores van de -1 a +1. Vegetación saludable produce valores de 0.4 a 0.9.
          Usamos mosaico con menor cobertura de nubes (leastCC) en los últimos 30 días.
        </p>
      </section>

      {/* Score */}
      <section className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 className="text-display text-bright" style={{ marginBottom: '12px' }}>2. Score de Resiliencia (0-100)</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--esmeralda-mid)' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-muted)' }}>Componente</th>
                <th style={{ padding: '8px', textAlign: 'center', color: 'var(--text-muted)' }}>Máx</th>
                <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-muted)' }}>Fórmula</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Salud (NDVI)', '40', 'min(40, ndvi_mean × 50)'],
                ['Estabilidad', '25', 'max(0, 25 − ndvi_std × 150)'],
                ['Agua', '20', 'min(20, moisture% × 0.2) ± ajuste lluvia'],
                ['Clima', '15', '15 − penalizaciones por calor extremo'],
              ].map(([c, m, f], i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(26,61,38,0.3)' }}>
                  <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{c}</td>
                  <td style={{ padding: '8px', textAlign: 'center', color: 'var(--esmeralda-bright)' }}>{m}</td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Financial */}
      <section className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 className="text-display text-bright" style={{ marginBottom: '12px' }}>3. Ajuste Financiero Satelital</h3>
        <div className="text-mono" style={{ padding: '12px 16px', background: 'rgba(10,26,18,0.8)', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--esmeralda-pale)', lineHeight: 1.8, marginBottom: '12px' }}>
          <div>ndvi_factor = 0.5 + ndvi_mean × 0.8</div>
          <div>moisture_factor = 0.7 + (moisture% / 100) × 0.6</div>
          <div>rendimiento = yield_base × área × ndvi_factor × moisture_factor</div>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
          Los factores satelitales ajustan el rendimiento base de cada cultivo. Un NDVI alto (0.8)
          produce un factor de 1.14×, mientras que uno bajo (0.2) reduce a 0.66×. Esto convierte el
          rendimiento teórico en una estimación realista basada en evidencia visual del satélite.
        </p>
      </section>

      {/* Data Sources */}
      <section className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 className="text-display text-bright" style={{ marginBottom: '12px' }}>4. Fuentes de Datos</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--esmeralda-mid)' }}>
                <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-muted)' }}>Fuente</th>
                <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-muted)' }}>Dato</th>
                <th style={{ padding: '8px', textAlign: 'left', color: 'var(--text-muted)' }}>Costo</th>
              </tr>
            </thead>
            <tbody>
              {[
                ['Sentinel-2 L2A', 'NDVI, True Color, NDWI', 'Gratuito'],
                ['Sentinel-1 GRD', 'Humedad del suelo (SAR)', 'Gratuito'],
                ['Copernicus DEM', 'Elevación GLO-30', 'Gratuito'],
                ['Open-Meteo', 'Pronóstico 7 días', 'Gratuito, sin API key'],
                ['FAO FAOSTAT', 'Precios de cultivos', 'Gratuito'],
              ].map(([s, d, c], i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(26,61,38,0.3)' }}>
                  <td style={{ padding: '8px', color: 'var(--esmeralda-bright)' }}>{s}</td>
                  <td style={{ padding: '8px', color: 'var(--text-primary)' }}>{d}</td>
                  <td style={{ padding: '8px', color: 'var(--text-secondary)' }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Crops DB */}
      <section className="card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 className="text-display text-bright" style={{ marginBottom: '12px' }}>5. Base de Datos de Cultivos</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'var(--font-mono)', fontSize: '0.7rem' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--esmeralda-mid)' }}>
                {['Cultivo', 'Precio USD/kg', 'Ciclo (días)', 'Agua mm', 'Rend. kg/ha'].map((h) => (
                  <th key={h} style={{ padding: '6px 8px', textAlign: 'left', color: 'var(--text-muted)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ['Maíz', '0.22', '120', '550', '3,500'],
                ['Frijol', '1.10', '90', '350', '1,200'],
                ['Arroz', '0.35', '130', '1,200', '4,500'],
                ['Tomate', '0.45', '90', '600', '40,000'],
                ['Café', '2.80', '365', '1,500', '1,500'],
                ['Sorgo', '0.18', '100', '400', '3,000'],
                ['Yuca', '0.15', '270', '800', '18,000'],
                ['Plátano', '0.20', '365', '1,200', '20,000'],
                ['Aguacate', '1.50', '365', '1,000', '8,000'],
                ['Chile', '1.20', '90', '500', '8,000'],
              ].map(([c, p, cy, w, y], i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(26,61,38,0.2)' }}>
                  <td style={{ padding: '6px 8px', color: 'var(--text-primary)' }}>{c}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--esmeralda-bright)' }}>{p}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{cy}</td>
                  <td style={{ padding: '6px 8px', color: '#38bdf8' }}>{w}</td>
                  <td style={{ padding: '6px 8px', color: 'var(--text-secondary)' }}>{y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Tech Stack */}
      <section className="card" style={{ padding: '24px' }}>
        <h3 className="text-display text-bright" style={{ marginBottom: '12px' }}>6. Stack Tecnológico</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {['Python', 'FastAPI', 'React 18', 'Vite', 'MapLibre GL', 'Three.js (R3F)', 'Recharts', 'Zustand',
            'Sentinel Hub API', 'Open-Meteo', 'Ollama', 'SQLite', 'scikit-learn'].map((t) => (
            <span key={t} className="badge badge-info">{t}</span>
          ))}
        </div>
      </section>

      <div className="text-mono text-center text-muted" style={{ fontSize: '0.65rem', marginTop: '32px', paddingBottom: '24px' }}>
        Sistema Esmeralda • Copernicus LAC Hackathon 2024 • Todas las APIs son gratuitas
      </div>
    </div>
  )
}
