import { describe, it, expect, beforeEach } from 'vitest'
import {
  createNamespace,
  applyNamespace,
  removeNamespace,
  namespaceToCssText,
  createVarResolver,
} from '../namespace'
import { lightTheme } from '../presets'

describe('CSS Variable Namespace', () => {
  describe('createNamespace', () => {
    it('creates a namespace with brand colors', () => {
      const ns = createNamespace('brand-a', {
        brandColors: { primary: '#722ed1' },
      })
      expect(ns.name).toBe('brand-a')
      expect(ns.variables['--color-brand-a-primary-500']).toBe('#722ed1')
      expect(ns.variables['--color-brand-a-primary-100']).toBeTruthy()
      expect(ns.variables['--color-brand-a-primary-900']).toBeTruthy()
    })

    it('includes custom variables', () => {
      const ns = createNamespace('test', {
        variables: { '--custom-var': '16px' },
      })
      expect(ns.variables['--custom-var']).toBe('16px')
    })

    it('remaps preset variables to new prefix', () => {
      const ns = createNamespace('remap', {
        preset: lightTheme,
      })
      // Should have remapped variables from --color-zc-* to --color-remap-*
      expect(ns.variables['--color-remap-primary-500']).toBeTruthy()
    })
  })

  describe('applyNamespace / removeNamespace', () => {
    let el: HTMLElement

    beforeEach(() => {
      el = document.createElement('div')
      document.body.appendChild(el)
    })

    it('applies namespace variables to an element', () => {
      const ns = createNamespace('test', {
        variables: { '--color-test-custom': '#ff0000' },
      })
      applyNamespace(el, ns)
      expect(el.style.getPropertyValue('--color-test-custom')).toBe('#ff0000')
    })

    it('removes namespace variables from an element', () => {
      const ns = createNamespace('test', {
        variables: { '--color-test-custom': '#ff0000' },
      })
      applyNamespace(el, ns)
      removeNamespace(el, ns)
      expect(el.style.getPropertyValue('--color-test-custom')).toBe('')
    })
  })

  describe('namespaceToCssText', () => {
    it('generates CSS text', () => {
      const ns = createNamespace('demo', {
        variables: { '--color-demo-primary-500': '#722ed1' },
      })
      const css = namespaceToCssText(ns, '.demo-section')
      expect(css).toContain('.demo-section')
      expect(css).toContain('--color-demo-primary-500: #722ed1')
    })
  })

  describe('createVarResolver', () => {
    it('resolves ZC variable names to namespaced names', () => {
      const resolve = createVarResolver('brand-a')
      expect(resolve('--color-zc-primary-500')).toBe('--color-brand-a-primary-500')
    })

    it('passes through non-ZC variable names', () => {
      const resolve = createVarResolver('brand-a')
      expect(resolve('--custom-var')).toBe('--custom-var')
    })
  })
})
