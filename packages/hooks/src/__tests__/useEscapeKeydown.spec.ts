import { describe, it, expect, vi } from 'vitest'
import { defineComponent, h } from 'vue'
import { mount } from '@vue/test-utils'
import { useEscapeKeydown } from '../useEscapeKeydown'

describe('useEscapeKeydown', () => {
  it('should call handler on Escape key', async () => {
    const handler = vi.fn()
    const TestComp = defineComponent({
      setup() {
        useEscapeKeydown(handler)
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)

    const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
    document.dispatchEvent(event)

    expect(handler).toHaveBeenCalledTimes(1)
    wrapper.unmount()
  })

  it('should not call handler on other keys', async () => {
    const handler = vi.fn()
    const TestComp = defineComponent({
      setup() {
        useEscapeKeydown(handler)
        return () => h('div')
      },
    })
    const wrapper = mount(TestComp)

    const event = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    document.dispatchEvent(event)

    expect(handler).not.toHaveBeenCalled()
    wrapper.unmount()
  })
})
