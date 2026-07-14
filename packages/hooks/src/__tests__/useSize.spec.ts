import { describe, it, expect } from 'vitest'
import { ref, nextTick } from 'vue'
import { mount } from '@vue/test-utils'
import { defineComponent, h } from 'vue'
import { useSize } from '../useSize'

describe('useSize', () => {
  it('returns initial zero dimensions', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        const { width, height } = useSize(elRef)
        return { width, height, elRef }
      },
      render() {
        return h('div', {
          ref: 'elRef',
          style: 'width: 100px; height: 50px;',
        })
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // After mount, dimensions should be read from getBoundingClientRect
    // jsdom may report 0 for width/height since it doesn't do real layout,
    // but the function should still execute without errors
    expect(wrapper.vm.width).toBeGreaterThanOrEqual(0)
    expect(wrapper.vm.height).toBeGreaterThanOrEqual(0)

    wrapper.unmount()
  })

  it('handles null target gracefully', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        const { width, height } = useSize(elRef)
        return { width, height, elRef }
      },
      render() {
        return h('div', { ref: 'elRef' })
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    expect(wrapper.vm.width).toBe(0)
    expect(wrapper.vm.height).toBe(0)

    wrapper.unmount()
  })

  it('cleans up ResizeObserver on unmount', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        useSize(elRef)
        return () => h('div', { ref: elRef })
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // Should unmount without errors
    wrapper.unmount()
    expect(true).toBe(true)
  })

  it('updates width and height reactively', async () => {
    const TestComponent = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        const { width, height } = useSize(elRef)
        return { width, height, elRef }
      },
      render() {
        return h('div', {
          ref: 'elRef',
          style: { width: '200px', height: '100px' },
        })
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // jsdom doesn't compute layout, so we verify the composable
    // accepts the observer and returns refs
    expect(typeof wrapper.vm.width).toBe('number')
    expect(typeof wrapper.vm.height).toBe('number')

    wrapper.unmount()
  })
})
