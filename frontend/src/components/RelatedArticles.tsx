import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { fetchPosts } from '../services/api'
import type { PostSummary } from '../types/post'
import { getCategoryLabel } from '../utils/categoryStyle'

interface RelatedArticlesProps {
  postId: number
  category: string
}

export function RelatedArticles({ postId, category }: RelatedArticlesProps) {
  const [related, setRelated] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetchPosts({ category, perPage: 5, page: 1 })
      .then((response) => {
        setRelated(response.data.filter((item) => item.id !== postId).slice(0, 4))
      })
      .catch(() => setRelated([]))
      .finally(() => setLoading(false))
  }, [category, postId])

  if (loading || !related.length) {
    return null
  }

  return (
    <aside className="related-articles">
      <h2 className="related-articles__heading">More in {getCategoryLabel(category)}</h2>
      <ul className="related-articles__list">
        {related.map((item) => (
          <li key={item.id}>
            <Link to={`/posts/${item.id}`} className="related-articles__link">
              <span className="related-articles__title">{item.title || 'Untitled article'}</span>
              {item.author ? <span className="related-articles__author">{item.author}</span> : null}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
