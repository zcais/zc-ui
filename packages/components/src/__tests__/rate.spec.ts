import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Rate from '../rate/rate.vue'

describe('ZcRate', () => {
  it('renders with default props', () => {
    const wrapper = mount(Rate)
    expect(wrapper.find('.zc-rate').exists()).toBe(true)
    // Default max is 5
    expect(wrapper.findAll('.zc-rate__item').length).toBe(5)
  })

  it('applies size class', () => {
    const wrapper = mount(Rate, { props: { size: 'large' } })
    expect(wrapper.find('.zc-rate').classes()).toContain('zc-rate--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(Rate, { props: { size: 'small' } })
    expect(wrapper.find('.zc-rate').classes()).toContain('zc-rate--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(Rate, { props: { disabled: true } })
    expect(wrapper.find('.zc-rate').classes()).toContain('is-disabled')
  })

  it('applies readonly class', () => {
    const wrapper = mount(Rate, { props: { readonly: true } })
    expect(wrapper.find('.zc-rate').classes()).toContain('is-readonly')
  })

  it('respects max prop', () => {
    const wrapper = mount(Rate, { props: { max: 10 } })
    expect(wrapper.findAll('.zc-rate__item').length).toBe(10)
  })

  it('fills stars based on modelValue', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3 } })
    const activeIcons = wrapper.findAll('.zc-rate__icon.is-active')
    expect(activeIcons.length).toBe(3)
  })

  it('fills all stars when modelValue equals max', () => {
    const wrapper = mount(Rate, { props: { modelValue: 5, max: 5 } })
    const activeIcons = wrapper.findAll('.zc-rate__icon.is-active')
    expect(activeIcons.length).toBe(5)
  })

  it('fills no stars when modelValue is 0', () => {
    const wrapper = mount(Rate, { props: { modelValue: 0 } })
    const activeIcons = wrapper.findAll('.zc-rate__icon.is-active')
    expect(activeIcons.length).toBe(0)
  })

  it('shows text when showText is true', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3, showText: true } })
    expect(wrapper.find('.zc-rate__text').exists()).toBe(true)
  })

  it('hides text when showText is false (default)', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3 } })
    expect(wrapper.find('.zc-rate__text').exists()).toBe(false)
  })

  it('shows score when showScore is true', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3.5, showScore: true } })
    expect(wrapper.find('.zc-rate__text').exists()).toBe(true)
    expect(wrapper.find('.zc-rate__text').text()).toBe('3.5')
  })

  it('emits update:modelValue on click', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 0 } })
    const thirdStar = wrapper.findAll('.zc-rate__item')[2]
    await thirdStar.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('emits change event on click', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 0 } })
    const fourthStar = wrapper.findAll('.zc-rate__item')[3]
    await fourthStar.trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('clears value when clicking same value with clearable', async () => {
    const wrapper = mount(Rate, { props: { modelValue: 3, clearable: true } })
    const thirdStar = wrapper.findAll('.zc-rate__item')[2]
    await thirdStar.trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })

  it('renders half star when allowHalf is true and value has decimal', () => {
    const wrapper = mount(Rate, { props: { modelValue: 2.5, allowHalf: true } })
    const halfStar = wrapper.find('.zc-rate__icon-half')
    expect(halfStar.exists()).toBe(true)
  })

  it('does not render half star when allowHalf is false', () => {
    const wrapper = mount(Rate, { props: { modelValue: 2.5, allowHalf: false } })
    const halfStar = wrapper.find('.zc-rate__icon-half')
    expect(halfStar.exists()).toBe(false)
  })

  it('has correct ARIA attributes', () => {
    const wrapper = mount(Rate, { props: { modelValue: 3, max: 5 } })
    expect(wrapper.find('.zc-rate').attributes('role')).toBe('slider')
    expect(wrapper.find('.zc-rate').attributes('aria-valuenow')).toBe('3')
    expect(wrapper.find('.zc-rate').attributes('aria-valuemax')).toBe('5')
  })
})
