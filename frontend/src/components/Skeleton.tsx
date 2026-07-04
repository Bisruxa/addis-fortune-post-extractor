interface SkeletonProps {
  width?: string
  height?: string
  borderRadius?: string
}

export function Skeleton({ width = '100%', height = '1em', borderRadius = '4px' }: SkeletonProps) {
  return (
    <span
      className="skeleton"
      aria-hidden="true"
      style={{ width, height, borderRadius, display: 'inline-block' }}
    />
  )
}

export function PostCardSkeleton() {
  return (
    <div className="post-card" aria-hidden="true">
      <div className="post-card__rule" style={{ background: 'var(--line)' }} />
      <div className="post-card__body">
        <div className="post-card__meta">
          <Skeleton width="5rem" height="1.2em" />
        </div>
        <div style={{ marginTop: '0.45rem' }}>
          <Skeleton width="75%" height="1.3em" />
        </div>
        <div style={{ marginTop: '0.5rem' }}>
          <Skeleton width="8rem" height="0.9em" />
        </div>
        <div style={{ marginTop: '0.6rem', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <Skeleton width="100%" height="0.95em" />
          <Skeleton width="90%" height="0.95em" />
          <Skeleton width="60%" height="0.95em" />
        </div>
      </div>
    </div>
  )
}

export function PostDetailSkeleton() {
  return (
    <div className="post-detail" aria-hidden="true">
      <Skeleton width="8rem" height="0.9em" />
      <div style={{ marginTop: '1.25rem' }}>
        <Skeleton width="4rem" height="0.75em" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton width="80%" height="2rem" />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <Skeleton width="60%" height="1.8rem" />
      </div>
      <div style={{ marginTop: '0.85rem' }}>
        <Skeleton width="10rem" height="1em" />
      </div>
      <div style={{ marginTop: '1.5rem', borderTop: '2px solid var(--line)', paddingTop: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        <Skeleton width="100%" height="1em" />
        <Skeleton width="100%" height="1em" />
        <Skeleton width="95%" height="1em" />
        <Skeleton width="100%" height="1em" />
        <Skeleton width="70%" height="1em" />
      </div>
    </div>
  )
}
