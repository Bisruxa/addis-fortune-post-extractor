import DOMPurify from 'dompurify'

const ARCHIVE_BASE = (import.meta.env.VITE_ARCHIVE_URL || '/archive').replace(/\/$/, '')

const EDITION_IMAGE_DIRS = [
  'vol 7 No 364 images/images',
  'vol 7 No 364 images',
]

/** Decode and normalize a path from the database or legacy HTML. */
export function normalizeArchivePath(path: string): string {
  return decodeURIComponent(path.replace(/\\/g, '/').trim())
}

/**
 * Resolve an archive-relative path. Legacy HTML often references older
 * "vol 7 No ### images" folders; fall back to the current edition folder
 * when the basename exists there.
 */
export function resolveArchiveAssetPath(path: string): string {
  const normalized = normalizeArchivePath(path)
  if (!normalized) {
    return normalized
  }

  if (/^https?:\/\//i.test(normalized) || normalized.startsWith('data:')) {
    return normalized
  }

  // Already a valid-looking edition path — use as-is (server/vite may still fallback).
  if (/^vol\s+7\s+no\s+364\s+images\//i.test(normalized)) {
    return normalized
  }

  const basename = normalized.split('/').pop()
  if (basename && /vol\s+7\s+no\s+\d+\s+images/i.test(normalized)) {
    for (const dir of EDITION_IMAGE_DIRS) {
      return `${dir}/${basename}`
    }
  }

  return normalized
}

/** Build a safe archive URL from a DB path (may be plain or URL-encoded). */
export function archiveAssetUrl(path: string): string {
  const resolved = resolveArchiveAssetPath(path)
  const segments = resolved.split('/').map((segment) => encodeURIComponent(segment))
  return `${ARCHIVE_BASE}/${segments.join('/')}`
}

/** Strip fixed dimensions from legacy fieldsets (news-in-brief boxes). */
function sanitizeNewsInBriefFieldsets(html: string): string {
  return html.replace(/<fieldset\b([^>]*)>/gi, (_match, attrs: string) => {
    const withoutStyle = attrs.replace(
      /\sstyle=(["'])([\s\S]*?)\1/i,
      (_styleMatch, quote: string, style: string) => {
        const cleaned = style
          .replace(/\bwidth\s*:\s*[^;]+;?/gi, '')
          .replace(/\bheight\s*:\s*[^;]+;?/gi, '')
          .replace(/\bmin-height\s*:\s*[^;]+;?/gi, '')
          .trim()

        return cleaned ? ` style=${quote}${cleaned}${quote}` : ''
      },
    )

    return `<fieldset${withoutStyle}>`
  })
}

/** Relax fixed table/cell widths inside brief items so text can wrap. */
function sanitizeNewsInBriefTables(html: string): string {
  return html
    .replace(/\s(width|height)=(["']?)(\d{3,})\2/gi, '')
    .replace(/\b(width|height)\s*:\s*\d{3,}px;?/gi, '')
}

/** Prepare stored HTML for display in the React reader. */
export function sanitizeArticleHtml(html: string, category: string): string {
  let result = rewriteContentImageUrls(html)

  if (category === 'news_in_brief') {
    result = sanitizeNewsInBriefFieldsets(result)
    result = sanitizeNewsInBriefTables(result)
  }

  if (category === 'interview') {
    result = sanitizeInterviewLayout(result)
  }

  return DOMPurify.sanitize(result, {
    ADD_TAGS: ['fieldset', 'legend'],
    ADD_ATTR: ['bgcolor', 'align', 'valign', 'border', 'cellpadding', 'cellspacing', 'width', 'height'],
  })
}

/** Interview pages use wide sliced-photo tables from older FrontPage layouts. */
function sanitizeInterviewLayout(html: string): string {
  return html
    .replace(
      /<table\b([^>]*)\bid=(["'])table356\2([^>]*)>/gi,
      '<table class="interview-photo-strip"$1$3>',
    )
    .replace(
      /<table\b([^>]*)\bid=(["'])table355\2([^>]*)>/gi,
      '<table class="interview-photo-frame"$1$3>',
    )
}

/** Rewrite relative <img src> in stored HTML so images load in the React app. */
export function rewriteContentImageUrls(html: string): string {
  return html.replace(
    /(<img\b[^>]*\bsrc=["'])([^"']+)(["'])/gi,
    (_match, prefix: string, src: string, suffix: string) => {
      const trimmed = src.trim()
      if (
        !trimmed ||
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('/archive/')
      ) {
        return `${prefix}${src}${suffix}`
      }

      return `${prefix}${archiveAssetUrl(trimmed)}${suffix}`
    },
  )
}
