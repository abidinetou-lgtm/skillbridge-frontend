import { useState, useEffect, useCallback } from 'react'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { CATEGORIES, SKILL_TO_CATEGORY } from '../data/categories'

const COLORS = ['#252840', '#C8864B', '#3D5C28', '#363B6B']

function colorFor(id) {
  if (!id) return COLORS[0]
  return COLORS[Math.abs(id.charCodeAt(0) % COLORS.length)]
}

function getAvailFor(u) {
  if (u && u.availability) {
    try { return JSON.parse(u.availability) } catch {}
  }
  return {}
}

function matchScore(member, myGoals, mySkills) {
  let score = 0
  myGoals.forEach(g => {
    if (member.teaches.some(s => s.toLowerCase().includes(g.toLowerCase()) || g.toLowerCase().includes(s.toLowerCase()))) score += 10
  })
  mySkills.forEach(s => {
    if (member.wants.some(w => w.toLowerCase().includes(s.toLowerCase()) || s.toLowerCase().includes(w.toLowerCase()))) score += 5
  })
  return score
}

function AvatarCircle({ user: u, name, color, size = 56 }) {
  const initials = name.split(' ').map(p => p[0]).join('').toUpperCase().slice(0, 2)
  const sz = size === 64 ? 'h-16 w-16 text-xl' : 'h-14 w-14 text-base'
  if (u?.avatarUrl) {
    return <img src={u.avatarUrl} alt={name} className={`${sz} rounded-full object-cover flex-shrink-0`} />
  }
  return (
    <div className={`${sz} rounded-full flex items-center justify-center font-bold text-white flex-shrink-0`} style={{ background: color }}>
      {initials}
    </div>
  )
}

const DAYS  = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi']
const SLOTS = ['Matin', 'Midi', 'Soir']
const SLOT_HINTS = { Matin: '8h–12h', Midi: '12h–14h', Soir: '18h–22h' }

const FILTERS = [{ key: 'all', label: 'Tous' }, ...CATEGORIES.filter(c => c.key !== 'all')]

export default function Connection() {
  const { user, openModal } = useAuthStore()

  const [tab,      setTab]      = useState('discover')
  const [filter,   setFilter]   = useState('all')
  const [search,   setSearch]   = useState('')
  const [selected, setSelected] = useState(null)

  const [incoming,  setIncoming]  = useState([])
  const [requested, setRequested] = useState(new Set())
  const [allUsers,  setAllUsers]  = useState([])
  const [myProfile, setMyProfile] = useState(null)

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
    } catch {}
  }, [user])

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 5000)
    return () => clearInterval(id)
  }, [loadData])

  const myGoals  = (myProfile?.learningGoals  || []).map(g => g.skill?.name ?? g)
  const mySkills = (myProfile?.teachingSkills || []).map(s => s.skill?.name ?? s)

  // Set des IDs de compétences que je veux apprendre (+ fallback par nom)
  const mySkillGoalIds = new Set(
    (myProfile?.learningGoals || []).map(g => g.skill?.id).filter(Boolean)
  )

  const members = allUsers.map(u => {
    const teachesNames = (u.teachingSkills || []).map(s => s.skill?.name ?? '')
    const wantsNames   = (u.learningGoals  || []).map(s => s.skill?.name ?? '')

    // Objets complets avec booléen isMatch, matchés triés en premier
    const teachesObjs = (u.teachingSkills || [])
      .map(s => {
        const name = s.skill?.name ?? ''
        const id   = s.skill?.id   ?? null
        const isMatch = mySkillGoalIds.has(id) ||
          myGoals.some(g => g.toLowerCase() === name.toLowerCase())
        return { id, name, isMatch }
      })
      .sort((a, b) => Number(b.isMatch) - Number(a.isMatch))

    return {
      id:            u.id,
      firstName:     u.firstName,
      lastName:      u.lastName,
      bio:           u.bio || '',
      avatarUrl:     u.avatarUrl || '',
      availability:  u.availability || null,
      averageRating: u.averageRating ?? null,
      teaches:       teachesObjs,
      wants:         wantsNames,
      color:         colorFor(u.id),
      score:         matchScore({ teaches: teachesNames, wants: wantsNames }, myGoals, mySkills),
      user:          u,
    }
  })

  const filtered = members
    .filter(m => {
      if (filter !== 'all') {
        const cat = CATEGORIES.find(c => c.key === filter)
        if (cat && !m.teaches.some(s => cat.skills.includes(s.name))) return false
      }
      if (search.trim()) {
        const q = search.toLowerCase()
        return `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
          m.teaches.some(s => s.name.toLowerCase().includes(q))
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
    } catch {}
  }

  const memberAvail = selected ? getAvailFor(selected) : {}
  const hasAvail    = Object.values(memberAvail).some(Boolean)

  return (
    <main className="min-h-screen bg-[#FDFAF4]">
      {/* Modal profil */}
      {selected && (
        <div
          className="fixed inset-0 z-[400] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm"
          onClick={() => setSelected(null)}
        >
          <div
            className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-soft border border-[#E8DDC7]"
            onClick={e => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <AvatarCircle user={selected} name={`${selected.firstName} ${selected.lastName}`} color={selected.color} size={64} />
                  <div>
                    <h2 className="text-2xl font-black text-[#252840]">{selected.firstName} {selected.lastName}</h2>
                    {selected.averageRating != null && (
                      <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#C8864B]">
                        <svg width="13" height="13" viewBox="0 0 13 13" fill="#C8864B" stroke="#C8864B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="6.5,1 8.2,4.5 12,5.1 9.2,7.8 9.9,11.5 6.5,9.7 3.1,11.5 3.8,7.8 1,5.1 4.8,4.5"/></svg>
                        {Number(selected.averageRating).toFixed(1)}
                      </p>
                    )}
                    {selected.bio && <p className="text-sm text-[#756B5B] mt-1">{selected.bio}</p>}
                    {selected.score > 0 && (
                      <span className="inline-flex items-center gap-1 mt-1 px-2 py-0.5 rounded-full bg-[rgba(61,92,40,0.12)] text-[#3D5C28] text-xs font-bold">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1.5 5l3 3 5-5"/></svg>
                        Correspond à vos objectifs
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => setSelected(null)}
                  className="h-8 w-8 rounded-full bg-[#F8F4EA] flex items-center justify-center border-none cursor-pointer hover:bg-[#E8DDC7] transition-colors text-[#756B5B]"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l10 10M11 1L1 11"/></svg>
                </button>
              </div>

              {selected.teaches.length > 0 && (
                <div className="mb-4">
                  <p className="text-xs font-bold text-[#252840] uppercase tracking-wide mb-2">Compétences enseignées</p>
                  <div className="flex flex-wrap gap-2">
                    {selected.teaches.map(s => (
                      <span key={s.id ?? s.name}
                        className="inline-flex items-center gap-1 rounded-lg bg-[#252840] px-3 py-1.5 text-xs font-semibold text-[#F8F4EA]">
                        {s.isMatch && (
                          <svg width="10" height="10" viewBox="0 0 10 10" fill="#C8864B" stroke="none">
                            <polygon points="5,0.5 6.2,3.4 9.5,3.8 7.2,6 7.9,9.3 5,7.7 2.1,9.3 2.8,6 0.5,3.8 3.8,3.4"/>
                          </svg>
                        )}
                        {s.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-4">
                <p className="text-xs font-bold text-[#252840] uppercase tracking-wide mb-2">Disponibilités</p>
                {!hasAvail ? (
                  <div className="bg-[#F8F4EA] rounded-2xl p-4 text-center">
                    <p className="text-sm text-[#756B5B]">{selected.firstName} n'a pas encore renseigné ses disponibilités.</p>
                  </div>
                ) : (
                  <div className="overflow-hidden rounded-2xl border border-[#E8DDC7]">
                    <div className="grid bg-[#F8F4EA] text-center text-xs font-semibold text-[#252840]" style={{ gridTemplateColumns: '64px repeat(5, 1fr)' }}>
                      <div className="p-2" />
                      {DAYS.map(d => <div key={d} className="p-2">{d.slice(0,3)}</div>)}
                    </div>
                    {SLOTS.map(slot => (
                      <div key={slot} className="grid border-t border-[#E8DDC7] text-center" style={{ gridTemplateColumns: '64px repeat(5, 1fr)' }}>
                        <div className="bg-[#F8F4EA] p-2 text-xs font-semibold text-[#252840]">{slot}</div>
                        {DAYS.map(day => {
                          const active = !!memberAvail[`${day}_${slot}`]
                          return (
                            <div key={day} className="p-2">
                              <span className={`mx-auto block h-5 w-5 rounded-md ${active ? 'bg-[#3D5C28]' : 'bg-[#F8F4EA]'}`} />
                            </div>
                          )
                        })}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {requested.has(selected.id) ? (
                <div className="w-full py-3 rounded-full bg-[rgba(61,92,40,0.12)] text-[#3D5C28] text-sm font-bold text-center">
                  <span className="inline-flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 6l4 4 6-6"/></svg>
                    Demande envoyée
                  </span>
                </div>
              ) : (
                <button
                  onClick={() => handleConnect(selected.id)}
                  disabled={!user}
                  className="w-full py-3 rounded-full bg-[#C8864B] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#B07030] transition-colors disabled:opacity-50"
                >
                  {!user ? 'Connectez-vous pour réserver' : 'Envoyer une demande de réservation'}
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        {/* Header */}
        <h1 className="text-4xl font-black tracking-tight text-[#252840]">Connexions</h1>
        <p className="mt-2 text-[#756B5B]">
          {user ? 'Trouve un membre compatible et apprends en échangeant.' : 'Connectez-vous pour voir les membres.'}
        </p>

        {/* Tabs */}
        <div className="mt-6 inline-flex rounded-full border border-[#E8DDC7] bg-[#F8F4EA] p-1">
          {['Découvrir', 'Demandes'].map(t => (
            <button
              key={t}
              onClick={() => setTab(t === 'Découvrir' ? 'discover' : 'requests')}
              className={`rounded-full px-5 py-2 text-sm font-semibold border-none cursor-pointer transition-colors ${
                (t === 'Découvrir' ? tab === 'discover' : tab === 'requests')
                  ? 'bg-[#252840] text-[#F8F4EA]'
                  : 'bg-transparent text-[#756B5B] hover:text-[#252840]'
              }`}
            >
              {t}{t === 'Demandes' && incoming.length > 0 ? ` (${incoming.length})` : ''}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="mt-6 max-w-xl">
          <div className="relative">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B0A898]" width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
              <circle cx="8" cy="8" r="6"/><path d="M14 14l2 2"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Rechercher une compétence ou un membre…"
              className="h-12 w-full rounded-full border border-[#E8DDC7] bg-white pl-12 pr-4 text-base outline-none focus:border-[#C8864B] transition-colors"
            />
          </div>
        </div>

        {/* Filter chips */}
        <div className="mt-5 flex flex-wrap gap-2">
          {FILTERS.slice(0, 7).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full border px-4 py-2 text-sm font-medium cursor-pointer transition-colors ${
                filter === f.key
                  ? 'border-[#C8864B] bg-[#C8864B] text-white'
                  : 'border-[#E8DDC7] bg-white text-[#756B5B] hover:border-[rgba(200,134,75,0.5)]'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Onglet Demandes */}
        {tab === 'requests' && (
          <div className="mt-8">
            {incoming.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-[#E8DDC7] bg-white p-12 text-center">
                <p className="text-lg font-semibold text-[#252840]">Aucune demande en attente</p>
                <p className="mt-1 text-[#756B5B]">Les demandes de réservation que tu reçois apparaîtront ici.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {incoming.map(m => (
                  <div key={m.id} className="rounded-3xl border border-[#E8DDC7] bg-white p-5 flex items-center gap-4 shadow-card">
                    <div className="h-12 w-12 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0" style={{ background: colorFor(m.requesterId) }}>
                      {(m.requester?.firstName?.[0] ?? '') + (m.requester?.lastName?.[0] ?? '')}
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-[#252840]">{m.requester?.firstName} {m.requester?.lastName}</p>
                      <p className="text-sm text-[#756B5B]">souhaite se connecter avec vous</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleAccept(m.id, m.requesterId)}
                        className="px-4 py-2 rounded-full bg-[#3D5C28] text-white text-sm font-bold border-none cursor-pointer hover:bg-[#4E6035] transition-colors">
                        Accepter
                      </button>
                      <button onClick={() => handleDecline(m.id)}
                        className="px-4 py-2 rounded-full border border-[#E8DDC7] text-[#756B5B] text-sm font-semibold bg-transparent cursor-pointer hover:border-red-300 hover:text-red-500 transition-colors">
                        Décliner
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Onglet Découvrir */}
        {tab === 'discover' && (
          <div className="mt-8">
            {!user ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-[#252840] mb-4">Connectez-vous pour voir les membres</p>
                <button onClick={() => openModal('login')}
                  className="px-6 py-3 rounded-full bg-[#252840] text-white font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-colors">
                  Se connecter
                </button>
              </div>
            ) : filtered.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-lg font-semibold text-[#252840] mb-2">Aucun membre trouvé</p>
                <p className="text-sm text-[#756B5B]">Essayez une autre catégorie ou invitez des amis.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filtered.map(m => (
                  <button
                    key={m.id}
                    onClick={() => setSelected(m)}
                    className="group flex flex-col rounded-3xl border border-[#E8DDC7] bg-white p-6 text-left shadow-card transition-transform hover:-translate-y-1 cursor-pointer"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <AvatarCircle user={m} name={`${m.firstName} ${m.lastName}`} color={m.color} />
                        <div>
                          <p className="font-bold text-[#252840]">{m.firstName} {m.lastName}</p>
                          {m.averageRating != null && (
                            <p className="inline-flex items-center gap-1 text-sm font-semibold text-[#C8864B]">
                              <svg width="12" height="12" viewBox="0 0 12 12" fill="#C8864B" stroke="#C8864B" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round"><polygon points="6,1 7.5,4.2 11,4.6 8.5,7 9.2,10.5 6,8.8 2.8,10.5 3.5,7 1,4.6 4.5,4.2"/></svg>
                              {Number(m.averageRating).toFixed(1)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {m.bio && <p className="mt-3 text-sm text-[#756B5B]">{m.bio}</p>}

                    {m.teaches.length > 0 && (
                      <div className="mt-4">
                        <p className="text-xs font-semibold uppercase tracking-wide text-[#756B5B] mb-2">Enseigne</p>
                        <div className="flex flex-wrap gap-2">
                          {m.teaches.slice(0, 4).map(s => (
                            <span key={s.id ?? s.name}
                              className="inline-flex items-center gap-1 rounded-lg bg-[#252840] px-2.5 py-1 text-xs font-semibold text-[#F8F4EA]">
                              {s.isMatch && (
                                <svg width="10" height="10" viewBox="0 0 10 10" fill="#C8864B" stroke="none">
                                  <polygon points="5,0.5 6.2,3.4 9.5,3.8 7.2,6 7.9,9.3 5,7.7 2.1,9.3 2.8,6 0.5,3.8 3.8,3.4"/>
                                </svg>
                              )}
                              {s.name}
                            </span>
                          ))}
                          {m.teaches.length > 4 && <span className="text-xs text-[#756B5B]">+{m.teaches.length - 4}</span>}
                        </div>
                      </div>
                    )}

                    {m.score > 0 && (
                      <span className="mt-4 inline-flex items-center gap-1.5 self-start rounded-full bg-[rgba(61,92,40,0.12)] px-3 py-1 text-xs font-semibold text-[#3D5C28]">
                        <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1.5 5l3 3 5-5"/></svg>
                        Correspond à vos objectifs
                      </span>
                    )}

                    {requested.has(m.id) ? (
                      <div className="mt-5 w-full py-2 rounded-full bg-[rgba(61,92,40,0.12)] text-[#3D5C28] text-sm font-bold text-center">
                        <span className="inline-flex items-center gap-1.5">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 6l4 4 6-6"/></svg>
                    Demande envoyée
                  </span>
                      </div>
                    ) : (
                      <div className="mt-5 w-full py-2 rounded-full bg-[#252840] text-[#F8F4EA] text-sm font-bold text-center">
                        Réserver
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </main>
  )
}
