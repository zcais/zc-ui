import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useResizeObserver } from '../useResizeObserver'

describe('useResizeObserver', () => {
  it('should observe element on mount and return size refs', async () => {
    const observe = vi.fn()
    const disconnect = vi.fn()

    const OriginalRO = global.ResizeObserver
    class MockRO {
      observe = observe
      disconnect = disconnect
      constructor() {}
    }
    global.ResizeObserver = MockRO as any

    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        const result = useResizeObserver(target)
        return { target, result }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComp)
    await new Promise(r => setTimeout(r, 0))

    expect(observe).toHaveBeenCalledTimes(1)
    expect(wrapper.vm.result.width.value).toBe(0)

    wrapper.unmount()
    expect(disconnect).toHaveBeenCalledTimes(1)

    global.ResizeObserver = OriginalRO
  })

  it('should call callback when resize fires', async () => {
    let observerCb: ((entries: any[]) => void) | null = null
    const observe = vi.fn()
    const disconnect = vi.fn()

    const OriginalRO = global.ResizeObserver
    class MockRO {
      observe = observe
      disconnect = disconnect
      constructor(cb: any) {
        observerCb = cb
      }
    }
    global.ResizeObserver = MockRO as any

    const callback = vi.fn()
    const TestComp = defineComponent({
      setup() {
        const target = ref<HTMLElement | null>(null)
        useResizeObserver(target, callback)
        return { target }
      },
      render() {
        return h('div', { ref: 'target' })
      },
    })

    const wrapper = mount(TestComp)
    await new Promise(r => setTimeout(r, 0))

    const mockEntry = {
      contentRect: { width: 200, height: 100 },
      target: {},
      borderBoxSize: [],
      contentBoxSize: [],
    }
    observerCb?.([mockEntry])

    // Wait for Vue reactivity
    await new Promise(r => setTimeout(r, 0))

    expect(callback).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    global.ResizeObserver = OriginalRO
  })
})
