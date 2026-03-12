import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BeanCard from '@/components/beans/BeanCard'

export default async function BeansPage() {
  const supabase = await createClient()

  const [{ data: beans }, { data: { user } }] = await Promise.all([
    supabase.from('beans').select('id, name, roaster, origin, roast_level, added_by').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  // Fetch profiles for bean authors
  const addedByIds = [...new Set((beans ?? []).map(b => b.added_by).filter(Boolean))] as string[]
  const { data: profiles } = addedByIds.length > 0
    ? await supabase.from('profiles').select('id, username').in('id', addedByIds)
    : { data: [] }
  const profileMap = Object.fromEntries((profiles ?? []).map(p => [p.id, p.username]))

  // Fetch ratings
  const beanIds = (beans ?? []).map(b => b.id)
  const [{ data: allRatings }, { data: userRatings }] = await Promise.all([
    beanIds.length > 0
      ? supabase.from('bean_ratings').select('bean_id, rating').in('bean_id', beanIds)
      : { data: [] },
    user && beanIds.length > 0
      ? supabase.from('bean_ratings').select('bean_id, rating').eq('user_id', user.id).in('bean_id', beanIds)
      : { data: [] },
  ])

  const ratingMap: Record<string, { sum: number; count: number }> = {}
  for (const r of allRatings ?? []) {
    if (!ratingMap[r.bean_id]) ratingMap[r.bean_id] = { sum: 0, count: 0 }
    ratingMap[r.bean_id].sum += r.rating
    ratingMap[r.bean_id].count += 1
  }
  const userRatingMap = Object.fromEntries((userRatings ?? []).map(r => [r.bean_id, r.rating]))

  return (
    <div className="max-w-lg md:max-w-4xl mx-auto px-4 pt-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl text-text">Bean Library</h1>
        <Link
          href="/beans/new"
          className="bg-bloom text-base text-sm font-semibold px-4 py-2 rounded-full hover:bg-bloom-hover transition-colors"
        >
          + Add
        </Link>
      </div>

      {beans && beans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {beans.map(bean => {
            const stats = ratingMap[bean.id]
            return (
              <BeanCard
                key={bean.id}
                bean={bean}
                userId={user?.id}
                addedByUsername={bean.added_by ? profileMap[bean.added_by] : undefined}
                avgRating={stats ? stats.sum / stats.count : 0}
                ratingCount={stats?.count ?? 0}
                userRating={userRatingMap[bean.id] ?? null}
              />
            )
          })}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-4xl mb-3">☕</p>
          <p className="text-text-muted text-sm">No beans yet.</p>
          <Link href="/beans/new" className="text-bloom text-sm mt-1 inline-block hover:text-bloom-hover transition-colors">
            Be the first to add one →
          </Link>
        </div>
      )}
    </div>
  )
}
