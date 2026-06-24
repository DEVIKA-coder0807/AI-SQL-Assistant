import { create } from 'zustand'

export const useQueryStore = create((set) => ({
  activeQuery: '',
  generatedSql: '',
  explanation: '',
  impact: null,
  alternatives: [],
  setActiveQuery: (activeQuery) => set({ activeQuery }),
  setGeneratedSql: (generatedSql) => set({ generatedSql }),
  setExplanation: (explanation) => set({ explanation }),
  setImpact: (impact) => set({ impact }),
  setAlternatives: (alternatives) => set({ alternatives }),
  reset: () =>
    set({
      activeQuery: '',
      generatedSql: '',
      explanation: '',
      impact: null,
      alternatives: [],
    }),
}))
