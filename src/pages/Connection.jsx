// src/pages/Connection.jsx  (remplace Match.jsx)
// Cartes horizontales de profils — clic → page profil de l'user
// "Connect" = envoie une demande — quand acceptée → apparaît dans Chat
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const TAG_STYLES = {
  sand:  'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8] text-[#252840]',
  sage:  'bg-[#E4EED8] text-[#3D5C28]',
  warm:  'bg-[#F8EDD8] text-[#8C5A1E]',
}

const ALL_USERS = [
  {
    id:'la', initials:'LA', color:'#252840',
    name:'Léa Arnaud', age:19, city:'Paris', dispo:true,
    bio:'Passionate about mathematics and music theory. Looking to improve my English through real conversation.',
    teaches:[{l:'Maths',s:'sand'},{l:'Piano',s:'sand'}],
    wants:[{l:'English',s:'night'}],
    score:92,
  },
  {
    id:'km', initials:'KM', color:'#C8864B',
    name:'Kenji Matsuda', age:22, city:'Lyon', dispo:true,
    bio:'Designer by day, language enthusiast by night. I speak Japanese natively and would love to improve my French.',
    teaches:[{l:'Japanese',s:'warm'},{l:'Design',s:'warm'}],
    wants:[{l:'French',s:'sage'}],
    score:78,
  },
  {
    id:'so', initials:'SO', color:'#3D5C28',
    name:'Sara Okonkwo', age:20, city:'Marseille', dispo:true,
    bio:'Native English speaker, cooking enthusiast. Looking to learn Spanish while teaching what I know.',
    teaches:[{l:'English',s:'sage'},{l:'Cooking',s:'sage'}],
    wants:[{l:'Spanish',s:'night'}],
    score:71,
  },
  {
    id:'pd', initials:'PD', color:'#4E6035',
    name:'Paul Dumont', age:21, city:'Bordeaux', dispo:false,
    bio:'Software engineer teaching Python and algorithms. Dreaming of learning guitar to decompress after work.',
    teaches:[{l:'Python',s:'sage'},{l:'Maths',s:'sage'}],
    wants:[{l:'Guitar',s:'warm'}],
    score:68,
  },
  {
    id:'cl', initials:'CL', color:'#363B6B',
    name:'Camille Laurent', age:23, city:'Paris', dispo:true,
    bio:'French literature graduate with a love for writing. Looking for piano lessons in exchange for French tutoring.',
    teaches:[{l:'French',s:'night'},{l:'Writing',s:'night'}],
    wants:[{l:'Piano',s:'sand'}],
    score:65,
  },
  {
    id:'rn', initials:'RN', color:'#C8864B',
    name:'Ryo Nakamura', age:25, city:'Lyon', dispo:false,
    bio:'Classically trained musician. I play piano and guitar and want to finally understand the maths I never learned.',
    teaches:[{l:'Piano',s:'warm'},{l:'Guitar',s:'warm'}],
    wants:[{l:'Maths',s:'sand'}],
    score:61,
  },
]

export default function Connection() {
  const navigate = useNavigate()
  const { user, openModal } = useAuthStore()
  const [search, setSearch] = useState('')
  const [filterSkill, setFilterSkill] = useState('')
  const [requested, setRequested] = useState(new Set())

  const filtered = ALL_USERS.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase())
    const matchSkill  = !filterSkill ||
      u.teaches.some(t => t.l.toLowerCase().includes(filterSkill.toLowerCase())) ||
      u.wants.some(t => t.l.toLowerCase().includes(filterSkill.toLowerCase()))
    return matchSearch && matchSkill
  })

  const handleRequest = (e, userId) => {
    e.stopPropagation() // ne pas naviguer vers le profil
    if (!user) { openModal('login'); return }
    setRequested(prev => new Set([...prev, userId]))
  }

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">

      {/* Header */}
      <div className="bg-[#FDFAF4] border-b border-black/[0.09] px-20 py-10">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Find your match</p>
        <h1 className="text-[38px] font-black tracking-[-1.5px] text-[#1A1410] leading-[1.05] mb-4">
          Connections <span className="text-[#252840]">for you</span>
        </h1>

        {/* Search */}
        <div className="flex gap-3 max-w-[680px]">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-[#7A6E5C]" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5"/>
              <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full pl-9 pr-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
            />
          </div>
          <input
            value={filterSkill}
            onChange={e => setFilterSkill(e.target.value)}
            placeholder="Filter by skill..."
            className="w-[200px] px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
          />
        </div>
      </div>

      {/* Cards */}
      <div className="px-20 py-8 flex flex-col gap-4">
        {filtered.length === 0 && (
          <div className="text-center py-20 text-[#7A6E5C]">
            <div className="text-[48px] mb-4">🔍</div>
            <p className="text-[16px] font-semibold">No profiles match your search</p>
          </div>
        )}

        {filtered.map(u => (
          <div
            key={u.id}
            onClick={() => navigate(`/user/${u.id}`)}
            className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(26,20,16,0.08)] transition-all group"
          >
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-[22px] text-white"
                style={{ background: u.color }}>
                {u.initials}
              </div>
              {u.dispo && (
                <div className="absolute bottom-0 right-0 w-4 h-4 rounded-full bg-[#3D5C28] border-2 border-[#FDFAF4]" title="Available now" />
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-[16px] font-bold text-[#1A1410] group-hover:text-[#252840] transition-all">{u.name}</span>
                <span className="text-[12px] text-[#7A6E5C]">{u.age} y.o. · {u.city}</span>
                {u.dispo && <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-[#E4EED8] text-[#3D5C28]">Available</span>}
                <span className="ml-auto text-[13px] font-bold text-[#252840]">{u.score}% match</span>
              </div>

              <p className="text-[13px] text-[#7A6E5C] leading-[1.5] mb-3 line-clamp-1">{u.bio}</p>

              <div className="flex gap-6 items-center">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C]">Teaches</span>
                  <div className="flex gap-[5px]">
                    {u.teaches.map(t => (
                      <span key={t.l} className={`px-[9px] py-[3px] rounded-full text-[11px] font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C]">Wants to learn</span>
                  <div className="flex gap-[5px]">
                    {u.wants.map(t => (
                      <span key={t.l} className={`px-[9px] py-[3px] rounded-full text-[11px] font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action */}
            <div className="flex-shrink-0" onClick={e => e.stopPropagation()}>
              {requested.has(u.id) ? (
                <div className="px-5 py-[10px] rounded-xl bg-[#E4EED8] text-[#3D5C28] text-[13px] font-bold">
                  ✓ Request sent
                </div>
              ) : (
                <button
                  onClick={e => handleRequest(e, u.id)}
                  className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all whitespace-nowrap"
                >
                  Request connection
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </main>
  )
}