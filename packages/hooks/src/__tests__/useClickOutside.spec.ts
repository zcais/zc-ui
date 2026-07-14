import { describe, it, expect, vi } from 'vitest'
import { ref, nextTick, defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useClickOutside } from '../useClickOutside'

describe('useClickOutside', () => {
  it('fires handler when clicking outside', async () => {
    const handler = vi.fn()

    const TestComponent = defineComponent({
      setup() {
        const targetRef = ref<HTMLElement | null>(null)
        useClickOutside(targetRef, handler)
        return () => h('div', { ref: targetRef, id: 'target' }, 'inside')
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    // Click on document body (outside the target)
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'target', {
      value: document.body,
      writable: false,
    })
    document.dispatchEvent(event)
    await nextTick()

    expect(handler).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('does NOT fire handler when clicking inside', async () => {
    const handler = vi.fn()

    const TestComponent = defineComponent({
      setup() {
        const targetRef = ref<HTMLElement | null>(null)
        useClickOutside(targetRef, handler)
        return () => h('div', { ref: targetRef, id: 'target' }, 'inside')
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    const target = wrapper.find('#target')
    await target.trigger('click')

    expect(handler).not.toHaveBeenCalled()
    wrapper.unmount()
  })

  it('does NOT fire for ignored elements', async () => {
    const handler = vi.fn()

    const ignoreEl = document.createElement('div')
    ignoreEl.id = 'ignore'
    document.body.appendChild(ignoreEl)

    const TestComponent = defineComponent({
      setup() {
        const targetRef = ref<HTMLElement | null>(null)
        useClickOutside(targetRef, handler, { ignore: [ignoreEl] })
        return () => h('div', { ref: targetRef, id: 'target' }, 'inside')
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'target', {
      value: ignoreEl,
      writable: false,
    })
    document.dispatchEvent(event)
    await nextTick()

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(ignoreEl)
    wrapper.unmount()
  })

  it('works with static target element', async () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    document.body.appendChild(target)

    const TestComponent = defineComponent({
      setup() {
        useClickOutside(target, handler)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()

    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'target', {
      value: document.body,
      writable: false,
    })
    document.dispatchEvent(event)
    await nextTick()

    expect(handler).toHaveBeenCalledTimes(1)

    document.body.removeChild(target)
    wrapper.unmount()
  })

  it('cleans up on unmount', async () => {
    const handler = vi.fn()
    const target = document.createElement('div')
    document.body.appendChild(target)

    const TestComponent = defineComponent({
      setup() {
        useClickOutside(target, handler)
        return () => h('div')
      },
    })

    const wrapper = mount(TestComponent)
    await nextTick()
    wrapper.unmount()

    // After unmount, clicking should not fire handler
    const event = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    })
    Object.defineProperty(event, 'target', {
      value: document.body,
      writable: false,
    })
    document.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()

    document.body.removeChild(target)
  })
})
