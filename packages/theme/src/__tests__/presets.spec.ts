import { describe, it, expect } from 'vitest'
import {
  lightTheme,
  darkTheme,
  createTheme,
  mergeThemes,
  getComponentOverrides,
  themeToCssText,
componentShorthandToCssVars,
} from '../presets'
import type { ThemePreset } from '../presets'

describe('Theme Presets', () => {
  describe('lightTheme', () => {
    it('has correct name and mode', () => {
      expect(lightTheme.name).toBe('light')
      expect(lightTheme.mode).toBe('light')
    })

    it('contains primary color variables', () => {
      expect(lightTheme.variables['--color-zc-primary-500']).toBeTruthy()
    })

    it('contains semantic tokens (text, border)', () => {
      expect(lightTheme.variables['--color-zc-text-primary']).toBeTruthy()
      expect(lightTheme.variables['--color-zc-border-base']).toBeTruthy()
    })

    it('contains design tokens (spacing, radius)', () => {
      expect(lightTheme.variables['--spacing-zc-xs']).toBeTruthy()
      expect(lightTheme.variables['--radius-zc-base']).toBeTruthy()
    })

    it('has light background color', () => {
      expect(lightTheme.variables['--color-zc-bg-base']).toBe('#ffffff')
    })
  })

  describe('darkTheme', () => {
    it('has correct name and mode', () => {
      expect(darkTheme.name).toBe('dark')
      expect(darkTheme.mode).toBe('dark')
    })

    it('contains primary color variables', () => {
      expect(darkTheme.variables['--color-zc-primary-500']).toBeTruthy()
    })

    it('has dark background color', () => {
      expect(darkTheme.variables['--color-zc-bg-base']).toBe('#1d1d1d')
    })

    it('has dark text colors', () => {
      const text = darkTheme.variables['--color-zc-text-primary']
      expect(text).toBeTruthy()
      // Should be a light color for dark mode
      expect(text).not.toBe('#303133') // not the light mode value
    })
  })

  describe('createTheme', () => {
    it('creates a theme with default name', () => {
      const theme = createTheme()
      expect(theme.name).toBe('custom')
      expect(theme.mode).toBe('light')
    })

    it('creates a theme with custom name', () => {
      const theme = createTheme({ name: 'brand' })
      expect(theme.name).toBe('brand')
    })

    it('creates a dark theme', () => {
      const theme = createTheme({ mode: 'dark' })
      expect(theme.mode).toBe('dark')
    })

    it('generates brand color scales', () => {
      const theme = createTheme({
        brandColors: { primary: '#722ed1' },
      })
      expect(theme.variables['--color-zc-primary-500']).toBe('#722ed1')
      expect(theme.variables['--color-zc-primary-100']).toBeTruthy()
      expect(theme.variables['--color-zc-primary-900']).toBeTruthy()
    })

    it('merges custom variables', () => {
      const theme = createTheme({
        variables: {
          '--color-zc-primary-500': '#ff0000',
          '--custom-var': 'test',
        },
      })
      expect(theme.variables['--color-zc-primary-500']).toBe('#ff0000')
      expect(theme.variables['--custom-var']).toBe('test')
    })

    it('supports component overrides', () => {
      const theme = createTheme({
        componentOverrides: {
          Button: { '--zc-button-border-radius': '8px' },
          Input: { '--zc-input-border-color': '#ccc' },
        },
      })
      expect(theme.componentOverrides?.Button['--zc-button-border-radius']).toBe('8px')
      expect(theme.componentOverrides?.Input['--zc-input-border-color']).toBe('#ccc')
    })

    it('supports components shorthand with camelCase keys', () => {
      const theme = createTheme({
        components: {
          button: { bgColor: 'red', textColor: '#fff' },
          input: { borderColor: '#d9d9d9', focusBorderColor: '#722ed1' },
        },
      })
      expect(theme.componentOverrides?.button['--zc-button-bg-color']).toBe('red')
      expect(theme.componentOverrides?.button['--zc-button-text-color']).toBe('#fff')
      expect(theme.componentOverrides?.input['--zc-input-border-color']).toBe('#d9d9d9')
      expect(theme.componentOverrides?.input['--zc-input-focus-border-color']).toBe('#722ed1')
    })

    it('components shorthand and componentOverrides merge together', () => {
      const theme = createTheme({
        componentOverrides: {
          Button: { '--zc-button-font-weight': '600' },
        },
        components: {
          button: { bgColor: 'blue' },
        },
      })
      expect(theme.componentOverrides?.Button['--zc-button-font-weight']).toBe('600')
      expect(theme.componentOverrides?.button['--zc-button-bg-color']).toBe('blue')
    })

    it('components shorthand handles PascalCase component names', () => {
      const theme = createTheme({
        components: {
          FormItem: { labelColor: '#333' },
        },
      })
      expect(theme.componentOverrides?.FormItem['--zc-form-item-label-color']).toBe('#333')
    })

    it('components shorthand preserves keys already starting with --', () => {
      const theme = createTheme({
        components: {
          button: {
            bgColor: 'red',
            '--zc-button-custom-var': '20px',
          },
        },
      })
      expect(theme.componentOverrides?.button['--zc-button-bg-color']).toBe('red')
      expect(theme.componentOverrides?.button['--zc-button-custom-var']).toBe('20px')
    })

    it('extends an existing theme', () => {
      const custom = createTheme({
        extends: darkTheme,
        name: 'custom-dark',
        variables: { '--color-zc-primary-500': '#ff0000' },
      })
      expect(custom.mode).toBe('dark')
      expect(custom.variables['--color-zc-primary-500']).toBe('#ff0000')
      // Should also retain dark theme's background
      expect(custom.variables['--color-zc-bg-base']).toBe('#1d1d1d')
    })
  })

  describe('mergeThemes', () => {
    it('merges two themes (later wins)', () => {
      const merged = mergeThemes(lightTheme, darkTheme)
      expect(merged.mode).toBe('dark')
      // Dark background should win
      expect(merged.variables['--color-zc-bg-base']).toBe('#1d1d1d')
    })

    it('merges multiple themes', () => {
      const custom: ThemePreset = {
        name: 'custom',
        mode: 'light',
        variables: {
          '--color-zc-primary-500': '#ff0000',
          '--custom': 'value',
        },
      }
      const merged = mergeThemes(lightTheme, custom)
      expect(merged.variables['--color-zc-primary-500']).toBe('#ff0000')
      expect(merged.variables['--custom']).toBe('value')
    })

    it('merges component overrides', () => {
      const t1: ThemePreset = {
        name: 't1',
        mode: 'light',
        variables: {},
        componentOverrides: {
          Button: { '--zc-button-bg': '#fff', '--zc-button-color': '#333' },
        },
      }
      const t2: ThemePreset = {
        name: 't2',
        mode: 'light',
        variables: {},
        componentOverrides: {
          Button: { '--zc-button-bg': '#f00' },
          Input: { '--zc-input-bg': '#eee' },
        },
      }
      const merged = mergeThemes(t1, t2)
      expect(merged.componentOverrides?.Button['--zc-button-bg']).toBe('#f00')
      expect(merged.componentOverrides?.Button['--zc-button-color']).toBe('#333')
      expect(merged.componentOverrides?.Input['--zc-input-bg']).toBe('#eee')
    })

    it('returns default theme for empty input', () => {
      const merged = mergeThemes()
      expect(merged).toBeDefined()
      expect(merged.variables['--color-zc-primary-500']).toBeTruthy()
    })
  })

  describe('getComponentOverrides', () => {
    it('returns overrides for a component', () => {
      const theme = createTheme({
        componentOverrides: {
          Button: { '--zc-button-radius': '8px' },
        },
      })
      const overrides = getComponentOverrides(theme, 'Button')
      expect(overrides['--zc-button-radius']).toBe('8px')
    })

    it('returns empty object for unknown component', () => {
      const theme = createTheme()
      const overrides = getComponentOverrides(theme, 'Nonexistent')
      expect(Object.keys(overrides)).toHaveLength(0)
    })
  })

  describe('themeToCssText', () => {
    it('generates CSS text', () => {
      const theme = createTheme({
        variables: { '--test-var': '#fff' },
      })
      const css = themeToCssText(theme)
      expect(css).toContain(':root')
      expect(css).toContain('--test-var: #fff')
    })

    it('supports custom selector', () => {
      const theme = createTheme()
      const css = themeToCssText(theme, '.my-app')
      expect(css).toContain('.my-app')
    })
  })

  describe('componentShorthandToCssVars', () => {
    it('converts simple camelCase to --zc-{component}-{kebab}', () => {
      const result = componentShorthandToCssVars('button', { bgColor: 'red' })
      expect(result['--zc-button-bg-color']).toBe('red')
    })

    it('converts multi-word camelCase', () => {
      const result = componentShorthandToCssVars('input', {
        focusBorderColor: '#409eff',
        placeholderColor: '#ccc',
      })
      expect(result['--zc-input-focus-border-color']).toBe('#409eff')
      expect(result['--zc-input-placeholder-color']).toBe('#ccc')
    })

    it('handles PascalCase component names', () => {
      const result = componentShorthandToCssVars('FormItem', { labelColor: '#333' })
      expect(result['--zc-form-item-label-color']).toBe('#333')
    })

    it('handles lowercase component names', () => {
      const result = componentShorthandToCssVars('tag', { textColor: '#409eff' })
      expect(result['--zc-tag-text-color']).toBe('#409eff')
    })

    it('preserves keys that already start with --', () => {
      const result = componentShorthandToCssVars('button', {
        '--zc-button-custom': '10px',
        bgColor: 'red',
      })
      expect(result['--zc-button-custom']).toBe('10px')
      expect(result['--zc-button-bg-color']).toBe('red')
    })

    it('returns empty object for empty input', () => {
      const result = componentShorthandToCssVars('button', {})
      expect(Object.keys(result)).toHaveLength(0)
    })

    it('handles numeric-like values', () => {
      const result = componentShorthandToCssVars('pagination', {
        buttonSize: '32px',
        itemGap: '4px',
      })
      expect(result['--zc-pagination-button-size']).toBe('32px')
      expect(result['--zc-pagination-item-gap']).toBe('4px')
    })
  })
})
