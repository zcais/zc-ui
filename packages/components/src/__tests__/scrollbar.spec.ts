import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Scrollbar from '../scrollbar/scrollbar.vue'

describe('ZcScrollbar', () => {
  it('renders with default props', () => {
    const wrapper = mount(Scrollbar)
    expect(wrapper.classes()).toContain('zc-scrollbar')
    expect(wrapper.find('.zc-scrollbar__wrap').exists()).toBe(true)
  })

  it('renders slot content', () => {
    const wrapper = mount(Scrollbar, {
      slots: { default: '<p>Scrollable content</p>' },
    })
    expect(wrapper.text()).toContain('Scrollable content')
  })

  // ---- height / maxHeight ----
  it('applies height as px when number', () => {
    const wrapper = mount(Scrollbar, { props: { height: 300 } })
    const wrap = wrapper.find('.zc-scrollbar__wrap')
    expect(wrap.attributes('style')).toContain('height: 300px')
  })

  it('applies height as string when string', () => {
    const wrapper = mount(Scrollbar, { props: { height: '50vh' } })
    const wrap = wrapper.find('.zc-scrollbar__wrap')
    expect(wrap.attributes('style')).toContain('height: 50vh')
  })

  it('applies maxHeight as px when number', () => {
    const wrapper = mount(Scrollbar, { props: { maxHeight: 500 } })
    const wrap = wrapper.find('.zc-scrollbar__wrap')
    expect(wrap.attributes('style')).toContain('max-height: 500px')
  })

  it('does not apply height when not provided', () => {
    const wrapper = mount(Scrollbar)
    const wrap = wrapper.find('.zc-scrollbar__wrap')
    expect(wrap.attributes('style') || '').not.toContain('height:')
  })

  // ---- native ----
  it('adds is-native class when native is true', () => {
    const wrapper = mount(Scrollbar, { props: { native: true } })
    expect(wrapper.classes()).toContain('is-native')
  })

  it('does not add is-native class by default', () => {
    const wrapper = mount(Scrollbar)
    expect(wrapper.classes()).not.toContain('is-native')
  })

  // ---- always ----
  it('adds is-always class when always is true', () => {
    const wrapper = mount(Scrollbar, { props: { always: true } })
    expect(wrapper.classes()).toContain('is-always')
  })

  it('does not add is-always class by default', () => {
    const wrapper = mount(Scrollbar)
    expect(wrapper.classes()).not.toContain('is-always')
  })

  // ---- minSize removed (WebKit does not support scrollbar min-size) ----
  it('does not expose minSize prop', () => {
    const wrapper = mount(Scrollbar)
    // minSize was removed because WebKit does not support scrollbar-width min-size
    const style = wrapper.attributes('style') || ''
    expect(style).not.toContain('--zc-scrollbar-min-size')
  })

  // ---- tag ----
  it('renders div by default', () => {
    const wrapper = mount(Scrollbar)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders custom tag when specified', () => {
    const wrapper = mount(Scrollbar, { props: { tag: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  // ---- combined props ----
  it('applies multiple props simultaneously', () => {
    const wrapper = mount(Scrollbar, {
      props: { height: 200, maxHeight: 400, native: false, always: true },
    })
    const wrap = wrapper.find('.zc-scrollbar__wrap')
    expect(wrap.attributes('style')).toContain('height: 200px')
    expect(wrap.attributes('style')).toContain('max-height: 400px')
    expect(wrapper.classes()).toContain('is-always')
  })
})
