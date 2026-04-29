// src/pages/Chat.jsx
// Dev 3 branchera Socket.io ici pour les messages en temps réel
import { useState, useRef, useEffect } from 'react'

const CONVERSATIONS = [
  { id:'la', initials:'LA', color:'#252840', name:'Léa Arnaud',   skill:'Maths ↔ English',   preview:'Super, on commence ?', time:'12:04', unread:2 },
  { id:'km', initials:'KM', color:'#C8864B', name:'Kenji Matsuda',skill:'Japanese ↔ French', preview:"Demain c'est bon !",    time:'Hier',  unread:0 },
  { id:'so', initials:'SO', color:'#3D5C28', name:'Sara Okonkwo', skill:'English ↔ Spanish', preview:'Tu enseignes les maths ?', time:'Lun', unread:1 },
]

const INIT_MESSAGES = {
  la: [
    { id:1, from:'them', text:"Salut ! Tu es dispo pour commencer notre session maths aujourd'hui ?", time:'12:01' },
    { id:2, from:'me',   text:'Oui ! Je suis libre à partir de 15h.', time:'12:02' },
    { id:3, from:'them', text:'Parfait. On fait 1h, ça te convient ?', time:'12:03' },
    { id:4, from:'them', text:'Super, on commence ?', time:'12:04' },
  ],
  km: [
    { id:1, from:'them', text:'Hey ! Comment avance ton japonais ?', time:'Hier' },
    { id:2, from:'me',   text:"Bien, j'ai appris 10 nouveaux mots aujourd'hui !", time:'Hier' },
    { id:3, from:'them', text:"Demain c'est bon !", time:'Hier' },
  ],
  so: [
    { id:1, from:'them', text:'Tu enseignes les maths ?', time:'Lun' },
  ],
}

export default function Chat() {
  const [activeId, setActiveId] = useState('la')
  const [messages, setMessages] = useState(INIT_MESSAGES)
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [callActive, setCallActive] = useState(false)
  const messagesEndRef = useRef(null)

  const active = CONVERSATIONS.find(c => c.id === activeId)
  const msgs = messages[activeId] ?? []

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const send = () => {
    if (!input.trim()) return
    const newMsg = { id: Date.now(), from: 'me', text: input.trim(), time: new Date().toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'}) }
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId]??[]), newMsg] }))
    setInput('')

    // Simulation réponse (Dev 3 remplacera par Socket.io)
    setTyping(true)
    setTimeout(() => {
      setTyping(false)
      const reply = { id: Date.now()+1, from:'them', text:'👍 Reçu !', time: new Date().toLocaleTimeString('fr',{hour:'2-digit',minute:'2-digit'}) }
      setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId]??[]), reply] }))
    }, 1800)
  }

  return (
    <main className="pt-[62px] h-screen bg-[#F8F4EA] flex overflow-hidden">

      {/* Sidebar conversations */}
      <div className="w-[280px] bg-[#FDFAF4] border-r border-black/[0.09] flex flex-col flex-shrink-0">
        <div className="px-5 py-4 border-b border-black/[0.09]">
          <h2 className="text-[15px] font-bold text-[#1A1410]">Messages</h2>
        </div>
        <div className="flex-1 overflow-y-auto">
          {CONVERSATIONS.map(conv => (
            <button key={conv.id} onClick={() => setActiveId(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-black/[0.05] text-left cursor-pointer transition-all
                ${activeId === conv.id ? 'bg-[#ECEEF8]' : 'bg-transparent hover:bg-[#F8F4EA]'}`}
            >
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: conv.color }}>
                {conv.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold text-[#1A1410] truncate">{conv.name}</span>
                  <span className="text-[10px] text-[#7A6E5C] flex-shrink-0 ml-1">{conv.time}</span>
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

      {/* Main chat area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Chat header */}
        <div className="bg-[#FDFAF4] border-b border-black/[0.09] px-6 py-3 flex items-center gap-3 flex-shrink-0">
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0" style={{ background: active?.color }}>
            {active?.initials}
          </div>
          <div>
            <div className="text-[14px] font-bold text-[#1A1410]">{active?.name}</div>
            <div className="text-[11px] text-[#252840] font-medium">{active?.skill}</div>
          </div>
          <div className="ml-auto flex gap-2">
            {/* Timer session */}
            <div className="px-3 py-1 bg-[#E4EED8] text-[#3D5C28] text-[11px] font-bold rounded-full">
              ⏱ Session: 0 credits used
            </div>
            {/* Bouton appel vocal — Dev 3 branchera WebRTC ici */}
            <button
              onClick={() => setCallActive(p => !p)}
              className={`px-3 py-[6px] rounded-lg text-[12px] font-bold border-[1.5px] cursor-pointer transition-all
                ${callActive ? 'bg-red-500 text-white border-red-500' : 'border-[#252840] text-[#252840] bg-transparent hover:bg-[#252840] hover:text-white'}`}
            >
              {callActive ? '📵 End call' : '🎙 Voice call'}
            </button>
          </div>
        </div>

        {/* Call banner */}
        {callActive && (
          <div className="bg-[#252840] text-white px-6 py-2 text-center text-[13px] font-medium flex-shrink-0">
            🔴 Voice call in progress — {active?.name} · 00:00
            <span className="text-white/50 ml-2 text-xs">Dev 3 will connect WebRTC here</span>
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-8 py-6 flex flex-col gap-4 bg-[#F3F1EC]">
          {msgs.map(msg => (
            <div key={msg.id} className={`flex ${msg.from === 'me' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[65%] px-4 py-[10px] rounded-2xl text-[14px] leading-[1.5]
                ${msg.from === 'me'
                  ? 'bg-[#252840] text-white rounded-br-[4px]'
                  : 'bg-[#FDFAF4] text-[#1A1410] rounded-bl-[4px] border border-black/[0.07]'
                }`}>
                {msg.text}
                <div className={`text-[10px] mt-1 ${msg.from === 'me' ? 'text-white/50 text-right' : 'text-[#7A6E5C]'}`}>
                  {msg.time}
                </div>
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {typing && (
            <div className="flex justify-start">
              <div className="bg-[#FDFAF4] border border-black/[0.07] px-4 py-3 rounded-2xl rounded-bl-[4px] flex gap-1 items-center">
                {[0,1,2].map(i => (
                  <div key={i} className="w-[6px] h-[6px] rounded-full bg-[#7A6E5C] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="bg-[#FDFAF4] border-t border-black/[0.09] px-6 py-4 flex gap-3 items-center flex-shrink-0">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message..."
            className="flex-1 px-4 py-[10px] rounded-full border-[1.5px] border-black/[0.09] bg-[#F8F4EA] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
          />
          <button onClick={send}
            className="w-10 h-10 rounded-full bg-[#252840] border-none cursor-pointer flex items-center justify-center hover:bg-[#363B6B] transition-all flex-shrink-0">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 8h12M9 3l6 5-6 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </main>
  )
}
