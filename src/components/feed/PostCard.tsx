import Image from 'next/image'
import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import DeletePostButton from '@/components/feed/DeletePostButton'
import FeedCommentInput from '@/components/feed/FeedCommentInput'
import type { PostWithRelations } from '@/lib/types'

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default function PostCard({ post, userId }: { post: PostWithRelations; userId?: string }) {
  const username = post.profiles?.username ?? 'unknown'
  const beans = post.post_beans.map(pb => pb.beans).filter(Boolean)
  const isOwner = !!userId && userId === post.user_id

  return (
    <article className="bg-surface border border-border rounded-2xl overflow-hidden hover:border-bloom-dim transition-colors">
      <Link href={`/posts/${post.id}`}>
        <div className="relative aspect-square">
          <Image
            src={post.image_url}
            alt={post.caption ?? 'Coffee post'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
          />
        </div>
      </Link>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <Link href={`/profile/${username}`} className="flex items-center gap-2">
            <Avatar username={username} avatarUrl={post.profiles?.avatar_url} size="sm" />
            <span className="text-sm font-medium text-text">{username}</span>
          </Link>
          <div className="flex items-center gap-3">
            {isOwner && <DeletePostButton postId={post.id} />}
            <span className="text-xs text-text-dim">{timeAgo(post.created_at)}</span>
          </div>
        </div>

        {post.caption && (
          <p className="text-sm text-text leading-relaxed line-clamp-2">{post.caption}</p>
        )}

        {(post.brew_method || beans.length > 0) && (
          <div className="flex flex-wrap gap-1.5">
            {post.brew_method && <Badge label={post.brew_method} />}
            {beans.map(bean => bean && (
              <span key={bean.id} className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-surface-raised text-text-muted border border-border">
                {bean.name}
              </span>
            ))}
          </div>
        )}

        {/* Comments */}
        <div className="flex items-center gap-3 pt-1">
          <Link href={`/posts/${post.id}`} className="text-xs text-text-muted hover:text-text transition-colors">
            {post.comment_count
              ? `View ${post.comment_count === 1 ? '1 comment' : `all ${post.comment_count} comments`}`
              : 'Add a comment...'}
          </Link>
        </div>

        <FeedCommentInput postId={post.id} />
      </div>
    </article>
  )
}
