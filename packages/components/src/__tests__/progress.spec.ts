import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Progress from '../progress/progress.vue'

describe('ZcProgress', () => {
  it('renders line progress with default props', () => {
    const wrapper = mount(Progress, { props: { percentage: 50 } })
    expect(wrapper.find('.zc-progress').exists()).toBe(true)
    expect(wrapper.find('.zc-progress__bar').exists()).toBe(true)
  })

  it('clamps percentage to 0-100', () => {
    const wrapper = mount(Progress, { props: { percentage: 150 } })
    expect(wrapper.find('.zc-progress__text').text()).toContain('100')
  })

  it('clamps negative percentage to 0', () => {
    const wrapper = mount(Progress, { props: { percentage: -10 } })
    expect(wrapper.find('.zc-progress__text').text()).toContain('0')
  })

  it('shows percentage text by default', () => {
    const wrapper = mount(Progress, { props: { percentage: 42 } })
    expect(wrapper.find('.zc-progress__text').text()).toContain('42')
  })

  it('hides text when showText is false', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, showText: false } })
    expect(wrapper.find('.zc-progress__text').exists()).toBe(false)
  })

  it('renders circle type', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, type: 'circle' } })
    expect(wrapper.find('.zc-progress__circle').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('renders dashboard type', () => {
    const wrapper = mount(Progress, { props: { percentage: 60, type: 'dashboard' } })
    expect(wrapper.find('.zc-progress__circle').exists()).toBe(true)
    expect(wrapper.find('svg path').exists()).toBe(true)
  })

  it('applies status color class to text', () => {
    const wrapper = mount(Progress, { props: { percentage: 100, status: 'success' } })
    expect(wrapper.find('.zc-progress__text').classes()).toContain('zc-progress__text--success')
  })

  it('applies custom color', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, color: '#ff0000' } })
    const inner = wrapper.find('.zc-progress__bar-inner')
    expect(inner.attributes('style')).toContain('background-color')
  })

  it('applies striped class', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, striped: true } })
    expect(wrapper.find('.zc-progress__bar-inner').classes()).toContain('is-striped')
  })

  it('applies striped-flow class', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, stripedFlow: true } })
    expect(wrapper.find('.zc-progress__bar-inner').classes()).toContain('is-striped-flow')
  })

  it('shows text inside when textInside and showText', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, textInside: true } })
    expect(wrapper.find('.zc-progress__text-inside').exists()).toBe(true)
  })

  it('renders circle text with slot', () => {
    const wrapper = mount(Progress, {
      props: { percentage: 75, type: 'circle' },
      slots: { default: '<span class="custom-text">3/4</span>' },
    })
    expect(wrapper.find('.custom-text').exists()).toBe(true)
  })

  it('sets stroke width on bar', () => {
    const wrapper = mount(Progress, { props: { percentage: 50, strokeWidth: 12 } })
    const bar = wrapper.find('.zc-progress__bar')
    expect(bar.attributes('style')).toContain('12px')
  })
})
