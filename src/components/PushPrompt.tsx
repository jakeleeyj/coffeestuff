'use client'

import { useEffect, useState } from 'react'
import { savePushSubscription } from '@/lib/actions/push'

export default function PushPrompt() {
  const [show, setShow] = useState(false)
  const [subscribing, setSubscribing] = useState(false)

  useEffect(() => {
    // Only show if: service worker supported, push supported, not already subscribed, not already dismissed
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return
    if (Notification.permission === 'granted' || Notification.permission === 'denied') return
    if (localStorage.getItem('push-prompt-dismissed')) return

    // Delay showing prompt so it doesn't appear immediately on page load
    const timer = setTimeout(() => setShow(true), 5000)
    return () => clearTimeout(timer)
  }, [])

  async function handleSubscribe() {
    setSubscribing(true)
    try {
      const permission = await Notification.requestPermission()
      if (permission !== 'granted') {
        setShow(false)
        return
      }

      const registration = await navigator.serviceWorker.ready
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
      })

      const sub = subscription.toJSON()
      await savePushSubscription({
        endpoint: sub.endpoint!,
        keys: {
          p256dh: sub.keys!.p256dh!,
          auth: sub.keys!.auth!,
        },
      })

      setShow(false)
    } catch {
      setShow(false)
    } finally {
      setSubscribing(false)
    }
  }

  function handleDismiss() {
    localStorage.setItem('push-prompt-dismissed', '1')
    setShow(false)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-20 md:bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-40 glass rounded-2xl p-4 card-in">
      <p className="text-sm text-text font-medium mb-1">Stay in the loop</p>
      <p className="text-xs text-text-muted mb-3">Get notified when someone shares a new brew.</p>
      <div className="flex gap-2">
        <button
          onClick={handleDismiss}
          className="flex-1 py-2 rounded-xl text-xs font-medium text-text-muted border border-border hover:text-text transition-colors"
        >
          Not now
        </button>
        <button
          onClick={handleSubscribe}
          disabled={subscribing}
          className="flex-1 bg-bloom text-base py-2 rounded-xl text-xs font-semibold hover:bg-bloom-hover transition-colors disabled:opacity-50"
        >
          {subscribing ? 'Enabling…' : 'Enable'}
        </button>
      </div>
    </div>
  )
}
