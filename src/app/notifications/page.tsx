import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Avatar from '@/components/ui/Avatar'

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default async function NotificationsPage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: notifications } = await supabase
    .from('notifications')
    .select('id, type, post_id, read, created_at, actor_id')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(50)

  // Fetch actor profiles
  const actorIds = [...new Set((notifications ?? []).map(n => n.actor_id))]
  const { data: actors } = actorIds.length > 0
    ? await supabase.from('profiles').select('id, username, avatar_url').in('id', actorIds)
    : { data: [] }
  const actorMap = Object.fromEntries((actors ?? []).map(a => [a.id, a]))

  // Mark all as read (direct update, no revalidation needed during render)
  const hasUnread = (notifications ?? []).some(n => !n.read)
  if (hasUnread) {
    await supabase.from('notifications').update({ read: true }).eq('user_id', user.id).eq('read', false)
  }

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <h1 className="font-display text-2xl text-text mb-6">Notifications</h1>

      {!notifications || notifications.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-text-muted text-sm">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-1">
          {notifications.map(notif => {
            const actor = actorMap[notif.actor_id]
            const actorName = actor?.username ?? 'Someone'
            const message = notif.type === 'like' ? 'liked your post' : 'commented on your post'

            return (
              <Link
                key={notif.id}
                href={notif.post_id ? `/posts/${notif.post_id}` : '/feed'}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all hover:bg-surface-raised ${
                  !notif.read ? 'glass-subtle' : ''
                }`}
              >
                <Avatar username={actorName} avatarUrl={actor?.avatar_url} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-text">
                    <span className="font-semibold">{actorName}</span>{' '}
                    <span className="text-text-muted">{message}</span>
                  </p>
                  <p className="text-[11px] text-text-dim mt-0.5">{timeAgo(notif.created_at)}</p>
                </div>
                {!notif.read && (
                  <span className="w-2 h-2 rounded-full bg-bloom shrink-0" />
                )}
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
