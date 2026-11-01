import { describe, it, expect } from 'vitest'
import { renderHook } from '@testing-library/react'
import { useFilteredProjects } from './useProjects'

describe('useFilteredProjects', () => {
  const mockProjects = [
    {
      id: 1,
      title: 'React Project',
      description: 'A React app',
      category: 'React',
      technologies: ['React', 'Tailwind'],
    },
    {
      id: 2,
      title: 'Vue Project',
      description: 'A Vue app',
      category: 'Vue',
      technologies: ['Vue'],
    },
    {
      id: 3,
      title: 'Node Project',
      description: 'A Node app',
      category: 'Node',
      technologies: ['Node', 'Express'],
    },
  ]

  it('should return all projects when no filter', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, '', 'All'))
    expect(result.current).toHaveLength(3)
  })

  it('should filter by category', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, '', 'React'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('React Project')
  })

  it('should filter by search term (title)', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, 'Vue', 'All'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('Vue Project')
  })

  it('should filter by search term (description)', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, 'Node app', 'All'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('Node Project')
  })

  it('should filter by search term (technologies)', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, 'Tailwind', 'All'))
    expect(result.current).toHaveLength(1)
    expect(result.current[0].title).toBe('React Project')
  })

  it('should combine search and category', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, 'Project', 'React'))
    expect(result.current).toHaveLength(1)
  })

  it('should return empty array when no match', () => {
    const { result } = renderHook(() => useFilteredProjects(mockProjects, 'Angular', 'All'))
    expect(result.current).toHaveLength(0)
  })

  it('should handle empty projects array', () => {
    const { result } = renderHook(() => useFilteredProjects([], '', 'All'))
    expect(result.current).toHaveLength(0)
  })
})