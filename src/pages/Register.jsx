// src/pages/Register.jsx
// Page d'inscription dédiée — Dev 3 branchera POST /api/auth/register ici
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const ALL_SKILLS = [

  'Mathematics','English','French','Spanish','Japanese','Chinese','Arabic',
  'Guitar','Piano','Drums','Singing','Drawing','Painting','Photography',
  'Python','JavaScript','Design','Video editing','Cooking','Yoga',
  'Chess','Writing','Philosophy','Physics','Chemistry',
]

const STEPS = ['Account','Profile','Skills','Done']

export default function Register() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [step, setStep] = useState(0)
const [customSkill, setCustomSkill] = useState('')
const [customSkills, setCustomSkills] = useState([])
const [showCustomInput, setShowCustomInput] = useState(false)
  const [avatar, setAvatar] = useState(null)
  const [avatarPreview, setAvatarPreview] = useState(null)
  const [form, setForm] = useState({
    firstName: '', lastName: '', age: '', city: '',
    email: '', password: '',
    bio: '',
    teaches: [], wants: [],
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const allSkills = [...ALL_SKILLS, ...customSkills]

const toggleSkill = (skill, type) => {
  const arr = form[type]
  set(type, arr.includes(skill) ? arr.filter(s => s !== skill) : [...arr, skill])
}

const addCustomSkill = (type) => {
  const trimmed = customSkill.trim()
  if (!trimmed || allSkills.includes(trimmed)) return
  setCustomSkills(p => [...p, trimmed])
  set(type, [...form[type], trimmed])
  setCustomSkill('')
  setShowCustomInput(false)
}

  const handleAvatar = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setAvatar(file)
    setAvatarPreview(URL.createObjectURL(file))
  }

  const handleDone = () => {
    // TODO (Dev 3): appeler POST /api/auth/register avec les données du formulaire
    login({
      prenom: form.firstName, nom: form.lastName,
      email: form.email, age: form.age, city: form.city,
      bio: form.bio, teaches: form.teaches, wants: form.wants,
      credits: 120,
    }, 'demo-token')
    navigate('/profile')
  }

  const inputClass = "w-full px-4 py-3 rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all placeholder:text-[#B0A898] font-inter"

  return (
    <main className="min-h-screen bg-[#F8F4EA] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-[540px]">

        {/* Logo */}
        <div className="text-center mb-8">
          <span className="text-[26px] font-black tracking-tight">
            <span className="text-[#252840]">Skill</span>
            <span className="text-[#C8864B]">Bridge</span>
          </span>
          <p className="text-[14px] text-[#7A6E5C] mt-1">Create your account</p>
        </div>

        {/* Progress bar */}
        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold flex-shrink-0 transition-all ${i <= step ? 'bg-[#252840] text-white' : 'bg-[#E8E4DC] text-[#7A6E5C]'}`}>
                {i < step ? '✓' : i + 1}
              </div>
              <span className={`text-[12px] font-medium hidden sm:block ${i === step ? 'text-[#1A1410]' : 'text-[#7A6E5C]'}`}>{s}</span>
              {i < STEPS.length - 1 && <div className={`flex-1 h-[2px] rounded-full ${i < step ? 'bg-[#252840]' : 'bg-[#E8E4DC]'}`} />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#FDFAF4] rounded-2xl border border-black/[0.09] p-8">

          {/* STEP 0 — Account */}
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Create your account</h2>
              <p className="text-[13px] text-[#7A6E5C] -mt-2">You'll use this to log in.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">First name</label>
                  <input className={inputClass} placeholder="Alice" value={form.firstName} onChange={e => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Last name</label>
                  <input className={inputClass} placeholder="Martin" value={form.lastName} onChange={e => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Email</label>
                <input className={inputClass} type="email" placeholder="alice@example.com" value={form.email} onChange={e => set('email', e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Password</label>
                <input className={inputClass} type="password" placeholder="Min. 8 characters" value={form.password} onChange={e => set('password', e.target.value)} />
              </div>
              <button onClick={() => navigate('/')}
                className="text-[12px] text-[#7A6E5C] text-center mt-1 cursor-pointer bg-transparent border-none">
                Already have an account? <span className="text-[#252840] font-bold">Log in</span>
              </button>
            </div>
          )}

          {/* STEP 1 — Profile */}
          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Build your profile</h2>
              <p className="text-[13px] text-[#7A6E5C] -mt-2">This is what others will see when they find you.</p>

              {/* Avatar upload */}
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-[#E8E4DC] flex items-center justify-center overflow-hidden flex-shrink-0 border-2 border-dashed border-[#C0B8AC]">
                  {avatarPreview
                    ? <img src={avatarPreview} alt="avatar" className="w-full h-full object-cover" />
                    : <span className="text-[28px] text-[#C0B8AC]">👤</span>
                  }
                </div>
                <div>
                  <label className="px-4 py-2 rounded-lg bg-[#252840] text-white text-[12px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all inline-block">
                    Upload photo
                    <input type="file" accept="image/*" className="hidden" onChange={handleAvatar} />
                  </label>
                  <p className="text-[11px] text-[#7A6E5C] mt-1">JPG, PNG or GIF · Max 5MB</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Age</label>
                  <input className={inputClass} type="number" placeholder="21" min="13" max="99" value={form.age} onChange={e => set('age', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">City</label>
                  <input className={inputClass} placeholder="Paris" value={form.city} onChange={e => set('city', e.target.value)} />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Bio — tell others about yourself</label>
                <textarea className={`${inputClass} resize-none h-24`}
                  placeholder="Passionate about maths, looking to learn guitar in exchange for coding lessons..."
                  value={form.bio} onChange={e => set('bio', e.target.value)}
                />
              </div>
            </div>
          )}

          {/* STEP 2 — Skills */}
          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Your skills</h2>
              <p className="text-[13px] text-[#7A6E5C] -mt-2">Select what you can <strong>teach</strong> and what you want to <strong>learn</strong>. This drives your connections.</p>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#C8864B] block mb-3">
                  I can teach ({form.teaches.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill, 'teaches')}
                      className={`px-3 py-[6px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                        ${form.teaches.includes(skill)
                          ? 'bg-[#252840] text-white border-[#252840]'
                          : 'bg-transparent text-[#7A6E5C] border-black/[0.12] hover:border-[#252840] hover:text-[#252840]'
                        }`}>
                      {skill}
                    </button>
                  ))}
                  {showCustomInput ? (
  <div className="flex gap-2 items-center">
    <input autoFocus value={customSkill}
      onChange={e => setCustomSkill(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && addCustomSkill('teaches')}
      placeholder="Add a skill..."
      className="px-3 py-[6px] rounded-full text-[12px] border-[1.5px] border-[#252840] outline-none w-[130px]"
    />
    <button onClick={() => addCustomSkill('teaches')}
      className="px-3 py-[6px] rounded-full text-[12px] font-bold bg-[#252840] text-white border-none cursor-pointer">
      Add
    </button>
    <button onClick={() => setShowCustomInput(false)}
      className="px-3 py-[6px] rounded-full text-[12px] text-[#7A6E5C] border-[1.5px] border-black/[0.12] bg-transparent cursor-pointer">
      Cancel
    </button>
  </div>
) : (
  <button onClick={() => setShowCustomInput(true)}
    className="px-3 py-[6px] rounded-full text-[12px] font-bold border-[1.5px] border-dashed border-[#252840] text-[#252840] bg-transparent cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
    + Add
  </button>
)}
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#3D5C28] block mb-3">
                  I want to learn ({form.wants.length} selected)
                </label>
                <div className="flex flex-wrap gap-2">
                  {allSkills.map(skill => (
                    <button key={skill} onClick={() => toggleSkill(skill, 'wants')}
                      className={`px-3 py-[6px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all
                        ${form.wants.includes(skill)
                          ? 'bg-[#3D5C28] text-white border-[#3D5C28]'
                          : 'bg-transparent text-[#7A6E5C] border-black/[0.12] hover:border-[#3D5C28] hover:text-[#3D5C28]'
                        }`}>
                      {skill}
                    </button>
                  ))}
                  {showCustomInput ? (
  <div className="flex gap-2 items-center">
    <input autoFocus value={customSkill}
      onChange={e => setCustomSkill(e.target.value)}
      onKeyDown={e => e.key === 'Enter' && addCustomSkill('wants')}
      placeholder="Add a skill..."
      className="px-3 py-[6px] rounded-full text-[12px] border-[1.5px] border-[#3D5C28] outline-none w-[130px]"
    />
    <button onClick={() => addCustomSkill('wants')}
      className="px-3 py-[6px] rounded-full text-[12px] font-bold bg-[#3D5C28] text-white border-none cursor-pointer">
      Add
    </button>
    <button onClick={() => setShowCustomInput(false)}
      className="px-3 py-[6px] rounded-full text-[12px] text-[#7A6E5C] border-[1.5px] border-black/[0.12] bg-transparent cursor-pointer">
      Cancel
    </button>
  </div>
) : (
  <button onClick={() => setShowCustomInput(true)}
    className="px-3 py-[6px] rounded-full text-[12px] font-bold border-[1.5px] border-dashed border-[#3D5C28] text-[#3D5C28] bg-transparent cursor-pointer hover:bg-[#3D5C28] hover:text-white transition-all">
    + Add
  </button>
)}
                </div>
              </div>

              {/* Credits explainer */}
              <div className="bg-[#ECEEF8] rounded-xl p-4 flex gap-3 items-start">
                <span className="text-[20px] flex-shrink-0"></span>
                <div>
                  <p className="text-[13px] font-bold text-[#252840] mb-1">How credits work</p>
                  <p className="text-[12px] text-[#7A6E5C] leading-[1.6]">
                    You start with <strong>120 free credits</strong> (= 2 hours). Each minute you teach earns +1 credit. Each minute you learn costs −1 credit. Sessions are timed in the Chat — you and your partner both click "Start session", a timer runs, and when either of you ends it, credits transfer automatically. You can always chat for free without starting a session.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3 — Done */}
          {step === 3 && (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <div className="text-[64px]"></div>
              <h2 className="text-[24px] font-black tracking-tight text-[#1A1410]">You're all set!</h2>
              <p className="text-[14px] text-[#7A6E5C] max-w-[340px] leading-[1.6]">
                Your account is ready. You got <strong>120 free credits</strong> to start. Go find your first connection!
              </p>
              <div className="bg-[#E4EED8] rounded-xl px-6 py-3 text-[13px] font-semibold text-[#3D5C28]">
                 120 credits — 2 hours of learning available
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex gap-3 mt-6">
            {step > 0 && step < 3 && (
              <button onClick={() => setStep(p => p - 1)}
                className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all font-inter">
                Back
              </button>
            )}
            {step < 2 && (
              <button onClick={() => setStep(p => p + 1)}
                disabled={step === 0 && (!form.firstName || !form.email || !form.password)}
                className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter disabled:opacity-40 disabled:cursor-not-allowed">
                Continue
              </button>
            )}
            {step === 2 && (
              <button onClick={() => setStep(3)}
                disabled={form.teaches.length === 0 || form.wants.length === 0}
                className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter disabled:opacity-40 disabled:cursor-not-allowed">
                Create my account
              </button>
            )}
            {step === 3 && (
              <button onClick={handleDone}
                className="flex-1 py-3 rounded-xl border-none bg-[#3D5C28] text-white text-[14px] font-bold cursor-pointer hover:bg-[#4E6035] transition-all font-inter">
                Go to my profile →
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}