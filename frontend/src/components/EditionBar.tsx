import { useCategories } from '../hooks/useCategories'

export function EditionBar() {
  const { categories } = useCategories()
  const articleCount = categories.length > 0
    ? categories.reduce((sum, item) => sum + item.count, 0)
    : null
  const sectionCount = categories.length > 0 ? categories.length : null

  return (
    <div className="edition-bar" aria-label="Edition details">
      <span>Volume 7 · Number 364</span>
      <span className="edition-bar__rule" aria-hidden="true" />
      {articleCount !== null ? (
        <span>
          {articleCount} article{articleCount === 1 ? '' : 's'}
        </span>
      ) : (
        <span>Digital archive</span>
      )}
      {sectionCount !== null ? (
        <>
          <span className="edition-bar__rule" aria-hidden="true" />
          <span>
            {sectionCount} section{sectionCount === 1 ? '' : 's'}
          </span>
        </>
      ) : null}
      <span className="edition-bar__rule" aria-hidden="true" />
      <span className="edition-bar__tag">Searchable edition</span>
    </div>
  )
}
