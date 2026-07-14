import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useEventListener } from '../useEventListener'

describe('useEventListener', () => {
  it('listens to events on a static target', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        useEventListener(el, 'click', handler)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComp)

    el.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('listens to events on window', () => {
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        useEventListener(window, 'resize', handler)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComp)

    window.dispatchEvent(new Event('resize'))
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('supports Ref<HTMLElement> target', async () => {
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        const elRef = ref<HTMLElement | null>(null)
        useEventListener(elRef, 'click', handler)
        return () => h('button', { ref: elRef, id: 'target-btn' }, 'click me')
      },
    })

    const wrapper = mount(TestComp)
    await wrapper.vm.$nextTick()

    const btn = wrapper.find('#target-btn')
    await btn.trigger('click')
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('cleanup function removes listener', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        const cleanup = useEventListener(el, 'click', handler)
        // Expose cleanup for testing
        return { cleanup }
      },
      render() {
        return h('div')
      },
    })

    const wrapper = mount(TestComp)

    el.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.vm.cleanup()
    el.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
  })

  it('immediate option registers without waiting for mount', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    // With immediate=true, listener is attached right away
    useEventListener(el, 'click', handler, { immediate: true })

    el.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('cleans up automatically on component unmount', () => {
    const el = document.createElement('div')
    const handler = vi.fn()

    const TestComp = defineComponent({
      setup() {
        useEventListener(el, 'click', handler)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComp)

    el.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)

    wrapper.unmount()
    el.dispatchEvent(new MouseEvent('click'))
    expect(handler).toHaveBeenCalledTimes(1)
  })

  it('supports capture option', () => {
    const parent = document.createElement('div')
    const child = document.createElement('div')
    parent.appendChild(child)

    const order: string[] = []
    const parentHandler = () => order.push('parent')
    const childHandler = () => order.push('child')

    useEventListener(parent, 'click', parentHandler, {
      immediate: true,
      capture: true,
    })
    useEventListener(child, 'click', childHandler, {
      immediate: true,
      capture: false,
    })

    child.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    expect(order).toEqual(['parent', 'child'])
  })
})
