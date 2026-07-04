import type {
  CategoriesResponse,
  PaginatedResponse,
  PostDetail,
  PostSummary,
} from '../types/post'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

class ApiError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function request<T>(path: string, params?: Record<string, string | number | undefined>): Promise<T> {
  const url = new URL(`${API_URL}${path}`)

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        url.searchParams.set(key, String(value))
      }
    })
  }

  const response = await fetch(url.toString(), {
    headers: { Accept: 'application/json' },
  })

  if (!response.ok) {
    throw new ApiError(`API request failed: ${response.statusText}`, response.status)
  }

  return response.json() as Promise<T>
}

export function fetchPosts(options: {
  page?: number
  perPage?: number
  category?: string
  q?: string
}): Promise<PaginatedResponse<PostSummary>> {
  return request('/posts', {
    page: options.page,
    per_page: options.perPage,
    category: options.category,
    q: options.q,
  })
}

export function searchPosts(options: {
  q: string
  page?: number
  perPage?: number
  category?: string
}): Promise<PaginatedResponse<PostSummary>> {
  return request('/posts/search', {
    q: options.q,
    page: options.page,
    per_page: options.perPage,
    category: options.category,
  })
}

export function fetchPost(id: number): Promise<{ data: PostDetail }> {
  return request(`/posts/${id}`)
}

export function fetchCategories(): Promise<CategoriesResponse> {
  return request('/categories')
}

export function formatCategoryLabel(slug: string): string {
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}

export { ApiError }
