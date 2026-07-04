import { useCallback, useEffect, useState } from 'react'
import { fetchPosts, searchPosts } from '../services/api'
import type { PostSummary } from '../types/post'

interface UsePostsOptions {
  page: number
  perPage?: number
  category?: string
  query?: string
}

interface UsePostsResult {
  posts: PostSummary[]
  loading: boolean
  error: string | null
  lastPage: number
  total: number
}

export function usePosts({ page, perPage = 12, category, query }: UsePostsOptions): UsePostsResult {
  const [posts, setPosts] = useState<PostSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastPage, setLastPage] = useState(1)
  const [total, setTotal] = useState(0)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const response = query
        ? await searchPosts({ q: query, page, perPage, category })
        : await fetchPosts({ page, perPage, category })

      setPosts(response.data)
      setLastPage(response.meta.last_page)
      setTotal(response.meta.total)
    } catch {
      setError('Could not reach the archive API. Start Laravel with php artisan serve on port 8000.')
      setPosts([])
    } finally {
      setLoading(false)
    }
  }, [page, perPage, category, query])

  useEffect(() => {
    load()
  }, [load])

  return { posts, loading, error, lastPage, total }
}
