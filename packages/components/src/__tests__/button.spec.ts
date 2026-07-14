import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Button from '../button/button.vue'

describe('ZcButton', () => {
  it('renders with default props', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('zc-button')
  })

  it('renders as a button element', () => {
    const wrapper = mount(Button)
    expect(wrapper.element.tagName).toBe('BUTTON')
  })

  // ---- Type classes ----
  it('does not apply type class for default type', () => {
    const wrapper = mount(Button, { props: { type: 'default' } })
    // Default type skips the modifier class
    expect(wrapper.classes()).not.toContain('zc-button--default')
  })

  it('applies primary type class', () => {
    const wrapper = mount(Button, { props: { type: 'primary' } })
    expect(wrapper.classes()).toContain('zc-button--primary')
  })

  it('applies success type class', () => {
    const wrapper = mount(Button, { props: { type: 'success' } })
    expect(wrapper.classes()).toContain('zc-button--success')
  })

  it('applies warning type class', () => {
    const wrapper = mount(Button, { props: { type: 'warning' } })
    expect(wrapper.classes()).toContain('zc-button--warning')
  })

  it('applies danger type class', () => {
    const wrapper = mount(Button, { props: { type: 'danger' } })
    expect(wrapper.classes()).toContain('zc-button--danger')
  })

  it('applies info type class', () => {
    const wrapper = mount(Button, { props: { type: 'info' } })
    expect(wrapper.classes()).toContain('zc-button--info')
  })

  // ---- Size classes ----
  it('applies medium size class by default', () => {
    const wrapper = mount(Button)
    expect(wrapper.classes()).toContain('zc-button--medium')
  })

  it('applies large size class', () => {
    const wrapper = mount(Button, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('zc-button--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(Button, { props: { size: 'small' } })
    expect(wrapper.classes()).toContain('zc-button--small')
  })

  it('applies mini size class', () => {
    const wrapper = mount(Button, { props: { size: 'mini' } })
    expect(wrapper.classes()).toContain('zc-button--mini')
  })

  // ---- Disabled state ----
  it('applies disabled class when disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('sets disabled attribute when disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('does not set disabled attribute by default', () => {
    const wrapper = mount(Button)
    expect(wrapper.attributes('disabled')).toBeUndefined()
  })

  // ---- Round ----
  it('applies round class when round is true', () => {
    const wrapper = mount(Button, { props: { round: true } })
    expect(wrapper.classes()).toContain('is-round')
  })

  // ---- Plain ----
  it('applies plain class when plain is true', () => {
    const wrapper = mount(Button, { props: { plain: true } })
    expect(wrapper.classes()).toContain('is-plain')
  })

  // ---- Loading ----
  it('applies loading class when loading is true', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.classes()).toContain('is-loading')
  })

  it('renders loading spinner when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.find('.zc-button__loading').exists()).toBe(true)
    expect(wrapper.find('.zc-button__loading-icon').exists()).toBe(true)
  })

  it('disables button when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    expect(wrapper.attributes('disabled')).toBeDefined()
  })

  it('does not render icon when loading', () => {
    const wrapper = mount(Button, {
      props: { loading: true, icon: 'el-icon-search' },
    })
    expect(wrapper.find('.zc-button__icon').exists()).toBe(false)
  })

  // ---- Icon ----
  it('renders icon element when icon prop is set', () => {
    const wrapper = mount(Button, { props: { icon: 'el-icon-search' } })
    const icon = wrapper.find('.zc-button__icon')
    expect(icon.exists()).toBe(true)
    expect(icon.find('i').classes()).toContain('el-icon-search')
  })

  it('does not render icon when icon prop is empty', () => {
    const wrapper = mount(Button)
    expect(wrapper.find('.zc-button__icon').exists()).toBe(false)
  })

  // ---- nativeType ----
  it('sets button type to submit', () => {
    const wrapper = mount(Button, { props: { nativeType: 'submit' } })
    expect(wrapper.attributes('type')).toBe('submit')
  })

  it('sets button type to reset', () => {
    const wrapper = mount(Button, { props: { nativeType: 'reset' } })
    expect(wrapper.attributes('type')).toBe('reset')
  })

  it('defaults nativeType to button', () => {
    const wrapper = mount(Button)
    expect(wrapper.attributes('type')).toBe('button')
  })

  // ---- Slot ----
  it('renders slot content', () => {
    const wrapper = mount(Button, {
      slots: { default: 'Click Me' },
    })
    expect(wrapper.text()).toContain('Click Me')
    expect(wrapper.find('.zc-button__inner').exists()).toBe(true)
  })

  // ---- Click event ----
  it('emits click event when clicked', () => {
    const wrapper = mount(Button)
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('does not emit click when disabled', () => {
    const wrapper = mount(Button, { props: { disabled: true } })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })

  it('does not emit click when loading', () => {
    const wrapper = mount(Button, { props: { loading: true } })
    wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeFalsy()
  })
})
