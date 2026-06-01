import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const STATUS = {
  SCHEDULED: { bg: 'bg-[#ECEEF8]', text: 'text-[#252840]', label: 'Planifiée' },
  ACTIVE:    { bg: 'bg-[#E4EED8]', text: 'text-[#3D5C28]', label: 'En cours'  },
  COMPLETED: { bg: 'bg-[#F5F5F5]', text: 'text-[#7A6E5C]', label: 'Terminée' },
  CANCELLED: { bg: 'bg-red-50',    text: 'text-red-500',    label: 'Annulée'  },
}

export default function Sessions() {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()
  const [sessions,    setSessions]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState('')
  const [tab,         setTab]         = useState('teach')
  const [cancelling,  setCancelling]  = useState(null)
  const [confirmId,   setConfirmId]   = useState(null)

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
    const interval = setInterval(loadSessions, 3000)
    return () => clearInterval(interval)
  }, [loadSessions])

  const handleCancel = async (sessionId) => {
    setCancelling(sessionId)
    try {
      await api.post(`/sessions/${sessionId}/end`, { durationSeconds: 0 })
      setConfirmId(null)
      loadSessions()
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de l\'annulation')
    } finally {
      setCancelling(null)
    }
  }

  const teaching = sessions.filter(s => s.teacher?.id === user?.id)
  const learning = sessions.filter(s => s.learner?.id  === user?.id)
  const list     = (tab === 'teach' ? teaching : learning)
    .filter(s => s.status !== 'CANCELLED') // masquer les annulées par défaut
    .concat((tab === 'teach' ? teaching : learning).filter(s => s.status === 'CANCELLED'))
    // en fait : montrer toutes mais annulées en dernier

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('fr', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <main className="pt-[62px] min-h-screen bg-white">

      {/* Confirm annulation modal */}
      {confirmId && (
        <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 w-[400px] max-w-full shadow-2xl">
            <h2 className="text-[18px] font-black text-[#1A1410] mb-2">Annuler cette séance ?</h2>
            <p className="text-[13px] text-[#7A6E5C] mb-6">
              La séance sera marquée comme annulée. Les crédits réservés seront remboursés.
            </p>
            <div className="flex gap-3">
              <button onClick={() => handleCancel(confirmId)}
                disabled={!!cancelling}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white text-[14px] font-bold border-none cursor-pointer hover:bg-red-600 transition-all disabled:opacity-50">
                {cancelling ? 'Annulation…' : 'Confirmer l\'annulation'}
              </button>
              <button onClick={() => setConfirmId(null)}
                className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[#7A6E5C] text-[14px] font-semibold bg-transparent cursor-pointer hover:border-[#252840] transition-all">
                Retour
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-[860px] mx-auto px-6 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-1">Mes séances</p>
            <h1 className="text-[28px] font-black tracking-[-1px] text-[#1A1410]">Sessions</h1>
          </div>
          <button onClick={() => navigate('/sessions/new')}
            className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all flex items-center gap-2">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M6 1v10M1 6h10"/>
            </svg>
            Nouvelle séance
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-black/[0.09] mb-6">
          {[
            { key: 'teach', label: `Je donne (${teaching.length})` },
            { key: 'learn', label: `Je reçois (${learning.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-[13px] font-semibold border-none bg-transparent cursor-pointer border-b-2 -mb-px transition-all
                ${tab === t.key ? 'text-[#252840] border-[#252840]' : 'text-[#7A6E5C] border-transparent hover:text-[#1A1410]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-[13px] mb-4">{error}</p>}

        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-2 border-[#252840]/20 border-t-[#252840] rounded-full animate-spin" />
          </div>
        )}

        {!loading && list.length === 0 && (
          <div className="bg-white border border-black/[0.09] rounded-2xl p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ECEEF8] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#252840" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/><path d="M3 9h18M9 3v3M15 3v3"/>
              </svg>
            </div>
            <p className="text-[16px] font-semibold text-[#1A1410] mb-2">
              {tab === 'teach' ? 'Aucune séance à donner' : 'Aucune séance à recevoir'}
            </p>
            <p className="text-[13px] text-[#7A6E5C] mb-6">
              {tab === 'teach' ? 'Créez une séance avec l\'un de vos pairs connectés.' : 'Demandez à un pair de planifier une séance avec vous.'}
            </p>
            <button onClick={() => navigate('/sessions/new')}
              className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
              + Nouvelle séance
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {list.map(s => {
            const partner   = tab === 'teach' ? s.learner : s.teacher
            const st        = STATUS[s.status] ?? STATUS.SCHEDULED
            const isLive    = s.status === 'ACTIVE'
            const isCreator = s.teacher?.id === user?.id
            const canCancel = isCreator && (s.status === 'SCHEDULED' || s.status === 'ACTIVE')
            const isCancelled = s.status === 'CANCELLED'

            return (
              <div key={s.id}
                className={`bg-white border rounded-2xl p-5 flex items-center gap-5 transition-all
                  ${isCancelled ? 'opacity-50 border-black/[0.06]' : isLive ? 'border-[#3D5C28] shadow-[0_0_0_3px_rgba(61,92,40,0.12)] cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(26,20,16,0.08)]' : 'border-black/[0.09] cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(26,20,16,0.08)]'}`}
                onClick={() => !isCancelled && navigate(`/sessions/${s.id}`)}>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#252840] text-white flex items-center justify-center font-black text-[18px] flex-shrink-0">
                  {partner?.firstName?.[0] ?? '?'}{partner?.lastName?.[0] ?? ''}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[16px] font-bold text-[#1A1410]">{s.title || 'Session'}</span>
                    <span className={`px-3 py-[3px] rounded-full text-[11px] font-bold ${st.bg} ${st.text} ${isLive ? 'animate-pulse' : ''}`}>
                      {st.label}
                    </span>
                  </div>
                  <p className="text-[13px] text-[#7A6E5C] mb-1">
                    {tab === 'teach' ? 'Receveur' : 'Donneur'} :{' '}
                    <span className="font-semibold text-[#1A1410]">{partner?.firstName} {partner?.lastName}</span>
                    {' · '}{formatDate(s.startsAt)}
                  </p>
                  <p className="text-[12px] text-[#7A6E5C]">
                    {s.creditsReserved} crédits réservés
                  </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0" onClick={e => e.stopPropagation()}>
                  {!isCancelled && (
                    <button
                      onClick={() => navigate(`/sessions/${s.id}`)}
                      className={`px-5 py-[9px] rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all
                        ${isLive ? 'bg-[#3D5C28] text-white hover:bg-[#4E6035]'
                          : s.status === 'SCHEDULED' ? 'bg-[#252840] text-white hover:bg-[#363B6B]'
                          : 'bg-[#F5F5F5] text-[#7A6E5C]'}`}
                      disabled={s.status === 'COMPLETED'}>
                      {isLive ? 'Rejoindre' : s.status === 'SCHEDULED' ? 'Ouvrir' : 'Voir'}
                    </button>
                  )}
                  {canCancel && (
                    <button
                      onClick={() => setConfirmId(s.id)}
                      className="px-4 py-[7px] rounded-xl border-[1.5px] border-red-200 text-red-500 text-[12px] font-semibold bg-transparent cursor-pointer hover:bg-red-50 transition-all">
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