import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { useToast } from '../components/Toast'
import CreditIcon from '../components/CreditIcon'
import { PAYMENTS_ENABLED } from '../config/features'

const PACKS = [
  { id: 'starter', name: 'Starter', credits: 60,  price: 4.99,  hours: '1h',  popular: false },
  { id: 'plus',    name: 'Plus',    credits: 180, price: 9.99,  hours: '3h',  popular: true  },
  { id: 'pro',     name: 'Pro',     credits: 360, price: 17.99, hours: '6h',  popular: false },
  { id: 'max',     name: 'Max',     credits: 720, price: 29.99, hours: '12h', popular: false },
]
const LIMIT = 500

const TRUST_BADGES = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#3D5C28" strokeWidth="1.6" strokeLinecap="round">
        <rect x="2" y="7" width="16" height="12" rx="3"/><path d="M6 7V5a4 4 0 018 0v2"/>
      </svg>
    ),
    label: 'Paiement sécurisé',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#3D5C28" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 10a6 6 0 1012 0 6 6 0 00-12 0M10 4v2M10 14v2M4 10H2M18 10h-2"/>
      </svg>
    ),
    label: 'Crédits permanents',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#3D5C28" strokeWidth="1.6" strokeLinecap="round">
        <path d="M13 2L4 11h7l-4 7 9-9h-7z"/>
      </svg>
    ),
    label: 'Utilisation instantanée',
  },
]

export default function Credits() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const addToast = useToast()

  const [buying,   setBuying]   = useState(null)
  const [error,    setError]    = useState('')
  const [paid,     setPaid]     = useState(false)
  const [paidPack, setPaidPack] = useState(null)
  const [newBal,   setNewBal]   = useState(null)

  const balance = user?.credits ?? 0

  const handleBuy = async (pack) => {
    if (!PAYMENTS_ENABLED) return
    setError('')
    setBuying(pack.id)
    try {
      const res = await api.post('/credits/purchase', {
        packId:  pack.id,
        credits: pack.credits,
        amount:  pack.price,
      })
      const bal = res.data.credits ?? res.data.user?.credits ?? (balance + pack.credits)
      if (res.data.user) setUser(res.data.user)
      setNewBal(bal)
      setPaidPack(pack)
      setPaid(true)
      addToast?.(`${pack.credits} crédits ajoutés !`, 'success')
    } catch (e) {
      setError(e.response?.data?.message || 'Erreur lors de l\'achat. Réessayez.')
    } finally {
      setBuying(null)
    }
  }

  /* ── Écran de confirmation ── */
  if (PAYMENTS_ENABLED && paid && paidPack) {
    return (
      <main className="min-h-screen bg-[#FDFAF4] flex items-center justify-center p-6">
        <div className="animate-fade-up w-full max-w-md rounded-3xl border border-[#E8DDC7] bg-white p-8 text-center shadow-soft">
          <span className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-[#3D5C28] text-white mb-6">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M6 18l8 8L30 10"/>
            </svg>
          </span>
          <h1 className="text-3xl font-black tracking-tight text-[#252840]">Paiement réussi !</h1>
          <p className="mt-2 text-[#756B5B]">
            {paidPack.credits} crédits ont été ajoutés à ton compte.
          </p>
          <div className="mt-6 rounded-2xl bg-[#F8F4EA] p-5">
            <p className="text-sm text-[#756B5B]">Nouveau solde</p>
            <p className="text-4xl font-black text-[#252840]">
              {Math.min(newBal, LIMIT)} <span className="text-lg font-semibold text-[#C8864B]">cr</span>
            </p>
          </div>
          <button
            onClick={() => { setPaid(false); setPaidPack(null) }}
            className="mt-6 w-full py-3 rounded-full bg-[#252840] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors"
          >
            Retour aux crédits
          </button>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#FDFAF4]">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">

        <div className="text-center mb-8">
          <h1 className="text-4xl font-black tracking-tight text-[#252840]">Acheter des crédits</h1>
          <p className="mt-2 text-[#756B5B]">
            Les crédits n'expirent jamais · limite de {LIMIT} cr
          </p>
        </div>

        {/* Balance card */}
        <div className="mx-auto mb-8 max-w-2xl rounded-3xl border border-[#E8DDC7] bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-[rgba(200,134,75,0.12)]">
                <CreditIcon size="md" />
              </span>
              <div>
                <p className="text-sm text-[#756B5B]">Solde actuel</p>
                <p className="text-2xl font-black text-[#252840]">{balance} cr</p>
              </div>
            </div>
            <p className="text-sm font-semibold text-[#756B5B]">{balance} / {LIMIT}</p>
          </div>
          <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-[#F8F4EA]">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${Math.min((balance / LIMIT) * 100, 100)}%`,
                background: 'linear-gradient(to right, #3D5C28, #C8864B)',
              }}
            />
          </div>
        </div>

        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 px-5 py-4 text-red-600 text-sm font-semibold">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="8" cy="8" r="7"/><path d="M8 5v3M8 11h.01"/>
            </svg>
            {error}
          </div>
        )}

        {/* Grille des packs */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 mb-10">
          {PACKS.map(pack => {
            const exceeds  = balance + pack.credits > LIMIT
            const disabled = !PAYMENTS_ENABLED || balance >= LIMIT || exceeds || buying !== null

            return (
              <div
                key={pack.id}
                className={`relative flex flex-col rounded-3xl bg-white p-6 shadow-card transition-transform hover:-translate-y-1 ${
                  pack.popular ? 'border-2 border-[#C8864B]' : 'border border-[#E8DDC7]'
                } ${exceeds || balance >= LIMIT ? 'opacity-55' : ''}`}
              >
                {pack.popular && (
                  <span className="absolute -top-3 left-6 rounded-full bg-[#C8864B] px-3 py-1 text-xs font-bold text-white">
                    Populaire
                  </span>
                )}
                {exceeds && balance < LIMIT && (
                  <span className="absolute -top-3 right-6 inline-flex items-center gap-1 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white">
                    <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M5.5 1L10 9.5H1z"/><path d="M5.5 4.5v2M5.5 8v.5"/></svg>
                    Dépasse la limite
                  </span>
                )}

                <p className="text-xs font-bold uppercase tracking-widest text-[#756B5B]">{pack.name}</p>
                <p className="mt-3 text-4xl font-black text-[#252840]">
                  {pack.credits} <span className="text-lg font-bold text-[#C8864B]">cr</span>
                </p>
                <p className="mt-1 text-[#756B5B] text-sm">{pack.price.toFixed(2)} € · {pack.hours} de session</p>

                <button
                  onClick={() => handleBuy(pack)}
                  disabled={disabled}
                  className={`mt-6 w-full rounded-full py-3 text-sm font-bold border-none cursor-pointer transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
                    pack.popular
                      ? 'bg-[#C8864B] text-white hover:bg-[#B07030]'
                      : 'bg-[#252840] text-white hover:bg-[#363B6B]'
                  }`}
                >
                  {!PAYMENTS_ENABLED ? 'Bientôt disponible' : buying === pack.id ? 'Traitement…' : exceeds || balance >= LIMIT ? 'Plafond atteint' : 'Acheter'}
                </button>
              </div>
            )
          })}
        </div>

        {/* Section augmentation plafond */}
        <div className="mb-10 rounded-3xl border border-[#E8DDC7] bg-white p-6 shadow-card">
          <h2 className="text-lg font-bold text-[#252840] mb-1">Augmenter votre plafond</h2>
          <p className="text-sm text-[#756B5B] mb-4">Passez à 750 cr ou 1000 cr pour stocker plus de crédits</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {[
              { limit: 750, price: '9.99 €' },
              { limit: 1000, price: '14.99 €' },
            ].map(opt => (
              <button
                key={opt.limit}
                disabled={!PAYMENTS_ENABLED}
                onClick={() => PAYMENTS_ENABLED && api.post('/credits/increase-limit', { newLimit: opt.limit })
                  .then(() => addToast?.(`Plafond augmenté à ${opt.limit} cr`, 'success'))
                  .catch(() => addToast?.("Erreur lors de l'augmentation du plafond.", 'error'))
                }
                className={`flex items-center justify-between rounded-2xl border border-[#E8DDC7] px-5 py-4 text-sm font-semibold text-[#252840] bg-transparent transition-colors ${
                  PAYMENTS_ENABLED
                    ? 'cursor-pointer hover:border-[#C8864B] hover:bg-[rgba(200,134,75,0.05)]'
                    : 'cursor-not-allowed opacity-60'
                }`}
              >
                <span>{opt.limit} cr</span>
                <span className="text-[#C8864B] font-bold">{PAYMENTS_ENABLED ? opt.price : 'Bientôt disponible'}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {TRUST_BADGES.map(b => (
            <div
              key={b.label}
              className="flex items-center justify-center gap-2 rounded-2xl border border-[#E8DDC7] bg-white p-4 text-sm font-semibold text-[#252840]"
            >
              {b.icon} {b.label}
            </div>
          ))}
        </div>

      </div>
    </main>
  )
}
