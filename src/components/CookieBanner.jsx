// src/components/CookieBanner.jsx
// S'affiche une seule fois au premier chargement du site
// Dev 2 pourra plus tard sauvegarder ce choix en base de données
 
import { useState, useEffect } from 'react'
 
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
 
  useEffect(() => {
    // On vérifie si l'utilisateur a déjà répondu
    const choice = localStorage.getItem('sb_cookie')
    if (!choice) setVisible(true)
  }, [])
 
  const accept = () => {
    localStorage.setItem('sb_cookie', 'ok')
    setVisible(false)
  }
 
  const decline = () => {
    localStorage.setItem('sb_cookie', 'declined')
    setVisible(false)
  }
 
  if (!visible) return null
 
  return (
    <div className="
      fixed bottom-6 left-1/2 -translate-x-1/2 z-[9999]
      bg-[#1A1410] text-[rgba(253,250,244,0.82)]
      rounded-2xl px-6 py-[18px]
      flex items-center gap-5
      max-w-[680px] w-[calc(100vw-32px)]
      shadow-[0_8px_40px_rgba(0,0,0,0.28)]
      animate-[slideUp_0.4s_cubic-bezier(0.4,0,0.2,1)]
    ">
      <p className="text-[13px] leading-[1.55] flex-1">
        We use cookies to improve your experience. By using SkillBridge you agree to our{' '}
        <a href="/privacy" className="text-[#C8864B] no-underline hover:underline">Privacy Policy</a>
        {' '}and{' '}
        <a href="/terms" className="text-[#C8864B] no-underline hover:underline">Terms of Service</a>.
      </p>
      <div className="flex gap-2 flex-shrink-0">
        <button
          onClick={decline}
          className="px-4 py-2 rounded-lg bg-transparent text-[rgba(253,250,244,0.6)] border border-white/15 text-xs font-bold cursor-pointer hover:border-white/40 transition-all font-inter"
        >
          Decline
        </button>
        <button
          onClick={accept}
          className="px-4 py-2 rounded-lg bg-[#C8864B] text-white border-none text-xs font-bold cursor-pointer hover:bg-[#8C5A1E] transition-all font-inter"
        >
          Accept
        </button>
      </div>
    </div>
  )
}