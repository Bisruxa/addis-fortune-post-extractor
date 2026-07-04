import { Link } from 'react-router-dom'
import { useDocumentTitle } from '../hooks/useDocumentTitle'

export function NotFoundPage() {
  useDocumentTitle('Page not found')

  return (
    <div className="state-box" style={{ maxWidth: '36rem', margin: '2rem auto' }}>
      <h2 style={{ margin: '0 0 0.5rem', fontFamily: 'Libre Baskerville, Georgia, serif' }}>
        Page not found
      </h2>
      <p className="muted">
        This section of the archive could not be located. The page may have moved or the link may be
        outdated.
      </p>
      <Link to="/" style={{ fontWeight: 600 }}>
        Return to the edition
      </Link>
    </div>
  )
}
