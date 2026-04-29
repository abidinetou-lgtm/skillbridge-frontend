// src/App.jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import CookieBanner from './components/CookieBanner'
import AuthModal from './components/AuthModal'
import HomePage from './pages/HomePage'
import FeedPage from './pages/Feed'
import ChatPage from './pages/Chat'
import MatchPage from './pages/Match'
import ProfilePage from './pages/Profile'
import RegisterPage from './pages/Register'
 
export default function App() {
  return (
    <BrowserRouter>
      {/* Ces composants sont toujours visibles peu importe la page */}
      <Navbar />
      <CookieBanner />
      <AuthModal />
 
      <Routes>
        <Route path="/"         element={<HomePage />} />
        <Route path="/feed"     element={<FeedPage />} />
        <Route path="/chat"     element={<ChatPage />} />
        <Route path="/match"    element={<MatchPage />} />
        <Route path="/profile"  element={<ProfilePage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    </BrowserRouter>
  )
}
 