import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Avatar from '../avatar/avatar.vue'

describe('ZcAvatar', () => {
  it('renders with default props', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.classes()).toContain('zc-avatar')
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  // ---- Shape ----
  it('applies circle shape by default', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.classes()).toContain('zc-avatar--circle')
  })

  it('applies square shape', () => {
    const wrapper = mount(Avatar, { props: { shape: 'square' } })
    expect(wrapper.classes()).toContain('zc-avatar--square')
  })

  // ---- Size (string) ----
  it('applies large size class', () => {
    const wrapper = mount(Avatar, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('zc-avatar--large')
  })

  it('applies medium size class by default', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.classes()).toContain('zc-avatar--medium')
  })

  it('applies small size class', () => {
    const wrapper = mount(Avatar, { props: { size: 'small' } })
    expect(wrapper.classes()).toContain('zc-avatar--small')
  })

  // ---- Size (number) ----
  it('applies custom pixel size via inline style', () => {
    const wrapper = mount(Avatar, { props: { size: 64 } })
    expect(wrapper.attributes('style')).toContain('width: 64px')
    expect(wrapper.attributes('style')).toContain('height: 64px')
  })

  it('does not apply size class for numeric size', () => {
    const wrapper = mount(Avatar, { props: { size: 64 } })
    expect(wrapper.classes()).not.toContain('zc-avatar--large')
    expect(wrapper.classes()).not.toContain('zc-avatar--medium')
  })

  // ---- Image ----
  it('renders img when src is provided', () => {
    const wrapper = mount(Avatar, { props: { src: 'test.jpg' } })
    expect(wrapper.find('.zc-avatar__img').exists()).toBe(true)
    expect(wrapper.find('.zc-avatar__img').attributes('src')).toBe('test.jpg')
  })

  it('shows fallback when no src', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.find('.zc-avatar__fallback').exists()).toBe(true)
  })

  it('renders fallback icon SVG by default', () => {
    const wrapper = mount(Avatar)
    expect(wrapper.find('.zc-avatar__fallback svg').exists()).toBe(true)
  })

  it('renders custom icon when icon prop provided', () => {
    const wrapper = mount(Avatar, { props: { icon: 'icon-user' } })
    expect(wrapper.find('.icon-user').exists()).toBe(true)
  })

  it('shows fallback on image error', async () => {
    const wrapper = mount(Avatar, { props: { src: 'broken.jpg' } })
    await wrapper.find('img').trigger('error')
    expect(wrapper.find('.zc-avatar__fallback').exists()).toBe(true)
  })

  // ---- Fallback slot ----
  it('renders custom fallback slot', () => {
    const wrapper = mount(Avatar, {
      props: { src: '' },
      slots: { fallback: 'AB' },
    })
    expect(wrapper.find('.zc-avatar__fallback').text()).toContain('AB')
  })

  // ---- Default slot ----
  it('renders default slot when no src but default slot provided', () => {
    const wrapper = mount(Avatar, {
      props: { src: '' },
      slots: { default: 'JD' },
    })
    // With no src and a default slot, the default slot content is rendered
    expect(wrapper.text()).toContain('JD')
    // Fallback should NOT be rendered since default slot takes priority
    expect(wrapper.find('.zc-avatar__fallback').exists()).toBe(false)
  })
})
