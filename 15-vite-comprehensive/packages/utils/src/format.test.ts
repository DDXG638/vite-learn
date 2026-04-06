import { describe, it, expect } from 'vitest'
import { formatPrice, formatDate } from './format'

describe('formatPrice', () => {
  it('should format price with ¥ symbol', () => {
    expect(formatPrice(100)).toBe('¥100.00')
    expect(formatPrice(99.9)).toBe('¥99.90')
    expect(formatPrice(0)).toBe('¥0.00')
  })
})

describe('formatDate', () => {
  it('should format date correctly', () => {
    expect(formatDate(new Date(2024, 0, 1))).toBe('2024-01-01')
    expect(formatDate('2024-12-31')).toBe('2024-12-31')
    expect(formatDate(1704067200000)).toBe('2024-01-01')
  })
})
