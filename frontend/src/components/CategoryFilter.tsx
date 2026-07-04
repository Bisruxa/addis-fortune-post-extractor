import { Link } from 'react-router-dom'
import type { CategoryItem } from '../types/post'
import { getCategoryLabel } from '../utils/categoryStyle'

interface CategoryFilterProps {
  categories: CategoryItem[]
  activeCategory?: string
  loading?: boolean
}

export function CategoryFilter({ categories, activeCategory, loading }: CategoryFilterProps) {
  return (
    <aside className="category-filter" aria-label="Sections">
      <h2 className="category-filter__heading">Sections</h2>
      <p className="category-filter__intro muted">Browse by the way stories were filed in the original edition.</p>
      {loading ? <p className="muted">Loading sections…</p> : null}

      <ul className="category-filter__list">
        <li>
          <Link to="/" className={!activeCategory ? 'active' : undefined}>
            <span>Full edition</span>
          </Link>
        </li>
        {categories.map((category) => (
          <li key={category.slug}>
            <Link
              to={`/category/${category.slug}`}
              className={activeCategory === category.slug ? 'active' : undefined}
              data-category={category.slug}
            >
              <span>{getCategoryLabel(category.slug)}</span>
              <span className="count">{category.count}</span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}
