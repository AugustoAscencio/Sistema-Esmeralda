/**
 * NDVITimeline — Evolución NDVI histórico (30 días)
 */

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, AreaChart } from 'recharts'
import { COLORS } from '../../styles/theme'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{
      background: 'rgba(10, 26, 18, 0.95)',
      border: '1px solid var(--esmeralda-mid)',
      borderRadius: '8px',
      padding: '10px 14px',
      fontFamily: 'var(--font-mono)',
      fontSize: '0.75rem',
    }}>
      <div style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>{label}</div>
      <div style={{ color: COLORS.bright, fontWeight: 700 }}>
        NDVI: {payload[0].value.toFixed(3)}
      </div>
    </div>
  )
}

export default function NDVITimeline({ data = [] }) {
  if (!data.length) return null

  return (
    <div className="card" style={{ padding: '20px' }}>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        marginBottom: '16px',
      }}>
        📈 NDVI Histórico (30 días)
      </h4>

      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <defs>
            <linearGradient id="ndviGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={COLORS.gem} stopOpacity={0.3} />
              <stop offset="95%" stopColor={COLORS.gem} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 61, 38, 0.4)" />
          <XAxis
            dataKey="date"
            tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
            tickFormatter={(val) => val.slice(5)}
            axisLine={{ stroke: COLORS.mid }}
          />
          <YAxis
            domain={[0, 1]}
            tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
            axisLine={{ stroke: COLORS.mid }}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0.3} stroke={COLORS.red} strokeDasharray="5 5" label="" />
          <ReferenceLine y={0.6} stroke={COLORS.gem} strokeDasharray="5 5" label="" />
          <Area
            type="monotone"
            dataKey="ndvi"
            stroke={COLORS.bright}
            fill="url(#ndviGradient)"
            strokeWidth={2}
            dot={{ fill: COLORS.bright, r: 3, strokeWidth: 0 }}
            activeDot={{ fill: COLORS.bright, r: 5, strokeWidth: 2, stroke: '#fff' }}
          />
        </AreaChart>
      </ResponsiveContainer>

      <div style={{
        display: 'flex', gap: '16px', marginTop: '8px',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)',
      }}>
        <span>🔴 {'<'} 0.3 — Crítico</span>
        <span>🟢 {'>'} 0.6 — Excelente</span>
      </div>
    </div>
  )
}
