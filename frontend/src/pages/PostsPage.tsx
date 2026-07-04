import { useSearchParams } from 'react-router-dom'
import { CategoryFilter } from '../components/CategoryFilter'
import { FeaturedStory } from '../components/FeaturedStory'
import { Pagination } from '../components/Pagination'
import { PostList } from '../components/PostList'
import { SearchBar } from '../components/SearchBar'
import { useCategories } from '../hooks/useCategories'
import { useDocumentTitle } from '../hooks/useDocumentTitle'
import { usePosts } from '../hooks/usePosts'
import { formatCategoryLabel } from '../services/api'
import { getCategoryLabel } from '../utils/categoryStyle'

interface PostsPageProps {
  category?: string
}

export function PostsPage({ category }: PostsPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()

  const query = searchParams.get('q') || ''
  const currentPage = Math.max(1, Number(searchParams.get('page')) || 1)

  const { categories, loading: loadingCategories } = useCategories()
  const { posts, loading: loadingPosts, error, lastPage, total } = usePosts({
    page: currentPage,
    category,
    query: query || undefined,
  })

  const heading = category ? getCategoryLabel(category) : 'Full edition'
  useDocumentTitle(query ? `Search: ${query}` : category ? heading : null)

  const showFeatured = !category && !query && currentPage === 1
  const listPosts = showFeatured && posts.length > 0 ? posts.slice(1) : posts
  const featuredPost = showFeatured && posts.length > 0 ? posts[0] : null

  function handleSearch(nextQuery: string) {
    const params: Record<string, string> = {}
    if (nextQuery) params.q = nextQuery
    setSearchParams(params)
  }

  function handlePageChange(page: number) {
    const params: Record<string, string> = {}
    if (query) params.q = query
    if (page > 1) params.page = String(page)
    setSearchParams(params)
  }

  function resultSummary() {
    if (query) {
      return (
        <>
          <strong>{total}</strong> article{total === 1 ? '' : 's'} mention &ldquo;{query}&rdquo;
          {category ? <> in {formatCategoryLabel(category)}</> : null}
        </>
      )
    }

    if (category) {
      return (
        <>
          <strong>{total}</strong> piece{total === 1 ? '' : 's'} in this section
        </>
      )
    }

    return (
      <>
        <strong>{total}</strong> stories in this edition
      </>
    )
  }

  return (
    <div className="page-grid">
      <CategoryFilter
        categories={categories}
        activeCategory={category}
        loading={loadingCategories}
      />

      <section className="content-panel">
        <header className="content-panel__header">
          <div>
            <p className="content-panel__kicker">{category ? 'Section' : query ? 'Search results' : 'Browse'}</p>
            <h2>{heading}</h2>
            {!loadingPosts ? <p className="content-panel__summary" aria-live="polite">{resultSummary()}</p> : null}
          </div>
        </header>

        <SearchBar key={query} initialQuery={query} onSearch={handleSearch} />

        {error ? <div className="state-box state-box--error">{error}</div> : null}

        {featuredPost ? <FeaturedStory post={featuredPost} /> : null}

        {featuredPost && listPosts.length > 0 ? (
          <h3 className="section-divider">
            <span>Also in this edition</span>
          </h3>
        ) : null}

        <PostList
          posts={listPosts}
          loading={loadingPosts}
          searchQuery={query}
          emptyMessage={
            query
              ? `No articles matched "${query}". Try a shorter phrase or another section.`
              : category
                ? `No stories filed under ${formatCategoryLabel(category)} yet. Run the Python parser first.`
                : 'No stories imported yet. Run the Python parser to load the archive.'
          }
        />

        <Pagination
          currentPage={currentPage}
          lastPage={lastPage}
          onPageChange={handlePageChange}
        />
      </section>
    </div>
  )
}
