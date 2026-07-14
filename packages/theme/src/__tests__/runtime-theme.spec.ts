import { describe, it, expect, beforeEach } from 'vitest'
import {
  applyTheme,
  setBrandColor,
  setBrandColors,
  setThemeVariable,
  removeThemeVariable,
  applyDarkMode,
  clearThemeOverrides,
  applyComponentOverrides,
  removeComponentOverrides,
  registerTheme,
  unregisterTheme,
  getRegisteredTheme,
  listRegisteredThemes,
  switchTheme,
  getCurrentThemeName,
  createThemeController,
} from '../runtime-theme'
import { lightTheme, darkTheme, createTheme } from '../presets'

describe('Runtime Theme API', () => {
  let target: HTMLElement

  beforeEach(() => {
    target = document.createElement('div')
    document.body.appendChild(target)
  })

  // ---- applyTheme ----
  describe('applyTheme', () => {
    it('applies theme variables to target element', () => {
      const theme = createTheme({
        variables: { '--test-color': '#ff0000' },
      })
      applyTheme(theme, { target })
      expect(target.style.getPropertyValue('--test-color')).toBe('#ff0000')
    })

    it('applies dark mode class for dark theme', () => {
      applyTheme(darkTheme, { target })
      expect(target.classList.contains('dark')).toBe(true)
    })

    it('removes dark mode class for light theme', () => {
      target.classList.add('dark')
      applyTheme(lightTheme, { target })
      expect(target.classList.contains('dark')).toBe(false)
    })

    it('applies component overrides as CSS variables', () => {
      const theme = createTheme({
        componentOverrides: {
          Button: { '--zc-button-radius': '8px' },
        },
      })
      applyTheme(theme, { target })
      expect(target.style.getPropertyValue('--zc-button-radius')).toBe('8px')
    })
  })

  // ---- setBrandColor ----
  describe('setBrandColor', () => {
    it('generates full color scale for a brand color', () => {
      setBrandColor('primary', '#722ed1', { target })
      expect(target.style.getPropertyValue('--color-zc-primary-500')).toBe('#722ed1')
      expect(target.style.getPropertyValue('--color-zc-primary-100')).toBeTruthy()
      expect(target.style.getPropertyValue('--color-zc-primary-900')).toBeTruthy()
    })

    it('works for other semantic colors', () => {
      setBrandColor('danger', '#ff4d4f', { target })
      expect(target.style.getPropertyValue('--color-zc-danger-500')).toBe('#ff4d4f')
    })
  })

  // ---- setBrandColors ----
  describe('setBrandColors', () => {
    it('sets multiple brand colors', () => {
      setBrandColors(
        { primary: '#722ed1', danger: '#ff4d4f' },
        { target },
      )
      expect(target.style.getPropertyValue('--color-zc-primary-500')).toBe('#722ed1')
      expect(target.style.getPropertyValue('--color-zc-danger-500')).toBe('#ff4d4f')
    })
  })

  // ---- setThemeVariable / removeThemeVariable ----
  describe('setThemeVariable', () => {
    it('sets a single CSS variable', () => {
      setThemeVariable('--my-var', '20px', { target })
      expect(target.style.getPropertyValue('--my-var')).toBe('20px')
    })
  })

  describe('removeThemeVariable', () => {
    it('removes a CSS variable', () => {
      setThemeVariable('--my-var', '20px', { target })
      removeThemeVariable('--my-var', { target })
      expect(target.style.getPropertyValue('--my-var')).toBe('')
    })
  })

  // ---- applyDarkMode ----
  describe('applyDarkMode', () => {
    it('adds dark class when isDark=true', () => {
      applyDarkMode(true, target)
      expect(target.classList.contains('dark')).toBe(true)
    })

    it('removes dark class when isDark=false', () => {
      target.classList.add('dark')
      applyDarkMode(false, target)
      expect(target.classList.contains('dark')).toBe(false)
    })
  })

  // ---- clearThemeOverrides ----
  describe('clearThemeOverrides', () => {
    it('removes all --color-zc-* variables', () => {
      setBrandColor('primary', '#722ed1', { target })
      expect(target.style.getPropertyValue('--color-zc-primary-500')).toBeTruthy()
      clearThemeOverrides({ target })
      expect(target.style.getPropertyValue('--color-zc-primary-500')).toBe('')
    })
  })

  // ---- applyComponentOverrides / removeComponentOverrides ----
  describe('applyComponentOverrides', () => {
    it('applies overrides to an element', () => {
      applyComponentOverrides(target, 'Button', {
        '--zc-button-radius': '8px',
        '--zc-button-weight': '600',
      })
      expect(target.style.getPropertyValue('--zc-button-radius')).toBe('8px')
      expect(target.style.getPropertyValue('--zc-button-weight')).toBe('600')
      expect(target.hasAttribute('data-zc-theme-button')).toBe(true)
    })
  })

  describe('removeComponentOverrides', () => {
    it('removes overrides from an element', () => {
      applyComponentOverrides(target, 'Button', {
        '--zc-button-radius': '8px',
      })
      removeComponentOverrides(target, 'Button', {
        '--zc-button-radius': '8px',
      })
      expect(target.style.getPropertyValue('--zc-button-radius')).toBe('')
      expect(target.hasAttribute('data-zc-theme-button')).toBe(false)
    })
  })

  // ---- Theme registry ----
  describe('Theme registry', () => {
    const testTheme = createTheme({ name: 'test-registry' })

    beforeEach(() => {
      unregisterTheme('test-registry')
      unregisterTheme('test-dark')
    })

    it('registerTheme stores a theme', () => {
      registerTheme('test-registry', testTheme)
      expect(getRegisteredTheme('test-registry')).toBe(testTheme)
    })

    it('listRegisteredThemes returns names', () => {
      registerTheme('test-registry', testTheme)
      expect(listRegisteredThemes()).toContain('test-registry')
    })

    it('unregisterTheme removes a theme', () => {
      registerTheme('test-registry', testTheme)
      unregisterTheme('test-registry')
      expect(getRegisteredTheme('test-registry')).toBeUndefined()
    })

    it('switchTheme applies a registered theme', () => {
      registerTheme('test-dark', darkTheme)
      switchTheme('test-dark', { target })
      expect(target.classList.contains('dark')).toBe(true)
      expect(getCurrentThemeName()).toBe('test-dark')
    })

    it('switchTheme throws for unregistered theme', () => {
      expect(() => switchTheme('nonexistent', { target })).toThrow()
    })
  })

  // ---- createThemeController ----
  describe('createThemeController', () => {
    it('creates a controller that applies themes', () => {
      const controller = createThemeController({ target })
      controller.apply(createTheme({
        variables: { '--ctrl-test': '#abc' },
      }))
      expect(target.style.getPropertyValue('--ctrl-test')).toBe('#abc')
    })

    it('controller.setBrandColor works', () => {
      const controller = createThemeController({ target })
      controller.setBrandColor('primary', '#722ed1')
      expect(target.style.getPropertyValue('--color-zc-primary-500')).toBe('#722ed1')
    })

    it('controller.toggleDark works', () => {
      const controller = createThemeController({ target })
      const result = controller.toggleDark()
      expect(result).toBe(true)
      expect(target.classList.contains('dark')).toBe(true)
    })

    it('controller.clear removes overrides', () => {
      const controller = createThemeController({ target })
      controller.setBrandColor('primary', '#722ed1')
      controller.clear()
      expect(target.style.getPropertyValue('--color-zc-primary-500')).toBe('')
    })
  })
})
