import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock کردن react-router-dom
vi.mock('react-router-dom', () => ({
  Link: ({ children, to, ...props }) => <a href={to} {...props}>{children}</a>,
}))

import CardProject from './CardProject'

describe('CardProject', () => {
  const defaultProps = {
    Img: 'https://example.com/image.jpg',
    Title: 'Test Project',
    Description: 'This is a test project',
    Link: 'https://demo.com',
    id: 1,
    category: 'React',
    viewCount: 42,
  }

  it('should render title and description', () => {
    render(<CardProject {...defaultProps} />)
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(screen.getByText('This is a test project')).toBeInTheDocument()
  })

  it('should render view count', () => {
    render(<CardProject {...defaultProps} />)
    expect(screen.getByText('42')).toBeInTheDocument()
  })

  it('should render category', () => {
    render(<CardProject {...defaultProps} />)
    expect(screen.getByText('React')).toBeInTheDocument()
  })

  it('should render "Demo Not Available" when no link', () => {
    render(<CardProject {...defaultProps} Link={null} />)
    expect(screen.getByText('Demo Not Available')).toBeInTheDocument()
  })

  it('should render image with correct src', () => {
    render(<CardProject {...defaultProps} />)
    const img = screen.getByAltText('Test Project')
    expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
  })

  it('should have details link', () => {
    render(<CardProject {...defaultProps} />)
    const detailsLink = screen.getByText('Details').closest('a')
    expect(detailsLink).toHaveAttribute('href', '/project/test-project')
  })
})