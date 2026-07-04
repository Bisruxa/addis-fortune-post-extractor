import { useEffect, useState } from 'react'
import { fetchCategories } from '../services/api'
import type { CategoryItem } from '../types/post'

export function useCategories() {
  const [categories, setCategories] = useState<CategoryItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    fetchCategories()
      .then((response) => {
        if (!cancelled) setCategories(response.data)
      })
      .catch(() => {
        if (!cancelled) setCategories([])
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })

    return () => { cancelled = true }
  }, [])

  return { categories, loading }
}
