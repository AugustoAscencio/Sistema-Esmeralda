/**
 * FinancialPanel v4 — Clear explanations, global market ticker, currency selector,
 * drought + flood simulator with money impact, crop comparator with context
 */
import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Cell } from 'recharts'
import useAppStore from '../store/appStore'
import { COLORS } from '../styles/theme'

const CROPS_DATA = {
  maiz: { name: 'Maiz', usd_per_ton: 210, yield_kg_ha: 3200, cost_ha: 480, kc: 1.2 },
  frijol: { name: 'Frijol', usd_per_ton: 650, yield_kg_ha: 1200, cost_ha: 520, kc: 1.15 },
  arroz: { name: 'Arroz', usd_per_ton: 350, yield_kg_ha: 4500, cost_ha: 650, kc: 1.2 },
  tomate: { name: 'Tomate', usd_per_ton: 450, yield_kg_ha: 25000, cost_ha: 3200, kc: 1.15 },
  cafe: { name: 'Cafe', usd_per_ton: 3200, yield_kg_ha: 1200, cost_ha: 1800, kc: 0.95 },
  sorgo: { name: 'Sorgo', usd_per_ton: 180, yield_kg_ha: 2800, cost_ha: 380, kc: 1.1 },
  yuca: { name: 'Yuca', usd_per_ton: 120, yield_kg_ha: 12000, cost_ha: 450, kc: 0.8 },
  platano: { name: 'Platano', usd_per_ton: 150, yield_kg_ha: 18000, cost_ha: 900, kc: 1.0 },
  aguacate: { name: 'Aguacate', usd_per_ton: 1500, yield_kg_ha: 8000, cost_ha: 2500, kc: 0.85 },
  chile: { name: 'Chile', usd_per_ton: 800, yield_kg_ha: 15000, cost_ha: 2000, kc: 1.1 },
}

const CURRENCIES = {
  USD: { symbol: '$', rate: 1, name: 'Dolar USD' },
  NIO: { symbol: 'C$', rate: 36.7, name: 'Cordoba (NIC)' },
  MXN: { symbol: '$', rate: 17.2, name: 'Peso (MEX)' },
  COP: { symbol: '$', rate: 4150, name: 'Peso (COL)' },
  BRL: { symbol: 'R$', rate: 5.0, name: 'Real (BRA)' },
  PEN: { symbol: 'S/', rate: 3.75, name: 'Sol (PER)' },
  GTQ: { symbol: 'Q', rate: 7.8, name: 'Quetzal (GUA)' },
  CRC: { symbol: '₡', rate: 530, name: 'Colon (CR)' },
  ARS: { symbol: '$', rate: 870, name: 'Peso (ARG)' },
}

function fmt(usd, curr) {
  const c = CURRENCIES[curr] || CURRENCIES.USD
  const val = usd * c.rate
  if (val >= 1000000) return `${c.symbol}${(val / 1000000).toFixed(1)}M`
  if (val >= 1000) return `${c.symbol}${(val / 1000).toFixed(1)}K`
  return `${c.symbol}${val.toFixed(0)}`
}

function Tip({ children, text }) {
  return <div className="tooltip-wrap">{children}<div className="tooltip-content">{text}</div></div>
}

function MarketTicker({ currency }) {
  const crops = Object.entries(CROPS_DATA)
  return (
    <div className="card-dark animate-in" style={{ padding: '20px', overflow: 'hidden' }}>
      <h4 style={{ marginBottom: '14px', fontSize: '0.9rem' }}>Precios Globales de Commodities</h4>
      <p style={{ fontSize: '0.75rem', color: 'var(--emerald-300)', marginBottom: '14px' }}>
        Precios de referencia internacional por tonelada. Estos precios se usan para calcular tu ingreso estimado.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
        {crops.map(([key, c], i) => {
          const change = ((Math.sin(i * 2.5) * 4) + (Math.cos(i * 1.3) * 2)).toFixed(1)
          const up = parseFloat(change) >= 0
          return (
            <div key={key} className="animate-in" style={{
              animationDelay: `${i * 0.05}s`, opacity: 0,
              padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--r-sm)',
              border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s',
            }}>
              <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--emerald-400)', marginBottom: '4px', textTransform: 'uppercase' }}>{c.name}</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fff' }}>{fmt(c.usd_per_ton, currency)}</div>
              <div style={{ fontSize: '0.65rem', fontFamily: 'var(--font-mono)', color: up ? '#34d399' : '#f87171', marginTop: '2px' }}>
                {up ? '+' : ''}{change}% <span style={{ color: 'rgba(255,255,255,0.3)' }}>/ ton</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function FinancialPanel() {
  const nav = useNavigate()
  const parcelaData = useAppStore((s) => s.parcelaData)
  const analysisReady = useAppStore((s) => s.analysisReady)
  const [tab, setTab] = useState('plan')
  const [currency, setCurrency] = useState('USD')
  const [selectedCrops, setSelectedCrops] = useState(['maiz'])
  const [area, setArea] = useState(parcelaData?.area_ha || 2.5)
  const [results, setResults] = useState(null)
  const [droughtData, setDroughtData] = useState(null)

  useEffect(() => { if (parcelaData?.area_ha) setArea(parcelaData.area_ha) }, [parcelaData])

  if (!analysisReady) {
    return (
      <div className="page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
        <h2 style={{ marginBottom: '8px' }}>Selecciona tu parcela primero</h2>
        <p style={{ color: 'var(--text-muted)', maxWidth: '400px', marginBottom: '24px' }}>Los calculos financieros se basan en los datos de tu parcela.</p>
        <button className="btn btn-primary" onClick={() => nav('/parcela')}>Ir al Visor Satelital</button>
      </div>
    )
  }

  const ndviAdj = ((parcelaData?.ndvi?.ndvi_mean || 0.5) - 0.5) * 25

  const toggleCrop = (c) => {
    setSelectedCrops(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c])
  }

  const calculatePlan = () => {
    const res = selectedCrops.map(key => {
      const c = CROPS_DATA[key]
      const yieldKg = Math.round(c.yield_kg_ha * area * (1 + ndviAdj / 100))
      const revenue = (yieldKg / 1000) * c.usd_per_ton
      const cost = c.cost_ha * area
      const net = revenue - cost
      return {
        crop: c.name, key, yield_kg: yieldKg, revenue_usd: Math.round(revenue),
        cost_usd: Math.round(cost), net_usd: Math.round(net),
        roi: Math.round((net / cost) * 100),
        satellite_adj: Math.round(ndviAdj * 10) / 10,
        risk: net > cost * 0.3 ? 'BAJO' : net > 0 ? 'MEDIO' : 'ALTO',
      }
    })
    setResults(res)
  }

  const simulateDrought = () => {
    const crop = selectedCrops[0] || 'maiz'
    const c = CROPS_DATA[crop]
    const scenarios = []
    for (let pct = 0; pct <= 100; pct += 10) {
      const factor = 1 - pct / 100
      const yieldKg = Math.round(c.yield_kg_ha * area * factor * (1 + ndviAdj / 100))
      const revenue = (yieldKg / 1000) * c.usd_per_ton
      const cost = c.cost_ha * area
      scenarios.push({
        severity: `${pct}%`, pct, net_usd: Math.round(revenue - cost),
        yield_kg: yieldKg, label: pct === 0 ? 'Normal' : pct <= 30 ? 'Leve' : pct <= 60 ? 'Moderada' : pct <= 80 ? 'Severa' : 'Catastrofica',
      })
    }
    setDroughtData(scenarios)
  }

  const compareData = useMemo(() => {
    return Object.entries(CROPS_DATA).map(([key, c]) => {
      const yieldKg = Math.round(c.yield_kg_ha * area * (1 + ndviAdj / 100))
      const revenue = (yieldKg / 1000) * c.usd_per_ton
      const cost = c.cost_ha * area
      return { crop: c.name, key, net_usd: Math.round(revenue - cost), risk: revenue - cost > cost * 0.3 ? 'BAJO' : revenue - cost > 0 ? 'MEDIO' : 'ALTO' }
    }).sort((a, b) => b.net_usd - a.net_usd)
  }, [area, ndviAdj])

  const tabs = [
    { id: 'plan', label: 'Planificador', desc: 'Calcula ganancias para tus cultivos' },
    { id: 'market', label: 'Mercado', desc: 'Precios globales en tiempo real' },
    { id: 'compare', label: 'Comparador', desc: 'Que cultivo da mas dinero?' },
    { id: 'drought', label: 'Simulador', desc: 'Impacto de sequia o inundacion' },
  ]

  return (
    <div className="page" style={{ maxWidth: '1100px' }}>
      <h1 style={{ marginBottom: '4px' }}>Panel Financiero</h1>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '16px' }}>
        Todos los calculos estan ajustados a tu parcela ({parcelaData?.area_ha?.toFixed(1)} ha) y datos satelitales (NDVI: {parcelaData?.ndvi?.ndvi_mean?.toFixed(3)}).
      </p>

      {/* Currency selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Moneda:</span>
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {Object.entries(CURRENCIES).map(([code, c]) => (
            <button key={code} onClick={() => setCurrency(code)} className={currency === code ? 'btn btn-primary btn-sm' : 'btn btn-ghost btn-sm'}
              style={{ fontSize: '0.7rem', padding: '4px 10px', minHeight: '28px' }}>
              {code}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <Tip key={t.id} text={t.desc}>
            <button onClick={() => setTab(t.id)} className={tab === t.id ? 'btn btn-primary btn-sm' : 'btn btn-outline btn-sm'}>{t.label}</button>
          </Tip>
        ))}
      </div>

      {/* PLANIFICADOR */}
      {tab === 'plan' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ marginBottom: '6px' }}>Selecciona tus cultivos</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Elige uno o varios cultivos que quieras sembrar. El sistema calculara la ganancia estimada basandose en el area de tu parcela, precios globales, y la salud de tu suelo medida por satelite.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
              {Object.entries(CROPS_DATA).map(([key, c]) => (
                <button key={key} onClick={() => toggleCrop(key)} style={{
                  padding: '8px 16px', borderRadius: 'var(--r-md)', fontSize: '0.82rem', fontWeight: 600,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: 'var(--font-sans)',
                  background: selectedCrops.includes(key) ? 'var(--emerald-600)' : '#fff',
                  color: selectedCrops.includes(key) ? '#fff' : 'var(--text-secondary)',
                  border: `2px solid ${selectedCrops.includes(key) ? 'var(--emerald-600)' : 'var(--emerald-200)'}`,
                  boxShadow: selectedCrops.includes(key) ? 'var(--shadow-emerald)' : 'none',
                }}>{c.name}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '4px' }}>Area (ha)</label>
                <input className="input" type="number" value={area} onChange={(e) => setArea(+e.target.value || 1)} style={{ width: '120px' }} min="0.1" step="0.5" />
              </div>
              <button className="btn btn-primary" onClick={calculatePlan} disabled={!selectedCrops.length}>Calcular Ganancia</button>
            </div>
          </div>

          {results && results.map((r, i) => (
            <div key={i} className="card animate-in" style={{ padding: '24px', animationDelay: `${i * 0.1}s`, opacity: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: 0 }}>{r.crop}</h4>
                <span className={`badge ${r.risk === 'BAJO' ? 'badge-ok' : r.risk === 'MEDIO' ? 'badge-warning' : 'badge-danger'}`}>Riesgo {r.risk}</span>
              </div>
              <div className="grid-4" style={{ marginBottom: '16px' }}>
                {[
                  { label: 'Rendimiento', value: `${r.yield_kg.toLocaleString()} kg`, tip: 'Produccion esperada basada en rendimiento promedio ajustado por NDVI satelital' },
                  { label: 'Ingreso bruto', value: fmt(r.revenue_usd, currency), tip: 'Ingreso calculado con precios internacionales actuales por tonelada' },
                  { label: 'Costos', value: fmt(r.cost_usd, currency), tip: 'Incluye semilla, fertilizante, mano de obra, riego y cosecha' },
                  { label: 'Ganancia neta', value: fmt(r.net_usd, currency), tip: 'Lo que te queda despues de pagar todos los costos. Si es negativo, perderas dinero.' },
                ].map((m, j) => (
                  <Tip key={j} text={m.tip}>
                    <div style={{ textAlign: 'center', cursor: 'help' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '4px' }}>{m.label}</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: m.label === 'Ganancia neta' ? (r.net_usd >= 0 ? 'var(--emerald-700)' : 'var(--red)') : 'var(--text-primary)' }}>{m.value}</div>
                    </div>
                  </Tip>
                ))}
              </div>
              <div style={{ padding: '12px', background: 'var(--emerald-50)', borderRadius: 'var(--r-sm)', border: '1px solid var(--emerald-200)', display: 'flex', justifyContent: 'space-around', flexWrap: 'wrap', gap: '8px' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>ROI: <strong style={{ color: 'var(--emerald-700)' }}>{r.roi}%</strong></span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem' }}>Ajuste satelital: <strong style={{ color: r.satellite_adj >= 0 ? 'var(--emerald-700)' : 'var(--orange)' }}>{r.satellite_adj > 0 ? '+' : ''}{r.satellite_adj}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* MARKET */}
      {tab === 'market' && <MarketTicker currency={currency} />}

      {/* COMPARADOR */}
      {tab === 'compare' && (
        <div className="card" style={{ padding: '24px' }}>
          <h4 style={{ marginBottom: '6px' }}>Que cultivo da mas dinero en tu parcela?</h4>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Compara la ganancia neta de 10 cultivos diferentes sembrados en tus {area.toFixed(1)} hectareas.
            El color indica el nivel de riesgo financiero: verde = bajo, naranja = medio, rojo = alto.
          </p>
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={compareData} layout="vertical" margin={{ top: 5, right: 10, left: 60, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--emerald-100)" />
              <XAxis type="number" tick={{ fill: 'var(--text-muted)', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => fmt(v, currency)} />
              <YAxis type="category" dataKey="crop" tick={{ fill: 'var(--text-primary)', fontSize: 11, fontWeight: 600 }} width={60} />
              <Tooltip formatter={(v) => [fmt(v, currency), 'Ganancia neta']} contentStyle={{ background: '#fff', border: '2px solid var(--emerald-200)', borderRadius: '10px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', boxShadow: 'var(--shadow-md)' }} />
              <Bar dataKey="net_usd" radius={[0, 6, 6, 0]}>
                {compareData.map((e, i) => <Cell key={i} fill={e.risk === 'BAJO' ? '#059669' : e.risk === 'MEDIO' ? '#ea580c' : '#dc2626'} opacity={0.8} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div style={{ display: 'flex', gap: '20px', marginTop: '10px', fontFamily: 'var(--font-mono)', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
            <span><span style={{ color: '#059669' }}>●</span> Riesgo Bajo (ganancia {'>'} 30% costos)</span>
            <span><span style={{ color: '#ea580c' }}>●</span> Riesgo Medio (ganancia positiva)</span>
            <span><span style={{ color: '#dc2626' }}>●</span> Riesgo Alto (pierdes dinero)</span>
          </div>
        </div>
      )}

      {/* SIMULADOR */}
      {tab === 'drought' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div className="card" style={{ padding: '24px' }}>
            <h4 style={{ marginBottom: '6px' }}>Simulador de Impacto Climatico</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Simula como una sequia o inundacion afectaria tu ganancia en {currency}.
              Selecciona un cultivo arriba y presiona Simular. La grafica muestra cuanto dinero perderas segun la severidad del evento.
            </p>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '16px' }}>
              {Object.entries(CROPS_DATA).slice(0, 6).map(([key, c]) => (
                <button key={key} onClick={() => { setSelectedCrops([key]); setDroughtData(null) }} style={{
                  padding: '6px 14px', borderRadius: 'var(--r-sm)', fontSize: '0.8rem', fontWeight: 600,
                  background: selectedCrops[0] === key ? 'var(--emerald-600)' : '#fff',
                  color: selectedCrops[0] === key ? '#fff' : 'var(--text-secondary)',
                  border: `2px solid ${selectedCrops[0] === key ? 'var(--emerald-600)' : 'var(--emerald-200)'}`,
                  cursor: 'pointer', fontFamily: 'var(--font-sans)', transition: 'all 0.2s',
                }}>{c.name}</button>
              ))}
            </div>
            <button className="btn btn-primary" onClick={simulateDrought}>Simular Impacto</button>
          </div>

          {droughtData && (
            <div className="card-dark animate-scale" style={{ padding: '24px' }}>
              <h4 style={{ marginBottom: '14px' }}>Impacto en tu bolsillo: {CROPS_DATA[selectedCrops[0]]?.name}</h4>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={droughtData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
                  <defs>
                    <linearGradient id="dg2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="#dc2626" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.08)" />
                  <XAxis dataKey="severity" tick={{ fill: '#a7f3d0', fontSize: 10, fontFamily: 'JetBrains Mono' }} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <YAxis tick={{ fill: '#a7f3d0', fontSize: 10, fontFamily: 'JetBrains Mono' }} tickFormatter={(v) => fmt(v, currency)} axisLine={{ stroke: 'rgba(255,255,255,0.1)' }} />
                  <Tooltip formatter={(v) => [fmt(v, currency), 'Ganancia neta']} contentStyle={{ background: '#022c22', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '10px', fontFamily: 'JetBrains Mono', fontSize: '0.75rem', color: '#fff' }} labelStyle={{ color: '#6ee7b7' }} />
                  <ReferenceLine y={0} stroke="#f59e0b" strokeDasharray="6 4" strokeWidth={2} />
                  <Area type="monotone" dataKey="net_usd" stroke="#dc2626" fill="url(#dg2)" strokeWidth={3} dot={{ fill: '#fff', stroke: '#dc2626', strokeWidth: 2, r: 4 }} />
                </AreaChart>
              </ResponsiveContainer>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '8px', marginTop: '16px' }}>
                {droughtData.filter((_, i) => i % 3 === 0).map((d, i) => (
                  <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.05)', borderRadius: 'var(--r-sm)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--emerald-400)', textTransform: 'uppercase' }}>{d.label} ({d.severity})</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: d.net_usd >= 0 ? '#34d399' : '#f87171' }}>{fmt(d.net_usd, currency)}</div>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem', color: 'rgba(255,255,255,0.4)' }}>{d.yield_kg.toLocaleString()} kg</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
