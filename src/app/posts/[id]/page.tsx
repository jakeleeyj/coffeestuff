import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { deletePost } from '@/lib/actions/posts'

export default async function PostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: post } = await supabase
    .from('posts')
    .select(`
      id, image_url, caption, brew_method, recipe, created_at, user_id,
      profiles!posts_user_id_fkey(id, username, avatar_url),
      post_beans(beans(id, name, roast_level))
    `)
    .eq('id', id)
    .single()

  if (!post) notFound()

  const { data: { user } } = await supabase.auth.getUser()
  const isOwner = user?.id === post.user_id

  const profile = post.profiles as unknown as { id: string; username: string; avatar_url: string | null } | null
  const username = profile?.username ?? 'unknown'
  const beans = (post.post_beans as unknown as { beans: { id: string; name: string; roast_level: string | null } | null }[])
    .map(pb => pb.beans).filter(Boolean)

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

      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="relative aspect-square">
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

          {post.caption && (
            <p className="text-sm text-text leading-relaxed">{post.caption}</p>
          )}

          {post.recipe && (
            <div>
              <p className="text-xs font-medium text-text-muted uppercase tracking-wide mb-2">Recipe</p>
              <p className="text-sm text-text-muted leading-relaxed whitespace-pre-wrap">{post.recipe}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
