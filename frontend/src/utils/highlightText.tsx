import type { ReactNode } from 'react'

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

/** Wrap matching search terms in <mark> for editorial search results. */
export function highlightText(text: string, query: string): ReactNode {
  const trimmed = query.trim()
  if (!trimmed || !text) {
    return text
  }

  const pattern = new RegExp(`(${escapeRegex(trimmed)})`, 'gi')
  const parts = text.split(pattern)

  return parts.map((part, index) =>
    part.toLowerCase() === trimmed.toLowerCase() ? (
      <mark key={index} className="search-hit">
        {part}
      </mark>
    ) : (
      part
    ),
  )
}
