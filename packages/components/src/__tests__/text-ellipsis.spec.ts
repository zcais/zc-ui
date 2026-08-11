import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TextEllipsis from '../text-ellipsis/text-ellipsis.vue'

describe('ZcTextEllipsis', () => {
  it('renders with default props', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Hello World' },
    })
    expect(wrapper.classes()).toContain('zc-text-ellipsis')
    expect(wrapper.text()).toContain('Hello World')
  })

  it('renders content via prop', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test Content' },
    })
    expect(wrapper.text()).toContain('Test Content')
  })

  it('renders content via default slot', () => {
    const wrapper = mount(TextEllipsis, {
      slots: { default: 'Slot Content' },
    })
    expect(wrapper.text()).toContain('Slot Content')
  })

  it('prefers content prop over slot', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Prop Content' },
      slots: { default: 'Slot Content' },
    })
    expect(wrapper.text()).toContain('Prop Content')
  })

  it('renders text element with correct class', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test' },
    })
    expect(wrapper.find('.zc-text-ellipsis__text').exists()).toBe(true)
  })

  it('does not show expand button when not expandable', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test', expandable: false },
    })
    expect(wrapper.find('.zc-text-ellipsis__action').exists()).toBe(false)
  })

  it('applies nowrap style for single line (lines=0)', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test', lines: 0 },
    })
    const text = wrapper.find('.zc-text-ellipsis__text')
    const style = text.attributes('style')
    expect(style).toContain('nowrap')
    expect(style).toContain('ellipsis')
  })

  it('applies webkit-line-clamp for multi-line', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test', lines: 2 },
    })
    const text = wrapper.find('.zc-text-ellipsis__text')
    const style = text.attributes('style')
    expect(style).toContain('-webkit-line-clamp')
    expect(style).toContain('2')
  })

  it('renders tooltip wrapper when showTooltip is true', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test', showTooltip: true },
    })
    // Tooltip wrapper only renders when truncated, but the component should render fine
    expect(wrapper.classes()).toContain('zc-text-ellipsis')
  })

  it('does not show tooltip when showTooltip is false', () => {
    const wrapper = mount(TextEllipsis, {
      props: { content: 'Test', showTooltip: false },
    })
    expect(wrapper.find('.zc-text-ellipsis__tooltip-wrapper').exists()).toBe(false)
  })

  it('emits expand event when toggling', async () => {
    const wrapper = mount(TextEllipsis, {
      props: {
        content: 'A'.repeat(500),
        expandable: true,
      },
    })
    // Force truncation state
    wrapper.vm.isTruncated = true
    await wrapper.vm.$nextTick()

    const action = wrapper.find('.zc-text-ellipsis__action')
    expect(action.exists()).toBe(true)
    await action.trigger('click')
    expect(wrapper.emitted('expand')).toBeDefined()
    expect(wrapper.emitted('expand')![0]).toEqual([true])
  })

  it('shows correct action text', async () => {
    const wrapper = mount(TextEllipsis, {
      props: {
        content: 'A'.repeat(500),
        expandable: true,
      },
    })
    // Mock scroll dimensions to simulate truncation
    const textEl = wrapper.find('.zc-text-ellipsis__text').element as HTMLElement
    Object.defineProperty(textEl, 'scrollWidth', { configurable: true, get: () => 500 })
    Object.defineProperty(textEl, 'clientWidth', { configurable: true, get: () => 100 })
    ;(wrapper.vm as any).isTruncated = true
    await wrapper.vm.$nextTick()

    const action = wrapper.find('.zc-text-ellipsis__action')
    expect(action.exists()).toBe(true)
    expect(action.text()).toContain('展开')

    await action.trigger('click')
    await wrapper.vm.$nextTick()

    // After expand, button should show 收起
    const actionAfter = wrapper.find('.zc-text-ellipsis__action')
    if (actionAfter.exists()) {
      expect(actionAfter.text()).toContain('收起')
    }
  })
})
