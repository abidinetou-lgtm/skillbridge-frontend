// src/components/Navbar.jsx
import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import useAuthStore from '../store/authStore'
 
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const { user, openModal } = useAuthStore()
  const location = useLocation()
 
  // Détecte le scroll pour passer en mode "mini pilule"
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
 
  const links = [
    { to: '/',       label: 'Home' },
    { to: '/#how',   label: 'How it works' },
    { to: '/match',  label: 'Match' },
    { to: '/feed',   label: 'Feed' },
    { to: '/chat',   label: 'Chat' },
    { to: '/profile',label: 'Profile' },
  ]
 
  // Classes dynamiques selon l'état scroll
  const navBase = `
    fixed top-0 left-0 right-0 z-50 flex items-center
    bg-[rgba(248,244,234,0.94)] backdrop-blur-md border-b border-black/[0.09]
    transition-all duration-300
  `
  const navNormal = 'h-[62px] px-20'
  const navMini   = `
    top-[10px] left-1/2 -translate-x-1/2 right-auto
    w-[640px] max-w-[calc(100vw-32px)] h-[46px] px-5
    rounded-full border border-black/[0.09]
    shadow-[0_4px_20px_rgba(26,20,16,0.09)]
  `
 
  return (
    <nav className={`${navBase} ${scrolled ? navMini : navNormal}`}>
 
      {/* Logo */}
      <Link to="/" className="font-black text-[19px] tracking-tight flex-shrink-0 no-underline flex items-center">
        <span className="text-[#252840]">Skill</span>
        <span className="text-[#C8864B]">Bridge</span>
      </Link>
 
      {/* Liens centraux */}
      <div className="flex gap-[2px] mx-auto">
        {links.map(({ to, label }) => {
          const isActive = location.pathname === to
          return (
            <Link
              key={to}
              to={to}
              className={`
                px-3 py-[6px] rounded-lg text-[13px] font-medium no-underline
                transition-all duration-150
                ${isActive
                  ? 'text-[#1A1410] font-bold'
                  : 'text-[#7A6E5C] hover:text-[#1A1410] hover:bg-black/5'
                }
                ${scrolled ? 'text-[12px] px-[10px] py-[5px]' : ''}
              `}
            >
              {label}
            </Link>
          )
        })}
      </div>
 
      {/* Boutons auth — disparaissent si connecté */}
      <div className="flex gap-2 items-center flex-shrink-0">
        {user ? (
          // Avatar affiché après connexion
          <div className="w-8 h-8 rounded-full bg-[#252840] text-white text-xs font-bold flex items-center justify-center cursor-pointer">
            {user.prenom?.[0]?.toUpperCase() ?? 'U'}
          </div>
        ) : (
          <>
            <button
              onClick={() => openModal('login')}
              className="px-4 py-[6px] rounded-lg border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all"
            >
              Log in
            </button>
            <button
              onClick={() => openModal('register')}
              className="px-4 py-[6px] rounded-lg border-none text-[13px] font-bold text-white bg-[#252840] cursor-pointer hover:bg-[#363B6B] transition-all"
            >
              Sign up free
            </button>
          </>
        )}
      </div>
 
    </nav>
  )
}
 