import { describe, it, expect, vi } from 'vitest'
import { useTimeoutFn, useIntervalFn } from '../useTimeoutFn'

describe('useTimeoutFn', () => {
  it('should call callback after delay', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { start, stop, isPending } = useTimeoutFn(cb, 1000, { immediate: false })

    expect(isPending()).toBe(false)

    start()
    expect(isPending()).toBe(true)

    vi.advanceTimersByTime(1000)
    expect(cb).toHaveBeenCalledTimes(1)
    expect(isPending()).toBe(false)

    vi.useRealTimers()
  })

  it('should start immediately by default', () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { isPending } = useTimeoutFn(cb, 500)
    expect(isPending()).toBe(true)
    vi.useRealTimers()
  })

  it('should cancel timer on stop', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { start, stop, isPending } = useTimeoutFn(cb, 1000, { immediate: false })

    start()
    stop()
    expect(isPending()).toBe(false)

    vi.advanceTimersByTime(2000)
    expect(cb).not.toHaveBeenCalled()
    vi.useRealTimers()
  })

  it('can be restarted', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { start } = useTimeoutFn(cb, 100, { immediate: false })

    start()
    vi.advanceTimersByTime(100)
    expect(cb).toHaveBeenCalledTimes(1)

    start()
    vi.advanceTimersByTime(100)
    expect(cb).toHaveBeenCalledTimes(2)
    vi.useRealTimers()
  })
})

describe('useIntervalFn', () => {
  it('should call callback repeatedly', async () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { start, stop, isPending } = useIntervalFn(cb, 100, { immediate: false })

    start()
    vi.advanceTimersByTime(350)
    expect(cb).toHaveBeenCalledTimes(3)
    expect(isPending()).toBe(true)

    stop()
    expect(isPending()).toBe(false)
    vi.advanceTimersByTime(300)
    expect(cb).toHaveBeenCalledTimes(3)
    vi.useRealTimers()
  })

  it('should start immediately by default', () => {
    vi.useFakeTimers()
    const cb = vi.fn()
    const { isPending } = useIntervalFn(cb, 100)
    expect(isPending()).toBe(true)
    vi.useRealTimers()
  })
})
