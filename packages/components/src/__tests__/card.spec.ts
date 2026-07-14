import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Card from '../card/card.vue'

describe('ZcCard', () => {
  it('renders with default props', () => {
    const wrapper = mount(Card)
    expect(wrapper.classes()).toContain('zc-card')
  })

  it('renders default slot content', () => {
    const wrapper = mount(Card, { slots: { default: 'Card body content' } })
    expect(wrapper.find('.zc-card__body').text()).toContain('Card body content')
  })

  // ---- shadow ----
  it('applies shadow-always class by default', () => {
    const wrapper = mount(Card)
    expect(wrapper.classes()).toContain('zc-card--shadow-always')
  })

  it('applies shadow-hover class', () => {
    const wrapper = mount(Card, { props: { shadow: 'hover' } })
    expect(wrapper.classes()).toContain('zc-card--shadow-hover')
  })

  it('applies shadow-never class', () => {
    const wrapper = mount(Card, { props: { shadow: 'never' } })
    expect(wrapper.classes()).toContain('zc-card--shadow-never')
  })

  // ---- header ----
  it('renders header from prop', () => {
    const wrapper = mount(Card, { props: { header: 'My Title' } })
    expect(wrapper.find('.zc-card__header').exists()).toBe(true)
    expect(wrapper.find('.zc-card__header-title').text()).toBe('My Title')
  })

  it('renders header from slot instead of prop', () => {
    const wrapper = mount(Card, {
      props: { header: 'Prop Title' },
      slots: { header: '<span class="custom-header">Slot Title</span>' },
    })
    expect(wrapper.find('.zc-card__header').exists()).toBe(true)
    expect(wrapper.find('.custom-header').exists()).toBe(true)
    expect(wrapper.find('.custom-header').text()).toBe('Slot Title')
  })

  it('does not render header when neither prop nor slot provided', () => {
    const wrapper = mount(Card)
    expect(wrapper.find('.zc-card__header').exists()).toBe(false)
  })

  // ---- footer ----
  it('renders footer when footer slot provided', () => {
    const wrapper = mount(Card, {
      slots: { footer: 'Footer text' },
    })
    expect(wrapper.find('.zc-card__footer').exists()).toBe(true)
    expect(wrapper.find('.zc-card__footer').text()).toContain('Footer text')
  })

  it('does not render footer when not provided', () => {
    const wrapper = mount(Card)
    expect(wrapper.find('.zc-card__footer').exists()).toBe(false)
  })

  // ---- bodyStyle ----
  it('applies bodyStyle as string', () => {
    const wrapper = mount(Card, {
      props: { bodyStyle: 'padding: 20px;' },
    })
    const body = wrapper.find('.zc-card__body')
    expect(body.attributes('style')).toContain('padding: 20px')
  })

  it('applies bodyStyle as object', () => {
    const wrapper = mount(Card, {
      props: { bodyStyle: { padding: '20px', background: 'red' } },
    })
    const body = wrapper.find('.zc-card__body')
    const style = body.attributes('style') || ''
    expect(style).toContain('padding: 20px')
    expect(style).toContain('background: red')
  })

  // ---- bodyClass ----
  it('applies bodyClass to body element', () => {
    const wrapper = mount(Card, {
      props: { bodyClass: 'custom-body-class' },
    })
    expect(wrapper.find('.zc-card__body').classes()).toContain('custom-body-class')
  })

  // ---- combined ----
  it('renders all sections together', () => {
    const wrapper = mount(Card, {
      props: { header: 'Title', shadow: 'never' },
      slots: {
        default: 'Body',
        footer: 'Footer',
      },
    })
    expect(wrapper.find('.zc-card__header').exists()).toBe(true)
    expect(wrapper.find('.zc-card__body').text()).toBe('Body')
    expect(wrapper.find('.zc-card__footer').text()).toBe('Footer')
    expect(wrapper.classes()).toContain('zc-card--shadow-never')
  })
})
