import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility function', () => {
  it('should merge class names correctly', () => {
    expect(cn('text-red-500', 'bg-blue-500')).toBe('text-red-500 bg-blue-500')
  })

  it('should handle conditional classes', () => {
    expect(cn('base', false && 'conditional', 'always')).toBe('base always')
  })

  it('should handle Tailwind conflicts', () => {
    expect(cn('text-red-500', 'text-blue-500')).toBe('text-blue-500')
  })

  it('should handle empty inputs', () => {
    expect(cn()).toBe('')
  })

  it('should handle undefined and null', () => {
    expect(cn('base', undefined, null, 'end')).toBe('base end')
  })
})
