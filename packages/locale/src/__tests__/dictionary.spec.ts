import { describe, it, expect } from 'vitest'
import { flatten } from '../dictionary'

describe('flatten', () => {
  it('flattens a nested object to dot-notation keys', () => {
    const input = {
      button: {
        confirm: '确定',
        cancel: '取消',
      },
      common: {
        loading: '加载中...',
      },
    }
    expect(flatten(input)).toEqual({
      'button.confirm': '确定',
      'button.cancel': '取消',
      'common.loading': '加载中...',
    })
  })

  it('handles already-flat keys (string values at top level)', () => {
    const input = {
      'common.ok': '确定',
      'common.save': '保存',
    }
    expect(flatten(input)).toEqual({
      'common.ok': '确定',
      'common.save': '保存',
    })
  })

  it('handles deeply nested objects (3+ levels)', () => {
    const input = {
      a: {
        b: {
          c: 'deep',
        },
      },
    }
    expect(flatten(input)).toEqual({ 'a.b.c': 'deep' })
  })

  it('handles empty object', () => {
    expect(flatten({})).toEqual({})
  })

  it('handles mixed flat and nested keys', () => {
    const input = {
      'flat.key': 'value',
      nested: {
        inner: 'value2',
      },
    }
    expect(flatten(input)).toEqual({
      'flat.key': 'value',
      'nested.inner': 'value2',
    })
  })
})
