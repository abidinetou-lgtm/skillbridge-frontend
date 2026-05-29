import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getApiError, matchApi, userApi } from '../services/api'

const TAG_STYLES = {
  sand: 'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  warm: 'bg-[#F8EDD8] text-[#8C5A1E]',
}

export default function UserProfile() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user, openModal } = useAuthStore()
  const [profile, setProfile] = useState(null)
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const [nextProfile, myMatches] = await Promise.all([
        userApi.getById(id),
        user ? matchApi.mine() : Promise.resolve([]),
      ])
      setProfile(nextProfile)
      setMatches(myMatches)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [id, user?.id])

  const existingMatch = matches.find((match) =>
    (match.requesterId === user?.id && match.receiverId === id) ||
    (match.receiverId === user?.id && match.requesterId === id)
  )

  const handleRequest = async () => {
    if (!user) {
      openModal('login')
      return
    }

    setBusy(true)
    setError('')
    try {
      const skillId = profile?.teachingSkills?.[0]?.skill?.id
      await matchApi.request({ receiverId: profile.id, skillId })
      await load()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setBusy(false)
    }
  }

  if (loading) {
    return <main className="pt-[62px] min-h-screen bg-[#F8F4EA] flex items-center justify-center text-[#7A6E5C]">Loading profile...</main>
  }

  if (!profile) {
    return (
      <main className="pt-[62px] min-h-screen bg-[#F8F4EA] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[16px] font-semibold text-[#1A1410]">{error || 'Profile not found'}</p>
          <button onClick={() => navigate('/connection')} className="mt-4 text-[#252840] font-bold bg-transparent border-none cursor-pointer text-[14px]">Back to connections</button>
        </div>
      </main>
    )
  }

  const initials = `${profile.firstName?.[0] ?? ''}${profile.lastName?.[0] ?? ''}`.toUpperCase() || 'U'

  return (
    <main className="pt-[62px] min-h-screen bg-white">
      <div className="h-[180px] bg-gradient-to-br from-[#252840] via-[#363B6B] to-[#C8864B]" />

      <div className="px-20">
        <div className="-mt-12 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white flex items-center justify-center font-black text-[32px] text-white bg-[#252840]">
            {initials}
          </div>
        </div>

        <div className="flex items-center gap-3 mb-6">
          {!existingMatch && (
            <button onClick={handleRequest} disabled={busy || profile.id === user?.id} className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50">
              {busy ? 'Sending...' : 'Request connection'}
            </button>
          )}
          {existingMatch?.status === 'PENDING' && (
            <div className="px-5 py-[10px] rounded-xl bg-[#ECEEF8] text-[#252840] text-[13px] font-bold">Request pending</div>
          )}
          {existingMatch?.status === 'ACCEPTED' && (
            <button onClick={() => navigate('/chat')} className="px-5 py-[10px] rounded-xl bg-[#3D5C28] text-white text-[13px] font-bold border-none cursor-pointer">Message</button>
          )}
          <button onClick={() => navigate(-1)} className="px-5 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] text-[#7A6E5C] text-[13px] font-semibold bg-transparent cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all">
            Back
          </button>
        </div>

        {error && <p className="text-[13px] text-red-500 mb-4">{error}</p>}

        <div className="grid grid-cols-[1fr_320px] gap-10 pb-16">
          <div>
            <h1 className="text-[28px] font-black tracking-tight text-[#1A1410]">{profile.firstName} {profile.lastName}</h1>
            <p className="text-[15px] text-[#3D3020] leading-[1.7] mb-6 max-w-[560px] mt-4">{profile.bio || 'No bio yet.'}</p>

            <div className="flex gap-10 mb-8">
              <div>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">Teaches</p>
                <div className="flex gap-2 flex-wrap">
                  {profile.teachingSkills?.length ? profile.teachingSkills.map((item) => (
                    <span key={item.id} className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${TAG_STYLES.sand}`}>{item.skill.name}</span>
                  )) : <span className="text-[13px] text-[#7A6E5C]">No teaching skills listed.</span>}
                </div>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.8px] uppercase text-[#7A6E5C] mb-3">Wants to learn</p>
                <div className="flex gap-2 flex-wrap">
                  {profile.learningGoals?.length ? profile.learningGoals.map((item) => (
                    <span key={item.id} className={`px-[11px] py-[5px] rounded-full text-[12px] font-semibold ${TAG_STYLES.warm}`}>{item.skill.name}</span>
                  )) : <span className="text-[13px] text-[#7A6E5C]">No learning goals listed.</span>}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6 h-fit">
            <h3 className="text-[14px] font-bold text-[#1A1410] mb-4">Backend profile</h3>
            <div className="flex items-center justify-between py-2 border-b border-black/[0.06]">
              <span className="text-[13px] text-[#7A6E5C]">Teaching skills</span>
              <span className="text-[14px] font-bold text-[#3D5C28]">{profile.teachingSkills?.length ?? 0}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-[13px] text-[#7A6E5C]">Learning goals</span>
              <span className="text-[14px] font-bold text-[#C8864B]">{profile.learningGoals?.length ?? 0}</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
