import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Empty from '../empty/empty.vue'

describe('ZcEmpty', () => {
  it('renders with default props', () => {
    const wrapper = mount(Empty)
    expect(wrapper.classes()).toContain('zc-empty')
    expect(wrapper.element.tagName).toBe('DIV')
  })

  // ---- Description ----
  it('shows default description text', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.zc-empty__description').text()).toBe('暂无数据')
  })

  it('shows custom description text', () => {
    const wrapper = mount(Empty, { props: { description: 'No results found' } })
    expect(wrapper.find('.zc-empty__description').text()).toBe('No results found')
  })

  it('renders description slot', () => {
    const wrapper = mount(Empty, {
      slots: { description: 'Custom description' },
    })
    expect(wrapper.find('.zc-empty__description').text()).toBe('Custom description')
  })

  // ---- Image ----
  it('shows default SVG when no image prop', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.zc-empty__default').exists()).toBe(true)
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  it('shows custom image when image prop provided', () => {
    const wrapper = mount(Empty, { props: { image: 'empty.png' } })
    expect(wrapper.find('img').exists()).toBe(true)
    expect(wrapper.find('img').attributes('src')).toBe('empty.png')
  })

  it('renders image slot', () => {
    const wrapper = mount(Empty, {
      slots: { image: '<div class="custom-image">IMG</div>' },
    })
    expect(wrapper.find('.custom-image').exists()).toBe(true)
  })

  // ---- Image size ----
  it('applies custom image size', () => {
    const wrapper = mount(Empty, { props: { imageSize: 120 } })
    const style = wrapper.find('.zc-empty__image').attributes('style')
    expect(style).toContain('width: 120px')
    expect(style).toContain('height: 120px')
  })

  // ---- Extra slot ----
  it('renders extra content via default slot', () => {
    const wrapper = mount(Empty, {
      slots: { default: '<button>Retry</button>' },
    })
    expect(wrapper.find('.zc-empty__extra').exists()).toBe(true)
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('does not render extra slot when not provided', () => {
    const wrapper = mount(Empty)
    expect(wrapper.find('.zc-empty__extra').exists()).toBe(false)
  })
})
