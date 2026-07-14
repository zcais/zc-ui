import { describe, it, expect } from 'vitest'
import {
  isClient,
  isDefined,
  isString,
  isNumber,
  isBoolean,
  isObject,
  isFunction,
  getType,
  guid,
  uniqueId,
  clamp,
  isEmpty,
  deepMerge,
} from '../index'

describe('isClient', () => {
  it('should be true in jsdom environment', () => {
    expect(isClient).toBe(true)
  })
})

describe('isDefined', () => {
  it('returns true for defined values', () => {
    expect(isDefined(0)).toBe(true)
    expect(isDefined('')).toBe(true)
    expect(isDefined(false)).toBe(true)
    expect(isDefined({})).toBe(true)
  })

  it('returns false for null and undefined', () => {
    expect(isDefined(null)).toBe(false)
    expect(isDefined(undefined)).toBe(false)
  })
})

describe('isString', () => {
  it('returns true for strings', () => {
    expect(isString('hello')).toBe(true)
    expect(isString('')).toBe(true)
  })

  it('returns false for non-strings', () => {
    expect(isString(123)).toBe(false)
    expect(isString(null)).toBe(false)
    expect(isString(undefined)).toBe(false)
    expect(isString({})).toBe(false)
  })
})

describe('isNumber', () => {
  it('returns true for valid numbers', () => {
    expect(isNumber(0)).toBe(true)
    expect(isNumber(-1)).toBe(true)
    expect(isNumber(3.14)).toBe(true)
  })

  it('returns false for NaN', () => {
    expect(isNumber(NaN)).toBe(false)
  })

  it('returns false for non-numbers', () => {
    expect(isNumber('123')).toBe(false)
    expect(isNumber(null)).toBe(false)
    expect(isNumber(undefined)).toBe(false)
  })
})

describe('isBoolean', () => {
  it('returns true for booleans', () => {
    expect(isBoolean(true)).toBe(true)
    expect(isBoolean(false)).toBe(true)
  })

  it('returns false for non-booleans', () => {
    expect(isBoolean(0)).toBe(false)
    expect(isBoolean('true')).toBe(false)
    expect(isBoolean(null)).toBe(false)
  })
})

describe('isObject', () => {
  it('returns true for plain objects', () => {
    expect(isObject({})).toBe(true)
    expect(isObject({ a: 1 })).toBe(true)
  })

  it('returns false for arrays', () => {
    expect(isObject([])).toBe(false)
  })

  it('returns false for null', () => {
    expect(isObject(null)).toBe(false)
  })

  it('returns false for primitives', () => {
    expect(isObject(42)).toBe(false)
    expect(isObject('str')).toBe(false)
    expect(isObject(true)).toBe(false)
  })
})

describe('isFunction', () => {
  it('returns true for functions', () => {
    expect(isFunction(() => {})).toBe(true)
    expect(isFunction(Math.max)).toBe(true)
    expect(isFunction(class Foo {})).toBe(true)
  })

  it('returns false for non-functions', () => {
    expect(isFunction(123)).toBe(false)
    expect(isFunction('str')).toBe(false)
    expect(isFunction(null)).toBe(false)
  })
})

describe('getType', () => {
  it('returns correct type for primitives', () => {
    expect(getType(123)).toBe('number')
    expect(getType('str')).toBe('string')
    expect(getType(true)).toBe('boolean')
    expect(getType(undefined)).toBe('undefined')
    expect(getType(null)).toBe('null')
  })

  it('returns correct type for objects', () => {
    expect(getType({})).toBe('object')
    expect(getType([])).toBe('array')
    expect(getType(() => {})).toBe('function')
    expect(getType(Symbol())).toBe('symbol')
  })
})

describe('guid', () => {
  it('generates a valid UUID-like string', () => {
    const id = guid()
    // UUID v4 format: 8-4-4-4-12
    expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/)
  })

  it('generates unique values', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(guid())
    }
    expect(ids.size).toBe(100)
  })
})

describe('uniqueId', () => {
  it('generates an ID with default prefix', () => {
    const id = uniqueId()
    expect(id).toMatch(/^zc-[a-z0-9]+$/)
  })

  it('generates an ID with custom prefix', () => {
    const id = uniqueId('el')
    expect(id.startsWith('el-')).toBe(true)
  })

  it('generates unique IDs', () => {
    const ids = new Set<string>()
    for (let i = 0; i < 100; i++) {
      ids.add(uniqueId())
    }
    expect(ids.size).toBe(100)
  })
})

describe('clamp', () => {
  it('clamps value within range', () => {
    expect(clamp(5, 1, 10)).toBe(5)
  })

  it('clamps to minimum', () => {
    expect(clamp(-5, 1, 10)).toBe(1)
  })

  it('clamps to maximum', () => {
    expect(clamp(50, 1, 10)).toBe(10)
  })
})

describe('isEmpty', () => {
  it('returns true for null and undefined', () => {
    expect(isEmpty(null)).toBe(true)
    expect(isEmpty(undefined)).toBe(true)
  })

  it('returns true for empty strings, arrays, objects', () => {
    expect(isEmpty('')).toBe(true)
    expect(isEmpty([])).toBe(true)
    expect(isEmpty({})).toBe(true)
  })

  it('returns false for non-empty values', () => {
    expect(isEmpty('hello')).toBe(false)
    expect(isEmpty([1])).toBe(false)
    expect(isEmpty({ a: 1 })).toBe(false)
    expect(isEmpty(0)).toBe(false)
  })
})

describe('deepMerge', () => {
  it('merges simple objects', () => {
    const result = deepMerge({ a: 1 }, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })

  it('later sources override earlier', () => {
    const result = deepMerge({ a: 1 }, { a: 2 })
    expect(result.a).toBe(2)
  })

  it('deeply merges nested objects', () => {
    const result = deepMerge({ a: { x: 1, y: 2 } }, { a: { y: 3, z: 4 } })
    expect(result.a).toEqual({ x: 1, y: 3, z: 4 })
  })

  it('replaces arrays rather than merging', () => {
    const result = deepMerge({ a: [1, 2, 3] }, { a: [4] })
    expect(result.a).toEqual([4])
  })

  it('skips undefined and null sources', () => {
    const result = deepMerge({ a: 1 }, undefined, null, { b: 2 })
    expect(result).toEqual({ a: 1, b: 2 })
  })
})
