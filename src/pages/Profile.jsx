import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import CreditIcon from '../components/CreditIcon'

const CLOUD_NAME    = 'derho2rib'
const UPLOAD_PRESET = 'skillbridge_avatars'
const AVAIL_KEY     = 'sb_availability'
const AVATAR_KEY    = 'sb_avatar'

const ALL_SKILLS = [
  'Mathematics','English','French','Spanish','Japanese','Chinese','Arabic','Portuguese',
  'Guitar','Piano','Drums','Singing','Drawing','Painting','Photography','Illustration',
  'Python','JavaScript','TypeScript','React','Node.js','Design','Figma','Video editing',
  'Cooking','Yoga','Chess','Writing','Philosophy','Physics','Chemistry','Biology',
  'Music Theory','Violin','Business','Marketing','Finance','Statistics','Data Analysis',
]

const DAYS  = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const SLOTS = ['Matin', 'Midi', 'Soir']
const SLOT_HINTS = { Matin: '8h–12h', Midi: '12h–14h', Soir: '18h–22h' }

function loadAvailability() {
  try { return JSON.parse(localStorage.getItem(AVAIL_KEY) || '{}') } catch { return {} }
}

const TABS = [
  { key: 'skills',       label: 'Compétences' },
  { key: 'card',         label: 'Ma carte' },
  { key: 'availability', label: 'Disponibilités' },
  { key: 'sessions',     label: 'Sessions' },
  { key: 'transactions', label: 'Historique' },
]

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

  const [addingSkill, setAddingSkill] = useState(false)
  const [skillSearch, setSkillSearch] = useState('')
  const [skillSaving, setSkillSaving] = useState(false)

  const loadProfile = async () => {
    if (!user) return
    try {
      const [profRes, sessRes] = await Promise.all([
        api.get('/users/me'),
        api.get('/sessions/mine'),
      ])
      const p = profRes.data.user
      setProfile(p)
      setSessions(sessRes.data.sessions ?? [])
      if (p.avatarUrl) setAvatar(p.avatarUrl)
      if (p.availability) { try { setAvail(JSON.parse(p.availability)) } catch {} }
    } catch (e) { console.error(e) }
    finally { setLoading(false) }
  }

  useEffect(() => { loadProfile() }, [user])

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FDFAF4] flex items-center justify-center">
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
  const countSelected = Object.values(avail).filter(Boolean).length

  const formatDate = (iso) => {
    if (!iso) return '—'
    return new Date(iso).toLocaleDateString('fr', { day: '2-digit', month: 'short', year: 'numeric' })
  }

  const startEdit = () => {
    setEditFirst(profile?.firstName ?? user?.firstName ?? '')
    setEditLast(profile?.lastName   ?? user?.lastName  ?? '')
    setEditBio(profile?.bio ?? '')
    setEditError(''); setEditing(true)
  }

  const saveEdit = async () => {
    if (!editFirst.trim() || !editLast.trim()) { setEditError('Prénom et nom requis.'); return }
    setEditSaving(true); setEditError('')
    try {
      const res = await api.put('/users/me', { firstName: editFirst.trim(), lastName: editLast.trim(), bio: editBio.trim() || null })
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
      if (data.secure_url) {
        localStorage.setItem(AVATAR_KEY, data.secure_url)
        setAvatar(data.secure_url)
        await api.put('/users/me', { avatarUrl: data.secure_url }).catch(() => {})
      }
    } catch (e) { console.error('Upload failed', e) }
    finally { setUploading(false) }
  }

  const toggleSlot = (day, slot) => { setAvail(prev => ({ ...prev, [`${day}_${slot}`]: !prev[`${day}_${slot}`] })); setAvailSaved(false) }

  const handleSaveAvail = async () => {
    const json = JSON.stringify(avail)
    localStorage.setItem(AVAIL_KEY, json)
    await api.put('/users/me', { availability: json }).catch(() => {})
    setAvailSaved(true)
    setTimeout(() => setAvailSaved(false), 2000)
  }

  const handleAddSkill = async (skillName, type) => {
    if (!skillName.trim()) return
    setSkillSaving(true)
    try {
      if (type === 'teach') await api.post('/users/skills', { name: skillName, category: 'General' })
      else                  await api.post('/users/learning-goals', { name: skillName, category: 'General' })
      await loadProfile()
      setSkillSearch(''); setAddingSkill(false)
    } catch (e) { alert(e.response?.data?.message || 'Erreur') }
    finally { setSkillSaving(false) }
  }

  const handleRemoveSkill = async (id, type) => {
    try {
      if (type === 'teach') await api.delete(`/users/skills/${id}`)
      else                  await api.delete(`/users/learning-goals/${id}`)
      await loadProfile()
    } catch (e) { alert(e.response?.data?.message || 'Erreur') }
  }

  const filteredSkills = ALL_SKILLS.filter(s =>
    s.toLowerCase().includes(skillSearch.toLowerCase()) &&
    (addingSkill === 'teach'
      ? !teaches.some(t => (t.skill?.name ?? t) === s)
      : !wants.some(w   => (w.skill?.name ?? w) === s))
  )

  return (
    <main className="min-h-screen bg-[#FDFAF4]">
      {/* Edit Modal */}
      {editing && (
        <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-8 w-[440px] max-w-full max-h-[90vh] overflow-y-auto shadow-soft border border-[#E8DDC7]">
            <h2 className="text-xl font-black text-[#252840] mb-5">Modifier le profil</h2>
            {editError && <p className="text-red-500 text-sm mb-3 bg-red-50 px-3 py-2 rounded-lg">{editError}</p>}
            <div className="flex gap-3 mb-3">
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#252840] uppercase tracking-wide mb-1">Prénom</label>
                <input value={editFirst} onChange={e => setEditFirst(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#E8DDC7] bg-[#FDFAF4] text-sm outline-none focus:border-[#C8864B] transition-colors" />
              </div>
              <div className="flex-1">
                <label className="block text-xs font-bold text-[#252840] uppercase tracking-wide mb-1">Nom</label>
                <input value={editLast} onChange={e => setEditLast(e.target.value)}
                  className="w-full h-11 px-3 rounded-xl border border-[#E8DDC7] bg-[#FDFAF4] text-sm outline-none focus:border-[#C8864B] transition-colors" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-bold text-[#252840] uppercase tracking-wide mb-1">Bio</label>
              <textarea value={editBio} onChange={e => setEditBio(e.target.value)} rows={3}
                placeholder="Parlez de vous…"
                className="w-full px-3 py-2 rounded-xl border border-[#E8DDC7] bg-[#FDFAF4] text-sm outline-none focus:border-[#C8864B] transition-colors resize-none" />
            </div>
            <div className="flex items-center gap-3 mb-5 p-4 bg-[#F8F4EA] rounded-2xl">
              <div className="h-12 w-12 rounded-full bg-[#252840] flex items-center justify-center overflow-hidden flex-shrink-0">
                {avatar ? <img src={avatar} alt="" className="w-full h-full object-cover" /> : <span className="text-white font-black text-base">{initials}</span>}
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-[#252840]">Photo de profil</p>
                <p className="text-xs text-[#756B5B]">JPG, PNG · max 5 MB</p>
              </div>
              <button onClick={() => fileRef.current?.click()} disabled={uploading}
                className="px-3 py-2 rounded-xl border border-[#E8DDC7] text-sm font-semibold text-[#252840] bg-white cursor-pointer hover:border-[#C8864B] transition-colors flex-shrink-0">
                {uploading ? 'Upload…' : 'Changer'}
              </button>
            </div>
            <div className="flex gap-2">
              <button onClick={saveEdit} disabled={editSaving}
                className="flex-1 py-3 rounded-full bg-[#252840] text-white font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors disabled:opacity-50">
                {editSaving ? 'Enregistrement…' : 'Enregistrer'}
              </button>
              <button onClick={() => setEditing(false)}
                className="px-5 py-3 rounded-full border border-[#E8DDC7] text-[#756B5B] font-semibold bg-transparent cursor-pointer hover:border-[#252840] transition-colors">
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Skill add modal */}
      {addingSkill && (
        <div className="fixed inset-0 z-[500] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 w-[440px] max-w-full shadow-soft border border-[#E8DDC7]">
            <h2 className="text-lg font-black text-[#252840] mb-1">
              {addingSkill === 'teach' ? 'Compétence à enseigner' : 'Objectif d\'apprentissage'}
            </h2>
            <p className="text-xs text-[#756B5B] mb-4">Recherchez ou sélectionnez dans la liste</p>
            <input value={skillSearch} onChange={e => setSkillSearch(e.target.value)}
              placeholder="Rechercher une compétence…"
              className="w-full h-11 px-4 rounded-full border border-[#E8DDC7] bg-[#FDFAF4] text-sm outline-none focus:border-[#C8864B] transition-colors mb-3" />
            {skillSearch.trim() && !ALL_SKILLS.some(s => s.toLowerCase() === skillSearch.toLowerCase()) && (
              <button onClick={() => handleAddSkill(skillSearch.trim(), addingSkill)} disabled={skillSaving}
                className="w-full py-2 mb-2 rounded-full bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors disabled:opacity-50">
                + Ajouter "{skillSearch.trim()}" (personnalisé)
              </button>
            )}
            <div className="flex flex-wrap gap-2 max-h-52 overflow-y-auto">
              {filteredSkills.map(skill => (
                <button key={skill} onClick={() => handleAddSkill(skill, addingSkill)} disabled={skillSaving}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold border cursor-pointer transition-all ${
                    addingSkill === 'teach'
                      ? 'border-[#252840]/20 text-[#252840] hover:bg-[#252840] hover:text-white hover:border-[#252840]'
                      : 'border-[#3D5C28]/20 text-[#3D5C28] hover:bg-[#3D5C28] hover:text-white hover:border-[#3D5C28]'
                  }`}>
                  {skill}
                </button>
              ))}
            </div>
            <button onClick={() => { setAddingSkill(false); setSkillSearch('') }}
              className="w-full mt-4 py-2.5 rounded-full border border-[#E8DDC7] text-[#756B5B] text-sm font-semibold bg-transparent cursor-pointer hover:border-[#252840] transition-colors">
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* Banner */}
      <div className="h-44 bg-gradient-to-br from-[#252840] via-[#363B6B] to-[#C8864B]" />

      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {/* Avatar + actions */}
        <div className="flex items-end justify-between -mt-14 mb-4">
          <div className="relative inline-block">
            <div className="w-32 h-32 rounded-full border-4 border-[#F8F4EA] overflow-hidden cursor-pointer"
              onClick={() => fileRef.current?.click()}>
              {avatar
                ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                : <div className="w-full h-full bg-[#252840] flex items-center justify-center text-white font-black text-3xl">{initials}</div>
              }
            </div>
            <button
              onClick={() => fileRef.current?.click()}
              className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-[#C8864B] flex items-center justify-center shadow-md hover:bg-[#B07030] transition-all cursor-pointer border-2 border-[#F8F4EA]">
              <svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="white" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15.5 13a1.5 1.5 0 01-1.5 1.5H3A1.5 1.5 0 011.5 13V6A1.5 1.5 0 013 4.5h1.5l1.2-2h3.6l1.2 2H14A1.5 1.5 0 0115.5 6v7z"/>
                <circle cx="8.5" cy="9" r="2.2"/>
              </svg>
            </button>
            {uploading && (
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              </div>
            )}
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>

          <div className="flex flex-wrap gap-2 mb-1">
            <button onClick={startEdit}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#E8DDC7] text-[#252840] text-sm font-semibold bg-white cursor-pointer hover:border-[#252840] transition-colors">
              <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M9.5 1.5l2 2L4 11H2v-2L9.5 1.5z"/></svg>
              Modifier
            </button>
            <button onClick={() => navigate('/sessions/new')}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#252840] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M6 1v10M1 6h10"/></svg>
              Séance
            </button>
            <button onClick={() => { logout(); navigate('/') }}
              className="px-4 py-2 rounded-full border border-[#E8DDC7] text-[#756B5B] text-sm font-semibold bg-transparent cursor-pointer hover:border-red-300 hover:text-red-500 transition-colors">
              Déconnexion
            </button>
          </div>
        </div>

        {/* Name + bio */}
        <h1 className="text-2xl font-black tracking-tight text-[#252840]">{displayName}</h1>
        <p className="text-sm text-[#756B5B]">{user?.email}</p>
        {profile?.bio && <p className="text-sm text-[#756B5B] leading-relaxed mt-2 max-w-lg">{profile.bio}</p>}

        {/* Stats */}
        <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {[
            { value: credits,           label: 'Crédits disponibles', icon: <CreditIcon size="sm" />, bg: 'bg-[rgba(37,40,64,0.08)]',   text: 'text-[#252840]' },
            { value: `+${totalEarned}`, label: 'Crédits gagnés',   icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 13V3M4 7l4-4 4 4"/></svg>, bg: 'bg-[rgba(61,92,40,0.12)]',   text: 'text-[#3D5C28]' },
            { value: totalSpent,        label: 'Crédits dépensés', icon: <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M8 3v10M4 9l4 4 4-4"/></svg>, bg: 'bg-[rgba(200,134,75,0.12)]', text: 'text-[#C8864B]' },
          ].map(stat => (
            <div key={stat.label} className="flex items-center gap-4 rounded-2xl border border-[#E8DDC7] bg-white px-5 py-4 shadow-card">
              <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-lg font-bold flex-shrink-0 ${stat.bg} ${stat.text}`}>
                {stat.icon}
              </div>
              <div>
                <p className={`text-2xl font-black leading-none ${stat.text}`}>{stat.value}</p>
                <p className="text-xs text-[#756B5B] mt-0.5">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mt-7 flex gap-1 bg-[#F8F4EA] rounded-full p-1 overflow-x-auto">
          {TABS.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold whitespace-nowrap border-none cursor-pointer transition-colors ${
                tab === t.key ? 'bg-[#252840] text-[#F8F4EA]' : 'bg-transparent text-[#756B5B] hover:text-[#252840]'
              }`}>
              {t.label}{t.key === 'availability' && countSelected > 0 ? ` (${countSelected})` : ''}
              {t.key === 'sessions' && sessions.length > 0 ? ` (${sessions.length})` : ''}
            </button>
          ))}
        </div>

        {/* ── Tab: Compétences ── */}
        {tab === 'skills' && (
          <div className="py-7 pb-16 flex flex-col gap-6">
            <div className="rounded-3xl border border-[#E8DDC7] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold uppercase tracking-wide text-[#C8864B]">J'enseigne ({teaches.length})</p>
                <button onClick={() => setAddingSkill('teach')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#252840] text-white text-xs font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 1v8M1 5h8"/></svg>
                  Ajouter
                </button>
              </div>
              {teaches.length === 0
                ? <p className="text-sm text-[#756B5B] italic">Aucune compétence ajoutée.</p>
                : <div className="flex flex-wrap gap-2">
                    {teaches.map(ts => (
                      <span key={ts.id} className="inline-flex items-center gap-1.5 rounded-full bg-[#252840] px-3 py-1.5 text-xs font-semibold text-[#F8F4EA]">
                        {ts.skill?.name ?? ts}
                        <button onClick={() => handleRemoveSkill(ts.id, 'teach')}
                          className="h-4 w-4 rounded-full bg-white/20 flex items-center justify-center cursor-pointer border-none hover:bg-red-400 transition-colors">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
              }
            </div>
            <div className="rounded-3xl border border-[#E8DDC7] bg-white p-6 shadow-card">
              <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-bold uppercase tracking-wide text-[#3D5C28]">Je veux apprendre ({wants.length})</p>
                <button onClick={() => setAddingSkill('learn')}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-[#3D5C28] text-white text-xs font-bold border-none cursor-pointer hover:bg-[#4E6035] transition-colors">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 1v8M1 5h8"/></svg>
                  Ajouter
                </button>
              </div>
              {wants.length === 0
                ? <p className="text-sm text-[#756B5B] italic">Aucun objectif ajouté.</p>
                : <div className="flex flex-wrap gap-2">
                    {wants.map(lg => (
                      <span key={lg.id} className="inline-flex items-center gap-1.5 rounded-full bg-[rgba(61,92,40,0.15)] border border-[rgba(61,92,40,0.25)] px-3 py-1.5 text-xs font-semibold text-[#3D5C28]">
                        {lg.skill?.name ?? lg}
                        <button onClick={() => handleRemoveSkill(lg.id, 'learn')}
                          className="h-4 w-4 rounded-full bg-[#3D5C28]/20 flex items-center justify-center cursor-pointer border-none hover:bg-red-400 hover:text-white transition-colors">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7"/></svg>
                        </button>
                      </span>
                    ))}
                  </div>
              }
            </div>
          </div>
        )}

        {/* ── Tab: Ma carte ── */}
        {tab === 'card' && (
          <div className="py-7 pb-16">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">

              {/* Aperçu carte */}
              <div className="bg-white rounded-3xl border border-black/[0.09] p-6 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A6E5C] mb-4">Aperçu Connexions</p>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-[#252840] flex items-center justify-center text-white font-bold text-sm flex-shrink-0 overflow-hidden">
                    {avatar
                      ? <img src={avatar} alt="" className="w-full h-full object-cover" />
                      : initials
                    }
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-bold text-[#252840]">{displayName}</p>
                      {profile?.averageRating && (
                        <span className="flex items-center gap-1 text-sm font-semibold text-[#C8864B]">
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="#C8864B">
                            <path d="M6 1l1.5 3 3.5.5-2.5 2.5.5 3.5L6 9l-3 1.5.5-3.5L1 4.5 4.5 4z"/>
                          </svg>
                          {profile.averageRating}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-[#7A6E5C]">{profile?.bio?.slice(0, 50)}{profile?.bio?.length > 50 ? '…' : ''}</p>
                  </div>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#7A6E5C] mb-2">Enseigne</p>
                <div className="flex flex-wrap gap-1">
                  {teaches.slice(0, 4).map(ts => (
                    <span key={ts.id} className="px-2.5 py-1 rounded-lg bg-[#252840] text-white text-xs font-semibold">
                      {ts.skill?.name ?? ts}
                    </span>
                  ))}
                </div>
              </div>

              {/* Actions rapides */}
              <div className="flex flex-col gap-3">
                {[
                  { label: 'Modifier nom/bio',           tab: 'edit'         },
                  { label: 'Changer photo',               tab: 'photo'        },
                  { label: 'Gérer compétences',           tab: 'skills'       },
                  { label: 'Configurer disponibilités',   tab: 'availability' },
                ].map(action => (
                  <button key={action.label}
                    onClick={() => {
                      if (action.tab === 'skills')       setTab('skills')
                      if (action.tab === 'availability') setTab('availability')
                      if (action.tab === 'edit')         startEdit()
                      if (action.tab === 'photo')        fileRef.current?.click()
                    }}
                    className="flex items-center justify-between w-full px-5 py-4 rounded-2xl bg-white border border-black/[0.09] hover:border-[#252840] hover:shadow-sm transition-all text-left cursor-pointer">
                    <span className="font-semibold text-[#252840] text-sm">{action.label}</span>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#7A6E5C" strokeWidth="2" strokeLinecap="round">
                      <path d="M6 3l5 5-5 5"/>
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── Tab: Disponibilités ── */}
        {tab === 'availability' && (
          <div className="py-7 pb-16">
            <h2 className="text-xl font-black text-[#252840] mb-1">Mes créneaux disponibles</h2>
            <p className="text-sm text-[#756B5B] mb-5">L'heure exacte se convient dans le chat avec votre pair.</p>
            <div className="overflow-hidden rounded-3xl border border-[#E8DDC7] bg-white shadow-card">
              <div className="grid bg-[#F8F4EA]" style={{ gridTemplateColumns: '100px repeat(5, 1fr)' }}>
                <div className="p-3" />
                {DAYS.map(day => (
                  <div key={day} className="p-3 text-center text-xs font-bold text-[#252840] border-l border-[#E8DDC7]">{day}</div>
                ))}
              </div>
              {SLOTS.map((slot, si) => (
                <div key={slot} className={`grid ${si < SLOTS.length - 1 ? 'border-t border-[#E8DDC7]' : ''}`} style={{ gridTemplateColumns: '100px repeat(5, 1fr)' }}>
                  <div className="p-3 flex flex-col justify-center">
                    <p className="text-xs font-bold text-[#252840]">{slot}</p>
                    <p className="text-[10px] text-[#756B5B]">{SLOT_HINTS[slot]}</p>
                  </div>
                  {DAYS.map(day => {
                    const active = !!avail[`${day}_${slot}`]
                    return (
                      <button key={day} onClick={() => toggleSlot(day, slot)}
                        className={`border-l border-[#E8DDC7] p-3 flex items-center justify-center cursor-pointer transition-all ${active ? 'bg-[#3D5C28] hover:bg-[#4E6035]' : 'bg-white hover:bg-[#F8F4EA]'}`}>
                        {active
                          ? <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M3 8l3.5 3.5L13 4"/></svg>
                          : <div className="w-4 h-4 rounded border-[1.5px] border-[#D0C8B8]" />}
                      </button>
                    )
                  })}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-3">
              <button onClick={handleSaveAvail}
                className="px-6 py-3 rounded-full bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors">
                Enregistrer
              </button>
              {availSaved && (
                <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#3D5C28]">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 7l4 4 6-6"/></svg>
                  Enregistré
                </span>
              )}
            </div>
          </div>
        )}

        {/* ── Tab: Sessions ── */}
        {tab === 'sessions' && (
          <div className="py-7 pb-16">
            {sessions.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E8DDC7] bg-white p-12 text-center shadow-card">
                <p className="text-lg font-semibold text-[#252840] mb-4">Aucune séance pour l'instant</p>
                <button onClick={() => navigate('/sessions/new')}
                  className="px-6 py-3 rounded-full bg-[#252840] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors">
                  Créer une séance
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {sessions.map(s => {
                  const isTeacher = s.teacher?.id === user?.id
                  const partner   = isTeacher ? s.learner : s.teacher
                  const statusMap = {
                    SCHEDULED: { label: 'À venir',   cls: 'bg-[rgba(61,92,40,0.12)] text-[#3D5C28]' },
                    ACTIVE:    { label: 'En direct',  cls: 'bg-[rgba(200,134,75,0.15)] text-[#C8864B]' },
                    COMPLETED: { label: 'Terminée',   cls: 'bg-[rgba(37,40,64,0.1)] text-[#252840]' },
                    CANCELLED: { label: 'Annulée',    cls: 'bg-red-50 text-red-500' },
                  }
                  const st = statusMap[s.status] ?? statusMap.SCHEDULED
                  return (
                    <div key={s.id} onClick={() => navigate(`/sessions/${s.id}`)}
                      className="rounded-3xl border border-[#E8DDC7] bg-white p-5 flex items-center gap-4 cursor-pointer hover:shadow-soft transition-all shadow-card">
                      <div className="h-12 w-12 rounded-full bg-[#252840] text-white flex items-center justify-center font-bold text-base flex-shrink-0">
                        {partner?.firstName?.[0]}{partner?.lastName?.[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="font-bold text-[#252840] truncate">{s.title}</span>
                          <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold flex-shrink-0 ${st.cls}`}>{st.label}</span>
                        </div>
                        <p className="text-xs text-[#756B5B]">{isTeacher ? 'Receveur' : 'Donneur'} : {partner?.firstName} {partner?.lastName} · {formatDate(s.startsAt)}</p>
                      </div>
                      <p className={`text-sm font-black flex-shrink-0 ${isTeacher ? 'text-[#3D5C28]' : 'text-[#C8864B]'}`}>
                        {isTeacher ? '+' : '-'}{s.creditsReserved} cr
                      </p>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}

        {/* ── Tab: Historique ── */}
        {tab === 'transactions' && (
          <div className="py-7 pb-16">
            {sessions.filter(s => s.status === 'COMPLETED').length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E8DDC7] bg-white p-12 text-center shadow-card">
                <p className="text-lg font-semibold text-[#252840] mb-1">Aucune transaction</p>
                <p className="text-sm text-[#756B5B]">Les crédits apparaissent ici après vos séances.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                {sessions.filter(s => s.status === 'COMPLETED').map(s => {
                  const isTeacher = s.teacher?.id === user?.id
                  const partner   = isTeacher ? s.learner : s.teacher
                  const delta     = isTeacher ? s.creditsConsumed : -(s.creditsConsumed)
                  return (
                    <div key={s.id} className="rounded-2xl border border-[#E8DDC7] bg-white px-5 py-4 flex items-center gap-4 shadow-card">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isTeacher ? 'bg-[rgba(61,92,40,0.12)]' : 'bg-[rgba(200,134,75,0.12)]'}`}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={isTeacher ? '#3D5C28' : '#C8864B'} strokeWidth="1.6" strokeLinecap="round">
                          {isTeacher ? <path d="M8 14V2M3 7l5-5 5 5"/> : <path d="M8 2v12M3 9l5 5 5-5"/>}
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#252840] truncate">{s.title}</p>
                        <p className="text-xs text-[#756B5B]">{isTeacher ? 'Donnée à' : 'Reçue de'} {partner?.firstName} {partner?.lastName} · {formatDate(s.actualEndedAt)}</p>
                      </div>
                      <p className={`text-base font-black flex-shrink-0 ${isTeacher ? 'text-[#3D5C28]' : 'text-[#C8864B]'}`}>
                        {delta > 0 ? '+' : ''}{delta} cr
                      </p>
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
