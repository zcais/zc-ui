import { describe, it, expect } from 'vitest'
import { toFixed, padZero } from '../format'

describe('toFixed', () => {
  it('formats a number to 2 decimal places by default', () => {
    expect(toFixed(3.14159)).toBe('3.14')
  })

  it('formats with custom decimal places', () => {
    expect(toFixed(3.14159, 4)).toBe('3.1416')
    expect(toFixed(3.14159, 0)).toBe('3')
  })

  it('rounds correctly', () => {
    expect(toFixed(3.14159, 3)).toBe('3.142')
    expect(toFixed(2.5, 0)).toBe('3')
    // Note: 2.675 and 1.005 are subject to IEEE 754 floating-point
    // representation issues where (2.675).toFixed(2) === '2.67'
    expect(toFixed(2.675, 2)).toBe('2.67')
  })

  it('handles zero', () => {
    expect(toFixed(0)).toBe('0.00')
    expect(toFixed(0, 0)).toBe('0')
  })

  it('handles negative numbers', () => {
    expect(toFixed(-3.14)).toBe('-3.14')
    expect(toFixed(-0.005, 2)).toBe('-0.01')
  })

  it('handles integers', () => {
    expect(toFixed(42)).toBe('42.00')
    expect(toFixed(42, 3)).toBe('42.000')
  })
})

describe('padZero', () => {
  it('pads a single digit to length 2 by default', () => {
    expect(padZero(5)).toBe('05')
    expect(padZero('5')).toBe('05')
  })

  it('does not pad when already at target length', () => {
    expect(padZero(12)).toBe('12')
    expect(padZero('12')).toBe('12')
  })

  it('pads to a custom length', () => {
    expect(padZero(7, 4)).toBe('0007')
    expect(padZero('7', 4)).toBe('0007')
  })

  it('handles zero', () => {
    expect(padZero(0)).toBe('00')
    expect(padZero(0, 3)).toBe('000')
  })

  it('handles multi-digit numbers without truncation', () => {
    expect(padZero(123456)).toBe('123456')
    expect(padZero(123, 2)).toBe('123')
  })

  it('handles string input with non-numeric characters', () => {
    expect(padZero('abc', 5)).toBe('00abc')
    expect(padZero('ab', 5)).toBe('000ab')
  })
})
