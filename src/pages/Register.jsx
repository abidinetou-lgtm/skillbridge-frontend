import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const CLOUD_NAME    = 'derho2rib'
const UPLOAD_PRESET = 'skillbridge_avatars'
const AVATAR_KEY    = 'sb_avatar'

const ALL_SKILLS = [
  'Mathematics','English','French','Spanish','Japanese','Chinese','Arabic',
  'Guitar','Piano','Drums','Singing','Drawing','Painting','Photography',
  'Python','JavaScript','Design','Video editing','Cooking','Yoga',
  'Chess','Writing','Philosophy','Physics','Chemistry',
]

const STEPS = ['Compte', 'Profil', 'Compétences', 'Terminé']

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const fileRef   = useRef()

  const [step,     setStep]    = useState(0)
  const [loading,  setLoading] = useState(false)
  const [error,    setError]   = useState('')
  const [avatar,   setAvatar]  = useState('')
  const [uploading,setUploading] = useState(false)

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    bio: '', teaches: [], wants: [],
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toggleSkill = (skill, type) => {
    const arr = form[type]
    set(type, arr.includes(skill) ? arr.filter(s => s !== skill) : [...arr, skill])
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('upload_preset', UPLOAD_PRESET)
      const res  = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (data.secure_url) {
        localStorage.setItem(AVATAR_KEY, data.secure_url)
        setAvatar(data.secure_url)
      }
    } catch (e) { console.error(e) }
    finally { setUploading(false) }
  }

  const handleStep0 = () => {
    if (!form.firstName.trim()) { setError('Le prénom est requis'); return }
    if (!form.lastName.trim())  { setError('Le nom est requis'); return }
    if (!form.email.trim())     { setError("L'email est requis"); return }
    if (form.password.length < 8) { setError('Mot de passe : 8 caractères minimum'); return }
    setError(''); setStep(1)
  }

  const handleCreateAccount = async () => {
    if (form.teaches.length === 0) { setError('Sélectionnez au moins une compétence à enseigner'); return }
    if (form.wants.length === 0)   { setError('Sélectionnez au moins une compétence à apprendre'); return }
    setError(''); setLoading(true)
    try {
      const res = await api.post('/auth/register', {
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim().toLowerCase(),
        password:  form.password,
        bio:       form.bio.trim() || undefined,
      })
      const { user, token } = res.data
      login(user, token)

      const headers = { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      const base    = import.meta.env.VITE_API_URL || 'http://localhost:5000'

      await Promise.allSettled([
        ...form.teaches.map(skill => fetch(`${base}/users/skills`, { method: 'POST', headers, body: JSON.stringify({ name: skill, category: 'General' }) }).catch(() => {})),
        ...form.wants.map(skill   => fetch(`${base}/users/learning-goals`, { method: 'POST', headers, body: JSON.stringify({ name: skill, category: 'General' }) }).catch(() => {})),
      ])
      setStep(3)
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Échec de l'inscription")
    } finally { setLoading(false) }
  }

  const inp = "w-full px-4 py-[11px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F8F8] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all placeholder:text-[#B0A898]"
  const lbl = "text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1"

  const initials = `${form.firstName?.[0] ?? ''}${form.lastName?.[0] ?? ''}`.toUpperCase() || '?'

  return (
    <main className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-[560px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[26px] font-black tracking-tight">
            <span className="text-[#252840]">Skill</span>
            <span className="text-[#C8864B]">Bridge</span>
          </span>
          <p className="text-[14px] text-[#7A6E5C] mt-1">Créez votre compte — c'est gratuit</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all
                ${i < step ? 'bg-[#3D5C28] text-white' : i === step ? 'bg-[#252840] text-white' : 'bg-[#E8E4DC] text-[#7A6E5C]'}`}>
                {i < step
                  ? <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
                  : i + 1
                }
              </div>
              <span className={`text-[12px] font-medium hidden sm:block ${i === step ? 'text-[#1A1410]' : 'text-[#7A6E5C]'}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] rounded-full transition-all ${i < step ? 'bg-[#3D5C28]' : 'bg-[#E8E4DC]'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-black/[0.09] p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* STEP 0 — Compte */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Créer votre compte</h2>
                <p className="text-[13px] text-[#7A6E5C] mt-1">Vous utiliserez ces informations pour vous connecter.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Prénom</label>
                  <input className={inp} placeholder="Alice" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Nom</label>
                  <input className={inp} placeholder="Martin" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Email</label>
                <input className={inp} type="email" placeholder="alice@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Mot de passe (8 caractères min.)</label>
                <input className={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <button onClick={handleStep0}
                className="w-full py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all">
                Continuer
              </button>
              <p className="text-center text-[12px] text-[#7A6E5C]">
                Déjà un compte ?{' '}
                <button onClick={() => navigate('/')} className="text-[#252840] font-bold bg-transparent border-none cursor-pointer">
                  Se connecter
                </button>
              </p>
            </div>
          )}

          {/* STEP 1 — Profil + Photo */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Votre profil</h2>
                <p className="text-[13px] text-[#7A6E5C] mt-1">C'est ce que les autres voient quand ils vous trouvent.</p>
              </div>

              {/* Photo de profil */}
              <div className="flex items-center gap-4 p-4 bg-[#F8F4EA] rounded-xl">
                <div className="relative flex-shrink-0">
                  <div className="w-20 h-20 rounded-full bg-[#252840] flex items-center justify-center overflow-hidden">
                    {avatar
                      ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                      : <span className="text-[28px] text-white font-black">{initials}</span>
                    }
                  </div>
                  {uploading && (
                    <div className="absolute inset-0 rounded-full bg-black/60 flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-[13px] font-semibold text-[#1A1410] mb-1">Photo de profil</p>
                  <p className="text-[11px] text-[#7A6E5C] mb-2">JPG ou PNG — optionnel</p>
                  <button onClick={() => fileRef.current?.click()} disabled={uploading}
                    className="px-4 py-[7px] rounded-lg border-[1.5px] border-black/[0.09] text-[12px] font-semibold text-[#1A1410] bg-white cursor-pointer hover:border-[#252840] transition-all flex items-center gap-2">
                    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <path d="M11.5 9.5a2 2 0 01-2 2h-6a2 2 0 01-2-2V4a2 2 0 012-2h1.5l1-1.5h3L10 2h1.5a2 2 0 012 2z"/>
                      <circle cx="6.5" cy="6.5" r="2"/>
                    </svg>
                    {uploading ? 'Upload en cours…' : avatar ? 'Changer la photo' : 'Ajouter une photo'}
                  </button>
                  <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
                </div>
              </div>

              <div>
                <label className={lbl}>Bio (optionnel)</label>
                <textarea className={`${inp} resize-none h-24`}
                  placeholder="Je suis passionné de maths et je veux apprendre la guitare…"
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setError(''); setStep(0) }}
                  className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all">
                  Retour
                </button>
                <button onClick={() => { setError(''); setStep(2) }}
                  className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all">
                  Continuer
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Compétences */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Vos compétences</h2>
                <p className="text-[13px] text-[#7A6E5C] mt-1">Choisissez ce que vous pouvez enseigner et ce que vous voulez apprendre.</p>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#C8864B] block mb-3">
                  Je peux enseigner — {form.teaches.length} sélectionné{form.teaches.length > 1 ? 's' : ''}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill, 'teaches')}
                      className={`px-3 py-[6px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                        ${form.teaches.includes(skill)
                          ? 'bg-[#252840] text-white border-[#252840]'
                          : 'bg-transparent text-[#7A6E5C] border-black/[0.12] hover:border-[#252840] hover:text-[#252840]'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#3D5C28] block mb-3">
                  Je veux apprendre — {form.wants.length} sélectionné{form.wants.length > 1 ? 's' : ''}
                </label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill, 'wants')}
                      className={`px-3 py-[6px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                        ${form.wants.includes(skill)
                          ? 'bg-[#3D5C28] text-white border-[#3D5C28]'
                          : 'bg-transparent text-[#7A6E5C] border-black/[0.12] hover:border-[#3D5C28] hover:text-[#3D5C28]'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-[#ECEEF8] rounded-xl px-5 py-4">
                <p className="text-[13px] font-bold text-[#252840] mb-1">Comment fonctionnent les crédits</p>
                <p className="text-[12px] text-[#7A6E5C] leading-[1.6]">
                  Vous démarrez avec <strong>120 crédits gratuits</strong> (= 2 heures).
                  Chaque minute enseignée rapporte +1 crédit.
                  Chaque minute apprise coûte −1 crédit.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setError(''); setStep(1) }}
                  className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all">
                  Retour
                </button>
                <button onClick={handleCreateAccount}
                  disabled={loading || form.teaches.length === 0 || form.wants.length === 0}
                  className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading ? 'Création du compte…' : 'Créer mon compte'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div className="w-20 h-20 rounded-full bg-[#252840] flex items-center justify-center overflow-hidden">
                {avatar
                  ? <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
                  : <span className="text-[28px] text-white font-black">{initials}</span>
                }
              </div>
              <div>
                <h2 className="text-[24px] font-black tracking-tight text-[#1A1410]">Bienvenue, {form.firstName} !</h2>
                <p className="text-[14px] text-[#7A6E5C] mt-2 max-w-[340px] leading-[1.6]">
                  Votre compte est prêt. Vous avez <strong>120 crédits</strong> pour commencer.
                </p>
              </div>
              <div className="bg-[#E4EED8] rounded-xl px-6 py-3 text-[13px] font-semibold text-[#3D5C28]">
                120 crédits — 2 heures d'apprentissage disponibles
              </div>
              <button onClick={() => navigate('/connection')}
                className="w-full py-3 rounded-xl border-none bg-[#3D5C28] text-white text-[14px] font-bold cursor-pointer hover:bg-[#4E6035] transition-all">
                Trouver ma première connexion
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}