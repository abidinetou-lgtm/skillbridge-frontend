import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import { getApiError, matchApi } from '../services/api'

const TAG_STYLES = {
  sand: 'bg-[#FAF5E8] text-[#3D3020] border border-[rgba(223,192,128,0.5)]',
  night: 'bg-[#ECEEF8] text-[#252840]',
  sage: 'bg-[#E4EED8] text-[#3D5C28]',
}

export default function Connection() {
  const navigate = useNavigate()
  const { user, openModal } = useAuthStore()
  const [search, setSearch] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [matches, setMatches] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [busyId, setBusyId] = useState(null)

  const load = async () => {
    if (!user) {
      setSuggestions([])
      setMatches([])
      return
    }

    setLoading(true)
    setError('')
    try {
      const [nextSuggestions, myMatches] = await Promise.all([
        matchApi.suggestions(),
        matchApi.mine(),
      ])
      setSuggestions(nextSuggestions)
      setMatches(myMatches)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [user?.id])

  const requestedReceiverIds = useMemo(
    () => new Set(matches.filter((match) => match.requesterId === user?.id && match.status === 'PENDING').map((match) => match.receiverId)),
    [matches, user?.id]
  )

  const filtered = suggestions.filter((profile) => {
    const fullName = `${profile.firstName} ${profile.lastName}`.toLowerCase()
    const query = search.toLowerCase()
    return !query || fullName.includes(query) || profile.teachingSkills?.some((item) => item.skill.name.toLowerCase().includes(query))
  })

  const sendRequest = async (event, profile) => {
    event.stopPropagation()
    if (!user) {
      openModal('login')
      return
    }

    setBusyId(profile.id)
    setError('')
    try {
      const skillId = profile.teachingSkills?.[0]?.skill?.id
      await matchApi.request({ receiverId: profile.id, skillId })
      await load()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  const updateMatch = async (id, status) => {
    setBusyId(id)
    setError('')
    try {
      await matchApi.update(id, status)
      await load()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setBusyId(null)
    }
  }

  const incoming = matches.filter((match) => match.receiverId === user?.id && match.status === 'PENDING')
  const accepted = matches.filter((match) => match.status === 'ACCEPTED')

  return (
    <main className="pt-[62px] min-h-screen bg-[#F8F4EA]">
      <div className="bg-[#FDFAF4] border-b border-black/[0.09] px-20 py-10">
        <p className="text-[11px] font-bold tracking-[1.2px] uppercase text-[#C8864B] mb-2">Find your match</p>
        <h1 className="text-[38px] font-black tracking-[-1.5px] text-[#1A1410] leading-[1.05] mb-4">
          Connections <span className="text-[#252840]">for you</span>
        </h1>
        <div className="flex gap-3 max-w-[680px]">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name or skill..."
            className="w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[13px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
          />
        </div>
      </div>

      <div className="px-20 py-8 flex flex-col gap-6">
        {!user && (
          <div className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-6 text-center">
            <p className="text-[14px] text-[#7A6E5C] mb-4">Log in to load real backend match suggestions.</p>
            <button onClick={() => openModal('login')} className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer">
              Log in
            </button>
          </div>
        )}

        {error && <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-[13px] text-red-600">{error}</div>}
        {loading && <div className="text-[14px] text-[#7A6E5C]">Loading real matches...</div>}

        {user && incoming.length > 0 && (
          <section>
            <h2 className="text-[16px] font-black text-[#1A1410] mb-3">Incoming requests</h2>
            <div className="flex flex-col gap-3">
              {incoming.map((match) => {
                const requester = match.requester
                return (
                  <div key={match.id} className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5">
                    <Avatar user={requester} />
                    <div className="flex-1">
                      <div className="text-[16px] font-bold text-[#1A1410]">{requester.firstName} {requester.lastName}</div>
                      <p className="text-[13px] text-[#7A6E5C]">{match.skill?.name ? `Wants to connect for ${match.skill.name}` : 'Wants to connect'}</p>
                    </div>
                    <button onClick={() => updateMatch(match.id, 'ACCEPTED')} disabled={busyId === match.id} className="px-4 py-[9px] rounded-xl bg-[#3D5C28] text-white text-[12px] font-bold border-none cursor-pointer disabled:opacity-50">Accept</button>
                    <button onClick={() => updateMatch(match.id, 'REJECTED')} disabled={busyId === match.id} className="px-4 py-[9px] rounded-xl border border-black/[0.09] text-[#7A6E5C] text-[12px] font-bold bg-transparent cursor-pointer disabled:opacity-50">Reject</button>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {user && accepted.length > 0 && (
          <section>
            <h2 className="text-[16px] font-black text-[#1A1410] mb-3">Accepted connections</h2>
            <div className="flex flex-col gap-3">
              {accepted.map((match) => {
                const partner = match.requesterId === user.id ? match.receiver : match.requester
                return (
                  <div key={match.id} className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5">
                    <Avatar user={partner} />
                    <div className="flex-1">
                      <div className="text-[16px] font-bold text-[#1A1410]">{partner.firstName} {partner.lastName}</div>
                      <p className="text-[13px] text-[#7A6E5C]">Connected{match.conversation?.id ? ` · conversation ${match.conversation.id.slice(0, 8)}` : ''}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {user && (
          <section>
            <h2 className="text-[16px] font-black text-[#1A1410] mb-3">Suggested matches</h2>
            {!loading && filtered.length === 0 && (
              <div className="text-center py-16 text-[#7A6E5C] bg-[#FDFAF4] border border-black/[0.09] rounded-2xl">
                <p className="text-[16px] font-semibold">No real suggestions yet</p>
                <p className="text-[13px] mt-1">Add learning goals in your profile, then users who teach those skills will appear here.</p>
              </div>
            )}
            <div className="flex flex-col gap-4">
              {filtered.map((profile) => (
                <div key={profile.id} onClick={() => navigate(`/user/${profile.id}`)} className="bg-[#FDFAF4] border border-black/[0.09] rounded-2xl p-5 flex items-center gap-5 cursor-pointer hover:-translate-y-[2px] hover:shadow-[0_8px_32px_rgba(26,20,16,0.08)] transition-all group">
                  <Avatar user={profile} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[16px] font-bold text-[#1A1410] group-hover:text-[#252840] transition-all">{profile.firstName} {profile.lastName}</span>
                    </div>
                    <p className="text-[13px] text-[#7A6E5C] leading-[1.5] mb-3 line-clamp-1">{profile.bio || 'No bio yet.'}</p>
                    <div className="flex gap-6 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C]">Teaches</span>
                        <div className="flex gap-[5px] flex-wrap">
                          {profile.teachingSkills?.map((item) => (
                            <span key={item.id} className={`px-[9px] py-[3px] rounded-full text-[11px] font-semibold ${TAG_STYLES.sand}`}>{item.skill.name}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                    {requestedReceiverIds.has(profile.id) ? (
                      <div className="px-5 py-[10px] rounded-xl bg-[#E4EED8] text-[#3D5C28] text-[13px] font-bold">Request sent</div>
                    ) : (
                      <button onClick={(e) => sendRequest(e, profile)} disabled={busyId === profile.id} className="px-5 py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all whitespace-nowrap disabled:opacity-50">
                        {busyId === profile.id ? 'Sending...' : 'Request connection'}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  )
}

function Avatar({ user }) {
  const initials = `${user?.firstName?.[0] ?? ''}${user?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
  return (
    <div className="relative flex-shrink-0">
      <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-[22px] text-white bg-[#252840]">
        {initials}
      </div>
    </div>
  )
}
