// État global partagé entre tous les composants
// "isLoggedIn" → les boutons login/signup disparaissent de la navbar
// "openModal"  → ouvre le modal depuis n'importe quel bouton
 
import { create } from 'zustand'
 
const useAuthStore = create((set) => ({
  // Données utilisateur (null = pas connecté)
  user: null,
  token: null,
 
  // État du modal auth
  modalOpen: false,
  modalMode: 'login', // 'login' ou 'register'
 
  // Actions
  login: (user, token) => set({ user, token, modalOpen: false }),
  logout: () => set({ user: null, token: null }),
 
  openModal:  (mode = 'login') => set({ modalOpen: true,  modalMode: mode }),
  closeModal: ()               => set({ modalOpen: false }),
  switchMode: (mode)           => set({ modalMode: mode }),
}))
 
export default useAuthStore
 