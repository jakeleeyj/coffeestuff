import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import Badge from '@/components/ui/Badge'
import BeanRating from '@/components/beans/BeanRating'
import BackButton from '@/components/posts/BackButton'

export default async function BeanDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data: bean }, { data: { user } }] = await Promise.all([
    supabase.from('beans').select('id, name, roaster, origin, roast_level, added_by, created_at').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (!bean) notFound()

  // Fetch author profile, ratings, posts tagged with this bean
  const [{ data: addedByProfile }, { data: allRatings }, { data: userRatingRow }, { data: postBeans }] = await Promise.all([
    bean.added_by ? supabase.from('profiles').select('username').eq('id', bean.added_by).single() : { data: null },
    supabase.from('bean_ratings').select('rating').eq('bean_id', id),
    user ? supabase.from('bean_ratings').select('rating').eq('bean_id', id).eq('user_id', user.id).maybeSingle() : { data: null },
    supabase.from('post_beans').select('post_id, posts(id, image_url)').eq('bean_id', id),
  ])

  const ratingSum = (allRatings ?? []).reduce((s, r) => s + r.rating, 0)
  const ratingCount = (allRatings ?? []).length
  const avgRating = ratingCount > 0 ? ratingSum / ratingCount : 0

  const posts = (postBeans ?? [])
    .map(pb => pb.posts as unknown as { id: string; image_url: string } | null)
    .filter(Boolean) as { id: string; image_url: string }[]

  return (
    <div className="max-w-lg mx-auto px-4 pt-6 pb-8">
      <div className="flex items-center gap-3 mb-4">
        <BackButton />
        <h1 className="font-display text-2xl text-text">{bean.name}</h1>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        {bean.roaster && (
          <p className="text-sm text-text-muted">Roasted by <span className="text-text font-medium">{bean.roaster}</span></p>
        )}

        <div className="flex flex-wrap gap-2">
          {bean.roast_level && <Badge label={bean.roast_level} />}
          {bean.origin && (
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-surface-raised text-text-muted border border-border">
              {bean.origin}
            </span>
          )}
        </div>

        <BeanRating beanId={bean.id} avgRating={avgRating} ratingCount={ratingCount} userRating={userRatingRow?.rating ?? null} />

        {addedByProfile && (
          <Link href={`/profile/${addedByProfile.username}`} className="text-xs text-text-dim hover:text-bloom transition-colors block">
            Added by {addedByProfile.username}
          </Link>
        )}
      </div>

      {/* Posts using this bean */}
      {posts.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-text mb-3">Posts with this bean</h2>
          <div className="grid grid-cols-3 gap-1 md:gap-2">
            {posts.map(post => (
              <Link key={post.id} href={`/posts/${post.id}`} className="relative aspect-square group">
                <Image
                  src={post.image_url}
                  alt=""
                  fill
                  className="object-cover rounded-lg group-hover:opacity-80 transition-opacity"
                  sizes="(max-width: 768px) 33vw, 200px"
                />
              </Link>
            ))}
          </div>
        </div>
      )}

      {posts.length === 0 && (
        <div className="mt-6 text-center py-8">
          <p className="text-sm text-text-muted">No posts have used this bean yet.</p>
        </div>
      )}
    </div>
  )
}
