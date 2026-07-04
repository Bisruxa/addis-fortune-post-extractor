export interface PostImage {
  id: number
  path: string
  sort_order: number
}

export interface PostSummary {
  id: number
  title: string | null
  author: string | null
  category: string
  source_file: string
  excerpt: string
  image_count?: number
  created_at: string | null
  updated_at: string | null
}

export interface PostDetail extends PostSummary {
  content: string
  images: PostImage[]
}

export interface PaginationLinks {
  first: string | null
  last: string | null
  prev: string | null
  next: string | null
}

export interface PaginationMeta {
  current_page: number
  from: number | null
  last_page: number
  per_page: number
  to: number | null
  total: number
}

export interface PaginatedResponse<T> {
  data: T[]
  links: PaginationLinks
  meta: PaginationMeta
}

export interface CategoryItem {
  slug: string
  label: string
  count: number
}

export interface CategoriesResponse {
  data: CategoryItem[]
  known_categories: string[]
}
