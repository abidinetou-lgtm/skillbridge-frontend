// store/authStore.js
// C'est ici qu'on stocke l'utilisateur connecté et son token JWT
// Zustand = une variable globale que tous les composants peuvent lire

import { create } from 'zustand'

const useAuthStore = create((set) => ({
  user: null,    // Les infos de l'utilisateur connecté
  token: null,   // Le token JWT reçu du backend

  // Appeler cette fonction après un login réussi
  login: (user, token) => set({ user, token }),

  // Appeler cette fonction quand l'utilisateur se déconnecte
  logout: () => set({ user: null, token: null }),
}))

export default useAuthStore
