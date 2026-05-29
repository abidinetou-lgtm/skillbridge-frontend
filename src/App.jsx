// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar from './components/Navbar'
import CookieBanner from './components/CookieBanner'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import FeedPage from './pages/Feed'
import ChatPage from './pages/Chat'
import ConnectionPage from './pages/Connection'   // ← remplace Match
import ProfilePage from './pages/Profile'
import UserProfilePage from './pages/UserProfile'  // ← profil d'un autre user
import RegisterPage from './pages/Register'
import useAuthStore from './store/authStore'
import CallScreen from './pages/CallScreen'
import { authApi } from './services/api'

// Route protégée — redirige vers / si non connecté
function ProtectedRoute({ children }) {
  const { user, authReady } = useAuthStore()
  if (!authReady) return null
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  const { token, setUser, logout, markAuthReady } = useAuthStore()

  useEffect(() => {
    if (!token) {
      markAuthReady()
      return
    }

    let mounted = true
    authApi
      .me()
      .then((user) => {
        if (mounted) setUser(user)
      })
      .catch(() => {
        if (mounted) logout()
      })

    return () => {
      mounted = false
    }
  }, [token, setUser, logout, markAuthReady])

  return (
    <BrowserRouter>
      <Navbar />
      <CookieBanner />
      <AuthModal />
      <Routes>
        <Route path="/"             element={<HomePage />} />
        <Route path="/register"     element={<RegisterPage />} />
        <Route path="/feed"         element={<FeedPage />} />
        <Route path="/connection"   element={<ConnectionPage />} />
        {/* Routes protégées */}
        <Route path="/call" element={<ProtectedRoute><CallScreen /></ProtectedRoute>} />
        <Route path="/chat"         element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/user/:id"     element={<UserProfilePage />} />
        {/* Redirect old /match → /connection */}
        <Route path="/match"        element={<Navigate to="/connection" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
