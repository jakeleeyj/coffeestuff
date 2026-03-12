import Image from 'next/image'
import Link from 'next/link'

type Post = {
  id: string
  image_url: string | null
}

export default function PostGrid({ posts }: { posts: Post[] }) {
  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted text-sm">No posts yet.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-3 gap-1 md:gap-2">
      {posts.map(post => (
        <Link key={post.id} href={`/posts/${post.id}`} className="relative aspect-square group">
          {post.image_url ? (
            <Image
              src={post.image_url}
              alt=""
              fill
              className="object-cover rounded-lg group-hover:opacity-80 transition-opacity"
              sizes="(max-width: 768px) 33vw, 200px"
            />
          ) : (
            <div className="w-full h-full bg-surface-raised rounded-lg flex items-center justify-center">
              <span className="text-text-dim text-2xl">☕</span>
            </div>
          )}
        </Link>
      ))}
    </div>
  )
}
