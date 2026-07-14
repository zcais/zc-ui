import { describe, it, expect } from 'vitest'
import { useToggle, useNamespace } from '../index'

describe('useToggle', () => {
  it('initializes with default false', () => {
    const { value } = useToggle()
    expect(value.value).toBe(false)
  })

  it('initializes with provided value', () => {
    const { value } = useToggle(true)
    expect(value.value).toBe(true)
  })

  it('toggle flips the value', () => {
    const { value, toggle } = useToggle(false)
    toggle()
    expect(value.value).toBe(true)
    toggle()
    expect(value.value).toBe(false)
  })

  it('set explicitly sets the value', () => {
    const { value, set } = useToggle(false)
    set(true)
    expect(value.value).toBe(true)
    set(false)
    expect(value.value).toBe(false)
  })
})

describe('useNamespace', () => {
  const ns = useNamespace('button')

  it('b() returns block class', () => {
    expect(ns.b()).toBe('zc-button')
  })

  it('e() returns element class', () => {
    expect(ns.e('icon')).toBe('zc-button__icon')
  })

  it('e() with empty string returns empty', () => {
    expect(ns.e('')).toBe('')
  })

  it('m() returns modifier class', () => {
    expect(ns.m('primary')).toBe('zc-button--primary')
  })

  it('m() with empty string returns empty', () => {
    expect(ns.m('')).toBe('')
  })

  it('em() returns element-modifier class', () => {
    expect(ns.em('icon', 'left')).toBe('zc-button__icon--left')
  })

  it('em() with empty params returns empty', () => {
    expect(ns.em('', 'left')).toBe('')
    expect(ns.em('icon', '')).toBe('')
  })

  it('bm() returns block + modifier pair', () => {
    expect(ns.bm('primary')).toBe('zc-button zc-button--primary')
  })

  it('bm() with empty string returns just block', () => {
    expect(ns.bm('')).toBe('zc-button')
  })

  it('is() returns state class when true', () => {
    expect(ns.is('disabled')).toBe('is-disabled')
    expect(ns.is('loading', true)).toBe('is-loading')
  })

  it('is() returns empty when false', () => {
    expect(ns.is('disabled', false)).toBe('')
  })
})
