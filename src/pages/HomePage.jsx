import { Link } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const HERO_IMAGES = [
  { src: '/hero-1.png', alt: 'SkillBridge exchange skills' },
  { src: '/hero-2.png', alt: 'Video call learning session' },
  { src: '/hero-3.png', alt: 'Find your match on mobile' },
  { src: '/hero-4.png', alt: 'Match found' },
]

export default function HomePage() {
  const { user, openModal } = useAuthStore()

  return (
    <main>
      <section className="pt-[62px] min-h-screen grid grid-cols-2 overflow-hidden">
        <div className="px-20 py-[72px] flex flex-col justify-center gap-9">
          <h1 className="font-black text-[clamp(52px,6.5vw,92px)] leading-[1.0] tracking-[-3px] text-[#1A1410] pb-[6px]">
            <span className="block">Teach <span className="text-[#C8864B]">what</span></span>
            <span className="block"><span className="text-[#C8864B]">you</span> <span className="text-[#252840]">know.</span></span>
            <span className="block">Learn <span className="text-[#252840]">what</span></span>
            <span className="block"><span className="text-[#C8864B]">you</span> love.</span>
          </h1>

          <p className="text-[16px] leading-[1.68] text-[#7A6E5C] max-w-[380px]">
            SkillBridge now uses real authentication, profiles, learning goals, and match suggestions from the backend.
          </p>

          <div className="flex gap-3 items-center">
            {user ? (
              <Link to="/connection" className="px-[30px] py-[14px] rounded-[10px] border-none bg-[#252840] text-white text-[15px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter no-underline">
                Find my match
              </Link>
            ) : (
              <button onClick={() => openModal('register')} className="px-[30px] py-[14px] rounded-[10px] border-none bg-[#252840] text-white text-[15px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter">
                Create account
              </button>
            )}
            <Link to="/feed" className="px-6 py-[14px] rounded-[10px] border-[1.5px] border-black/[0.09] text-[15px] font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all font-inter no-underline">
              Community
            </Link>
          </div>
        </div>

        <div className="relative overflow-hidden bg-[#FAF5E8]">
          <img src={HERO_IMAGES[0].src} alt={HERO_IMAGES[0].alt} className="w-full h-full object-cover object-center" />
        </div>
      </section>

      <section className="px-20 py-[72px] bg-[#F8F4EA]">
        <div className="grid grid-cols-3 gap-5">
          {[
            ['Profile', 'Real profile data is loaded from /users/me.'],
            ['Matching', 'Suggestions are loaded from /matches/suggestions.'],
            ['Requests', 'Connection requests persist through the backend match table.'],
          ].map(([title, text]) => (
            <div key={title} className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6">
              <h2 className="text-[18px] font-black text-[#1A1410] mb-2">{title}</h2>
              <p className="text-[13px] text-[#7A6E5C] leading-[1.6]">{text}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
