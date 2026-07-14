import { describe, it, expect, vi } from 'vitest'
import { useDebounce, useDebounceFn, useThrottle, useThrottleFn } from '../useDebounce'

describe('useDebounce', () => {
  it('should debounce function calls', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { run, cancel } = useDebounce(cb, 200)

    run()
    run()
    run()

    vi.advanceTimersByTime(150)
    expect(cb).not.toHaveBeenCalled()

    vi.advanceTimersByTime(100)
    expect(cb).toHaveBeenCalledTimes(1)

    cancel()
    vi.useRealTimers()
  })

  it('should cancel pending call', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { run, cancel } = useDebounce(cb, 200)

    run()
    cancel()
    vi.advanceTimersByTime(300)
    expect(cb).not.toHaveBeenCalled()
    vi.useRealTimers()
  })
})

describe('useDebounceFn', () => {
  it('should return a function with cancel', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const debounced = useDebounceFn(cb, 100)

    debounced('a')
    debounced('b')
    vi.advanceTimersByTime(100)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(cb).toHaveBeenCalledWith('b')

    debounced.cancel()
    vi.advanceTimersByTime(200)
    expect(cb).toHaveBeenCalledTimes(1)
    vi.useRealTimers()
  })
})

describe('useThrottle', () => {
  it('should throttle function calls', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { run } = useThrottle(cb, 200)

    run()
    expect(cb).toHaveBeenCalledTimes(1)

    run()
    run()
    expect(cb).toHaveBeenCalledTimes(1) // still throttled

    vi.advanceTimersByTime(200)
    expect(cb).toHaveBeenCalledTimes(2) // trailing call fired

    vi.useRealTimers()
  })
})

describe('useThrottleFn', () => {
  it('should return a function with cancel', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const throttled = useThrottleFn(cb, 200)

    throttled()
    expect(cb).toHaveBeenCalledTimes(1)

    throttled()
    throttled.cancel()

    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledTimes(1) // cancelled, no trailing
    vi.useRealTimers()
  })
})
