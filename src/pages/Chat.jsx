// src/pages/Chat.jsx
// Chat texte toujours gratuit
// Appels vocal/vidéo avec SessionTimer (crédits pour 1-à-1, gratuit en groupe)
// Groupes : ouverts à tous les contacts, sans limite
//
// Dev 3 → brancher Socket.io pour les vrais messages en temps réel
// Dev 2 → GET /api/conversations, GET /api/messages/:roomId

import { useState, useRef, useEffect } from 'react'
import SessionTimer from '../components/Sessiontimer'

// ── Données temporaires — Dev 2 les remplacera par l'API ──────────────────
const INIT_CONVERSATIONS = [
  {
    id: 'la', type: '1-1',
    initials: 'LA', color: '#252840',
    name: 'Léa Arnaud', skill: 'Maths ↔ English',
    preview: "Super, on commence ?", time: '12:04', unread: 2,
    participants: [],
  },
  {
    id: 'km', type: '1-1',
    initials: 'KM', color: '#C8864B',
    name: 'Kenji Matsuda', skill: 'Japanese ↔ French',
    preview: "Demain c'est bon !", time: 'Hier', unread: 0,
    participants: [],
  },
  {
    id: 'group-1', type: 'group',
    initials: null, color: '#363B6B',
    name: '🔥 Maths Study Group',
    preview: 'Léa: On commence à 18h ?', time: '10:30', unread: 3,
    participants: [
      { id:'la', initials:'LA', color:'#252840', name:'Léa Arnaud'    },
      { id:'km', initials:'KM', color:'#C8864B', name:'Kenji Matsuda' },
      { id:'so', initials:'SO', color:'#3D5C28', name:'Sara Okonkwo'  },
    ],
  },
]

const INIT_MESSAGES = {
  'la': [
    { id:1, from:'them', text:"Salut ! Tu es dispo pour commencer notre session maths aujourd'hui ?", time:'12:01' },
    { id:2, from:'me',   text:'Oui ! Je suis libre à partir de 15h.', time:'12:02' },
    { id:3, from:'them', text:'Parfait. On fait 1h, ça te convient ?', time:'12:03' },
    { id:4, from:'them', text:'Super, on commence ?', time:'12:04' },
  ],
  'km': [
    { id:1, from:'them', text:'Hey ! Comment avance ton japonais ?', time:'Hier' },
    { id:2, from:'me',   text:"Bien, j'ai appris 10 nouveaux mots aujourd'hui !", time:'Hier' },
    { id:3, from:'them', text:"Demain c'est bon !", time:'Hier' },
  ],
  'group-1': [
    { id:1, from:'la',  senderName:'Léa',   text:'Bonjour tout le monde ! Prêts pour la session ?', time:'10:20' },
    { id:2, from:'km',  senderName:'Kenji', text:'Oui ! Je suis dispo toute la matinée.', time:'10:22' },
    { id:3, from:'me',  senderName:'Moi',   text:'Super ! On commence à quelle heure ?', time:'10:25' },
    { id:4, from:'la',  senderName:'Léa',   text:'On commence à 18h ?', time:'10:30' },
  ],
}

// Couleurs par sender dans les groupes
const SENDER_COLORS = { la:'#252840', km:'#C8864B', so:'#3D5C28' }

export default function Chat() {
  const [conversations, setConversations] = useState(INIT_CONVERSATIONS)
  const [activeId, setActiveId]           = useState('la')
  const [messages, setMessages]           = useState(INIT_MESSAGES)
  const [input, setInput]                 = useState('')
  const [typing, setTyping]               = useState(false)
  const [credits, setCredits]             = useState(120)
  const [createGroupOpen, setCreateGroupOpen] = useState(false)
  const [groupName, setGroupName]         = useState('')
  const [selectedMembers, setSelectedMembers] = useState([])
  const messagesEndRef = useRef(null)

  const active = conversations.find(c => c.id === activeId)
  const msgs   = messages[activeId] ?? []
  const isGroup = active?.type === 'group'

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const send = () => {
    if (!input.trim()) return
    const now = new Date().toLocaleTimeString('fr', { hour:'2-digit', minute:'2-digit' })
    const newMsg = { id: Date.now(), from:'me', senderName:'Moi', text: input.trim(), time: now }
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), newMsg] }))
    setInput('')
    // Mise à jour preview
    setConversations(prev => prev.map(c =>
      c.id === activeId ? { ...c, preview: input.trim(), time: now, unread: 0 } : c
    ))
    // TODO Dev 3: socket.emit('send-message', { roomId: activeId, text: input.trim() })

    // Simulation réponse (Dev 3 remplacera)
    if (!isGroup) {
      setTyping(true)
      setTimeout(() => {
        setTyping(false)
        const reply = { id: Date.now()+1, from:'them', senderName: active?.name, text:'👍 Reçu !', time: now }
        setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), reply] }))
      }, 1800)
    }
  }

  const createGroup = () => {
    if (!groupName.trim() || selectedMembers.length === 0) return
    const newId = `group-${Date.now()}`
    const newGroup = {
      id: newId, type: 'group',
      initials: null, color: '#363B6B',
      name: groupName.trim(),
      preview: 'Group created', time: 'Now', unread: 0,
      participants: selectedMembers,
    }
    setConversations(prev => [newGroup, ...prev])
    setMessages(prev => ({ ...prev, [newId]: [
      { id:1, from:'system', text: `Group "${groupName.trim()}" created. Group calls are free! 🎉`, time:'Now' }
    ]}))
    setActiveId(newId)
    setCreateGroupOpen(false)
    setGroupName('')
    setSelectedMembers([])
    // TODO Dev 3: socket.emit('create-group', { name: groupName, members: selectedMembers.map(m=>m.id) })
  }

  const CONTACTS = [
    { id:'la', initials:'LA', color:'#252840', name:'Léa Arnaud'    },
    { id:'km', initials:'KM', color:'#C8864B', name:'Kenji Matsuda' },
    { id:'so', initials:'SO', color:'#3D5C28', name:'Sara Okonkwo'  },
  ]

  const toggleMember = (c) => {
    setSelectedMembers(prev =>
      prev.find(m => m.id === c.id) ? prev.filter(m => m.id !== c.id) : [...prev, c]
    )
  }

  return (
    <main className="pt-[62px] h-screen bg-white flex overflow-hidden">

      {/* ── Sidebar ── */}
      <div className="w-[280px] bg-white border-r border-black/[0.09] flex flex-col flex-shrink-0">

        {/* Header sidebar */}
        <div className="px-4 py-4 border-b border-black/[0.09] flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#1A1410]">Messages</h2>
          <button
            onClick={() => setCreateGroupOpen(true)}
            title="Create group"
            className="w-8 h-8 rounded-lg bg-[#ECEEF8] text-[#252840] text-[18px] font-bold flex items-center justify-center cursor-pointer hover:bg-[#252840] hover:text-white transition-all border-none"
          >
            +
          </button>
        </div>

        {/* Liste conversations */}
        <div className="flex-1 overflow-y-auto">
          {conversations.map(conv => (
            <button
              key={conv.id}
              onClick={() => { setActiveId(conv.id); setConversations(prev => prev.map(c => c.id === conv.id ? {...c, unread:0} : c)) }}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-black/[0.05] text-left cursor-pointer transition-all
                ${activeId === conv.id ? 'bg-[#ECEEF8]' : 'bg-transparent hover:bg-black/[0.02]'}`}
            >
              {/* Avatar — groupe ou 1-à-1 */}
              {conv.type === 'group' ? (
                <div className="w-9 h-9 rounded-full bg-[#363B6B] flex items-center justify-center text-[14px] flex-shrink-0">
                  👥
                </div>
              ) : (
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: conv.color }}>
                  {conv.initials}
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <span className="text-[13px] font-semibold text-[#1A1410] truncate">{conv.name}</span>
                  <span className="text-[10px] text-[#7A6E5C] flex-shrink-0">{conv.time}</span>
                </div>
                <div className="text-[12px] text-[#7A6E5C] truncate">{conv.preview}</div>
              </div>

              {conv.unread > 0 && (
                <div className="w-5 h-5 rounded-full bg-[#252840] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {conv.unread}
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* ── Zone principale ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header chat */}
        <div className="bg-white border-b border-black/[0.09] px-6 py-3 flex items-center gap-3 flex-shrink-0">
          {active?.type === 'group' ? (
            <div className="w-9 h-9 rounded-full bg-[#363B6B] flex items-center justify-center text-[16px] flex-shrink-0">👥</div>
          ) : (
            <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
              style={{ background: active?.color }}>
              {active?.initials}
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="text-[14px] font-bold text-[#1A1410]">{active?.name}</div>
            {active?.type === 'group' ? (
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-[#7A6E5C]">
                  {active.participants.length + 1} members
                </span>
                <div className="flex -space-x-1 ml-1">
                  {active.participants.slice(0,3).map((p,i) => (
                    <div key={i}
                      className="w-4 h-4 rounded-full border border-white flex items-center justify-center text-[7px] font-bold text-white"
                      style={{ background: p.color }}>
                      {p.initials}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-[11px] text-[#252840] font-medium">{active?.skill}</div>
            )}
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 bg-[#F8F8F8]">
          {msgs.map(msg => {

            // Message système
            if (msg.from === 'system') return (
              <div key={msg.id} className="flex justify-center">
                <div className="bg-black/[0.06] text-[#7A6E5C] text-[12px] px-4 py-2 rounded-full">{msg.text}</div>
              </div>
            )

            const isMe = msg.from === 'me'
            const senderColor = SENDER_COLORS[msg.from]

            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                {/* Avatar expéditeur dans les groupes */}
                {isGroup && !isMe && (
                  <div className="w-6 h-6 rounded-full flex-shrink-0 flex items-center justify-center text-[9px] font-bold text-white self-end mb-1"
                    style={{ background: senderColor ?? '#7A6E5C' }}>
                    {msg.senderName?.[0] ?? '?'}
                  </div>
                )}

                <div className="max-w-[65%]">
                  {/* Nom expéditeur (groupes uniquement) */}
                  {isGroup && !isMe && (
                    <div className="text-[10px] font-bold mb-1" style={{ color: senderColor ?? '#7A6E5C' }}>
                      {msg.senderName}
                    </div>
                  )}
                  <div className={`px-4 py-[10px] rounded-2xl text-[14px] leading-[1.5]
                    ${isMe
                      ? 'bg-[#252840] text-white rounded-br-[4px]'
                      : 'bg-white text-[#1A1410] rounded-bl-[4px] border border-black/[0.07]'
                    }`}>
                    {msg.text}
                    <div className={`text-[10px] mt-1 ${isMe ? 'text-white/50 text-right' : 'text-[#7A6E5C]'}`}>
                      {msg.time}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start gap-2">
              <div className="bg-white border border-black/[0.07] px-4 py-3 rounded-2xl rounded-bl-[4px] flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <div key={i} className="w-[6px] h-[6px] rounded-full bg-[#7A6E5C] animate-bounce"
                    style={{ animationDelay:`${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* SessionTimer — juste au-dessus de l'input */}
        <SessionTimer
          roomId={activeId}
          isGroup={isGroup}
          participants={active?.participants ?? []}
          currentUser={{ id:'me', name:'Me', credits }}
          partnerName={active?.name}
          socket={null} // TODO Dev 3: passer le vrai socket ici
          onCreditsChange={(delta) => setCredits(p => Math.max(0, p + delta))}
        />

        {/* Input texte */}
        <div className="bg-white border-t border-black/[0.09] px-5 py-3 flex gap-3 items-center flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
            placeholder="Type a message… (free)"
            className="flex-1 px-4 py-[10px] rounded-full border-[1.5px] border-black/[0.09] bg-[#F8F8F8] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
          />
          <button onClick={send}
            className="w-10 h-10 rounded-full bg-[#252840] border-none cursor-pointer flex items-center justify-center hover:bg-[#363B6B] transition-all flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l6 5-6 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>

      {/* ── Modal création de groupe ── */}
      {createGroupOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setCreateGroupOpen(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-[420px]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-[17px] font-black text-[#1A1410]">Create a group</h3>
              <button onClick={() => setCreateGroupOpen(false)}
                className="w-7 h-7 rounded-full bg-black/5 border-none cursor-pointer text-[#7A6E5C] flex items-center justify-center hover:bg-black/10 text-[13px]">✕</button>
            </div>

            <div className="bg-[#E4EED8] rounded-xl px-4 py-3 mb-4 text-[12px] text-[#3D5C28] font-medium">
              🎉 Group calls are always free — no credits needed. Invite as many connections as you want!
            </div>

            <div className="mb-4">
              <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-1">Group name</label>
              <input
                value={groupName}
                onChange={e => setGroupName(e.target.value)}
                placeholder="ex: Maths Study Group"
                className="w-full px-4 py-[10px] rounded-xl border-[1.5px] border-black/[0.09] bg-[#F8F8F8] text-[13px] outline-none focus:border-[#252840] transition-all"
              />
            </div>

            <div className="mb-5">
              <label className="text-[11px] font-bold uppercase tracking-[0.6px] text-[#7A6E5C] block mb-2">
                Add members ({selectedMembers.length} selected)
              </label>
              {CONTACTS.map(c => {
                const selected = !!selectedMembers.find(m => m.id === c.id)
                return (
                  <button key={c.id} onClick={() => toggleMember(c)}
                    className={`w-full flex items-center gap-3 px-3 py-[10px] rounded-xl mb-1 border-[1.5px] cursor-pointer transition-all text-left
                      ${selected ? 'bg-[#ECEEF8] border-[#252840]' : 'bg-transparent border-black/[0.07] hover:border-[#252840]/30'}`}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[12px] text-white flex-shrink-0"
                      style={{ background: c.color }}>{c.initials}</div>
                    <span className="text-[13px] font-semibold text-[#1A1410] flex-1">{c.name}</span>
                    {selected && <span className="text-[#252840] text-[14px]">✓</span>}
                  </button>
                )
              })}
            </div>

            <button
              onClick={createGroup}
              disabled={!groupName.trim() || selectedMembers.length === 0}
              className="w-full py-[11px] rounded-xl bg-[#252840] text-white text-[13px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Create group
            </button>
          </div>
        </div>
      )}
    </main>
  )
}