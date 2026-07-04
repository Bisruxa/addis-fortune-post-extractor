import { useEffect, useState } from 'react'
import { fetchPost } from '../services/api'
import type { PostDetail } from '../types/post'

export function usePost(id: string | undefined) {
  const [post, setPost] = useState<PostDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const postId = Number(id)
    if (!postId) {
      setError('Invalid article reference.')
      setLoading(false)
      return
    }

    let cancelled = false
    setLoading(true)
    setError(null)

    fetchPost(postId)
      .then((response) => {
        if (!cancelled) setPost(response.data)
      })
      .catch(() => {
        if (!cancelled) setError('This article could not be loaded. The API may be offline.')
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [id])

  return { post, loading, error }
}
