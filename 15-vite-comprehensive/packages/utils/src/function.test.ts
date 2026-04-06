import { describe, it, expect, vi } from 'vitest'
import { debounce, throttle } from './function'

describe('debounce', () => {
  it('should debounce function calls', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const debouncedFn = debounce(fn, 100)

    debouncedFn()
    debouncedFn()
    debouncedFn()

    expect(fn).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)

    expect(fn).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})

describe('throttle', () => {
  it('should throttle function calls', async () => {
    vi.useFakeTimers()
    const fn = vi.fn()
    const throttledFn = throttle(fn, 100)

    throttledFn()
    throttledFn()
    throttledFn()

    expect(fn).toHaveBeenCalledTimes(1)

    vi.advanceTimersByTime(100)

    throttledFn()
    expect(fn).toHaveBeenCalledTimes(2)

    vi.useRealTimers()
  })
})
