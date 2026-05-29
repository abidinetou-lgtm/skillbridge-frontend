import { useEffect, useState } from 'react'
import useAuthStore from '../store/authStore'
import { authApi, getApiError } from '../services/api'

export default function AuthModal() {
  const { modalOpen, modalMode, closeModal, switchMode, setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') closeModal() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => {
    if (modalOpen) setError('')
  }, [modalOpen, modalMode])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const form = new FormData(e.currentTarget)
    const values = Object.fromEntries(form.entries())

    try {
      const result = modalMode === 'login'
        ? await authApi.login({
            email: values.email,
            password: values.password,
          })
        : await authApi.register({
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            password: values.password,
          })

      setAuth(result.user, result.token)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  if (!modalOpen) return null

  const inputClass = 'px-[14px] py-[10px] rounded-[9px] border-[1.5px] border-black/[0.09] text-[14px] font-inter bg-[#F8F4EA] text-[#1A1410] outline-none focus:border-[#252840] transition-all'

  return (
    <div
      className="fixed inset-0 z-[500] bg-[rgba(26,20,16,0.6)] backdrop-blur-sm flex items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) closeModal() }}
    >
      <div className="bg-[#FDFAF4] rounded-2xl p-10 w-[400px] max-w-[calc(100vw-32px)] relative">
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C] text-base flex items-center justify-center hover:bg-black/10 transition-all"
        >
          x
        </button>

        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-black tracking-tight text-[#1A1410] mb-1">
            {modalMode === 'login' ? 'Welcome back' : 'Join SkillBridge'}
          </h2>
          <p className="text-[13px] text-[#7A6E5C] mb-6">
            {modalMode === 'login'
              ? 'Log in to continue your skill exchanges'
              : 'Create your account and start exchanging skills'}
          </p>

          {modalMode === 'register' && (
            <>
              <div className="flex flex-col gap-1 mb-3">
                <label className="text-xs font-semibold text-[#3D3020]">First name</label>
                <input name="firstName" type="text" placeholder="Alice" required className={inputClass} />
              </div>
              <div className="flex flex-col gap-1 mb-3">
                <label className="text-xs font-semibold text-[#3D3020]">Last name</label>
                <input name="lastName" type="text" placeholder="Martin" required className={inputClass} />
              </div>
            </>
          )}

          <div className="flex flex-col gap-1 mb-3">
            <label className="text-xs font-semibold text-[#3D3020]">Email</label>
            <input name="email" type="email" placeholder="you@example.com" required className={inputClass} />
          </div>
          <div className="flex flex-col gap-1 mb-4">
            <label className="text-xs font-semibold text-[#3D3020]">Password</label>
            <input name="password" type="password" placeholder="Minimum 8 characters" required minLength={modalMode === 'register' ? 8 : undefined} className={inputClass} />
          </div>

          {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-[10px] border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading
              ? modalMode === 'login' ? 'Logging in...' : 'Creating account...'
              : modalMode === 'login' ? 'Log in' : 'Create account'}
          </button>

          <p className="text-center text-[13px] text-[#7A6E5C] mt-4">
            {modalMode === 'login' ? 'No account?' : 'Already have an account?'}{' '}
            <button
              type="button"
              onClick={() => switchMode(modalMode === 'login' ? 'register' : 'login')}
              className="text-[#252840] font-bold bg-transparent border-none cursor-pointer"
            >
              {modalMode === 'login' ? 'Sign up free' : 'Log in'}
            </button>
          </p>
        </form>
      </div>
    </div>
  )
}
