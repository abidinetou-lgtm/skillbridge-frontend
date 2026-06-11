import { useState, useRef, useEffect, useCallback } from 'react'
import useAuthStore from '../store/authStore'
import { convApi, getApiError } from '../services/api'
import api from '../services/api'
import { useToast } from '../components/Toast'

const CLOUDINARY_URL    = 'https://api.cloudinary.com/v1_1/derho2rib/auto/upload'
const CLOUDINARY_PRESET = 'skillbridge_avatars'

const CONV_COLORS = ['#252840', '#C8864B', '#3D5C28', '#363B6B']
function convColor(name) {
  const c = (name || '').charCodeAt(0) || 0
  return CONV_COLORS[c % CONV_COLORS.length]
}

function formatBytes(bytes) {
  if (!bytes) return ''
  if (bytes < 1024)    return `${bytes} o`
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} Ko`
  return `${(bytes / 1048576).toFixed(1)} Mo`
}

function fileIcon(type) {
  if (type === 'application/pdf')
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="1" width="12" height="14" rx="2"/><path d="M5 5h6M5 8h6M5 11h4"/></svg>
  if (type?.includes('word') || type?.includes('document'))
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="1" width="12" height="14" rx="2"/><path d="M5 6l2 6 1.5-4 1.5 4 2-6"/></svg>
  if (type?.includes('excel') || type?.includes('spreadsheet'))
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="2" y="1" width="12" height="14" rx="2"/><path d="M5 5h6M5 8h6M5 11h6M8 5v9"/></svg>
  if (type?.includes('zip') || type?.includes('compressed'))
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="3" y="1" width="10" height="14" rx="2"/><path d="M7 1v4M9 1v4M7 5h2M7 7h2M7 9h2"/></svg>
  if (type?.startsWith('video/'))
    return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="3" width="10" height="10" rx="2"/><path d="M11 6l4-2.5v8L11 9"/></svg>
  return <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M10 2H4a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2V6z"/><polyline points="10 2 10 6 14 6"/></svg>
}

function mapMessage(m, userId) {
  const isImg   = m.fileUrl && (m.mimeType ?? m.fileType ?? '').startsWith('image/')
  const isVideo = m.fileUrl && (m.mimeType ?? m.fileType ?? '').startsWith('video/')
  const isFile  = m.fileUrl && !isImg && !isVideo
  return {
    id:       m.id,
    from:     m.sender.id === userId ? 'me' : 'them',
    senderName: `${m.sender.firstName} ${m.sender.lastName}`,
    text:     m.body ?? null,
    fileUrl:  m.fileUrl ?? null,
    fileName: m.fileName ?? null,
    fileSize: m.fileSize ?? null,
    fileType: m.mimeType ?? m.fileType ?? null,
    msgType:  isImg ? 'image' : isVideo ? 'video' : isFile ? 'file' : 'text',
    time:     new Date(m.createdAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
  }
}

export default function Chat() {
  const { user }  = useAuthStore()
  const addToast  = useToast()

  const [conversations,  setConversations]  = useState([])
  const [activeId,       setActiveId]       = useState(null)
  const [messages,       setMessages]       = useState({})
  const [input,          setInput]          = useState('')
  const [loading,        setLoading]        = useState(true)
  const [sending,        setSending]        = useState(false)
  const [uploading,      setUploading]      = useState(false)
  const [showAttach,     setShowAttach]     = useState(false)
  const [lightbox,       setLightbox]       = useState(null)
  const [showThread,     setShowThread]     = useState(false)

  const messagesEndRef = useRef(null)
  const pollRef        = useRef(null)
  const fileRef        = useRef(null)
  const imageRef       = useRef(null)
  const videoRef       = useRef(null)
  const attachBarRef   = useRef(null)

  const active = conversations.find(c => c.id === activeId)
  const msgs   = messages[activeId] ?? []

  useEffect(() => {
    if (!showAttach) return
    const handler = (e) => {
      if (!attachBarRef.current?.contains(e.target)) setShowAttach(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showAttach])

  useEffect(() => {
    if (!user) return
    convApi.list()
      .then(data => {
        const convs = (data.conversations ?? data).map(c => ({
          id:       c.id,
          name:     `${c.other.firstName} ${c.other.lastName}`,
          initials: `${c.other.firstName[0]}${c.other.lastName[0]}`.toUpperCase(),
          color:    convColor(c.other.firstName),
          preview:  c.lastMessage?.body ?? '',
          time:     c.lastMessage
            ? new Date(c.lastMessage.createdAt).toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' })
            : '',
          unread: c.unreadCount ?? 0,
        }))
        setConversations(convs)
        if (convs.length > 0) setActiveId(convs[0].id)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [user?.id])

  const fetchMessages = useCallback((convId) => {
    convApi.messages(convId)
      .then(data => {
        const mapped = (data.messages ?? data).map(m => mapMessage(m, user?.id))
        setMessages(prev => ({ ...prev, [convId]: mapped }))
      })
      .catch(() => {})
  }, [user?.id])

  useEffect(() => {
    if (!activeId) return
    fetchMessages(activeId)
    pollRef.current = setInterval(() => fetchMessages(activeId), 3000)
    return () => clearInterval(pollRef.current)
  }, [activeId, fetchMessages])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [msgs])

  const send = async () => {
    if (!input.trim() || !activeId || sending) return
    setSending(true)
    const text = input.trim()
    setInput('')
    const tmp = {
      id: Date.now(), from: 'me', msgType: 'text', text,
      time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), tmp] }))
    try { await convApi.send(activeId, text) }
    catch (e) { console.error(getApiError(e)) }
    finally { setSending(false) }
  }

  const uploadFile = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeId) return
    e.target.value = ''
    setShowAttach(false)
    setUploading(true)
    const form = new FormData()
    form.append('file', file)
    try {
      const res = await api.post(`/conversations/${activeId}/files`, form, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      const d = res.data
      const tmp = {
        id: Date.now(), from: 'me', msgType: 'file',
        fileUrl:  d.url ?? d.fileUrl,
        fileName: d.fileName ?? file.name,
        fileSize: d.fileSize ?? file.size,
        fileType: d.fileType ?? file.type,
        time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), tmp] }))
      addToast?.('Fichier envoyé', 'success')
    } catch { addToast?.('Erreur lors de l\'envoi du fichier', 'error') }
    finally { setUploading(false) }
  }

  const uploadCloudinary = async (file) => {
    const form = new FormData()
    form.append('file', file)
    form.append('upload_preset', CLOUDINARY_PRESET)
    const res  = await fetch(CLOUDINARY_URL, { method: 'POST', body: form })
    const data = await res.json()
    if (data.error) throw new Error(data.error.message)
    return { url: data.secure_url, fileType: file.type, fileName: file.name, fileSize: file.size }
  }

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeId) return
    e.target.value = ''
    setShowAttach(false)
    setUploading(true)
    try {
      const { url } = await uploadCloudinary(file)
      const tmp = { id: Date.now(), from: 'me', msgType: 'image', fileUrl: url, fileName: file.name, fileSize: file.size, fileType: file.type, time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), tmp] }))
      addToast?.('Image envoyée', 'success')
    } catch { addToast?.('Erreur lors de l\'envoi de l\'image', 'error') }
    finally { setUploading(false) }
  }

  const handleVideoUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file || !activeId) return
    e.target.value = ''
    setShowAttach(false)
    setUploading(true)
    try {
      const { url } = await uploadCloudinary(file)
      const tmp = { id: Date.now(), from: 'me', msgType: 'video', fileUrl: url, fileName: file.name, fileSize: file.size, fileType: file.type, time: new Date().toLocaleTimeString('fr', { hour: '2-digit', minute: '2-digit' }) }
      setMessages(prev => ({ ...prev, [activeId]: [...(prev[activeId] ?? []), tmp] }))
      addToast?.('Vidéo envoyée', 'success')
    } catch { addToast?.('Erreur lors de l\'envoi de la vidéo', 'error') }
    finally { setUploading(false) }
  }

  const openConversation = (convId) => {
    setActiveId(convId)
    setShowThread(true)
  }

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-[#FDFAF4]">
      <div className="w-8 h-8 border-2 border-[#252840]/20 border-t-[#252840] rounded-full animate-spin" />
    </div>
  )

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-[600] bg-black/90 flex items-center justify-center p-6"
          onClick={() => setLightbox(null)}>
          <img src={lightbox} alt="Aperçu" className="max-w-full max-h-full object-contain rounded-xl" />
          <button onClick={() => setLightbox(null)}
            className="absolute top-4 right-4 h-10 w-10 rounded-full bg-white/20 text-white flex items-center justify-center border-none cursor-pointer hover:bg-white/30">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 1l12 12M13 1L1 13"/></svg>
          </button>
        </div>
      )}

      <main className="h-screen bg-[#FDFAF4] flex overflow-hidden" style={{ paddingTop: '64px' }}>

        {/* Sidebar */}
        <div className={`flex-shrink-0 w-full sm:w-80 bg-white border-r border-[#E8DDC7] flex flex-col ${showThread ? 'hidden sm:flex' : 'flex'}`}>
          <div className="px-5 py-4 border-b border-[#E8DDC7]">
            <h2 className="text-lg font-black text-[#252840]">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-6 text-center text-sm text-[#756B5B]">Aucune conversation</div>
            ) : conversations.map(conv => (
              <button key={conv.id} onClick={() => openConversation(conv.id)}
                className={`w-full flex items-center gap-3 px-5 py-4 border-b border-[#F0EAE0] text-left transition-colors cursor-pointer ${
                  activeId === conv.id ? 'bg-[rgba(37,40,64,0.06)]' : 'bg-transparent hover:bg-[#F8F4EA]'
                }`}>
                <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: conv.color }}>
                  {conv.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-[#252840] truncate">{conv.name}</span>
                    <span className="text-[10px] text-[#B0A898] flex-shrink-0 ml-1">{conv.time}</span>
                  </div>
                  <div className="flex items-center justify-between mt-0.5">
                    <span className="text-xs text-[#756B5B] truncate">{conv.preview || 'Démarrez la conversation'}</span>
                    {conv.unread > 0 && (
                      <span className="ml-2 h-5 w-5 rounded-full bg-[#C8864B] text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                        {conv.unread}
                      </span>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Thread */}
        <div className={`flex-1 flex flex-col overflow-hidden ${!showThread && 'hidden sm:flex'}`}>

          {!active ? (
            <div className="flex-1 flex items-center justify-center text-[#756B5B] text-sm">
              Sélectionnez une conversation
            </div>
          ) : (
            <>
              {/* Thread header */}
              <div className="bg-white border-b border-[#E8DDC7] px-5 py-4 flex items-center gap-3">
                <button
                  onClick={() => setShowThread(false)}
                  className="sm:hidden h-8 w-8 rounded-full bg-[#F8F4EA] flex items-center justify-center border-none cursor-pointer mr-1 flex-shrink-0">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="#252840" strokeWidth="1.8" strokeLinecap="round">
                    <path d="M9 2L4 7l5 5"/>
                  </svg>
                </button>
                <div className="h-10 w-10 rounded-full flex items-center justify-center font-bold text-sm text-white flex-shrink-0"
                  style={{ background: active.color }}>
                  {active.initials}
                </div>
                <div>
                  <p className="font-bold text-[#252840] text-sm">{active.name}</p>
                  <p className="text-xs font-semibold">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#3D5C28] mr-1 align-middle" />
                    <span className="text-[#3D5C28]">En ligne</span>
                  </p>
                </div>
              </div>

              {/* Messages area */}
              <div className="flex-1 overflow-y-auto px-5 py-5 flex flex-col gap-3 bg-[#FDFAF4]">
                {msgs.map(msg => {
                  const isMe = msg.from === 'me'
                  return (
                    <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[70%] rounded-2xl overflow-hidden ${
                        msg.msgType === 'image' || msg.msgType === 'video' ? '' : 'px-4 py-3'
                      } ${isMe
                        ? 'bg-[#252840] text-[#F8F4EA] rounded-br-sm'
                        : 'bg-white border border-[#E8DDC7] rounded-bl-sm text-[#252840] shadow-sm'
                      }`}>

                        {msg.msgType === 'image' && (
                          <div>
                            <img src={msg.fileUrl} alt={msg.fileName}
                              className="max-w-[220px] rounded-2xl border border-[rgba(0,0,0,0.06)] cursor-pointer block"
                              onClick={() => setLightbox(msg.fileUrl)} />
                            <div className={`px-3 py-1 text-[10px] ${isMe ? 'text-white/50' : 'text-[#756B5B]'}`}>{msg.time}</div>
                          </div>
                        )}

                        {msg.msgType === 'video' && (
                          <div>
                            <video src={msg.fileUrl} controls className="max-w-[220px] rounded-2xl block bg-black" />
                            <div className={`px-3 py-1 text-[10px] ${isMe ? 'text-white/50' : 'text-[#756B5B]'}`}>{msg.time}</div>
                          </div>
                        )}

                        {msg.msgType === 'file' && (
                          <div>
                            <a href={msg.fileUrl} target="_blank" rel="noreferrer"
                              className={`flex items-center gap-3 no-underline p-1 ${isMe ? 'text-[#F8F4EA]' : 'text-[#252840]'}`}>
                              <span className="h-10 w-10 rounded-xl bg-[rgba(200,134,75,0.12)] flex items-center justify-center text-xl flex-shrink-0">
                                {fileIcon(msg.fileType)}
                              </span>
                              <div className="min-w-0">
                                <p className="text-sm font-semibold truncate underline">{msg.fileName}</p>
                                {msg.fileSize && <p className={`text-[10px] ${isMe ? 'text-white/50' : 'text-[#756B5B]'}`}>{formatBytes(msg.fileSize)}</p>}
                              </div>
                              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" className="flex-shrink-0 opacity-60">
                                <path d="M7 1v8M2 9l5 4 5-4"/><path d="M1 12h12"/>
                              </svg>
                            </a>
                            <div className={`text-[10px] mt-1 px-1 ${isMe ? 'text-white/50' : 'text-[#756B5B]'}`}>{msg.time}</div>
                          </div>
                        )}

                        {msg.msgType === 'text' && (
                          <>
                            <span className="text-sm leading-relaxed">{msg.text}</span>
                            <div className={`text-[10px] mt-1 ${isMe ? 'text-white/50' : 'text-[#756B5B]'}`}>{msg.time}</div>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Input area */}
              <div className="bg-white border-t border-[#E8DDC7] px-4 py-3">
                <input ref={fileRef}  type="file" accept="*/*"     className="hidden" onChange={uploadFile} />
                <input ref={imageRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />

                {/* Input row (relative so attachment menu is positioned above) */}
                <div className="relative flex gap-2 items-center">

                {/* Attachment menu — floats above the + button */}
                {showAttach && (
                  <div ref={attachBarRef}
                    className="absolute bottom-full left-0 mb-2 flex gap-2 rounded-xl bg-[#F8F4EA] p-2 shadow-lg border border-[#E8DDC7]">
                    {[
                      { label: 'Fichier', icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 2H4a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V6z"/><polyline points="8 2 8 6 12 6"/></svg>, action: () => fileRef.current?.click() },
                      { label: 'Image',   icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="2" width="12" height="10" rx="2"/><circle cx="4.5" cy="5.5" r="1.5"/><path d="M1 10l3-3 2 2 2-2 4 4"/></svg>, action: () => imageRef.current?.click() },
                      { label: 'Vidéo',   icon: <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><rect x="1" y="3" width="9" height="9" rx="2"/><path d="M10 5l4-2v8l-4-2"/></svg>, action: () => videoRef.current?.click() },
                    ].map(btn => (
                      <button key={btn.label} type="button"
                        onClick={btn.action}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border-none cursor-pointer transition-colors bg-white text-[#252840] hover:bg-[#C8864B] hover:text-white">
                        {btn.icon}
                        {btn.label}
                      </button>
                    ))}
                  </div>
                )}

                  <button type="button"
                    onClick={() => setShowAttach(s => !s)}
                    disabled={uploading || !activeId}
                    className={`h-10 w-10 rounded-full flex items-center justify-center border-none cursor-pointer transition-all flex-shrink-0 text-xl font-bold disabled:opacity-40 ${
                      showAttach ? 'bg-[#252840] text-white rotate-45' : 'bg-[#F8F4EA] text-[#756B5B] hover:bg-[#252840] hover:text-white'
                    }`}
                    style={{ transition: 'all 0.2s ease' }}>
                    {uploading
                      ? <div className="w-4 h-4 border-2 border-current/30 border-t-current rounded-full animate-spin" />
                      : '+'}
                  </button>

                  <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !e.shiftKey && send()}
                    placeholder="Écrire un message…"
                    className="flex-1 h-10 px-4 rounded-full border border-[#E8DDC7] bg-[#FDFAF4] text-sm outline-none focus:border-[#C8864B] transition-colors"
                  />

                  <button onClick={send} disabled={sending}
                    className="h-10 w-10 rounded-full bg-[#C8864B] text-white border-none cursor-pointer hover:bg-[#B07030] transition-colors disabled:opacity-50 flex items-center justify-center flex-shrink-0">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M14 2L1 8l5 2 2 5 6-13z"/>
                    </svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </>
  )
}
