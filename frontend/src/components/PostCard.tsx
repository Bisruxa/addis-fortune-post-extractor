import { Link } from 'react-router-dom'
import type { PostSummary } from '../types/post'
import { getCategoryAccent, getCategoryLabel } from '../utils/categoryStyle'
import { highlightText } from '../utils/highlightText'

interface PostCardProps {
  post: PostSummary
  searchQuery?: string
  compact?: boolean
}

export function PostCard({ post, searchQuery = '', compact = false }: PostCardProps) {
  const accent = getCategoryAccent(post.category)

  return (
    <article
      className={`post-card post-card--${accent}${compact ? ' post-card--compact' : ''}`}
      data-category={post.category}
    >
      <div className="post-card__rule" aria-hidden="true" />

      <div className="post-card__body">
        <div className="post-card__meta">
          <span className="badge">{getCategoryLabel(post.category)}</span>
          {post.image_count ? (
            <span className="post-card__images muted">{post.image_count} illustration(s)</span>
          ) : null}
        </div>

        <h2 className="post-card__title">
          <Link to={`/posts/${post.id}`}>
            {searchQuery ? highlightText(post.title || 'Untitled article', searchQuery) : post.title || 'Untitled article'}
          </Link>
        </h2>

        {post.author ? (
          <p className="post-card__author">
            {searchQuery ? highlightText(post.author, searchQuery) : post.author}
          </p>
        ) : null}

        <p className="post-card__excerpt">
          {searchQuery ? highlightText(post.excerpt, searchQuery) : post.excerpt}
        </p>

        <div className="post-card__footer">
          <span className="post-card__source" title={post.source_file}>
            {post.source_file}
          </span>
          <Link to={`/posts/${post.id}`} className="read-more">
            Read full article
          </Link>
        </div>
      </div>
    </article>
  )
}
