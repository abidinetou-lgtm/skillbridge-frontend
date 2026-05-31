import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect } from 'react'
import Navbar        from './components/Navbar'
import Footer        from './components/Footer'
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
import BecomeSharer  from './pages/BecomeSharer'
import useAuthStore  from './store/authStore'
import { authApi }   from './services/api'

function ProtectedRoute({ children }) {
  const { user, authReady } = useAuthStore()
  if (!authReady) return null
  return user ? children : <Navigate to="/" replace />
}

// Pages légales simples
function LegalPage({ title, children }) {
  return (
    <main className="pt-[62px] min-h-screen bg-white">
      <div className="px-8 md:px-20 py-16 max-w-[760px] mx-auto">
        <h1 className="text-[32px] font-black tracking-tight text-[#1A1410] mb-8">{title}</h1>
        <div className="prose text-[15px] text-[#3D3020] leading-[1.8]">{children}</div>
      </div>
    </main>
  )
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
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <CookieBanner />
        <AuthModal />
        <div className="flex-1">
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
            <Route path="/become-sharer" element={<ProtectedRoute><BecomeSharer /></ProtectedRoute>} />
            <Route path="/mentions-legales" element={
              <LegalPage title="Mentions légales">
                <p><strong>Éditeur :</strong> SkillBridge — Projet HETIC Fast Tracks 2026</p>
                <p><strong>Équipe :</strong> Jimel Abidine Touré, Yanis, Mahamane, Yahia</p>
                <p><strong>Hébergement :</strong> Render (backend) · Coolify (frontend)</p>
                <p>Ce site est un projet pédagogique réalisé dans le cadre du programme HETIC Fast Tracks 2026. Il n'a pas de vocation commerciale.</p>
              </LegalPage>
            } />
            <Route path="/politique-confidentialite" element={
              <LegalPage title="Politique de confidentialité">
                <p>SkillBridge collecte uniquement les données nécessaires au fonctionnement du service : nom, prénom, email, compétences et objectifs d'apprentissage.</p>
                <p>Vos données ne sont jamais vendues ni partagées avec des tiers à des fins commerciales.</p>
                <p>Vous pouvez demander la suppression de votre compte à tout moment en contactant l'équipe.</p>
              </LegalPage>
            } />
            <Route path="/cgu" element={
              <LegalPage title="Conditions Générales d'Utilisation">
                <p>En utilisant SkillBridge, vous acceptez d'utiliser la plateforme dans le respect des autres utilisateurs.</p>
                <p><strong>Crédits :</strong> Les crédits SkillBridge n'ont aucune valeur monétaire et ne peuvent être échangés contre de l'argent réel.</p>
                <p><strong>Contenu :</strong> Vous êtes responsable du contenu que vous partagez sur la plateforme.</p>
                <p>SkillBridge se réserve le droit de suspendre tout compte ne respectant pas ces conditions.</p>
              </LegalPage>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  )
}