import PostCard from './PostCard'
import type { PostWithRelations } from '@/lib/types'

export default function FeedGrid({ posts, userId }: { posts: PostWithRelations[]; userId?: string }) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map(post => <PostCard key={post.id} post={post} userId={userId} />)}
    </div>
  )
}
