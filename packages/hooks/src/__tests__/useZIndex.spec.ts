import { describe, it, expect, beforeEach } from 'vitest'
import { useZIndex, getBaseZIndex } from '../useZIndex'

describe('useZIndex', () => {
  beforeEach(() => {
    // Reset before each test
    const { resetZIndex } = useZIndex()
    resetZIndex()
  })

  it('returns base z-index as initial current', () => {
    const { currentZIndex } = useZIndex()
    expect(currentZIndex.value).toBe(getBaseZIndex())
  })

  it('base z-index is 1300', () => {
    expect(getBaseZIndex()).toBe(1300)
  })

  it('nextZIndex increments monotonically', () => {
    const { nextZIndex } = useZIndex()

    const first = nextZIndex()
    const second = nextZIndex()
    const third = nextZIndex()

    expect(first).toBe(1301)
    expect(second).toBe(1302)
    expect(third).toBe(1303)
  })

  it('nextZIndex always returns higher than previous', () => {
    const { nextZIndex } = useZIndex()

    const values: number[] = []
    for (let i = 0; i < 50; i++) {
      values.push(nextZIndex())
    }

    for (let i = 1; i < values.length; i++) {
      expect(values[i]).toBeGreaterThan(values[i - 1])
    }
  })

  it('resetZIndex restores to base', () => {
    const { nextZIndex, resetZIndex } = useZIndex()

    nextZIndex()
    nextZIndex()
    nextZIndex()

    resetZIndex()

    const { currentZIndex } = useZIndex()
    expect(currentZIndex.value).toBe(1300)
  })

  it('shares z-index state across multiple useZIndex calls', () => {
    const a = useZIndex()
    const b = useZIndex()

    a.nextZIndex()
    expect(b.nextZIndex()).toBe(1302)
  })
})
