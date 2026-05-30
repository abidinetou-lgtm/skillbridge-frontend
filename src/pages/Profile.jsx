import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const CLOUD_NAME    = 'derho2rib'
const UPLOAD_PRESET = 'skillbridge_avatars'

const TAG = {
  sand:  'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  sage:  'bg-[#E4EED8] text-[#3D5C28]',
}

const DAYS  = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const SLOTS = ['Matin', 'Midi', 'Soir']
const SLOT_HINTS = { Matin: '8h–12h', Midi: '12h–14h', Soir: '18h–22h' }

const AVAIL_KEY  = 'sb_availability'
const AVATAR_KEY = 'sb_avatar'

function loadAvailability() {
  try { return JSON.parse(localStorage.getItem(AVAIL_KEY) || '{}') } catch { return {} }
}

export default function Profile() {
  const { user, logout, setUser } = useAuthStore()
  const navigate = useNavigate()
  const fileRef  = useRef()

  const [tab,        setTab]        = useState('skills')
  const [profile,    setProfile]    = useState(null)
  const [sessions,   setSessions]   = useState([])
  const [loading,    setLoading]    = useState(true)
  const [avail,      setAvail]      = useState(loadAvailability)
  const [availSaved, setAvailSaved] = useState(false)

  const [editing,    setEditing]    = useState(false)
  const [editFirst,  setEditFirst]  = useState('')
  const [editLast,   setEditLast]   = useState('')
  const [editBio,    setEditBio]    = useState('')
  const [editSaving, setEditSaving] = useState(false)
  const [editError,  setEditError]  = useState('')

  const [avatar,    setAvatar]    = useState(() => localStorage.getItem(AVATAR_KEY) || '')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (!user) return
    Promise.all([api.get('/users/me'), api.get('/sessions/mine')])
      .then(([profRes, sessRes]) => {
        setProfile(profRes.data.user)
        setSessions(sessRes.data.sessions ?? [])
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user])

  if (loading) {
    return (
      <main className="pt-[62px] min-h-screen bg-white flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#252840]/20 border-t-[#252840] rounded-full animate-spin" />
      </main>
    )
  }

  const displayName = `${profile?.firstName ?? user?.firstName ?? ''} ${profile?.lastName ?? user?.lastName ?? ''}`.trim()
  const initials    = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const credits     = profile?.credits ?? user?.credits ?? 0
  const teaches     = profile?.teachingSkills ?? []
  const wants       = profile?.learningGoals  ?? []

  const sessionsAsTeacher = sessions.filter(s => s.teacher?.id === user?.id)
  const sessionsAsLearner = sessions.filter(s => s.learner?.id  === user?.id)
  const totalEarned = sessionsAsTeacher.filter(s => s.status === 'COMPLETED').reduce((a, s) => a + (s.creditsConsumed ?? 0), 0)
  const totalSpent  = sessionsAsLearner.filter(s => s.status === 'COMPLETED').reduce((a, s) => a + (s.creditsConsumed ?? 0), 0)

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('fr', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const startEdit = () => {
    setEditFirst(profile?.firstName ?? user?.firstName ?? '')
    setEditLast(profile?.lastName   ?? user?.lastName  ?? '')
    setEditBio(profile?.bio ?? '')
    setEditError('')
    setEditing(true)
  }

  const saveEdit = async () => {
    if (!editFirst.trim() || !editLast.trim()) { setEditError('Prénom et nom requis.'); return }
    setEditSaving(true); setEditError('')
    try {
      const res = await api.put('/users/me', {
        firstName: editFirst.trim(),
        lastName:  editLast.trim(),
        bio:       editBio.trim() || null,
      })
      setProfile(res.data.user)
      if (setUser) setUser({ ...user, firstName: res.data.user.firstName, lastName: res.data.user.lastName })
      setEditing(false)
    } catch (e) {
      setEditError(e.response?.data?.message || 'Erreur.')
    } finally { setEditSaving(false) }
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const form = new FormData()
      form.append('file', file)
      form.append('upload_preset', UPLOAD_PRESET)
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: form })
      const data = await res.json()
      if (data.secure_url) { localStorage.setItem(AVATAR_KEY, data.secure_url); setAvatar(data.secure_url) }
    } catch (e) { console.error('Upload failed', e) }
    finally { setUploading(false) }
  }

  const toggleSlot = (day, slot) => {
    setAvail(prev => ({ ...prev, [`${day}_${slot}`]: !prev[`${day}_${slot}`] }))
    setAvailSaved(false)
  }

  const handleSaveAvail = () => {
    localStorage.setItem(AVAIL_KEY, JSON.stringify(avail))
    setAvailSaved(true)
    setTimeout(() => setAvailSaved(false), 2000)
  }

  const countSelected = Object.values(avail).filter(Boolean).length

  return (
    <main className="pt-[62px] min-h-screen bg-white">
      <div className="h-[180px] bg-gradient-to-br from-[#252840] via-[#363B6B] to-[#C8864B]" />

      <div className="px-8 md:px-16 max-w-[960px] mx-auto">

        {/* Avatar + boutons */}
        <div className="flex items-end justify-between -mt-[52px] mb-5">
          <div className="relative group">
            <div className="w-[104px] h-[104px] rounded-full border-4 border-white bg-[#252840] flex items-center justify-center font-black text-[32px] text-white overflow-hidden">
              {avatar ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" /> : initials}
            </div>
            <button onClick={() => fileRef.current?.click()} disabled={uploading}
              className="absolute inset-0 rounded-full bg-black/40 text-white text-[11px] font-bold opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center cursor-pointer border-none">
              {uploading ? '…' : '📷'}
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex gap-2 mb-1 flex-wrap justify-end">
            <button onClick={startEdit}
              className="px-4 py-2 rounded-xl border-[1.5px] border-black/[0.09] text-[#1A1410] text-[12px] font-semibold bg-transparent cursor-pointer hover:border-[#252840] transition-all">
              ✏️ Modifier
            </button>
            <button onClick={() => navigate('/sessions/new')}
              className="px-4 py-2 rounded-xl bg-[#252840] text-white text-[12px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
              + Séance
            </button>
            <button onClick={() => { logout(); navigate('/') }}
              className="px-4 py-2 rounded-xl border-[1.5px] border-black/[0.09] text-[#7A6E5C] text-[12px] font-semibold bg-transparent cursor-pointer hover:border-red-300 hover:text-red-500 transition-all">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Modal édition */}
        {editing && (
          <div className="fixed inset-0 z-[500] bg-black/50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-[440px] max-w-full shadow-2xl">
              <h2 className="text-[20px] font-black text-[#1A1410] mb-5">Modifier le profil</h2>
              {editError && <p className="text-red-500 text-[13px] mb-3">{editError}</p>}
              <div className="flex gap-3 mb-3">
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[11px] font-bold text-[#3D3020] uppercase tracking-wide">Prénom</label>
                  <input value={editFirst} onChange={e => setEditFirst(e.target.value)}
                    className="px-3 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-[14px] bg-[#F8F4EA] outline-none focus:border-[#252840] transition-all" />
                </div>
                <div className="flex flex-col gap-1 flex-1">
                  <label className="text-[11px] font-bold text-[#3D3020] uppercase tracking-wide">Nom</label>
                  <input value={editLast} onChange={e => setEditLast(e.target.value)}
                    className="px-3 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-[14px] bg-[#F8F4EA] outline-none focus:border-[#252840] transition-all" />
                </div>
              </div>
              <div className="flex flex-col gap-1 mb-5">
                <label className="text-[11px] font-bold text-[#3D3020] uppercase tracking-wide">Bio</label>
                <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                  placeholder="Parlez de vous, de vos compétences…"
                  className="px-3 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-[14px] bg-[#F8F4EA] outline-none focus:border-[#252840] transition-all resize-none" />
              </div>
              <div className="flex gap-2">
                <button onClick={saveEdit} disabled={editSaving}
                  className="flex-1 py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50">
                  {editSaving ? 'Enregistrement…' : 'Enregistrer'}
                </button>
                <button onClick={() => setEditing(false)}
                  className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[#7A6E5C] text-[14px] font-semibold bg-transparent cursor-pointer hover:border-[#252840] transition-all">
                  Annuler
                </button>
              </div>
            </div>
          </div>
        )}

        <h1 className="text-[26px] font-black tracking-tight text-[#1A1410]">{displayName}</h1>
        <p className="text-[13px] text-[#7A6E5C] mt-[2px]">{user?.email}</p>
        {profile?.bio && <p className="text-[14px] text-[#3D3020] leading-[1.7] mt-3 max-w-[560px]">{profile.bio}</p>}

        {/* Stats */}
        <div className="flex gap-4 mt-5 flex-wrap">
          {[
            { value: credits,           label: 'crédits disponibles', color: '#252840', bg: '#ECEEF8' },
            { value: `+${totalEarned}`, label: 'crédits gagnés',      color: '#3D5C28', bg: '#E4EED8' },
            { value: totalSpent,        label: 'crédits dépensés',    color: '#C8864B', bg: '#FAF5E8' },
          ].map(stat => (
            <div key={stat.label} className="bg-white rounded-xl border border-black/[0.09] px-5 py-3 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex-shrink-0" style={{ background: stat.bg }} />
              <div>
                <p className="text-[20px] font-black leading-none" style={{ color: stat.color }}>{stat.value}</p>
                <p className="text-[11px] text-[#7A6E5C] mt-[1px]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-7 border-b border-black/[0.09]">
          {[
            { key: 'skills',       label: 'Compétences' },
            { key: 'availability', label: `Disponibilités${countSelected > 0 ? ` (${countSelected})` : ''}` },
            { key: 'sessions',     label: `Séances (${sessions.length})` },
            { key: 'transactions', label: 'Historique' },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-4 py-3 text-[13px] font-semibold border-none bg-transparent cursor-pointer transition-all border-b-2 -mb-px whitespace-nowrap
                ${tab === t.key ? 'text-[#252840] border-[#252840]' : 'text-[#7A6E5C] border-transparent hover:text-[#1A1410]'}`}>
              {t.label}
            </button>
          ))}
        </div>

        {/* Compétences */}
        {tab === 'skills' && (
          <div className="py-7 flex flex-col gap-8 pb-16">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#C8864B] mb-3">Ce que je partage</p>
              {teaches.length === 0 ? <p className="text-[13px] text-[#7A6E5C] italic">Aucune compétence ajoutée.</p>
                : <div className="flex flex-wrap gap-2">{teaches.map(ts => <span key={ts.id} className={`px-3 py-[6px] rounded-full text-[12px] font-semibold ${TAG.sand}`}>{ts.skill?.name ?? ts}</span>)}</div>}
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#3D5C28] mb-3">Ce que j'apprends</p>
              {wants.length === 0 ? <p className="text-[13px] text-[#7A6E5C] italic">Aucun objectif ajouté.</p>
                : <div className="flex flex-wrap gap-2">{wants.map(lg => <span key={lg.id} className={`px-3 py-[6px] rounded-full text-[12px] font-semibold ${TAG.sage}`}>{lg.skill?.name ?? lg}</span>)}</div>}
            </div>
          </div>
        )}

        {/* Disponibilités */}
        {tab === 'availability' && (
          <div className="py-7 pb-16">
            <h2 className="text-[18px] font-black text-[#1A1410] mb-1">Mes créneaux disponibles</h2>
            <p className="text-[13px] text-[#7A6E5C] mb-5">L'heure exacte se convient dans le chat.</p>
            <div className="bg-white border border-black/[0.09] rounded-2xl overflow-hidden">
              <div className="grid border-b border-black/[0.09]" style={{ gridTemplateColumns: '100px repeat(5, 1fr)' }}>
                <div className="p-3" />
                {DAYS.map(day => <div key={day} className="p-3 text-center text-[12px] font-bold text-[#252840] border-l border-black/[0.06]">{day}</div>)}
              </div>
              {SLOTS.map((slot, si) => (
                <div key={slot} className={`grid ${si < SLOTS.length - 1 ? 'border-b border-black/[0.09]' : ''}`} style={{ gridTemplateColumns: '100px repeat(5, 1fr)' }}>
                  <div className="p-3 flex flex-col justify-center">
                    <p className="text-[12px] font-bold text-[#1A1410]">{slot}</p>
                    <p className="text-[10px] text-[#7A6E5C]">{SLOT_HINTS[slot]}</p>
                  </div>
                  {DAYS.map(day => {
                    const active = !!avail[`${day}_${slot}`]
                    return (
                      <button key={day} onClick={() => toggleSlot(day, slot)}
                        className={`border-l border-black/[0.06] p-3 flex items-center justify-center cursor-pointer transition-all ${active ? 'bg-[#252840] hover:bg-[#363B6B]' : 'bg-white hover:bg-[#F5F5F5]'}`}>
                        {active
                          ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 4"/></svg>
                          : <div className="w-4 h-4 rounded border-[1.5px] border-black/[0.15]" />}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4">
              <button onClick={handleSaveAvail} className="px-6 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                Enregistrer
              </button>
              {availSaved && <span className="text-[13px] text-[#3D5C28] font-semibold">✓ Enregistré</span>}
            </div>
          </div>
        )}

        {/* Séances */}
        {tab === 'sessions' && (
          <div className="py-7 pb-16">
            {sessions.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.09]">
                <p className="text-[16px] font-semibold text-[#1A1410] mb-4">Aucune séance pour l'instant</p>
                <button onClick={() => navigate('/sessions/new')} className="px-5 py-3 rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">Créer une séance</button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sessions.map(s => {
                  const isTeacher = s.teacher?.id === user?.id
                  const partner   = isTeacher ? s.learner : s.teacher
                  const st = { SCHEDULED: { label: 'Planifiée', cls: 'bg-[#ECEEF8] text-[#252840]' }, ACTIVE: { label: 'En cours', cls: 'bg-[#E4EED8] text-[#3D5C28]' }, COMPLETED: { label: 'Terminée', cls: 'bg-[#F5F5F5] text-[#7A6E5C]' }, CANCELLED: { label: 'Annulée', cls: 'bg-red-50 text-red-500' } }[s.status] ?? { label: s.status, cls: 'bg-[#ECEEF8] text-[#252840]' }
                  return (
                    <div key={s.id} onClick={() => navigate(`/sessions/${s.id}`)} className="bg-white border border-black/[0.09] rounded-2xl p-5 flex items-center gap-4 cursor-pointer hover:shadow-md transition-all">
                      <div className="w-12 h-12 rounded-full bg-[#252840] text-white flex items-center justify-center font-bold text-[16px] flex-shrink-0">{partner?.firstName?.[0]}{partner?.lastName?.[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[15px] font-bold text-[#1A1410] truncate">{s.title}</span>
                          <span className={`px-2 py-[2px] rounded-full text-[11px] font-bold flex-shrink-0 ${st.cls}`}>{st.label}</span>
                        </div>
                        <p className="text-[12px] text-[#7A6E5C]">{isTeacher ? 'Receveur' : 'Donneur'} : {partner?.firstName} {partner?.lastName} · {formatDate(s.startsAt)}</p>
                      </div>
                      <p className={`text-[14px] font-bold flex-shrink-0 ${isTeacher ? 'text-[#3D5C28]' : 'text-[#C8864B]'}`}>{isTeacher ? '+' : '-'}{s.creditsReserved} cr</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* Historique */}
        {tab === 'transactions' && (
          <div className="py-7 pb-16">
            {sessions.filter(s => s.status === 'COMPLETED').length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.09]">
                <p className="text-[16px] font-semibold text-[#1A1410] mb-2">Aucune transaction</p>
                <p className="text-[13px] text-[#7A6E5C]">Les crédits apparaissent ici après vos séances.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sessions.filter(s => s.status === 'COMPLETED').map(s => {
                  const isTeacher = s.teacher?.id === user?.id
                  const partner   = isTeacher ? s.learner : s.teacher
                  const delta     = isTeacher ? s.creditsConsumed : -(s.creditsConsumed)
                  return (
                    <div key={s.id} className="bg-white border border-black/[0.09] rounded-xl px-5 py-4 flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${isTeacher ? 'bg-[#E4EED8]' : 'bg-[#FAF5E8]'}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={isTeacher ? '#3D5C28' : '#C8864B'} strokeWidth="1.6" strokeLinecap="round">
                          {isTeacher ? <path d="M8 14V2M3 7l5-5 5 5"/> : <path d="M8 2v12M3 9l5 5 5-5"/>}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#1A1410] truncate">{s.title}</p>
                        <p className="text-[11px] text-[#7A6E5C]">{isTeacher ? 'Donnée à' : 'Reçue de'} {partner?.firstName} {partner?.lastName} · {formatDate(s.actualEndedAt)}</p>
                      </div>
                      <p className={`text-[16px] font-black flex-shrink-0 ${isTeacher ? 'text-[#3D5C28]' : 'text-[#C8864B]'}`}>{delta > 0 ? '+' : ''}{delta} cr</p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  )
}