// src/pages/Register.jsx
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const ALL_SKILLS = [
  'Mathematics','English','French','Spanish','Japanese','Chinese','Arabic',
  'Guitar','Piano','Drums','Singing','Drawing','Painting','Photography',
  'Python','JavaScript','Design','Video editing','Cooking','Yoga',
  'Chess','Writing','Philosophy','Physics','Chemistry',
]

const STEPS = ['Account', 'Profile', 'Skills', 'Done']

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()

  const [step, setStep]               = useState(0)
  const [loading, setLoading]         = useState(false)
  const [error, setError]             = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '',
    bio: '', age: '', city: '',
    teaches: [], wants: [],
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const toggleSkill = (skill, type) => {
    const arr = form[type]
    set(type, arr.includes(skill) ? arr.filter(s => s !== skill) : [...arr, skill])
  }

  // Étape 0 → 1 : valider les champs account puis continuer
  const handleStep0 = () => {
    if (!form.firstName.trim()) { setError('First name is required'); return }
    if (!form.lastName.trim())  { setError('Last name is required'); return }
    if (!form.email.trim())     { setError('Email is required'); return }
    if (form.password.length < 8) { setError('Password must be at least 8 characters'); return }
    setError('')
    setStep(1)
  }

  // Étape 2 : créer le compte + ajouter les skills
  const handleCreateAccount = async () => {
    if (form.teaches.length === 0) { setError('Select at least one skill you can teach'); return }
    if (form.wants.length === 0)   { setError('Select at least one skill you want to learn'); return }
    setError('')
    setLoading(true)

    try {
      // 1. Créer le compte
      const res = await api.post('/auth/register', {
        firstName: form.firstName.trim(),
        lastName:  form.lastName.trim(),
        email:     form.email.trim().toLowerCase(),
        password:  form.password,
        bio:       form.bio.trim() || undefined,
      })

      const { user, token } = res.data

      // 2. Connecter l'utilisateur immédiatement pour avoir le token
      login(user, token)

      // 3. Ajouter les skills via l'API (token maintenant disponible)
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      }
      const base = import.meta.env.VITE_API_URL || 'http://localhost:5000'

      const skillPromises = [
        ...form.teaches.map(skill =>
          fetch(`${base}/users/skills`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: skill, category: 'General' }),
          }).catch(() => {})
        ),
        ...form.wants.map(skill =>
          fetch(`${base}/users/learning-goals`, {
            method: 'POST',
            headers,
            body: JSON.stringify({ name: skill, category: 'General' }),
          }).catch(() => {})
        ),
      ]

      await Promise.allSettled(skillPromises)

      // 4. Passer à l'écran de confirmation
      setStep(3)

    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full px-4 py-[11px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F8F8] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all placeholder:text-[#B0A898]"
  const lbl = "text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1"

  return (
    <main className="min-h-screen bg-white flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-[560px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[26px] font-black tracking-tight">
            <span className="text-[#252840]">Skill</span>
            <span className="text-[#C8864B]">Bridge</span>
          </span>
          <p className="text-[14px] text-[#7A6E5C] mt-1">Create your account — it's free</p>
        </div>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-bold flex-shrink-0 transition-all
                ${i < step ? 'bg-[#3D5C28] text-white' : i === step ? 'bg-[#252840] text-white' : 'bg-[#E8E4DC] text-[#7A6E5C]'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[12px] font-medium hidden sm:block ${i === step ? 'text-[#1A1410]' : 'text-[#7A6E5C]'}`}>{s}</span>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-[2px] rounded-full transition-all ${i < step ? 'bg-[#3D5C28]' : 'bg-[#E8E4DC]'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl border border-black/[0.09] p-8">

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[13px] px-4 py-3 rounded-xl mb-4">
              {error}
            </div>
          )}

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Create your account</h2>
                <p className="text-[13px] text-[#7A6E5C] mt-1">You'll use this to log in.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>First name</label>
                  <input className={inp} placeholder="Alice" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>Last name</label>
                  <input className={inp} placeholder="Martin" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className={lbl}>Email</label>
                <input className={inp} type="email" placeholder="alice@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className={lbl}>Password (min. 8 characters)</label>
                <input className={inp} type="password" placeholder="••••••••" value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <button onClick={handleStep0}
                className="w-full py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all">
                Continue
              </button>
              <p className="text-center text-[12px] text-[#7A6E5C]">
                Already have an account?{' '}
                <button onClick={() => navigate('/')} className="text-[#252840] font-bold bg-transparent border-none cursor-pointer">
                  Log in
                </button>
              </p>
            </div>
          )}

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Your profile</h2>
                <p className="text-[13px] text-[#7A6E5C] mt-1">This is what others see when they find you.</p>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#252840] flex items-center justify-center flex-shrink-0">
                  <span className="text-[28px] text-white font-black">{form.firstName?.[0]?.toUpperCase() ?? '?'}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={lbl}>Age (optional)</label>
                  <input className={inp} type="number" placeholder="21" min="13" max="99" value={form.age} onChange={e => set('age', e.target.value)} />
                </div>
                <div>
                  <label className={lbl}>City (optional)</label>
                  <input className={inp} placeholder="Paris" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>

              <div>
                <label className={lbl}>Bio (optional)</label>
                <textarea className={`${inp} resize-none h-24`}
                  placeholder="I love maths and want to learn guitar. I can help with Python too!"
                  value={form.bio} onChange={e => set('bio', e.target.value)} />
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setError(''); setStep(0) }}
                  className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all">
                  Back
                </button>
                <button onClick={() => { setError(''); setStep(2) }}
                  className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all">
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* STEP 2 — Skills */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <div>
                <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Your skills</h2>
                <p className="text-[13px] text-[#7A6E5C] mt-1">
                  This drives your connections. The system finds people whose skills match yours.
                </p>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#C8864B] block mb-3">
                  I can teach — {form.teaches.length} selected
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
                  I want to learn — {form.wants.length} selected
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
                <p className="text-[13px] font-bold text-[#252840] mb-1">How credits work</p>
                <p className="text-[12px] text-[#7A6E5C] leading-[1.6]">
                  You start with <strong>120 free credits</strong> (= 2 hours).
                  Each minute you teach earns +1 credit.
                  Each minute you learn costs −1 credit.
                  Group sessions are always free.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setError(''); setStep(1) }}
                  className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] transition-all">
                  Back
                </button>
                <button
                  onClick={handleCreateAccount}
                  disabled={loading || form.teaches.length === 0 || form.wants.length === 0}
                  className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-40 disabled:cursor-not-allowed">
                  {loading ? 'Creating account…' : 'Create my account'}
                </button>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-[#E4EED8] flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" stroke="#3D5C28" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M6 16l7 7L26 9"/>
                </svg>
              </div>
              <div>
                <h2 className="text-[24px] font-black tracking-tight text-[#1A1410]">Welcome, {form.firstName}!</h2>
                <p className="text-[14px] text-[#7A6E5C] mt-2 max-w-[340px] leading-[1.6]">
                  Your account is ready. You have <strong>120 credits</strong> to start — that's 2 hours of learning.
                </p>
              </div>
              <div className="bg-[#E4EED8] rounded-xl px-6 py-3 text-[13px] font-semibold text-[#3D5C28]">
                120 credits — 2 hours of learning available
              </div>
              <button
                onClick={() => navigate('/connection')}
                className="w-full py-3 rounded-xl border-none bg-[#3D5C28] text-white text-[14px] font-bold cursor-pointer hover:bg-[#4E6035] transition-all">
                Find my first connection →
              </button>
            </div>
          )}
        </div>
      </div>
    </main>
  )
}