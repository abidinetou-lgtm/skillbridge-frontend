// services/api.js
// Configuration centrale d'Axios
// Tous les appels API passent par ici — une seule fois à modifier si l'URL change

import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
  headers: { 'Content-Type': 'application/json' },
})

// Avant chaque requête, on ajoute automatiquement le token JWT dans le header
api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default api
