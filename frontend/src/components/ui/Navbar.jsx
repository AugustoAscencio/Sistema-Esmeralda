/**
 * Navbar v4 — Green gradient header, high contrast
 */
import { useLocation, useNavigate } from 'react-router-dom'
import useAppStore from '../../store/appStore'

const NAV = [
  { path: '/dashboard', label: 'Panel' },
  { path: '/parcela', label: 'Parcela' },
  { path: '/financiero', label: 'Finanzas' },
  { path: '/herramientas', label: 'Herramientas' },
  { path: '/educacion', label: 'Aprender' },
]

export default function Navbar() {
  const loc = useLocation()
  const nav = useNavigate()
  const toggleAgent = useAppStore((s) => s.toggleAgent)
  const showAgent = useAppStore((s) => s.showAgent)
  const isMobile = useAppStore((s) => s.isMobile)
  const analysisReady = useAppStore((s) => s.analysisReady)

  return (
    <>
      {!isMobile && (
        <nav style={{
          position: 'sticky', top: 0, zIndex: 100,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 32px', height: '56px',
          background: 'linear-gradient(135deg, #022c22, #064e3b)',
          borderBottom: '2px solid rgba(16,185,129,0.3)',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
        }}>
          <div onClick={() => nav('/')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: 'linear-gradient(135deg, #10b981, #34d399)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 12px rgba(16,185,129,0.4)' }}>
              <span style={{ fontSize: '13px', color: '#022c22', fontWeight: 800 }}>E</span>
            </div>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 700, color: '#fff', letterSpacing: '-0.02em', textTransform: 'uppercase' }}>Esmeralda</span>
          </div>
          <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
            {NAV.map((item) => {
              const active = loc.pathname === item.path
              return (
                <button key={item.path} onClick={() => nav(item.path)} style={{
                  padding: '7px 16px', background: active ? 'rgba(16,185,129,0.2)' : 'transparent',
                  border: active ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
                  borderRadius: 'var(--r-sm)',
                  color: active ? '#34d399' : 'rgba(255,255,255,0.6)',
                  fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: active ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.2s',
                }}>
                  {item.label}
                </button>
              )
            })}
            <div style={{ width: '1px', height: '22px', background: 'rgba(255,255,255,0.15)', margin: '0 10px' }} />
            {analysisReady && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', marginRight: '6px', boxShadow: '0 0 10px rgba(52,211,153,0.6)' }} />}
            <button onClick={toggleAgent} style={{
              padding: '7px 16px', borderRadius: 'var(--r-sm)',
              background: showAgent ? '#10b981' : 'rgba(255,255,255,0.08)',
              border: `1.5px solid ${showAgent ? '#10b981' : 'rgba(16,185,129,0.4)'}`,
              color: showAgent ? '#022c22' : '#6ee7b7',
              fontFamily: 'var(--font-sans)', fontSize: '0.82rem', fontWeight: 700,
              cursor: 'pointer', transition: 'all 0.2s',
            }}>
              Agente IA
            </button>
          </div>
        </nav>
      )}
      {isMobile && (
        <nav style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 100,
          display: 'flex', justifyContent: 'space-around', height: '60px',
          background: 'linear-gradient(135deg, #022c22, #064e3b)',
          borderTop: '2px solid rgba(16,185,129,0.3)',
          paddingBottom: 'env(safe-area-inset-bottom)',
          boxShadow: '0 -4px 20px rgba(0,0,0,0.2)',
        }}>
          {NAV.slice(0, 4).map((item) => {
            const active = loc.pathname === item.path
            return (
              <button key={item.path} onClick={() => nav(item.path)} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '3px', padding: '4px 8px', background: 'transparent', border: 'none',
                color: active ? '#34d399' : 'rgba(255,255,255,0.4)',
                fontSize: '0.6rem', fontFamily: 'var(--font-sans)', fontWeight: active ? 700 : 500, cursor: 'pointer',
              }}>
                <div style={{ width: '5px', height: '5px', borderRadius: '50%', background: active ? '#34d399' : 'transparent', boxShadow: active ? '0 0 8px rgba(52,211,153,0.6)' : 'none' }} />
                {item.label}
              </button>
            )
          })}
          <button onClick={toggleAgent} style={{
            width: '40px', height: '40px', borderRadius: '50%', alignSelf: 'center',
            background: showAgent ? '#10b981' : 'rgba(16,185,129,0.15)',
            border: '2px solid rgba(16,185,129,0.4)', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: showAgent ? '0 0 16px rgba(16,185,129,0.4)' : 'none',
          }}>
            <span style={{ fontSize: '11px', fontWeight: 800, color: showAgent ? '#022c22' : '#34d399' }}>IA</span>
          </button>
        </nav>
      )}
    </>
  )
}
