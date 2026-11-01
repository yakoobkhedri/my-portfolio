import { describe, it, expect, vi } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CertificateForm from './CertificateForm'

describe('CertificateForm', () => {
  const defaultProps = {
    onSubmit: vi.fn(),
    onCancel: vi.fn(),
    isSubmitting: false,
  }

  it('should render form fields', () => {
    render(<CertificateForm {...defaultProps} />)

    expect(screen.getByPlaceholderText('Certificate title')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('e.g., Coursera, Udemy')).toBeInTheDocument()
  })

  it('should show validation error for empty title', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<CertificateForm {...defaultProps} onSubmit={handleSubmit} />)

    const submitButton = screen.getByRole('button', { name: /add certificate/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument()
    })
    expect(handleSubmit).not.toHaveBeenCalled()
  })

  it('should show validation error for empty issuer', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<CertificateForm {...defaultProps} onSubmit={handleSubmit} />)

    await user.type(screen.getByPlaceholderText('Certificate title'), 'Test Cert')
    await user.click(screen.getByRole('button', { name: /add certificate/i }))

    await waitFor(() => {
      expect(screen.getByText(/issuer is required/i)).toBeInTheDocument()
    })
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const handleSubmit = vi.fn()
    render(<CertificateForm {...defaultProps} onSubmit={handleSubmit} />)

    await user.type(screen.getByPlaceholderText('Certificate title'), 'My Cert')
    await user.type(screen.getByPlaceholderText('e.g., Coursera, Udemy'), 'Coursera')
    
    const dateInput = screen.getByLabelText(/date/i)
    await user.type(dateInput, '2024-01-01')

    await user.click(screen.getByRole('button', { name: /add certificate/i }))

    await waitFor(() => {
      expect(handleSubmit).toHaveBeenCalled()
    })
  })

  it('should show "Update Certificate" button in edit mode', () => {
    const certificate = { id: 1, title: 'Test', issuer: 'Test', date: '2024-01-01' }
    render(<CertificateForm {...defaultProps} certificate={certificate} />)

    expect(screen.getByRole('button', { name: /update certificate/i })).toBeInTheDocument()
  })

  it('should call onCancel when cancel button clicked', async () => {
    const user = userEvent.setup()
    const handleCancel = vi.fn()
    render(<CertificateForm {...defaultProps} onCancel={handleCancel} />)

    await user.click(screen.getByRole('button', { name: /cancel/i }))
    expect(handleCancel).toHaveBeenCalled()
  })

  it('should disable submit button when isSubmitting', () => {
    render(<CertificateForm {...defaultProps} isSubmitting={true} />)
    const submitButton = screen.getByRole('button', { name: /saving/i })
    expect(submitButton).toBeDisabled()
  })
})