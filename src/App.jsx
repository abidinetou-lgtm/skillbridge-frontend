import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar          from './components/Navbar'
import BottomNav       from './components/BottomNav'
import CookieBanner    from './components/CookieBanner'
import AuthModal       from './components/AuthModal'
import { ToastProvider } from './components/Toast'
import HomePage        from './pages/HomePage'
import FeedPage        from './pages/Feed'
import ChatPage        from './pages/Chat'
import ConnectionPage  from './pages/Connection'
import ProfilePage     from './pages/Profile'
import UserProfilePage from './pages/UserProfile'
import RegisterPage    from './pages/Register'
import Sessions        from './pages/Sessions'
import NewSession      from './pages/NewSession'
import SessionRoom     from './pages/SessionRoom'
import BecomeSharer    from './pages/BecomeSharer'
import Credits         from './pages/Credits'
import ForgotPassword  from './pages/ForgotPassword'
import ResetPassword   from './pages/ResetPassword'
import VerifyEmail     from './pages/VerifyEmail'
import useAuthStore    from './store/authStore'
import { authApi }     from './services/api'

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
      .catch((err) => {
        if (!mounted) return
        // Only clear token on explicit auth rejection (401/403), not on network errors.
        if (err.response?.status === 401 || err.response?.status === 403) {
          logout()
        } else {
          markAuthReady()
        }
      })
    return () => { mounted = false }
  }, [token, setUser, logout, markAuthReady])

  return (
    <BrowserRouter>
      <ToastProvider>
        <Navbar />
        {/* Spacer for fixed navbar */}
        <div className="h-16 flex-shrink-0" aria-hidden="true" />
        <CookieBanner />
        <AuthModal />
        <div className="pb-16 md:pb-0">
        <Routes>
          <Route path="/"                  element={<HomePage />} />
          <Route path="/register"          element={<RegisterPage />} />
          <Route path="/verify-email"      element={<VerifyEmail />} />
          <Route path="/feed"              element={<FeedPage />} />
          <Route path="/connection"        element={<ConnectionPage />} />
          <Route path="/user/:id"          element={<UserProfilePage />} />
          <Route path="/match"             element={<Navigate to="/connection" replace />} />
          <Route path="/forgot-password"   element={<ForgotPassword />} />
          <Route path="/reset-password"    element={<ResetPassword />} />
          <Route path="/chat"              element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
          <Route path="/profile"           element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
          <Route path="/credits"           element={<ProtectedRoute><Credits /></ProtectedRoute>} />
          <Route path="/sessions"          element={<ProtectedRoute><Sessions /></ProtectedRoute>} />
          <Route path="/sessions/new"      element={<ProtectedRoute><NewSession /></ProtectedRoute>} />
          <Route path="/sessions/:id"      element={<ProtectedRoute><SessionRoom /></ProtectedRoute>} />
          <Route path="/become-sharer"     element={<ProtectedRoute><BecomeSharer /></ProtectedRoute>} />
        </Routes>
        </div>
        <BottomNav />
      </ToastProvider>
    </BrowserRouter>
  )
}
