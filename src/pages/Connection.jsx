import { useState, useEffect, useCallback } from 'react'
import useAuthStore from '../store/authStore'
import api from '../services/api'
import { CATEGORIES, SKILL_TO_CATEGORY } from '../data/categories'
import MOCK_USERS from '../data/mockUsers'
import MemberCard from '../components/MemberCard'
import ProfileModal from '../components/ProfileModal'

export default function Connection() {
  const { user, openModal } = useAuthStore()

  const [tab,           setTab]          = useState('discover')
  const [category,      setCategory]     = useState('all')
  const [search,        setSearch]       = useState('')
  const [selectedMember, setSelected]    = useState(null)

  // Données API
  const [incoming,  setIncoming]  = useState([])
  const [requested, setRequested] = useState(new Set())
  const [apiUsers,  setApiUsers]  = useState([])

  // Fusionner mock + API (les vrais utilisateurs en premier dans "Tous")
  const allMembers = [
    ...apiUsers.map(u => ({
      id:          u.id,
      firstName:   u.firstName,
      lastName:    u.lastName,
      bio:         u.bio || '',
      credits:     undefined,
      reputation:  4.5,
      reviewCount: 0,
      teaches:     (u.teachingSkills || []).map(s => s.skill?.name ?? s),
      wants:       (u.learningGoals  || []).map(s => s.skill?.name ?? s),
      category:    SKILL_TO_CATEGORY[(u.teachingSkills?.[0]?.skill?.name)] ?? 'all',
      availability: {},
      color: ['#252840','#C8864B','#3D5C28','#363B6B'][Math.abs((u.id.charCodeAt(0) ?? 0) % 4)],
    })),
    ...MOCK_USERS,
  ]

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
    const id = setInterval(loadData, 3000)
    return () => clearInterval(id)
  }, [loadData])

  const handleConnect = async (memberId) => {
    if (!user) { openModal('login'); return }
    if (memberId.startsWith('mock-')) {
      setRequested(prev => new Set([...prev, memberId]))
      return
    }
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

  // Filtrage par catégorie + recherche
  const filtered = allMembers.filter(m => {
    if (category !== 'all') {
      const cat = CATEGORIES.find(c => c.key === category)
      if (cat) {
        const matchesCat = m.teaches.some(s => cat.skills.includes(s))
        if (!matchesCat) return false
      }
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

      {selectedMember && (
        <ProfileModal member={selectedMember} onClose={() => setSelected(null)} />
      )}

      {/* ── Header ── */}
      <div className="bg-white border-b border-black/[0.09] px-8 md:px-20 py-8">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">
              Trouver un pair
            </p>
            <h1 className="text-[34px] font-black tracking-[-1.2px] text-[#1A1410]">
              Connexions
            </h1>
            <p className="text-[13px] text-[#7A6E5C] mt-1">
              Découvrez des membres qui partagent vos centres d'intérêt
            </p>
          </div>
          {incoming.length > 0 && (
            <button
              onClick={() => setTab('requests')}
              className="flex items-center gap-2 bg-[#C8864B] text-white px-4 py-2 rounded-full text-[13px] font-bold cursor-pointer border-none hover:bg-[#B07030] transition-all"
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                <circle cx="7" cy="5" r="3"/><path d="M1 13c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
              </svg>
              {incoming.length} demande{incoming.length > 1 ? 's' : ''} en attente
            </button>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 border-b border-black/[0.07]">
          {[
            { key: 'discover',  label: 'Découvrir' },
            { key: 'requests',  label: `Demandes (${incoming.length})` },
          ].map(t => (
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-3 text-[13px] font-semibold border-none bg-transparent cursor-pointer border-b-2 -mb-px transition-all
                ${tab === t.key ? 'text-[#252840] border-[#252840]' : 'text-[#7A6E5C] border-transparent hover:text-[#1A1410]'}`}>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Demandes reçues ── */}
      {tab === 'requests' && (
        <div className="px-8 md:px-20 py-8 max-w-[860px]">
          {incoming.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl border border-black/[0.09]">
              <svg className="mx-auto mb-3 text-[#C0B8AC]" width="40" height="40" viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <circle cx="20" cy="14" r="7"/><path d="M4 36c0-8.8 7.2-16 16-16s16 7.2 16 16"/>
              </svg>
              <p className="text-[16px] font-semibold text-[#1A1410] mb-1">Aucune demande en attente</p>
              <p className="text-[13px] text-[#7A6E5C]">
                Quand un membre veut se connecter avec vous, la demande apparaît ici.
              </p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {incoming.map(m => (
                <div key={m.id} className="bg-white border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5">
                  <div className="w-12 h-12 rounded-full bg-[#252840] flex items-center justify-center font-bold text-white text-[16px] flex-shrink-0">
                    {m.requester?.firstName?.[0]}{m.requester?.lastName?.[0]}
                  </div>
                  <div className="flex-1">
                    <p className="text-[15px] font-bold text-[#1A1410]">
                      {m.requester?.firstName} {m.requester?.lastName}
                    </p>
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

      {/* ── Découvrir ── */}
      {tab === 'discover' && (
        <div className="px-8 md:px-20 py-8">

          {/* Catégories */}
          <div className="flex gap-2 flex-wrap mb-5">
            {CATEGORIES.map(cat => (
              <button key={cat.key} onClick={() => setCategory(cat.key)}
                className={`px-4 py-[8px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                  ${category === cat.key
                    ? 'bg-[#252840] text-white border-[#252840]'
                    : 'bg-white text-[#7A6E5C] border-black/[0.09] hover:border-[#252840] hover:text-[#1A1410]'}`}>
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
              <input
                value={search} onChange={e => setSearch(e.target.value)}
                placeholder="Rechercher par nom ou compétence…"
                className="w-full pl-9 pr-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-white text-[13px] outline-none focus:border-[#252840] transition-all"
              />
            </div>
          </div>

          {/* Résultats */}
          {filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-[16px] font-semibold text-[#1A1410] mb-2">Aucun membre trouvé</p>
              <p className="text-[13px] text-[#7A6E5C]">
                Essayez une autre catégorie ou ajoutez des compétences à votre profil.
              </p>
            </div>
          ) : (
            <>
              <p className="text-[12px] text-[#7A6E5C] mb-4 font-semibold">
                {filtered.length} membre{filtered.length > 1 ? 's' : ''}
                {category !== 'all' ? ` · ${CATEGORIES.find(c => c.key === category)?.label}` : ''}
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filtered.map(m => (
                  <MemberCard
                    key={m.id}
                    member={m}
                    onClick={() => setSelected(m)}
                    connectionState={requested.has(m.id) ? 'requested' : 'none'}
                    onReserve={handleConnect}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </main>
  )
}
