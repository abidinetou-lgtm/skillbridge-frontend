// src/App.jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
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

// Route protégée — redirige vers / si non connecté
function ProtectedRoute({ children }) {
  const { user } = useAuthStore()
  return user ? children : <Navigate to="/" replace />
}

export default function App() {
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
        <Route path="/chat"         element={<ProtectedRoute><ChatPage /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/user/:id"     element={<UserProfilePage />} />
        {/* Redirect old /match → /connection */}
        <Route path="/match"        element={<Navigate to="/connection" replace />} />
      </Routes>
    </BrowserRouter>
  )
}