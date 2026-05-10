/**
 * Paleta Esmeralda exportada como constantes JS
 * Para uso en Three.js, Recharts y lógica de colores
 */

export const COLORS = {
  // Principales
  deep:    '#0a1a12',
  dark:    '#0f2417',
  mid:     '#1a3d26',
  gem:     '#10b46c',
  bright:  '#1de98b',
  pale:    '#a3f5cf',

  // Alertas
  red:     '#f04040',
  orange:  '#f59e0b',
  yellow:  '#fde047',

  // Texto
  textPrimary:   '#e8f5ee',
  textSecondary: '#8ab49a',
  textMuted:     '#4a6b55',

  // Extras para gráficas
  chart1: '#10b46c',
  chart2: '#1de98b',
  chart3: '#38bdf8',
  chart4: '#a78bfa',
  chart5: '#f59e0b',
}

export const SCORE_COLORS = {
  excellent: '#10b46c',
  good:      '#3db87a',
  moderate:  '#f59e0b',
  high_risk: '#f04040',
}

export const FONTS = {
  display: "'Syne', sans-serif",
  mono:    "'Space Mono', monospace",
  body:    "'DM Sans', sans-serif",
}

export function getScoreColor(score) {
  if (score >= 75) return SCORE_COLORS.excellent
  if (score >= 55) return SCORE_COLORS.good
  if (score >= 35) return SCORE_COLORS.moderate
  return SCORE_COLORS.high_risk
}

export function getScoreLabel(score) {
  if (score >= 75) return 'EXCELENTE'
  if (score >= 55) return 'BUENO'
  if (score >= 35) return 'RIESGO MODERADO'
  return 'RIESGO ALTO'
}

export function getAlertColor(level) {
  switch (level) {
    case 'CRITICO':    return COLORS.red
    case 'ALERTA':     return COLORS.orange
    case 'PRECAUCION': return COLORS.yellow
    case 'OK':         return COLORS.gem
    default:           return COLORS.textMuted
  }
}
