import { useState, useRef, useEffect } from 'react'
import useAuthStore from '../store/authStore'
import { convApi, getApiError } from '../services/api'

const SENDER_COLORS = {
  la:'#252840',
  km:'#C8864B',
  so:'#3D5C28'
}

export default function Chat() {
  const { user } = useAuthStore()

  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState({})
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)

  const messagesEndRef = useRef(null)
  const pollRef = useRef(null)

  const active = conversations.find(c => c.id === activeId)
  const msgs = messages[activeId] ?? []
  const isGroup = active?.type === 'group'

  // Charger conversations
  useEffect(() => {
    if (!user) return

    convApi.list()
      .then(data => {

        const convs = (data.conversations ?? data).map(c => ({
          id: c.id,
          type: '1-1',

          name: `${c.other.firstName} ${c.other.lastName}`,

          initials:
            `${c.other.firstName[0]}${c.other.lastName[0]}`
              .toUpperCase(),

          color: '#252840',

          preview: c.lastMessage?.body ?? '',

          time: c.lastMessage
            ? new Date(c.lastMessage.createdAt)
                .toLocaleTimeString('fr', {
                  hour:'2-digit',
                  minute:'2-digit'
                })
            : '',

          unread: 0,
          participants: [],
        }))

        setConversations(convs)

        if (convs.length > 0) {
          setActiveId(convs[0].id)
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false))

  }, [user?.id])

  // Charger messages
  useEffect(() => {

    if (!activeId) return

    convApi.messages(activeId)
      .then(data => {

        const msgs = (data.messages ?? data).map(m => ({
          id: m.id,

          from:
            m.sender.id === user?.id
              ? 'me'
              : 'them',

          senderName:
            `${m.sender.firstName} ${m.sender.lastName}`,

          text: m.body,

          time:
            new Date(m.createdAt)
              .toLocaleTimeString('fr', {
                hour:'2-digit',
                minute:'2-digit'
              }),
        }))

        setMessages(prev => ({
          ...prev,
          [activeId]: msgs
        }))
      })
      .catch(console.error)

    // Polling
    pollRef.current = setInterval(() => {

      convApi.messages(activeId)
        .then(data => {

          const msgs = (data.messages ?? data).map(m => ({
            id: m.id,

            from:
              m.sender.id === user?.id
                ? 'me'
                : 'them',

            senderName:
              `${m.sender.firstName} ${m.sender.lastName}`,

            text: m.body,

            time:
              new Date(m.createdAt)
                .toLocaleTimeString('fr', {
                  hour:'2-digit',
                  minute:'2-digit'
                }),
          }))

          setMessages(prev => ({
            ...prev,
            [activeId]: msgs
          }))
        })
        .catch(() => {})

    }, 3000)

    return () => clearInterval(pollRef.current)

  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    })
  }, [msgs])

  const send = async () => {

    if (!input.trim() || !activeId || sending) return

    setSending(true)

    const text = input.trim()

    setInput('')

    // Message optimiste
    const tmp = {
      id: Date.now(),
      from:'me',
      text,
      time: new Date().toLocaleTimeString('fr', {
        hour:'2-digit',
        minute:'2-digit'
      })
    }

    setMessages(prev => ({
      ...prev,
      [activeId]: [
        ...(prev[activeId] ?? []),
        tmp
      ]
    }))

    try {

      await convApi.send(activeId, text)

    } catch(e) {

      console.error(getApiError(e))

    } finally {

      setSending(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        Loading...
      </div>
    )
  }

  return (
    <main className="pt-[62px] h-screen bg-white flex overflow-hidden">

      {/* Sidebar */}
      <div className="w-[280px] bg-white border-r border-black/[0.09] flex flex-col flex-shrink-0">

        <div className="px-4 py-4 border-b border-black/[0.09]">
          <h2 className="text-[15px] font-bold text-[#1A1410]">
            Messages
          </h2>
        </div>

        <div className="flex-1 overflow-y-auto">

          {conversations.map(conv => (

            <button
              key={conv.id}
              onClick={() => setActiveId(conv.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 border-b border-black/[0.05] text-left transition-all
              ${activeId === conv.id
                ? 'bg-[#ECEEF8]'
                : 'hover:bg-black/[0.02]'
              }`}
            >

              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
                style={{ background: conv.color }}
              >
                {conv.initials}
              </div>

              <div className="flex-1 min-w-0">

                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-semibold truncate">
                    {conv.name}
                  </span>

                  <span className="text-[10px] text-[#7A6E5C]">
                    {conv.time}
                  </span>
                </div>

                <div className="text-[12px] text-[#7A6E5C] truncate">
                  {conv.preview}
                </div>

              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-black/[0.09] px-6 py-3 flex items-center gap-3">

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white"
            style={{ background: active?.color }}
          >
            {active?.initials}
          </div>

          <div>
            <div className="text-[14px] font-bold">
              {active?.name}
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 bg-[#F8F8F8]">

          {msgs.map(msg => {

            const isMe = msg.from === 'me'

            return (
              <div
                key={msg.id}
                className={`flex ${
                  isMe
                    ? 'justify-end'
                    : 'justify-start'
                }`}
              >

                <div
                  className={`max-w-[65%] px-4 py-[10px] rounded-2xl text-[14px]
                  ${isMe
                    ? 'bg-[#252840] text-white rounded-br-[4px]'
                    : 'bg-white border border-black/[0.07] rounded-bl-[4px]'
                  }`}
                >
                  {msg.text}

                  <div
                    className={`text-[10px] mt-1
                    ${isMe
                      ? 'text-white/50'
                      : 'text-[#7A6E5C]'
                    }`}
                  >
                    {msg.time}
                  </div>

                </div>
              </div>
            )
          })}

          <div ref={messagesEndRef} />

        </div>

        {/* Input */}
        <div className="bg-white border-t border-black/[0.09] px-5 py-3 flex gap-3 items-center">

          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e =>
              e.key === 'Enter' &&
              !e.shiftKey &&
              send()
            }
            placeholder="Type a message..."
            className="flex-1 px-4 py-[10px] rounded-full border-[1.5px] border-black/[0.09] bg-[#F8F8F8]"
          />

          <button
            onClick={send}
            disabled={sending}
            className="w-10 h-10 rounded-full bg-[#252840] text-white"
          >
            →
          </button>

        </div>
      </div>
    </main>
  )
}