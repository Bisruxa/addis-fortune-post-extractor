import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import type { PostSummary } from '../../types/post'
import { PostCard } from '../PostCard'

const mockPost: PostSummary = {
  id: 1,
  title: 'Test Article Title',
  author: 'John Doe',
  category: 'news',
  source_file: 'test.htm',
  excerpt: 'This is a test excerpt for the article.',
  image_count: 2,
  created_at: null,
  updated_at: null,
}

function renderWithRouter(ui: React.ReactElement) {
  return render(<MemoryRouter>{ui}</MemoryRouter>)
}

describe('PostCard', () => {
  it('renders article title, author, and excerpt', () => {
    renderWithRouter(<PostCard post={mockPost} />)
    expect(screen.getByText('Test Article Title')).toBeInTheDocument()
    expect(screen.getByText('John Doe')).toBeInTheDocument()
    expect(screen.getByText('This is a test excerpt for the article.')).toBeInTheDocument()
  })

  it('displays the category badge', () => {
    renderWithRouter(<PostCard post={mockPost} />)
    expect(screen.getByText('News')).toBeInTheDocument()
  })

  it('shows image count when present', () => {
    renderWithRouter(<PostCard post={mockPost} />)
    expect(screen.getByText('2 illustration(s)')).toBeInTheDocument()
  })

  it('hides image count when zero', () => {
    renderWithRouter(<PostCard post={{ ...mockPost, image_count: 0 }} />)
    expect(screen.queryByText(/illustration/)).toBeNull()
  })

  it('shows "Untitled article" when title is null', () => {
    renderWithRouter(<PostCard post={{ ...mockPost, title: null }} />)
    expect(screen.getByText('Untitled article')).toBeInTheDocument()
  })

  it('links to the article detail page', () => {
    renderWithRouter(<PostCard post={mockPost} />)
    const links = screen.getAllByRole('link')
    const articleLink = links.find((link) => link.getAttribute('href') === '/posts/1')
    expect(articleLink).toBeInTheDocument()
  })

  it('displays source file name', () => {
    renderWithRouter(<PostCard post={mockPost} />)
    expect(screen.getByText('test.htm')).toBeInTheDocument()
  })
})
