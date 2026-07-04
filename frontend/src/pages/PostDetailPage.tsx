import { Link, useParams } from 'react-router-dom'
import { ImageGallery } from '../components/ImageGallery'
import { RelatedArticles } from '../components/RelatedArticles'
import { PostDetailSkeleton } from '../components/Skeleton'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePost } from '../hooks/usePost'
import { getCategoryLabel } from '../utils/categoryStyle'
import { sanitizeArticleHtml } from '../utils/archiveUrl'

export function PostDetailPage() {
  const { id } = useParams()
  const { post, loading, error } = usePost(id)

  useDocumentTitle(post?.title || (loading ? 'Loading...' : null))

  if (loading) {
    return (
      <div className="article-layout">
        <PostDetailSkeleton />
      </div>
    )
  }

  if (error || !post) {
    return (
      <div className="state-box state-box--error">
        <p>{error || 'Article not found.'}</p>
        <Link to="/">Return to the edition</Link>
      </div>
    )
  }

  return (
    <div className="article-layout">
      <article className={`post-detail post-detail--${post.category}`} data-category={post.category}>
        <Link to={post.category ? `/category/${post.category}` : '/'} className="back-link">
          &larr; Back to {getCategoryLabel(post.category)}
        </Link>

        <header className="post-detail__header">
          <p className="post-detail__kicker">{getCategoryLabel(post.category)}</p>
          <h1>{post.title || 'Untitled article'}</h1>
          {post.author ? <p className="post-detail__author">{post.author}</p> : null}
          <p className="post-detail__dateline">
            <span>From the original archive</span>
            <span className="post-detail__dateline-rule" aria-hidden="true" />
            <span className="post-detail__source" title={post.source_file}>
              {post.source_file}
            </span>
          </p>
        </header>

        <ImageGallery images={post.images} />

        <section
          className={`post-detail__content article-body article-body--${post.category}`}
          dangerouslySetInnerHTML={{ __html: sanitizeArticleHtml(post.content, post.category) }}
        />
      </article>

      <RelatedArticles postId={post.id} category={post.category} />
    </div>
  )
}
