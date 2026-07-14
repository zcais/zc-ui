import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Divider from '../divider/divider.vue'

describe('ZcDivider', () => {
  it('renders with default props', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes()).toContain('zc-divider')
    expect(wrapper.classes()).toContain('zc-divider--horizontal')
  })

  it('renders slot content', () => {
    const wrapper = mount(Divider, { slots: { default: 'Section Title' } })
    expect(wrapper.text()).toContain('Section Title')
  })

  // ---- direction ----
  it('renders horizontal by default', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes()).toContain('zc-divider--horizontal')
    expect(wrapper.classes()).not.toContain('zc-divider--vertical')
  })

  it('renders vertical when direction is vertical', () => {
    const wrapper = mount(Divider, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('zc-divider--vertical')
  })

  // ---- contentPosition ----
  it('renders left line and text wrapper when content provided', () => {
    const wrapper = mount(Divider, { slots: { default: 'Text' } })
    expect(wrapper.classes()).toContain('is-with-content')
    expect(wrapper.find('.zc-divider__text').exists()).toBe(true)
    expect(wrapper.find('.zc-divider__line--left').exists()).toBe(true)
    expect(wrapper.find('.zc-divider__line--right').exists()).toBe(true)
  })

  it('does not render text wrapper when no content', () => {
    const wrapper = mount(Divider)
    expect(wrapper.classes()).not.toContain('is-with-content')
    expect(wrapper.find('.zc-divider__text').exists()).toBe(false)
  })

  it('applies center content position by default', () => {
    const wrapper = mount(Divider, { slots: { default: 'Center' } })
    const text = wrapper.find('.zc-divider__text')
    expect(text.attributes('style')).toContain('center')
  })

  it('applies left content position', () => {
    const wrapper = mount(Divider, {
      props: { contentPosition: 'left' },
      slots: { default: 'Left' },
    })
    const text = wrapper.find('.zc-divider__text')
    expect(text.attributes('style')).toContain('left')
  })

  it('applies right content position', () => {
    const wrapper = mount(Divider, {
      props: { contentPosition: 'right' },
      slots: { default: 'Right' },
    })
    const text = wrapper.find('.zc-divider__text')
    expect(text.attributes('style')).toContain('right')
  })

  // ---- dashed ----
  it('applies dashed style when dashed is true', () => {
    const wrapper = mount(Divider, { props: { dashed: true } })
    const line = wrapper.find('.zc-divider__line')
    expect(line.attributes('style')).toContain('dashed')
  })

  it('applies solid style by default', () => {
    const wrapper = mount(Divider)
    const line = wrapper.find('.zc-divider__line')
    expect(line.attributes('style')).toContain('solid')
  })

  // ---- borderStyle ----
  it('applies dotted border style', () => {
    const wrapper = mount(Divider, { props: { borderStyle: 'dotted' } })
    const line = wrapper.find('.zc-divider__line')
    expect(line.attributes('style')).toContain('dotted')
  })

  it('dashed prop overrides borderStyle prop', () => {
    const wrapper = mount(Divider, {
      props: { dashed: true, borderStyle: 'dotted' },
    })
    const line = wrapper.find('.zc-divider__line')
    expect(line.attributes('style')).toContain('dashed')
  })

  // ---- vertical direction ----
  it('renders vertical line in vertical mode', () => {
    const wrapper = mount(Divider, { props: { direction: 'vertical' } })
    expect(wrapper.find('.zc-divider__vertical-line').exists()).toBe(true)
  })

  it('vertical divider ignores content slots', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical' },
      slots: { default: 'Ignored' },
    })
    expect(wrapper.classes()).not.toContain('is-with-content')
    expect(wrapper.find('.zc-divider__text').exists()).toBe(false)
  })

  // ---- role ----
  it('has separator role', () => {
    const wrapper = mount(Divider)
    expect(wrapper.attributes('role')).toBe('separator')
  })
})
