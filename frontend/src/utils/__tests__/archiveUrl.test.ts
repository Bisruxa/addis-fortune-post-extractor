import { describe, expect, it } from 'vitest'
import { normalizeArchivePath, resolveArchiveAssetPath } from '../archiveUrl'

describe('normalizeArchivePath', () => {
  it('decodes URL-encoded characters', () => {
    expect(normalizeArchivePath('vol%207%20No%20364')).toBe('vol 7 No 364')
  })

  it('replaces backslashes with forward slashes', () => {
    expect(normalizeArchivePath('images\\photo.jpg')).toBe('images/photo.jpg')
  })

  it('trims whitespace', () => {
    expect(normalizeArchivePath('  photo.jpg  ')).toBe('photo.jpg')
  })
})

describe('resolveArchiveAssetPath', () => {
  it('passes through absolute URLs unchanged', () => {
    expect(resolveArchiveAssetPath('https://example.com/img.jpg')).toBe('https://example.com/img.jpg')
  })

  it('passes through data URIs unchanged', () => {
    expect(resolveArchiveAssetPath('data:image/png;base64,abc')).toBe('data:image/png;base64,abc')
  })

  it('keeps current edition paths as-is', () => {
    const path = 'vol 7 No 364 images/photo.jpg'
    expect(resolveArchiveAssetPath(path)).toBe(path)
  })
})
