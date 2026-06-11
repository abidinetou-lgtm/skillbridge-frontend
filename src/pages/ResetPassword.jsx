import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2 no-underline">
      <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#C8864B] text-white flex-shrink-0">
        <span className="text-sm font-black leading-none">S</span>
      </span>
      <span className="text-xl font-black tracking-tight">
        <span className="text-[#252840]">Skill</span>
        <span className="text-[#C8864B]">Bridge</span>
      </span>
    </Link>
  )
}

export default function ResetPassword() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const token = params.get('token')

  const [password, setPassword] = useState('')
  const [confirm, setConfirm]   = useState('')
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!token) { setError('Lien invalide ou expiré.'); return }
    if (password.length < 8) { setError('Le mot de passe doit contenir au moins 8 caractères.'); return }
    if (password !== confirm) { setError('Les mots de passe ne correspondent pas.'); return }
    setError('')
    setLoading(true)
    try {
      await api.post('/auth/reset-password', { token, password })
      setDone(true)
    } catch (err) {
      setError(err.response?.data?.message || 'Erreur lors de la réinitialisation')
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full h-11 rounded-xl border border-[#E8DDC7] bg-[#FDFAF4] px-4 text-sm outline-none focus:border-[#C8864B] transition-colors"

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#FDFAF4] px-4">
      <div className="w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>

        <div className="rounded-3xl border border-[#E8DDC7] bg-white p-8 shadow-soft">
          {done ? (
            <div className="animate-fade-up flex flex-col items-center gap-4 text-center">
              <span className="grid h-16 w-16 place-items-center rounded-full bg-[rgba(61,92,40,0.15)] text-[#3D5C28]">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 14l6 6L23 8"/>
                </svg>
              </span>
              <h1 className="text-2xl font-black tracking-tight text-[#252840]">Mot de passe réinitialisé !</h1>
              <p className="text-sm text-[#756B5B]">
                Votre mot de passe a été mis à jour. Vous pouvez maintenant vous connecter.
              </p>
              <button
                onClick={() => navigate('/')}
                className="w-full py-3 rounded-xl bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors"
              >
                Se connecter
              </button>
            </div>
          ) : !token ? (
            <div className="text-center">
              <h1 className="text-2xl font-black tracking-tight text-[#252840] mb-2">Lien invalide</h1>
              <p className="text-sm text-[#756B5B] mb-6">Ce lien est invalide ou a expiré.</p>
              <Link
                to="/forgot-password"
                className="inline-flex items-center justify-center rounded-xl bg-[#252840] px-6 py-3 text-sm font-bold text-white no-underline hover:bg-[#363B6B] transition-colors"
              >
                Demander un nouveau lien
              </Link>
            </div>
          ) : (
            <>
              <span className="mx-auto mb-5 grid h-12 w-12 place-items-center rounded-xl bg-[#ECEEF8] text-[#252840]">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <rect x="3" y="10" width="16" height="11" rx="2"/><path d="M7 10V7a4 4 0 018 0v3"/>
                </svg>
              </span>
              <h1 className="text-2xl font-black tracking-tight text-[#252840]">Nouveau mot de passe</h1>
              <p className="mt-2 text-sm text-[#756B5B] mb-6">Choisissez un nouveau mot de passe sécurisé.</p>

              {error && (
                <p className="text-red-500 text-sm mb-4 bg-red-50 px-3 py-2 rounded-lg">{error}</p>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-[#252840] mb-1">Nouveau mot de passe</label>
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="8 caractères minimum"
                    className={inp}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-[#252840] mb-1">Confirmer le mot de passe</label>
                  <input
                    type="password"
                    required
                    value={confirm}
                    onChange={e => setConfirm(e.target.value)}
                    placeholder="Répéter le mot de passe"
                    className={inp}
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors disabled:opacity-50"
                >
                  {loading ? 'Réinitialisation…' : 'Réinitialiser le mot de passe'}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
