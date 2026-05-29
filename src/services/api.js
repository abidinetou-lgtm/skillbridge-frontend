import axios from 'axios'
import useAuthStore from '../store/authStore'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  headers: { 'Content-Type': 'application/json' },
})

export const getApiError = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong'

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      useAuthStore.getState().logout()
    }
    return Promise.reject(error)
  }
)

export const authApi = {
  register: (payload) => api.post('/auth/register', payload).then((res) => res.data),
  login: (payload) => api.post('/auth/login', payload).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data.user),
}

export const userApi = {
  me: () => api.get('/users/me').then((res) => res.data.user),
  updateMe: (payload) => api.patch('/users/me', payload).then((res) => res.data.user),
  getById: (id) => api.get(`/users/${id}`).then((res) => res.data.user),
  addSkill: (payload) => api.post('/users/skills', payload).then((res) => res.data.skill),
  deleteSkill: (id) => api.delete(`/users/skills/${id}`),
  addLearningGoal: (payload) =>
    api.post('/users/learning-goals', payload).then((res) => res.data.learningGoal),
  deleteLearningGoal: (id) => api.delete(`/users/learning-goals/${id}`),
}

export const matchApi = {
  suggestions: () => api.get('/matches/suggestions').then((res) => res.data.matches),
  request: (payload) => api.post('/matches/request', payload).then((res) => res.data.match),
  mine: () => api.get('/matches/mine').then((res) => res.data.matches),
  update: (id, status) => api.patch(`/matches/${id}`, { status }).then((res) => res.data.match),
}

export const conversationApi = {
  list: () => api.get('/conversations').then((res) => res.data),
  messages: (id) => api.get(`/conversations/${id}`).then((res) => res.data),
  sendMessage: (id, body) =>
    api.post(`/conversations/${id}/messages`, { body }).then((res) => res.data),
}

export const sessionApi = {
  create: (payload) => api.post('/sessions', payload).then((res) => res.data),
  join: (id) => api.post(`/sessions/${id}/join`).then((res) => res.data),
  end: (id) => api.post(`/sessions/${id}/end`).then((res) => res.data),
}

export const creditApi = {
  get: () => api.get('/credits').then((res) => res.data),
}

export default api
