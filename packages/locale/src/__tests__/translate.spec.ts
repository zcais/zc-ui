import { describe, it, expect } from 'vitest'
import { interpolate } from '../translate'

describe('interpolate', () => {
  it('replaces a single named placeholder', () => {
    expect(interpolate('Hello, {name}!', { name: 'World' })).toBe('Hello, World!')
  })

  it('replaces multiple named placeholders', () => {
    expect(interpolate('{greeting}, {name}!', { greeting: 'Hi', name: 'Alice' })).toBe('Hi, Alice!')
  })

  it('supports numeric values', () => {
    expect(interpolate('Count: {n}', { n: 42 })).toBe('Count: 42')
  })

  it('leaves unprovided placeholders as-is', () => {
    expect(interpolate('Hello, {name}!', {})).toBe('Hello, {name}!')
  })

  it('returns the template unchanged when no options provided', () => {
    expect(interpolate('Hello, {name}!')).toBe('Hello, {name}!')
  })

  it('returns plain string unchanged', () => {
    expect(interpolate('No placeholders here')).toBe('No placeholders here')
  })
})
