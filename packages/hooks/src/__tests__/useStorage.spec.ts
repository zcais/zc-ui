import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useStorage, useLocalStorage, useSessionStorage } from '../useStorage'

describe('useStorage', () => {
  beforeEach(() => {
    localStorage.clear()
    sessionStorage.clear()
  })

  it('should read initial value when empty', () => {
    const data = useLocalStorage('test-key', 'default')
    expect(data.value).toBe('default')
  })

  it('should persist value to localStorage', async () => {
    const data = useLocalStorage('persist-key', 0)
    data.value = 42
    await nextTick()
    expect(JSON.parse(localStorage.getItem('persist-key')!)).toBe(42)
  })

  it('should read from localStorage on init', () => {
    localStorage.setItem('existing-key', JSON.stringify('stored'))
    const data = useLocalStorage('existing-key', 'default')
    expect(data.value).toBe('stored')
  })

  it('should handle objects', async () => {
    const data = useLocalStorage('obj-key', { a: 1, b: 'hello' })
    data.value.a = 99
    await nextTick()
    expect(JSON.parse(localStorage.getItem('obj-key')!).a).toBe(99)
  })

  it('should remove null values', async () => {
    const data = useLocalStorage<string | null>('nullable-key', 'init')
    data.value = null
    await nextTick()
    expect(localStorage.getItem('nullable-key')).toBeNull()
  })

  it('should support sessionStorage', async () => {
    const data = useSessionStorage('session-key', 'init')
    data.value = 'session-val'
    await nextTick()
    expect(JSON.parse(sessionStorage.getItem('session-key')!)).toBe('session-val')
  })

  it('should support custom serializer', async () => {
    const data = useStorage('custom-key', 123, localStorage, {
      serializer: {
        read: (raw) => parseInt(raw, 10),
        write: (val) => String(val),
      },
    })
    data.value = 456
    await nextTick()
    expect(localStorage.getItem('custom-key')).toBe('456')
  })
})
