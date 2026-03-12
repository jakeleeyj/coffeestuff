import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { deletePost } from '@/lib/actions/posts'
import CommentForm from '@/components/posts/CommentForm'
import DeleteCommentButton from '@/components/posts/DeleteCommentButton'
import LikeButton from '@/components/feed/LikeButton'

function timeAgo(dateStr: string) {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000)
  if (seconds < 60) return 'just now'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: post }, { data: { user } }] = await Promise.all([
    supabase.from('posts')
      .select('id, image_url, caption, brew_method, recipe, created_at, user_id')
      .eq('id', id)
      .single(),
    supabase.auth.getUser(),
  ])

  if (!post) notFound()

  // Fetch profile, bean tags, comments, and likes separately
  const [{ data: profile }, { data: postBeans }, { data: comments }, { count: likeCount }, { data: userLike }] = await Promise.all([
    supabase.from('profiles').select('id, username, avatar_url').eq('id', post.user_id).single(),
    supabase.from('post_beans').select('beans(id, name, roast_level)').eq('post_id', id),
    supabase.from('comments').select('id, body, created_at, user_id').eq('post_id', id).order('created_at', { ascending: true }),
    supabase.from('likes').select('*', { count: 'exact', head: true }).eq('post_id', id),
    user ? supabase.from('likes').select('post_id').eq('post_id', id).eq('user_id', user.id).maybeSingle() : { data: null },
  ])

  // Fetch comment author profiles
  const commentUserIds = [...new Set((comments ?? []).map(c => c.user_id))]
  const { data: commentProfiles } = commentUserIds.length > 0
    ? await supabase.from('profiles').select('id, username, avatar_url').in('id', commentUserIds)
    : { data: [] }
  const commentProfileMap = Object.fromEntries((commentProfiles ?? []).map(p => [p.id, p]))

  const isOwner = user?.id === post.user_id
  const username = profile?.username ?? 'unknown'
  const beans = (postBeans ?? []).map(pb => pb.beans as unknown as { id: string; name: string; roast_level: string | null } | null).filter(Boolean)
  const deletePostWithId = deletePost.bind(null, post.id)

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <div className="flex items-center gap-3 mb-4">
        <Link href="/feed" className="text-text-muted hover:text-text transition-colors">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </Link>
        <Link href={`/profile/${username}`} className="flex items-center gap-2">
          <Avatar username={username} avatarUrl={profile?.avatar_url} size="sm" />
          <span className="text-sm font-medium text-text">{username}</span>
        </Link>
        {isOwner && (
          <form action={deletePostWithId} className="ml-auto">
            <button type="submit" className="text-xs text-text-dim hover:text-red-400 transition-colors">
              Delete
            </button>
          </form>
        )}
      </div>

      <div className="glass rounded-2xl overflow-hidden">
        <div className="relative aspect-square img-shimmer">
          <Image
            src={post.image_url}
            alt={post.caption ?? 'Coffee post'}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 600px"
            priority
          />
        </div>

        <div className="p-5 space-y-4">
          <LikeButton postId={post.id} likeCount={likeCount ?? 0} liked={!!userLike} />

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
          {post.caption && <p className="text-sm text-text leading-relaxed">{post.caption}</p>}
          {post.recipe && (
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Recipe</p>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{post.recipe}</p>
            </div>
          )}
        </div>
      </div>

      {/* Comments */}
      <div className="mt-6 space-y-4">
        <h2 className="text-sm font-semibold text-text">
          Comments{comments && comments.length > 0 ? ` (${comments.length})` : ''}
        </h2>

        <CommentForm postId={post.id} />

        {comments && comments.length > 0 ? (
          <div className="space-y-3">
            {comments.map(comment => {
              const author = commentProfileMap[comment.user_id]
              const authorName = author?.username ?? 'unknown'
              const isCommentOwner = user?.id === comment.user_id
              return (
                <div key={comment.id} className="flex gap-2.5 group">
                  <Link href={`/profile/${authorName}`} className="shrink-0 mt-0.5">
                    <Avatar username={authorName} avatarUrl={author?.avatar_url} size="sm" />
                  </Link>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <Link href={`/profile/${authorName}`} className="text-xs font-semibold text-text hover:text-bloom transition-colors">
                        {authorName}
                      </Link>
                      <span className="text-[10px] text-text-dim">{timeAgo(comment.created_at)}</span>
                      {isCommentOwner && (
                        <DeleteCommentButton commentId={comment.id} postId={post.id} />
                      )}
                    </div>
                    <p className="text-sm text-text-muted leading-relaxed">{comment.body}</p>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <p className="text-xs text-text-dim">No comments yet.</p>
        )}
      </div>
    </div>
  )
}
