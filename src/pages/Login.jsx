import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authApi, getApiError } from '../services/api'

export default function Login() {
  const navigate = useNavigate()
  const { setAuth } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (event) => {
    event.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await authApi.login(form)
      setAuth(result.user, result.token)
      navigate('/profile')
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#F8F4EA] px-4">
      <form onSubmit={submit} className="bg-[#FDFAF4] rounded-2xl border border-black/[0.09] p-8 w-full max-w-[400px]">
        <h1 className="text-2xl font-black text-[#1A1410] mb-1">Log in</h1>
        <p className="text-[13px] text-[#7A6E5C] mb-6">Uses the real SkillBridge backend.</p>
        <input className="w-full px-4 py-3 rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[14px] outline-none mb-3" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} required />
        <input className="w-full px-4 py-3 rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[14px] outline-none mb-4" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm((p) => ({ ...p, password: e.target.value }))} required />
        {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
        <button disabled={loading} className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer disabled:opacity-50">
          {loading ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </main>
  )
}
