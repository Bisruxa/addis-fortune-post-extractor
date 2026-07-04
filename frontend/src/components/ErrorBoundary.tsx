import { Component } from 'react'
import type { ErrorInfo, ReactNode } from 'react'
import { Link } from 'react-router-dom'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="state-box state-box--error" style={{ margin: '2rem auto', maxWidth: '36rem' }}>
          <h2 style={{ margin: '0 0 0.5rem' }}>Something went wrong</h2>
          <p>An unexpected error prevented this page from rendering.</p>
          {this.state.error ? (
            <pre style={{ fontSize: '0.78rem', textAlign: 'left', overflow: 'auto', margin: '1rem 0' }}>
              {this.state.error.message}
            </pre>
          ) : null}
          <Link
            to="/"
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Return to the edition
          </Link>
        </div>
      )
    }

    return this.props.children
  }
}
