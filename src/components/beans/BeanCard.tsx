import Badge from '@/components/ui/Badge'

type Bean = {
  id: string
  name: string
  roaster: string
  origin: string | null
  roast_level: string | null
}

export default function BeanCard({ bean }: { bean: Bean }) {
  return (
    <div className="bg-white border border-coffee-200 rounded-xl p-4 flex flex-col gap-2">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="font-medium text-coffee-900">{bean.name}</p>
          <p className="text-sm text-coffee-600">{bean.roaster}</p>
        </div>
        {bean.roast_level && <Badge label={bean.roast_level} />}
      </div>
      {bean.origin && (
        <p className="text-xs text-coffee-500">📍 {bean.origin}</p>
      )}
    </div>
  )
}
