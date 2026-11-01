import { describe, it, expect } from 'vitest'
import { toSlug } from './slug'

describe('toSlug', () => {
  it('should convert simple title to slug', () => {
    expect(toSlug('My Project')).toBe('my-project')
  })

  it('should handle empty string', () => {
    expect(toSlug('')).toBe('')
  })

  it('should handle undefined', () => {
    expect(toSlug(undefined)).toBe('')
  })

  it('should handle null', () => {
    expect(toSlug(null)).toBe('')
  })

  it('should remove special characters', () => {
    expect(toSlug('Hello World!')).toBe('hello-world')
  })

  it('should convert to lowercase', () => {
    expect(toSlug('REACT PROJECT')).toBe('react-project')
  })

  it('should replace multiple spaces with single dash', () => {
    expect(toSlug('Hello   World')).toBe('hello-world')
  })
})