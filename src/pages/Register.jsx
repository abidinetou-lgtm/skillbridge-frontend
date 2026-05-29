import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { authApi, getApiError, userApi } from '../services/api'

const ALL_SKILLS = [
  'Mathematics','English','French','Spanish','Japanese','Chinese','Arabic',
  'Guitar','Piano','Drums','Singing','Drawing','Painting','Photography',
  'Python','JavaScript','Design','Video editing','Cooking','Yoga',
  'Chess','Writing','Philosophy','Physics','Chemistry',
]

const STEPS = ['Account','Profile','Skills','Done']

export default function Register() {
  const navigate = useNavigate()
  const { setAuth, setUser } = useAuthStore()
  const [step, setStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', password: '', bio: '',
    teaches: [], wants: [],
  })

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const toggleSkill = (skill, type) => {
    const current = form[type]
    set(type, current.includes(skill) ? current.filter((item) => item !== skill) : [...current, skill])
  }

  const submit = async () => {
    setError('')
    setLoading(true)

    try {
      const result = await authApi.register({
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        bio: form.bio,
      })

      setAuth(result.user, result.token)

      await Promise.all([
        ...form.teaches.map((name) => userApi.addSkill({ name })),
        ...form.wants.map((name) => userApi.addLearningGoal({ name })),
      ])

      const user = await userApi.me()
      setUser(user)
      navigate('/profile')
    } catch (err) {
      setError(getApiError(err))
      setStep(0)
    } finally {
      setLoading(false)
    }
  }

  const inputClass = 'w-full px-4 py-3 rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all placeholder:text-[#B0A898] font-inter'

  return (
    <main className="min-h-screen bg-[#F8F4EA] flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-[540px]">
        <div className="text-center mb-8">
          <span className="text-[26px] font-black tracking-tight">
            <span className="text-[#252840]">Skill</span>
            <span className="text-[#C8864B]">Bridge</span>
          </span>
          <p className="text-[14px] text-[#7A6E5C] mt-1">Create your account</p>
        </div>

        <div className="flex items-center gap-2 mb-8">
          {STEPS.map((label, index) => (
            <div key={label} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center justify-center w-7 h-7 rounded-full text-[12px] font-bold flex-shrink-0 transition-all ${index <= step ? 'bg-[#252840] text-white' : 'bg-[#E8E4DC] text-[#7A6E5C]'}`}>
                {index < step ? '✓' : index + 1}
              </div>
              <span className={`text-[12px] font-medium hidden sm:block ${index === step ? 'text-[#1A1410]' : 'text-[#7A6E5C]'}`}>{label}</span>
              {index < STEPS.length - 1 && <div className={`flex-1 h-[2px] rounded-full ${index < step ? 'bg-[#252840]' : 'bg-[#E8E4DC]'}`} />}
            </div>
          ))}
        </div>

        <div className="bg-[#FDFAF4] rounded-2xl border border-black/[0.09] p-8">
          {step === 0 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Create your account</h2>
              <p className="text-[13px] text-[#7A6E5C] -mt-2">This account is created in the SkillBridge backend.</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">First name</label>
                  <input className={inputClass} placeholder="Alice" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Last name</label>
                  <input className={inputClass} placeholder="Martin" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} />
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Email</label>
                <input className={inputClass} type="email" placeholder="alice@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Password</label>
                <input className={inputClass} type="password" placeholder="Min. 8 characters" value={form.password} onChange={(e) => set('password', e.target.value)} />
              </div>
              {error && <p className="text-[12px] text-red-500">{error}</p>}
            </div>
          )}

          {step === 1 && (
            <div className="flex flex-col gap-4">
              <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Build your profile</h2>
              <p className="text-[13px] text-[#7A6E5C] -mt-2">This bio is saved on your backend user profile.</p>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Bio</label>
                <textarea className={`${inputClass} resize-none h-28`} placeholder="Tell others what you teach and what you want to learn..." value={form.bio} onChange={(e) => set('bio', e.target.value)} />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="flex flex-col gap-5">
              <h2 className="text-[22px] font-black tracking-tight text-[#1A1410]">Your skills</h2>
              <p className="text-[13px] text-[#7A6E5C] -mt-2">These are saved as teaching skills and learning goals.</p>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#C8864B] block mb-3">I can teach ({form.teaches.length} selected)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <button key={skill} onClick={() => toggleSkill(skill, 'teaches')} className={`px-3 py-[6px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all ${form.teaches.includes(skill) ? 'bg-[#252840] text-white border-[#252840]' : 'bg-transparent text-[#7A6E5C] border-black/[0.12] hover:border-[#252840] hover:text-[#252840]'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#3D5C28] block mb-3">I want to learn ({form.wants.length} selected)</label>
                <div className="flex flex-wrap gap-2">
                  {ALL_SKILLS.map((skill) => (
                    <button key={skill} onClick={() => toggleSkill(skill, 'wants')} className={`px-3 py-[6px] rounded-full text-[12px] font-semibold border-[1.5px] cursor-pointer transition-all ${form.wants.includes(skill) ? 'bg-[#3D5C28] text-white border-[#3D5C28]' : 'bg-transparent text-[#7A6E5C] border-black/[0.12] hover:border-[#3D5C28] hover:text-[#3D5C28]'}`}>
                      {skill}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex flex-col items-center gap-4 text-center py-4">
              <h2 className="text-[24px] font-black tracking-tight text-[#1A1410]">You're all set</h2>
              <p className="text-[14px] text-[#7A6E5C] max-w-[340px] leading-[1.6]">
                Create your account and save your skills to the backend.
              </p>
              {error && <p className="text-[12px] text-red-500">{error}</p>}
            </div>
          )}

          <div className="flex gap-3 mt-6">
            {step > 0 && step < 3 && (
              <button onClick={() => setStep((value) => value - 1)} className="px-5 py-3 rounded-xl border-[1.5px] border-black/[0.09] text-[13px] font-semibold text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all font-inter">
                Back
              </button>
            )}
            {step < 2 && (
              <button onClick={() => setStep((value) => value + 1)} disabled={step === 0 && (!form.firstName || !form.lastName || !form.email || form.password.length < 8)} className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter disabled:opacity-40 disabled:cursor-not-allowed">
                Continue
              </button>
            )}
            {step === 2 && (
              <button onClick={() => setStep(3)} disabled={form.teaches.length === 0 || form.wants.length === 0} className="flex-1 py-3 rounded-xl border-none bg-[#252840] text-white text-[14px] font-bold cursor-pointer hover:bg-[#363B6B] transition-all font-inter disabled:opacity-40 disabled:cursor-not-allowed">
                Create my account
              </button>
            )}
            {step === 3 && (
              <button onClick={submit} disabled={loading} className="flex-1 py-3 rounded-xl border-none bg-[#3D5C28] text-white text-[14px] font-bold cursor-pointer hover:bg-[#4E6035] transition-all font-inter disabled:opacity-50 disabled:cursor-not-allowed">
                {loading ? 'Saving...' : 'Go to my profile ->'}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
