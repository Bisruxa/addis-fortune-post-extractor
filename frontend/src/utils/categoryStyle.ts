/** Category slug → human label and accent token for editorial card styling. */
const CATEGORY_META: Record<string, { label: string; accent: string }> = {
  news: { label: 'News', accent: 'news' },
  opinion: { label: 'Opinion', accent: 'opinion' },
  editorial: { label: 'Editorial', accent: 'editorial' },
  interview: { label: 'Interview', accent: 'interview' },
  news_in_brief: { label: 'News in Brief', accent: 'brief' },
  restaurant_review: { label: 'Restaurant Review', accent: 'dining' },
  cartoon: { label: 'Cartoon', accent: 'cartoon' },
  view_from_arada: { label: 'View from Arada', accent: 'column' },
  viewpoint: { label: 'Viewpoint', accent: 'column' },
  life_matters: { label: 'Life Matters', accent: 'feature' },
  letter: { label: 'Letter to the Editor', accent: 'letter' },
  commentary: { label: 'Commentary', accent: 'column' },
  gossip: { label: 'Gossip', accent: 'gossip' },
  feature: { label: 'Feature', accent: 'feature' },
  other: { label: 'Archive', accent: 'default' },
}

export function getCategoryAccent(slug: string): string {
  return CATEGORY_META[slug]?.accent ?? 'default'
}

export function getCategoryLabel(slug: string): string {
  if (CATEGORY_META[slug]) {
    return CATEGORY_META[slug].label
  }
  return slug.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase())
}
