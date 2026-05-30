import { useState, useEffect, useCallback } from 'react'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { CATEGORIES, SKILL_TO_CATEGORY } from '../data/categories'

export default function Connection() {
  const { user, openModal } = useAuthStore()

  const [tab,            setTab]       = useState('discover')
  const [category,       setCategory]  = useState('all')
  const [search,         setSearch]    = useState('')
  const [selectedMember, setSelected]  = useState(null)

  const [incoming,  setIncoming]  = useState([])
  const [requested, setRequested] = useState(new Set())
  const [apiUsers,  setApiUsers]  = useState([])

  const COLORS = ['#252840','#C8864B','#3D5C28','#363B6B']

  const allMembers = apiUsers.map(u => ({
    id:          u.id,
    firstName:   u.firstName,
    lastName:    u.lastName,
    bio:         u.bio || '',
    credits:     u.credits,
    reputation:  4.5,
    reviewCount: 0,
    teaches:     (u.teachingSkills || []).map(s => s.skill?.name ?? s),
    wants:       (u.learningGoals  || []).map(s => s.skill?.name ?? s),
    category:    SKILL_TO_CATEGORY[(u.teachingSkills?.[0]?.skill?.name)] ?? 'all',
    color: COLORS[Math.abs((u.id?.charCodeAt(0) ?? 0) % 4)],
  }))

  const loadData = useCallback(async () => {
    if (!user) return
    try {
      const [sugRes, matchRes] = await Promise.all([
        api.get('/matches/suggestions'),
        api.get('/matches/mine'),
      ])
      setApiUsers(sugRes.data.suggestions || [])
      const matches = matchRes.data.matches || []
      setIncoming(matches.filter(m => m.receiverId === user.id && m.status === 'PENDING'))
      setRequested(new Set(matches.filter(m => m.requesterId === user.id).map(m => m.receiverId)))
    } catch (e) {
      console.error(e)
    }
  }, [user])

  useEffect(() => {
    loadData()
    const id = setInterval(loadData, 5000)
    return () => clearInterval(id)
  }, [loadData])

  const handleConnect = async (memberId) => {
    if (!user) { openModal('login'); return }
    try {
      await api.post('/matches/request', { receiverId: memberId })
      setRequested(prev => new Set([...prev, memberId]))
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur lors de la demande')
    }
  }

  const handleAccept = async (matchId, requesterId) => {
    try {
      await api.patch(`/matches/${matchId}`, { status: 'ACCEPTED' })
      setIncoming(prev => prev.filter(m => m.id !== matchId))
      setRequested(prev => new Set([...prev, requesterId]))
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur')
    }
  }

  const handleDecline = async (matchId) => {
    try {
      await api.patch(`/matches/${matchId}`, { status: 'REJECTED' })
      setIncoming(prev => prev.filter(m => m.id !== matchId))
    } catch (e) {
      alert(e.response?.data?.message || 'Erreur')
    }
  }

  const filtered = allMembers.filter(m => {
    if (category !== 'all') {
      const cat = CATEGORIES.find(c => c.key === category)
      if (cat && !m.teaches.some(s => cat.skills.includes(s))) return false
    }
    if (search.trim()) {
      const q = search.toLowerCase()
      return (
        `${m.firstName} ${m.lastName}`.toLowerCase().includes(q) ||
        m.teaches.some(s => s.toLowerCase().includes(q)) ||
        m.wants.some(s => s.toLowerCase().includes(q))
      )
    }
    return true
  })

  return (
    <main className="pt-[62px] min-h-screen bg-white">

      {/* Profile modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-[400] bg-black/50 flex items-center justify-center"
          onClick={() => setSelected(null)}
        >
          <div className="bg-white rounded-2xl p-8 w-[420px] max-w-[calc(100vw-32px)] relative" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer text-xl">✕</button>
            <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-4"
              style={{ background: selectedMember.color }}>
              {selectedMember.firstName?.[0]}{selectedMember.lastName?.[0]}
            </div>
            <h2 className="text-xl font-black text-[#1A1410] mb-1">{selectedMember.firstName} {selectedMember.lastName}</h2>
            {selectedMember.bio && <p className="text-[13px] text-[#7A6E5C] mb-4">{selectedMember.bio}</p>}
            {selectedMember.teaches.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-bold text-[#C8864B] uppercase tracking-wide mb-2">Peut enseigner</p>
                <div className="flex flex-wrap gap-1">
                  {selectedMember.teaches.map(s => (
                    <span key={s} className="px-3 py-1 rounded-full bg-[#252840] text-white text-[12px]">{s}</span>
                  ))}
                </div>
              </div>
            )}
            {selectedMember.wants.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-bold text-[#3D5C28] uppercase tracking-wide mb-2">Veut apprendre</p>
                <div className="flex flex-wrap gap-1">
                  {selectedMember.wants.map(s => (
                    <span key={s} className="px-3 py-1 rounded-full border border-[#3D5C28] text-[#3D5C28] text-[12px]">{s}</span>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={() => { handleConnect(selectedMember.id); setSelected(null) }}
              disabled={requested.has(selectedMember.id)}
              className="w-full py-3 rounded-xl bg-[#252840] text-white font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50"
            >
              {requested.has(selectedMember.id) ? 'Demande envoyée ✓' : 'Se connecter'}
            </button>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white border-b border-black/[0.09] px-8 md:px-20 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Trouver un pair</p>
            <h1 className="text-[34px] font-black tracking-[-1.2px] text-[#1A1410]">Connexions</h1>
            <p className="text-[13px] text-[#7A6E5C] mt-1">Découvrez des membres qui partagent vos centres d'intérêt</p>
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
              <p className="text-[13px] text-[#7A6E5C]">Quand un membre veut se connecter avec vous, la demande apparaît ici.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incoming.map(m => (
                <div key={m.id} className="bg-white border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#252840] flex items-center justify-center font-bold text-white text-[16px] flex-shrink-0">
                    {m.requester?.firstName?.[0]}{m.requester?.lastName?.[0]}
                  </div>
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
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                className={`px-4 py-[8px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                  ${category === cat.key ? 'bg-[#252840] text-white border-[#252840]' : 'bg-white text-[#7A6E5C] border-black/[0.09] hover:border-[#252840] hover:text-[#1A1410]'}`}>
                {cat.label}
              </button>
            ))}
          </div>
          <div className="mb-6">
            <div className="relative max-w-[420px]">
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou compétence…"
                className="w-full pl-4 pr-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-white text-[13px] outline-none focus:border-[#252840] transition-all"
              />
            </div>
          </div>

          {!user ? (
            <div className="text-center py-20">
              <p className="text-[16px] font-semibold text-[#1A1410] mb-2">Connectez-vous pour voir les membres</p>
              <button onClick={() => openModal('login')}
                className="mt-3 px-6 py-3 rounded-xl bg-[#252840] text-white font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                Se connecter
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[16px] font-semibold text-[#1A1410] mb-2">Aucun membre trouvé</p>
              <p className="text-[13px] text-[#7A6E5C]">Essayez une autre catégorie ou invitez des amis à s'inscrire.</p>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-[#7A6E5C] mb-4 font-semibold">
                {filtered.length} membre{filtered.length > 1 ? 's' : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(m => (
                  <div key={m.id}
                    onClick={() => setSelected(m)}
                    className="bg-white border border-black/[0.09] rounded-2xl p-5 cursor-pointer hover:shadow-md transition-all hover:border-[#252840]/20">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-[14px] flex-shrink-0"
                        style={{ background: m.color }}>
                        {m.firstName?.[0]}{m.lastName?.[0]}
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-[#1A1410]">{m.firstName} {m.lastName}</p>
                        {m.bio && <p className="text-[11px] text-[#7A6E5C] line-clamp-1">{m.bio}</p>}
                      </div>
                    </div>
                    {m.teaches.length > 0 && (
                      <div className="mb-2">
                        <p className="text-[10px] font-bold text-[#C8864B] uppercase tracking-wide mb-1">Enseigne</p>
                        <div className="flex flex-wrap gap-1">
                          {m.teaches.slice(0, 3).map(s => (
                            <span key={s} className="px-2 py-[2px] rounded-full bg-[#252840] text-white text-[10px]">{s}</span>
                          ))}
                          {m.teaches.length > 3 && <span className="text-[10px] text-[#7A6E5C]">+{m.teaches.length - 3}</span>}
                        </div>
                      </div>
                    )}
                    {m.wants.length > 0 && (
                      <div className="mb-3">
                        <p className="text-[10px] font-bold text-[#3D5C28] uppercase tracking-wide mb-1">Apprend</p>
                        <div className="flex flex-wrap gap-1">
                          {m.wants.slice(0, 3).map(s => (
                            <span key={s} className="px-2 py-[2px] rounded-full border border-[#3D5C28] text-[#3D5C28] text-[10px]">{s}</span>
                          ))}
                          {m.wants.length > 3 && <span className="text-[10px] text-[#7A6E5C]">+{m.wants.length - 3}</span>}
                        </div>
                      </div>
                    )}
                    <button
                      onClick={e => { e.stopPropagation(); handleConnect(m.id) }}
                      disabled={requested.has(m.id)}
                      className="w-full py-2 rounded-lg bg-[#252840] text-white text-[12px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50 disabled:cursor-default"
                    >
                      {requested.has(m.id) ? 'Demande envoyée ✓' : 'Se connecter'}
                    </button>
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