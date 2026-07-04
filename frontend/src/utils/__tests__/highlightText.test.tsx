import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { highlightText } from '../highlightText'

describe('highlightText', () => {
  it('returns plain text when query is empty', () => {
    const result = highlightText('Hello world', '')
    expect(result).toBe('Hello world')
  })

  it('returns text unchanged when query has no match', () => {
    const { container } = render(<>{highlightText('Hello world', 'xyz')}</>)
    expect(container.textContent).toBe('Hello world')
    expect(container.querySelector('mark')).toBeNull()
  })

  it('wraps matching substrings in <mark> elements', () => {
    render(<>{highlightText('The NBE announced new rates', 'NBE')}</>)
    const mark = screen.getByText('NBE')
    expect(mark.tagName).toBe('MARK')
    expect(mark).toHaveClass('search-hit')
  })

  it('handles case-insensitive matching', () => {
    render(<>{highlightText('Banking news today', 'bank')}</>)
    const mark = screen.getByText('Bank')
    expect(mark.tagName).toBe('MARK')
  })

  it('escapes regex special characters in query', () => {
    const { container } = render(<>{highlightText('Price is $100 (USD)', '$100')}</>)
    const mark = container.querySelector('mark')
    expect(mark?.textContent).toBe('$100')
  })
})
