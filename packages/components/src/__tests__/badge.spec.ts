import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Badge from '../badge/badge.vue'

describe('ZcBadge', () => {
  it('renders with default props', () => {
    const wrapper = mount(Badge)
    expect(wrapper.classes()).toContain('zc-badge')
  })

  it('renders slot content', () => {
    const wrapper = mount(Badge, { slots: { default: 'Content' } })
    expect(wrapper.text()).toContain('Content')
  })

  // ---- value ----
  it('displays numeric value', () => {
    const wrapper = mount(Badge, { props: { value: 5 } })
    expect(wrapper.text()).toContain('5')
  })

  it('displays string value', () => {
    const wrapper = mount(Badge, { props: { value: 'New' } })
    expect(wrapper.text()).toContain('New')
  })

  it('shows max+ when value exceeds max', () => {
    const wrapper = mount(Badge, { props: { value: 150, max: 99 } })
    expect(wrapper.text()).toContain('99+')
  })

  it('shows exact value when value equals max', () => {
    const wrapper = mount(Badge, { props: { value: 99, max: 99 } })
    expect(wrapper.text()).toContain('99')
    expect(wrapper.text()).not.toContain('99+')
  })

  // ---- isDot ----
  it('shows dot badge when isDot is true', () => {
    const wrapper = mount(Badge, { props: { isDot: true } })
    const badge = wrapper.find('.zc-badge__content')
    expect(badge.exists()).toBe(true)
    expect(badge.classes()).toContain('is-dot')
  })

  it('dot badge does not show text', () => {
    const wrapper = mount(Badge, { props: { isDot: true, value: 5 } })
    const badge = wrapper.find('.zc-badge__content')
    expect(badge.text()).toBe('')
  })

  // ---- hidden ----
  it('hides badge when hidden is true', () => {
    const wrapper = mount(Badge, { props: { value: 5, hidden: true } })
    expect(wrapper.find('.zc-badge__content').exists()).toBe(false)
  })

  // ---- type ----
  it('applies primary type class', () => {
    const wrapper = mount(Badge, { props: { value: 1, type: 'primary' } })
    expect(wrapper.find('.zc-badge__content').classes()).toContain('zc-badge__content--primary')
  })

  it('applies success type class', () => {
    const wrapper = mount(Badge, { props: { value: 1, type: 'success' } })
    expect(wrapper.find('.zc-badge__content').classes()).toContain('zc-badge__content--success')
  })

  it('applies warning type class', () => {
    const wrapper = mount(Badge, { props: { value: 1, type: 'warning' } })
    expect(wrapper.find('.zc-badge__content').classes()).toContain('zc-badge__content--warning')
  })

  it('applies info type class', () => {
    const wrapper = mount(Badge, { props: { value: 1, type: 'info' } })
    expect(wrapper.find('.zc-badge__content').classes()).toContain('zc-badge__content--info')
  })

  it('applies danger type by default', () => {
    const wrapper = mount(Badge, { props: { value: 1 } })
    expect(wrapper.find('.zc-badge__content').classes()).toContain('zc-badge__content--danger')
  })

  it('hides badge when value is 0', () => {
    const wrapper = mount(Badge, { props: { value: 0 } })
    expect(wrapper.find('.zc-badge__content').exists()).toBe(false)
  })
})
