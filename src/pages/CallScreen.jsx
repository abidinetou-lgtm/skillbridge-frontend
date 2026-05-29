import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getApiError, sessionApi } from '../services/api'

export default function CallScreen() {
  const navigate = useNavigate()
  const location = useLocation()
  const session = location.state?.session
  const partner = location.state?.partner
  const [joining, setJoining] = useState(false)
  const [ending, setEnding] = useState(false)
  const [joined, setJoined] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!session?.id) return

    let mounted = true
    setJoining(true)
    setError('')

    sessionApi.join(session.id)
      .then((data) => {
        if (mounted) setJoined(data)
      })
      .catch((err) => {
        if (mounted) setError(getApiError(err))
      })
      .finally(() => {
        if (mounted) setJoining(false)
      })

    return () => {
      mounted = false
    }
  }, [session?.id])

  const endSession = async () => {
    if (!session?.id || ending) return
    setEnding(true)
    setError('')
    try {
      await sessionApi.end(session.id)
      navigate('/chat')
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setEnding(false)
    }
  }

  if (!session?.id) {
    return (
      <div className="fixed inset-0 bg-[#111320] flex items-center justify-center p-6">
        <div className="max-w-[460px] text-center">
          <h1 className="text-white font-black text-[24px] mb-3">No session selected</h1>
          <p className="text-white/50 text-[14px] leading-[1.7] mb-6">
            Start a real session from an existing backend conversation.
          </p>
          <button onClick={() => navigate('/chat')} className="px-5 py-3 rounded-xl bg-white text-[#111320] text-[13px] font-bold border-none cursor-pointer">
            Back to chat
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-[#111320] flex flex-col">
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div>
          <div className="text-white font-bold text-[14px]">{session.title}</div>
          <div className="text-white/40 text-[11px]">
            {partner ? `With ${partner.firstName} ${partner.lastName}` : 'SkillBridge session'}
          </div>
        </div>
        <button
          onClick={endSession}
          disabled={ending}
          className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white text-[13px] font-bold border-none cursor-pointer disabled:opacity-50"
        >
          {ending ? 'Ending...' : 'End session'}
        </button>
      </div>

      {error && <div className="mx-6 mb-3 rounded-xl bg-red-500/15 border border-red-400/30 px-4 py-3 text-red-200 text-[13px]">{error}</div>}

      <div className="flex-1 px-6 pb-6">
        <div className="w-full h-full rounded-2xl overflow-hidden bg-[#1E2035] flex items-center justify-center">
          {joining && <p className="text-white/60 text-[14px]">Joining session...</p>}
          {!joining && joined?.jitsiUrl && (
            <iframe
              title="SkillBridge video session"
              src={joined.jitsiUrl}
              allow="camera; microphone; fullscreen; display-capture"
              className="w-full h-full border-0"
            />
          )}
          {!joining && !joined?.jitsiUrl && !error && (
            <p className="text-white/60 text-[14px]">Session room is unavailable.</p>
          )}
        </div>
      </div>
    </div>
  )
}
