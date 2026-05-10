/**
 * Education.jsx — Módulo educativo con lecciones interactivas
 */

import { useState } from 'react'

const MODULES = [
  {
    id: 'ndvi', icon: '🌿', title: '¿Qué es el NDVI?',
    content: `El NDVI (Índice de Vegetación de Diferencia Normalizada) es como un "termómetro" de la salud de tu cultivo, pero medido desde el espacio.

Los satélites Sentinel-2 de la Agencia Espacial Europea capturan luz que tus ojos no pueden ver (infrarroja). Las plantas sanas reflejan MUCHA luz infrarroja. Las plantas enfermas o secas reflejan poca.

**Cómo leer tu NDVI:**
• 0.6 - 1.0 → 🟢 Excelente. Tu cultivo está fuerte y saludable.
• 0.4 - 0.6 → 🟡 Bueno. Condiciones aceptables, pero vigilar.
• 0.2 - 0.4 → 🟠 Alerta. Estrés hídrico o nutricional. Actuar pronto.
• 0.0 - 0.2 → 🔴 Crítico. Suelo desnudo o vegetación muy dañada.

**Fórmula:** NDVI = (Infrarrojo - Rojo) / (Infrarrojo + Rojo)`,
    quiz: [
      { q: '¿Un NDVI de 0.7 significa que tu cultivo está...?', opts: ['Enfermo', 'Muerto', 'Saludable'], answer: 2 },
      { q: '¿Qué satélite mide el NDVI?', opts: ['GPS', 'Sentinel-2', 'WhatsApp'], answer: 1 },
      { q: '¿Qué tipo de luz usan?', opts: ['Infrarroja', 'Ultravioleta', 'Visible'], answer: 0 },
    ]
  },
  {
    id: 'moisture', icon: '💧', title: '¿Qué es la humedad del suelo?',
    content: `La humedad del suelo indica cuánta agua tiene disponible tu cultivo en la tierra. Se mide con radar desde el satélite Sentinel-1.

A diferencia de Sentinel-2 que necesita cielos despejados, Sentinel-1 usa radar (SAR) que atraviesa nubes y funciona de noche. Perfecto para épocas lluviosas.

**Niveles de humedad:**
• 60-100% → 💧 Húmedo. Buen nivel de agua.
• 30-60% → 🟡 Moderado. Aceptable para la mayoría de cultivos.
• 10-30% → 🟠 Seco. Considerar riego adicional.
• 0-10% → 🔴 Crítico. Riesgo de pérdida del cultivo.

**Consejo práctico:** Si la humedad baja de 25% y no hay lluvia prevista en 7 días, es momento de regar o solicitar asistencia.`,
    quiz: [
      { q: '¿Qué satélite mide la humedad del suelo?', opts: ['Sentinel-1', 'Sentinel-2', 'Hubble'], answer: 0 },
      { q: '¿Sentinel-1 funciona con nubes?', opts: ['No', 'Sí', 'Solo de día'], answer: 1 },
      { q: '¿Humedad del suelo al 15% es...?', opts: ['Normal', 'Preocupante', 'Excelente'], answer: 1 },
    ]
  },
  {
    id: 'drought', icon: '🏜️', title: '¿Cómo protegerse de la sequía?',
    content: `La sequía es la amenaza más grande para los pequeños agricultores. Pero con datos del satélite, puedes prepararte ANTES de que llegue.

**Señales tempranas (el satélite te avisa):**
• NDVI bajando semana a semana
• Humedad del suelo cayendo bajo 30%
• Pronóstico sin lluvia por más de 7 días
• Temperatura máxima sobre 38°C constante

**Acciones concretas:**
1. Riego de emergencia si tienes acceso a agua
2. Mulching (cobertura del suelo) para retener humedad
3. Reducir área sembrada para concentrar agua
4. Solicitar microcrédito de emergencia antes de perder el cultivo
5. Considerar cultivos más resistentes a la sequía (sorgo, yuca)`,
    quiz: [
      { q: '¿Cuál es señal temprana de sequía?', opts: ['NDVI subiendo', 'NDVI bajando', 'Mucha lluvia'], answer: 1 },
      { q: '¿El mulching sirve para...?', opts: ['Decorar', 'Retener humedad', 'Espantar pájaros'], answer: 1 },
      { q: '¿Cuándo pedir microcrédito?', opts: ['Cuando ya perdí todo', 'Antes de perder', 'Nunca'], answer: 1 },
    ]
  },
  {
    id: 'credit', icon: '💳', title: '¿Qué es el microcrédito paramétrico?',
    content: `Un microcrédito paramétrico es un préstamo que se activa automáticamente cuando ciertos datos medibles (parámetros) indican que lo necesitas.

En Esmeralda, los parámetros son satelitales:
• Si tu NDVI cae debajo de un umbral → se activa la opción de crédito
• Si la humedad del suelo es crítica → el monto disponible aumenta
• Tu Score de Resiliencia determina la tasa de interés

**Ventajas sobre el crédito tradicional:**
• No necesitas ir al banco
• No necesitas papeleo complicado
• El satélite es tu "garantía" — los datos son públicos y verificables
• La decisión es rápida: el algoritmo calcula en segundos
• Las tasas son justas porque el riesgo se mide objetivamente`,
    quiz: [
      { q: '¿Quién decide si recibes crédito?', opts: ['Un funcionario', 'El algoritmo con datos satelitales', 'La suerte'], answer: 1 },
      { q: '¿Qué sirve como "garantía"?', opts: ['Tu casa', 'Datos del satélite', 'Nada'], answer: 1 },
      { q: '¿El crédito paramétrico necesita...?', opts: ['Mucho papeleo', 'Datos medibles', 'Conexiones'], answer: 1 },
    ]
  },
  {
    id: 'score', icon: '📊', title: '¿Cómo usar el Score de Resiliencia?',
    content: `Tu Score de Resiliencia es un número de 0 a 100 que resume la salud financiera y agronómica de tu parcela.

**Componentes del Score:**
• 🌿 Salud del cultivo (NDVI): hasta 40 puntos
• 📊 Estabilidad (variación NDVI): hasta 25 puntos
• 💧 Agua disponible: hasta 20 puntos
• 🌡️ Riesgo climático: hasta 15 puntos

**Cómo usarlo con el banco:**
• 75-100 → EXCELENTE: Crédito aprobado con las mejores tasas
• 55-74 → BUENO: Crédito condicional, tasas moderadas
• 35-54 → MODERADO: Necesitas garantía adicional
• 0-34 → ALTO RIESGO: Buscar asistencia antes de crédito

Puedes mostrar tu Score al banco como evidencia objetiva del estado de tu campo.`,
    quiz: [
      { q: '¿Cuántos componentes tiene el Score?', opts: ['2', '4', '10'], answer: 1 },
      { q: '¿Un score de 80 significa...?', opts: ['Peligro', 'Excelente', 'Regular'], answer: 1 },
      { q: '¿El componente con más peso es...?', opts: ['Clima', 'Salud del cultivo', 'Estabilidad'], answer: 1 },
    ]
  },
]

function QuizSection({ quiz }) {
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const handleAnswer = (qi, oi) => { if (!submitted) setAnswers({ ...answers, [qi]: oi }) }
  const score = submitted ? Object.keys(answers).filter((qi) => answers[qi] === quiz[parseInt(qi)].answer).length : 0

  return (
    <div style={{ marginTop: '20px', padding: '16px', background: 'rgba(10, 26, 18, 0.6)', borderRadius: 'var(--radius-md)', border: '1px solid var(--glass-border)' }}>
      <h5 className="text-display" style={{ fontSize: '0.9rem', marginBottom: '12px' }}>🧠 Quiz rápido</h5>
      {quiz.map((q, qi) => (
        <div key={qi} style={{ marginBottom: '14px' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-primary)', marginBottom: '8px' }}>{q.q}</p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {q.opts.map((opt, oi) => {
              const selected = answers[qi] === oi
              const correct = submitted && oi === q.answer
              const wrong = submitted && selected && oi !== q.answer
              return (
                <button key={oi} onClick={() => handleAnswer(qi, oi)} style={{
                  padding: '6px 14px', fontSize: '0.8rem', borderRadius: 'var(--radius-sm)', cursor: submitted ? 'default' : 'pointer',
                  background: correct ? 'rgba(16,180,108,0.2)' : wrong ? 'rgba(240,64,64,0.2)' : selected ? 'rgba(16,180,108,0.1)' : 'transparent',
                  border: `1px solid ${correct ? 'var(--esmeralda-gem)' : wrong ? 'var(--alert-red)' : selected ? 'var(--esmeralda-gem)' : 'var(--esmeralda-mid)'}`,
                  color: correct ? 'var(--esmeralda-bright)' : wrong ? 'var(--alert-red)' : 'var(--text-secondary)',
                  fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                }}>{opt}</button>
              )
            })}
          </div>
        </div>
      ))}
      {!submitted ? (
        <button className="btn btn-primary" onClick={() => setSubmitted(true)} style={{ marginTop: '8px' }}>Verificar</button>
      ) : (
        <div className="text-mono" style={{ fontSize: '0.8rem', color: score === quiz.length ? 'var(--esmeralda-bright)' : 'var(--alert-orange)' }}>
          {score === quiz.length ? '🎉 ¡Perfecto!' : `${score}/${quiz.length} correctas`}
        </div>
      )}
    </div>
  )
}

export default function Education() {
  const [openModule, setOpenModule] = useState(null)

  return (
    <div className="page">
      <h1 style={{ marginBottom: '8px' }}>📚 Educación Agrícola</h1>
      <p className="text-secondary" style={{ marginBottom: '24px', fontSize: '0.95rem' }}>
        Aprende a usar los datos del satélite para proteger tu campo
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {MODULES.map((mod) => (
          <div key={mod.id} className="card card-glow" style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            onClick={() => setOpenModule(openModule === mod.id ? null : mod.id)}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontSize: '28px' }}>{mod.icon}</span>
                <h3 className="text-display" style={{ fontSize: '1.05rem', margin: 0 }}>{mod.title}</h3>
              </div>
              <span style={{ color: 'var(--text-muted)', fontSize: '20px', transition: 'transform 0.3s', transform: openModule === mod.id ? 'rotate(180deg)' : 'none' }}>▾</span>
            </div>

            {openModule === mod.id && (
              <div className="animate-fade-in" style={{ marginTop: '16px' }}>
                <div style={{ fontFamily: 'var(--font-body)', fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, whiteSpace: 'pre-line' }}>
                  {mod.content}
                </div>
                <QuizSection quiz={mod.quiz} />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
