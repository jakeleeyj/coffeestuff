import PostCard from './PostCard'
import type { PostWithRelations } from '@/lib/types'

export default function FeedGrid({ posts }: { posts: PostWithRelations[] }) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map(post => <PostCard key={post.id} post={post} />)}
    </div>
  )
}
