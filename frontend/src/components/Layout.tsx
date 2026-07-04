import { Link } from 'react-router-dom'
import { EditionBar } from './EditionBar'

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell">
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>

      <header className="site-header">
        <div className="site-header__inner">
          <p className="masthead-eyebrow">Content Matters</p>
          <h1 className="masthead-title">
            <Link to="/">Addis Fortune</Link>
          </h1>
          <EditionBar />
          <p className="masthead-tagline">
            Business news, opinion, interviews, and reviews — preserved from the original HTML archive.
          </p>
        </div>
      </header>

      <main id="main-content" className="site-main" tabIndex={-1}>
        {children}
      </main>

      <footer className="site-footer">
        <p className="site-footer__edition">Addis Fortune · Volume 7, Number 364</p>
        <p className="site-footer__credit">
          Digitized archive · Python ingestion · Laravel API · React reader
        </p>
      </footer>
    </div>
  )
}
