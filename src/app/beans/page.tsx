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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl font-semibold text-coffee-900">Bean Library</h1>
        <Link
          href="/beans/new"
          className="bg-coffee-700 text-cream text-sm px-3 py-1.5 rounded-full hover:bg-coffee-800 transition-colors"
        >
          + Add bean
        </Link>
      </div>

      {beans && beans.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {beans.map(bean => <BeanCard key={bean.id} bean={bean} />)}
        </div>
      ) : (
        <p className="text-coffee-500 text-sm">No beans yet. Be the first to add one!</p>
      )}
    </div>
  )
}
