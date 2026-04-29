// src/pages/Feed.jsx
import { useState } from 'react'

const TAG_STYLES = {
  sand:  'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8] text-[#252840]',
  sage:  'bg-[#E4EED8] text-[#3D5C28]',
  warm:  'bg-[#F8EDD8] text-[#8C5A1E]',
}

const ALL_POSTS = [
  { id:1, initials:'LA', color:'#252840', author:'Léa Arnaud',   time:'2h ago',     text:'First math session — finally understood derivatives! Thank you SkillBridge.', tags:[{l:'Maths',s:'sand'},{l:'Session',s:'night'}], likes:24, comments:5  },
  { id:2, initials:'KM', color:'#C8864B', author:'Kenji Matsuda',time:'5h ago',     text:'Learned homemade ramen in exchange for a Japanese lesson. Best deal ever.',   tags:[{l:'Japanese',s:'warm'},{l:'Cooking',s:'warm'}], likes:41, comments:12 },
  { id:3, initials:'SO', color:'#3D5C28', author:'Sara Okonkwo', time:'Yesterday',  text:'60 credits earned this week — 3 English sessions given. Love this system!',   tags:[{l:'English',s:'sage'},{l:'Credits',s:'sage'}], likes:18, comments:3  },
  { id:4, initials:'TR', color:'#363B6B', author:'Thomas R.',    time:'2 days ago', text:'Matched with 3 people this week. Group learning is something else.',           tags:[{l:'Match x3',s:'night'}], likes:33, comments:7  },
  { id:5, initials:'AM', color:'#B07030', author:'Amira M.',     time:'3 days ago', text:'Taught Arabic calligraphy, learned guitar chords. This platform is magic.',    tags:[{l:'Arabic',s:'warm'},{l:'Guitar',s:'sand'}], likes:56, comments:9  },
  { id:6, initials:'PD', color:'#4E6035', author:'Paul D.',      time:'4 days ago', text:'Just hit 200 credits! Thanks to everyone who took my Python sessions.',        tags:[{l:'Python',s:'sage'},{l:'Credits',s:'sage'}], likes:72, comments:14 },
  { id:7, initials:'CL', color:'#252840', author:'Camille L.',   time:'5 days ago', text:'Taught French for the first time. My student was amazing and so patient.',     tags:[{l:'French',s:'night'},{l:'Teaching',s:'night'}], likes:29, comments:6  },
  { id:8, initials:'RN', color:'#C8864B', author:'Ryo N.',       time:'1 week ago', text:'3-person match finally available — I teach piano, learn maths, teach guitar.', tags:[{l:'Piano',s:'warm'},{l:'Match x3',s:'warm'}], likes:88, comments:21 },
]

const FILTERS = ['All', 'Maths', 'Languages', 'Music', 'Tech', 'Cooking', 'Credits']

export default function Feed() {
  const [filter, setFilter] = useState('All')
  const [liked, setLiked] = useState(new Set())

  const toggleLike = (id) => {
    setLiked(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">

      {/* Header */}
      <div className="bg-[#FDFAF4] border-b border-black/[0.09] px-20 py-10">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Community</p>
        <h1 className="text-[38px] font-black tracking-[-1.5px] text-[#1A1410] leading-[1.05]">
          What members <span className="text-[#252840]">share</span>
        </h1>
        <p className="text-[14px] text-[#7A6E5C] mt-2">Progress, tips and discoveries from the SkillBridge community.</p>
      </div>

      <div className="px-20 py-8">
        {/* Filters */}
        <div className="flex gap-2 flex-wrap mb-8">
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-full text-[13px] font-semibold border-[1.5px] transition-all cursor-pointer
                ${filter === f
                  ? 'bg-[#252840] text-white border-[#252840]'
                  : 'bg-transparent text-[#7A6E5C] border-black/[0.09] hover:border-[#1A1410] hover:text-[#1A1410]'
                }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-3 gap-5">
          {ALL_POSTS.map(post => (
            <div key={post.id}
              className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl overflow-hidden hover:-translate-y-1 hover:shadow-lg transition-all cursor-pointer"
            >
              {/* Thumb */}
              <div className="h-[160px] flex items-center justify-center"
                style={{ background: `${post.color}12` }}>
                <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
                  <rect x="12" y="14" width="38" height="48" rx="5" fill={post.color} opacity=".15"/>
                  <path d="M20 30h22M20 38h18M20 46h20" stroke={post.color} strokeWidth="2" strokeLinecap="round"/>
                  <circle cx="58" cy="58" r="12" fill={post.color} opacity=".12"/>
                  <path d="M54 58l3 3 6-6" stroke={post.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>

              <div className="p-4 flex flex-col gap-3">
                {/* Author */}
                <div className="flex gap-2 items-center">
                  <div className="w-7 h-7 rounded-full text-[10px] font-bold text-white flex items-center justify-center flex-shrink-0"
                    style={{ background: post.color }}>
                    {post.initials}
                  </div>
                  <span className="text-[13px] font-semibold text-[#1A1410]">{post.author}</span>
                  <span className="text-[10px] text-[#7A6E5C] ml-auto">{post.time}</span>
                </div>

                <p className="text-[13px] text-[#3D3020] leading-[1.5]">{post.text}</p>

                <div className="flex gap-[5px] flex-wrap">
                  {post.tags.map(t => (
                    <span key={t.l} className={`px-[10px] py-1 rounded-full text-xs font-semibold ${TAG_STYLES[t.s]}`}>{t.l}</span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-1 border-t border-black/[0.06]">
                  <button onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1 text-[12px] font-medium transition-all cursor-pointer bg-transparent border-none
                      ${liked.has(post.id) ? 'text-red-500' : 'text-[#7A6E5C] hover:text-red-400'}`}>
                    <svg width="13" height="13" viewBox="0 0 14 14" fill={liked.has(post.id) ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="1.8">
                      <path d="M7 12s-6-3.5-6-7a3 3 0 016 0 3 3 0 016 0c0 3.5-6 7-6 7z" strokeLinejoin="round"/>
                    </svg>
                    {post.likes + (liked.has(post.id) ? 1 : 0)}
                  </button>
                  <button className="flex items-center gap-1 text-[12px] font-medium text-[#7A6E5C] hover:text-[#252840] transition-all cursor-pointer bg-transparent border-none">
                    <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M1 1h12v8H8l-1 4-1-4H1z" strokeLinejoin="round"/>
                    </svg>
                    {post.comments}
                  </button>
                  <button className="ml-auto text-[12px] font-medium text-[#7A6E5C] hover:text-[#252840] transition-all cursor-pointer bg-transparent border-none">
                    Share
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load more */}
        <div className="flex justify-center mt-10">
          <button className="px-8 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#1A1410] bg-transparent cursor-pointer hover:bg-[#1A1410] hover:text-white transition-all">
            Load more posts
          </button>
        </div>
      </div>
    </main>
  )
}
