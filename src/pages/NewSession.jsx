// src/pages/NewSession.jsx
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import api from '../services/api'
import useAuthStore from '../store/authStore'

const CATEGORIES = ['Mathematics','Languages','Music','Programming','Design','Cooking','Science','Art','Sport','Other']

export default function NewSession() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const { user } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [connections, setConnections] = useState([])
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'Mathematics',
    date: '',
    time: '',
    duration: 60,
    creditsPerMin: 1,
    studentId: params.get('with') || '',
    studentName: params.get('name') || '',
    isOpen: false,
    maxParticipants: 3,
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  // Load accepted connections to use as student picker
  useEffect(() => {
    if (!user) return
    api.get('/matches/mine')
      .then(res => {
        const matches = res.data.matches || []
        const accepted = matches
          .filter(m => m.status === 'ACCEPTED')
          .map(m => {
            const other = m.requesterId === user.id ? m.receiver : m.requester
            return { id: other.id, name: `${other.firstName} ${other.lastName}` }
          })
        setConnections(accepted)
      })
      .catch(() => {})
  }, [user])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.studentId) { setError('Please select a student'); return }
    setError('')
    setLoading(true)
    try {
      const scheduledAt = new Date(`${form.date}T${form.time}:00`).toISOString()
      await api.post('/sessions', {
        learnerId:         form.studentId,
        title:             form.title,
        estimatedDuration: form.duration,
        scheduledAt,
      })
      navigate('/sessions')
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create session')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-white text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
  const labelClass = "text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1"

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F8F8]">
      <div className="max-w-[600px] mx-auto px-6 py-10">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-[#7A6E5C] font-medium bg-transparent border-none cursor-pointer hover:text-[#1A1410] transition-all mb-6">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M9 2L4 7l5 5"/></svg>
          Back
        </button>

        <h1 className="text-[28px] font-black tracking-tight text-[#1A1410] mb-2">New Session</h1>
        <p className="text-[14px] text-[#7A6E5C] mb-8">Schedule a teaching or learning session</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-black/[0.09] p-8 flex flex-col gap-5">
          {error && <p className="text-red-500 text-[13px] bg-red-50 px-4 py-3 rounded-xl">{error}</p>}

          <div>
            <label className={labelClass}>Session title</label>
            <input className={inputClass} placeholder="e.g. Maths — Derivatives & Integrals"
              value={form.title} onChange={e => set('title', e.target.value)} required />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea className={`${inputClass} resize-none h-24`} placeholder="What will you cover in this session?"
              value={form.description} onChange={e => set('description', e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Category</label>
              <select className={inputClass} value={form.category} onChange={e => set('category', e.target.value)}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Receveur (vos pairs connectés)</label>
              {connections.length === 0 ? (
                <div className={`${inputClass} text-[#B0A898]`}>
                  No accepted connections yet
                </div>
              ) : (
                <select
                  className={inputClass}
                  value={form.studentId}
                  onChange={e => {
                    const selected = connections.find(c => c.id === e.target.value)
                    set('studentId', e.target.value)
                    set('studentName', selected?.name || '')
                  }}
                  required>
                  <option value="">Select a student…</option>
                  {connections.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date</label>
              <input type="date" className={inputClass} value={form.date} onChange={e => set('date', e.target.value)} required />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input type="time" className={inputClass} value={form.time} onChange={e => set('time', e.target.value)} required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Duration (minutes)</label>
              <select className={inputClass} value={form.duration} onChange={e => set('duration', Number(e.target.value))}>
                {[30,45,60,90,120].map(d => <option key={d} value={d}>{d} min</option>)}
              </select>
            </div>
            <div>
              <label className={labelClass}>Credits per minute</label>
              <select className={inputClass} value={form.creditsPerMin} onChange={e => set('creditsPerMin', Number(e.target.value))}>
                {[1,2,3].map(n => <option key={n} value={n}>{n} credit/min</option>)}
              </select>
            </div>
          </div>

          {/* Group session toggle */}
          <div className="flex items-start gap-4 bg-[#F8F8F8] rounded-xl px-5 py-4 border border-black/[0.07]">
            <input
              type="checkbox"
              id="isOpen"
              checked={form.isOpen}
              onChange={e => set('isOpen', e.target.checked)}
              className="mt-[2px] w-4 h-4 accent-[#252840] cursor-pointer"
            />
            <div className="flex-1">
              <label htmlFor="isOpen" className="text-[13px] font-bold text-[#1A1410] cursor-pointer">
                Session ouverte à plusieurs receveurs
              </label>
              <p className="text-[12px] text-[#7A6E5C] mt-[2px]">
                Les crédits sont divisés entre les participants.
              </p>
              {form.isOpen && (
                <div className="mt-3">
                  <label className={labelClass}>Nombre max de participants</label>
                  <select
                    className={`${inputClass} w-[160px]`}
                    value={form.maxParticipants}
                    onChange={e => set('maxParticipants', Number(e.target.value))}
                  >
                    {[2,3,4,5,6,8,10].map(n => <option key={n} value={n}>{n} participants</option>)}
                  </select>
                </div>
              )}
            </div>
          </div>

          <div className="bg-[#ECEEF8] rounded-xl px-5 py-4">
            <p className="text-[13px] font-bold text-[#252840] mb-1">Estimation du coût</p>
            <p className="text-[12px] text-[#7A6E5C]">
              Total: <strong className="text-[#252840]">{form.duration * form.creditsPerMin} crédits</strong>
              &nbsp;({form.duration} min × {form.creditsPerMin} crédit/min)
              {form.isOpen && (
                <span className="ml-2 text-[#C8864B]">
                  · {Math.ceil((form.duration * form.creditsPerMin) / form.maxParticipants)} cr/participant
                </span>
              )}
            </p>
          </div>

          <button type="submit" disabled={loading || !form.studentId}
            className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50 mt-2">
            {loading ? 'Creating…' : 'Create session'}
          </button>
        </form>
      </div>
    </main>
  )
}
