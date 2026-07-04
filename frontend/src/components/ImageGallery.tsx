import { useState } from 'react'
import type { PostImage } from '../types/post'
import { archiveAssetUrl } from '../utils/archiveUrl'

interface ImageGalleryProps {
  images: PostImage[]
}

const SLICE_PATTERN = /^(.+)_(\d+)\.(gif|jpe?g|png|webp)$/i

function basename(path: string): string {
  return path.split('/').pop() || path
}

function groupSliceImages(images: PostImage[]): {
  sliceGroups: PostImage[][]
  singles: PostImage[]
} {
  const groups = new Map<string, PostImage[]>()
  const singles: PostImage[] = []

  for (const image of images) {
    const name = basename(image.path)
    const match = name.match(SLICE_PATTERN)
    if (match) {
      const key = match[1].toLowerCase()
      const bucket = groups.get(key) ?? []
      bucket.push(image)
      groups.set(key, bucket)
    } else {
      singles.push(image)
    }
  }

  const sliceGroups = [...groups.values()]
    .filter((group) => group.length >= 2)
    .map((group) =>
      [...group].sort((a, b) => {
        const aNum = Number(a.path.match(SLICE_PATTERN)?.[2] ?? 0)
        const bNum = Number(b.path.match(SLICE_PATTERN)?.[2] ?? 0)
        return aNum - bNum
      }),
    )

  const groupedIds = new Set(sliceGroups.flat().map((image) => image.id))
  const remainingSingles = images.filter((image) => !groupedIds.has(image.id))

  return { sliceGroups, singles: remainingSingles }
}

function ArchiveImage({
  image,
  className,
  onUnavailable,
}: {
  image: PostImage
  className?: string
  onUnavailable: () => void
}) {
  return (
    <img
      className={className}
      src={archiveAssetUrl(image.path)}
      alt=""
      loading="lazy"
      onError={onUnavailable}
    />
  )
}

export function ImageGallery({ images }: ImageGalleryProps) {
  const [failedIds, setFailedIds] = useState<number[]>([])

  if (!images.length) {
    return null
  }

  const { sliceGroups, singles } = groupSliceImages(images)
  const failed = new Set(failedIds)

  function markFailed(id: number) {
    setFailedIds((current) => (current.includes(id) ? current : [...current, id]))
  }

  return (
    <section className="image-gallery" aria-label="Illustrations from the original page">
      <h2 className="image-gallery__heading">
        Illustrations <span className="image-gallery__count">{images.length}</span>
      </h2>

      {sliceGroups.map((group) => {
        const groupFailed = group.every((image) => failed.has(image.id))
        if (groupFailed) {
          return (
            <div key={`slice-${group[0].id}`} className="image-gallery__unavailable">
              <p>Portrait illustration referenced from an older edition volume — asset not included in this archive.</p>
            </div>
          )
        }

        return (
          <figure key={`slice-${group[0].id}`} className="image-gallery__composite">
            <div className="image-gallery__composite-row">
              {group.map((image) =>
                failed.has(image.id) ? null : (
                  <ArchiveImage
                    key={image.id}
                    image={image}
                    className="image-gallery__slice"
                    onUnavailable={() => markFailed(image.id)}
                  />
                ),
              )}
            </div>
            <figcaption>Composite portrait from the original page layout</figcaption>
          </figure>
        )
      })}

      {singles.length > 0 ? (
        <div className="image-gallery__grid">
          {singles.map((image) =>
            failed.has(image.id) ? (
              <div key={image.id} className="image-gallery__unavailable image-gallery__unavailable--card">
                <p>Image unavailable in archive</p>
                <span>{basename(image.path)}</span>
              </div>
            ) : (
              <figure key={image.id} className="image-gallery__item">
                <ArchiveImage image={image} onUnavailable={() => markFailed(image.id)} />
                <figcaption title={image.path}>Original archive asset</figcaption>
              </figure>
            ),
          )}
        </div>
      ) : null}
    </section>
  )
}
