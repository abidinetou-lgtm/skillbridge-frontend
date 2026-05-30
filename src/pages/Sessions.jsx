// src/pages/Sessions.jsx
import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const STATUS = {
  SCHEDULED: { bg: 'bg-[#ECEEF8]', text: 'text-[#252840]', label: 'Upcoming' },
  ACTIVE:    { bg: 'bg-[#E4EED8]', text: 'text-[#3D5C28]', label: 'Live now'  },
  COMPLETED: { bg: 'bg-[#F5F5F5]', text: 'text-[#7A6E5C]', label: 'Completed' },
  CANCELLED: { bg: 'bg-red-50',    text: 'text-red-500',    label: 'Cancelled' },
}

export default function Sessions() {
  const navigate  = useNavigate()
  const { user }  = useAuthStore()
  const [sessions, setSessions] = useState([])
  const [loading,  setLoading]  = useState(true)
  const [error,    setError]    = useState('')
  const [tab,      setTab]      = useState('teach')

  const loadSessions = useCallback(async () => {
    if (!user) return
    try {
      const res      = await api.get('/sessions/mine')
      const all      = res.data.sessions ?? []
      setSessions(all)
      setError('')
    } catch (e) {
      // Silencieux si déjà des sessions affichées
      if (sessions.length === 0) setError(e.response?.data?.message || 'Failed to load sessions')
    } finally {
      setLoading(false)
    }
  }, [user])

  // Polling toutes les 3 secondes — indispensable pour la démo en temps réel
  useEffect(() => {
    loadSessions()
    const interval = setInterval(loadSessions, 3000)
    return () => clearInterval(interval)
  }, [loadSessions])

  const teaching = sessions.filter(s => s.teacher?.id === user?.id)
  const learning = sessions.filter(s => s.learner?.id  === user?.id)
  const list     = tab === 'teach' ? teaching : learning

  const parseMeta = (notes) => {
    try { return JSON.parse(notes ?? '{}') } catch { return {} }
  }

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleString('fr', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <main className="pt-[62px] min-h-screen bg-white">

      {/* Header */}
      <div className="bg-white border-b border-black/[0.09] px-20 py-10">
        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">My Sessions</p>
            <h1 className="text-[34px] font-black tracking-[-1.2px] text-[#1A1410]">Sessions & Courses</h1>
            <p className="text-[13px] text-[#7A6E5C] mt-1">
              {teaching.filter(s => s.status === 'SCHEDULED').length} cours à donner ·{' '}
              {learning.filter(s => s.status === 'SCHEDULED').length} cours à suivre
            </p>
          </div>
          <button
            onClick={() => navigate('/sessions/new')}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M7 1v12M1 7h12"/>
            </svg>
            New session
          </button>
        </div>
      </div>

      <div className="max-w-[860px] mx-auto px-6 py-8">

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-black/[0.09] rounded-xl p-1 w-fit">
          {[
            { key: 'teach', label: `Séances à donner`, count: teaching.length },
            { key: 'learn', label: `Séances à recevoir`, count: learning.length },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-all flex items-center gap-2
                ${tab === t.key ? 'bg-[#252840] text-white' : 'bg-transparent text-[#7A6E5C] hover:text-[#1A1410]'}`}>
              {t.label}
              <span className={`text-[11px] font-bold px-2 py-[1px] rounded-full
                ${tab === t.key ? 'bg-white/20 text-white' : 'bg-black/[0.06] text-[#7A6E5C]'}`}>
                {t.count}
              </span>
            </button>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        {loading && sessions.length === 0 && (
          <div className="text-center py-16">
            <div className="w-8 h-8 border-2 border-[#252840]/20 border-t-[#252840] rounded-full animate-spin mx-auto mb-3" />
            <p className="text-[13px] text-[#7A6E5C]">Loading sessions…</p>
          </div>
        )}

        {!loading && list.length === 0 && (
          <div className="bg-white border border-black/[0.09] rounded-2xl p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-[#ECEEF8] flex items-center justify-center mx-auto mb-4">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#252840" strokeWidth="1.8" strokeLinecap="round">
                <rect x="3" y="4" width="18" height="18" rx="3"/>
                <path d="M3 9h18M9 3v3M15 3v3"/>
              </svg>
            </div>
            <p className="text-[16px] font-semibold text-[#1A1410] mb-2">
              {tab === 'teach' ? 'Aucune séance à donner' : 'Aucune séance à recevoir'}
            </p>
            <p className="text-[13px] text-[#7A6E5C] mb-6">
              {tab === 'teach'
                ? 'Créez une séance avec l\'un de vos pairs connectés.'
                : 'Demandez à un pair de planifier une séance avec vous.'}
            </p>
            <button
              onClick={() => navigate('/sessions/new')}
              className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
              + New session
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {list.map(s => {
            const meta    = parseMeta(s.notes)
            const partner = tab === 'teach' ? s.learner : s.teacher
            const st      = STATUS[s.status] ?? STATUS.SCHEDULED
            const isLive  = s.status === 'ACTIVE'

            return (
              <div
                key={s.id}
                onClick={() => navigate(`/sessions/${s.id}`)}
                className={`bg-white border rounded-2xl p-5 flex items-center gap-5 cursor-pointer transition-all hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(26,20,16,0.08)]
                  ${isLive ? 'border-[#3D5C28] shadow-[0_0_0_3px_rgba(61,92,40,0.12)]' : 'border-black/[0.09]'}`}>

                {/* Avatar */}
                <div className="w-14 h-14 rounded-full bg-[#252840] text-white flex items-center justify-center font-black text-[18px] flex-shrink-0">
                  {partner?.firstName?.[0] ?? '?'}{partner?.lastName?.[0] ?? ''}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[16px] font-bold text-[#1A1410]">
                      {meta.title || s.title || 'Session'}
                    </span>
                    <span className={`px-3 py-[3px] rounded-full text-[11px] font-bold ${st.bg} ${st.text} ${isLive ? 'animate-pulse' : ''}`}>
                      {st.label}
                    </span>
                  </div>

                  <p className="text-[13px] text-[#7A6E5C] mb-1">
                    {tab === 'teach' ? 'Receveur' : 'Donneur'} :{' '}
                    <span className="font-semibold text-[#1A1410]">
                      {partner?.firstName} {partner?.lastName}
                    </span>
                    {' · '}{formatDate(s.startsAt)}
                  </p>

                  {(meta.durationMinutes || s.creditsReserved) && (
                    <p className="text-[12px] text-[#7A6E5C]">
                      {meta.durationMinutes ?? s.creditsReserved} min ·{' '}
                      <span className="font-semibold text-[#252840]">
                        {s.creditsReserved} credits reserved
                      </span>
                    </p>
                  )}
                </div>

                {/* CTA */}
                <div className="flex flex-col items-end gap-2 flex-shrink-0">
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/sessions/${s.id}`) }}
                    className={`px-5 py-[9px] rounded-xl text-[13px] font-bold border-none cursor-pointer transition-all
                      ${isLive
                        ? 'bg-[#3D5C28] text-white hover:bg-[#4E6035] animate-pulse'
                        : s.status === 'SCHEDULED'
                        ? 'bg-[#252840] text-white hover:bg-[#363B6B]'
                        : 'bg-[#F5F5F5] text-[#7A6E5C] cursor-default'}`}
                    disabled={s.status === 'COMPLETED' || s.status === 'CANCELLED'}>
                    {isLive           ? 'Join now'
                      : s.status === 'SCHEDULED' ? 'Join session'
                      : s.status === 'COMPLETED' ? 'Completed'
                      : 'Cancelled'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </main>
  )
}