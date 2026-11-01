import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchAndFilter from './SearchAndFilter'

describe('SearchAndFilter', () => {
  const defaultProps = {
    searchTerm: '',
    onSearchChange: vi.fn(),
    category: 'All',
    onCategoryChange: vi.fn(),
    categories: ['React', 'Vue'],
    resultCount: 5,
  }

  it('should render search input', () => {
    render(<SearchAndFilter {...defaultProps} />)
    expect(screen.getByPlaceholderText('Search projects...')).toBeInTheDocument()
  })

  it('should render categories', () => {
    render(<SearchAndFilter {...defaultProps} />)
    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.getByText('Vue')).toBeInTheDocument()
    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('should call onSearchChange when typing', async () => {
    const user = userEvent.setup()
    const handleSearch = vi.fn()
    render(<SearchAndFilter {...defaultProps} onSearchChange={handleSearch} />)

    const input = screen.getByPlaceholderText('Search projects...')
    await user.type(input, 'react')

    expect(handleSearch).toHaveBeenCalled()
  })

  it('should call onCategoryChange when clicking category', async () => {
    const user = userEvent.setup()
    const handleCategory = vi.fn()
    render(<SearchAndFilter {...defaultProps} onCategoryChange={handleCategory} />)

    await user.click(screen.getByText('React'))
    expect(handleCategory).toHaveBeenCalledWith('React')
  })

  it('should show clear button when searchTerm is not empty', () => {
    render(<SearchAndFilter {...defaultProps} searchTerm="test" />)
    // دکمه X (clear) باید وجود داشته باشه
    const clearButton = screen.getByRole('button', { name: /clear search/i })
    expect(clearButton).toBeInTheDocument()
  })

  it('should call onSearchChange with empty string when clear clicked', async () => {
    const user = userEvent.setup()
    const handleSearch = vi.fn()
    render(<SearchAndFilter {...defaultProps} searchTerm="test" onSearchChange={handleSearch} />)

    const clearButton = screen.getByRole('button', { name: /clear search/i })
    await user.click(clearButton)

    expect(handleSearch).toHaveBeenCalledWith('')
  })

  it('should show result count when filtering', () => {
    render(<SearchAndFilter {...defaultProps} searchTerm="react" resultCount={3} />)
    expect(screen.getByText(/3 result/)).toBeInTheDocument()
  })
})