import { useState, useEffect, useRef, useCallback } from 'react'
import { matchApi, convApi } from '../services/api'
import useAuthStore from '../store/authStore'
import { useToast } from '../components/Toast'

const STORAGE_KEY = 'sb_notif_state'
const POLL_MS = 25000

function loadSnapshot() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null') } catch { return null }
}
function saveSnapshot(s) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(s))
}

export default function useNotifications() {
  const { user } = useAuthStore()
  const addToast = useToast()
  const [notifications, setNotifications] = useState([])
  const pollRef = useRef(null)

  const poll = useCallback(async () => {
    if (!user) return
    try {
      const [matchesRaw, convsRaw] = await Promise.all([
        matchApi.mine().catch(() => []),
        convApi.list().catch(() => []),
      ])
      const matches = (matchesRaw?.matches ?? matchesRaw ?? [])
      const convs   = (convsRaw?.conversations ?? convsRaw ?? [])

      const snapshot = loadSnapshot()

      const pendingForMe = matches.filter(m => m.status === 'PENDING' && (m.receiverId === user.id || m.receiver?.id === user.id))
      const accepted     = matches.filter(m => m.status === 'ACCEPTED').map(m => m.id)

      const newConvTimes = {}
      convs.forEach(c => { newConvTimes[c.id] = c.lastMessage?.createdAt ?? null })

      if (!snapshot) {
        saveSnapshot({
          pendingIds: pendingForMe.map(m => m.id),
          acceptedIds: accepted,
          lastMsgTimes: newConvTimes,
        })
        return
      }

      const fresh = []

      // New connection requests received
      pendingForMe.forEach(m => {
        if (!snapshot.pendingIds?.includes(m.id)) {
          const name = `${m.requester?.firstName ?? ''} ${m.requester?.lastName ?? ''}`.trim() || 'Quelqu\'un'
          fresh.push({ id: `req-${m.id}`, type: 'match_request', text: `${name} veut se connecter avec toi`, link: '/connection' })
        }
      })

      // My requests that were accepted
      accepted.forEach(id => {
        if (!snapshot.acceptedIds?.includes(id)) {
          const m = matches.find(x => x.id === id)
          const isMyRequest = m?.requesterId === user.id || m?.requester?.id === user.id
          if (m && isMyRequest) {
            const name = `${m.receiver?.firstName ?? ''} ${m.receiver?.lastName ?? ''}`.trim() || 'Quelqu\'un'
            fresh.push({ id: `acc-${id}`, type: 'match_accepted', text: `${name} a accepté ta demande de connexion`, link: '/connection' })
          }
        }
      })

      // New messages
      convs.forEach(c => {
        const lastMsg = c.lastMessage
        if (!lastMsg) return
        const senderIsMe = lastMsg.sender?.id === user.id || lastMsg.senderId === user.id
        if (senderIsMe) return
        const prev = snapshot.lastMsgTimes?.[c.id]
        const isNewer = !prev || new Date(lastMsg.createdAt) > new Date(prev)
        if (isNewer) {
          const name = `${c.other?.firstName ?? ''} ${c.other?.lastName ?? ''}`.trim() || 'Quelqu\'un'
          fresh.push({ id: `msg-${c.id}-${lastMsg.createdAt}`, type: 'message', text: `Nouveau message de ${name}`, convId: c.id, link: '/chat' })
        }
      })

      if (fresh.length > 0) {
        setNotifications(prev => {
          const existingIds = new Set(prev.map(n => n.id))
          const added = fresh.filter(n => !existingIds.has(n.id))
          added.forEach(n => addToast?.(n.text, 'info'))
          return [...prev, ...added]
        })
      }

      saveSnapshot({
        pendingIds:   pendingForMe.map(m => m.id),
        acceptedIds:  accepted,
        lastMsgTimes: newConvTimes,
      })
    } catch { /* ignore */ }
  }, [user, addToast])

  useEffect(() => {
    if (!user) return
    poll()
    pollRef.current = setInterval(() => {
      if (document.visibilityState === 'visible') poll()
    }, POLL_MS)
    return () => clearInterval(pollRef.current)
  }, [user?.id, poll])

  const dismiss    = (id) => setNotifications(prev => prev.filter(n => n.id !== id))
  const dismissAll = ()   => setNotifications([])

  return { notifications, dismiss, dismissAll, unreadCount: notifications.length }
}
