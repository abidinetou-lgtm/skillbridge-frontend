import { useState, useEffect, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'
import api from '../services/api'

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function SessionRoom() {
  const { id }      = useParams()
  const navigate    = useNavigate()
  const { user }    = useAuthStore()
  const jitsiRef    = useRef(null)
  const apiRef      = useRef(null)
  const intervalRef = useRef(null)
  const pollRef     = useRef(null)

  const [session,    setSession]    = useState(null)
  const [phase,      setPhase]      = useState('waiting')
  const [seconds,    setSeconds]    = useState(0)
  const [credits,    setCredits]    = useState(user?.credits ?? 120)
  const [jitsiReady, setJitsiReady] = useState(false)
  const [rating,     setRating]     = useState(0)
  const [loadError,  setLoadError]  = useState('')
  const [joining,    setJoining]    = useState(false)

  const loadSession = async () => {
    try {
      const res = await api.get(`/sessions/${id}`)
      const s   = res.data.session ?? res.data
      return {
        id:          s.id,
        title:       s.title ?? 'Session',
        duration:    s.creditsReserved ?? 60,
        myRole:      s.teacher?.id === user?.id ? 'teacher' : 'learner',
        teacherName: `${s.teacher?.firstName ?? ''} ${s.teacher?.lastName ?? ''}`.trim(),
        studentName: `${s.learner?.firstName ?? ''} ${s.learner?.lastName ?? ''}`.trim(),
        jitsiRoomId: s.jitsiRoomId,
        status:      s.status,
      }
    } catch {
      setLoadError('Session introuvable ou accès refusé.')
      return null
    }
  }

  useEffect(() => {
    loadSession().then(s => { if (s) setSession(s) })
  }, [id, user?.id])

  useEffect(() => { setJitsiReady(true) }, [])

  // Learner : polling pour rejoindre auto quand teacher démarre
  useEffect(() => {
    if (!session || phase !== 'waiting' || session.myRole === 'teacher') return
    pollRef.current = setInterval(async () => {
      const s = await loadSession()
      if (s?.status === 'ACTIVE') {
        clearInterval(pollRef.current)
        launchJitsi(s.jitsiRoomId)
      }
    }, 2000)
    return () => clearInterval(pollRef.current)
  }, [session?.id, phase])

  useEffect(() => {
    if (phase === 'active') {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [phase])

  useEffect(() => {
    return () => {
      if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
      clearInterval(intervalRef.current)
      clearInterval(pollRef.current)
    }
  }, [])

  const isTeacher   = session?.myRole === 'teacher'
  const cost        = Math.ceil(seconds / 60)
  const creditDelta = isTeacher ? `+${cost}` : `-${cost}`
  const deltaColor  = isTeacher ? 'text-[#3D5C28]' : 'text-[#C8864B]'

    const launchJitsi = (roomName) => {
    if (!jitsiRef.current) return
    if (apiRef.current) { apiRef.current.dispose?.(); apiRef.current = null }

    const displayName = encodeURIComponent(`${user?.firstName ?? ''} ${user?.lastName ?? ''}`.trim())

    // Paramètres passés directement dans l'URL pour bypasser la page prejoin
    const params = [
      'config.prejoinPageEnabled=false',
      'config.startWithAudioMuted=false',
      'config.startWithVideoMuted=false',
      'config.disableDeepLinking=true',
      'config.enableWelcomePage=false',
      'config.enableLobbyChat=false',
      'config.requireDisplayName=false',
      'config.disableInviteFunctions=true',
      'interfaceConfig.SHOW_JITSI_WATERMARK=false',
      'interfaceConfig.TOOLBAR_ALWAYS_VISIBLE=true',
      'interfaceConfig.DISABLE_JOIN_LEAVE_NOTIFICATIONS=true',
      `userInfo.displayName=${displayName}`,
    ].join('&')

    const src = `https://meet.jit.si/${roomName}#${params}`

    // Créer un iframe directement — bypasse complètement la page pré-join
    const iframe = document.createElement('iframe')
    iframe.src              = src
    iframe.allow            = 'camera; microphone; display-capture; autoplay; clipboard-write'
    iframe.style.width      = '100%'
    iframe.style.height     = '100%'
    iframe.style.border     = 'none'
    iframe.style.background = '#1A1410'

    jitsiRef.current.innerHTML = ''
    jitsiRef.current.appendChild(iframe)

    // Stocker une ref pour pouvoir "disposer"
    apiRef.current = { dispose: () => { iframe.src = 'about:blank'; iframe.remove() } }

    // Passer en phase active dès que l'iframe charge
    iframe.addEventListener('load', () => {
      setTimeout(() => setPhase('active'), 1000)
    })
  }
  }

  const startJitsi = async () => {
    if (!jitsiReady || !session || joining) return
    setJoining(true)
    let roomName = session.jitsiRoomId ?? `skillbridge-${id}`
    try {
      const res = await api.post(`/sessions/${id}/join`)
      if (res.data.jitsiRoomId) roomName = res.data.jitsiRoomId
    } catch (e) {
      console.warn('join error:', e)
    }
    launchJitsi(roomName)
    setJoining(false)
  }

  const handleEndSession = async () => {
    if (apiRef.current) { apiRef.current.dispose(); apiRef.current = null }
    clearInterval(intervalRef.current)
    clearInterval(pollRef.current)
    try {
      await api.post(`/sessions/${id}/end`, { durationSeconds: seconds })
    } catch (e) { console.warn('end error:', e) }
    setPhase('ended')
  }

  if (loadError) return (
    <main className="pt-[62px] min-h-screen bg-[#1A1410] flex flex-col items-center justify-center gap-4">
      <p className="text-white/60 text-[16px]">{loadError}</p>
      <button onClick={() => navigate('/sessions')}
        className="px-6 py-3 rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer">
        Retour aux sessions
      </button>
    </main>
  )

  if (!session) return (
    <main className="pt-[62px] min-h-screen bg-[#1A1410] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-white/50 text-[14px]">Chargement…</p>
      </div>
    </main>
  )

  return (
    <main className="pt-[62px] min-h-screen bg-[#1A1410] flex flex-col">

      {/* Topbar */}
      <div className="bg-[#1E2035] border-b border-white/[0.07] px-6 py-3 flex items-center gap-4 flex-shrink-0">
        <button onClick={() => { if (phase === 'active') handleEndSession(); else navigate('/sessions') }}
          className="text-white/50 hover:text-white bg-transparent border-none cursor-pointer transition-all">
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <path d="M11 3L6 9l5 6"/>
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <div className="text-white font-bold text-[14px] truncate">{session.title}</div>
          <div className="text-white/40 text-[11px]">
            {isTeacher ? 'Donneur' : 'Receveur'} · {isTeacher ? session.studentName : session.teacherName}
          </div>
        </div>
        {phase === 'active' && (
          <div className="flex items-center gap-3 bg-white/[0.06] px-4 py-2 rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <span className="text-white font-black text-[18px] tabular-nums">{fmt(seconds)}</span>
            <span className={`text-[13px] font-bold ${deltaColor}`}>{creditDelta} cr</span>
          </div>
        )}
        <div className="bg-white/[0.06] px-4 py-2 rounded-full">
          <span className="text-white/60 text-[11px]">Balance: </span>
          <span className="text-white font-bold text-[13px]">{Math.floor(credits)} cr</span>
        </div>
      </div>

      {/* Zone principale */}
      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 relative" ref={jitsiRef}>

          {/* Waiting */}
          {phase === 'waiting' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 bg-[#1A1410]">
              <div className="w-20 h-20 rounded-full bg-white/[0.06] flex items-center justify-center">
                <svg width="36" height="36" viewBox="0 0 36 36" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
                  <rect x="3" y="7" width="22" height="22" rx="4"/>
                  <path d="M25 14l8-5v18l-8-5"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-bold text-[20px] mb-2">{session.title}</p>
                <p className="text-white/50 text-[14px] mb-1">
                  {isTeacher ? `Receveur : ${session.studentName}` : `Donneur : ${session.teacherName}`}
                </p>
                <p className="text-white/40 text-[12px]">
                  {session.duration} crédits réservés · {isTeacher ? 'Vous allez gagner des crédits' : 'Crédits réservés'}
                </p>
              </div>

              {isTeacher ? (
                <button onClick={startJitsi} disabled={!jitsiReady || joining}
                  className="px-8 py-4 rounded-2xl bg-[#3D5C28] text-white text-[15px] font-bold border-none cursor-pointer hover:bg-[#4E6035] transition-all disabled:opacity-40 flex items-center gap-3">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                    <rect x="2" y="5" width="13" height="13" rx="3"/><path d="M15 8l5-3v10l-5-3"/>
                  </svg>
                  {joining ? 'Connexion…' : jitsiReady ? 'Démarrer la session' : 'Chargement…'}
                </button>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="flex items-center gap-3 bg-white/[0.06] px-6 py-3 rounded-full">
                    <div className="w-2 h-2 rounded-full bg-[#C8864B] animate-pulse" />
                    <span className="text-white/70 text-[13px]">En attente que le donneur démarre…</span>
                  </div>
                  <button onClick={startJitsi} disabled={!jitsiReady || joining}
                    className="px-6 py-3 rounded-xl border-[1.5px] border-white/20 text-white text-[13px] font-semibold bg-transparent cursor-pointer hover:border-white transition-all disabled:opacity-40">
                    {joining ? 'Connexion…' : 'Rejoindre maintenant'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Ended */}
          {phase === 'ended' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 z-10 bg-[#1A1410]">
              <div className="w-16 h-16 rounded-full bg-[#3D5C28]/30 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" stroke="#86C46E" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M5 14l6 6L23 8"/>
                </svg>
              </div>
              <div className="text-center">
                <p className="text-white font-black text-[24px] mb-2">Session terminée !</p>
                <p className="text-white/50 text-[15px]">
                  Durée : {fmt(seconds)} · <span className={deltaColor}>{isTeacher ? `+${cost} crédits gagnés` : `${cost} crédits dépensés`}</span>
                </p>
              </div>
              {!isTeacher && (
                <div className="text-center">
                  <p className="text-white/60 text-[13px] mb-3">Évaluer cette session</p>
                  <div className="flex gap-2">
                    {[1,2,3,4,5].map(s => (
                      <button key={s} onClick={() => setRating(s)}
                        className={`w-11 h-11 rounded-xl text-[16px] font-bold cursor-pointer transition-all border-none
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
                  Retour aux sessions
                </button>
                <button onClick={() => navigate('/chat')}
                  className="px-6 py-3 rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
                  Continuer dans le chat
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        {phase === 'active' && (
          <div className="w-[220px] bg-[#1E2035] border-l border-white/[0.07] flex flex-col p-5 gap-4 flex-shrink-0">
            <h3 className="text-white font-bold text-[13px]">Session info</h3>
            <div className="flex flex-col">
              {[
                { label: 'Durée',    value: fmt(seconds) },
                { label: 'Crédits', value: `${creditDelta} (${Math.floor(credits)} restants)` },
                { label: 'Rôle',    value: isTeacher ? 'Donneur' : 'Receveur' },
                { label: 'Réservés',value: `${session.duration} cr` },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center py-[10px] border-b border-white/[0.06] last:border-0">
                  <span className="text-white/40 text-[11px]">{row.label}</span>
                  <span className="text-white text-[12px] font-semibold">{row.value}</span>
                </div>
              ))}
            </div>
            <button onClick={handleEndSession}
              className="mt-auto w-full py-3 rounded-xl bg-red-500 text-white text-[13px] font-bold border-none cursor-pointer hover:bg-red-600 transition-all">
              Terminer la session
            </button>
          </div>
        )}
      </div>
    </main>
  )
