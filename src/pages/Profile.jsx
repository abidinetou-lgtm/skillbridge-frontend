// src/pages/Profile.jsx
// Profil personnel — accessible uniquement si connecté (protégé dans App.jsx)
// Menu hamburger en haut à droite → accès aux modifications
import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const TAG_STYLES = {
  sand:  'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8] text-[#252840]',
  sage:  'bg-[#E4EED8] text-[#3D5C28]',
  warm:  'bg-[#F8EDD8] text-[#8C5A1E]',
}

const ALL_SKILLS = ['Mathematics','English','French','Spanish','Japanese','Guitar','Piano','Python','Design','Cooking','Yoga','Photography','Writing','Physics']

export default function Profile() {
  const { user, logout } = useAuthStore()
  const navigate = useNavigate()
  const [tab, setTab] = useState('posts')
  const [menuOpen, setMenuOpen] = useState(false)
  const [editOpen, setEditOpen] = useState(false)
  const [dispo, setDispo] = useState(true)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [addPostOpen, setAddPostOpen] = useState(false)
  const [newPost, setNewPost] = useState('')
  const [posts, setPosts] = useState([
    { id:1, text:'First math session — finally understood derivatives!', likes:24, bg:'#EEEADE', color:'#3D3020', time:'2h ago' },
    { id:2, text:'Taught English for 3 hours today. So rewarding!',      likes:18, bg:'#E4EED8', color:'#3D5C28', time:'Yesterday' },
    { id:3, text:'60 credits earned this week 🎉',                        likes:41, bg:'#ECEEF8', color:'#252840', time:'3 days ago' },
  ])

  // Edit form state
  const [editForm, setEditForm] = useState({
    firstName: user?.prenom ?? 'Alice',
    lastName:  user?.nom ?? 'Martin',
    age:       user?.age ?? '21',
    city:      user?.city ?? 'Paris',
    bio:       user?.bio ?? 'Passionate about maths and code. I exchange my lessons for guitar or Spanish.',
    teaches:   user?.teaches ?? ['Maths','Python','English'],
    wants:     user?.wants ?? ['Guitar','Spanish'],
  })
  const setE = (k,v) => setEditForm(p => ({...p, [k]:v}))
  const toggleSkill = (skill, type) => {
    const arr = editForm[type]
    setE(type, arr.includes(skill) ? arr.filter(s=>s!==skill) : [...arr, skill])
  }

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (file) setAvatarPreview(URL.createObjectURL(file))
  }

  const addPost = () => {
    if (!newPost.trim()) return
    setPosts(p => [{ id: Date.now(), text: newPost.trim(), likes: 0, bg:'#ECEEF8', color:'#252840', time:'Just now' }, ...p])
    setNewPost('')
    setAddPostOpen(false)
  }

  const inputClass = "w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">

      {/* Edit modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="bg-[#FDFAF4] rounded-2xl p-8 w-full max-w-[560px] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-black text-[#1A1410]">Edit your profile</h2>
              <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C] text-base flex items-center justify-center hover:bg-black/10">✕</button>
            </div>

            {/* Avatar */}
            <div className="flex items-center gap-4 mb-5">
              <div className="w-16 h-16 rounded-full overflow-hidden bg-[#252840] flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
                {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar"/> : editForm.firstName[0]}
              </div>
              <label className="px-4 py-2 rounded-lg bg-[#252840] text-white text-[12px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all inline-block">
                Change photo
                <input type="file" accept="image/*" className="hidden" onChange={handleAvatar}/>
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">First name</label>
                <input className={inputClass} value={editForm.firstName} onChange={e => setE('firstName', e.target.value)}/>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Last name</label>
                <input className={inputClass} value={editForm.lastName} onChange={e => setE('lastName', e.target.value)}/>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Age</label>
                <input className={inputClass} type="number" value={editForm.age} onChange={e => setE('age', e.target.value)}/>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">City</label>
                <input className={inputClass} value={editForm.city} onChange={e => setE('city', e.target.value)}/>
              </div>
            </div>
            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Bio</label>
              <textarea className={`${inputClass} resize-none h-20`} value={editForm.bio} onChange={e => setE('bio', e.target.value)}/>
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#C8864B] block mb-2">I teach</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill,'teaches')}
                    className={`px-3 py-[5px] rounded-full text-[11px] font-semibold border-[1.5px] cursor-pointer transition-all
                      ${editForm.teaches.includes(skill) ? 'bg-[#252840] text-white border-[#252840]' : 'bg-transparent text-[#7A6E5C] border-black/[0.12]'}`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#3D5C28] block mb-2">I want to learn</label>
              <div className="flex flex-wrap gap-2">
                {ALL_SKILLS.map(skill => (
                  <button key={skill} onClick={() => toggleSkill(skill,'wants')}
                    className={`px-3 py-[5px] rounded-full text-[11px] font-semibold border-[1.5px] cursor-pointer transition-all
                      ${editForm.wants.includes(skill) ? 'bg-[#3D5C28] text-white border-[#3D5C28]' : 'bg-transparent text-[#7A6E5C] border-black/[0.12]'}`}>
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            <button onClick={() => setEditOpen(false)}
              className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
              Save changes
            </button>
          </div>
        </div>
      )}

      {/* Add post modal */}
      {addPostOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setAddPostOpen(false)}>
          <div className="bg-[#FDFAF4] rounded-2xl p-8 w-full max-w-[480px]">
            <h2 className="text-[18px] font-black text-[#1A1410] mb-4">New post</h2>
            <textarea
              value={newPost}
              onChange={e => setNewPost(e.target.value)}
              placeholder="Share a progress update, tip, or thought..."
              className="w-full px-4 py-3 rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all resize-none h-28 mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => setAddPostOpen(false)}
                className="flex-1 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all">
                Cancel
              </button>
              <button onClick={addPost} disabled={!newPost.trim()}
                className="flex-1 py-3 rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-40">
                Post
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover */}
      <div className="h-[200px] bg-gradient-to-br from-[#252840] via-[#363B6B] to-[#C8864B] relative">
        {/* Hamburger menu */}
        <div className="absolute top-4 right-6">
          <button onClick={() => setMenuOpen(p => !p)}
            className="w-10 h-10 rounded-lg bg-white/10 border border-white/20 text-white flex items-center justify-center cursor-pointer hover:bg-white/20 transition-all">
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 4h14M2 9h14M2 14h14" stroke="white" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
          {menuOpen && (
            <div className="absolute top-12 right-0 bg-[#FDFAF4] border border-black/[0.09] rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.15)] py-1 w-[200px] z-20">
              {[
                { label:'Edit profile',    icon:'', action:() => { setEditOpen(true); setMenuOpen(false) } },
                { label:'Add post / photo',icon:'', action:() => { setAddPostOpen(true); setMenuOpen(false) } },
                { label:'Find a connection',icon:'', action:() => navigate('/connection') },
                { label:'Log out',         icon:'', action:() => { logout(); navigate('/') }, danger:true },
              ].map(item => (
                <button key={item.label} onClick={item.action}
                  className={`w-full flex items-center gap-3 px-4 py-[10px] text-[13px] font-medium bg-transparent border-none cursor-pointer text-left hover:bg-black/5 transition-all ${item.danger ? 'text-red-500' : 'text-[#1A1410]'}`}>
                  <span>{item.icon}</span> {item.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-20 relative">
        {/* Avatar + buttons */}
        <div className="flex items-end justify-between -mt-[52px] mb-6">
          <div className="relative">
            <div className="w-[104px] h-[104px] rounded-full border-4 border-[#F8F4EA] overflow-hidden bg-[#252840] flex items-center justify-center font-black text-[36px] text-white">
              {avatarPreview ? <img src={avatarPreview} className="w-full h-full object-cover" alt="avatar"/> : editForm.firstName[0]}
            </div>
            {dispo && <div className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-[#3D5C28] border-2 border-[#F8F4EA]"/>}
          </div>
          <div className="flex gap-3 mb-2">
            <button onClick={() => setDispo(p=>!p)}
              className={`px-4 py-2 rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                ${dispo ? 'bg-[#E4EED8] text-[#3D5C28] border-[#3D5C28]' : 'bg-transparent text-[#7A6E5C] border-black/[0.09]'}`}>
              {dispo ? '● Available now' : '○ Set available'}
            </button>
            <button onClick={() => setAddPostOpen(true)}
              className="px-4 py-2 rounded-full text-[12px] font-semibold border-[1.5px] border-black/[0.09] text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all">
              + Add post
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-10 items-start pb-16">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#1A1410]">{editForm.firstName} {editForm.lastName}</h1>
            <p className="text-[14px] text-[#7A6E5C] mt-1">{editForm.age} y.o. · {editForm.city}</p>
            <p className="text-[14px] text-[#3D3020] leading-[1.6] mt-3 max-w-[520px]">{editForm.bio}</p>

            <div className="flex gap-10 mt-6">
              <div>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">I teach</p>
                <div className="flex gap-2 flex-wrap">
                  {editForm.teaches.map(s => <span key={s} className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${TAG_STYLES.sand}`}>{s}</span>)}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">I want to learn</p>
                <div className="flex gap-2 flex-wrap">
                  {editForm.wants.map(s => <span key={s} className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${TAG_STYLES.warm}`}>{s}</span>)}
                </div>
              </div>
            </div>

            {/* Tabs — Sessions = historique des sessions + crédits / Badges = récompenses */}
            <div className="flex gap-1 mt-8 border-b border-black/[0.09]">
              {['posts','sessions','badges'].map(t => (
                <button key={t} onClick={() => setTab(t)}
                  className={`px-4 py-2 text-[13px] font-semibold capitalize border-none bg-transparent cursor-pointer transition-all border-b-2 -mb-px
                    ${tab===t ? 'text-[#252840] border-[#252840]' : 'text-[#7A6E5C] border-transparent hover:text-[#1A1410]'}`}>
                  {t}
                </button>
              ))}
            </div>

            {/* Posts */}
            {tab === 'posts' && (
              <div className="grid grid-cols-3 gap-3 mt-5">
                {posts.map(p => (
                  <div key={p.id} className="aspect-square rounded-xl overflow-hidden cursor-pointer hover:scale-[1.02] transition-all relative" style={{ background: p.bg }}>
                    <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 100" fill="none">
                      <rect x="20" y="20" width="40" height="50" rx="4" fill={p.color}/>
                      <path d="M28 35h24M28 43h18M28 51h20" stroke={p.color} strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2">
                      <p className="text-white text-[11px] font-medium leading-[1.3] line-clamp-2">{p.text}</p>
                      <p className="text-white/70 text-[10px] mt-1">❤ {p.likes} · {p.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Sessions = historique chronométré des échanges de compétences */}
            {tab === 'sessions' && (
              <div className="mt-5 flex flex-col gap-3">
                <div className="bg-[#ECEEF8] rounded-xl p-4 text-[13px] text-[#252840] font-medium mb-2">
                   Sessions are timed skill exchanges started in Chat. Each minute you teach = +1 credit. Each minute you learn = −1 credit.
                </div>
                {[
                  { partner:'Léa Arnaud', skill:'Maths → English', date:'27 Apr', duration:'1h', credits:'+60', rating:5, type:'taught' },
                  { partner:'Kenji Matsuda', skill:'English → Japanese', date:'25 Apr', duration:'45min', credits:'-45', rating:4, type:'learned' },
                  { partner:'Sara Okonkwo', skill:'Python → Cooking', date:'22 Apr', duration:'1h30', credits:'+90', rating:5, type:'taught' },
                ].map((s,i) => (
                  <div key={i} className="flex items-center gap-4 bg-[#FDFAF4] border border-black/[0.09] rounded-xl px-5 py-4">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${s.type==='taught' ? 'bg-[#3D5C28]' : 'bg-[#C8864B]'}`}/>
                    <div className="flex-1">
                      <div className="text-[14px] font-semibold text-[#1A1410]">{s.partner}</div>
                      <div className="text-[12px] text-[#7A6E5C]">{s.skill} · {s.date} · {s.duration}</div>
                    </div>
                    <div className="text-right">
                      <div className={`text-[13px] font-bold ${s.type==='taught' ? 'text-[#3D5C28]' : 'text-[#C8864B]'}`}>{s.credits} credits</div>
                      <div className="text-[11px] text-[#7A6E5C]">{''.repeat(s.rating)}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Badges = récompenses débloquées selon l'activité */}
            {tab === 'badges' && (
              <div className="mt-5">
                <p className="text-[13px] text-[#7A6E5C] mb-4">Badges are earned automatically based on your activity on SkillBridge.</p>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { label:'First session',  icon:'', earned:true,  desc:'Complete your first skill session' },
                    { label:'100 credits',    icon:'', earned:true,  desc:'Earn 100 credits by teaching' },
                    { label:'Top teacher',    icon:'', earned:true,  desc:'Get 5 ratings of 5 stars' },
                    { label:'Group match',    icon:'', earned:false, desc:'Join a 3-person skill exchange' },
                    { label:'200 credits',    icon:'', earned:false, desc:'Earn 200 credits total' },
                    { label:'10 sessions',    icon:'', earned:false, desc:'Complete 10 sessions' },
                    { label:'International',  icon:'', earned:false, desc:'Exchange with someone from another country' },
                    { label:'Polyglot',       icon:'', earned:false, desc:'Teach 3 different skills' },
                  ].map((b,i) => (
                    <div key={i} title={b.desc}
                      className={`flex flex-col items-center gap-2 p-4 rounded-xl border cursor-help
                        ${b.earned ? 'bg-[#FDFAF4] border-black/[0.09]' : 'bg-transparent border-dashed border-black/[0.06] opacity-40'}`}>
                      <div className="text-[28px]">{b.icon}</div>
                      <div className="text-[11px] font-semibold text-[#1A1410] text-center leading-[1.3]">{b.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Stats sidebar */}
          <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6 flex flex-col gap-4 sticky top-20">
            <h3 className="text-[14px] font-bold text-[#1A1410]">Your stats</h3>
            {[
              { label:'Credits available', value:`${user?.credits ?? 120} `, color:'#252840' },
              { label:'Sessions given',    value:'8',       color:'#3D5C28' },
              { label:'Sessions received', value:'5',       color:'#C8864B' },
              { label:'Reputation',        value:'4.8 / 5', color:'#252840' },
            ].map(s => (
              <div key={s.label} className="flex items-center justify-between">
                <span className="text-[13px] text-[#7A6E5C]">{s.label}</span>
                <span className="text-[14px] font-bold" style={{color:s.color}}>{s.value}</span>
              </div>
            ))}
            <div className="pt-2 border-t border-black/[0.07]">
              <button onClick={() => navigate('/connection')}
                className="w-full py-[10px] rounded-[10px] bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                Find a connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}