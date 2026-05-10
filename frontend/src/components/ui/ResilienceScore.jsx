/**
 * ResilienceScore — Wrapper que combina ScoreSphere + label + credit info
 */

import ScoreSphere from '../three/ScoreSphere'
import { getScoreLabel } from '../../styles/theme'

export default function ResilienceScore({ score = 0, credit = {}, size = 220 }) {
  const label = getScoreLabel(score)

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
    }}>
      <ScoreSphere score={score} size={size} />

      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '4px',
      }}>
        <span className={`badge ${
          score >= 75 ? 'badge-ok' : score >= 55 ? 'badge-ok' : score >= 35 ? 'badge-warning' : 'badge-danger'
        }`}>
          {label}
        </span>

        {credit.recommendation && (
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-secondary)',
            marginTop: '4px',
          }}>
            💳 {credit.recommendation} • Hasta ${credit.max_amount_usd || 0} USD
          </span>
        )}
      </div>
    </div>
  )
}
