import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Spin from '../spin/spin.vue'

describe('ZcSpin', () => {
  it('renders spinner when spinning is true', () => {
    const wrapper = mount(Spin, { props: { spinning: true } })
    expect(wrapper.find('.zc-spin__spinner').exists()).toBe(true)
  })

  it('renders nothing when spinning is false', () => {
    const wrapper = mount(Spin, { props: { spinning: false } })
    expect(wrapper.find('.zc-spin__spinner').exists()).toBe(false)
  })

  it('renders with default spinning=true', () => {
    const wrapper = mount(Spin)
    expect(wrapper.find('.zc-spin__spinner').exists()).toBe(true)
  })

  it('applies size modifier', () => {
    const wrapper = mount(Spin, { props: { size: 'large' } })
    expect(wrapper.find('.zc-spin--large').exists()).toBe(true)
  })

  it('applies medium size by default', () => {
    const wrapper = mount(Spin)
    expect(wrapper.find('.zc-spin--medium').exists()).toBe(true)
  })

  it('applies small size', () => {
    const wrapper = mount(Spin, { props: { size: 'small' } })
    expect(wrapper.find('.zc-spin--small').exists()).toBe(true)
  })

  it('renders tip text', () => {
    const wrapper = mount(Spin, { props: { tip: 'Loading...' } })
    expect(wrapper.find('.zc-spin__tip').text()).toBe('Loading...')
  })

  it('does not render tip when not provided', () => {
    const wrapper = mount(Spin)
    expect(wrapper.find('.zc-spin__tip').exists()).toBe(false)
  })

  it('applies custom color', () => {
    const wrapper = mount(Spin, { props: { color: 'rgb(255, 0, 0)' } })
    const spinner = wrapper.find('.zc-spin__spinner')
    expect(spinner.attributes('style')).toContain('255')
  })

  it('renders fullscreen overlay', () => {
    const wrapper = mount(Spin, { props: { fullscreen: true } })
    expect(wrapper.find('.zc-spin__fullscreen-overlay').exists()).toBe(true)
  })

  it('does not render fullscreen overlay when not fullscreen', () => {
    const wrapper = mount(Spin, { props: { fullscreen: false } })
    expect(wrapper.find('.zc-spin__fullscreen-overlay').exists()).toBe(false)
  })

  it('renders content via default slot in wrapper mode', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('.zc-spin__wrapper').exists()).toBe(true)
    expect(wrapper.text()).toContain('Content')
  })

  it('shows mask when spinning with content', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('.zc-spin__mask').exists()).toBe(true)
  })

  it('hides mask when not spinning with content', () => {
    const wrapper = mount(Spin, {
      props: { spinning: false },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('.zc-spin__mask').exists()).toBe(false)
  })

  it('applies overlay class when overlay is true', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true, overlay: true },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('.zc-spin__mask.is-overlay').exists()).toBe(true)
  })

  it('does not apply overlay class when overlay is false', () => {
    const wrapper = mount(Spin, {
      props: { spinning: true, overlay: false },
      slots: { default: 'Content' },
    })
    expect(wrapper.find('.zc-spin__mask.is-overlay').exists()).toBe(false)
  })

  it('has role=status for accessibility', () => {
    const wrapper = mount(Spin, { props: { spinning: true } })
    const spinner = wrapper.find('.zc-spin__spinner')
    expect(spinner.attributes('role')).toBe('status')
  })

  it('has aria-live=polite for accessibility', () => {
    const wrapper = mount(Spin, { props: { spinning: true } })
    const spinner = wrapper.find('.zc-spin__spinner')
    expect(spinner.attributes('aria-live')).toBe('polite')
  })

  it('has sr-only text', () => {
    const wrapper = mount(Spin, { props: { spinning: true } })
    expect(wrapper.find('.sr-only').text()).toBe('Loading')
  })
})
