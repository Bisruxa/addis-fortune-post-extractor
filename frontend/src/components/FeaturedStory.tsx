import { Link } from 'react-router-dom'
import type { PostSummary } from '../types/post'
import { getCategoryAccent, getCategoryLabel } from '../utils/categoryStyle'

interface FeaturedStoryProps {
  post: PostSummary
}

export function FeaturedStory({ post }: FeaturedStoryProps) {
  const accent = getCategoryAccent(post.category)

  return (
    <article className={`featured-story featured-story--${accent}`} data-category={post.category}>
      <p className="featured-story__kicker">Lead story</p>
      <span className="badge badge--featured">{getCategoryLabel(post.category)}</span>
      <h2 className="featured-story__title">
        <Link to={`/posts/${post.id}`}>{post.title || 'Untitled article'}</Link>
      </h2>
      {post.author ? <p className="featured-story__author">{post.author}</p> : null}
      <p className="featured-story__excerpt">{post.excerpt}</p>
      <Link to={`/posts/${post.id}`} className="featured-story__link">
        Continue reading
      </Link>
    </article>
  )
}
