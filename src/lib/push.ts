import { createClient } from '@/lib/supabase/server'

let configured = false

async function getWebPush() {
  const webpush = (await import('web-push')).default
  if (!configured) {
    webpush.setVapidDetails(
      'mailto:bloom@example.com',
      process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
      process.env.VAPID_PRIVATE_KEY!,
    )
    configured = true
  }
  return webpush
}

export async function sendPushToAll(title: string, body: string, excludeUserId?: string) {
  if (!process.env.VAPID_PRIVATE_KEY) return // skip if not configured

  const webpush = await getWebPush()
  const supabase = await createClient()

  let query = supabase.from('push_subscriptions').select('endpoint, keys_p256dh, keys_auth, user_id')
  if (excludeUserId) {
    query = query.neq('user_id', excludeUserId)
  }

  const { data: subs } = await query
  if (!subs || subs.length === 0) return

  const payload = JSON.stringify({ title, body })

  await Promise.allSettled(
    subs.map(sub =>
      webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
        },
        payload,
      ).catch(() => {
        supabase.from('push_subscriptions').delete().eq('endpoint', sub.endpoint).then(() => {})
      })
    )
  )
}
