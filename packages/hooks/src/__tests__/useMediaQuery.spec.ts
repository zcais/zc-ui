import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useMediaQuery, useBreakpoints, DEFAULT_BREAKPOINTS } from '../useMediaQuery'

// Mock matchMedia with configurable matches
function mockMatchMedia(matches: boolean) {
  const listeners: ((e: { matches: boolean }) => void)[] = []
  const mql = {
    matches,
    media: '',
    onchange: null,
    addEventListener: vi.fn((event: string, cb: any) => {
      if (event === 'change') listeners.push(cb)
    }),
    removeEventListener: vi.fn(),
    addListener: vi.fn((cb: any) => listeners.push(cb)),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(() => false),
  }
  vi.stubGlobal('matchMedia', () => mql)
  return { mql, listeners }
}

describe('useMediaQuery', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return a ref with boolean value', () => {
    mockMatchMedia(false)
    const matches = useMediaQuery('(min-width: 9999px)')
    expect(typeof matches.value).toBe('boolean')
    expect(matches.value).toBe(false)
  })

  it('should match when query matches', () => {
    mockMatchMedia(true)
    const matches = useMediaQuery('(min-width: 1px)')
    expect(matches.value).toBe(true)
  })
})

describe('useBreakpoints', () => {
  beforeEach(() => {
    mockMatchMedia(false)
  })
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('should return current breakpoint', () => {
    const { current } = useBreakpoints()
    expect(typeof current.value).toBe('string')
  })

  it('should expose default breakpoints config', () => {
    expect(DEFAULT_BREAKPOINTS.xs).toBe(0)
    expect(DEFAULT_BREAKPOINTS.sm).toBe(576)
    expect(DEFAULT_BREAKPOINTS.md).toBe(768)
    expect(DEFAULT_BREAKPOINTS.lg).toBe(992)
    expect(DEFAULT_BREAKPOINTS.xl).toBe(1200)
  })

  it('should support custom breakpoints', () => {
    const { current, isMobile } = useBreakpoints({
      small: 0,
      medium: 600,
      large: 1024,
    })
    expect(typeof current.value).toBe('string')
    expect(typeof isMobile.value).toBe('boolean')
  })

  it('should provide isAtLeast and isBelow helpers', () => {
    mockMatchMedia(true) // all queries match
    const { isAtLeast } = useBreakpoints()
    // With matchMedia returning true, isAtLeast should be true
    expect(isAtLeast('xs')).toBe(true)
  })
})
