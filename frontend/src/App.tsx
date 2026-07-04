import { lazy, Suspense } from 'react'
import { Route, Routes, useParams } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { Layout } from './components/Layout'
import { ScrollToTop } from './components/ScrollToTop'
import { PostCardSkeleton } from './components/Skeleton'
import { PostsPage } from './pages/PostsPage'

const PostDetailPage = lazy(() =>
  import('./pages/PostDetailPage').then((module) => ({ default: module.PostDetailPage })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((module) => ({ default: module.NotFoundPage })),
)

function PageFallback() {
  return (
    <div className="post-list" aria-busy="true" aria-label="Loading page">
      <PostCardSkeleton />
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <ScrollToTop />
      <ErrorBoundary>
        <Suspense fallback={<PageFallback />}>
          <Routes>
            <Route path="/" element={<PostsPage />} />
            <Route path="/category/:slug" element={<CategoryRoute />} />
            <Route path="/posts/:id" element={<PostDetailPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

function CategoryRoute() {
  const { slug } = useParams()
  return <PostsPage category={slug} />
}
