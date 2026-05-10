/**
 * RainfallChart — Precipitación 7 días
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
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
      <div style={{ color: '#38bdf8', fontWeight: 700 }}>
        {payload[0].value.toFixed(1)} mm
      </div>
    </div>
  )
}

export default function RainfallChart({ days = [] }) {
  if (!days.length) return null

  const data = days.map((d) => ({
    date: d.date.slice(5),
    precipitation: d.precipitation_mm,
  }))

  return (
    <div className="card" style={{ padding: '20px' }}>
      <h4 style={{
        fontFamily: 'var(--font-display)',
        fontSize: '0.95rem',
        color: 'var(--text-primary)',
        marginBottom: '16px',
      }}>
        🌧️ Precipitación 7 días
      </h4>

      <ResponsiveContainer width="100%" height={160}>
        <BarChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(26, 61, 38, 0.4)" />
          <XAxis
            dataKey="date"
            tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
            axisLine={{ stroke: COLORS.mid }}
          />
          <YAxis
            tick={{ fill: COLORS.textMuted, fontSize: 10, fontFamily: 'Space Mono' }}
            axisLine={{ stroke: COLORS.mid }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="precipitation"
            fill="#38bdf8"
            radius={[4, 4, 0, 0]}
            opacity={0.8}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
