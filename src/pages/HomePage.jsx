import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import useAuthStore from '../store/authStore'

const HERO_IMAGES = [
  { src: '/Hero principal.png',  skill: 'Guitare · Piano · Musique' },
  { src: '/Hero slide 2.png',    skill: 'React · JavaScript · Code' },
  { src: '/Hero slide 3.png',    skill: 'Langues · Design · Marketing' },
]

const SKILL_PILLS = ['Guitare', 'React', 'Anglais', 'Piano', 'Photographie', 'Cuisine', 'Design', 'Yoga']

const EXCHANGES = [
  { img: '/Guitare ↔ Dev.png',       title: 'Guitare ↔ Dev Web',    text: 'Échanger ses accords contre du code.' },
  { img: '/Cuisine ↔ Photo.png',     title: 'Cuisine ↔ Photo',      text: 'Apprendre à capturer des images contre des recettes.' },
  { img: '/Langues ↔ Marketing.png', title: 'Langues ↔ Marketing',  text: "Pratique l'anglais, découvre le marketing digital." },
]

const feedPosts = [
  { color:'#252840', initials:'LA', author:'Léa Arnaud',    handle:'@lea_arnaud',
    text:"Première session de maths — j'ai enfin compris les dérivées ! Merci SkillBridge.",
    tags:['Maths','Session'],   time:'Il y a 2h' },
  { color:'#C8864B', initials:'KM', author:'Kenji Matsuda', handle:'@kenji_m',
    text:"Appris le ramen maison en échange d'une leçon de japonais. Le meilleur deal possible.",
    tags:['Japonais','Cuisine'], time:'Il y a 5h' },
  { color:'#3D5C28', initials:'SO', author:'Sara Okonkwo',  handle:'@sara_o',
    text:"60 crédits gagnés cette semaine — 3 sessions d'anglais données. J'adore ce système !",
    tags:['Anglais','Crédits'], time:'Hier' },
  { color:'#363B6B', initials:'TR', author:'Thomas R.',     handle:'@thomas_r',
    text:"Matché avec 3 personnes cette semaine. L'apprentissage en groupe c'est autre chose.",
    tags:['Match','Groupe'],    time:'Il y a 2j' },
  { color:'#B07030', initials:'AM', author:'Amira M.',      handle:'@amira_m',
    text:"Enseigné la calligraphie arabe, appris des accords de guitare. Cette plateforme est magique.",
    tags:['Arabe','Guitare'],   time:'Il y a 3j' },
  { color:'#252840', initials:'YB', author:'Yanis B.',      handle:'@yanis_b',
    text:"React appris en 2 semaines grâce à un échange avec Marc. On continue sur TypeScript.",
    tags:['React','Code'],      time:'Il y a 4j' },
]

export default function HomePage() {
  const { openModal } = useAuthStore()
  const navigate = useNavigate()
  const [idx,    setIdx]    = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i + 1) % HERO_IMAGES.length), 4000)
    return () => clearInterval(t)
  }, [])

  return (
    <main>

      {/* ── HERO PLEIN ÉCRAN ── */}
      <section className="relative min-h-screen overflow-hidden flex items-center justify-center">

        {HERO_IMAGES.map((img, i) => (
          <div key={i} className={`absolute inset-0 transition-opacity duration-1000 ${i === idx ? 'opacity-100' : 'opacity-0'}`}>
            <img src={img.src} alt="" className="w-full h-full object-cover" />
          </div>
        ))}

        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/70" />

        <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-5xl md:text-7xl font-black tracking-tight leading-tight mb-6">
            Teach what you know.<br />
            <span className="text-[#C8864B]">Learn what you love.</span>
          </h1>

          <p className="text-lg text-white/80 max-w-xl mx-auto mb-8">
            Partage ton savoir, apprends ce qui te passionne.
            Pas d'argent — juste des crédits et une communauté qui s'entraide.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link to="/connection"
              className="px-8 py-4 rounded-full bg-[#C8864B] text-white font-bold text-lg no-underline hover:bg-[#B07030] transition-colors">
              Trouver quelqu'un à qui apprendre
            </Link>
            <Link to="/profile"
              className="px-8 py-4 rounded-full border-2 border-white/60 text-white font-bold text-lg no-underline backdrop-blur-sm hover:bg-white/10 transition-colors">
              Proposer mes compétences
            </Link>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {SKILL_PILLS.map(s => (
              <span key={s} className="px-3 py-1 rounded-full bg-white/10 backdrop-blur-sm text-white/80 text-sm border border-white/20">
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-2 rounded-full transition-all border-none cursor-pointer ${i === idx ? 'w-8 bg-[#C8864B]' : 'w-2 bg-white/40'}`} />
          ))}
        </div>
      </section>

      {/* ── COMMENT ÇA MARCHE — style HappyRobot ── */}
      <section className="py-24 bg-[#F8F4EA]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Colonne gauche — texte + étapes */}
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#C8864B]">
                Comment ça marche
              </span>
              <h2 className="mt-3 text-4xl md:text-5xl font-black text-[#252840] tracking-tight leading-tight">
                Trois étapes pour<br/>ton premier échange.
              </h2>

              <div className="mt-10 flex flex-col gap-8">
                {[
                  {
                    num: '01',
                    title: 'Crée ton profil',
                    text: "Ajoute les compétences que tu peux enseigner et celles que tu veux apprendre. Définis tes disponibilités du lundi au vendredi.",
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <circle cx="12" cy="8" r="4"/>
                        <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                      </svg>
                    ),
                  },
                  {
                    num: '02',
                    title: 'Trouve et réserve',
                    text: "Notre algorithme trouve les membres dont les compétences correspondent aux tiennes. Consulte leurs disponibilités et envoie une demande de réservation.",
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="7"/>
                        <path d="M21 21l-4-4"/>
                      </svg>
                    ),
                  },
                  {
                    num: '03',
                    title: 'Vis la session',
                    text: "Rejoignez votre session vidéo directement dans SkillBridge. Les crédits sont calculés à la minute et transférés automatiquement à la fin.",
                    icon: (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round">
                        <rect x="2" y="6" width="15" height="12" rx="3"/>
                        <path d="M17 10l5-3v10l-5-3"/>
                      </svg>
                    ),
                  },
                ].map((step, i) => (
                  <div key={step.num} className="flex gap-5">
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-2xl bg-[#C8864B] flex items-center justify-center flex-shrink-0">
                        {step.icon}
                      </div>
                      {i < 2 && (
                        <div className="w-px flex-1 bg-[#C8864B]/20 mt-3 min-h-[2rem]" />
                      )}
                    </div>
                    <div className="pb-6">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-xs font-bold text-[#C8864B] uppercase tracking-wider">{step.num}</span>
                        <h3 className="text-lg font-black text-[#252840]">{step.title}</h3>
                      </div>
                      <p className="text-[#7A6E5C] leading-relaxed text-sm">{step.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Colonne droite — diagramme visuel */}
            <div className="relative">
              <div className="relative mx-auto w-full max-w-md" style={{ height: '400px' }}>

                {/* Carte centrale */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-48 h-48 rounded-3xl bg-[#252840] flex flex-col items-center justify-center shadow-2xl">
                  <img src="/sk.png" alt="SkillBridge" className="h-16 w-16 object-contain" />
                  <p className="text-white font-black text-sm mt-2">SkillBridge</p>
                  <p className="text-white/50 text-xs">Plateforme</p>
                </div>

                {/* 4 cartes satellites */}
                {[
                  { style: { top: '10px',  left: '10px'  }, label: 'Profil',   sublabel: 'Skills · Dispo',
                    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#252840" strokeWidth="1.8" strokeLinecap="round"><circle cx="10" cy="7" r="3.5"/><path d="M3 18c0-3.9 3.1-7 7-7s7 3.1 7 7"/></svg> },
                  { style: { top: '10px',  right: '10px' }, label: 'Matching', sublabel: 'IA · Compatible',
                    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#252840" strokeWidth="1.8" strokeLinecap="round"><circle cx="9" cy="9" r="6"/><path d="M17 17l-3-3"/></svg> },
                  { style: { bottom: '10px', left: '10px'  }, label: 'Session', sublabel: 'Vidéo · Live',
                    icon: <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="#252840" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="5" width="12" height="10" rx="2"/><path d="M14 8.5l4-2.5v8l-4-2.5"/></svg> },
                  { style: { bottom: '10px', right: '10px' }, label: 'Crédits', sublabel: 'Auto · Sécurisé',
                    icon: <img src="/credit-coin-gold.png" alt="cr" className="h-5 w-5 object-contain" /> },
                ].map((node, i) => (
                  <div key={i} className="absolute w-36 rounded-2xl border border-black/[0.09] bg-white p-4 shadow-md" style={node.style}>
                    <div className="w-10 h-10 rounded-xl bg-[#F8F4EA] flex items-center justify-center mb-2">
                      {node.icon}
                    </div>
                    <p className="text-sm font-bold text-[#252840]">{node.label}</p>
                    <p className="text-xs text-[#7A6E5C]">{node.sublabel}</p>
                  </div>
                ))}

                {/* Lignes de connexion SVG */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }} viewBox="0 0 400 400">
                  <line x1="100" y1="100" x2="200" y2="200" stroke="#C8864B" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"/>
                  <line x1="300" y1="100" x2="200" y2="200" stroke="#C8864B" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"/>
                  <line x1="100" y1="300" x2="200" y2="200" stroke="#C8864B" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"/>
                  <line x1="300" y1="300" x2="200" y2="200" stroke="#C8864B" strokeWidth="1.5" strokeDasharray="5 5" opacity="0.5"/>
                </svg>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── ÉCHANGES POPULAIRES ── */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C8864B]">
              Échanges populaires
            </span>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#252840]">
              Ce que les membres échangent
            </h2>
            <p className="mt-2 text-[#7A6E5C] max-w-2xl mx-auto text-center">
              Chaque échange est unique. Un guitariste apprend React,
              un développeur apprend la cuisine. C'est ça, SkillBridge.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {EXCHANGES.map(card => (
              <div key={card.title}
                className="relative overflow-hidden rounded-3xl h-80 group cursor-pointer">
                <img src={card.img} alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <h3 className="text-xl font-black mb-1">{card.title}</h3>
                  <p className="text-white/80 text-sm">{card.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SUCCESS STORIES ── */}
      <section className="py-20 bg-[#F8F4EA]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">

          <div className="text-center mb-12">
            <span className="text-sm font-bold uppercase tracking-widest text-[#C8864B]">
              Ils l'ont fait
            </span>
            <h2 className="mt-3 text-4xl font-black tracking-tight text-[#252840]">
              Success stories
            </h2>
            <p className="mt-2 text-[#7A6E5C] max-w-2xl mx-auto text-center">
              Ils ont osé partager leur savoir. Aujourd'hui, ils maîtrisent
              de nouvelles compétences grâce à la communauté.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                img: '/success_stories1.png', name: 'Alex',
                skill: 'Piano',
                story: "A appris le piano grâce à 120 crédits offerts à l'inscription. En 6 sessions, il joue ses premières mélodies.",
                credits: '120 cr utilisés',
                sessions: '6 sessions',
              },
              {
                img: '/success_stories2.png', name: 'Sarah',
                skill: 'Design UI',
                story: "A obtenu des cours de design en échange de cours d'anglais. Elle a redesigné son portfolio en 3 semaines.",
                credits: '180 cr échangés',
                sessions: '8 sessions',
              },
              {
                img: '/success_stories3.png', name: 'Marc',
                skill: 'React',
                story: "A appris React contre des cours de guitare en 3 semaines. Il a déployé sa première app en production.",
                credits: '240 cr échangés',
                sessions: '10 sessions',
              },
            ].map(story => (
              <div key={story.name} className="flex flex-col rounded-3xl overflow-hidden border border-black/[0.09] shadow-sm hover:-translate-y-1 transition-transform bg-white">
                <div className="h-72 overflow-hidden">
                  <img src={story.img} alt={story.name}
                    className="w-full h-full object-cover object-center" />
                </div>
                <div className="p-6 flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-[#252840] text-xl">{story.name}</p>
                    <span className="px-3 py-1 rounded-full bg-[#E4EED8] text-[#3D5C28] text-xs font-bold">{story.skill}</span>
                  </div>
                  <p className="text-[#7A6E5C] text-sm leading-relaxed">{story.story}</p>
                  <div className="flex gap-4 pt-2 border-t border-black/[0.06]">
                    <div className="flex items-center gap-2">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#C8864B" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="7" cy="7" r="5.5"/>
                        <path d="M7 4v3l2 1"/>
                      </svg>
                      <span className="text-xs text-[#7A6E5C] font-medium">{story.sessions}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <img src="/credit-coin-gold.png" alt="crédits" className="h-4 w-4 object-contain" />
                      <span className="text-xs text-[#7A6E5C] font-medium">{story.credits}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── COMMUNAUTÉ — carrousel infini ── */}
      <section className="py-20 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 mb-10">
          <div className="flex items-end justify-between">
            <div>
              <span className="text-sm font-bold uppercase tracking-widest text-[#C8864B]">
                La communauté
              </span>
              <h2 className="mt-3 text-4xl font-black text-[#252840] tracking-tight">
                Ce qui se passe maintenant
              </h2>
              <p className="mt-2 text-[#7A6E5C] max-w-md">
                Des milliers d'échanges ont lieu chaque semaine sur SkillBridge.
                Voici ce que partagent les membres.
              </p>
            </div>
            <a href="/connection" className="hidden md:flex items-center gap-2 px-5 py-2 rounded-full border-2 border-[#252840] text-[#252840] font-bold no-underline hover:bg-[#252840] hover:text-white transition-all">
              Découvrir
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M3 8h10M9 4l4 4-4 4"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Carrousel infini */}
        <div
          className="flex gap-5 w-max"
          style={{ animation: paused ? 'none' : 'scroll-left 30s linear infinite' }}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {[...feedPosts, ...feedPosts].map((post, i) => (
            <article key={i} className="w-80 flex-shrink-0 rounded-3xl border border-black/[0.09] bg-white p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-sm flex-shrink-0"
                  style={{ backgroundColor: post.color }}>
                  {post.initials}
                </div>
                <div>
                  <p className="font-bold text-[#252840] text-sm">{post.author}</p>
                  <p className="text-xs text-[#7A6E5C]">{post.handle}</p>
                </div>
              </div>
              <p className="text-[#3D3020] text-sm leading-relaxed mb-4">{post.text}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                {post.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 rounded-full bg-[#E4EED8] text-[#3D5C28] text-xs font-semibold">
                    {tag}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs text-[#7A6E5C] border-t border-black/[0.06] pt-3">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
                  <path d="M1 6h12M8 2l4 4-4 4"/>
                </svg>
                <span>{post.time}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer />
    </main>
  )
}
