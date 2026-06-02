import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

export default function Navbar() {
  const [scrolled,   setScrolled]   = useState(false)
  const [menuOpen,   setMenuOpen]   = useState(false)
  const { user, openModal, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Fermer le menu au changement de page
  useEffect(() => { setMenuOpen(false) }, [location.pathname])

  const links = [
    { to: '/',           label: 'Home',       public: true  },
    { to: '/connection', label: 'Connection', public: true  },
    { to: '/feed',       label: 'Feed',       public: true  },
    { to: '/sessions',   label: 'Sessions',   public: false },
    { to: '/chat',       label: 'Chat',       public: false },
    { to: '/profile',    label: 'Profile',    public: false },
  ]

  const visibleLinks = links.filter(l => l.public || !!user)

  return (
    <>
      <nav className={`
        fixed z-50 flex items-center
        bg-[rgba(248,244,234,0.96)] backdrop-blur-md
        border border-black/[0.09]
        transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]
        ${scrolled
          ? 'top-[10px] left-1/2 -translate-x-1/2 right-auto w-[780px] max-w-[calc(100vw-16px)] h-[46px] px-4 rounded-full shadow-[0_4px_20px_rgba(26,20,16,0.10)]'
          : 'top-0 left-0 right-0 h-[62px] px-4 md:px-16 rounded-none shadow-none'
        }
      `}>

        {/* Logo */}
        <Link to="/" className="font-black text-[19px] tracking-tight flex-shrink-0 no-underline flex items-center leading-none">
          <span className="text-[#252840]">Skill</span>
          <span className="text-[#C8864B]">Bridge</span>
        </Link>

        {/* Liens desktop */}
        <div className="hidden md:flex items-center gap-[2px] mx-auto">
          {visibleLinks.map(({ to, label }) => {
            const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
            return (
              <Link key={to} to={to}
                className={`
                  px-3 py-[5px] rounded-lg font-medium no-underline
                  transition-all duration-150 whitespace-nowrap leading-none
                  ${scrolled ? 'text-[12px]' : 'text-[13px]'}
                  ${isActive ? 'text-[#1A1410] font-bold' : 'text-[#7A6E5C] hover:text-[#1A1410] hover:bg-black/5'}
                `}>
                {label}
              </Link>
            )
          })}
        </div>

        {/* Auth desktop */}
        <div className="hidden md:flex gap-2 items-center flex-shrink-0">
          {user ? (
            <div className="flex items-center gap-2">
              <Link to="/profile"
                className="w-8 h-8 rounded-full bg-[#252840] text-white text-xs font-bold flex items-center justify-center cursor-pointer no-underline hover:bg-[#363B6B] transition-all">
                {user.firstName?.[0]?.toUpperCase() ?? 'U'}
              </Link>
              <button onClick={() => { logout(); navigate('/') }}
                className={`bg-transparent border-none cursor-pointer text-[#7A6E5C] hover:text-[#1A1410] transition-all ${scrolled ? 'text-[11px]' : 'text-[12px]'}`}>
                Log out
              </button>
            </div>
          ) : (
            <>
              <button onClick={() => openModal('login')}
                className={`px-4 py-[6px] rounded-lg border-[1.5px] border-black/[0.09] font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all ${scrolled ? 'text-[11px]' : 'text-[13px]'}`}>
                Log in
              </button>
              <button onClick={() => navigate('/register')}
                className={`px-4 py-[6px] rounded-lg border-none font-bold text-white bg-[#252840] cursor-pointer hover:bg-[#363B6B] transition-all ${scrolled ? 'text-[11px]' : 'text-[13px]'}`}>
                Sign up
              </button>
            </>
          )}
        </div>

        {/* Hamburger mobile */}
        <div className="md:hidden flex items-center gap-3 ml-auto">
          {user && (
            <Link to="/profile"
              className="w-8 h-8 rounded-full bg-[#252840] text-white text-xs font-bold flex items-center justify-center cursor-pointer no-underline">
              {user.firstName?.[0]?.toUpperCase() ?? 'U'}
            </Link>
          )}
          <button onClick={() => setMenuOpen(o => !o)}
            className="w-9 h-9 flex flex-col items-center justify-center gap-[5px] bg-transparent border-none cursor-pointer">
            <span className={`block w-5 h-[2px] bg-[#1A1410] transition-all ${menuOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-[#1A1410] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-[#1A1410] transition-all ${menuOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Menu mobile déroulant */}
      {menuOpen && (
        <div className="fixed top-[62px] left-0 right-0 z-40 bg-[rgba(248,244,234,0.98)] backdrop-blur-md border-b border-black/[0.09] md:hidden">
          <div className="flex flex-col py-3">
            {visibleLinks.map(({ to, label }) => {
              const isActive = location.pathname === to || (to !== '/' && location.pathname.startsWith(to))
              return (
                <Link key={to} to={to}
                  className={`px-6 py-3 text-[15px] font-medium no-underline transition-all
                    ${isActive ? 'text-[#1A1410] font-bold bg-black/5' : 'text-[#7A6E5C]'}`}>
                  {label}
                </Link>
              )
            })}
            <div className="px-6 py-4 flex gap-3 border-t border-black/[0.06] mt-2">
              {user ? (
                <button onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}
                  className="flex-1 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-[14px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer">
                  Log out
                </button>
              ) : (
                <>
                  <button onClick={() => { openModal('login'); setMenuOpen(false) }}
                    className="flex-1 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-[14px] font-semibold text-[#1A1410] bg-transparent cursor-pointer">
                    Log in
                  </button>
                  <button onClick={() => { navigate('/register'); setMenuOpen(false) }}
                    className="flex-1 py-2 rounded-lg border-none text-[14px] font-bold text-white bg-[#252840] cursor-pointer">
                    Sign up
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}