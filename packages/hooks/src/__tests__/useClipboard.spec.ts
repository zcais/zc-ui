import { describe, it, expect, vi } from 'vitest'
import { useClipboard } from '../useClipboard'

describe('useClipboard', () => {
  it('should expose isSupported flag', () => {
    const { isSupported } = useClipboard()
    // In test env, clipboard may or may not be available
    expect(typeof isSupported).toBe('boolean')
  })

  it('should copy text via execCommand fallback', async () => {
    const writeText = vi.fn().mockRejectedValue(new Error('not allowed'))
    const execCommand = vi.fn().mockReturnValue(true)

    const originalClipboard = navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      configurable: true,
    })
    const originalExec = document.execCommand
    document.execCommand = execCommand

    const { copy, copied, text } = useClipboard()
    const ok = await copy('hello world')

    expect(ok).toBe(true)
    expect(text.value).toBe('hello world')
    expect(copied.value).toBe(true)

    // Restore
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      configurable: true,
    })
    document.execCommand = originalExec
  })

  it('should reset copied after duration', async () => {
    vi.useFakeTimers()
    const execCommand = vi.fn().mockReturnValue(true)
    const originalExec = document.execCommand
    document.execCommand = execCommand

    const { copy, copied } = useClipboard({ copiedDuration: 100 })
    await copy('test')

    expect(copied.value).toBe(true)
    vi.advanceTimersByTime(150)
    expect(copied.value).toBe(false)

    document.execCommand = originalExec
    vi.useRealTimers()
  })
})
