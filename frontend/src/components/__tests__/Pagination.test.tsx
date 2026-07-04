import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Pagination } from '../Pagination'

describe('Pagination', () => {
  it('renders nothing when there is only one page', () => {
    const { container } = render(
      <Pagination currentPage={1} lastPage={1} onPageChange={vi.fn()} />,
    )
    expect(container.innerHTML).toBe('')
  })

  it('renders page info and buttons for multiple pages', () => {
    render(<Pagination currentPage={2} lastPage={5} onPageChange={vi.fn()} />)
    expect(screen.getByText('Page 2 of 5')).toBeInTheDocument()
    expect(screen.getByText('Previous')).toBeEnabled()
    expect(screen.getByText('Next')).toBeEnabled()
  })

  it('disables Previous on first page', () => {
    render(<Pagination currentPage={1} lastPage={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('Previous')).toBeDisabled()
  })

  it('disables Next on last page', () => {
    render(<Pagination currentPage={3} lastPage={3} onPageChange={vi.fn()} />)
    expect(screen.getByText('Next')).toBeDisabled()
  })

  it('calls onPageChange with correct page number', async () => {
    const user = userEvent.setup()
    const onChange = vi.fn()
    render(<Pagination currentPage={2} lastPage={5} onPageChange={onChange} />)

    await user.click(screen.getByText('Next'))
    expect(onChange).toHaveBeenCalledWith(3)

    await user.click(screen.getByText('Previous'))
    expect(onChange).toHaveBeenCalledWith(1)
  })
})
