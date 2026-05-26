import { useEffect, useRef, useState } from 'react'
import useAuthStore from '../store/authStore'
import { authApi, getApiError } from '../services/api'

export default function AuthModal() {
  const { modalOpen, modalMode, closeModal, switchMode, login } = useAuthStore()
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const loginEmailRef    = useRef()
  const loginPasswordRef = useRef()
  const regFirstRef      = useRef()
  const regEmailRef      = useRef()
  const regPasswordRef   = useRef()

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => { setError('') }, [modalMode])

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.login({
        email:    loginEmailRef.current.value.trim(),
        password: loginPasswordRef.current.value,
      })
      login(data.user, data.token)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = await authApi.register({
        firstName: regFirstRef.current.value.trim(),
        lastName:  'User',
        email:     regEmailRef.current.value.trim(),
        password:  regPasswordRef.current.value,
      })
      login(data.user, data.token)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  if (!modalOpen) return null

  const inputCls = "px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all w-full"
  const btnCls   = "w-full py-3 rounded-[10px] border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50"

  return (
    <div
      className="fixed inset-0 z-[500] bg-[rgba(26,20,16,0.6)] backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div className="bg-[#FDFAF4] rounded-2xl p-10 w-[400px] max-w-[calc(100vw-32px)] relative">

        <button onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C] flex items-center justify-center hover:bg-black/10 transition-all">
          ✕
        </button>

        {/* LOGIN */}
        {modalMode === 'login' && (
          <form onSubmit={handleLogin}>
            <h2 className="text-2xl font-black tracking-tight text-[#1A1410] mb-1">Welcome back</h2>
            <p className="text-[13px] text-[#7A6E5C] mb-6">Log in to continue your skill exchanges</p>

            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}

            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-[#3D3020]">Email</label>
              <input ref={loginEmailRef} type="email" placeholder="you@example.com" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-xs font-semibold text-[#3D3020]">Password</label>
              <input ref={loginPasswordRef} type="password" placeholder="••••••••" required className={inputCls} />
            </div>

            <button type="submit" disabled={loading} className={btnCls}>
              {loading ? 'Logging in…' : 'Log in'}
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
          <form onSubmit={handleRegister}>
            <h2 className="text-2xl font-black tracking-tight text-[#1A1410] mb-1">Join SkillBridge</h2>
            <p className="text-[13px] text-[#7A6E5C] mb-6">Create your account and start exchanging skills</p>

            {error && <p className="text-red-500 text-[13px] mb-3">{error}</p>}

            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-[#3D3020]">First name</label>
              <input ref={regFirstRef} type="text" placeholder="Alice" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1 mb-3">
              <label className="text-xs font-semibold text-[#3D3020]">Email</label>
              <input ref={regEmailRef} type="email" placeholder="you@example.com" required className={inputCls} />
            </div>
            <div className="flex flex-col gap-1 mb-4">
              <label className="text-xs font-semibold text-[#3D3020]">Password (min. 8 characters)</label>
              <input ref={regPasswordRef} type="password" placeholder="••••••••" required minLength={8} className={inputCls} />
            </div>

            <button type="submit" disabled={loading} className={btnCls}>
              {loading ? 'Creating account…' : 'Create account'}
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