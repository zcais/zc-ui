import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Backtop from '../backtop/backtop.vue'

describe('ZcBacktop', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    vi.restoreAllMocks()
  })

  it('renders with correct class', () => {
    const wrapper = mount(Backtop, {
      props: { visibilityHeight: 0 },
    })
    expect(wrapper.find('.zc-backtop').exists()).toBe(true)
  })

  it('applies position style when visible', () => {
    const wrapper = mount(Backtop, {
      props: { right: 100, bottom: 50, position: 'bottom-right', visibilityHeight: 0 },
    })
    const el = wrapper.find('.zc-backtop')
    expect(el.exists()).toBe(true)
    const style = (el.element as HTMLElement).style
    expect(style.right).toBe('100px')
    expect(style.bottom).toBe('50px')
  })

  it('applies position-left style when visible', () => {
    const wrapper = mount(Backtop, {
      props: { left: 80, bottom: 40, position: 'bottom-left', visibilityHeight: 0 },
    })
    const el = wrapper.find('.zc-backtop')
    expect(el.exists()).toBe(true)
    const style = (el.element as HTMLElement).style
    expect(style.left).toBe('80px')
  })

  it('renders default slot content', () => {
    const wrapper = mount(Backtop, {
      props: { visibilityHeight: 0 },
      slots: { default: '<span>Top</span>' },
    })
    expect(wrapper.text()).toContain('Top')
  })

  it('renders default arrow icon when no slot', () => {
    const wrapper = mount(Backtop, {
      props: { visibilityHeight: 0 },
    })
    expect(wrapper.find('svg').exists()).toBe(true)
  })

  // ---- Bug #20: Backtop correct position mapping ----
  it('uses left prop for left positions', () => {
    const wrapper = mount(Backtop, {
      props: { left: 50, position: 'bottom-left', visibilityHeight: 0 },
    })
    const style = (wrapper.find('.zc-backtop').element as HTMLElement).style
    expect(style.left).toBe('50px')
    expect(style.right).toBe('')
  })

  it('uses top prop for top positions', () => {
    const wrapper = mount(Backtop, {
      props: { top: 30, position: 'top-right', visibilityHeight: 0 },
    })
    const style = (wrapper.find('.zc-backtop').element as HTMLElement).style
    expect(style.top).toBe('30px')
    expect(style.bottom).toBe('')
  })

  it('uses right and bottom for bottom-right default', () => {
    const wrapper = mount(Backtop, {
      props: { right: 40, bottom: 40, position: 'bottom-right', visibilityHeight: 0 },
    })
    const style = (wrapper.find('.zc-backtop').element as HTMLElement).style
    expect(style.right).toBe('40px')
    expect(style.bottom).toBe('40px')
  })
})
