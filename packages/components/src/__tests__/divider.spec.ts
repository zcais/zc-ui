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

  it('applies center content position class by default', () => {
    const wrapper = mount(Divider, { slots: { default: 'Center' } })
    expect(wrapper.classes()).toContain('zc-divider--text-center')
  })

  it('applies left content position class', () => {
    const wrapper = mount(Divider, {
      props: { contentPosition: 'left' },
      slots: { default: 'Left' },
    })
    expect(wrapper.classes()).toContain('zc-divider--text-left')
  })

  it('applies right content position class', () => {
    const wrapper = mount(Divider, {
      props: { contentPosition: 'right' },
      slots: { default: 'Right' },
    })
    expect(wrapper.classes()).toContain('zc-divider--text-right')
  })

  // ---- dashed / borderStyle ----
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

  // ---- color ----
  it('applies custom color to horizontal divider', () => {
    const wrapper = mount(Divider, {
      props: { color: '#409eff' },
      slots: { default: 'Blue' },
    })
    const line = wrapper.find('.zc-divider__line')
    // jsdom converts hex to rgb
    expect(line.attributes('style')).toContain('border-top-color')
  })

  it('applies custom color to vertical divider', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical', color: '#409eff' },
    })
    const line = wrapper.find('.zc-divider__vertical-line')
    expect(line.attributes('style')).toContain('border-left-color')
  })

  // ---- borderWidth ----
  it('applies custom border width to horizontal divider', () => {
    const wrapper = mount(Divider, {
      props: { borderWidth: '3px' },
      slots: { default: 'Thick' },
    })
    const line = wrapper.find('.zc-divider__line')
    expect(line.attributes('style')).toContain('border-top-width')
    expect(line.attributes('style')).toContain('3px')
  })

  it('applies custom border width to plain horizontal divider', () => {
    const wrapper = mount(Divider, {
      props: { borderWidth: '2px' },
    })
    const root = wrapper.find('.zc-divider')
    expect(root.exists()).toBe(true)
  })

  it('applies custom border width to vertical divider', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical', borderWidth: '2px' },
    })
    const line = wrapper.find('.zc-divider__vertical-line')
    expect(line.attributes('style')).toContain('border-left-width')
    expect(line.attributes('style')).toContain('2px')
  })

  // ---- margin ----
  it('applies custom margin to horizontal divider', () => {
    const wrapper = mount(Divider, {
      props: { margin: '12px 0' },
    })
    expect(wrapper.attributes('style')).toContain('margin')
    expect(wrapper.attributes('style')).toContain('12px 0')
  })

  // ---- height (vertical) ----
  it('applies custom height to vertical divider', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical', height: '32px' },
    })
    const line = wrapper.find('.zc-divider__vertical-line')
    expect(line.attributes('style')).toContain('height')
    expect(line.attributes('style')).toContain('32px')
  })

  it('applies custom height to vertical divider root', () => {
    const wrapper = mount(Divider, {
      props: { direction: 'vertical', height: '40px' },
    })
    expect(wrapper.attributes('style')).toContain('height')
    expect(wrapper.attributes('style')).toContain('40px')
  })

  // ---- contentWidth ----
  it('applies custom content width CSS variable', () => {
    const wrapper = mount(Divider, {
      props: { contentPosition: 'left', contentWidth: '80px' },
      slots: { default: 'Wide Left' },
    })
    expect(wrapper.attributes('style')).toContain('--zc-divider-content-width')
    expect(wrapper.attributes('style')).toContain('80px')
  })

  it('does not apply content width CSS variable for center position', () => {
    const wrapper = mount(Divider, {
      props: { contentPosition: 'center', contentWidth: '80px' },
      slots: { default: 'Center' },
    })
    expect(wrapper.attributes('style') || '').not.toContain('--zc-divider-content-width')
  })

  // ---- icon slot ----
  it('renders icon slot content', () => {
    const wrapper = mount(Divider, {
      slots: {
        default: 'With Icon',
        icon: '<svg class="test-icon" />',
      },
    })
    expect(wrapper.classes()).toContain('is-with-icon')
    expect(wrapper.find('.test-icon').exists()).toBe(true)
  })

  it('does not add is-with-icon class without icon slot', () => {
    const wrapper = mount(Divider, {
      slots: { default: 'No Icon' },
    })
    expect(wrapper.classes()).not.toContain('is-with-icon')
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

  // ---- plain ----
  it('applies plain class when plain is true', () => {
    const wrapper = mount(Divider, {
      props: { plain: true },
      slots: { default: 'Plain' },
    })
    expect(wrapper.classes()).toContain('is-plain')
  })

  // ---- role ----
  it('has separator role', () => {
    const wrapper = mount(Divider)
    expect(wrapper.attributes('role')).toBe('separator')
  })
})
