/**
 * CreditCard — Tarjeta de recomendación de microcrédito
 */

export default function CreditCard({ credit = {} }) {
  const isApproved = credit.recommendation === 'APROBADO' || credit.recommendation === 'CONDICIONAL'

  return (
    <div className="card card-glow" style={{
      border: isApproved
        ? '1px solid rgba(16, 180, 108, 0.3)'
        : '1px solid rgba(240, 64, 64, 0.2)',
    }}>
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        marginBottom: '16px',
      }}>
        <h4 style={{
          fontFamily: 'var(--font-display)',
          fontSize: '1rem',
          color: 'var(--text-primary)',
          margin: 0,
        }}>
          💳 Microcrédito Paramétrico
        </h4>
        <span className={`badge ${isApproved ? 'badge-ok' : 'badge-danger'}`}>
          {credit.recommendation || 'N/A'}
        </span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr',
        gap: '16px',
      }}>
        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>
            Monto Máximo
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: isApproved ? 'var(--esmeralda-bright)' : 'var(--text-muted)',
          }}>
            ${credit.max_amount_usd || 0}
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}>
            USD
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>
            Tasa Interés
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.4rem',
            fontWeight: 800,
            color: 'var(--text-primary)',
          }}>
            {credit.interest_rate_pct || 0}%
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}>
            anual
          </div>
        </div>

        <div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}>
            Activado por
          </div>
          <div style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1rem',
            fontWeight: 700,
            color: '#38bdf8',
          }}>
            🛰️ Satélite
          </div>
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-muted)',
          }}>
            NDVI + Humedad
          </div>
        </div>
      </div>

      {isApproved && (
        <button className="btn btn-primary" style={{
          width: '100%', marginTop: '16px',
        }}>
          Solicitar Microcrédito
        </button>
      )}
    </div>
  )
}
