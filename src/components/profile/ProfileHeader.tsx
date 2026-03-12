import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'

type Props = {
  username: string
  avatarUrl: string | null
  bio: string | null
  postCount: number
  isOwner: boolean
}

export default function ProfileHeader({ username, avatarUrl, bio, postCount, isOwner }: Props) {
  return (
    <div className="glass rounded-2xl flex flex-col items-center text-center gap-4 p-6">
      <Avatar username={username} avatarUrl={avatarUrl} size="lg" />
      <div>
        <h1 className="font-display text-2xl text-text">{username}</h1>
        {bio && <p className="text-sm text-text-muted mt-1 max-w-xs">{bio}</p>}
      </div>
      <p className="text-sm text-text-muted">
        <span className="font-semibold text-text">{postCount}</span> {postCount === 1 ? 'post' : 'posts'}
      </p>
      {isOwner && (
        <Link
          href="/profile/edit"
          className="text-sm text-bloom hover:text-bloom-hover transition-colors"
        >
          Edit profile
        </Link>
      )}
    </div>
  )
}
