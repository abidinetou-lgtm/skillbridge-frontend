// src/pages/Match.jsx
import { useState } from 'react'
import useAuthStore from '../store/authStore'

const TAG_STYLES = {
  sand:  'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8] text-[#252840]',
  sage:  'bg-[#E4EED8] text-[#3D5C28]',
  warm:  'bg-[#F8EDD8] text-[#8C5A1E]',
}

const ALL_MATCHES = [
  { id:'la', initials:'LA', color:'#252840', name:'Léa Arnaud',    meta:'Paris · 19 y.o.',    dispo:true,  teaches:[{l:'Maths',s:'sand'},{l:'Piano',s:'sand'}],       learns:[{l:'English',s:'night'}],  score:92 },
  { id:'km', initials:'KM', color:'#C8864B', name:'Kenji Matsuda', meta:'Lyon · 22 y.o.',     dispo:true,  teaches:[{l:'Japanese',s:'warm'},{l:'Design',s:'warm'}],    learns:[{l:'French',s:'sage'}],    score:78 },
  { id:'so', initials:'SO', color:'#3D5C28', name:'Sara Okonkwo',  meta:'Marseille · 20 y.o.',dispo:true,  teaches:[{l:'English',s:'sage'},{l:'Cooking',s:'sage'}],    learns:[{l:'Spanish',s:'night'}],  score:71 },
  { id:'pd', initials:'PD', color:'#4E6035', name:'Paul Dumont',   meta:'Bordeaux · 21 y.o.', dispo:false, teaches:[{l:'Python',s:'sage'},{l:'Maths',s:'sage'}],        learns:[{l:'Guitar',s:'warm'}],    score:68 },
  { id:'cl', initials:'CL', color:'#363B6B', name:'Camille L.',    meta:'Paris · 23 y.o.',    dispo:true,  teaches:[{l:'French',s:'night'},{l:'Writing',s:'night'}],   learns:[{l:'Piano',s:'sand'}],     score:65 },
  { id:'rn', initials:'RN', color:'#C8864B', name:'Ryo Nakamura',  meta:'Lyon · 25 y.o.',     dispo:false, teaches:[{l:'Piano',s:'warm'},{l:'Guitar',s:'warm'}],        learns:[{l:'Maths',s:'sand'}],     score:61 },
]

export default function Match() {
  const { openModal, user } = useAuthStore()
  const [cards, setCards] = useState(ALL_MATCHES)
  const [animOut, setAnimOut] = useState(null)
  const [connected, setConnected] = useState(new Set())
  const [filterDispo, setFilterDispo] = useState(false)

  const displayed = filterDispo ? cards.filter(c => c.dispo) : cards

  const swipe = (id, accept) => {
    setAnimOut({ id, dir: accept ? 1 : -1 })
    setTimeout(() => {
      setAnimOut(null)
      setCards(prev => {
        const removed = prev.find(c => c.id === id)
        return [...prev.filter(c => c.id !== id), removed]
      })
      if (accept) setConnected(prev => new Set([...prev, id]))
    }, 420)
  }

  const top = displayed[0]
  const behind = displayed.slice(1, 3)

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">

      {/* Header */}
      <div className="bg-[#FDFAF4] border-b border-black/[0.09] px-20 py-10">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Suggested for you</p>
        <div className="flex items-end justify-between">
          <div>
            <h1 className="text-[38px] font-black tracking-[-1.5px] text-[#1A1410] leading-[1.05]">
              Find your <span className="text-[#252840]">match</span>
            </h1>
            <p className="text-[14px] text-[#7A6E5C] mt-2">Connect with people whose skills perfectly mirror yours.</p>
          </div>
          <button
            onClick={() => setFilterDispo(p => !p)}
            className={`px-4 py-2 rounded-full text-[13px] font-semibold border-[1.5px] transition-all cursor-pointer
              ${filterDispo ? 'bg-[#3D5C28] text-white border-[#3D5C28]' : 'bg-transparent text-[#7A6E5C] border-black/[0.09] hover:border-[#3D5C28] hover:text-[#3D5C28]'}`}
          >
            {filterDispo ? '● Available now' : '○ Show available only'}
          </button>
        </div>
      </div>

      <div className="px-20 py-12 grid grid-cols-[1fr_380px] gap-12 items-start">

        {/* Card stack */}
        <div>
          <div className="relative h-[380px] flex items-center justify-center overflow-visible mb-6">
            {/* Cards behind */}
            {behind.map((m, i) => (
              <div key={m.id} className="absolute left-1/2 w-[580px] max-w-[90vw] bg-[#FDFAF4] border border-black/[0.09] rounded-[20px] px-9 py-8 flex items-center gap-6"
                style={{
                  transform: i === 0 ? 'translateX(-34%) rotate(4deg)' : 'translateX(-66%) rotate(-4deg)',
                  zIndex: i === 0 ? 2 : 1,
                  opacity: i === 0 ? 0.72 : 0.45,
                  boxShadow: i === 0 ? '0 4px 20px rgba(26,20,16,0.07)' : 'none',
                  pointerEvents: 'none',
                  transition: 'all 0.45s cubic-bezier(0.4,0,0.2,1)',
                }}
              >
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-black text-[26px] text-white flex-shrink-0" style={{ background: m.color }}>{m.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-xl font-extrabold tracking-tight text-[#1A1410]">{m.name}</div>
                  <div className="text-xs text-[#7A6E5C] mt-1">{m.meta}</div>
                </div>
              </div>
            ))}

            {/* Top card */}
            {top && (
              <div key={top.id} className="absolute left-1/2 w-[580px] max-w-[90vw] bg-[#FDFAF4] border border-black/[0.09] rounded-[20px] px-9 py-8 flex items-center gap-6"
                style={{
                  transform: animOut?.id === top.id
                    ? `translateX(${animOut.dir > 0 ? '150%' : '-150%'}) rotate(${animOut.dir > 0 ? '18deg' : '-18deg'})`
                    : 'translateX(-50%) rotate(0deg)',
                  zIndex: 3,
                  opacity: animOut?.id === top.id ? 0 : 1,
                  boxShadow: '0 8px 40px rgba(26,20,16,0.12)',
                  transition: 'transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.42s',
                }}
              >
                <div className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-black text-[26px] text-white flex-shrink-0" style={{ background: top.color }}>{top.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="text-xl font-extrabold tracking-tight text-[#1A1410]">{top.name}</div>
                    {top.dispo && <span className="text-[10px] font-bold px-2 py-[2px] rounded-full bg-[#E4EED8] text-[#3D5C28]">Available</span>}
                  </div>
                  <div className="text-xs text-[#7A6E5C] mt-1">{top.meta}</div>
                  <div className="flex gap-4 mt-4 flex-wrap">
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-[5px]">Teaches</div>
                      <div className="flex gap-[5px]">{top.teaches.map(t => <span key={t.l} className={`px-[10px] py-1 rounded-full text-xs font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>)}</div>
                    </div>
                    <div>
                      <div className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-[5px]">Wants to learn</div>
                      <div className="flex gap-[5px]">{top.learns.map(t => <span key={t.l} className={`px-[10px] py-1 rounded-full text-xs font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <div className="flex-1 h-[5px] bg-[#EDE8DE] rounded-full">
                      <div className="h-full bg-[#252840] rounded-full" style={{ width: `${top.score}%` }} />
                    </div>
                    <span className="text-[13px] font-bold text-[#252840]">{top.score}% match</span>
                  </div>
                </div>
                <div className="flex flex-col gap-[10px] flex-shrink-0">
                  <button onClick={() => swipe(top.id, true)}
                    className="px-[26px] py-[13px] rounded-[10px] border-none bg-[#252840] text-white text-[13px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all whitespace-nowrap">
                    Connect
                  </button>
                  <button onClick={() => swipe(top.id, false)}
                    className="px-[26px] py-3 rounded-[10px] border-[1.5px] border-black/[0.09] bg-transparent text-[#7A6E5C] text-[13px] font-semibold cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all whitespace-nowrap">
                    Skip
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar — connected */}
        <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6">
          <h3 className="text-[15px] font-bold text-[#1A1410] mb-1">Your connections</h3>
          <p className="text-[12px] text-[#7A6E5C] mb-4">{connected.size} match{connected.size !== 1 ? 'es' : ''} this session</p>
          {connected.size === 0 ? (
            <div className="text-center py-8">
              <div className="text-[32px] mb-2">🤝</div>
              <p className="text-[13px] text-[#7A6E5C]">Click Connect on a card<br/>to start a conversation</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {ALL_MATCHES.filter(m => connected.has(m.id)).map(m => (
                <div key={m.id} className="flex items-center gap-3 p-3 bg-[#F8F4EA] rounded-xl">
                  <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: m.color }}>{m.initials}</div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-semibold text-[#1A1410]">{m.name}</div>
                    <div className="text-[11px] text-[#7A6E5C]">{m.score}% match</div>
                  </div>
                  <a href="/chat" className="text-[11px] font-bold text-[#252840] no-underline px-3 py-1 bg-[#ECEEF8] rounded-lg hover:bg-[#252840] hover:text-white transition-all">Chat</a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  )
}
