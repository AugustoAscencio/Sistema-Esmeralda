/**
 * AlertCard — Tarjeta de alerta con nivel de severidad
 */

import { getAlertColor } from '../../styles/theme'

const LEVEL_ICONS = {
  CRITICO: '🔴',
  ALERTA: '🟠',
  PRECAUCION: '🟡',
  OK: '🟢',
}

export default function AlertCard({ alert }) {
  const color = getAlertColor(alert.level)

  return (
    <div style={{
      background: 'var(--glass-bg)',
      backdropFilter: 'var(--glass-blur)',
      border: `1px solid ${color}33`,
      borderLeft: `4px solid ${color}`,
      borderRadius: 'var(--radius-md)',
      padding: '16px 20px',
      transition: 'all 0.3s ease',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px'
      }}>
        <span style={{ fontSize: '16px' }}>
          {LEVEL_ICONS[alert.level] || '⚪'}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 700,
          color,
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
        }}>
          {alert.level}
        </span>
        {alert.type && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}>
            • {alert.type}
          </span>
        )}
      </div>
      <p style={{
        fontFamily: 'var(--font-body)',
        fontSize: '0.9rem',
        color: 'var(--text-primary)',
        lineHeight: 1.5,
        margin: 0,
      }}>
        {alert.message}
      </p>
    </div>
  )
}
