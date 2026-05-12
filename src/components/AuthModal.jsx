// src/components/AuthModal.jsx
// Modal de connexion / inscription
// Dev 3 branchera la vraie API ici — pour l'instant tout est visuel
 
import { useEffect } from 'react'
import useAuthStore from '../store/authStore'
 
export default function AuthModal() {
  const { modalOpen, modalMode, closeModal, switchMode, login } = useAuthStore()
 
  // Fermer avec Escape
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])
 
  // Demo login — Dev 3 remplacera ça par un vrai appel API
  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO (Dev 3): appeler POST /api/auth/login ou /api/auth/register
    // et récupérer le token JWT
    login({ prenom: 'Alice', email: 'alice@example.com' }, 'demo-token')
  }
 
  if (!modalOpen) return null
 
  return (
    <div
      className="fixed inset-0 z-[500] bg-[rgba(26,20,16,0.6)] backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div className="bg-[#FDFAF4] rounded-2xl p-10 w-[400px] max-w-[calc(100vw-32px)] relative">
 
        {/* Bouton fermer */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C] text-base flex items-center justify-center hover:bg-black/10 transition-all"
        >
          ✕
        </button>
 
        {/* LOGIN */}
        {modalMode === 'login' && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-black tracking-tight text-[#1A1410] mb-1">Welcome back</h2>
            <p className="text-[13px] text-[#7A6E5C] mb-6">Log in to continue your skill exchanges</p>
 
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-[#3D3020]">Email</label>
              <input type="email" placeholder="you@example.com" required
                className="px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] font-inter bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-xs font-semibold text-[#3D3020]">Password</label>
              <input type="password" placeholder="••••••••" required
                className="px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] font-inter bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
              />
            </div>
 
            <button type="submit"
              className="w-full py-3 rounded-[10px] border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter"
            >
              Log in
            </button>
 
            <div className="text-center text-xs text-[#7A6E5C] my-3 relative
              before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[40%] before:h-px before:bg-black/[0.09]
              after:content-['']  after:absolute  after:top-1/2 after:right-0 after:w-[40%] after:h-px  after:bg-black/[0.09]">
              or
            </div>
 
            <button type="button"
              className="w-full py-[11px] rounded-[10px] border-[1.5px] border-black/[0.09] bg-white text-[13px] font-semibold text-[#1A1410] cursor-pointer flex items-center justify-center gap-2 hover:border-[#1A1410] transition-all font-inter"
            >
              <GoogleIcon /> Continue with Google
            </button>
 
            <p className="text-center text-[13px] text-[#7A6E5C] mt-4">
              No account?{' '}
              <button type="button" onClick={() => switchMode('register')}
                className="text-[#252840] font-bold bg-transparent border-none cursor-pointer">
                Sign up free
              </button>
            </p>
          </form>
        )}
 
        {/* REGISTER */}
        {modalMode === 'register' && (
          <form onSubmit={handleSubmit}>
            <h2 className="text-2xl font-black tracking-tight text-[#1A1410] mb-1">Join SkillBridge</h2>
            <p className="text-[13px] text-[#7A6E5C] mb-6">Create your account and start exchanging skills</p>
 
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-[#3D3020]">First name</label>
              <input type="text" placeholder="Alice" required
                className="px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] font-inter bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-[#3D3020]">Email</label>
              <input type="email" placeholder="you@example.com" required
                className="px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] font-inter bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-xs font-semibold text-[#3D3020]">Password</label>
              <input type="password" placeholder="••••••••" required
                className="px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] font-inter bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
              />
            </div>
 
            <button type="submit"
              className="w-full py-3 rounded-[10px] border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter"
            >
              Create account
            </button>
 
            <div className="text-center text-xs text-[#7A6E5C] my-3 relative
              before:content-[''] before:absolute before:top-1/2 before:left-0 before:w-[40%] before:h-px before:bg-black/[0.09]
              after:content-['']  after:absolute  after:top-1/2 after:right-0 after:w-[40%] after:h-px  after:bg-black/[0.09]">
              or
            </div>
 
            <button type="button"
              className="w-full py-[11px] rounded-[10px] border-[1.5px] border-black/[0.09] bg-white text-[13px] font-semibold text-[#1A1410] cursor-pointer flex items-center justify-center gap-2 hover:border-[#1A1410] transition-all font-inter"
            >
              <GoogleIcon /> Continue with Google
            </button>
 
            <p className="text-center text-[13px] text-[#7A6E5C] mt-4">
              Already have an account?{' '}
              <button type="button" onClick={() => switchMode('login')}
                className="text-[#252840] font-bold bg-transparent border-none cursor-pointer">
                Log in
              </button>
            </p>
          </form>
        )}
 
      </div>
    </div>
  )
}
 
// Icône Google inline — pas besoin de librairie externe
function GoogleIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16">
      <path d="M15.68 8.18c0-.57-.05-1.12-.14-1.64H8v3.1h4.3a3.68 3.68 0 01-1.6 2.41v2h2.6c1.52-1.4 2.38-3.46 2.38-5.87z" fill="#4285F4"/>
      <path d="M8 16c2.16 0 3.97-.72 5.3-1.94l-2.6-2c-.71.48-1.63.76-2.7.76-2.08 0-3.84-1.4-4.47-3.28H.86v2.07A8 8 0 008 16z" fill="#34A853"/>
      <path d="M3.53 9.54A4.8 4.8 0 013.28 8c0-.54.09-1.06.25-1.54V4.39H.86A8 8 0 000 8c0 1.29.31 2.51.86 3.61l2.67-2.07z" fill="#FBBC05"/>
      <path d="M8 3.18c1.17 0 2.22.4 3.05 1.2l2.28-2.28A8 8 0 00.86 4.4l2.67 2.07C4.16 4.58 5.92 3.18 8 3.18z" fill="#EA4335"/>
    </svg>
  )
}