import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { conversationApi, creditApi, getApiError, sessionApi } from '../services/api'
import useAuthStore from '../store/authStore'

export default function Chat() {
  const navigate = useNavigate()
  const { user, setUser } = useAuthStore()
  const [conversations, setConversations] = useState([])
  const [activeId, setActiveId] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [credits, setCredits] = useState(user?.credits ?? 0)
  const [loadingConversations, setLoadingConversations] = useState(true)
  const [loadingMessages, setLoadingMessages] = useState(false)
  const [sending, setSending] = useState(false)
  const [startingSession, setStartingSession] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)

  const activeConversation = useMemo(
    () => conversations.find((conversation) => conversation.id === activeId) ?? null,
    [conversations, activeId]
  )

  const getPartner = (conversation) => {
    if (!conversation || !user) return null
    const partnerId = conversation.firstUserId === user.id ? conversation.secondUserId : conversation.firstUserId
    const partner = conversation.firstUserId === user.id ? conversation.secondUser : conversation.firstUser
    return { id: partnerId, ...partner }
  }

  const activePartner = getPartner(activeConversation)

  const loadConversations = async () => {
    setLoadingConversations(true)
    setError('')
    try {
      const [conversationList, creditState] = await Promise.all([
        conversationApi.list(),
        creditApi.get().catch(() => null),
      ])
      setConversations(conversationList)
      if (creditState) {
        setCredits(creditState.credits)
        setUser({ ...user, credits: creditState.credits })
      }
      setActiveId((current) => current ?? conversationList[0]?.id ?? null)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoadingConversations(false)
    }
  }

  const loadMessages = async (conversationId) => {
    if (!conversationId) {
      setMessages([])
      return
    }

    setLoadingMessages(true)
    setError('')
    try {
      const data = await conversationApi.messages(conversationId)
      setMessages(data)
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setLoadingMessages(false)
    }
  }

  useEffect(() => {
    loadConversations()
  }, [])

  useEffect(() => {
    loadMessages(activeId)
  }, [activeId])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async () => {
    const body = input.trim()
    if (!body || !activeId || sending) return

    setSending(true)
    setError('')
    try {
      const message = await conversationApi.sendMessage(activeId, body)
      setMessages((current) => [...current, message])
      setInput('')
      await loadConversations()
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setSending(false)
    }
  }

  const startSession = async () => {
    if (!activePartner || startingSession) return

    setStartingSession(true)
    setError('')
    try {
      const session = await sessionApi.create({
        learnerId: activePartner.id,
        title: `SkillBridge session with ${activePartner.firstName} ${activePartner.lastName}`,
        estimatedDuration: 30,
        scheduledAt: new Date().toISOString(),
      })
      navigate('/call', { state: { session, partner: activePartner } })
    } catch (err) {
      setError(getApiError(err))
    } finally {
      setStartingSession(false)
    }
  }

  return (
    <main className="pt-[62px] h-screen bg-white flex overflow-hidden">
      <div className="w-[280px] bg-white border-r border-black/[0.09] flex flex-col flex-shrink-0">
        <div className="px-4 py-4 border-b border-black/[0.09] flex items-center justify-between">
          <h2 className="text-[15px] font-bold text-[#1A1410]">Messages</h2>
          <span className="text-[11px] text-[#7A6E5C]">{credits} credits</span>
        </div>
        <div className="flex-1 overflow-y-auto">
          {loadingConversations && <div className="p-4 text-[13px] text-[#7A6E5C]">Loading conversations...</div>}
          {!loadingConversations && conversations.length === 0 && (
            <div className="p-4 text-[13px] text-[#7A6E5C]">No conversations yet. Accept a match request to create one.</div>
          )}
          {conversations.map((conversation) => {
            const partner = getPartner(conversation)
            const initials = `${partner?.firstName?.[0] ?? ''}${partner?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'
            const lastMessage = conversation.messages?.[0]

            return (
              <button
                key={conversation.id}
                onClick={() => setActiveId(conversation.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 border-b border-black/[0.05] text-left cursor-pointer transition-all ${
                  activeId === conversation.id ? 'bg-[#ECEEF8]' : 'bg-transparent hover:bg-black/[0.02]'
                }`}
              >
                <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 bg-[#252840]">
                  {initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[13px] font-semibold text-[#1A1410] truncate">
                    {partner?.firstName} {partner?.lastName}
                  </div>
                  <div className="text-[12px] text-[#7A6E5C] truncate">
                    {lastMessage?.body ?? 'No messages yet'}
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {activeConversation ? (
          <>
            <div className="bg-white border-b border-black/[0.09] px-6 py-3 flex items-center gap-3 flex-shrink-0">
              <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0 bg-[#252840]">
                {`${activePartner?.firstName?.[0] ?? ''}${activePartner?.lastName?.[0] ?? ''}`.toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14px] font-bold text-[#1A1410]">{activePartner?.firstName} {activePartner?.lastName}</div>
                <div className="text-[11px] text-[#252840] font-medium">Conversation persisted in backend</div>
              </div>
              <button
                onClick={startSession}
                disabled={startingSession}
                className="px-4 py-[8px] rounded-xl bg-[#252840] text-white text-[12px] font-bold border-none cursor-pointer hover:bg-[#363B6B] transition-all disabled:opacity-50"
              >
                {startingSession ? 'Starting...' : 'Start session'}
              </button>
            </div>

            {error && <div className="px-6 py-2 bg-red-50 text-red-600 text-[13px] border-b border-red-100">{error}</div>}

            <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-3 bg-[#F8F8F8]">
              {loadingMessages && <div className="text-[13px] text-[#7A6E5C]">Loading messages...</div>}
              {!loadingMessages && messages.length === 0 && (
                <div className="text-center py-12 text-[#7A6E5C] text-[13px]">No messages yet. Send the first one.</div>
              )}
              {messages.map((message) => {
                const isMe = message.senderId === user?.id
                return (
                  <div key={message.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'} gap-2`}>
                    <div className="max-w-[65%]">
                      <div className={`px-4 py-[10px] rounded-2xl text-[14px] leading-[1.5] ${
                        isMe
                          ? 'bg-[#252840] text-white rounded-br-[4px]'
                          : 'bg-white text-[#1A1410] rounded-bl-[4px] border border-black/[0.07]'
                      }`}>
                        {message.body}
                        <div className={`text-[10px] mt-1 ${isMe ? 'text-white/50 text-right' : 'text-[#7A6E5C]'}`}>
                          {message.createdAt ? new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
              <div ref={messagesEndRef} />
            </div>

            <div className="bg-white border-t border-black/[0.09] px-5 py-3 flex gap-3 items-center flex-shrink-0">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && send()}
                placeholder="Type a message..."
                className="flex-1 px-4 py-[10px] rounded-full border-[1.5px] border-black/[0.09] bg-[#F8F8F8] text-[14px] text-[#1A1410] outline-none focus:border-[#252840] transition-all"
              />
              <button
                onClick={send}
                disabled={sending || !input.trim()}
                className="w-10 h-10 rounded-full bg-[#252840] border-none cursor-pointer flex items-center justify-center hover:bg-[#363B6B] transition-all flex-shrink-0 disabled:opacity-50"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 8h12M9 3l6 5-6 5" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#F8F8F8]">
            <div className="max-w-[420px] text-center">
              <h1 className="text-[22px] font-black text-[#1A1410] mb-2">No conversation selected</h1>
              <p className="text-[14px] text-[#7A6E5C] leading-[1.6]">
                Conversations are loaded from the backend after a match request is accepted.
              </p>
              {error && <p className="text-[13px] text-red-500 mt-4">{error}</p>}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
