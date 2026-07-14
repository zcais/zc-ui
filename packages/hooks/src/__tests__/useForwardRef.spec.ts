import { describe, it, expect, vi } from 'vitest'
import { nextTick } from 'vue'
import { ref } from 'vue'
import { useForwardRef } from '../useForwardRef'

describe('useForwardRef', () => {
  it('should forward value to a single target ref', async () => {
    const target = ref<HTMLElement | null>(null)
    const source = useForwardRef<HTMLElement>(target)

    const el = document.createElement('div')
    source.value = el
    await nextTick()
    expect(target.value).toBe(el)
  })

  it('should forward value to a callback', async () => {
    const cb = vi.fn()
    const source = useForwardRef<HTMLElement>(cb)

    const el = document.createElement('span')
    source.value = el
    await nextTick()
    expect(cb).toHaveBeenCalledWith(el)
  })

  it('should forward to multiple targets', async () => {
    const ref1 = ref<HTMLElement | null>(null)
    const ref2 = ref<HTMLElement | null>(null)
    const cb = vi.fn()
    const source = useForwardRef<HTMLElement>(ref1, cb, ref2)

    const el = document.createElement('div')
    source.value = el
    await nextTick()
    expect(ref1.value).toBe(el)
    expect(ref2.value).toBe(el)
    expect(cb).toHaveBeenCalledWith(el)
  })

  it('should forward null when cleared', async () => {
    const target = ref<HTMLElement | null>(null)
    const source = useForwardRef<HTMLElement>(target)

    source.value = document.createElement('div')
    await nextTick()
    source.value = null
    await nextTick()
    expect(target.value).toBeNull()
  })
})
