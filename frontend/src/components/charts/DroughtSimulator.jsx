/**
 * DroughtSimulator — Impacto financiero de sequía progresiva
 */

import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'
import { COLORS } from '../../styles/theme'

const CROPS = ['maiz', 'frijol', 'arroz', 'tomate', 'cafe', 'sorgo', 'yuca', 'platano', 'aguacate', 'chile']

export default function DroughtSimulator() {
  const [crop, setCrop] = useState('maiz')
  const [area, setArea] = useState(2.5)
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)

  const simulate = async () => {
    setLoading(true)
    try {
      const res = await fetch('http://localhost:8000/api/v1/financial/drought', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ crop, area_ha: area, drought_pct: 80 }),
      })
      const result = await res.json()
      setData(result.scenarios)
    } catch {
      // Demo data
      setData([
        { drought_pct: 0, net_profit_usd: 450, yield_kg: 3800, credit_trigger: false },
        { drought_pct: 10, net_profit_usd: 380, yield_kg: 3400, credit_trigger: false },
        { drought_pct: 20, net_profit_usd: 310, yield_kg: 3000, credit_trigger: false },
        { drought_pct: 30, net_profit_usd: 220, yield_kg: 2600, credit_trigger: false },
        { drought_pct: 40, net_profit_usd: 120, yield_kg: 2200, credit_trigger: true },
        { drought_pct: 50, net_profit_usd: 10, yield_kg: 1800, credit_trigger: true },
        { drought_pct: 60, net_profit_usd: -120, yield_kg: 1400, credit_trigger: true },
        { drought_pct: 70, net_profit_usd: -280, yield_kg: 1000, credit_trigger: true },
        { drought_pct: 80, net_profit_usd: -450, yield_kg: 600, credit_trigger: true },
      ])
    }
    setLoading(false)
  }

  return (
    <div className="card" style={{ padding: '24px' }}>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '1rem',
        marginBottom: '16px',
      }}>
        🏜️ Simulador de Impacto por Sequía
      </h4>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <select
          className="input"
          value={crop}
          onChange={(e) => setCrop(e.target.value)}
          style={{ flex: '1', minWidth: '120px' }}
        >
          {CROPS.map((c) => (
            <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
          ))}
        </select>
        <input
          className="input"
          type="number"
          value={area}
          onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
          placeholder="Hectáreas"
          style={{ flex: '0 0 100px' }}
          min="0.1"
          step="0.5"
        />
        <button className="btn btn-primary" onClick={simulate} disabled={loading}>
          {loading ? '⏳' : '▶'} Simular
        </button>
      </div>

      {data && (
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 5 }}>
            <defs>
              <linearGradient id="droughtGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.red} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.red} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 61, 38, 0.4)" />
            <XAxis
              dataKey="drought_pct"
              tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
              tickFormatter={(v) => `${v}%`}
              axisLine={{ stroke: COLORS.mid }}
            />
            <YAxis
              tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
              tickFormatter={(v) => `$${v}`}
              axisLine={{ stroke: COLORS.mid }}
            />
            <Tooltip
              formatter={(v) => [`$${v.toFixed(0)}`, 'Ganancia neta']}
              contentStyle={{
                background: 'rgba(10, 26, 18, 0.95)',
                border: '1px solid var(--esmeralda-mid)',
                borderRadius: '8px',
                fontFamily: 'Space Mono',
                fontSize: '0.75rem',
              }}
            />
            <ReferenceLine y={0} stroke={COLORS.orange} strokeDasharray="5 5" />
            <ReferenceLine x={40} stroke={COLORS.yellow} strokeDasharray="3 3" label={{
              value: "Crédito activado", fill: COLORS.yellow, fontSize: 10
            }} />
            <Area
              type="monotone"
              dataKey="net_profit_usd"
              stroke={COLORS.red}
              fill="url(#droughtGrad)"
              strokeWidth={2}
              dot={{ fill: COLORS.red, r: 3 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}
