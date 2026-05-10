/**
 * AgentChat — Chat flotante con el agente Esmeralda
 */

import { useState, useRef, useEffect } from 'react'
import useAppStore from '../../store/appStore'

export default function AgentChat() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: '¡Hola! 🌿 Soy Esmeralda, tu asistente agrónoma. Tengo acceso a los datos de tu parcela desde el satélite. ¿En qué te puedo ayudar hoy?'
    }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const messagesEnd = useRef(null)
  const isMobile = useAppStore((s) => s.isMobile)
  const toggleAgent = useAppStore((s) => s.toggleAgent)
  const currentBbox = useAppStore((s) => s.currentBbox)
  const farmerName = useAppStore((s) => s.farmerName)

  useEffect(() => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const userMsg = input.trim()
    setInput('')
    setMessages((prev) => [...prev, { role: 'user', content: userMsg }])
    setLoading(true)

    try {
      const res = await fetch('http://localhost:8000/api/v1/agent/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMsg,
          farmer_name: farmerName,
          bbox: currentBbox ? currentBbox.join(',') : null,
        }),
      })
      const data = await res.json()
      setMessages((prev) => [...prev, { role: 'assistant', content: data.response }])
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: '⚠️ No pude conectarme al servidor. Verifica que el backend esté corriendo en http://localhost:8000'
      }])
    }

    setLoading(false)
  }

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Tu navegador no soporta reconocimiento de voz')
      return
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.lang = 'es-ES'
    recognition.continuous = false
    recognition.interimResults = false

    recognition.onstart = () => setIsListening(true)
    recognition.onend = () => setIsListening(false)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      setInput(transcript)
    }

    recognition.start()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const panelStyle = isMobile ? {
    position: 'fixed',
    bottom: '68px',
    left: 0,
    right: 0,
    top: '20%',
    zIndex: 200,
  } : {
    position: 'fixed',
    right: '24px',
    bottom: '24px',
    width: '400px',
    height: '520px',
    zIndex: 200,
  }

  return (
    <div style={{
      ...panelStyle,
      display: 'flex',
      flexDirection: 'column',
      background: 'rgba(10, 26, 18, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(26, 61, 38, 0.6)',
      borderRadius: isMobile ? 'var(--radius-lg) var(--radius-lg) 0 0' : 'var(--radius-lg)',
      boxShadow: '0 16px 60px rgba(0, 0, 0, 0.5)',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 20px',
        borderBottom: '1px solid rgba(26, 61, 38, 0.5)',
        background: 'rgba(15, 36, 23, 0.6)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '20px' }}>🤖</span>
          <div>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--esmeralda-bright)',
            }}>
              Agente Esmeralda
            </div>
            <div style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              color: 'var(--text-muted)',
            }}>
              🛰️ Datos satelitales activos
            </div>
          </div>
        </div>
        <button
          onClick={toggleAgent}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            fontSize: '18px',
            cursor: 'pointer',
            padding: '4px',
          }}
        >
          ✕
        </button>
      </div>

      {/* Messages */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
      }}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              alignSelf: msg.role === 'user' ? 'flex-end' : 'flex-start',
              maxWidth: '85%',
              padding: '12px 16px',
              borderRadius: msg.role === 'user'
                ? '16px 16px 4px 16px'
                : '16px 16px 16px 4px',
              background: msg.role === 'user'
                ? 'var(--esmeralda-gem)'
                : 'rgba(26, 61, 38, 0.5)',
              color: msg.role === 'user' ? '#fff' : 'var(--text-primary)',
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {msg.content}
          </div>
        ))}

        {loading && (
          <div style={{
            alignSelf: 'flex-start',
            padding: '12px 16px',
            borderRadius: '16px 16px 16px 4px',
            background: 'rgba(26, 61, 38, 0.5)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
          }}>
            <span className="animate-pulse">🌿 Pensando...</span>
          </div>
        )}

        <div ref={messagesEnd} />
      </div>

      {/* Input */}
      <div style={{
        display: 'flex',
        gap: '8px',
        padding: '12px 16px',
        borderTop: '1px solid rgba(26, 61, 38, 0.5)',
        background: 'rgba(15, 36, 23, 0.4)',
      }}>
        <button
          onClick={startVoice}
          style={{
            width: '42px', height: '42px',
            borderRadius: '50%',
            background: isListening ? 'var(--alert-red)' : 'rgba(26, 61, 38, 0.6)',
            border: '1px solid var(--esmeralda-mid)',
            color: isListening ? '#fff' : 'var(--text-secondary)',
            fontSize: '16px',
            cursor: 'pointer',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          🎙️
        </button>
        <input
          className="input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe tu pregunta..."
          style={{
            flex: 1,
            borderRadius: '21px',
            padding: '10px 18px',
            fontSize: '0.85rem',
          }}
        />
        <button
          onClick={sendMessage}
          disabled={!input.trim() || loading}
          style={{
            width: '42px', height: '42px',
            borderRadius: '50%',
            background: input.trim() ? 'var(--esmeralda-gem)' : 'rgba(26, 61, 38, 0.4)',
            border: 'none',
            color: '#fff',
            fontSize: '16px',
            cursor: input.trim() ? 'pointer' : 'not-allowed',
            flexShrink: 0,
            transition: 'all 0.2s ease',
          }}
        >
          ➤
        </button>
      </div>
    </div>
  )
}
