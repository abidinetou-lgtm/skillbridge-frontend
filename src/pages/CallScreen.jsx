// src/pages/CallScreen.jsx
// Interface d'appel plein écran — vocal ou vidéo
// Lancée depuis Chat.jsx quand un appel démarre
// L'enseignant (teacher) est "admin" → peut partager son écran
// L'apprenant (learner) voit le flux + peut demander la parole
//
// Dev 3 → brancher WebRTC + Socket.io (marqués TODO Dev 3)
// Dev 2 → POST /api/sessions/end au raccrochage (marqué TODO Dev 2)

import { useState, useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

// ── Icônes SVG inline — aucun emoji ──────────────────────────────────────
function IconMic({ muted }) {
  return muted ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M7 7v3a3 3 0 006 0V7"/>
      <path d="M10 16v3M7 19h6"/>
      <path d="M3 3l14 14"/>
      <rect x="7" y="3" width="6" height="10" rx="3"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="7" y="2" width="6" height="10" rx="3"/>
      <path d="M4 10a6 6 0 0012 0"/>
      <path d="M10 16v3M7 19h6"/>
    </svg>
  )
}

function IconCamera({ off }) {
  return off ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 6h10l2-2h3v10h-3l-2-2H2z"/>
      <path d="M2 2l16 16"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M2 6h10l2-2h3v10h-3l-2-2H2z"/>
    </svg>
  )
}

function IconShare() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <rect x="2" y="4" width="13" height="10" rx="2"/>
      <path d="M15 8l3-3v9l-3-3"/>
      <path d="M6 14v3M4 17h8"/>
    </svg>
  )
}

function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="currentColor">
      <path d="M17.4 14.9l-2.1-.3a1.5 1.5 0 00-1.3.5l-1.5 1.5a11.3 11.3 0 01-4.8-4.8l1.5-1.5a1.5 1.5 0 00.5-1.3l-.3-2A1.5 1.5 0 008 5.5H6A1.5 1.5 0 004.5 7C4.5 13.9 9.1 18.5 16 18.5A1.5 1.5 0 0017.5 17v-2a1.5 1.5 0 00-1.1-1.1z"/>
    </svg>
  )
}

function IconRaise() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M10 2v10M7 5L10 2l3 3"/>
      <path d="M6 8H4a2 2 0 00-2 2v6a2 2 0 002 2h12a2 2 0 002-2v-6a2 2 0 00-2-2h-2"/>
    </svg>
  )
}

function IconPeople() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <circle cx="7" cy="7" r="3"/>
      <path d="M1 17a6 6 0 0112 0"/>
      <circle cx="15" cy="6" r="2.5"/>
      <path d="M13 17a4 4 0 016 0"/>
    </svg>
  )
}

function IconClock() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="7" cy="7" r="5.5"/>
      <path d="M7 4v3l2 2"/>
    </svg>
  )
}

// ── Format timer ──────────────────────────────────────────────────────────
const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// ── Composant avatar / flux vidéo ─────────────────────────────────────────
function ParticipantTile({ participant, isLarge, isSpeaking, videoRef }) {
  return (
    <div className={`relative rounded-2xl overflow-hidden flex items-center justify-center
      ${isLarge ? 'w-full h-full' : 'w-full h-full'}
      ${isSpeaking ? 'ring-2 ring-[#3D5C28]' : ''}
      bg-[#1E2035]
    `}>
      {/* Flux vidéo — Dev 3 branchera la ref WebRTC ici */}
      {videoRef && (
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted={participant.isMe}
          className="w-full h-full object-cover"
        />
      )}

      {/* Fallback — pas de vidéo ou appel vocal */}
      {!videoRef && (
        <div className="flex flex-col items-center gap-3">
          <div
            className="rounded-full flex items-center justify-center font-black text-white"
            style={{
              width: isLarge ? 96 : 52,
              height: isLarge ? 96 : 52,
              fontSize: isLarge ? 36 : 20,
              background: participant.color ?? '#252840',
            }}
          >
            {participant.initials}
          </div>
          <span className={`text-white font-semibold ${isLarge ? 'text-[15px]' : 'text-[12px]'}`}>
            {participant.name}
          </span>
        </div>
      )}

      {/* Badges */}
      <div className="absolute bottom-3 left-3 flex items-center gap-2">
        <span className={`text-white font-semibold ${isLarge ? 'text-[13px]' : 'text-[11px]'}`}>
          {participant.name}
        </span>
        {participant.isAdmin && (
          <span className="bg-[#C8864B] text-white text-[10px] font-bold px-2 py-[2px] rounded-full">
            Teaching
          </span>
        )}
        {participant.handRaised && (
          <span className="inline-flex items-center gap-1 bg-yellow-500 text-white text-[10px] font-bold px-2 py-[2px] rounded-full">
            <svg width="10" height="10" viewBox="0 0 10 10" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M3 1v5M5 1v5.5M7 2.5v4M1 7.5c0 0 .5 1.5 4 1.5s4-1.5 4-1.5V6H1z"/></svg>
            Hand raised
          </span>
        )}
      </div>

      {/* Micro coupé */}
      {participant.muted && (
        <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round">
            <path d="M1 1l10 10M4.5 4.5v1a1.5 1.5 0 003 0V3"/>
            <rect x="4.5" y="1.5" width="3" height="5" rx="1.5"/>
          </svg>
        </div>
      )}
    </div>
  )
}

// ── Page principale ────────────────────────────────────────────────────────
export default function CallScreen() {
  const navigate   = useNavigate()
  const location   = useLocation()

  // Données passées depuis Chat.jsx via navigate('/call', { state: {...} })
  const callType    = location.state?.callType    ?? 'audio' // 'audio' | 'video'
  const role        = location.state?.role        ?? 'learner'
  const isGroup     = location.state?.isGroup     ?? false
  const roomId      = location.state?.roomId      ?? 'demo'
  const partnerData = location.state?.partner     ?? { id:'la', name:'Léa Arnaud', initials:'LA', color:'#252840' }
  const groupParts  = location.state?.participants ?? []

  const [seconds,     setSeconds]     = useState(0)
  const [muted,       setMuted]       = useState(false)
  const [camOff,      setCamOff]      = useState(callType === 'audio')
  const [sharing,     setSharing]     = useState(false)
  const [handRaised,  setHandRaised]  = useState(false)
  const [showPanel,   setShowPanel]   = useState(false) // liste participants
  const [raisedHands, setRaisedHands] = useState([])
  const [credits,     setCredits]     = useState(location.state?.credits ?? 120)

  const isAdmin = role === 'teacher' // l'enseignant a les droits admin

  // Timer
  useEffect(() => {
    const t = setInterval(() => setSeconds(s => s + 1), 1000)
    return () => clearInterval(t)
  }, [])

  // Credit counter (1-à-1 uniquement)
  const mins         = Math.ceil(seconds / 60)
  const creditChange = isGroup ? null : role === 'teacher' ? `+${mins}` : `-${mins}`
  const creditColor  = role === 'teacher' ? '#3D5C28' : '#C8864B'

  const handleEnd = () => {
    // TODO Dev 3: socket.emit('call:end', { roomId })
    // TODO Dev 2: POST /api/sessions/end { roomId, duration: mins }
    navigate('/chat', {
      state: {
        summary: {
          duration: mins,
          earned:  !isGroup && role === 'teacher' ? mins : 0,
          spent:   !isGroup && role === 'learner'  ? mins : 0,
          isGroup,
        }
      }
    })
  }

  const toggleShare = () => {
    if (!isAdmin) return
    setSharing(p => !p)
    // TODO Dev 3: navigator.mediaDevices.getDisplayMedia() puis socket.emit('call:screen-share', ...)
  }

  const raiseHand = () => {
    setHandRaised(p => !p)
    // TODO Dev 3: socket.emit('call:raise-hand', { roomId, raised: !handRaised })
  }

  // Participants pour l'affichage
  const allParticipants = isGroup
    ? [
        { id:'me', name:'You', initials:'ME', color:'#252840', isMe:true, isAdmin, muted, handRaised },
        ...groupParts.map(p => ({ ...p, isMe:false, isAdmin:false, muted:false, handRaised: raisedHands.includes(p.id) }))
      ]
    : [
        { id:'me',           name:'You',           initials:'ME', color:'#252840', isMe:true,  isAdmin, muted },
        { ...partnerData,    isMe:false, isAdmin:!isAdmin, muted:false },
      ]

  // Layout grille selon le nombre de participants
  const gridClass = allParticipants.length <= 2
    ? 'grid-cols-2'
    : allParticipants.length <= 4
    ? 'grid-cols-2'
    : 'grid-cols-3'

  return (
    <div className="fixed inset-0 bg-[#111320] flex flex-col select-none">

      {/* ── TOPBAR ── */}
      <div className="flex items-center justify-between px-6 py-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-white/[0.06] px-3 py-[6px] rounded-full">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <IconClock />
            <span className="text-white font-black text-[15px] tabular-nums ml-1">{fmt(seconds)}</span>
          </div>

          {/* Crédit en direct — 1-à-1 uniquement */}
          {!isGroup && (
            <div className="bg-white/[0.06] px-3 py-[6px] rounded-full">
              <span className="font-bold text-[13px] tabular-nums" style={{ color: creditColor }}>
                {creditChange} credits
              </span>
            </div>
          )}

          {/* Session de groupe — gratuite */}
          {isGroup && (
            <div className="bg-[#3D5C28]/30 px-3 py-[6px] rounded-full">
              <span className="text-[#86C46E] font-bold text-[12px]">Group · Free</span>
            </div>
          )}
        </div>

        {/* Nom de la session */}
        <div className="text-center">
          <div className="text-white font-bold text-[14px]">
            {isGroup ? 'Group session' : `Session with ${partnerData.name}`}
          </div>
          <div className="text-white/40 text-[11px]">
            {callType === 'video' ? 'Video call' : 'Voice call'} ·
            {isAdmin ? ' You are teaching' : ' You are learning'}
          </div>
        </div>

        {/* Participants panel toggle */}
        <button
          onClick={() => setShowPanel(p => !p)}
          className="flex items-center gap-2 bg-white/[0.06] hover:bg-white/10 px-3 py-[6px] rounded-full transition-all cursor-pointer border-none text-white"
        >
          <IconPeople />
          <span className="text-[12px] font-semibold">{allParticipants.length}</span>
        </button>
      </div>

      {/* ── ZONE PRINCIPALE ── */}
      <div className="flex-1 flex overflow-hidden px-4 pb-2 gap-3">

        {/* Grille participants */}
        <div className={`flex-1 grid ${gridClass} gap-3`}>
          {allParticipants.map((p, i) => (
            <ParticipantTile
              key={p.id}
              participant={p}
              isLarge={allParticipants.length === 1}
              isSpeaking={i === 1} // Demo — Dev 3 détectera le vrai speaker
              videoRef={callType === 'video' ? null : null} // Dev 3 passera les refs WebRTC
            />
          ))}
        </div>

        {/* Panneau participants (latéral) */}
        {showPanel && (
          <div className="w-[220px] bg-[#1E2035] rounded-2xl p-4 flex-shrink-0 overflow-y-auto">
            <h3 className="text-white font-bold text-[13px] mb-3">
              Participants ({allParticipants.length})
            </h3>
            {allParticipants.map(p => (
              <div key={p.id} className="flex items-center gap-2 py-2 border-b border-white/[0.06] last:border-0">
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0"
                  style={{ background: p.color }}
                >
                  {p.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-white text-[12px] font-medium truncate">{p.name}</div>
                  {p.isAdmin && <div className="text-[#C8864B] text-[10px]">Teaching</div>}
                </div>
                {p.muted && (
                  <div className="text-red-400">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <path d="M1 1l10 10"/>
                      <rect x="3.5" y="1.5" width="5" height="7" rx="2.5"/>
                    </svg>
                  </div>
                )}
                {/* Droits admin — exclure, couper le micro */}
                {isAdmin && !p.isMe && (
                  <button
                    className="text-white/30 hover:text-white/60 bg-transparent border-none cursor-pointer text-[10px] transition-all"
                    title="Mute participant"
                  >
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                      <rect x="3.5" y="1.5" width="5" height="7" rx="2.5"/>
                      <path d="M2 6a4 4 0 008 0"/>
                      <path d="M6 10v2"/>
                    </svg>
                  </button>
                )}
              </div>
            ))}

            {/* Mains levées */}
            {raisedHands.length > 0 && (
              <div className="mt-3">
                <div className="text-yellow-400 text-[11px] font-bold mb-2">Hand raised</div>
                {raisedHands.map(id => {
                  const p = allParticipants.find(x => x.id === id)
                  return p ? (
                    <div key={id} className="text-white/60 text-[12px] py-1">{p.name}</div>
                  ) : null
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── PARTAGE D'ÉCRAN banner ── */}
      {sharing && (
        <div className="mx-4 mb-2 bg-[#C8864B]/20 border border-[#C8864B]/30 rounded-xl px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2 text-[#C8864B]">
            <IconShare />
            <span className="text-[13px] font-semibold">You are sharing your screen</span>
          </div>
          <button
            onClick={() => setSharing(false)}
            className="text-[#C8864B] text-[12px] font-bold bg-transparent border-none cursor-pointer hover:text-white transition-all"
          >
            Stop sharing
          </button>
        </div>
      )}

      {/* ── BARRE DE CONTRÔLE ── */}
      <div className="flex items-center justify-center gap-3 px-6 py-5 flex-shrink-0">

        {/* Micro */}
        <button
          onClick={() => setMuted(p => !p)}
          className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none transition-all
            ${muted ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
          title={muted ? 'Unmute' : 'Mute'}
        >
          <IconMic muted={muted} />
        </button>

        {/* Caméra — si appel vidéo */}
        {callType === 'video' && (
          <button
            onClick={() => setCamOff(p => !p)}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none transition-all
              ${camOff ? 'bg-red-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            title={camOff ? 'Turn on camera' : 'Turn off camera'}
          >
            <IconCamera off={camOff} />
          </button>
        )}

        {/* Partage d'écran — admin uniquement */}
        {isAdmin && (
          <button
            onClick={toggleShare}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none transition-all
              ${sharing ? 'bg-[#C8864B] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            title={sharing ? 'Stop sharing' : 'Share screen'}
          >
            <IconShare />
          </button>
        )}

        {/* Main levée — apprenants et groupe */}
        {(!isAdmin || isGroup) && (
          <button
            onClick={raiseHand}
            className={`w-12 h-12 rounded-full flex items-center justify-center cursor-pointer border-none transition-all
              ${handRaised ? 'bg-yellow-500 text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
            title={handRaised ? 'Lower hand' : 'Raise hand'}
          >
            <IconRaise />
          </button>
        )}

        {/* Spacer */}
        <div className="w-4" />

        {/* Raccrocher */}
        <button
          onClick={handleEnd}
          className="w-[60px] h-[60px] rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center cursor-pointer border-none transition-all shadow-[0_0_24px_rgba(239,68,68,0.4)]"
          title="End call"
        >
          <IconPhone />
        </button>
      </div>

    </div>
  )
}