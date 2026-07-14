import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Result from '../result/result.vue'

describe('ZcResult', () => {
  it('renders with default status', () => {
    const wrapper = mount(Result)
    expect(wrapper.find('.zc-result').exists()).toBe(true)
    expect(wrapper.find('.zc-result').classes()).toContain('zc-result--info')
  })

  it('applies success status class', () => {
    const wrapper = mount(Result, { props: { status: 'success' } })
    expect(wrapper.find('.zc-result').classes()).toContain('zc-result--success')
  })

  it('applies error status class', () => {
    const wrapper = mount(Result, { props: { status: 'error' } })
    expect(wrapper.find('.zc-result').classes()).toContain('zc-result--error')
  })

  it('applies warning status class', () => {
    const wrapper = mount(Result, { props: { status: 'warning' } })
    expect(wrapper.find('.zc-result').classes()).toContain('zc-result--warning')
  })

  it('shows title', () => {
    const wrapper = mount(Result, { props: { title: 'Operation Complete' } })
    expect(wrapper.find('.zc-result__title').text()).toBe('Operation Complete')
  })

  it('shows subtitle', () => {
    const wrapper = mount(Result, { props: { subTitle: 'Everything went well' } })
    expect(wrapper.find('.zc-result__subtitle').text()).toBe('Everything went well')
  })

  it('renders icon', () => {
    const wrapper = mount(Result)
    expect(wrapper.find('.zc-result__icon').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders custom icon slot', () => {
    const wrapper = mount(Result, {
      slots: { icon: '<span class="custom-icon">★</span>' },
    })
    expect(wrapper.find('.custom-icon').exists()).toBe(true)
  })

  it('renders extra slot for actions', () => {
    const wrapper = mount(Result, {
      slots: { extra: '<button class="action-btn">Go Back</button>' },
    })
    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })

  it('renders default content slot', () => {
    const wrapper = mount(Result, {
      slots: { default: '<div class="custom-content">Details</div>' },
    })
    expect(wrapper.find('.custom-content').exists()).toBe(true)
  })

  it('renders title slot', () => {
    const wrapper = mount(Result, {
      slots: { title: '<span class="custom-title">My Title</span>' },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
  })

  it('hides title section when not provided', () => {
    const wrapper = mount(Result)
    expect(wrapper.find('.zc-result__title').exists()).toBe(false)
  })
})
