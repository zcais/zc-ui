import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h, ref } from 'vue'
import { mount } from '@vue/test-utils'
import { useScroll } from '../useScroll'

describe('useScroll', () => {
  it('should return reactive scroll position refs', () => {
    const TestComp = defineComponent({
      setup() {
        const result = useScroll(window)
        return { result }
      },
      render() {
        return h('div')
      },
    })
    const wrapper = mount(TestComp)

    expect(wrapper.vm.result.x.value).toBe(0)
    expect(wrapper.vm.result.y.value).toBe(0)
    expect(wrapper.vm.result.isScrolling.value).toBe(false)
    expect(wrapper.vm.result.arrivedState.top.value).toBe(true)

    wrapper.unmount()
  })

  it('should track scroll position on element', async () => {
    const el = document.createElement('div')
    Object.defineProperty(el, 'scrollLeft', { configurable: true, get: () => 50 })
    Object.defineProperty(el, 'scrollTop', { configurable: true, get: () => 100 })
    Object.defineProperty(el, 'scrollWidth', { configurable: true, get: () => 500 })
    Object.defineProperty(el, 'scrollHeight', { configurable: true, get: () => 500 })
    Object.defineProperty(el, 'clientWidth', { configurable: true, get: () => 200 })
    Object.defineProperty(el, 'clientHeight', { configurable: true, get: () => 200 })

    document.body.appendChild(el)

    const TestComp = defineComponent({
      setup() {
        const result = useScroll(el)
        return { result }
      },
      render() {
        return h('div')
      },
    })
    const wrapper = mount(TestComp)

    // Trigger scroll event
    el.dispatchEvent(new Event('scroll'))

    await new Promise(r => setTimeout(r, 0))

    expect(wrapper.vm.result.x.value).toBe(50)
    expect(wrapper.vm.result.y.value).toBe(100)

    wrapper.unmount()
    document.body.removeChild(el)
  })
})
