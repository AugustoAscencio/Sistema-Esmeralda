/**
 * Navbar — mobile-first navigation
 * Mobile: fixed bottom bar with icons
 * Desktop: top horizontal bar
 */

import { useLocation, useNavigate } from 'react-router-dom'
import useAppStore from '../../store/appStore'

const NAV_ITEMS = [
  { path: '/dashboard',  label: 'Panel',      icon: '📊' },
  { path: '/parcela',    label: 'Parcela',     icon: '🛰️' },
  { path: '/financiero', label: 'Finanzas',    icon: '💰' },
  { path: '/educacion',  label: 'Aprender',    icon: '📚' },
]

export default function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const toggleAgent = useAppStore((s) => s.toggleAgent)
  const showAgent = useAppStore((s) => s.showAgent)
  const isMobile = useAppStore((s) => s.isMobile)

  return (
    <>
      {/* Desktop top bar */}
      {!isMobile && (
        <nav style={{
          position: 'sticky',
          top: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          height: '64px',
          background: 'rgba(10, 26, 18, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid rgba(26, 61, 38, 0.5)',
        }}>
          <div
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer'
            }}
          >
            <span style={{ fontSize: '24px' }}>💎</span>
            <span style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.15rem',
              fontWeight: 800,
              color: 'var(--esmeralda-bright)',
              letterSpacing: '-0.02em',
            }}>
              Esmeralda
            </span>
          </div>

          <div style={{ display: 'flex', gap: '4px', alignItems: 'center' }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex', alignItems: 'center', gap: '6px',
                  padding: '8px 16px',
                  background: location.pathname === item.path
                    ? 'rgba(16, 180, 108, 0.12)' : 'transparent',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  color: location.pathname === item.path
                    ? 'var(--esmeralda-bright)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <span style={{ fontSize: '16px' }}>{item.icon}</span>
                {item.label}
              </button>
            ))}
            <button
              onClick={toggleAgent}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                padding: '8px 16px',
                background: showAgent ? 'rgba(16, 180, 108, 0.2)' : 'rgba(16, 180, 108, 0.08)',
                border: '1px solid var(--esmeralda-gem)',
                borderRadius: 'var(--radius-sm)',
                color: 'var(--esmeralda-bright)',
                fontFamily: 'var(--font-body)',
                fontSize: '0.85rem',
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              🤖 Agente IA
            </button>
          </div>
        </nav>
      )}

      {/* Mobile bottom bar */}
      {isMobile && (
        <nav style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: '68px',
          background: 'rgba(10, 26, 18, 0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          borderTop: '1px solid rgba(26, 61, 38, 0.5)',
          paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: '2px',
                padding: '6px 12px',
                background: 'transparent',
                border: 'none',
                color: location.pathname === item.path
                  ? 'var(--esmeralda-bright)' : 'var(--text-muted)',
                fontSize: '22px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              <span>{item.icon}</span>
              <span style={{
                fontSize: '9px',
                fontFamily: 'var(--font-mono)',
                letterSpacing: '0.05em',
                textTransform: 'uppercase',
              }}>
                {item.label}
              </span>
            </button>
          ))}
          {/* Agent button */}
          <button
            onClick={toggleAgent}
            style={{
              width: '48px', height: '48px',
              borderRadius: '50%',
              background: showAgent
                ? 'var(--esmeralda-bright)' : 'var(--esmeralda-gem)',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(16, 180, 108, 0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s ease',
            }}
          >
            🤖
          </button>
        </nav>
      )}
    </>
  )
}
