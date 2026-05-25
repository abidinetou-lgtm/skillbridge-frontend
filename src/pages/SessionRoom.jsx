// src/pages/SessionRoom.jsx
// Salle de session : timer, crédits en direct, Jitsi Meet intégré
// Jitsi ne nécessite AUCUNE dépendance npm — on utilise l'API iframe officielle

import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

// TODO API: GET /api/sessions/:id
const MOCK_SESSION = {
  id: 's1',
  title: 'Maths — Dérivées & Intégrales',
  category: 'Mathematics',
  teacherName: 'Vous',
  studentName: 'Léa Arnaud',
  studentInitials: 'LA',
  studentColor: '#252840',
  date: '2026-05-22',
  time: '15:00',
  duration: 60,
  creditsPerMin: 1,
  status: 'upcoming',
  myRole: 'teacher',
}

const fmt = (s) => `${String(Math.floor(s / 60)).padStart(2,'0')}:${String(s % 60).padStart(2,'0')}`

export default function SessionRoom() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const jitsiRef = useRef(null)
  const apiRef   = useRef(null)
  const intervalRef = useRef(null)

  const [session]       = useState(MOCK_SESSION)
  const [phase, setPhase] = useState('waiting') // waiting | active | ended
  const [seconds, setSeconds] = useState(0)
  const [credits, setCredits] = useState(user?.credits ?? 120)
  const [partnerOnline, setPartnerOnline] = useState(false)
  const [jitsiReady, setJitsiReady] = useState(false)
  const [rating, setRating] = useState(0)

  const mins         = Math.ceil(seconds / 60)
  const cost         = mins * session.creditsPerMin
  const isTeacher    = session.myRole === 'teacher'
  const creditDelta  = isTeacher ? `+${cost}` : `-${cost}`
  const deltaColor   = isTeacher ? 'text-[#3D5C28]' : 'text-[#C8864B]'

  // Charger le script Jitsi Meet une seule fois
  useEffect(() => {
    if (window.JitsiMeetExternalAPI) { setJitsiReady(true); return }
    const script = document.createElement('script')
    script.src = 'https://meet.jit.si/external_api.js'
    script.onload = () => setJitsiReady(true)
    document.head.appendChild(script)
    return () => {}
  }, [])

  // Timer
  useEffect(() => {
    if (phase === 'active') {
      intervalRef.current = setInterval(() => {
        setSeconds(s => s + 1)
        if (!isTeacher) setCredits(c => Math.max(0, c - session.creditsPerMin / 60))
        // TODO SOCKET: socket.emit('session:tick', { sessionId: id, seconds })
      }, 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [phase])

  // Initialiser Jitsi quand l'utilisateur démarre l'appel
  const startJitsi = () => {
    if (!jitsiReady || !jitsiRef.current) return
    if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }

    const roomName = `skillbridge-session-${id}`
    const displayName = user?.prenom ?? 'User'

    apiRef.current = new window.JitsiMeetExternalAPI('meet.jit.si', {
      roomName,
      parentNode: jitsiRef.current,
      width: '100%',
      height: '100%',
      userInfo: { displayName, email: user?.email ?? '' },
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        prejoinPageEnabled: false,
        disableDeepLinking: true,
        toolbarButtons: [
          'microphone','camera','chat','desktop','hangup',
          'participants-pane','tileview','fullscreen',
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        DEFAULT_BACKGROUND: '#1A1410',
        TOOLBAR_ALWAYS_VISIBLE: true,
      },
    })

    apiRef.current.addEventListener('videoConferenceJoined', () => {
      setPhase('active')
      setPartnerOnline(true)
      // TODO SOCKET: socket.emit('session:joined', { sessionId: id, userId: user?.id })
    })

    apiRef.current.addEventListener('videoConferenceLeft', () => {
      handleEndSession()
    })

    apiRef.current.addEventListener('participantJoined', () => {
      setPartnerOnline(true)
    })

    apiRef.current.addEventListener('participantLeft', () => {
      setPartnerOnline(false)
    })
  }

  const handleEndSession = () => {
    if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
    clearInterval(intervalRef.current)
    setPhase('ended')
    // TODO API: POST /api/sessions/:id/end { duration: seconds }
    // TODO SOCKET: socket.emit('session:ended', { sessionId: id, duration: seconds })
  }

  useEffect(() => {
    return () => {
      if (apiRef.current) apiRef.current.dispose()
      clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <main className="pt-[62px] min-h-screen bg-[#1A1410] flex flex-col">

      {/* Topbar */}
      <div className="bg-[#1E2035] border-b border-white/[0.07] px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => { if (phase === 'active') handleEndSession(); else navigate('/sessions') }}
          className="text-white/50 hover:text-white bg-transparent border-none cursor-pointer transition-all">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M11 3L6 9l5 6"/></svg>
        </button>

        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-[14px] truncate">{session.title}</div>
          <div className="text-white/40 text-[11px]">
            {session.category} · {isTeacher ? 'Teaching' : 'Learning'}
          </div>
        </div>

        {/* Partner status */}
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${partnerOnline ? 'bg-[#3D5C28]' : 'bg-white/20'}`} />
          <span className="text-white/50 text-[12px]">
            {session.myRole === 'teacher' ? session.studentName : session.teacherName}
            {partnerOnline ? ' · connected' : ' · waiting'}
          </span>
        </div>

        {/* Timer */}
        {phase === 'active' && (
          <div className="flex items-center gap-3 bg-white/[0.06] px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-white font-black text-[18px] tabular-nums">{fmt(seconds)}</span>
            <span className={`text-[13px] font-bold tabular-nums ${deltaColor}`}>{creditDelta} cr</span>
          </div>
        )}

        {/* Credits restants */}
        <div className="bg-white/[0.06] px-4 py-2 rounded-full">
          <span className="text-white/60 text-[11px]">Balance: </span>
          <span className="text-white font-bold text-[13px]">{Math.floor(credits)} cr</span>
        </div>
      </div>

      {/* ZONE PRINCIPALE */}
      <div className="flex-1 flex overflow-hidden">

        {/* Jitsi ou waiting screen */}
        <div className="flex-1 relative" ref={jitsiRef}>
          {phase !== 'active' && phase !== 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="7" width="22" height="22" rx="4"/>
                  <path d="M25 14l8-5v18l-8-5"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-[18px] mb-2">{session.title}</p>
                <p className="text-white/50 text-[14px] mb-1">
                  {session.date} at {session.time} · {session.duration} min
                </p>
                <p className="text-white/40 text-[12px]">
                  {session.creditsPerMin} credit/min · est. {session.duration * session.creditsPerMin} credits total
                </p>
              </div>
              <button onClick={startJitsi} disabled={!jitsiReady}
                className="px-8 py-4 rounded-2xl bg-[#3D5C28] text-white text-[15px] font-bold border-none cursor-pointer hover:bg-[#4E6035] transition-all disabled:opacity-40 flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="2" y="5" width="13" height="13" rx="3"/>
                  <path d="M15 8l5-3v10l-5-3"/>
                </svg>
                {jitsiReady ? 'Start session' : 'Loading…'}
              </button>
            </div>
          )}

          {/* ENDED */}
          {phase === 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6">
              <div className="w-16 h-16 rounded-full bg-[#3D5C28]/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#3D5C28" strokeWidth="2" strokeLinecap="round"><path d="M5 14l6 6L23 8"/></svg>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-[22px] mb-2">Session complete</p>
                <p className="text-white/50 text-[14px]">Duration: {fmt(seconds)} · {cost} credits {isTeacher ? 'earned' : 'spent'}</p>
              </div>

              {/* Rating — uniquement pour l'élève */}
              {!isTeacher && (
                <div className="text-center">
                  <p className="text-white/60 text-[13px] mb-3">Rate this session</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)}
                        className={`w-10 h-10 rounded-xl border-[1.5px] text-[14px] font-bold cursor-pointer transition-all border-none
                          ${s <= rating ? 'bg-[#252840] text-white' : 'bg-white/[0.08] text-white/40 hover:bg-white/20 hover:text-white'}`}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button onClick={() => navigate('/sessions')}
                  className="px-6 py-3 rounded-xl border-[1.5px] border-white/20 text-white text-[13px] font-semibold bg-transparent cursor-pointer hover:border-white transition-all">
                  Back to sessions
                </button>
                <button onClick={() => navigate('/chat')}
                  className="px-6 py-3 rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                  Continue in chat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar infos */}
        {phase === 'active' && (
          <div className="w-[240px] bg-[#1E2035] border-l border-white/[0.07] flex flex-col p-5 gap-4 flex-shrink-0">
            <h3 className="text-white font-bold text-[13px]">Session info</h3>
            <div className="flex flex-col gap-2">
              {[
                { label:'Duration',  value: fmt(seconds)                        },
                { label:'Credits',   value: `${creditDelta} (${Math.floor(credits)} left)` },
                { label:'Role',      value: isTeacher ? 'Teacher' : 'Student'   },
                { label:'Est. total',value: `${session.duration * session.creditsPerMin} cr` },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-2 border-b border-white/[0.06] last:border-0">
                  <span className="text-white/40 text-[11px]">{row.label}</span>
                  <span className="text-white text-[12px] font-semibold">{row.value}</span>
                </div>
              ))}
            </div>

            <button onClick={handleEndSession}
              className="mt-auto w-full py-3 rounded-xl bg-red-500 text-white text-[13px] font-bold border-none cursor-pointer hover:bg-red-600 transition-all">
              End session
            </button>
          </div>
        )}
      </div>
    </main>
  )
}