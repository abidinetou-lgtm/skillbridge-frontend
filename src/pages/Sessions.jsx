// src/pages/Sessions.jsx
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { sessionApi, getApiError } from '../services/api'

export default function Sessions() {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [tab, setTab]           = useState('teach') // 'teach' | 'learn'

  useEffect(() => {
    sessionApi.list()
      .then(data => setSessions(data.sessions ?? data))
      .catch(err => setError(getApiError(err)))
      .finally(() => setLoading(false))
  }, [])

  const teaching = sessions.filter(s => s.teacher?.id === user?.id)
  const learning = sessions.filter(s => s.learner?.id === user?.id)
  const list = tab === 'teach' ? teaching : learning

  const statusColor = {
    SCHEDULED: 'bg-[#ECEEF8] text-[#252840]',
    COMPLETED:  'bg-[#E4EED8] text-[#3D5C28]',
    CANCELLED:  'bg-red-50 text-red-500',
  }

  const parseMeta = (notes) => {
    try { return JSON.parse(notes ?? '{}') } catch { return {} }
  }

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F8F8]">
      <div className="max-w-[860px] mx-auto px-6 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-1">My sessions</p>
            <h1 className="text-[32px] font-black tracking-tight text-[#1A1410]">Sessions</h1>
          </div>
          <button
            onClick={() => navigate('/sessions/new')}
            className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all"
          >
            + New session
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 bg-white border border-black/[0.09] rounded-xl p-1 w-fit">
          {[
            { key: 'teach', label: `Cours à donner (${teaching.length})` },
            { key: 'learn', label: `Cours à suivre (${learning.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2 rounded-lg text-[13px] font-semibold border-none cursor-pointer transition-all
                ${tab === t.key ? 'bg-[#252840] text-white' : 'bg-transparent text-[#7A6E5C] hover:text-[#1A1410]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {error && <p className="text-red-500 text-[13px] mb-4">{error}</p>}
        {loading && <p className="text-[#7A6E5C] text-[14px]">Loading sessions…</p>}

        {!loading && list.length === 0 && (
          <div className="bg-white border border-black/[0.09] rounded-2xl p-12 text-center">
            <p className="text-[16px] font-semibold text-[#1A1410] mb-2">
              {tab === 'teach' ? 'No sessions to teach yet' : 'No sessions to attend yet'}
            </p>
            <p className="text-[13px] text-[#7A6E5C] mb-6">
              {tab === 'teach' ? 'Create a session with one of your connections.' : 'Ask a connection to schedule a session with you.'}
            </p>
            <button onClick={() => navigate('/sessions/new')}
              className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
              + New session
            </button>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {list.map(s => {
            const meta    = parseMeta(s.notes)
            const partner = tab === 'teach' ? s.learner : s.teacher
            const when    = s.startsAt ? new Date(s.startsAt).toLocaleString('fr') : '—'
            return (
              <div key={s.id}
                onClick={() => navigate(`/sessions/${s.id}`)}
                className="bg-white border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(26,20,16,0.08)] transition-all">

                {/* Avatar partner */}
                <div className="w-14 h-14 rounded-full bg-[#252840] text-white flex items-center justify-center font-black text-[18px] flex-shrink-0">
                  {partner?.firstName?.[0]}{partner?.lastName?.[0]}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-[16px] font-bold text-[#1A1410] mb-1">
                    {meta.title || 'Session'}
                  </div>
                  <div className="text-[13px] text-[#7A6E5C]">
                    Avec {partner?.firstName} {partner?.lastName} · {when}
                  </div>
                  {meta.durationMinutes && (
                    <div className="text-[12px] text-[#7A6E5C] mt-1">
                      {meta.durationMinutes} min · {meta.creditsPerMin ?? 1} crédit/min · ~{(meta.durationMinutes * (meta.creditsPerMin ?? 1))} crédits
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${statusColor[s.status] ?? 'bg-gray-100 text-gray-500'}`}>
                    {s.status}
                  </span>
                  <button
                    onClick={e => { e.stopPropagation(); navigate(`/sessions/${s.id}`) }}
                    className="px-4 py-2 rounded-xl bg-[#252840] text-white text-[12px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                    {s.status === 'SCHEDULED' ? 'Rejoindre' : 'Voir'}
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