import { describe, expect, it } from 'vitest'
import { getCategoryAccent, getCategoryLabel } from '../categoryStyle'

describe('getCategoryLabel', () => {
  it('returns mapped label for known categories', () => {
    expect(getCategoryLabel('news')).toBe('News')
    expect(getCategoryLabel('news_in_brief')).toBe('News in Brief')
    expect(getCategoryLabel('restaurant_review')).toBe('Restaurant Review')
  })

  it('title-cases unknown slugs by replacing underscores', () => {
    expect(getCategoryLabel('special_report')).toBe('Special Report')
  })
})

describe('getCategoryAccent', () => {
  it('returns accent token for known categories', () => {
    expect(getCategoryAccent('news')).toBe('news')
    expect(getCategoryAccent('news_in_brief')).toBe('brief')
    expect(getCategoryAccent('restaurant_review')).toBe('dining')
  })

  it('returns "default" for unknown categories', () => {
    expect(getCategoryAccent('unknown_category')).toBe('default')
  })
})
