import Image from 'next/image'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DeletePostButton from '@/components/feed/DeletePostButton'
import FeedCommentInput from '@/components/feed/FeedCommentInput'
import LikeButton from '@/components/feed/LikeButton'
import DoubleTapLike from '@/components/feed/DoubleTapLike'
import type { PostWithRelations } from '@/lib/types'

function formatRecipe(post: PostWithRelations) {
  const parts: string[] = []
  if (post.dose_grams) parts.push(`${post.dose_grams}g`)
  if (post.yield_grams) parts.push(`${post.yield_grams}g`)
  if (post.brew_time_seconds) {
    const m = Math.floor(post.brew_time_seconds / 60)
    const s = post.brew_time_seconds % 60
    parts.push(m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}s`)
  }
  if (parts.length === 0) return null
  // Format: "18g → 36g · 0:28" or "18g · 3:45"
  if (post.dose_grams && post.yield_grams) {
    const dose = parts.shift()!
    const yld = parts.shift()!
    return [dose, '→', yld, ...parts.map(p => `· ${p}`)].join(' ')
  }
  return parts.join(' · ')
}

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h`
  const days = Math.floor(seconds / 86400)
  if (days < 7) return `${days}d`
  return `${Math.floor(days / 7)}w`
}

export default function PostCard({ post, userId, isHero = false }: { post: PostWithRelations; userId?: string; isHero?: boolean }) {
  const username = post.profiles?.username ?? 'unknown'
  const displayName = post.profiles?.display_name || username
  const beans = post.post_beans.map(pb => pb.beans).filter(Boolean)
  const isOwner = !!userId && userId === post.user_id

  return (
    <article className="glass glass-hover rounded-2xl overflow-hidden">
      {/* Author row — above image */}
      <div className="flex items-center gap-2.5 px-4 py-3">
        <Link href={`/profile/${username}`} className="flex items-center gap-2.5 flex-1 min-w-0">
          <Avatar username={username} avatarUrl={post.profiles?.avatar_url} size="sm" />
          <div className="min-w-0">
            <span className="text-sm font-semibold text-text block truncate">{displayName}</span>
          </div>
        </Link>
        <div className="flex items-center gap-2.5 shrink-0">
          <span className="text-[11px] text-text-dim font-medium">{timeAgo(post.created_at)}</span>
          {isOwner && <DeletePostButton postId={post.id} />}
        </div>
      </div>

      {/* Image */}
      <DoubleTapLike postId={post.id} liked={post.liked_by_user ?? false}>
        <Link href={`/posts/${post.id}`}>
          <div className={`relative img-shimmer ${isHero ? 'aspect-[4/5]' : 'aspect-square'}`}>
            <Image
              src={post.image_url}
              alt={post.caption ?? 'Coffee post'}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 600px"
              priority={isHero}
            />
          </div>
        </Link>
      </DoubleTapLike>

      {/* Content */}
      <div className="px-4 pt-3 pb-4 space-y-2.5">
        {/* Actions row */}
        <div className="flex items-center gap-1">
          <LikeButton postId={post.id} likeCount={post.like_count ?? 0} liked={post.liked_by_user ?? false} />
          <Link href={`/posts/${post.id}`} className="ml-1 text-text-muted hover:text-text transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
            </svg>
          </Link>
          {(post.comment_count ?? 0) > 0 && (
            <Link href={`/posts/${post.id}`} className="text-xs text-text-muted hover:text-text transition-colors">
              {post.comment_count}
            </Link>
          )}
        </div>

        {/* Recipe bar */}
        {formatRecipe(post) && (
          <div className="flex items-center gap-1.5 text-[11px] text-bloom/80 font-medium tracking-wide">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="opacity-60">
              <path d="M12 2v10l4.5 4.5" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            {formatRecipe(post)}
          </div>
        )}

        {/* Caption */}
        {post.caption && (
          <p className="text-[13px] text-text leading-relaxed">
            <Link href={`/profile/${username}`} className="font-semibold hover:text-bloom transition-colors">{displayName}</Link>
            {' '}<span className="text-text/85">{post.caption}</span>
          </p>
        )}

        {/* Tags */}
        {(post.brew_method || beans.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {post.brew_method && <Badge label={post.brew_method} />}
            {beans.map(bean => bean && (
              <Link key={bean.id} href={`/beans/${bean.id}`} className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-raised text-text-muted border border-border hover:text-bloom hover:border-bloom-dim/30 transition-colors">
                {bean.name}
              </Link>
            ))}
          </div>
        )}

        {/* Comments link */}
        {(post.comment_count ?? 0) > 1 && (
          <Link href={`/posts/${post.id}`} className="block text-xs text-text-muted hover:text-text transition-colors">
            View all {post.comment_count} comments
          </Link>
        )}

        <FeedCommentInput postId={post.id} />
      </div>
    </article>
  )
}
