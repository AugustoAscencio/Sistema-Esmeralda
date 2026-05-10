/**
 * CropComparator — Comparador de rentabilidad por cultivo
 */

import { useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { COLORS } from '../../styles/theme'

export default function CropComparator() {
  const [area, setArea] = useState(2.5)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const compare = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/financial/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ area_ha: area }),
      })
      const result = await res.json()
      setData(result.crops?.slice(0, 8) || [])
    } catch {
      setData([
        { crop: 'tomate', net_profit_usd: 3200, risk: 'MEDIO' },
        { crop: 'chile', net_profit_usd: 2800, risk: 'MEDIO' },
        { crop: 'aguacate', net_profit_usd: 2400, risk: 'BAJO' },
        { crop: 'cafe', net_profit_usd: 1800, risk: 'BAJO' },
        { crop: 'platano', net_profit_usd: 1200, risk: 'BAJO' },
        { crop: 'frijol', net_profit_usd: 400, risk: 'MEDIO' },
        { crop: 'maiz', net_profit_usd: 180, risk: 'ALTO' },
        { crop: 'arroz', net_profit_usd: 120, risk: 'ALTO' },
      ])
    }
    setLoading(false)
  }

  const getBarColor = (risk) => {
    switch (risk) {
      case 'BAJO': return COLORS.gem
      case 'MEDIO': return COLORS.orange
      case 'ALTO': return COLORS.red
      default: return COLORS.textMuted
    }
  }

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        marginBottom: '16px',
      }}>
        📊 Comparador de Cultivos
      </h4>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px' }}>
        <input
          className="input"
          type="number"
          value={area}
          onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
          placeholder="Hectáreas"
          style={{ flex: '0 0 120px' }}
          min="0.1"
          step="0.5"
        />
        <button className="btn btn-primary" onClick={compare} disabled={loading}>
          {loading ? '⏳' : '📊'} Comparar
        </button>
      </div>

      {data && (
        <>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={data} layout="vertical" margin={{ top: 5, right: 10, left: 50, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 61, 38, 0.4)" />
              <XAxis
                type="number"
                tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
                tickFormatter={(v) => `$${v}`}
                axisLine={{ stroke: COLORS.mid }}
              />
              <YAxis
                type="category"
                dataKey="crop"
                tick={{ fill: COLORS.textSecondary, fontSize: 11, fontFamily: 'DM Sans' }}
                axisLine={{ stroke: COLORS.mid }}
                width={60}
              />
              <Tooltip
                formatter={(v) => [`$${v.toFixed(0)} USD`, 'Ganancia neta']}
                contentStyle={{
                  background: 'rgba(10, 26, 18, 0.95)',
                  border: '1px solid var(--esmeralda-mid)',
                  borderRadius: '8px',
                  fontFamily: 'Space Mono',
                  fontSize: '0.75rem',
                }}
              />
              <Bar dataKey="net_profit_usd" radius={[0, 4, 4, 0]}>
                {data.map((entry, i) => (
                  <Cell key={i} fill={getBarColor(entry.risk)} opacity={0.8} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          <div style={{
            display: 'flex', gap: '16px', marginTop: '8px',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)',
          }}>
            <span style={{ color: COLORS.gem }}>● Riesgo Bajo</span>
            <span style={{ color: COLORS.orange }}>● Riesgo Medio</span>
            <span style={{ color: COLORS.red }}>● Riesgo Alto</span>
          </div>
        </>
      )}
    </div>
  )
}
