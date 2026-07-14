import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Tooltip from '../tooltip/tooltip.vue'

describe('ZcTooltip', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders with default props', () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Hello' },
      slots: { default: '<button>Hover me</button>' },
    })
    expect(wrapper.classes()).toContain('zc-tooltip')
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('does not show tooltip content initially', () => {
    mount(Tooltip, {
      props: { content: 'Hello', triggers: ['hover'], showDelay: 100 },
      slots: { default: '<span>text</span>' },
    })
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()
  })

  it('shows tooltip on hover trigger', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Tip text', triggers: ['hover'], showDelay: 0, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')

    const tooltip = document.querySelector('.zc-tooltip__popper')
    expect(tooltip).not.toBeNull()
    expect(tooltip?.textContent).toContain('Tip text')
  })

  it('shows tooltip on click trigger', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Clicked', triggers: ['click'], showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('click')

    const tooltip = document.querySelector('.zc-tooltip__popper')
    expect(tooltip).not.toBeNull()
  })

  it('emits show and update:visible events', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Test', triggers: ['hover'], showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    expect(wrapper.emitted('show')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[0]).toEqual([true])
  })

  it('does not show when disabled', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Test', triggers: ['hover'], disabled: true, showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const tooltip = document.querySelector('.zc-tooltip__popper')
    expect(tooltip).toBeNull()
  })

  it('renders content slot', async () => {
    const wrapper = mount(Tooltip, {
      props: { triggers: ['hover'], showDelay: 0 },
      slots: {
        default: '<span>text</span>',
        content: '<strong>Bold tip</strong>',
      },
    })
    await wrapper.trigger('mouseenter')
    const tooltip = document.querySelector('.zc-tooltip__popper')
    expect(tooltip?.querySelector('strong')).not.toBeNull()
  })

  it('hides on mouseleave', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Test', triggers: ['hover'], showDelay: 0, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()

    await wrapper.trigger('mouseleave')
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()
  })

  it('applies arrow when showArrow is true', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Test', triggers: ['hover'], showDelay: 0, showArrow: true },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const arrow = document.querySelector('.zc-tooltip__arrow')
    expect(arrow).not.toBeNull()
  })

  // --- Placement tests ---
  it('applies top placement class by default', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Top', triggers: ['hover'], showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--top')).toBe(true)
  })

  it('applies bottom placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Bottom', triggers: ['hover'], showDelay: 0, placement: 'bottom' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--bottom')).toBe(true)
  })

  it('applies left placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Left', triggers: ['hover'], showDelay: 0, placement: 'left' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--left')).toBe(true)
  })

  it('applies right placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Right', triggers: ['hover'], showDelay: 0, placement: 'right' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--right')).toBe(true)
  })

  // ---- Bug #18: Tooltip uses position:fixed when teleported ----
  it('popper is teleported to body with fixed positioning styles', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Fixed tip', triggers: ['hover'], showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper') as HTMLElement
    expect(popper).not.toBeNull()
    // Teleported to body (not inside the component's relative container)
    expect(popper.closest('.zc-tooltip')).toBeNull()
    // Has inline position styles from getBoundingClientRect-based updatePosition
    expect(popper.style.top || popper.style.bottom).not.toBe('')
  })

  it('popper position is computed from trigger rect on bottom placement', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Bottom tip', triggers: ['hover'], showDelay: 0, placement: 'bottom' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper') as HTMLElement
    expect(popper).not.toBeNull()
    // Should have computed pixel-based positioning
    expect(popper.style.top).not.toBe('')
  })

  it('applies top-start placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'TS', triggers: ['hover'], showDelay: 0, placement: 'top-start' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--top-start')).toBe(true)
  })

  it('applies top-end placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'TE', triggers: ['hover'], showDelay: 0, placement: 'top-end' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--top-end')).toBe(true)
  })

  it('applies bottom-start placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'BS', triggers: ['hover'], showDelay: 0, placement: 'bottom-start' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--bottom-start')).toBe(true)
  })

  it('applies bottom-end placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'BE', triggers: ['hover'], showDelay: 0, placement: 'bottom-end' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--bottom-end')).toBe(true)
  })

  it('applies left-start placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'LS', triggers: ['hover'], showDelay: 0, placement: 'left-start' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--left-start')).toBe(true)
  })

  it('applies left-end placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'LE', triggers: ['hover'], showDelay: 0, placement: 'left-end' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--left-end')).toBe(true)
  })

  it('applies right-start placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'RS', triggers: ['hover'], showDelay: 0, placement: 'right-start' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--right-start')).toBe(true)
  })

  it('applies right-end placement class', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'RE', triggers: ['hover'], showDelay: 0, placement: 'right-end' },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('zc-tooltip__popper--right-end')).toBe(true)
  })

  it('shows on focus and hides on blur with focus trigger', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Focus', triggers: ['focus'], showDelay: 0, hideDelay: 0 },
      slots: { default: '<input />' },
    })
    await wrapper.trigger('focus')
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()

    await wrapper.trigger('blur')
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()
  })

  it('does not show arrow when showArrow is false', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'No Arrow', triggers: ['hover'], showDelay: 0, showArrow: false },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    expect(document.querySelector('.zc-tooltip__arrow')).toBeNull()
  })

  it('applies popperClass to the popper element', async () => {
    const wrapper = mount(Tooltip, {
      props: {
        content: 'Styled',
        triggers: ['hover'],
        showDelay: 0,
        popperClass: 'my-custom-class',
      },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.classList.contains('my-custom-class')).toBe(true)
  })

  it('respects openDelay with fake timers', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { content: 'Delayed', triggers: ['hover'], showDelay: 500, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    // Should not be visible immediately
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()

    // Advance past the delay
    vi.advanceTimersByTime(500)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()
    expect(document.querySelector('.zc-tooltip__popper')?.textContent).toContain('Delayed')
    vi.useRealTimers()
  })

  it('respects hideDelay with fake timers', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Tooltip, {
      props: { content: 'Bye', triggers: ['hover'], showDelay: 0, hideDelay: 300 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.vm.$nextTick()
    // Show first
    await wrapper.trigger('mouseenter')
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()

    // Mouse leave
    await wrapper.trigger('mouseleave')
    // Should still be visible during delay
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()

    vi.advanceTimersByTime(300)
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()
    vi.useRealTimers()
  })

  it('toggles on click with click trigger (click to hide)', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Toggle', triggers: ['click'], showDelay: 0, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    // First click shows
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()

    // Second click hides
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()
  })

  it('emits hide event on mouseleave with hover trigger', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'HideEvt', triggers: ['hover'], showDelay: 0, hideDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    await wrapper.trigger('mouseleave')
    expect(wrapper.emitted('hide')).toBeTruthy()
    expect(wrapper.emitted('update:visible')?.[1]).toEqual([false])
  })

  it('works in manual mode via v-model:visible prop', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Manual', visible: false, triggers: ['hover'], showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()

    // Simulate the parent setting visible=true
    await wrapper.setProps({ visible: true })
    expect(document.querySelector('.zc-tooltip__popper')).not.toBeNull()

    // Set back to false
    await wrapper.setProps({ visible: false })
    expect(document.querySelector('.zc-tooltip__popper')).toBeNull()
  })

  it('shows tooltip content via content prop', async () => {
    const wrapper = mount(Tooltip, {
      props: { content: 'Content Prop', triggers: ['hover'], showDelay: 0 },
      slots: { default: '<span>text</span>' },
    })
    await wrapper.trigger('mouseenter')
    const popper = document.querySelector('.zc-tooltip__popper')
    expect(popper?.textContent).toContain('Content Prop')
  })
})
