// src/pages/Credits.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const PACKS = [
  { id:'starter', label:'Starter',  credits:60,  price:'4.99',  hours:'1h',  color:'#E4EED8', text:'#3D5C28', popular:false },
  { id:'plus',    label:'Plus',     credits:180, price:'9.99',  hours:'3h',  color:'#ECEEF8', text:'#252840', popular:true  },
  { id:'pro',     label:'Pro',      credits:360, price:'17.99', hours:'6h',  color:'#F8EDD8', text:'#8C5A1E', popular:false },
  { id:'max',     label:'Max',      credits:720, price:'29.99', hours:'12h', color:'#F0ECFA', text:'#5C3D8C', popular:false },
]

export default function Credits() {
  const navigate   = useNavigate()
  const { user }   = useAuthStore()
  const [selected, setSelected] = useState('plus')
  const [paid, setPaid]         = useState(false)

  const pack = PACKS.find(p => p.id === selected)

  const handleBuy = () => {
    // TODO (Dev 3): appeler POST /api/credits/buy avec { packId: selected }
    setPaid(true)
  }

  if (paid) return (
    <main className="pt-[62px] min-h-screen bg-white flex items-center justify-center">
      <div className="bg-[#FDFAF4] rounded-2xl border border-black/[0.09] p-10 max-w-[420px] w-full text-center flex flex-col items-center gap-4">
        <div className="w-16 h-16 rounded-full bg-[#3D5C28]/20 flex items-center justify-center">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#3D5C28" strokeWidth="2.5" strokeLinecap="round">
            <path d="M5 14l6 6L23 8"/>
          </svg>
        </div>
        <h2 className="text-[24px] font-black text-[#1A1410]">Credits added!</h2>
        <p className="text-[14px] text-[#7A6E5C]">
          <strong>{pack.credits} credits</strong> ({pack.hours}) have been added to your account.
        </p>
        <div className="bg-[#E4EED8] rounded-xl px-6 py-3 text-[13px] font-semibold text-[#3D5C28]">
          {(user?.credits ?? 120) + pack.credits} crédits disponibles
        </div>
        <button onClick={() => navigate('/profile')}
          className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all mt-2">
          Go to my profile
        </button>
      </div>
    </main>
  )

  return (
    <main className="pt-[62px] min-h-screen bg-white">
      <div className="bg-white border-b border-black/[0.09] px-20 py-10">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Buy credits</p>
        <h1 className="text-[38px] font-black tracking-[-1.5px] text-[#1A1410] leading-[1.05] mb-1">
          Top up your <span className="text-[#252840]">credits</span>
        </h1>
        <p className="text-[14px] text-[#7A6E5C]">1 crédit = 1 minute d'apprentissage. Vous avez <strong>{user?.credits ?? 120} crédits</strong></p>
      </div>

      <div className="px-20 py-10 max-w-[900px]">
        {/* Pack selector */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {PACKS.map(p => (
            <div key={p.id} onClick={() => setSelected(p.id)}
              className={`relative rounded-2xl p-5 cursor-pointer border-[2px] transition-all
                ${selected === p.id ? 'border-[#252840] shadow-[0_4px_24px_rgba(37,40,64,0.12)]' : 'border-black/[0.09] hover:border-[#252840]/40'}`}
              style={{ background: p.color }}>
              {p.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#C8864B] text-white text-[10px] font-bold px-3 py-[3px] rounded-full whitespace-nowrap">
                  Most popular
                </span>
              )}
              <p className="text-[13px] font-bold mb-1" style={{ color: p.text }}>{p.label}</p>
              <p className="text-[28px] font-black" style={{ color: p.text }}>{p.credits}</p>
              <p className="text-[11px] font-semibold mb-3" style={{ color: p.text }}>credits · {p.hours}</p>
              <p className="text-[18px] font-black" style={{ color: p.text }}>€{p.price}</p>
            </div>
          ))}
        </div>

        {/* Summary + pay */}
        <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6 max-w-[420px] flex flex-col gap-4">
          <h3 className="text-[15px] font-black text-[#1A1410]">Order summary</h3>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#7A6E5C]">{pack.label} pack — {pack.credits} credits</span>
            <span className="font-bold text-[#1A1410]">€{pack.price}</span>
          </div>
          <div className="flex justify-between text-[13px]">
            <span className="text-[#7A6E5C]">Learning time</span>
            <span className="font-bold text-[#1A1410]">{pack.hours}</span>
          </div>
          <div className="border-t border-black/[0.07] pt-3 flex justify-between text-[14px] font-black">
            <span>Total</span>
            <span>€{pack.price}</span>
          </div>
          <button onClick={handleBuy}
            className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
            Buy {pack.credits} credits →
          </button>
          <p className="text-[11px] text-[#7A6E5C] text-center">Secure payment · No subscription · Credits never expire</p>
        </div>
      </div>
    </main>
  )
}
