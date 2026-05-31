import { useState, useEffect, useCallback } from 'react'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { CATEGORIES, SKILL_TO_CATEGORY } from '../data/categories'

const COLORS   = ['#252840', '#C8864B', '#3D5C28', '#363B6B']
const DAYS     = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const SLOTS    = ['Matin', 'Midi', 'Soir']
const SLOT_HINTS = { Matin: '8h–12h', Midi: '12h–14h', Soir: '18h–22h' }
const AVAIL_KEY  = 'sb_availability_'
const AVATAR_KEY = 'sb_avatar_'

function colorFor(id) {
  if (!id) return COLORS[0]
  return COLORS[Math.abs(id.charCodeAt(0) % COLORS.length)]
}

// Récupère l'avatar stocké localement pour un userId donné
// (chaque utilisateur stocke son propre avatar sous sb_avatar_<userId>)
// Pour l'instant on stocke sous sb_avatar (sans id) mais on lit les deux
function getAvatarFor(u) {
  return (u && u.avatarUrl) ? u.avatarUrl : ''
}

// Récupère les disponibilités stockées localement pour un userId
function getAvailFor(u) {
  if (u && u.availability) {
    try { return JSON.parse(u.availability) } catch {}
  }
  return {}
}

function matchScore(member, myGoals, mySkills) {
  let score = 0
  myGoals.forEach(goal => {
    if (member.teaches.some(s => s.toLowerCase().includes(goal.toLowerCase()) || goal.toLowerCase().includes(s.toLowerCase()))) score += 10
  })
  mySkills.forEach(skill => {
    if (member.wants.some(s => s.toLowerCase().includes(skill.toLowerCase()) || skill.toLowerCase().includes(s.toLowerCase()))) score += 5
  })
  return score
}

function Avatar({ user: u, firstName, lastName, color, size = 'md' }) {
  const avatar = getAvatarFor(u)
  const initials = `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase()
  const sz = size === 'lg' ? 'w-16 h-16 text-xl' : size === 'sm' ? 'w-8 h-8 text-xs' : 'w-10 h-10 text-sm'
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-black text-white flex-shrink-0 overflow-hidden`} style={{ background: color }}>
      {avatar
        ? <img src={avatar} alt={firstName} className="w-full h-full object-cover" />
        : initials
      }
    </div>
  )
}

export default function Connection() {
  const { user, openModal } = useAuthStore()

  const [tab,            setTab]       = useState('discover')
  const [category,       setCategory]  = useState('all')
  const [search,         setSearch]    = useState('')
  const [selectedMember, setSelected]  = useState(null)

  const [incoming,  setIncoming]  = useState([])
  const [requested, setRequested] = useState(new Set())
  const [allUsers,  setAllUsers]  = useState([])
  const [myProfile, setMyProfile] = useState(null)

  // Sauvegarde l'avatar de l'utilisateur connecté sous la clé avec son id
  useEffect(() => {
    if (!user?.id) return
    const global = localStorage.getItem('sb_avatar')
    if (global) {
      localStorage.setItem(`${AVATAR_KEY}${user.id}`, global)
    }
  }, [user])

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      const [sugRes, matchRes, profRes] = await Promise.all([
        api.get('/matches/suggestions'),
        api.get('/matches/mine'),
        api.get('/users/me'),
      ])
      setAllUsers(sugRes.data.suggestions || [])
      setMyProfile(profRes.data.user)
      const matches = matchRes.data.matches || []
      setIncoming(matches.filter(m => m.receiverId === user.id && m.status === 'PENDING'))
      setRequested(new Set(matches.filter(m => m.requesterId === user.id).map(m => m.receiverId)))
    } catch (e) { console.error(e) }
  }, [user])

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 5000)
    return () => clearInterval(id)
  }, [loadData])

  const myGoals  = (myProfile?.learningGoals  || []).map(g => g.skill?.name ?? g)
  const mySkills = (myProfile?.teachingSkills  || []).map(s => s.skill?.name ?? s)

  const members = allUsers.map(u => ({
    id:           u.id,
    firstName:    u.firstName,
    lastName:     u.lastName,
    bio:          u.bio || '',
    credits:      u.credits,
    avatarUrl:    u.avatarUrl || '',
    availability: u.availability || null,
    teaches:   (u.teachingSkills || []).map(s => s.skill?.name ?? s),
    wants:     (u.learningGoals  || []).map(s => s.skill?.name ?? s),
    color:     colorFor(u.id),
    score:     matchScore(
      { teaches: (u.teachingSkills || []).map(s => s.skill?.name ?? s), wants: (u.learningGoals || []).map(s => s.skill?.name ?? s) },
      myGoals, mySkills
    ),
  }))

  const filtered = members
    .filter(m => {
      if (category !== 'all') {
        const cat = CATEGORIES.find(c => c.key === category)
        if (cat && !m.teaches.some(s => cat.skills.includes(s))) return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        return `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.teaches.some(s => s.toLowerCase().includes(q)) ||
          m.wants.some(s => s.toLowerCase().includes(q))
      }
      return true
    })
    .sort((a, b) => b.score - a.score || a.firstName.localeCompare(b.firstName))

  const handleConnect = async (memberId) => {
    if (!user) { openModal('login'); return }
    try {
      await api.post('/matches/request', { receiverId: memberId })
      setRequested(prev => new Set([...prev, memberId]))
      setSelected(null)
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la demande')
    }
  }

  const handleAccept = async (matchId, requesterId) => {
    try {
      await api.patch(`/matches/${matchId}`, { status: 'ACCEPTED' })
      setIncoming(prev => prev.filter(m => m.id !== matchId))
      setRequested(prev => new Set([...prev, requesterId]))
    } catch (e) { alert(e.response?.data?.message || 'Erreur') }
  }

  const handleDecline = async (matchId) => {
    try {
      await api.patch(`/matches/${matchId}`, { status: 'REJECTED' })
      setIncoming(prev => prev.filter(m => m.id !== matchId))
    } catch (e) { alert(e.response?.data?.message || 'Erreur') }
  }

  // Disponibilités du membre sélectionné
  const memberAvail = selectedMember ? getAvailFor(selectedMember) : {}
  const hasAvail    = Object.values(memberAvail).some(Boolean)

  return (
    <main className="pt-[62px] min-h-screen bg-white">

      {/* Fiche profil complète */}
      {selectedMember && (
        <div className="fixed inset-0 z-[400] bg-black/50 flex items-center justify-center p-4"
          onClick={() => setSelected(null)}>
          <div className="bg-white rounded-2xl w-[500px] max-w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={e => e.stopPropagation()}>

            {/* Header */}
            <div className="relative p-6 pb-4 border-b border-black/[0.06]">
              <button onClick={() => setSelected(null)}
                className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/5 flex items-center justify-center text-[#7A6E5C] hover:bg-black/10 transition-all bg-transparent border-none cursor-pointer text-lg leading-none">
                ✕
              </button>
              <div className="flex items-center gap-4">
                <Avatar user={selectedMember} firstName={selectedMember.firstName} lastName={selectedMember.lastName} color={selectedMember.color} size="lg" />
                <div>
                  <h2 className="text-[20px] font-black text-[#1A1410]">{selectedMember.firstName} {selectedMember.lastName}</h2>
                  {selectedMember.bio && <p className="text-[13px] text-[#7A6E5C] mt-1">{selectedMember.bio}</p>}
                  {selectedMember.score > 0 && (
                    <span className="inline-flex items-center gap-1 mt-1 px-2 py-[2px] rounded-full bg-[#E4EED8] text-[#3D5C28] text-[11px] font-bold">
                      <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 5l2 2 4-4"/></svg>
                      Correspond à vos objectifs
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Compétences */}
            <div className="px-6 py-4 border-b border-black/[0.06]">
              {selectedMember.teaches.length > 0 && (
                <div className="mb-3">
                  <p className="text-[10px] font-bold text-[#C8864B] uppercase tracking-wide mb-2">Peut enseigner</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMember.teaches.map(s => (
                      <span key={s} className="px-3 py-1 rounded-full bg-[#252840] text-white text-[11px] font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
              {selectedMember.wants.length > 0 && (
                <div>
                  <p className="text-[10px] font-bold text-[#3D5C28] uppercase tracking-wide mb-2">Veut apprendre</p>
                  <div className="flex flex-wrap gap-1">
                    {selectedMember.wants.map(s => (
                      <span key={s} className="px-3 py-1 rounded-full border border-[#3D5C28] text-[#3D5C28] text-[11px] font-semibold">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Disponibilités */}
            <div className="px-6 py-4 border-b border-black/[0.06]">
              <p className="text-[12px] font-bold text-[#1A1410] mb-3">Créneaux disponibles</p>
              {!hasAvail ? (
                <div className="bg-[#FAF5E8] rounded-xl p-4 text-center">
                  <p className="text-[13px] text-[#7A6E5C]">
                    {selectedMember.firstName} n'a pas encore renseigné ses disponibilités.
                  </p>
                  <p className="text-[12px] text-[#7A6E5C] mt-1">
                    Envoyez une demande et discutez de l'heure dans le chat.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl overflow-hidden border border-black/[0.09]">
                  {/* Header jours */}
                  <div className="grid bg-[#F8F4EA]" style={{ gridTemplateColumns: '72px repeat(5, 1fr)' }}>
                    <div className="p-2" />
                    {DAYS.map(day => (
                      <div key={day} className="p-2 text-center text-[10px] font-bold text-[#252840] border-l border-black/[0.06]">
                        {day.slice(0, 3)}
                      </div>
                    ))}
                  </div>
                  {/* Créneaux */}
                  {SLOTS.map((slot, si) => (
                    <div key={slot} className={`grid ${si < SLOTS.length - 1 ? 'border-b border-black/[0.09]' : ''}`}
                      style={{ gridTemplateColumns: '72px repeat(5, 1fr)' }}>
                      <div className="p-2 flex flex-col justify-center border-r border-black/[0.06]">
                        <p className="text-[10px] font-bold text-[#1A1410]">{slot}</p>
                        <p className="text-[9px] text-[#7A6E5C]">{SLOT_HINTS[slot]}</p>
                      </div>
                      {DAYS.map(day => {
                        const active = !!memberAvail[`${day}_${slot}`]
                        return (
                          <div key={day} className={`border-l border-black/[0.06] p-2 flex items-center justify-center ${active ? 'bg-[#E4EED8]' : 'bg-white'}`}>
                            {active
                              ? <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#3D5C28" strokeWidth="2.5" strokeLinecap="round"><path d="M2 7l3 3 7-6"/></svg>
                              : <div className="w-3 h-3 rounded bg-black/[0.05]" />
                            }
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Bouton réservation */}
            <div className="p-6">
              {requested.has(selectedMember.id) ? (
                <div className="w-full py-3 rounded-xl bg-[#E4EED8] text-[#3D5C28] text-[14px] font-bold text-center">
                  Demande envoyée — attendez la réponse dans le chat
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(selectedMember.id)}
                  disabled={!user}
                  className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50">
                  {!user ? 'Connectez-vous pour réserver' : hasAvail ? 'Envoyer une demande de réservation' : 'Envoyer une demande'}
                </button>
              )}
              {!user && (
                <button onClick={() => { openModal('login'); setSelected(null) }}
                  className="w-full mt-2 py-2 rounded-xl border-[1.5px] border-[#252840] text-[#252840] text-[13px] font-semibold bg-transparent cursor-pointer hover:bg-[#ECEEF8] transition-all">
                  Se connecter
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-black/[0.09] px-8 md:px-20 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Trouver un pair</p>
            <h1 className="text-[34px] font-black tracking-[-1.2px] text-[#1A1410]">Connexions</h1>
            <p className="text-[13px] text-[#7A6E5C] mt-1">
              {user ? 'Les profils compatibles avec vos objectifs apparaissent en premier' : 'Connectez-vous pour voir les membres'}
            </p>
          </div>
          {incoming.length > 0 && (
            <button onClick={() => setTab('requests')}
              className="flex items-center gap-2 bg-[#C8864B] text-white px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer border-none hover:bg-[#B07030] transition-all">
              {incoming.length} demande{incoming.length > 1 ? 's' : ''} en attente
            </button>
          )}
        </div>
        <div className="flex gap-1 mt-6 border-b border-black/[0.07]">
          {[{ key: 'discover', label: 'Découvrir' }, { key: 'requests', label: `Demandes (${incoming.length})` }].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-[13px] font-semibold border-none bg-transparent cursor-pointer border-b-2 -mb-px transition-all
                ${tab === t.key ? 'text-[#252840] border-[#252840]' : 'text-[#7A6E5C] border-transparent hover:text-[#1A1410]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Demandes reçues */}
      {tab === 'requests' && (
        <div className="px-8 md:px-20 py-8 max-w-[860px]">
          {incoming.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.09]">
              <p className="text-[16px] font-semibold text-[#1A1410] mb-1">Aucune demande en attente</p>
              <p className="text-[13px] text-[#7A6E5C]">Les demandes apparaissent ici quand un membre veut se connecter.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incoming.map(m => (
                <div key={m.id} className="bg-white border border-black/[0.09] rounded-2xl p-5 flex items-center gap-4">
                  <Avatar user={null} firstName={m.requester?.firstName} lastName={m.requester?.lastName} color={colorFor(m.requesterId)} size="md" />
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1A1410]">{m.requester?.firstName} {m.requester?.lastName}</p>
                    <p className="text-[12px] text-[#7A6E5C]">souhaite se connecter avec vous</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleAccept(m.id, m.requesterId)}
                      className="px-5 py-[9px] rounded-xl bg-[#3D5C28] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#4E6035] transition-all">
                      Accepter
                    </button>
                    <button onClick={() => handleDecline(m.id)}
                      className="px-5 py-[9px] rounded-xl border-[1.5px] border-black/[0.09] text-[#7A6E5C] text-[13px] font-semibold bg-transparent cursor-pointer hover:border-red-400 hover:text-red-500 transition-all">
                      Décliner
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Découvrir */}
      {tab === 'discover' && (
        <div className="px-8 md:px-20 py-8">
          {/* Catégories */}
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                className={`px-4 py-[8px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                  ${category === cat.key ? 'bg-[#252840] text-white border-[#252840]' : 'bg-white text-[#7A6E5C] border-black/[0.09] hover:border-[#252840] hover:text-[#1A1410]'}`}>
                {cat.label}
              </button>
            ))}
          </div>

          {/* Recherche */}
          <div className="mb-6">
            <div className="relative max-w-[420px]">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#B0A898]" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                <circle cx="7" cy="7" r="5"/><path d="M12 12l2 2"/>
              </svg>
              <input value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou compétence…"
                className="w-full pl-9 pr-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-white text-[13px] outline-none focus:border-[#252840] transition-all" />
            </div>
          </div>

          {/* Non connecté */}
          {!user ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-2xl bg-[#ECEEF8] flex items-center justify-center mx-auto mb-4">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#252840" strokeWidth="1.6" strokeLinecap="round">
                  <circle cx="14" cy="10" r="5"/><path d="M4 26c0-5.5 4.5-10 10-10s10 4.5 10 10"/>
                </svg>
              </div>
              <p className="text-[16px] font-semibold text-[#1A1410] mb-2">Connectez-vous pour voir les membres</p>
              <button onClick={() => openModal('login')}
                className="mt-2 px-6 py-3 rounded-xl bg-[#252840] text-white font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                Se connecter
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[16px] font-semibold text-[#1A1410] mb-2">Aucun membre trouvé</p>
              <p className="text-[13px] text-[#7A6E5C]">Essayez une autre catégorie ou invitez des amis.</p>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-[#7A6E5C] mb-4 font-semibold">
                {filtered.length} membre{filtered.length > 1 ? 's' : ''}
                {filtered.some(m => m.score > 0) && ' · triés par compatibilité'}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(m => (
                  <div key={m.id} onClick={() => setSelected(m)}
                    className="bg-white border border-black/[0.09] rounded-2xl p-5 cursor-pointer hover:shadow-md hover:border-[#252840]/20 transition-all relative">

                    {m.score > 0 && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-[#E4EED8] flex items-center justify-center">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="#3D5C28" strokeWidth="2" strokeLinecap="round"><path d="M2 5l2 2 4-4"/></svg>
                      </div>
                    )}

                    <div className="flex items-center gap-3 mb-3">
                      <Avatar user={m} firstName={m.firstName} lastName={m.lastName} color={m.color} size="md" />
                      <div className="min-w-0">
                        <p className="text-[14px] font-bold text-[#1A1410] truncate">{m.firstName} {m.lastName}</p>
                        {m.bio && <p className="text-[11px] text-[#7A6E5C] truncate">{m.bio}</p>}
                      </div>
                    </div>

                    {m.teaches.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-bold text-[#C8864B] uppercase tracking-wide mb-1">Enseigne</p>
                        <div className="flex flex-wrap gap-1">
                          {m.teaches.slice(0, 3).map(s => <span key={s} className="px-2 py-[2px] rounded-full bg-[#252840] text-white text-[10px]">{s}</span>)}
                          {m.teaches.length > 3 && <span className="text-[10px] text-[#7A6E5C]">+{m.teaches.length - 3}</span>}
                        </div>
                      </div>
                    )}

                    {m.wants.length > 0 && (
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-[#3D5C28] uppercase tracking-wide mb-1">Apprend</p>
                        <div className="flex flex-wrap gap-1">
                          {m.wants.slice(0, 3).map(s => <span key={s} className="px-2 py-[2px] rounded-full border border-[#3D5C28] text-[#3D5C28] text-[10px]">{s}</span>)}
                          {m.wants.length > 3 && <span className="text-[10px] text-[#7A6E5C]">+{m.wants.length - 3}</span>}
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-[#7A6E5C]">Voir le profil →</span>
                      {requested.has(m.id) && (
                        <span className="text-[10px] font-bold text-[#3D5C28] bg-[#E4EED8] px-2 py-[2px] rounded-full">Demande envoyée</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  )
}