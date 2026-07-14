import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useIntersectionObserver } from '../useIntersectionObserver'

describe('useIntersectionObserver', () => {
  it('should observe element and track intersecting state', async () => {
    let observerCb: ((entries: any[]) => void) | null = null

    const OriginalIO = global.IntersectionObserver
    class MockIO {
      observe = vi.fn()
      disconnect = vi.fn()
      constructor(cb: any) {
        observerCb = cb
      }
    }
    global.IntersectionObserver = MockIO as any

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        const result = useIntersectionObserver(target, () => {})
        return { target, result }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComp)
    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.vm.result.isIntersecting.value).toBe(false)

    observerCb?.([{ isIntersecting: true }])
    expect(wrapper.vm.result.isIntersecting.value).toBe(true)

    observerCb?.([{ isIntersecting: false }])
    expect(wrapper.vm.result.isIntersecting.value).toBe(false)

    wrapper.unmount()
    global.IntersectionObserver = OriginalIO
  })

  it('should pass options to IntersectionObserver', async () => {
    const OriginalIO = global.IntersectionObserver

    const constructorCalls: any[] = []
    function MockIO(cb: any, options?: any) {
      constructorCalls.push(options)
      return {
        observe: vi.fn(),
        disconnect: vi.fn(),
      }
    }
    global.IntersectionObserver = MockIO as any

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useIntersectionObserver(target, () => {}, {
          rootMargin: '10px',
          threshold: 0.5,
        })
        return { target }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComp)
    await new Promise(r => setTimeout(r, 0))

    expect(constructorCalls.length).toBeGreaterThan(0)
    expect(constructorCalls[0]).toEqual(
      expect.objectContaining({ rootMargin: '10px', threshold: 0.5 })
    )

    wrapper.unmount()
    global.IntersectionObserver = OriginalIO
  })
})
