import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getApiError, userApi } from '../services/api'

const TAG_STYLES = {
  sand: 'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  warm: 'bg-[#F8EDD8] text-[#8C5A1E]',
}

export default function Profile() {
  const navigate = useNavigate()
  const { user: authUser, setUser, logout } = useAuthStore()
  const [user, setLocalUser] = useState(authUser)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [editOpen, setEditOpen] = useState(false)
  const [newSkill, setNewSkill] = useState('')
  const [newGoal, setNewGoal] = useState('')
  const [editForm, setEditForm] = useState({
    firstName: authUser?.firstName ?? '',
    lastName: authUser?.lastName ?? '',
    bio: authUser?.bio ?? '',
  })

  const loadProfile = async () => {
    setLoading(true)
    setError('')
    try {
      const profile = await userApi.me()
      setLocalUser(profile)
      setUser(profile)
      setEditForm({
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        bio: profile.bio ?? '',
      })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadProfile()
  }, [])

  const saveProfile = async () => {
    setSaving(true)
    setError('')
    try {
      const updated = await userApi.updateMe(editForm)
      setLocalUser(updated)
      setUser(updated)
      setEditOpen(false)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const addTeachingSkill = async () => {
    if (!newSkill.trim()) return
    setSaving(true)
    setError('')
    try {
      await userApi.addSkill({ name: newSkill.trim() })
      setNewSkill('')
      await loadProfile()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const addGoal = async () => {
    if (!newGoal.trim()) return
    setSaving(true)
    setError('')
    try {
      await userApi.addLearningGoal({ name: newGoal.trim() })
      setNewGoal('')
      await loadProfile()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSaving(false)
    }
  }

  const removeSkill = async (id) => {
    await userApi.deleteSkill(id)
    await loadProfile()
  }

  const removeGoal = async (id) => {
    await userApi.deleteLearningGoal(id)
    await loadProfile()
  }

  if (loading) {
    return <main className="pt-[62px] min-h-screen bg-[#F8F4EA] flex items-center justify-center text-[#7A6E5C]">Loading profile...</main>
  }

  if (!user) {
    return <main className="pt-[62px] min-h-screen bg-[#F8F4EA] flex items-center justify-center text-red-500">{error || 'Profile unavailable'}</main>
  }

  const initials = `${user.firstName?.[0] ?? ''}${user.lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">
      {editOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && setEditOpen(false)}>
          <div className="bg-[#FDFAF4] rounded-2xl p-8 w-full max-w-[560px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-[20px] font-black text-[#1A1410]">Edit your profile</h2>
              <button onClick={() => setEditOpen(false)} className="w-8 h-8 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C]">x</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <input className="w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] outline-none" value={editForm.firstName} onChange={(e) => setEditForm((p) => ({ ...p, firstName: e.target.value }))} />
              <input className="w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] outline-none" value={editForm.lastName} onChange={(e) => setEditForm((p) => ({ ...p, lastName: e.target.value }))} />
            </div>
            <textarea className="w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] outline-none resize-none h-24 mb-4" value={editForm.bio ?? ''} onChange={(e) => setEditForm((p) => ({ ...p, bio: e.target.value }))} />
            {error && <p className="text-[12px] text-red-500 mb-3">{error}</p>}
            <button onClick={saveProfile} disabled={saving} className="w-full py-3 rounded-xl bg-[#252840] text-white text-[14px] font-bold border-none cursor-pointer disabled:opacity-50">
              {saving ? 'Saving...' : 'Save changes'}
            </button>
          </div>
        </div>
      )}

      <div className="h-[200px] bg-gradient-to-br from-[#252840] via-[#363B6B] to-[#C8864B]" />

      <div className="px-20 relative">
        <div className="flex items-end justify-between -mt-[52px] mb-6">
          <div className="w-[104px] h-[104px] rounded-full border-4 border-[#F8F4EA] overflow-hidden bg-[#252840] flex items-center justify-center font-black text-[36px] text-white">
            {initials}
          </div>
          <div className="flex gap-3 mb-2">
            <button onClick={() => setEditOpen(true)} className="px-4 py-2 rounded-full text-[12px] font-semibold border-[1.5px] border-black/[0.09] text-[#7A6E5C] bg-transparent cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all">
              Edit profile
            </button>
            <button onClick={() => { logout(); navigate('/') }} className="px-4 py-2 rounded-full text-[12px] font-semibold border-[1.5px] border-red-200 text-red-500 bg-transparent cursor-pointer">
              Log out
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[1fr_300px] gap-10 items-start pb-16">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#1A1410]">{user.firstName} {user.lastName}</h1>
            <p className="text-[14px] text-[#7A6E5C] mt-1">{user.email}</p>
            <p className="text-[14px] text-[#3D3020] leading-[1.6] mt-3 max-w-[520px]">{user.bio || 'No bio yet.'}</p>

            {error && <p className="text-[13px] text-red-500 mt-4">{error}</p>}

            <div className="grid grid-cols-2 gap-10 mt-8">
              <section>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">I teach</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {user.teachingSkills?.length ? user.teachingSkills.map((item) => (
                    <button key={item.id} onClick={() => removeSkill(item.id)} title="Remove skill" className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold cursor-pointer ${TAG_STYLES.sand}`}>
                      {item.skill.name}
                    </button>
                  )) : <span className="text-[13px] text-[#7A6E5C]">No teaching skills yet.</span>}
                </div>
                <div className="flex gap-2">
                  <input value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill" className="flex-1 px-3 py-2 rounded-xl border border-black/[0.09] bg-[#FDFAF4] text-[13px] outline-none" />
                  <button onClick={addTeachingSkill} disabled={saving} className="px-4 py-2 rounded-xl bg-[#252840] text-white text-[12px] font-bold border-none cursor-pointer disabled:opacity-50">Add</button>
                </div>
              </section>

              <section>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">I want to learn</p>
                <div className="flex gap-2 flex-wrap mb-4">
                  {user.learningGoals?.length ? user.learningGoals.map((item) => (
                    <button key={item.id} onClick={() => removeGoal(item.id)} title="Remove goal" className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold cursor-pointer ${TAG_STYLES.warm}`}>
                      {item.skill.name}
                    </button>
                  )) : <span className="text-[13px] text-[#7A6E5C]">No learning goals yet.</span>}
                </div>
                <div className="flex gap-2">
                  <input value={newGoal} onChange={(e) => setNewGoal(e.target.value)} placeholder="Add goal" className="flex-1 px-3 py-2 rounded-xl border border-black/[0.09] bg-[#FDFAF4] text-[13px] outline-none" />
                  <button onClick={addGoal} disabled={saving} className="px-4 py-2 rounded-xl bg-[#3D5C28] text-white text-[12px] font-bold border-none cursor-pointer disabled:opacity-50">Add</button>
                </div>
              </section>
            </div>
          </div>

          <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6 flex flex-col gap-4 sticky top-20">
            <h3 className="text-[14px] font-bold text-[#1A1410]">Your stats</h3>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#7A6E5C]">Credits</span>
              <span className="text-[14px] font-bold text-[#252840]">{user.credits ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#7A6E5C]">Teaching skills</span>
              <span className="text-[14px] font-bold text-[#3D5C28]">{user.teachingSkills?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-[#7A6E5C]">Learning goals</span>
              <span className="text-[14px] font-bold text-[#C8864B]">{user.learningGoals?.length ?? 0}</span>
            </div>
            <div className="pt-2 border-t border-black/[0.07]">
              <button onClick={() => navigate('/connection')} className="w-full py-[10px] rounded-[10px] bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                Find a connection
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
