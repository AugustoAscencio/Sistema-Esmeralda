/**
 * Landing v4 — ESMERALDA uppercase, Space Grotesk, big particles, rich contrast
 */
import { useNavigate } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import GlobeHero from '../components/three/GlobeHero'

function ParticleCanvas() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const c = canvasRef.current; if (!c) return
    const ctx = c.getContext('2d'); let id
    let mouse = { x: -1000, y: -1000 }
    const resize = () => { c.width = window.innerWidth; c.height = window.innerHeight }
    resize(); window.addEventListener('resize', resize)
    window.addEventListener('mousemove', (e) => { mouse.x = e.clientX; mouse.y = e.clientY })

    const N = 90
    const P = Array.from({ length: N }, () => ({
      x: Math.random() * c.width, y: Math.random() * c.height,
      vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 4 + 1.5, // BIGGER
      pulse: Math.random() * Math.PI * 2,
    }))

    const draw = () => {
      ctx.clearRect(0, 0, c.width, c.height)
      for (const p of P) {
        p.x += p.vx; p.y += p.vy; p.pulse += 0.02
        if (p.x < -10) p.x = c.width + 10; if (p.x > c.width + 10) p.x = -10
        if (p.y < -10) p.y = c.height + 10; if (p.y > c.height + 10) p.y = -10
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 180) { p.x += (dx / dist) * 1.2; p.y += (dy / dist) * 1.2 }
        const alpha = 0.35 + Math.sin(p.pulse) * 0.15
        // Glow effect
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3)
        grad.addColorStop(0, `rgba(16, 185, 129, ${alpha})`)
        grad.addColorStop(0.5, `rgba(16, 185, 129, ${alpha * 0.3})`)
        grad.addColorStop(1, 'rgba(16, 185, 129, 0)')
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
        // Core
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(16, 185, 129, ${alpha + 0.2})`; ctx.fill()
      }
      // Lines
      for (let i = 0; i < N; i++) {
        for (let j = i + 1; j < N; j++) {
          const dx = P[i].x - P[j].x, dy = P[i].y - P[j].y, dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 160) {
            ctx.beginPath(); ctx.moveTo(P[i].x, P[i].y); ctx.lineTo(P[j].x, P[j].y)
            ctx.strokeStyle = `rgba(5, 150, 105, ${0.15 * (1 - dist / 160)})`; ctx.lineWidth = 1; ctx.stroke()
          }
        }
      }
      // Mouse lines
      for (const p of P) {
        const dx = p.x - mouse.x, dy = p.y - mouse.y, dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200) {
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(mouse.x, mouse.y)
          ctx.strokeStyle = `rgba(16, 185, 129, ${0.25 * (1 - dist / 200)})`; ctx.lineWidth = 1.2; ctx.stroke()
        }
      }
      id = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(id); window.removeEventListener('resize', resize) }
  }, [])
  return <canvas ref={canvasRef} style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }} />
}

export default function Landing() {
  const nav = useNavigate()
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ecfdf5 0%, #d1fae5 40%, #f0fdf4 100%)', position: 'relative' }}>
      <ParticleCanvas />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', position: 'relative', zIndex: 1 }}>

        {/* System label */}
        <div className="animate-in" style={{ marginBottom: '6px' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', fontWeight: 600, color: 'var(--emerald-700)', letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            Sistema
          </span>
        </div>

        {/* ESMERALDA — uppercase, Space Grotesk, heavy */}
        <h1 className="animate-in d1" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(3rem, 9vw, 6rem)',
          fontWeight: 700, color: 'var(--emerald-950)', textAlign: 'center',
          lineHeight: 1, marginBottom: '0', letterSpacing: '-0.04em',
          textTransform: 'uppercase',
        }}>
          ESMERALDA
        </h1>

        {/* Globe with glow container */}
        <div className="animate-in d2 animate-float" style={{
          width: '100%', maxWidth: '420px', height: 'clamp(240px, 38vh, 380px)',
          margin: '4px auto', position: 'relative',
          filter: 'drop-shadow(0 0 40px rgba(16,185,129,0.3))',
        }}>
          <GlobeHero />
        </div>

        {/* Tagline */}
        <p className="animate-in d3" style={{
          fontFamily: 'var(--font-display)', fontSize: 'clamp(0.9rem, 2.2vw, 1.15rem)',
          fontWeight: 400, color: 'var(--emerald-800)', textAlign: 'center',
          maxWidth: '460px', lineHeight: 1.6, marginBottom: '32px',
        }}>
          El campo visto desde el cielo.<br />El futuro construido desde la tierra.
        </p>

        {/* CTA */}
        <button className="btn btn-primary animate-in d4 animate-glow" onClick={() => nav('/parcela')}
          style={{ padding: '16px 48px', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--r-full)', letterSpacing: '-0.01em' }}>
          Comenzar Analisis
        </button>

        {/* Feature tags */}
        <div className="animate-in d5" style={{ display: 'flex', gap: '28px', marginTop: '44px', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['Copernicus Sentinel', 'IA Agronoma', 'Credito Parametrico'].map((t) => (
            <span key={t} style={{
              fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--emerald-700)',
              letterSpacing: '0.08em', textTransform: 'uppercase',
              padding: '6px 14px', background: 'rgba(255,255,255,0.6)', borderRadius: 'var(--r-full)',
              border: '1px solid var(--emerald-200)', backdropFilter: 'blur(8px)',
            }}>
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '18px 24px', textAlign: 'center',
        fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--emerald-700)',
        borderTop: '1px solid var(--emerald-200)', position: 'relative', zIndex: 1,
        background: 'rgba(255,255,255,0.5)', backdropFilter: 'blur(8px)',
      }}>
        Copernicus LAC Hackathon  ·  Reto 1: Resiliencia del Pequeno Agricultor  ·{' '}
        <span onClick={() => nav('/metodologia')} style={{ cursor: 'pointer', color: 'var(--emerald-600)', fontWeight: 600 }}>Metodologia</span>
      </div>
    </div>
  )
}
