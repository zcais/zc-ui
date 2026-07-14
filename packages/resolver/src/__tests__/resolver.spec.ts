import { describe, it, expect } from 'vitest'
import {
  ZcUiResolver,
  ZcUiResolverSSR,
  resolveZcComponent,
} from '../resolver'
import { componentMap } from '../component-map'

describe('ZcUiResolver', () => {
  const resolver = ZcUiResolver()

  describe('basic resolution', () => {
    it('should resolve ZcButton', () => {
      const result = resolver.resolve('ZcButton')
      expect(result).toEqual({
        type: undefined,
        name: 'ZcButton',
        from: '@zc-ui/components',
        sideEffects: ['@zc-ui/components/styles'],
      })
    })

    it('should resolve ZcInput', () => {
      const result = resolver.resolve('ZcInput')
      expect(result).toEqual({
        type: undefined,
        name: 'ZcInput',
        from: '@zc-ui/components',
        sideEffects: ['@zc-ui/components/styles'],
      })
    })

    it('should resolve ZcTable', () => {
      const result = resolver.resolve('ZcTable')
      expect(result).toEqual({
        type: undefined,
        name: 'ZcTable',
        from: '@zc-ui/components',
        sideEffects: ['@zc-ui/components/styles'],
      })
    })

    it('should resolve ZcDialog', () => {
      const result = resolver.resolve('ZcDialog')
      expect(result).toEqual({
        type: undefined,
        name: 'ZcDialog',
        from: '@zc-ui/components',
        sideEffects: ['@zc-ui/components/styles'],
      })
    })
  })

  describe('prefix handling', () => {
    it('should return null for non-Zc prefixed components', () => {
      expect(resolver.resolve('ElButton')).toBeNull()
      expect(resolver.resolve('MyButton')).toBeNull()
      expect(resolver.resolve('div')).toBeNull()
    })

    it('should support custom prefix', () => {
      const customResolver = ZcUiResolver({ prefix: 'UI' })
      expect(customResolver.resolve('UIButton')).not.toBeNull()
      expect(customResolver.resolve('ZcButton')).toBeNull()
    })
  })

  describe('unknown components', () => {
    it('should return null for unknown Zc components', () => {
      expect(resolver.resolve('ZcUnknown')).toBeNull()
      expect(resolver.resolve('ZcNonExistent')).toBeNull()
    })
  })

  describe('exclude option', () => {
    it('should exclude specified components', () => {
      const r = ZcUiResolver({ exclude: ['ZcButton'] })
      expect(r.resolve('ZcButton')).toBeNull()
      expect(r.resolve('ZcInput')).not.toBeNull()
    })

    it('should exclude multiple components', () => {
      const r = ZcUiResolver({ exclude: ['ZcButton', 'ZcInput', 'ZcSelect'] })
      expect(r.resolve('ZcButton')).toBeNull()
      expect(r.resolve('ZcInput')).toBeNull()
      expect(r.resolve('ZcSelect')).toBeNull()
      expect(r.resolve('ZcTag')).not.toBeNull()
    })
  })

  describe('include option', () => {
    it('should only resolve included components', () => {
      const r = ZcUiResolver({ include: ['ZcButton', 'ZcInput'] })
      expect(r.resolve('ZcButton')).not.toBeNull()
      expect(r.resolve('ZcInput')).not.toBeNull()
      expect(r.resolve('ZcTag')).toBeNull()
      expect(r.resolve('ZcTable')).toBeNull()
    })
  })

  describe('importStyle option', () => {
    it('should default to full style import', () => {
      const r = ZcUiResolver()
      const result = r.resolve('ZcButton')
      expect(result?.sideEffects).toEqual(['@zc-ui/components/styles'])
    })

    it('should support component-level CSS import', () => {
      const r = ZcUiResolver({ importStyle: 'component' })
      const result = r.resolve('ZcButton')
      expect(result?.sideEffects).toEqual([
        '@zc-ui/components/styles/button.css',
      ])
    })

    it('should support component-level CSS for nested components', () => {
      const r = ZcUiResolver({ importStyle: 'component' })
      const result = r.resolve('ZcFormItem')
      expect(result?.sideEffects).toEqual([
        '@zc-ui/components/styles/form.css',
      ])
    })

    it('should support disabling style import', () => {
      const r = ZcUiResolver({ importStyle: false })
      const result = r.resolve('ZcButton')
      expect(result?.sideEffects).toBeUndefined()
    })
  })

  describe('custom package name and style path', () => {
    it('should support custom package name', () => {
      const r = ZcUiResolver({ packageName: '@my-org/zc-ui' })
      const result = r.resolve('ZcButton')
      expect(result?.from).toBe('@my-org/zc-ui')
    })

    it('should support custom style path', () => {
      const r = ZcUiResolver({ stylePath: '@my-org/zc-ui/dist/styles' })
      const result = r.resolve('ZcButton')
      expect(result?.sideEffects).toEqual(['@my-org/zc-ui/dist/styles'])
    })

    it('should support custom style path with component CSS', () => {
      const r = ZcUiResolver({
        importStyle: 'component',
        stylePath: 'custom-styles',
      })
      const result = r.resolve('ZcTag')
      expect(result?.sideEffects).toEqual(['custom-styles/tag.css'])
    })
  })

  describe('SSR mode', () => {
    it('should create SSR resolver', () => {
      const r = ZcUiResolverSSR()
      const result = r.resolve('ZcButton')
      expect(result).not.toBeNull()
      expect(result?.name).toBe('ZcButton')
      expect(result?.from).toBe('@zc-ui/components')
    })

    it('should accept additional options', () => {
      const r = ZcUiResolverSSR({ importStyle: false })
      const result = r.resolve('ZcButton')
      expect(result?.sideEffects).toBeUndefined()
    })

    it('should have type component', () => {
      const r = ZcUiResolver()
      expect(r.type).toBe('component')
    })
  })

  describe('resolveZcComponent standalone function', () => {
    it('should resolve directly without wrapper', () => {
      const result = resolveZcComponent('ZcButton')
      expect(result).toEqual({
        name: 'ZcButton',
        from: '@zc-ui/components',
        sideEffects: ['@zc-ui/components/styles'],
      })
    })

    it('should return null for unknown component', () => {
      expect(resolveZcComponent('Unknown')).toBeNull()
    })
  })

  describe('component map completeness', () => {
    it('should have all major components', () => {
      const expected = [
        'ZcButton',
        'ZcInput',
        'ZcSelect',
        'ZcTable',
        'ZcDialog',
        'ZcForm',
        'ZcFormItem',
        'ZcPagination',
        'ZcTag',
        'ZcBadge',
        'ZcTooltip',
        'ZcCheckbox',
        'ZcCheckboxGroup',
        'ZcRadio',
        'ZcRadioGroup',
        'ZcSwitch',
        'ZcDatePicker',
        'ZcMenu',
        'ZcMenuItem',
        'ZcTabs',
        'ZcTabPane',
      ]
      for (const name of expected) {
        expect(componentMap[name], `Missing ${name}`).toBeDefined()
      }
    })

    it('should resolve all entries in the component map', () => {
      for (const name of Object.keys(componentMap)) {
        const result = resolver.resolve(name)
        expect(result, `Failed to resolve ${name}`).not.toBeNull()
        expect(result?.name).toBe(name)
      }
    })
  })

  describe('edge cases', () => {
    it('should handle empty string', () => {
      expect(resolver.resolve('')).toBeNull()
    })

    it('should handle just the prefix', () => {
      expect(resolver.resolve('Zc')).toBeNull()
    })

    it('should handle case sensitivity', () => {
      expect(resolver.resolve('zcbutton')).toBeNull()
      expect(resolver.resolve('ZCBUTTON')).toBeNull()
    })
  })
})
