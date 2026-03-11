import Image from 'next/image'

type Props = {
  username: string
  avatarUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
}

const sizes = {
  sm: { cls: 'w-7 h-7 text-xs', px: 28 },
  md: { cls: 'w-9 h-9 text-sm', px: 36 },
  lg: { cls: 'w-12 h-12 text-base', px: 48 },
}

export default function Avatar({ username, avatarUrl, size = 'md' }: Props) {
  const { cls, px } = sizes[size]
  const initials = username.slice(0, 2).toUpperCase()

  if (avatarUrl) {
    return (
      <Image
        src={avatarUrl}
        alt={username}
        width={px}
        height={px}
        className={`${cls} rounded-full object-cover shrink-0`}
      />
    )
  }

  return (
    <div className={`${cls} rounded-full bg-surface-raised border border-border flex items-center justify-center font-semibold text-bloom shrink-0`}>
      {initials}
    </div>
  )
}
