import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { useDark, useColorMode } from '../useDark'

describe('useDark', () => {
  it('should return isDark and toggle', async () => {
    localStorage.clear()
    const { isDark, toggle } = useDark()
    expect(typeof isDark.value).toBe('boolean')
    const prev = isDark.value
    toggle()
    await nextTick()
    expect(isDark.value).toBe(!prev)
  })

  it('should apply dark class to html element', async () => {
    localStorage.clear()
    document.documentElement.setAttribute('class', '')
    const { isDark } = useDark()
    isDark.value = true
    await nextTick()
    expect(document.documentElement.getAttribute('class')).toContain('dark')
    isDark.value = false
    await nextTick()
    expect(document.documentElement.getAttribute('class')).not.toContain('dark')
  })
})

describe('useColorMode', () => {
  it('should return mode and isDark', () => {
    localStorage.clear()
    const { mode, isDark, system } = useColorMode()
    expect(typeof mode.value).toBe('string')
    expect(typeof isDark.value).toBe('boolean')
    expect(['light', 'dark']).toContain(system.value)
  })

  it('should apply data-theme attribute', async () => {
    localStorage.clear()
    const { mode } = useColorMode()
    mode.value = 'dark'
    await nextTick()
    expect(document.documentElement.getAttribute('data-theme')).toBe('dark')
    mode.value = 'light'
    await nextTick()
    expect(document.documentElement.getAttribute('data-theme')).toBe('light')
  })

  it('should support custom attribute', async () => {
    localStorage.clear()
    const { mode } = useColorMode({ attribute: 'data-color-scheme' })
    mode.value = 'dark'
    await nextTick()
    expect(document.documentElement.getAttribute('data-color-scheme')).toBe('dark')
  })
})
