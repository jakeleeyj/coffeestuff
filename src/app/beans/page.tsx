import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import BeanCard from '@/components/beans/BeanCard'

export default async function BeansPage() {
  const supabase = await createClient()
  const { data: beans } = await supabase
    .from('beans')
    .select('id, name, roaster, origin, roast_level')
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-lg mx-auto px-4 pt-8">
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
        <div className="flex flex-col gap-3">
          {beans.map(bean => <BeanCard key={bean.id} bean={bean} />)}
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
