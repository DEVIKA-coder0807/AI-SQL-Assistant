import { persist } from 'zustand/middleware'
import { create } from 'zustand'

const initialUser = {
  id: null,
  email: null,
  name: null,
}

export const useAuthStore = create(
  persist(
    (set) => ({
      user: initialUser,
      token: null,
      theme: 'dark',
      loading: false,
      setLoading: (loading) => set({ loading }),
      setUser: (user, token) => set({ user, token }),
      logout: () => {
        localStorage.removeItem('aiSqlToken')
        set({ user: initialUser, token: null })
      },
      toggleTheme: () => set((state) => ({ theme: state.theme === 'dark' ? 'light' : 'dark' })),
    }),
    {
      name: 'ai-sql-auth',
      partialize: (state) => ({ user: state.user, token: state.token, theme: state.theme }),
    },
  ),
)
