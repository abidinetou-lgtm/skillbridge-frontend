import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { useToast } from '../components/Toast'
import CreditIcon from '../components/CreditIcon'

const STATUS_STYLE = {
  SCHEDULED: { bg: 'bg-[rgba(61,92,40,0.12)]', text: 'text-[#3D5C28]',   label: 'À venir'    },
  ACTIVE:    { bg: 'bg-[rgba(200,134,75,0.15)]', text: 'text-[#C8864B]', label: 'En direct'  },
  COMPLETED: { bg: 'bg-[rgba(37,40,64,0.1)]',   text: 'text-[#252840]', label: 'Terminée'   },
  CANCELLED: { bg: 'bg-red-50',                 text: 'text-red-500',    label: 'Annulée'    },
}

function AvatarInitials({ name, color }) {
  const parts = (name ?? '').split(' ')
  const initials = (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
  return (
    <div
      className="h-14 w-14 rounded-full flex items-center justify-center text-base font-bold text-white flex-shrink-0"
      style={{ background: color ?? '#252840' }}
    >
      {initials.toUpperCase() || '?'}
    </div>
  )
}

function CalIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
      <rect x="1" y="3" width="12" height="10" rx="2"/>
      <path d="M1 6h12M5 1v3M9 1v3"/>
    </svg>
  )
}

export default function Sessions() {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()
  const addToast  = useToast()

  const [sessions,   setSessions]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [error,      setError]      = useState('')
  const [tab,        setTab]        = useState('teach')
  const [confirmId,  setConfirmId]  = useState(null)
  const [cancelling, setCancelling] = useState(null)

  const loadSessions = useCallback(async () => {
    if (!user) return
    try {
      const res = await api.get('/sessions/mine')
      setSessions(res.data.sessions ?? [])
      setError('')
    } catch (e) {
      if (sessions.length === 0) setError(e.response?.data?.message || 'Erreur de chargement')
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    loadSessions()
    const id = setInterval(loadSessions, 3000)
    return () => clearInterval(id)
  }, [loadSessions])

  const handleCancel = async (sessionId) => {
    setCancelling(sessionId)
    try {
      await api.post(`/sessions/${sessionId}/end`, { durationSeconds: 0 })
      setConfirmId(null)
      loadSessions()
      addToast?.('Session annulée', 'info')
    } catch (e) {
      addToast?.(e.response?.data?.message || 'Erreur lors de l\'annulation', 'error')
    } finally {
      setCancelling(null)
    }
  }

  const teaching = sessions.filter(s => s.teacher?.id === user?.id)
  const learning = sessions.filter(s => s.learner?.id  === user?.id)
  const list     = tab === 'teach' ? teaching : learning

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('fr', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })
  }

  return (
    <main className="min-h-screen bg-[#FDFAF4]">
      {/* Modal annulation */}
      {confirmId && (
        <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-[400px] max-w-full shadow-soft border border-[#E8DDC7]">
            <h2 className="text-lg font-black text-[#252840] mb-2">Annuler cette séance ?</h2>
            <p className="text-sm text-[#756B5B] mb-6">
              La séance sera marquée comme annulée. Les crédits réservés seront remboursés.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => handleCancel(confirmId)}
                disabled={!!cancelling}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-sm font-bold border-none cursor-pointer hover:bg-red-600 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'Annulation…' : 'Confirmer l\'annulation'}
              </button>
              <button
                onClick={() => setConfirmId(null)}
                className="px-5 py-3 rounded-xl border border-[#E8DDC7] text-[#756B5B] text-sm font-semibold bg-transparent cursor-pointer hover:border-[#252840] transition-colors"
              >
                Retour
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <h1 className="text-4xl font-black tracking-tight text-[#252840]">Mes sessions</h1>
          <button
            onClick={() => navigate('/sessions/new')}
            className="inline-flex items-center gap-2 rounded-full bg-[#C8864B] px-5 py-2.5 text-sm font-bold text-white border-none cursor-pointer hover:bg-[#B07030] transition-colors w-fit"
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M7 1v12M1 7h12"/>
            </svg>
            Nouvelle session
          </button>
        </div>

        {/* Tabs */}
        <div className="inline-flex rounded-full border border-[#E8DDC7] bg-[#F8F4EA] p-1 mb-8">
          {[['teach', "J'enseigne"], ['learn', 'Je reçois']].map(([v, l]) => (
            <button
              key={v}
              onClick={() => setTab(v)}
              className={`rounded-full px-5 py-2 text-sm font-semibold border-none cursor-pointer transition-colors ${
                tab === v ? 'bg-[#252840] text-[#F8F4EA]' : 'bg-transparent text-[#756B5B] hover:text-[#252840]'
              }`}
            >
              {l}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[rgba(37,40,64,0.2)] border-t-[#252840] rounded-full animate-spin" />
          </div>
        )}

        {!loading && list.length === 0 && (
          <div className="rounded-3xl border border-dashed border-[#E8DDC7] bg-white p-12 text-center">
            <p className="text-lg font-semibold text-[#252840] mb-2">
              {tab === 'teach' ? 'Aucune session à donner' : 'Aucune session à recevoir'}
            </p>
            <p className="text-sm text-[#756B5B] mb-6">
              {tab === 'teach' ? 'Créez une session avec l\'un de vos pairs connectés.' : 'Demandez à un pair de planifier une session avec vous.'}
            </p>
            <button
              onClick={() => navigate('/sessions/new')}
              className="px-6 py-3 rounded-full bg-[#252840] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors"
            >
              + Nouvelle session
            </button>
          </div>
        )}

        <div className="space-y-4">
          {list.map(s => {
            const partner     = tab === 'teach' ? s.learner : s.teacher
            const partnerName = `${partner?.firstName ?? ''} ${partner?.lastName ?? ''}`.trim()
            const st          = STATUS_STYLE[s.status] ?? STATUS_STYLE.SCHEDULED
            const isLive      = s.status === 'ACTIVE'
            const isCancelled = s.status === 'CANCELLED'
            const isCreator   = s.teacher?.id === user?.id
            const canCancel   = isCreator && (s.status === 'SCHEDULED' || s.status === 'ACTIVE')

            return (
              <div
                key={s.id}
                className={`flex flex-col gap-4 rounded-3xl border bg-white p-5 shadow-card sm:flex-row sm:items-center sm:justify-between transition-all ${
                  isCancelled ? 'opacity-50 border-[#E8DDC7]' : isLive ? 'border-[#3D5C28] cursor-pointer hover:-translate-y-0.5' : 'border-[#E8DDC7] cursor-pointer hover:-translate-y-0.5 hover:shadow-soft'
                }`}
                onClick={() => !isCancelled && navigate(`/sessions/${s.id}`)}
              >
                <div className="flex items-center gap-4">
                  <AvatarInitials name={partnerName} color={isLive ? '#3D5C28' : '#252840'} />
                  <div>
                    <p className="text-lg font-bold text-[#252840]">{s.title || 'Session'}</p>
                    <p className="text-sm text-[#756B5B]">{partnerName}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-[#756B5B]">
                      <span className="inline-flex items-center gap-1">
                        <CalIcon /> {formatDate(s.startsAt)}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-[#C8864B]">
                        <CreditIcon size="sm" /> {s.creditsReserved} cr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3" onClick={e => e.stopPropagation()}>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${st.bg} ${st.text}`}>
                    {st.label}
                  </span>
                  {isLive && (
                    <button
                      onClick={() => navigate(`/sessions/${s.id}`)}
                      className="inline-flex items-center gap-2 rounded-full bg-[#C8864B] px-4 py-2 text-sm font-bold text-white border-none cursor-pointer hover:bg-[#B07030] transition-colors"
                    >
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <rect x="1" y="3" width="9" height="9" rx="2"/><path d="M10 5l4-2v8l-4-2"/>
                      </svg>
                      Rejoindre
                    </button>
                  )}
                  {s.status === 'SCHEDULED' && (
                    <button
                      onClick={() => navigate(`/sessions/${s.id}`)}
                      className="rounded-full border-2 border-[#252840] px-4 py-2 text-sm font-bold text-[#252840] bg-transparent cursor-pointer hover:bg-[#F8F4EA] transition-colors"
                    >
                      Ouvrir
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => setConfirmId(s.id)}
                      className="rounded-full border border-red-200 px-3 py-1 text-xs font-semibold text-red-500 bg-transparent cursor-pointer hover:bg-red-50 transition-colors"
                    >
                      Annuler
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}
