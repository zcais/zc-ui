import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcSwitch from '../switch/switch.vue'

describe('ZcSwitch', () => {
  it('renders with default props', () => {
    const wrapper = mount(ZcSwitch)
    expect(wrapper.classes()).toContain('zc-switch')
  })

  it('modelValue false by default shows unchecked state', () => {
    const wrapper = mount(ZcSwitch)
    expect(wrapper.classes()).not.toContain('is-checked')
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('modelValue true shows checked state', () => {
    const wrapper = mount(ZcSwitch, { props: { modelValue: true } })
    expect(wrapper.classes()).toContain('is-checked')
    expect(wrapper.attributes('aria-checked')).toBe('true')
  })

  it('click toggles value and emits update:modelValue with true', () => {
    const wrapper = mount(ZcSwitch)
    wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('click when already toggled emits false', () => {
    const wrapper = mount(ZcSwitch, { props: { modelValue: true } })
    wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('emits change event on toggle', () => {
    const wrapper = mount(ZcSwitch)
    wrapper.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('disabled switch does not toggle on click', () => {
    const wrapper = mount(ZcSwitch, { props: { disabled: true } })
    wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('disabled switch has is-disabled class', () => {
    const wrapper = mount(ZcSwitch, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('loading state renders spinner', () => {
    const wrapper = mount(ZcSwitch, { props: { loading: true } })
    expect(wrapper.classes()).toContain('is-loading')
    expect(wrapper.find('.zc-switch__loading-icon').exists()).toBe(true)
  })

  it('loading switch does not toggle on click', () => {
    const wrapper = mount(ZcSwitch, { props: { loading: true } })
    wrapper.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('activeText displays correctly', () => {
    const wrapper = mount(ZcSwitch, { props: { activeText: 'On' } })
    expect(wrapper.text()).toContain('On')
  })

  it('inactiveText displays correctly', () => {
    const wrapper = mount(ZcSwitch, { props: { inactiveText: 'Off' } })
    expect(wrapper.text()).toContain('Off')
  })

  it('activeText and inactiveText both render', () => {
    const wrapper = mount(ZcSwitch, {
      props: { activeText: 'Yes', inactiveText: 'No' },
    })
    expect(wrapper.text()).toContain('Yes')
    expect(wrapper.text()).toContain('No')
  })

  it('applies size classes', () => {
    const wrapper = mount(ZcSwitch, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('zc-switch--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(ZcSwitch, { props: { size: 'small' } })
    expect(wrapper.classes()).toContain('zc-switch--small')
  })

  it('has role="switch" and correct aria attributes', () => {
    const wrapper = mount(ZcSwitch)
    expect(wrapper.attributes('role')).toBe('switch')
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('renders knob element', () => {
    const wrapper = mount(ZcSwitch)
    expect(wrapper.find('.zc-switch__knob').exists()).toBe(true)
  })

  it('renders track element with inline width style', () => {
    const wrapper = mount(ZcSwitch, { props: { width: 50 } })
    const track = wrapper.find('.zc-switch__track')
    expect(track.exists()).toBe(true)
    expect(track.attributes('style')).toContain('width: 50px')
  })
})
