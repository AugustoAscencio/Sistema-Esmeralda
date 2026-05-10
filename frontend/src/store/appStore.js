/**
 * Zustand store — estado global de Sistema Esmeralda
 */

import { create } from 'zustand'

const useAppStore = create((set, get) => ({
  // Parcela activa
  currentBbox: null,
  parcelaData: null,
  isLoadingParcela: false,

  // Score
  resilienceScore: null,

  // Farmer
  farmerName: 'Agricultor',

  // UI
  activeView: 'landing', // landing | dashboard | parcela | financiero | educacion | metodologia
  showAgent: false,
  isMobile: window.innerWidth < 768,

  // Acciones
  setBbox: (bbox) => set({ currentBbox: bbox }),

  setParcelaData: (data) => set({
    parcelaData: data,
    resilienceScore: data?.resilience || null,
  }),

  setLoadingParcela: (loading) => set({ isLoadingParcela: loading }),

  setFarmerName: (name) => set({ farmerName: name }),

  setActiveView: (view) => set({ activeView: view }),

  toggleAgent: () => set((state) => ({ showAgent: !state.showAgent })),

  setMobile: (val) => set({ isMobile: val }),

  // Fetch parcela analysis
  fetchAnalysis: async (bbox) => {
    set({ isLoadingParcela: true })
    try {
      const bboxStr = bbox.join(',')
      const res = await fetch(`http://localhost:8000/api/v1/parcela/analysis?bbox=${bboxStr}`)
      const data = await res.json()
      set({
        currentBbox: bbox,
        parcelaData: data,
        resilienceScore: data?.resilience || null,
        isLoadingParcela: false,
      })
      return data
    } catch (err) {
      console.error('Error fetching analysis:', err)
      set({ isLoadingParcela: false })
      return null
    }
  },
}))

export default useAppStore
