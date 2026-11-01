import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProjectForm from './ProjectForm'

describe('ProjectForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
  }

  it('should render form fields', () => {
    render(<ProjectForm {...defaultProps} />)

    expect(screen.getByPlaceholderText('Project title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Project description')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g., React, JavaScript, Web')).toBeInTheDocument()
  })

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<ProjectForm {...defaultProps} onSubmit={handleSubmit} />)

    await user.click(screen.getByRole('button', { name: /add project/i }))

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('should show validation error for empty description', async () => {
    const user = userEvent.setup()
    render(<ProjectForm {...defaultProps} />)

    await user.type(screen.getByPlaceholderText('Project title'), 'Test')
    await user.click(screen.getByRole('button', { name: /add project/i }))

    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<ProjectForm {...defaultProps} onSubmit={handleSubmit} />)

    await user.type(screen.getByPlaceholderText('Project title'), 'My Project')
    await user.type(screen.getByPlaceholderText('Project description'), 'This is a description for my project')
    await user.type(screen.getByPlaceholderText('e.g., React, JavaScript, Web'), 'React')

    await user.click(screen.getByRole('button', { name: /add project/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  it('should show "Update Project" button in edit mode', () => {
    const project = {
      id: 1,
      title: 'Test',
      description: 'Test desc',
      category: 'React',
    }
    render(<ProjectForm {...defaultProps} project={project} />)

    expect(screen.getByRole('button', { name: /update project/i })).toBeInTheDocument()
  })

  it('should pre-fill form in edit mode', () => {
    const project = {
      id: 1,
      title: 'Existing Project',
      description: 'Existing description',
      category: 'Vue',
      technologies: ['Vue', 'Tailwind'],
      features: ['Dark Mode'],
    }
    render(<ProjectForm {...defaultProps} project={project} />)

    expect(screen.getByDisplayValue('Existing Project')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Existing description')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Vue, Tailwind')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Dark Mode')).toBeInTheDocument()
  })

  it('should call onCancel when cancel clicked', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(<ProjectForm {...defaultProps} onCancel={handleCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalled()
  })
})