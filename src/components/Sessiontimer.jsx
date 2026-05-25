// src/components/Sessiontimer.jsx
// Sessions = appels via Google Meet ou Zoom (lien généré par le backend)
// Chat texte toujours gratuit — crédits seulement pendant les appels
// Sessions de groupe : GRATUITES
//
// Dev 2 → brancher les events Socket.io + génération lien Meet/Zoom
// Dev 2 → POST /api/sessions/start et /end pour les crédits

import { useState, useEffect, useRef } from 'react'

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

// Icônes SVG
function IconVideo() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <rect x="1" y="3" width="9" height="9" rx="2"/>
      <path d="M10 6l4-2v7l-4-2"/>
    </svg>
  )
}
function IconPhone() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <path d="M2 2h3l1.5 3.5-2 1.5a10 10 0 004.5 4.5l1.5-2L14 11v3a1 1 0 01-1 1C5.5 15 0 9.5 0 3a1 1 0 011-1h1z"/>
    </svg>
  )
}
function IconUsers() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
      <circle cx="5.5" cy="5" r="2.5"/>
      <path d="M0 13a5.5 5.5 0 0111 0"/>
      <circle cx="12" cy="4.5" r="2"/>
      <path d="M10.5 13a3.5 3.5 0 015 0"/>
    </svg>
  )
}
function IconClock() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
      <circle cx="6.5" cy="6.5" r="5"/>
      <path d="M6.5 3.5v3l2 2"/>
    </svg>
  )
}

export default function SessionTimer({
  roomId,
  isGroup,
  participants,
  currentUser,
  partnerName,
  socket,
  onCreditsChange,
}) {
  const [phase, setPhase]         = useState('idle')
  const [role, setRole]           = useState(null)
  const [callType, setCallType]   = useState(null)
  const [provider, setProvider]   = useState(null) // 'zoom' | 'meet'
  const [meetingLink, setMeetingLink] = useState(null)
  const [seconds, setSeconds]     = useState(0)
  const [summary, setSummary]     = useState(null)
  const [rating, setRating]       = useState(0)
  const [inviteOpen, setInviteOpen] = useState(false)
  const intervalRef = useRef(null)

  const credits = currentUser?.credits ?? 120
  const mins    = Math.ceil(seconds / 60)

  // Timer — tourne pendant qu'une session est active
  useEffect(() => {
    if (phase === 'active') {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [phase])

  // Écouter le lien de réunion envoyé par le backend via Socket.io
  useEffect(() => {
    if (!socket) return
    // TODO Dev 2: socket.on('meeting:link', ({ link, provider }) => { setMeetingLink(link); setProvider(provider) })
    // TODO Dev 2: socket.on('session:started', () => { setPhase('active') })
    // TODO Dev 2: socket.on('session:ended', (summary) => { handleEndFromServer(summary) })
  }, [socket])

  // Lancer un appel — choisir le provider puis le rôle (1-à-1) ou direct (groupe)
  const launchCall = (type) => {
    setCallType(type)
    setPhase('provider-select')
  }

  const selectProvider = (prov) => {
    setProvider(prov)
    if (isGroup) {
      // Groupe → direct, gratuit
      startMeeting(prov, 'group')
    } else {
      // 1-à-1 → choisir le rôle
      setPhase('role-select')
    }
  }

  const confirmRole = (selectedRole) => {
    if (selectedRole === 'learner' && credits <= 0) return
    setRole(selectedRole)
    startMeeting(provider, selectedRole)
  }

  const startMeeting = (prov, selectedRole) => {
    setPhase('generating')

    // TODO Dev 2: socket.emit('meeting:create', { roomId, provider: prov, role: selectedRole })
    // → Le backend génère le lien et répond via 'meeting:link'
    // → Le backend crée la session en DB et démarre le timer côté serveur

    // DÉMO — lien fictif en attendant le backend
    const demoLinks = {
      zoom: 'https://zoom.us/j/1234567890?pwd=demo',
      meet: 'https://meet.google.com/abc-defg-hij',
    }
    setTimeout(() => {
      setMeetingLink(demoLinks[prov])
      setRole(selectedRole)
      setPhase('active')
      setSeconds(0)
      // TODO Dev 2: POST /api/sessions/start { roomId, role: selectedRole }
    }, 800)
  }

  const endSession = () => {
    const duration  = Math.ceil(seconds / 60)
    const isGrp     = role === 'group'
    const earnedMin = isGrp ? 0 : (role === 'teacher' ? duration : 0)
    const spentMin  = isGrp ? 0 : (role === 'learner'  ? duration : 0)
    setSummary({ duration, earned: earnedMin, spent: spentMin, isGroup: isGrp })
    setPhase('summary')
    setSeconds(0)
    setMeetingLink(null)
    if (!isGrp) onCreditsChange?.(role === 'teacher' ? earnedMin : -spentMin)
    // TODO Dev 2: POST /api/sessions/end { roomId } → transfert crédits en DB
    // TODO Dev 2: socket.emit('session:end', { roomId })
  }

  const closeSession = () => {
    setPhase('idle')
    setSummary(null)
    setRating(0)
    setRole(null)
    setCallType(null)
    setProvider(null)
    setMeetingLink(null)
  }

  return (
    <div className="border-t border-black/[0.07]">

      {/* ── IDLE ── */}
      {phase === 'idle' && (
        <div className="px-4 py-3 bg-white flex items-center gap-3">
          {isGroup
            ? <span className="text-[12px] font-semibold text-[#3D5C28] flex-shrink-0">Group calls are free</span>
            : <span className="text-[12px] text-[#7A6E5C] flex-shrink-0">
                <strong className="text-[#252840]">{credits}</strong> credits
              </span>
          }
          <div className="flex gap-2 ml-auto flex-wrap">
            {isGroup && (
              <button onClick={() => setInviteOpen(true)}
                className="flex items-center gap-1 px-3 py-[6px] rounded-lg border-[1.5px] border-[#252840] text-[#252840] text-[11px] font-bold bg-white cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
                <IconUsers /> Invite
              </button>
            )}
            <button onClick={() => launchCall('audio')}
              className="flex items-center gap-1 px-3 py-[6px] rounded-lg border-[1.5px] border-[#252840] text-[#252840] text-[11px] font-bold bg-white cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
              <IconPhone /> Voice call
            </button>
            <button onClick={() => launchCall('video')}
              className="flex items-center gap-1 px-3 py-[6px] rounded-lg border-[1.5px] border-[#C8864B] text-[#C8864B] text-[11px] font-bold bg-white cursor-pointer hover:bg-[#C8864B] hover:text-white transition-all">
              <IconVideo /> Video call
            </button>
          </div>
        </div>
      )}

      {/* ── PROVIDER SELECT ── */}
      {phase === 'provider-select' && (
        <div className="px-4 py-4 bg-[#FAFAFA]">
          <p className="text-[13px] font-bold text-[#1A1410] mb-1">Choose your meeting platform</p>
          <p className="text-[12px] text-[#7A6E5C] mb-3">The link will be shared with everyone in this chat</p>
          <div className="flex gap-2">
            <button onClick={() => selectProvider('meet')}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-[#252840] text-[#252840] text-[12px] font-bold bg-white cursor-pointer hover:bg-[#252840] hover:text-white transition-all flex items-center justify-center gap-2">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.6 0 12 0z" opacity=".1"/><path d="M21.8 10.1H12v3.8h5.7c-.5 2.5-2.6 4.4-5.7 4.4a6.3 6.3 0 010-12.6c1.5 0 2.9.6 4 1.5l2.8-2.8A10 10 0 002 12a10 10 0 0010 10 10 10 0 0010-10c0-.7-.1-1.3-.2-1.9z" fill="#4285F4"/></svg>
              Google Meet
            </button>
            <button onClick={() => selectProvider('zoom')}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-[#2D8CFF] text-[#2D8CFF] text-[12px] font-bold bg-white cursor-pointer hover:bg-[#2D8CFF] hover:text-white transition-all">
              Zoom
            </button>
          </div>
          <button onClick={() => setPhase('idle')}
            className="mt-2 text-[11px] text-[#7A6E5C] bg-transparent border-none cursor-pointer w-full text-center hover:text-[#1A1410]">
            Cancel
          </button>
        </div>
      )}

      {/* ── ROLE SELECT (1-à-1 uniquement) ── */}
      {phase === 'role-select' && (
        <div className="px-4 py-4 bg-[#FAFAFA]">
          <p className="text-[13px] font-bold text-[#1A1410] mb-1">Who teaches in this call?</p>
          <p className="text-[12px] text-[#7A6E5C] mb-3">Teacher earns credits · Learner spends credits</p>
          <div className="flex gap-2">
            <button onClick={() => confirmRole('teacher')}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-[#3D5C28] text-[#3D5C28] text-[12px] font-bold bg-white cursor-pointer hover:bg-[#3D5C28] hover:text-white transition-all">
              I teach — earn credits
            </button>
            <button onClick={() => confirmRole('learner')} disabled={credits <= 0}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-[#C8864B] text-[#C8864B] text-[12px] font-bold bg-white cursor-pointer hover:bg-[#C8864B] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
              I learn — spend credits
            </button>
            <button onClick={() => confirmRole('mixed')}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-black/[0.12] text-[#7A6E5C] text-[12px] font-bold bg-white cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all">
              Mixed — free
            </button>
          </div>
          <button onClick={() => setPhase('provider-select')}
            className="mt-2 text-[11px] text-[#7A6E5C] bg-transparent border-none cursor-pointer w-full text-center hover:text-[#1A1410]">
            Back
          </button>
        </div>
      )}

      {/* ── GENERATING LINK ── */}
      {phase === 'generating' && (
        <div className="px-4 py-3 bg-[#ECEEF8] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#252840] animate-pulse flex-shrink-0" />
          <span className="text-[12px] text-[#252840] font-medium">
            Generating {provider === 'meet' ? 'Google Meet' : 'Zoom'} link…
          </span>
        </div>
      )}

      {/* ── ACTIVE — lien généré, timer actif ── */}
      {phase === 'active' && (
        <div className="bg-[#1A1410]">
          {/* Lien de meeting */}
          {meetingLink && (
            <div className="px-4 py-2 border-b border-white/[0.08] flex items-center gap-3">
              <span className="text-white/40 text-[11px] flex-shrink-0">
                {provider === 'meet' ? 'Google Meet' : 'Zoom'}
              </span>
              <a
                href={meetingLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-[12px] font-bold text-[#86C46E] hover:text-white transition-all truncate"
              >
                {meetingLink}
              </a>
              <button
                onClick={() => navigator.clipboard.writeText(meetingLink)}
                className="text-white/40 hover:text-white text-[11px] bg-transparent border-none cursor-pointer flex-shrink-0 transition-all"
              >
                Copy
              </button>
            </div>
          )}

          {/* Timer + crédits */}
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            <div className="flex items-center gap-2 flex-1">
              <IconClock />
              <span className="text-white font-black text-[18px] tracking-tight tabular-nums">{fmt(seconds)}</span>
              <span className="text-white/40 text-[11px]">
                {role === 'group'    ? 'Group · Free'
                : role === 'teacher' ? `Teaching · +${mins} credits`
                : role === 'learner' ? `Learning · -${mins} credits`
                :                      'Mixed · Free'}
              </span>
            </div>
            <button onClick={endSession}
              className="px-4 py-[7px] rounded-lg bg-red-500 text-white text-[12px] font-bold border-none cursor-pointer hover:bg-red-600 transition-all flex-shrink-0">
              End session
            </button>
          </div>
        </div>
      )}

      {/* ── SUMMARY ── */}
      {phase === 'summary' && summary && (
        <div className="px-4 py-5 bg-white">
          <p className="text-[14px] font-bold text-[#1A1410] mb-4">Session complete</p>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-[#F8F8F8] rounded-xl border border-black/[0.07] p-3 text-center">
              <div className="text-[22px] font-black text-[#252840] tabular-nums">
                {summary.duration}<span className="text-[12px] font-medium text-[#7A6E5C] ml-1">min</span>
              </div>
              <div className="text-[11px] text-[#7A6E5C] mt-1">Duration</div>
            </div>
            {!summary.isGroup && summary.earned > 0 && (
              <div className="flex-1 bg-[#E4EED8] rounded-xl p-3 text-center">
                <div className="text-[22px] font-black text-[#3D5C28] tabular-nums">+{summary.earned}</div>
                <div className="text-[11px] text-[#3D5C28] mt-1">Credits earned</div>
              </div>
            )}
            {!summary.isGroup && summary.spent > 0 && (
              <div className="flex-1 bg-[#FEF3E8] rounded-xl p-3 text-center">
                <div className="text-[22px] font-black text-[#C8864B] tabular-nums">-{summary.spent}</div>
                <div className="text-[11px] text-[#C8864B] mt-1">Credits spent</div>
              </div>
            )}
            {summary.isGroup && (
              <div className="flex-1 bg-[#E4EED8] rounded-xl p-3 text-center">
                <div className="text-[22px] font-black text-[#3D5C28]">Free</div>
                <div className="text-[11px] text-[#3D5C28] mt-1">Group session</div>
              </div>
            )}
          </div>
          {!summary.isGroup && (
            <div className="mb-4">
              <p className="text-[12px] text-[#7A6E5C] mb-2 font-medium">Rate this session</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(star)}
                    className={`w-8 h-8 rounded-lg border-[1.5px] text-[13px] font-bold cursor-pointer transition-all
                      ${star <= rating ? 'bg-[#252840] border-[#252840] text-white' : 'bg-transparent border-black/[0.09] text-[#7A6E5C] hover:border-[#252840]'}`}>
                    {star}
                  </button>
                ))}
              </div>
            </div>
          )}
          <button onClick={closeSession}
            className="w-full py-[10px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all">
            Done
          </button>
        </div>
      )}

      {/* ── INVITE POPUP ── */}
      {inviteOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setInviteOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-[400px]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[16px] font-black text-[#1A1410]">Invite to group</h3>
              <button onClick={() => setInviteOpen(false)}
                className="w-7 h-7 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C] flex items-center justify-center hover:bg-black/10 text-[13px]">
                ✕
              </button>
            </div>
            <p className="text-[13px] text-[#7A6E5C] mb-4">
              Group calls are always <strong className="text-[#3D5C28]">free</strong>.
            </p>
            {/* TODO Dev 2: GET /api/connections → liste des connexions acceptées */}
            {[
              { id:'la', initials:'LA', color:'#252840', name:'Léa Arnaud',    skill:'Maths'    },
              { id:'km', initials:'KM', color:'#C8864B', name:'Kenji Matsuda', skill:'Japanese' },
              { id:'so', initials:'SO', color:'#3D5C28', name:'Sara Okonkwo',  skill:'English'  },
            ].map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-black/[0.06] last:border-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                  style={{ background: c.color }}>{c.initials}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1A1410]">{c.name}</div>
                  <div className="text-[11px] text-[#7A6E5C]">{c.skill}</div>
                </div>
                <button className="px-3 py-[5px] rounded-lg bg-[#ECEEF8] text-[#252840] text-[11px] font-bold border-none cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
                  Invite
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}