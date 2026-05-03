// src/components/SessionTimer.jsx
// Sessions = appels uniquement (voice ou video). Chat texte toujours gratuit.
// Session 1-à-1 : crédits selon le rôle choisi
// Session de groupe : GRATUITE — pousse les gens à inviter leurs contacts
//
// Dev 3 → brancher les events Socket.io (marqués TODO Dev 3)
// Dev 2 → brancher les appels API (marqués TODO Dev 2)

import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
 

const fmt = (s) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

export default function SessionTimer({
  roomId,
  isGroup,
  participants,
  currentUser,
  partnerName,
  socket,
  onCreditsChange,
}) {

    const navigate = useNavigate()

  const [phase, setPhase]       = useState('idle')
  const [role, setRole]         = useState(null)
  const [callType, setCallType] = useState(null)
  const [seconds, setSeconds]   = useState(0)
  const [summary, setSummary]   = useState(null)
  const [rating, setRating]     = useState(0)
  const [inviteOpen, setInviteOpen] = useState(false)
  const intervalRef = useRef(null)

  const credits = currentUser?.credits ?? 120
  const mins    = Math.ceil(seconds / 60)

  useEffect(() => {
    if (phase === 'active') {
      intervalRef.current = setInterval(() => setSeconds(s => s + 1), 1000)
    } else {
      clearInterval(intervalRef.current)
    }
    return () => clearInterval(intervalRef.current)
  }, [phase])

  useEffect(() => {
    if (!socket) return
    // TODO Dev 3: socket.on('call:incoming', ...)
    // TODO Dev 3: socket.on('call:accepted', ...)
    // TODO Dev 3: socket.on('call:ended', ...)
    return () => {}
  }, [socket])

 const launchCall = (type) => {
    setCallType(type)

    if (isGroup) {
      navigate('/call', {
        state: {
          callType: type,
          role: 'group',
          isGroup: true,
          roomId,
          participants,
          credits,
        }
      })
    } else {
      setPhase('role-select')
    }
  }
  const confirmRole = (selectedRole) => {
    if (selectedRole === 'learner' && credits <= 0) return

    setRole(selectedRole)
    setPhase('requesting')

        setTimeout(() => {
      navigate('/call', {
        state: {
          callType,
          role: selectedRole,
          isGroup,
          roomId,
          partner: { name: partnerName },
          participants,
          credits,
        }
      })
    }, 2000) // démo — Dev 3 remplacera par l'acceptation WebRTC réelle
  }


  const acceptCall = () => {
    setPhase('active')
    setSeconds(0)
    // TODO Dev 3: socket.emit('call:accept', { roomId })
  }

  const endCall = () => {
    const duration  = Math.ceil(seconds / 60)
    const isGrp     = role === 'group'
    const earnedMin = isGrp ? 0 : (role === 'teacher' ? duration : 0)
    const spentMin  = isGrp ? 0 : (role === 'learner'  ? duration : 0)
    setSummary({ duration, earned: earnedMin, spent: spentMin, isGroup: isGrp, callType })
    setPhase('summary')
    setSeconds(0)
    if (!isGrp) onCreditsChange?.(role === 'teacher' ? earnedMin : -spentMin)
    // TODO Dev 3: socket.emit('call:end', { roomId })
    // TODO Dev 2: POST /api/sessions/end → transfert crédits DB
  }

  const closeSession = () => { setPhase('idle'); setSummary(null); setRating(0); setRole(null); setCallType(null) }

  return (
    <div className="border-t border-black/[0.07]">

      {/* IDLE */}
      {phase === 'idle' && (
        <div className="px-4 py-3 bg-white flex items-center gap-3">
          {isGroup
            ? <span className="text-[12px] font-semibold text-[#3D5C28] flex-shrink-0"> Group calls are free</span>
            : <span className="text-[12px] text-[#7A6E5C] flex-shrink-0"> <strong className="text-[#252840]">{credits}</strong> credits</span>
          }
          <div className="flex gap-2 ml-auto">
            {isGroup && (
              <button onClick={() => setInviteOpen(true)}
                className="px-3 py-[6px] rounded-lg border-[1.5px] border-[#252840] text-[#252840] text-[11px] font-bold bg-white cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
                + Invite
              </button>
            )}
            <button onClick={() => launchCall('audio')}
              className="px-3 py-[6px] rounded-lg border-[1.5px] border-[#252840] text-[#252840] text-[11px] font-bold bg-white cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
               Voice
            </button>
            <button onClick={() => launchCall('video')}
              className="px-3 py-[6px] rounded-lg border-[1.5px] border-[#C8864B] text-[#C8864B] text-[11px] font-bold bg-white cursor-pointer hover:bg-[#C8864B] hover:text-white transition-all">
               Video
            </button>
          </div>
        </div>
      )}

      {/* ROLE SELECT */}
      {phase === 'role-select' && (
        <div className="px-4 py-4 bg-[#FAFAFA]">
          <p className="text-[13px] font-bold text-[#1A1410] mb-1">Who teaches in this call?</p>
          <p className="text-[12px] text-[#7A6E5C] mb-3">Teacher earns credits · Learner spends credits</p>
          <div className="flex gap-2">
            <button onClick={() => confirmRole('teacher')}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-[#3D5C28] text-[#3D5C28] text-[12px] font-bold bg-white cursor-pointer hover:bg-[#3D5C28] hover:text-white transition-all">
               I teach · earn 
            </button>
            <button onClick={() => confirmRole('learner')} disabled={credits <= 0}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-[#C8864B] text-[#C8864B] text-[12px] font-bold bg-white cursor-pointer hover:bg-[#C8864B] hover:text-white transition-all disabled:opacity-40 disabled:cursor-not-allowed">
               I learn · spend 
            </button>
            <button onClick={() => confirmRole('mixed')}
              className="flex-1 py-[10px] rounded-xl border-[1.5px] border-black/[0.12] text-[#7A6E5C] text-[12px] font-bold bg-white cursor-pointer hover:border-[#1A1410] hover:text-[#1A1410] transition-all">
               Mixed · free
            </button>
          </div>
          <button onClick={() => setPhase('idle')}
            className="mt-2 text-[11px] text-[#7A6E5C] bg-transparent border-none cursor-pointer w-full text-center hover:text-[#1A1410]">
            Cancel
          </button>
        </div>
      )}

      {/* REQUESTING */}
      {phase === 'requesting' && (
        <div className="px-4 py-3 bg-[#ECEEF8] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#252840] animate-pulse flex-shrink-0" />
          <span className="text-[12px] text-[#252840] font-medium flex-1">
            Calling {isGroup ? 'the group' : (partnerName ?? 'your partner')}…
          </span>
          <button onClick={() => setPhase('idle')}
            className="text-[11px] text-[#7A6E5C] bg-transparent border-none cursor-pointer hover:text-[#1A1410]">
            Cancel
          </button>
        </div>
      )}

      {/* INCOMING */}
      {phase === 'incoming' && (
        <div className="px-4 py-3 bg-[#FEF9EC] flex items-center gap-3">
          <span className="text-[18px] animate-bounce">{callType === 'video' ? '📹' : '🎙'}</span>
          <span className="text-[12px] text-[#1A1410] font-medium flex-1">
            {partnerName ?? 'Someone'} is calling…
          </span>
          <button onClick={acceptCall}
            className="px-3 py-[6px] rounded-lg bg-[#3D5C28] text-white text-[11px] font-bold border-none cursor-pointer hover:bg-[#4E6035] transition-all">
            Answer ✓
          </button>
          <button onClick={() => setPhase('idle')}
            className="px-3 py-[6px] rounded-lg bg-red-500 text-white text-[11px] font-bold border-none cursor-pointer hover:bg-red-600 transition-all">
            Decline ✕
          </button>
        </div>
      )}

      {/* ACTIVE */}
      {phase === 'active' && (
        <div className="bg-[#1A1410] px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-red-400 animate-pulse flex-shrink-0" />
            <span className="text-white font-black text-[20px] tracking-[-0.5px] tabular-nums flex-1">
              {fmt(seconds)}
            </span>
            <span className="text-white/40 text-[11px]">
              {callType === 'video' ? '' : ''}
              {role === 'group'   ? ' Group · Free'
              : role === 'teacher' ? ` Teaching · +${mins} `
              : role === 'learner' ? ` Learning · -${mins} `
              :                      ' Mixed · Free'}
            </span>

            {/* Avatars participants groupe */}
            {isGroup && participants?.length > 0 && (
              <div className="flex -space-x-1 mr-1">
                {participants.slice(0, 4).map((p, i) => (
                  <div key={i}
                    className="w-6 h-6 rounded-full border-2 border-[#1A1410] flex items-center justify-center text-[9px] font-bold text-white"
                    style={{ background: ['#252840','#C8864B','#3D5C28','#363B6B'][i % 4] }}>
                    {p.initials ?? p.name?.[0] ?? '?'}
                  </div>
                ))}
                {participants.length > 4 && (
                  <div className="w-6 h-6 rounded-full border-2 border-[#1A1410] bg-[#363B6B] flex items-center justify-center text-[9px] font-bold text-white">
                    +{participants.length - 4}
                  </div>
                )}
              </div>
            )}

            <button onClick={endCall}
              className="px-4 py-[7px] rounded-lg bg-red-500 text-white text-[12px] font-bold border-none cursor-pointer hover:bg-red-600 transition-all flex-shrink-0">
              End call
            </button>
          </div>

          {!isGroup && (
            <>
              <div className="mt-2 h-[3px] rounded-full bg-white/10 overflow-hidden">
                <div className="h-full rounded-full bg-white/40 transition-all duration-1000"
                  style={{ width: `${Math.min((seconds / 3600) * 100, 100)}%` }} />
              </div>
              <div className="flex justify-between mt-1">
                <span className="text-[10px] text-white/30">0 min</span>
                <span className="text-[10px] text-white/30">60 min max</span>
              </div>
            </>
          )}
        </div>
      )}

      {/* SUMMARY */}
      {phase === 'summary' && summary && (
        <div className="px-4 py-5 bg-white">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-[#E4EED8] flex items-center justify-center text-[13px]">✓</div>
            <p className="text-[14px] font-bold text-[#1A1410]">{summary.isGroup ? 'Group call ended' : 'Call complete'}</p>
          </div>
          <div className="flex gap-3 mb-4">
            <div className="flex-1 bg-[#F8F8F8] rounded-xl border border-black/[0.07] p-3 text-center">
              <div className="text-[22px] font-black text-[#252840] tabular-nums">
                {summary.duration}<span className="text-[12px] font-medium text-[#7A6E5C] ml-1">min</span>
              </div>
              <div className="text-[11px] text-[#7A6E5C] mt-1">Duration</div>
            </div>
            {!summary.isGroup && summary.earned > 0 && (
              <div className="flex-1 bg-[#E4EED8] rounded-xl border border-[#3D5C28]/20 p-3 text-center">
                <div className="text-[22px] font-black text-[#3D5C28] tabular-nums">+{summary.earned}<span className="text-[14px] ml-1">⚡</span></div>
                <div className="text-[11px] text-[#3D5C28] mt-1">Credits earned</div>
              </div>
            )}
            {!summary.isGroup && summary.spent > 0 && (
              <div className="flex-1 bg-[#FEF3E8] rounded-xl border border-[#C8864B]/20 p-3 text-center">
                <div className="text-[22px] font-black text-[#C8864B] tabular-nums">-{summary.spent}<span className="text-[14px] ml-1">⚡</span></div>
                <div className="text-[11px] text-[#C8864B] mt-1">Credits spent</div>
              </div>
            )}
            {summary.isGroup && (
              <div className="flex-1 bg-[#E4EED8] rounded-xl border border-[#3D5C28]/20 p-3 text-center">
                <div className="text-[22px] font-black text-[#3D5C28]">Free</div>
                <div className="text-[11px] text-[#3D5C28] mt-1">Group call</div>
              </div>
            )}
          </div>
          {!summary.isGroup && (
            <div className="mb-4">
              <p className="text-[12px] text-[#7A6E5C] mb-2 font-medium">Rate this session</p>
              <div className="flex gap-1">
                {[1,2,3,4,5].map(star => (
                  <button key={star} onClick={() => setRating(star)}
                    className={`text-[24px] bg-transparent border-none cursor-pointer transition-all hover:scale-110 ${star <= rating ? 'opacity-100' : 'opacity-20'}`}>
                    
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

      {/* INVITE POPUP */}
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
              Invite any connection. Group calls are always <strong className="text-[#3D5C28]">free</strong> — no credits needed.
            </p>
            {/* TODO Dev 2: remplacer par GET /api/connections */}
            {[
              { id:'la', initials:'LA', color:'#252840', name:'Léa Arnaud',    skill:'Maths'    },
              { id:'km', initials:'KM', color:'#C8864B', name:'Kenji Matsuda', skill:'Japanese' },
              { id:'so', initials:'SO', color:'#3D5C28', name:'Sara Okonkwo',  skill:'English'  },
            ].map(c => (
              <div key={c.id} className="flex items-center gap-3 py-2 border-b border-black/[0.06] last:border-0">
                <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                  style={{ background: c.color }}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1A1410]">{c.name}</div>
                  <div className="text-[11px] text-[#7A6E5C]">{c.skill}</div>
                </div>
                <button
                  className="px-3 py-[5px] rounded-lg bg-[#ECEEF8] text-[#252840] text-[11px] font-bold border-none cursor-pointer hover:bg-[#252840] hover:text-white transition-all">
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