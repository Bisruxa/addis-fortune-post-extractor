import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBar } from '../SearchBar'

describe('SearchBar', () => {
  it('renders with the correct role and label', () => {
    render(<SearchBar onSearch={vi.fn()} />)
    expect(screen.getByRole('search')).toBeInTheDocument()
    expect(screen.getByLabelText('Search this edition')).toBeInTheDocument()
  })

  it('initializes with provided query', () => {
    render(<SearchBar initialQuery="bank" onSearch={vi.fn()} />)
    expect(screen.getByRole('searchbox')).toHaveValue('bank')
  })

  it('calls onSearch with trimmed value on submit', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    const input = screen.getByRole('searchbox')
    await user.type(input, '  NBE  ')
    await user.click(screen.getByText('Search'))

    expect(onSearch).toHaveBeenCalledWith('NBE')
  })

  it('shows Clear button only when query is non-empty', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar onSearch={onSearch} />)

    expect(screen.queryByText('Clear')).toBeNull()

    await user.type(screen.getByRole('searchbox'), 'test')
    expect(screen.getByText('Clear')).toBeInTheDocument()
  })

  it('clears input and calls onSearch with empty string on Clear', async () => {
    const user = userEvent.setup()
    const onSearch = vi.fn()
    render(<SearchBar initialQuery="bank" onSearch={onSearch} />)

    await user.click(screen.getByText('Clear'))
    expect(screen.getByRole('searchbox')).toHaveValue('')
    expect(onSearch).toHaveBeenCalledWith('')
  })
})
