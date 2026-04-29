// src/pages/Profile.jsx
import { useState } from 'react'
import useAuthStore from '../store/authStore'

const TAG_STYLES = {
  sand:  'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8] text-[#252840]',
  sage:  'bg-[#E4EED8] text-[#3D5C28]',
  warm:  'bg-[#F8EDD8] text-[#8C5A1E]',
}

const MY_POSTS = [
  { id:1, text:'First math session — finally understood derivatives!', likes:24, bg:'#EEEADE', color:'#3D3020' },
  { id:2, text:'Taught English for 3 hours today. So rewarding!', likes:18, bg:'#E4EED8', color:'#3D5C28' },
  { id:3, text:'60 credits earned this week 🎉', likes:41, bg:'#ECEEF8', color:'#252840' },
  { id:4, text:'New skill added: Cooking. Let\'s swap!', likes:12, bg:'#F8EDD8', color:'#8C5A1E' },
  { id:5, text:'Session with Kenji was incredible.', likes:29, bg:'#FAF5E8', color:'#3D3020' },
  { id:6, text:'100 credits milestone reached!', likes:56, bg:'#E4EED8', color:'#3D5C28' },
]

export default function Profile() {
  const { user, openModal } = useAuthStore()
  const [tab, setTab] = useState('posts')
  const [editing, setEditing] = useState(false)
  const [dispo, setDispo] = useState(true)

  const isOwnProfile = true // Dev 2 comparera user.id avec le profil chargé

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">

      {/* Cover */}
      <div className="h-[200px] bg-gradient-to-br from-[#252840] via-[#363B6B] to-[#C8864B] relative">
        {isOwnProfile && (
          <button onClick={() => setEditing(p => !p)}
            className="absolute top-4 right-6 px-4 py-2 rounded-lg bg-white/10 border border-white/20 text-white text-[12px] font-semibold cursor-pointer hover:bg-white/20 transition-all">
            {editing ? 'Save profile' : 'Edit profile'}
          </button>
        )}
      </div>

      <div className="px-20 relative">

        {/* Avatar row */}
        <div className="flex items-end justify-between -mt-[52px] mb-6">
          <div className="relative">
            <div className="w-[104px] h-[104px] rounded-full bg-[#252840] border-4 border-[#F8F4EA] flex items-center justify-center font-black text-[36px] text-white">
              {user?.prenom?.[0] ?? 'A'}
            </div>
            {dispo && (
              <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#3D5C28] border-2 border-[#F8F4EA]" title="Available now" />
            )}
          </div>

          <div className="flex gap-3 mb-2">
            {isOwnProfile && (
              <>
                <button onClick={() => setDispo(p => !p)}
                  className={`px-4 py-2 rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                    ${dispo ? 'bg-[#E4EED8] text-[#3D5C28] border-[#3D5C28]' : 'bg-transparent text-[#7A6E5C] border-black/[0.09]'}`}>
                  {dispo ? '● Available now' : '○ Set available'}
                </button>
                <button className="px-4 py-2 rounded-full text-[12px] font-semibold border-[1.5px] border-black/[0.09] text-[#7A6E5C] cursor-pointer hover:border-[#1A1410] transition-all bg-transparent">
                  Share profile
                </button>
              </>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="grid grid-cols-[1fr_300px] gap-10 items-start">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#1A1410]">
              {user?.prenom ?? 'Alice'} {user?.nom ?? 'Martin'}
            </h1>
            <p className="text-[14px] text-[#7A6E5C] mt-1">@alice.martin · Paris, France</p>
            <p className="text-[14px] text-[#3D3020] leading-[1.6] mt-3 max-w-[520px]">
              Passionate about maths and code. I exchange my lessons for guitar or Spanish. Available in the evenings and on weekends.
            </p>

            {/* Skills */}
            <div className="flex gap-10 mt-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">I teach</p>
                <div className="flex gap-2 flex-wrap">
                  {[{l:'Maths',s:'sand'},{l:'Python',s:'sage'},{l:'English',s:'night'}].map(t => (
                    <span key={t.l} className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">I want to learn</p>
                <div className="flex gap-2 flex-wrap">
                  {[{l:'Guitar',s:'warm'},{l:'Spanish',s:'warm'}].map(t => (
                    <span key={t.l} className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 mt-8 border-b border-black/[0.09]">
              {['posts', 'sessions', 'badges'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-[13px] font-semibold capitalize border-none bg-transparent cursor-pointer transition-all border-b-2 -mb-px
                    ${tab === t ? 'text-[#252840] border-[#252840]' : 'text-[#7A6E5C] border-transparent hover:text-[#1A1410]'}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Posts grid */}
            {tab === 'posts' && (
              <div className="grid grid-cols-3 gap-3 mt-6">
                {MY_POSTS.map(p => (
                  <div key={p.id}
                    className="aspect-square rounded-xl flex items-end overflow-hidden cursor-pointer hover:scale-[1.02] transition-all relative"
                    style={{ background: p.bg }}>
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" fill="none">
                      <rect x="20" y="20" width="40" height="50" rx="4" fill={p.color}/>
                      <path d="M28 35h24M28 43h18M28 51h20" stroke={p.color} strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 to-transparent p-2">
                      <p className="text-white text-[11px] font-medium leading-[1.3] line-clamp-2">{p.text}</p>
                      <p className="text-white/70 text-[10px] mt-1">❤ {p.likes}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'sessions' && (
              <div className="mt-6 flex flex-col gap-3">
                {[
                  { partner:'Léa Arnaud', skill:'Maths → English', date:'27 Apr 2026', duration:'1h', credits:60, rating:5 },
                  { partner:'Kenji Matsuda', skill:'English → Japanese', date:'25 Apr 2026', duration:'45min', credits:45, rating:4 },
                  { partner:'Sara Okonkwo', skill:'Python → Cooking', date:'22 Apr 2026', duration:'1h30', credits:90, rating:5 },
                ].map((s, i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#FDFAF4] border border-black/[0.09] rounded-xl px-5 py-4">
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold text-[#1A1410]">{s.partner}</div>
                      <div className="text-[12px] text-[#7A6E5C]">{s.skill} · {s.date}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[13px] font-bold text-[#3D5C28]">+{s.credits} credits</div>
                      <div className="text-[11px] text-[#7A6E5C]">{s.duration} · {'⭐'.repeat(s.rating)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {tab === 'badges' && (
              <div className="mt-6 grid grid-cols-4 gap-4">
                {[
                  { label:'First session', icon:'🎯', earned:true },
                  { label:'100 credits', icon:'💰', earned:true },
                  { label:'Top teacher', icon:'⭐', earned:true },
                  { label:'Group match', icon:'🔺', earned:false },
                  { label:'200 credits', icon:'🏆', earned:false },
                  { label:'10 sessions', icon:'🔥', earned:false },
                ].map((b, i) => (
                  <div key={i} className={`flex flex-col items-center gap-2 p-4 rounded-xl border ${b.earned ? 'bg-[#FDFAF4] border-black/[0.09]' : 'bg-transparent border-dashed border-black/[0.06] opacity-40'}`}>
                    <div className="text-[32px]">{b.icon}</div>
                    <div className="text-[11px] font-semibold text-[#1A1410] text-center">{b.label}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats sidebar */}
          <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6 flex flex-col gap-4 sticky top-20">
            <h3 className="text-[14px] font-bold text-[#1A1410]">Stats</h3>
            {[
              { label:'Credits available', value:'120 ⚡', color:'#252840' },
              { label:'Sessions given',    value:'8',      color:'#3D5C28' },
              { label:'Sessions received', value:'5',      color:'#C8864B' },
              { label:'Reputation score',  value:'4.8 / 5',color:'#252840' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-[13px] text-[#7A6E5C]">{s.label}</span>
                <span className="text-[14px] font-bold" style={{ color: s.color }}>{s.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-black/[0.07]">
              <a href="/match"
                className="block w-full py-[10px] rounded-[10px] bg-[#252840] text-white text-[13px] font-bold text-center no-underline hover:bg-[#363B6B] transition-all">
                Find a match
              </a>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
