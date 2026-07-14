import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { message, closeAllMessages } from '../message/message'

describe('ZcMessage (functional API)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a message with string argument', async () => {
    message('Hello World')
    await nextTick()
    const msgEl = document.querySelector('.zc-message')
    expect(msgEl).not.toBeNull()
    expect(msgEl?.textContent).toContain('Hello World')
  })

  it('creates a message with options object', async () => {
    message({ message: 'Test message', type: 'success' })
    await nextTick()
    const msgEl = document.querySelector('.zc-message')
    expect(msgEl?.classList.contains('zc-message--success')).toBe(true)
  })

  it('applies correct type class for info', async () => {
    message.info('Info message')
    await nextTick()
    const msgEl = document.querySelector('.zc-message')
    expect(msgEl?.classList.contains('zc-message--info')).toBe(true)
  })

  it('applies correct type class for success', async () => {
    message.success('Success message')
    await nextTick()
    const msgEl = document.querySelector('.zc-message')
    expect(msgEl?.classList.contains('zc-message--success')).toBe(true)
  })

  it('applies correct type class for warning', async () => {
    message.warning('Warning message')
    await nextTick()
    const msgEl = document.querySelector('.zc-message')
    expect(msgEl?.classList.contains('zc-message--warning')).toBe(true)
  })

  it('applies correct type class for error', async () => {
    message.error('Error message')
    await nextTick()
    const msgEl = document.querySelector('.zc-message')
    expect(msgEl?.classList.contains('zc-message--error')).toBe(true)
  })

  it('auto-closes after duration', async () => {
    message({ message: 'Will close', duration: 1000 })
    await nextTick()
    expect(document.querySelector('.zc-message')).not.toBeNull()

    // Advance past the auto-close timer
    vi.advanceTimersByTime(1000)
    await nextTick()
    // Advance past the transition + unmount delay (300ms)
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(document.querySelector('.zc-message')).toBeNull()
  })

  it('shows close button when showClose is true', async () => {
    message({ message: 'Closable', showClose: true })
    await nextTick()
    const closeBtn = document.querySelector('.zc-message__close')
    expect(closeBtn).not.toBeNull()
  })

  it('calls onClose callback when closed', async () => {
    const onClose = vi.fn()
    message({ message: 'Callback test', duration: 500, onClose })
    await nextTick()
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(onClose).toHaveBeenCalled()
  })

  it('closeAll closes all messages', async () => {
    message('Message 1')
    message('Message 2')
    await nextTick()
    expect(document.querySelectorAll('.zc-message').length).toBe(2)

    closeAllMessages()
    await nextTick()
    // Advance past the unmount delay
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(document.querySelectorAll('.zc-message').length).toBe(0)
  })

  it('returns instance with close method', () => {
    const instance = message({ message: 'Instance test', duration: 0 })
    expect(typeof instance.close).toBe('function')
  })

  it('does not auto-close when duration is 0', async () => {
    message({ message: 'Persistent', duration: 0 })
    await nextTick()
    vi.advanceTimersByTime(10000)
    expect(document.querySelector('.zc-message')).not.toBeNull()
  })

  it('manually closes a single message via instance.close()', async () => {
    const instance = message({ message: 'Will be manually closed', duration: 0 })
    await nextTick()
    expect(document.querySelector('.zc-message')).not.toBeNull()

    instance.close()
    await nextTick()
    // Advance past the unmount delay (300ms)
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(document.querySelector('.zc-message')).toBeNull()
  })
})
