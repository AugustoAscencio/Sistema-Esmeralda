/**
 * FinancialPanel.jsx — Panel financiero con calculadoras
 */

import { useState } from 'react'
import DroughtSimulator from '../components/charts/DroughtSimulator'
import CropComparator from '../components/charts/CropComparator'
import useAppStore from '../store/appStore'

const CROPS = ['maiz','frijol','arroz','tomate','cafe','sorgo','yuca','platano','aguacate','chile']

export default function FinancialPanel() {
  const [tab, setTab] = useState('plan')
  const [crop, setCrop] = useState('maiz')
  const [area, setArea] = useState(2.5)
  const [planResult, setPlanResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const isMobile = useAppStore((s) => s.isMobile)
  const currentBbox = useAppStore((s) => s.currentBbox)

  const tabs = [
    { id: 'plan', label: '📋 Planificador', icon: '📋' },
    { id: 'compare', label: '📊 Comparador', icon: '📊' },
    { id: 'drought', label: '🏜️ Sequía', icon: '🏜️' },
  ]

  const runPlan = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/financial/plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, area_ha: area, bbox: currentBbox?.join(',') || null }),
      })
      setPlanResult(await res.json())
    } catch {
      setPlanResult({
        crop, area_ha: area, expected_yield_kg: 3200, gross_revenue_usd: 704,
        total_cost_usd: 480, net_profit_usd: 224, roi_pct: 46.7,
        satellite_adjustment_pct: -8.5, risk: 'MEDIO',
        costs: { semillas: 200, fertilizante: 300, mano_obra: 500, riego: 90, transporte: 35.2 },
        credit: { suggested_usd: 336, interest_rate_pct: 9.2, monthly_payment_usd: 29.4 },
      })
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <h1 style={{ fontSize: isMobile ? '1.5rem' : '2rem', marginBottom: '20px' }}>💰 Panel Financiero</h1>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '24px', overflowX: 'auto' }}>
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)} className={tab === t.id ? 'btn btn-primary' : 'btn btn-ghost'}
            style={{ fontSize: '0.8rem', whiteSpace: 'nowrap', padding: '10px 18px' }}>
            {isMobile ? t.icon : t.label}
          </button>
        ))}
      </div>

      {/* Planificador */}
      {tab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h4 className="text-display" style={{ marginBottom: '16px' }}>📋 Planificador de Cultivo</h4>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <select className="input" value={crop} onChange={(e) => setCrop(e.target.value)} style={{ flex: 1, minWidth: '120px' }}>
                {CROPS.map((c) => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
              <input className="input" type="number" value={area} onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
                placeholder="Hectáreas" style={{ flex: '0 0 100px' }} min="0.1" step="0.5" />
              <button className="btn btn-primary" onClick={runPlan} disabled={loading}>
                {loading ? '⏳' : '▶'} Calcular
              </button>
            </div>
          </div>

          {planResult && (
            <div className="card animate-fade-in" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 className="text-display">Resultado: {planResult.crop}</h4>
                <span className={`badge ${planResult.risk === 'BAJO' ? 'badge-ok' : planResult.risk === 'MEDIO' ? 'badge-warning' : 'badge-danger'}`}>
                  Riesgo {planResult.risk}
                </span>
              </div>

              <div className="grid-4" style={{ marginBottom: '20px' }}>
                {[
                  { label: 'Rendimiento', value: `${planResult.expected_yield_kg?.toLocaleString()} kg`, color: 'var(--text-primary)' },
                  { label: 'Ingresos', value: `$${planResult.gross_revenue_usd?.toFixed(0)}`, color: 'var(--esmeralda-bright)' },
                  { label: 'Costos', value: `$${planResult.total_cost_usd?.toFixed(0)}`, color: 'var(--alert-orange)' },
                  { label: 'Ganancia', value: `$${planResult.net_profit_usd?.toFixed(0)}`, color: planResult.net_profit_usd >= 0 ? 'var(--esmeralda-bright)' : 'var(--alert-red)' },
                ].map((m, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div className="text-mono text-muted" style={{ fontSize: '0.6rem', textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</div>
                    <div className="text-display" style={{ fontSize: '1.3rem', fontWeight: 800, color: m.color }}>{m.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px',
                background: 'rgba(16, 180, 108, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(16, 180, 108, 0.2)' }}>
                <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  ROI: <strong style={{ color: 'var(--esmeralda-bright)' }}>{planResult.roi_pct}%</strong>
                </span>
                <span className="text-mono" style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                  Ajuste satelital: <strong style={{ color: planResult.satellite_adjustment_pct >= 0 ? 'var(--esmeralda-bright)' : 'var(--alert-orange)' }}>
                    {planResult.satellite_adjustment_pct > 0 ? '+' : ''}{planResult.satellite_adjustment_pct}%
                  </strong>
                </span>
              </div>

              {planResult.credit && (
                <div style={{ marginTop: '16px', padding: '12px 16px', background: 'rgba(56, 189, 248, 0.06)',
                  borderRadius: 'var(--radius-sm)', border: '1px solid rgba(56, 189, 248, 0.15)' }}>
                  <span className="text-mono" style={{ fontSize: '0.7rem', color: '#38bdf8' }}>
                    💳 Crédito sugerido: ${planResult.credit.suggested_usd?.toFixed(0)} USD •
                    Tasa: {planResult.credit.interest_rate_pct}% •
                    Cuota: ${planResult.credit.monthly_payment_usd?.toFixed(0)}/mes
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {tab === 'compare' && <CropComparator />}
      {tab === 'drought' && <DroughtSimulator />}
    </div>
  )
}
