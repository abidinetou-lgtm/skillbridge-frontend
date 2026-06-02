// src/pages/HomePage.jsx
// Page d'accueil complète — Hero, How it works, Matches, Feed
// Les données sont en dur pour l'instant — Dev 2 les remplacera par de vrais appels API
 
import { useState, useEffect, useRef } from 'react'
import Footer from '../components/Footer'
import useAuthStore from '../store/authStore'
 
// ─── DONNÉES (temporaires — seront remplacées par l'API) ───────────────────
const MATCHES = [
  {
    id: 'la', initials: 'LA', color: '#252840',
    name: 'Léa Arnaud', meta: 'Paris · 19 y.o. · Available now',
    teaches: [{ label: 'Maths', style: 'sand' }, { label: 'Piano', style: 'sand' }],
    learns:  [{ label: 'English', style: 'night' }],
    score: 92,
  },
  {
    id: 'km', initials: 'KM', color: '#C8864B',
    name: 'Kenji Matsuda', meta: 'Lyon · 22 y.o. · Available now',
    teaches: [{ label: 'Japanese', style: 'warm' }, { label: 'Design', style: 'warm' }],
    learns:  [{ label: 'French', style: 'sage' }],
    score: 78,
  },
  {
    id: 'so', initials: 'SO', color: '#3D5C28',
    name: 'Sara Okonkwo', meta: 'Marseille · 20 y.o. · Available now',
    teaches: [{ label: 'English', style: 'sage' }, { label: 'Cooking', style: 'sage' }],
    learns:  [{ label: 'Spanish', style: 'night' }],
    score: 71,
  },
]
 
const POSTS = [
  {
    id: 1, initials: 'LA', color: '#252840',
    author: 'Léa Arnaud', time: '2h ago',
    text: 'First math session — finally understood derivatives! Thank you SkillBridge.',
    tags: [{ label: 'Maths', style: 'sand' }, { label: 'Session', style: 'night' }],
    likes: 24, comments: 5,
  },
  {
    id: 2, initials: 'KM', color: '#C8864B',
    author: 'Kenji Matsuda', time: '5h ago',
    text: 'Learned homemade ramen in exchange for a Japanese lesson. Best deal ever.',
    tags: [{ label: 'Japanese', style: 'warm' }, { label: 'Cooking', style: 'warm' }],
    likes: 41, comments: 12,
  },
  {
    id: 3, initials: 'SO', color: '#3D5C28',
    author: 'Sara Okonkwo', time: 'Yesterday',
    text: '60 credits earned this week — 3 English sessions given. Love this system!',
    tags: [{ label: 'English', style: 'sage' }, { label: 'Credits', style: 'sage' }],
    likes: 18, comments: 3,
  },
  {
    id: 4, initials: 'TR', color: '#363B6B',
    author: 'Thomas R.', time: '2 days ago',
    text: 'Matched with 3 people this week. Group learning is something else — highly recommended.',
    tags: [{ label: 'Match x3', style: 'night' }],
    likes: 33, comments: 7,
  },
  {
    id: 5, initials: 'AM', color: '#B07030',
    author: 'Amira M.', time: '3 days ago',
    text: 'Taught Arabic calligraphy, learned guitar chords. This platform is genuinely magic.',
    tags: [{ label: 'Arabic', style: 'warm' }, { label: 'Guitar', style: 'sand' }],
    likes: 56, comments: 9,
  },
]
 
// ─── STYLE DES TAGS ────────────────────────────────────────────────────────
const tagStyles = {
  sand:  'bg-[#FAF5E8]  text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8]  text-[#252840]',
  sage:  'bg-[#E4EED8]  text-[#3D5C28]',
  warm:  'bg-[#F8EDD8]  text-[#8C5A1E]',
}
 
function Tag({ label, style }) {
  return (
    <span className={`px-[11px] py-1 rounded-full text-xs font-semibold ${tagStyles[style] ?? tagStyles.sand}`}>
      {label}
    </span>
  )
}
 
// ─── CAROUSEL ──────────────────────────────────────────────────────────────
// Les 4 images Gemini que tu as générées — à mettre dans public/
const HERO_IMAGES = [
  { src: '/hero-1.png', alt: 'SkillBridge — exchange skills' },
  { src: '/hero-2.png', alt: 'Video call learning session' },
  { src: '/hero-3.png', alt: 'Find your match on mobile' },
  { src: '/hero-4.png', alt: 'Match found — grow together' },
]
 
function HeroCarousel() {
  const [current, setCurrent] = useState(0)
  const total = HERO_IMAGES.length
 
  const goTo = (i) => setCurrent((i + total) % total)
 
  // Auto-avance toutes les 4 secondes
  useEffect(() => {
    const timer = setInterval(() => goTo(current + 1), 4000)
    return () => clearInterval(timer)
  }, [current])
 
  return (
    <div className="relative w-full h-full overflow-hidden bg-[#FAF5E8]">
      {/* Slides */}
      <div
        className="flex h-full transition-transform duration-[600ms] ease-[cubic-bezier(0.4,0,0.2,1)]"
        style={{ transform: `translateX(-${current * 100}%)` }}
      >
        {HERO_IMAGES.map((img, i) => (
          <div key={i} className="min-w-full h-full flex items-center justify-center flex-shrink-0 overflow-hidden">
            <img src={img.src} alt={img.alt} className="w-full h-full object-cover object-center" />
          </div>
        ))}
      </div>
 
      {/* Flèches */}
      <button
        onClick={() => goTo(current - 1)}
        className="absolute left-3 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[rgba(248,244,234,0.88)] border-none cursor-pointer flex items-center justify-center z-10 backdrop-blur-sm hover:bg-white transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        onClick={() => goTo(current + 1)}
        className="absolute right-3 top-1/2 -translate-y-1/2 w-[38px] h-[38px] rounded-full bg-[rgba(248,244,234,0.88)] border-none cursor-pointer flex items-center justify-center z-10 backdrop-blur-sm hover:bg-white transition-all"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path d="M6 3l5 5-5 5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
 
      {/* Dots */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-[7px] z-10">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`w-[7px] h-[7px] rounded-full border-none cursor-pointer transition-all ${
              i === current ? 'bg-[#252840] scale-110' : 'bg-[rgba(26,20,16,0.25)]'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
 
// ─── TINDER CARDS ─────────────────────────────────────────────────────────
function MatchCards() {
  // positions : 0 = dessus (centré), 1 = derrière à droite, 2 = derrière à gauche
  const [positions, setPositions] = useState([0, 1, 2])
  const [animatingOut, setAnimatingOut] = useState(null) // { index, direction }
 
  const getStyle = (pos) => {
    if (pos === 0) return {
      transform: 'translateX(-50%) rotate(0deg)',
      zIndex: 3, opacity: 1,
      boxShadow: '0 8px 40px rgba(26,20,16,0.12)',
      pointerEvents: 'all',
      transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s',
    }
    if (pos === 1) return {
      transform: 'translateX(-34%) rotate(4deg)',
      zIndex: 2, opacity: 0.75,
      boxShadow: '0 4px 20px rgba(26,20,16,0.07)',
      pointerEvents: 'none',
      transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s',
    }
    return {
      transform: 'translateX(-66%) rotate(-4deg)',
      zIndex: 1, opacity: 0.5,
      boxShadow: '0 2px 10px rgba(26,20,16,0.04)',
      pointerEvents: 'none',
      transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s',
    }
  }
 
  const swipe = () => {
    // Trouver la carte du dessus (pos === 0)
    const topIndex = positions.indexOf(0)
    // Direction aléatoire
    const dir = Math.random() > 0.5 ? 1 : -1
 
    setAnimatingOut({ index: topIndex, dir })
 
    setTimeout(() => {
      setAnimatingOut(null)
      // Rotation des positions : 0→2, 1→0, 2→1
      setPositions(prev => prev.map(p => (p - 1 + 3) % 3))
    }, 440)
  }
 
  return (
    <div className="relative h-[340px] flex items-center justify-center overflow-visible mb-6">
      {MATCHES.map((match, i) => {
        const pos = positions[i]
        const isAnimOut = animatingOut?.index === i
        const outDir = animatingOut?.dir ?? 1
 
        const style = isAnimOut
          ? {
              transform: `translateX(${outDir > 0 ? '150%' : '-150%'}) rotate(${outDir > 0 ? '18deg' : '-18deg'})`,
              zIndex: 10, opacity: 0,
              transition: 'transform 0.42s cubic-bezier(0.4,0,0.2,1), opacity 0.42s',
              pointerEvents: 'none',
            }
          : getStyle(pos)
 
        return (
          <div
            key={match.id}
            style={{ ...style, position: 'absolute', left: '50%', width: '580px', maxWidth: 'calc(100vw - 24px)' }}
            className="bg-[#FDFAF4] border border-black/[0.09] rounded-[20px] px-9 py-8 flex items-center gap-6"
          >
            {/* Avatar */}
            <div
              className="w-[72px] h-[72px] rounded-full flex items-center justify-center font-black text-[26px] text-white flex-shrink-0"
              style={{ background: match.color }}
            >
              {match.initials}
            </div>
 
            {/* Info */}
            <div className="flex-1 min-w-0">
              <div className="text-xl font-extrabold tracking-tight text-[#1A1410]">{match.name}</div>
              <div className="text-xs text-[#7A6E5C] mt-[3px]">{match.meta}</div>
 
              <div className="flex gap-4 mt-4 flex-wrap">
                <div>
                  <div className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-[5px]">Teaches</div>
                  <div className="flex gap-[5px] flex-wrap">
                    {match.teaches.map(t => <Tag key={t.label} {...t} />)}
                  </div>
                </div>
                <div>
                  <div className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-[5px]">Wants to learn</div>
                  <div className="flex gap-[5px] flex-wrap">
                    {match.learns.map(t => <Tag key={t.label} {...t} />)}
                  </div>
                </div>
              </div>
 
              {/* Barre de match */}
              <div className="flex items-center gap-[10px] mt-4">
                <div className="flex-1 h-[5px] bg-[#EDE8DE] rounded-full">
                  <div className="h-full bg-[#252840] rounded-full" style={{ width: `${match.score}%` }} />
                </div>
                <div className="text-[13px] font-bold text-[#252840] min-w-[80px] text-right">
                  {match.score}% match
                </div>
              </div>
            </div>
 
            {/* Boutons */}
            <div className="flex flex-col gap-[10px] flex-shrink-0">
              <button
                onClick={swipe}
                className="px-[26px] py-[13px] rounded-[10px] border-none bg-[#252840] text-white text-[13px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all whitespace-nowrap font-inter"
              >
                Connect
              </button>
              <button
                onClick={swipe}
                className="px-[26px] py-3 rounded-[10px] border-[1.5px] border-black/[0.09] bg-transparent text-[#7A6E5C] text-[13px] font-semibold cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all whitespace-nowrap font-inter"
              >
                Skip
              </button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
 
// ─── FEED SCROLLABLE ───────────────────────────────────────────────────────
function FeedScroll() {
  const trackRef = useRef(null)
 
  const scroll = (dir) => {
    trackRef.current?.scrollBy({ left: dir * 312, behavior: 'smooth' })
  }
 
  return (
    <>
      <div
        ref={trackRef}
        className="flex gap-4 overflow-x-auto pb-4 [scroll-snap-type:x_mandatory] [scrollbar-width:none] [-ms-overflow-style:none]"
        style={{ scrollbarWidth: 'none' }}
      >
        {POSTS.map(post => (
          <div
            key={post.id}
            className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-lg flex-shrink-0 w-[280px] [scroll-snap-align:start]"
          >
            {/* Thumbnail illustrée */}
            <div className="h-[148px] flex items-center justify-center bg-[#EEEADE]">
              <PostIllustration index={post.id} />
            </div>
            <div className="p-[14px] flex flex-col gap-2">
              {/* Auteur */}
              <div className="flex gap-2 items-center">
                <div
                  className="w-[26px] h-[26px] rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0"
                  style={{ background: post.color }}
                >
                  {post.initials}
                </div>
                <span className="text-[12.5px] font-semibold text-[#1A1410]">{post.author}</span>
                <span className="text-[10px] text-[#7A6E5C] ml-auto">{post.time}</span>
              </div>
              <p className="text-[13px] text-[#3D3020] leading-[1.5]">{post.text}</p>
              <div className="flex gap-[5px] flex-wrap">
                {post.tags.map(t => <Tag key={t.label} label={t.label} style={t.style} />)}
              </div>
              <div className="flex gap-3">
                <span className="flex items-center gap-1 text-[11px] text-[#7A6E5C] font-medium">
                  <HeartIcon /> {post.likes}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-[#7A6E5C] font-medium">
                  <CommentIcon /> {post.comments}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
 
      <div className="flex gap-[10px] mt-5">
        <button onClick={() => scroll(-1)}
          className="px-4 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-xs font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:bg-[#1A1410] hover:text-white transition-all font-inter">
          ← Previous
        </button>
        <button onClick={() => scroll(1)}
          className="px-4 py-2 rounded-lg border-[1.5px] border-black/[0.09] text-xs font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:bg-[#1A1410] hover:text-white transition-all font-inter">
          Next →
        </button>
        <a href="/feed"
          className="ml-auto px-[14px] py-[7px] border-[1.5px] border-[rgba(37,40,100,0.2)] rounded-lg text-xs font-bold text-[#252840] no-underline hover:bg-[#252840] hover:text-white transition-all flex-shrink-0">
          Open feed
        </a>
      </div>
    </>
  )
}
 
// ─── PAGE PRINCIPALE ───────────────────────────────────────────────────────
export default function HomePage() {
  const { openModal } = useAuthStore()
 
  return (
    <main>
      {/* ── HERO ── */}
      <section className="pt-[62px] min-h-screen flex flex-col md:grid md:grid-cols-2 overflow-hidden">
 
        {/* Gauche — texte */}
        <div className="px-6 md:px-20 py-12 md:py-[72px] flex flex-col justify-center gap-7 md:gap-9">
          {/* Titre 3D Inter 900 */}
          <h1 className="font-black text-[clamp(36px,8vw,92px)] leading-[1.0] tracking-[-2px] md:tracking-[-3px] text-[#1A1410] pb-[6px]">
            <span className="block">
              Teach<span className="inline-block w-[0.22em]" />
              <span className="text-[#C8864B]">what</span>
            </span>
            <span className="block">
              <span className="text-[#C8864B]">you</span>
              <span className="inline-block w-[0.22em]" />
              <span className="text-[#252840]">know.</span>
            </span>
            <span className="block">
              Learn<span className="inline-block w-[0.22em]" />
              <span className="text-[#252840]">what</span>
            </span>
            <span className="block">
              <span className="text-[#C8864B]">you</span>
              <span className="inline-block w-[0.22em]" />
              love.
            </span>
          </h1>
 
          <p className="text-[16px] leading-[1.68] text-[#7A6E5C] max-w-[380px]">
            Good at math, want to learn English?<br/>
            SkillBridge connects you with someone who<br/>
            <strong className="text-[#1A1410] font-bold">teaches what you need</strong> and{' '}
            <strong className="text-[#1A1410] font-bold">needs what you teach</strong> .<br/>
            no numbers, no socials shared.
          </p>
 
          <div className="flex gap-3 items-center">
            <button
              onClick={() => openModal('register')}
              className="px-[30px] py-[14px] rounded-[10px] border-none bg-[#252840] text-white text-[15px] font-bold cursor-pointer hover:bg-[#363B6B] hover:-translate-y-[2px] hover:shadow-[0_8px_28px_rgba(37,40,64,0.24)] transition-all font-inter"
            >
              Find my match
            </button>
            <button className="px-6 py-[14px] rounded-[10px] border-[1.5px] border-black/[0.09] text-[15px] font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all font-inter">
              How it works
            </button>
          </div>
        </div>
 
        {/* Droite — carousel (caché sur mobile) */}
        <div className="hidden md:block relative overflow-hidden bg-[#FAF5E8]">
          <HeroCarousel />
        </div>
      </section>
 
      {/* ── HOW IT WORKS ── */}
      <section className="bg-[#1A1410] px-6 md:px-20 py-12 md:py-20" id="how">
        <p className="text-[11px] font-bold tracking-[1.5px] uppercase text-[#C8864B] mb-3">How it works</p>
        <h2 className="text-[38px] font-black tracking-[-1.5px] text-white leading-[1.05] mb-14">
          Four steps to your<br/>first skill exchange.
        </h2>
 
        <div className="flex flex-col divide-y divide-white/[0.07]">
          {[
            {
              num: '01', title: 'Build your profile', img: '/how-1.png', alt: 'Build profile',
              desc: 'Add the skills you can teach and the ones you want to learn. Set your availability and write a short bio. The more complete your profile, the better your matches.',
              right: false,
            },
            {
              num: '02', title: 'Get matched', img: '/how-2.png', alt: 'Get matched',
              desc: 'Our algorithm finds people whose skills perfectly mirror yours. You can even match in a group of three — A teaches B, B teaches C, C teaches A.',
              right: true,
            },
            {
              num: '03', title: 'Chat and learn', img: '/how-3.png', alt: 'Chat and learn',
              desc: 'Connect by text or voice call — entirely inside SkillBridge. No phone numbers, no Instagram handles. Everything stays on the platform, always.',
              right: false,
            },
            {
              num: '04', title: 'Earn credits & grow', img: '/how-4.png', alt: 'Earn credits',
              desc: 'Every session you teach earns credits. Use those credits to learn. Rate each other, earn badges, and build a reputation that attracts better matches.',
              right: true,
            },
          ].map((step) => (
            <div
              key={step.num}
              className={`grid grid-cols-1 md:grid-cols-2 overflow-hidden ${step.right ? 'md:[direction:rtl]' : ''}`}
            >
              <div className={`hidden md:flex relative min-h-[320px] items-center justify-center bg-white/[0.03] overflow-hidden ${step.right ? '[direction:ltr]' : ''}`}>
                <span className="absolute top-5 left-5 text-[11px] font-bold tracking-[1px] uppercase text-white/35 bg-white/[0.06] px-[10px] py-1 rounded-full">
                  Step {step.num}
                </span>
                <img src={step.img} alt={step.alt} className="w-full h-full object-cover opacity-[0.92]" />
              </div>
              <div className={`px-12 py-[52px] flex flex-col justify-center gap-4 ${step.right ? '[direction:ltr]' : ''}`}>
                <div className="text-[64px] font-black tracking-[-3px] text-white/[0.05] leading-none -mb-2">{step.num}</div>
                <h3 className="text-[26px] font-black tracking-[-0.8px] text-white">{step.title}</h3>
                <p className="text-[14.5px] text-white/[0.48] leading-[1.7] max-w-[380px]">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
 
      {/* ── YOUR MATCHES TODAY ── */}
      <section className="px-6 md:px-20 py-12 md:py-[72px]" id="matches">
        <div className="flex items-end justify-between gap-5 mb-9">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Suggested for you</p>
            <h2 className="text-[32px] font-black tracking-[-1.2px] text-[#1A1410] leading-[1.05]">
              Your <span className="text-[#252840]">matches</span> today
            </h2>
            <p className="text-[14px] text-[#7A6E5C] leading-[1.65] max-w-[420px] mt-[5px]">
              Profiles selected based on your skills and what you want to learn.
            </p>
          </div>
          <a href="/match"
            className="text-xs font-bold text-[#252840] no-underline whitespace-nowrap px-[14px] py-[7px] border-[1.5px] border-[rgba(37,40,100,0.2)] rounded-lg hover:bg-[#252840] hover:text-white transition-all flex-shrink-0">
            Browse all profiles
          </a>
        </div>
 
        <MatchCards />
      </section>
 
      <div className="h-px bg-black/[0.09] mx-6 md:mx-20" />
 
      {/* ── WHAT MEMBERS SHARE ── */}
      <section className="px-6 md:px-20 py-12 md:py-[72px]" id="feed">
        <div className="flex items-end justify-between gap-5 mb-9">
          <div>
            <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Community</p>
            <h2 className="text-[32px] font-black tracking-[-1.2px] text-[#1A1410] leading-[1.05]">
              What members <span className="text-[#252840]">share</span>
            </h2>
            <p className="text-[14px] text-[#7A6E5C] leading-[1.65] max-w-[420px] mt-[5px]">
              Progress, tips and discoveries from the SkillBridge community.
            </p>
          </div>
          <a href="/feed"
            className="text-xs font-bold text-[#252840] no-underline whitespace-nowrap px-[14px] py-[7px] border-[1.5px] border-[rgba(37,40,100,0.2)] rounded-lg hover:bg-[#252840] hover:text-white transition-all flex-shrink-0">
            Open feed
          </a>
        </div>
 
        <FeedScroll />
      </section>
 
      <Footer />
    </main>
  )
}
 
// ─── PETITES ILLUSTRATIONS SVG pour les posts ─────────────────────────────
function PostIllustration({ index }) {
  const bgs = ['#EEEADE','#F2E8D2','#E6F0DA','#EAE6F5','#FAF0E2']
  const bg = bgs[(index - 1) % bgs.length]
  return (
    <div style={{ background: bg, width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg width="88" height="88" viewBox="0 0 88 88" fill="none">
        <rect x="14" y="16" width="42" height="52" rx="5" fill="#D4C9A0" opacity=".4"/>
        <path d="M22 33h26M22 42h20M22 51h24" stroke="#3D3020" strokeWidth="2" strokeLinecap="round"/>
        <circle cx="66" cy="64" r="13" fill="#3D5C28" opacity=".14"/>
        <path d="M62 64l3.5 3.5 6.5-6.5" stroke="#3D5C28" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    </div>
  )
}
 
function HeartIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M7 12s-6-3.5-6-7a3 3 0 016 0 3 3 0 016 0c0 3.5-6 7-6 7z" strokeLinejoin="round"/>
    </svg>
  )
}
 
function CommentIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M1 1h12v8H8l-1 4-1-4H1z" strokeLinejoin="round"/>
    </svg>
  )
}