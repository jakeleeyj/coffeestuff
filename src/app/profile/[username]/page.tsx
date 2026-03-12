import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ProfileHeader from '@/components/profile/ProfileHeader'
import PostGrid from '@/components/profile/PostGrid'

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params
  const supabase = await createClient()

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio')
    .eq('username', username)
    .single()

  if (!profile) notFound()

  const [{ data: posts }, { data: { user } }] = await Promise.all([
    supabase
      .from('posts')
      .select('id, image_url')
      .eq('user_id', profile.id)
      .order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  const isOwner = user?.id === profile.id

  return (
    <div className="max-w-lg mx-auto px-4 pt-8 pb-8">
      <ProfileHeader
        username={profile.username}
        displayName={profile.display_name}
        avatarUrl={profile.avatar_url}
        bio={profile.bio}
        postCount={posts?.length ?? 0}
        isOwner={isOwner}
      />
      <div className="mt-6">
        <PostGrid posts={posts ?? []} />
      </div>
    </div>
  )
}
