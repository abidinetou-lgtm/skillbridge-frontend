import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import CreditIcon from './CreditIcon'

const NAV_LINKS = [
  { to: '/',           label: 'Accueil',    public: true  },
  { to: '/connection', label: 'Connexions', public: true  },
  { to: '/sessions',   label: 'Sessions',   public: false },
  { to: '/chat',       label: 'Messages',   public: false },
  { to: '/credits',    label: 'Crédits',    public: false },
]

function Avatar({ user }) {
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt={user.firstName}
        className="w-9 h-9 rounded-full object-cover border-2 border-[#C8864B]"
      />
    )
  }
  return (
    <div className="w-9 h-9 rounded-full bg-[#252840] flex items-center justify-center text-xs font-bold text-[#F8F4EA] border-2 border-[#C8864B]">
      {initials}
    </div>
  )
}

export default function Navbar() {
  const [menuOpen,      setMenuOpen]      = useState(false)
  const [installPrompt, setInstallPrompt] = useState(null)
  const { user, openModal, logout } = useAuthStore()
  const location = useLocation()
  const navigate = useNavigate()

  const visibleLinks = NAV_LINKS.filter(l => l.public || !!user)
  const pathname = location.pathname

  const isActive = (to) =>
    to === '/' ? pathname === '/' : pathname === to || pathname.startsWith(to + '/')

  useEffect(() => {
    const handler = (e) => { e.preventDefault(); setInstallPrompt(e) }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = () => {
    if (installPrompt) { installPrompt.prompt(); setInstallPrompt(null) }
  }

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-[#E8DDC7] bg-[rgba(253,250,244,0.88)] backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">

          {/* Logo */}
          <Link to="/" className="flex-shrink-0 no-underline">
            <img src="/skillbridge-logo.png" alt="SkillBridge" className="h-8 w-auto" />
          </Link>

          {/* Liens desktop */}
          <nav className="hidden items-center gap-1 lg:flex">
            {visibleLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                className={`rounded-full px-4 py-2 text-sm font-medium transition-colors no-underline ${
                  isActive(to)
                    ? 'bg-[#252840] text-[#F8F4EA]'
                    : 'text-[#756B5B] hover:bg-[#F8F4EA] hover:text-[#252840]'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Actions desktop */}
          <div className="hidden items-center gap-3 lg:flex">
            {installPrompt && (
              <button onClick={handleInstall}
                className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-[#C8864B] text-white text-sm font-semibold border-none cursor-pointer hover:bg-[#B07030] transition-colors">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M8 2v8M5 7l3 3 3-3M2 12h12"/>
                </svg>
                Installer l'app
              </button>
            )}
            {user ? (
              <>
                <Link
                  to="/credits"
                  className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(61,92,40,0.1)] px-3 py-1.5 text-sm font-semibold text-[#3D5C28] no-underline"
                >
                  <CreditIcon size="sm" /> {user.credits ?? 0}
                </Link>
                <Link to="/profile" className="no-underline">
                  <Avatar user={user} />
                </Link>
                <button
                  onClick={() => { logout(); navigate('/') }}
                  className="grid h-9 w-9 place-items-center rounded-full bg-transparent border-none cursor-pointer text-[#756B5B] hover:bg-[#F8F4EA] hover:text-[#252840] transition-colors"
                  aria-label="Se déconnecter"
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M10 3h3a1 1 0 011 1v8a1 1 0 01-1 1h-3M7 11l3-3-3-3M1 8h9"/>
                  </svg>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => openModal('login')}
                  className="px-4 py-2 rounded-full border border-[#E8DDC7] text-sm font-semibold text-[#252840] bg-transparent cursor-pointer hover:border-[#252840] transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => navigate('/register')}
                  className="px-4 py-2 rounded-full bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors"
                >
                  S'inscrire
                </button>
              </>
            )}
          </div>

          {/* Bouton hamburger mobile */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <Link to="/profile" className="no-underline">
                <Avatar user={user} />
              </Link>
            )}
            <button
              onClick={() => setMenuOpen(o => !o)}
              className="grid h-10 w-10 place-items-center rounded-full bg-transparent border-none cursor-pointer text-[#252840] hover:bg-[#F8F4EA] transition-colors"
              aria-label="Menu"
            >
              {menuOpen ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M4 4l12 12M16 4L4 16"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M3 6h14M3 10h14M3 14h14"/>
                </svg>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Drawer mobile */}
      {menuOpen && (
        <div className="fixed inset-0 z-30 lg:hidden" onClick={() => setMenuOpen(false)}>
          <div
            className="absolute top-16 right-0 w-72 bg-[#FDFAF4] border-l border-b border-[#E8DDC7] shadow-soft rounded-bl-3xl p-5"
            onClick={e => e.stopPropagation()}
          >
            <nav className="flex flex-col gap-1 mb-6">
              {visibleLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-4 py-3 text-base font-semibold no-underline transition-colors ${
                    isActive(to)
                      ? 'bg-[#252840] text-[#F8F4EA]'
                      : 'text-[#1A1410] hover:bg-[#F8F4EA]'
                  }`}
                >
                  {label}
                </Link>
              ))}
              {user && (
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-xl px-4 py-3 text-base font-semibold text-[#1A1410] hover:bg-[#F8F4EA] no-underline transition-colors"
                >
                  Mon profil
                </Link>
              )}
            </nav>

            {user ? (
              <div className="flex flex-col gap-2">
                <Link
                  to="/credits"
                  onClick={() => setMenuOpen(false)}
                  className="inline-flex items-center gap-2 rounded-full bg-[rgba(61,92,40,0.1)] px-3 py-2 text-sm font-semibold text-[#3D5C28] no-underline w-fit"
                >
                  <CreditIcon size="sm" /> {user.credits ?? 0} crédits
                </Link>
                <button
                  onClick={() => { logout(); navigate('/'); setMenuOpen(false) }}
                  className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#E8DDC7] text-sm font-semibold text-[#756B5B] bg-transparent cursor-pointer hover:border-red-300 hover:text-red-500 transition-colors"
                >
                  Se déconnecter
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => { openModal('login'); setMenuOpen(false) }}
                  className="px-4 py-3 rounded-xl border border-[#E8DDC7] text-sm font-semibold text-[#252840] bg-transparent cursor-pointer hover:border-[#252840] transition-colors"
                >
                  Se connecter
                </button>
                <button
                  onClick={() => { navigate('/register'); setMenuOpen(false) }}
                  className="px-4 py-3 rounded-xl bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors"
                >
                  S'inscrire gratuitement
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
