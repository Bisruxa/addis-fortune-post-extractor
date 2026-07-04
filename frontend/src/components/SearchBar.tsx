import { FormEvent, useState } from 'react'

interface SearchBarProps {
  initialQuery?: string
  onSearch: (query: string) => void
}

export function SearchBar({ initialQuery = '', onSearch }: SearchBarProps) {
  const [query, setQuery] = useState(initialQuery)

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSearch(query.trim())
  }

  return (
    <form className="search-bar" onSubmit={handleSubmit} role="search">
      <label className="search-bar__label" htmlFor="edition-search">
        Search this edition
      </label>
      <div className="search-bar__controls">
        <input
          id="edition-search"
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Try “bank”, “NBE”, or an author name…"
          aria-label="Search this edition"
        />
        <button type="submit">Search</button>
        {query ? (
          <button
            type="button"
            className="button-ghost"
            onClick={() => {
              setQuery('')
              onSearch('')
            }}
          >
            Clear
          </button>
        ) : null}
      </div>
    </form>
  )
}
