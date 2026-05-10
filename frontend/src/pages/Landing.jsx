/**
 * Landing.jsx — Hero page con GlobeHero 3D
 */

import { useNavigate } from 'react-router-dom'
import GlobeHero from '../components/three/GlobeHero'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: 'linear-gradient(180deg, #0a1a12 0%, #0f2417 50%, #0a1a12 100%)',
      overflow: 'hidden',
      position: 'relative',
    }}>
      {/* Glow effect background */}
      <div style={{
        position: 'absolute',
        top: '20%', left: '50%',
        width: '600px', height: '600px',
        transform: 'translate(-50%, -30%)',
        background: 'radial-gradient(circle, rgba(16, 180, 108, 0.08) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Main content */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Logo + Name */}
        <div className="animate-fade-in" style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          marginBottom: '8px',
        }}>
          <span style={{ fontSize: '36px' }}>💎</span>
          <span style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 600,
            color: 'var(--esmeralda-gem)',
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
          }}>
            Sistema
          </span>
        </div>

        <h1 className="animate-fade-in delay-1" style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(2.5rem, 8vw, 5rem)',
          fontWeight: 800,
          color: 'var(--esmeralda-bright)',
          textAlign: 'center',
          lineHeight: 1,
          marginBottom: '12px',
          letterSpacing: '-0.03em',
          textShadow: '0 0 60px rgba(29, 233, 139, 0.3)',
        }}>
          Esmeralda
        </h1>

        {/* Globe 3D */}
        <div className="animate-fade-in delay-2" style={{
          width: '100%',
          maxWidth: '500px',
          height: 'clamp(280px, 45vh, 420px)',
          margin: '0 auto',
        }}>
          <GlobeHero />
        </div>

        {/* Tagline */}
        <p className="animate-fade-in delay-3" style={{
          fontFamily: 'var(--font-body)',
          fontSize: 'clamp(0.9rem, 2.5vw, 1.15rem)',
          color: 'var(--text-secondary)',
          textAlign: 'center',
          maxWidth: '500px',
          lineHeight: 1.6,
          marginBottom: '32px',
          fontStyle: 'italic',
        }}>
          "El campo visto desde el cielo.<br />
          El futuro construido desde la tierra."
        </p>

        {/* CTA Button */}
        <button
          className="btn btn-primary animate-fade-in delay-4 animate-glow"
          onClick={() => navigate('/dashboard')}
          style={{
            padding: '16px 40px',
            fontSize: '1rem',
            fontWeight: 700,
            borderRadius: 'var(--radius-xl)',
            letterSpacing: '0.02em',
          }}
        >
          🌱 Ingresar al Sistema
        </button>

        {/* Subtitle */}
        <div className="animate-fade-in delay-5" style={{
          display: 'flex',
          gap: '24px',
          marginTop: '32px',
          flexWrap: 'wrap',
          justifyContent: 'center',
        }}>
          {[
            { icon: '🛰️', text: 'Copernicus Sentinel' },
            { icon: '🧠', text: 'IA Agrónoma' },
            { icon: '💳', text: 'Crédito Paramétrico' },
          ].map((item, i) => (
            <div key={i} style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'var(--text-muted)',
              letterSpacing: '0.05em',
            }}>
              <span>{item.icon}</span>
              <span>{item.text}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '16px 24px',
        textAlign: 'center',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'var(--text-muted)',
        borderTop: '1px solid rgba(26, 61, 38, 0.3)',
      }}>
        Copernicus LAC Hackathon 2024 • Reto 1: Resiliencia del Pequeño Agricultor •{' '}
        <span
          onClick={() => navigate('/metodologia')}
          style={{ cursor: 'pointer', color: 'var(--esmeralda-gem)', textDecoration: 'underline' }}
        >
          ¿Cómo funciona?
        </span>
      </div>
    </div>
  )
}
