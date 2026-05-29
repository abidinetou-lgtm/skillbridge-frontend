import { create } from 'zustand'
import { persist } from 'zustand/middleware'

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      authReady: false,

      modalOpen: false,
      modalMode: 'login',

      setAuth: (user, token) => set({ user, token, modalOpen: false, authReady: true }),
      setUser: (user) => set({ user, authReady: true }),
      logout: () => set({ user: null, token: null, authReady: true }),
      markAuthReady: () => set({ authReady: true }),

      openModal: (mode = 'login') => set({ modalOpen: true, modalMode: mode }),
      closeModal: () => set({ modalOpen: false }),
      switchMode: (mode) => set({ modalMode: mode }),
    }),
    {
      name: 'skillbridge-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        state?.markAuthReady()
      },
    }
  )
)

export default useAuthStore
