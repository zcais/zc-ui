import { describe, it, expect } from 'vitest'
import {
  cssLayerOrder,
  cssLayerDeclaration,
  generateCssLayerSetup,
  wrapInLayer,
  createLayeredStyleSheet,
} from '../css-layers'

describe('CSS Layers', () => {
  describe('cssLayerOrder', () => {
    it('contains 5 layers in priority order', () => {
      expect(cssLayerOrder).toHaveLength(5)
      expect(cssLayerOrder[0]).toBe('zc-reset')
      expect(cssLayerOrder[4]).toBe('zc-overrides')
    })

    it('has components before overrides', () => {
      const compIdx = cssLayerOrder.indexOf('zc-components')
      const overrideIdx = cssLayerOrder.indexOf('zc-overrides')
      expect(compIdx).toBeLessThan(overrideIdx)
    })
  })

  describe('cssLayerDeclaration', () => {
    it('generates @layer statement', () => {
      expect(cssLayerDeclaration).toBe(
        '@layer zc-reset, zc-tokens, zc-base, zc-components, zc-overrides;',
      )
    })
  })

  describe('generateCssLayerSetup', () => {
    it('includes layer declaration and tokens layer', () => {
      const css = generateCssLayerSetup()
      expect(css).toContain('@layer')
      expect(css).toContain('zc-tokens')
    })
  })

  describe('wrapInLayer', () => {
    it('wraps CSS in a named layer', () => {
      const css = wrapInLayer('zc-overrides', '.btn { color: red; }')
      expect(css).toContain('@layer zc-overrides')
      expect(css).toContain('.btn { color: red; }')
    })
  })

  describe('createLayeredStyleSheet', () => {
    it('creates a layer declaration string', () => {
      const css = createLayeredStyleSheet()
      expect(css).toContain('@layer')
      expect(css.endsWith(';\n')).toBe(true)
    })

    it('supports custom layers', () => {
      const css = createLayeredStyleSheet(['a', 'b', 'c'])
      expect(css).toBe('@layer a, b, c;\n')
    })
  })
})
