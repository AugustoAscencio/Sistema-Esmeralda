/**
 * WeatherStrip — Pronóstico compacto de 7 días
 */

const DAY_NAMES = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb']

function getWeatherIcon(precip, tempMax) {
  if (precip > 20) return '⛈️'
  if (precip > 5)  return '🌧️'
  if (precip > 1)  return '🌦️'
  if (tempMax > 38) return '🔥'
  return '☀️'
}

export default function WeatherStrip({ days = [] }) {
  if (!days.length) return null

  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      overflowX: 'auto',
      padding: '4px 0',
      scrollbarWidth: 'none',
    }}>
      {days.map((day, i) => {
        const date = new Date(day.date + 'T12:00:00')
        const dayName = DAY_NAMES[date.getDay()]
        const icon = getWeatherIcon(day.precipitation_mm, day.temp_max)

        return (
          <div key={i} style={{
            flex: '0 0 auto',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '4px',
            padding: '10px 14px',
            background: 'rgba(15, 36, 23, 0.6)',
            border: '1px solid var(--glass-border)',
            borderRadius: 'var(--radius-md)',
            minWidth: '72px',
          }}>
            <span style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              color: 'var(--text-muted)',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}>
              {dayName}
            </span>
            <span style={{ fontSize: '22px' }}>{icon}</span>
            <div style={{
              display: 'flex', gap: '4px', alignItems: 'baseline'
            }}>
              <span style={{
                fontFamily: 'var(--font-display)',
                fontSize: '0.85rem',
                fontWeight: 700,
                color: 'var(--text-primary)',
              }}>
                {Math.round(day.temp_max)}°
              </span>
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.65rem',
                color: 'var(--text-muted)',
              }}>
                {Math.round(day.temp_min)}°
              </span>
            </div>
            {day.precipitation_mm > 0 && (
              <span style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: '#38bdf8',
              }}>
                {day.precipitation_mm.toFixed(1)}mm
              </span>
            )}
          </div>
        )
      })}
    </div>
  )
}
