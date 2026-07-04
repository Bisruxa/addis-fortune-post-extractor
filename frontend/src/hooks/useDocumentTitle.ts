import { useEffect } from 'react'

const BASE_TITLE = 'Addis Fortune — Vol 7 No 364 Archive'

export function useDocumentTitle(title?: string | null) {
  useEffect(() => {
    document.title = title ? `${title} — Addis Fortune` : BASE_TITLE
    return () => {
      document.title = BASE_TITLE
    }
  }, [title])
}
