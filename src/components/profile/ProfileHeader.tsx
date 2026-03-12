import Link from 'next/link'
import Avatar from '@/components/ui/Avatar'
import SignOutButton from '@/components/profile/SignOutButton'

type Props = {
  username: string
  displayName: string | null
  avatarUrl: string | null
  bio: string | null
  postCount: number
  isOwner: boolean
}

export default function ProfileHeader({ username, displayName, avatarUrl, bio, postCount, isOwner }: Props) {
  return (
    <div className="glass rounded-2xl flex flex-col items-center text-center gap-4 p-6 relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full bg-bloom/8 blur-3xl pointer-events-none" />
      <Avatar username={username} avatarUrl={avatarUrl} size="lg" />
      <div>
        {displayName && <h1 className="font-display text-2xl text-text">{displayName}</h1>}
        <p className={`text-sm ${displayName ? 'text-text-muted' : 'font-display text-2xl text-text'}`}>
          {displayName ? `@${username}` : username}
        </p>
        {bio && <p className="text-sm text-text-muted mt-1 max-w-xs">{bio}</p>}
      </div>
      <p className="text-sm text-text-muted">
        <span className="font-semibold text-text">{postCount}</span> {postCount === 1 ? 'post' : 'posts'}
      </p>
      {isOwner && (
        <div className="flex items-center gap-4">
          <Link
            href="/profile/edit"
            className="text-sm text-bloom hover:text-bloom-hover transition-colors font-medium"
          >
            Edit profile
          </Link>
          <SignOutButton />
        </div>
      )}
    </div>
  )
}
