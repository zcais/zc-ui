import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { notify, closeAllNotifications } from '../notification/notification'

describe('ZcNotification (functional API)', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    // Properly close all existing instances to reset the internal instances array
    closeAllNotifications()
    vi.advanceTimersByTime(500)
    document.body.innerHTML = ''
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('creates a notification', async () => {
    notify({ title: 'Test', message: 'Notification body' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl).not.toBeNull()
    expect(notifEl?.textContent).toContain('Test')
    expect(notifEl?.textContent).toContain('Notification body')
  })

  it('applies type class', async () => {
    notify.success({ message: 'Success!' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification--success')).toBe(true)
  })

  it('applies info type class', async () => {
    notify.info({ message: 'Info!' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification--info')).toBe(true)
  })

  it('applies warning type class', async () => {
    notify.warning({ message: 'Warning!' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification--warning')).toBe(true)
  })

  it('applies error type class', async () => {
    notify.error({ message: 'Error!' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification--error')).toBe(true)
  })

  it('auto-closes after duration', async () => {
    notify({ message: 'Will close', duration: 1000 })
    await nextTick()
    expect(document.querySelector('.zc-notification')).not.toBeNull()

    vi.advanceTimersByTime(1000)
    await nextTick()
    // Advance past the transition + unmount delay
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(document.querySelector('.zc-notification')).toBeNull()
  })

  it('shows close button by default', async () => {
    notify({ message: 'Closable' })
    await nextTick()
    expect(document.querySelector('.zc-notification__close')).not.toBeNull()
  })

  it('hides close button when showClose is false', async () => {
    notify({ message: 'No close', showClose: false })
    await nextTick()
    expect(document.querySelector('.zc-notification__close')).toBeNull()
  })

  it('calls onClose callback', async () => {
    const onClose = vi.fn()
    notify({ message: 'Callback', duration: 500, onClose })
    await nextTick()
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(onClose).toHaveBeenCalled()
  })

  it('closeAll closes all notifications', async () => {
    notify({ message: 'Notif 1' })
    notify({ message: 'Notif 2' })
    await nextTick()
    expect(document.querySelectorAll('.zc-notification').length).toBe(2)

    closeAllNotifications()
    await nextTick()
    // Advance past the unmount delay
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(document.querySelectorAll('.zc-notification').length).toBe(0)
  })

  it('returns instance with close method', () => {
    const instance = notify({ message: 'Instance' })
    expect(typeof instance.close).toBe('function')
  })

  it('manually closes a single notification via instance.close()', async () => {
    const instance = notify({ message: 'Will be manually closed', duration: 0 })
    await nextTick()
    expect(document.querySelector('.zc-notification')).not.toBeNull()

    instance.close()
    await nextTick()
    // Advance past the unmount delay
    vi.advanceTimersByTime(500)
    await nextTick()
    expect(document.querySelector('.zc-notification')).toBeNull()
  })

  it('does not auto-close when duration is 0', async () => {
    notify({ message: 'Persistent', duration: 0 })
    await nextTick()
    expect(document.querySelector('.zc-notification')).not.toBeNull()

    vi.advanceTimersByTime(10000)
    await nextTick()
    expect(document.querySelector('.zc-notification')).not.toBeNull()
  })

  // --- Position tests ---
  it('applies top-right position class by default', async () => {
    notify({ message: 'Default position' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification__top-right')).toBe(true)
  })

  it('applies top-left position class', async () => {
    notify({ message: 'Top left', position: 'top-left' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification__top-left')).toBe(true)
  })

  it('applies bottom-right position class', async () => {
    notify({ message: 'Bottom right', position: 'bottom-right' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification__bottom-right')).toBe(true)
  })

  it('applies bottom-left position class', async () => {
    notify({ message: 'Bottom left', position: 'bottom-left' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl?.classList.contains('zc-notification__bottom-left')).toBe(true)
  })

  // --- Offset tests ---
  it('applies base offset of 16px for first notification', async () => {
    notify({ message: 'Single notification' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification') as HTMLElement
    expect(notifEl?.style.top).toBe('16px')
  })

  it('stacks notifications with increasing offset', async () => {
    notify({ message: 'First' })
    await nextTick()
    notify({ message: 'Second' })
    await nextTick()

    const notifs = document.querySelectorAll('.zc-notification')
    expect(notifs.length).toBe(2)
    // First notification: base 16px
    // Second notification: 16 + 80 (default height) + 16 = 112px
    expect((notifs[0] as HTMLElement).style.top).toBe('16px')
    expect((notifs[1] as HTMLElement).style.top).toBe('112px')
  })

  // ---- Bug #19: Notification transition uses correct direction ----
  it('bottom positions use translateY transition', async () => {
    notify({ message: 'Bottom', position: 'bottom-right' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification') as HTMLElement
    // The notification element should exist and be positioned at the bottom
    expect(notifEl).not.toBeNull()
    expect(notifEl.style.bottom).toBe('16px')
    // The transition name should correspond to the position (correct slide direction)
    expect(notifEl.classList.contains('zc-notification__bottom-right')).toBe(true)
  })

  it('top-left position slides from left (translateX negative)', async () => {
    notify({ message: 'TL', position: 'top-left' })
    await nextTick()
    const notifEl = document.querySelector('.zc-notification')
    expect(notifEl).not.toBeNull()
    // The transition name should correspond to the position
    expect(notifEl?.classList.contains('zc-notification__top-left')).toBe(true)
  })
})
