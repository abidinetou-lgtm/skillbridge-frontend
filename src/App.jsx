// src/App.jsx — version propre sans CallScreen
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar        from './components/Navbar'
import CookieBanner  from './components/CookieBanner'
import AuthModal     from './components/AuthModal'
import HomePage      from './pages/HomePage'
import FeedPage      from './pages/Feed'
import ChatPage      from './pages/Chat'
import ConnectionPage from './pages/Connection'
import ProfilePage   from './pages/Profile'
import UserProfilePage from './pages/UserProfile'
import RegisterPage  from './pages/Register'
import Sessions      from './pages/Sessions'
import NewSession    from './pages/NewSession'
import SessionRoom   from './pages/SessionRoom'
import useAuthStore  from './store/authStore'
import { authApi }   from './services/api'

function ProtectedRoute({ children }) {
  const { user, authReady } = useAuthStore()
  if (!authReady) return null
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
  const { token, setUser, logout, markAuthReady } = useAuthStore()

  useEffect(() => {
    if (!token) { markAuthReady(); return }
    let mounted = true
    authApi.me()
      .then((user) => { if (mounted) setUser(user) })
      .catch(()    => { if (mounted) logout() })
    return () => { mounted = false }
  }, [token, setUser, logout, markAuthReady])

  return (
    <BrowserRouter>
      <Navbar />
      <CookieBanner />
      <AuthModal />
      <Routes>
        <Route path="/"           element={<HomePage />} />
        <Route path="/register"   element={<RegisterPage />} />
        <Route path="/feed"       element={<FeedPage />} />
        <Route path="/connection" element={<ConnectionPage />} />
        <Route path="/user/:id"   element={<UserProfilePage />} />
        <Route path="/match"      element={<Navigate to="/connection" replace />} />
        <Route path="/chat"       element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile"    element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/sessions"   element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
        <Route path="/sessions/new" element={<ProtectedRoute><NewSession /></ProtectedRoute>} />
        <Route path="/sessions/:id" element={<ProtectedRoute><SessionRoom /></ProtectedRoute>} />
      </Routes>
    </BrowserRouter>
  )
}