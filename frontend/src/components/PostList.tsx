import type { PostSummary } from '../types/post'
import { PostCard } from './PostCard'
import { PostCardSkeleton } from './Skeleton'

interface PostListProps {
  posts: PostSummary[]
  loading?: boolean
  emptyMessage?: string
  searchQuery?: string
}

export function PostList({
  posts,
  loading,
  emptyMessage = 'No posts found.',
  searchQuery = '',
}: PostListProps) {
  if (loading) {
    return (
      <div className="post-list" aria-busy="true" aria-label="Loading articles">
        {Array.from({ length: 3 }, (_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </div>
    )
  }

  if (!posts.length) {
    return <div className="state-box">{emptyMessage}</div>
  }

  return (
    <div className="post-list">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} searchQuery={searchQuery} />
      ))}
    </div>
  )
}
