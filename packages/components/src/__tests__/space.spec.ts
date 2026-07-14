import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Space from '../space/space.vue'

describe('ZcSpace', () => {
  it('renders with default props', () => {
    const wrapper = mount(Space)
    expect(wrapper.classes()).toContain('zc-space')
  })

  it('renders default tag as div', () => {
    const wrapper = mount(Space)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Space, { props: { tag: 'span' } })
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('applies horizontal direction class by default', () => {
    const wrapper = mount(Space)
    expect(wrapper.classes()).toContain('is-horizontal')
  })

  it('applies vertical direction class', () => {
    const wrapper = mount(Space, { props: { direction: 'vertical' } })
    expect(wrapper.classes()).toContain('is-vertical')
  })

  it('applies wrap class when wrap=true', () => {
    const wrapper = mount(Space, { props: { wrap: true } })
    expect(wrapper.classes()).toContain('is-wrap')
  })

  it('applies fill class when fill=true', () => {
    const wrapper = mount(Space, { props: { fill: true } })
    expect(wrapper.classes()).toContain('is-fill')
  })

  it('applies fill class when fill="fill"', () => {
    const wrapper = mount(Space, { props: { fill: 'fill' } })
    expect(wrapper.classes()).toContain('is-fill')
  })

  it('renders slot content with multiple children', () => {
    const wrapper = mount(Space, {
      slots: {
        default: '<span>A</span><span>B</span><span>C</span>',
      },
    })
    expect(wrapper.text()).toContain('A')
    expect(wrapper.text()).toContain('B')
    expect(wrapper.text()).toContain('C')
  })

  // ---- Size tests ----
  it('applies medium size gap by default (12px)', () => {
    const wrapper = mount(Space)
    expect(wrapper.attributes('style')).toContain('column-gap: 12px')
  })

  it('applies small size gap (8px)', () => {
    const wrapper = mount(Space, { props: { size: 'small' } })
    expect(wrapper.attributes('style')).toContain('column-gap: 8px')
  })

  it('applies large size gap (24px)', () => {
    const wrapper = mount(Space, { props: { size: 'large' } })
    expect(wrapper.attributes('style')).toContain('column-gap: 24px')
  })

  it('applies numeric size gap', () => {
    const wrapper = mount(Space, { props: { size: 20 } })
    expect(wrapper.attributes('style')).toContain('column-gap: 20px')
  })

  it('applies tuple size gap [horizontal, vertical]', () => {
    const wrapper = mount(Space, { props: { size: [10, 20] } })
    expect(wrapper.attributes('style')).toContain('column-gap: 10px')
    expect(wrapper.attributes('style')).toContain('row-gap: 20px')
  })

  // ---- Direction tests ----
  it('applies row-gap for vertical direction', () => {
    const wrapper = mount(Space, { props: { direction: 'vertical', size: 16 } })
    const style = wrapper.attributes('style')
    expect(style).toContain('row-gap: 16px')
    expect(style).toContain('flex-direction: column')
  })

  it('applies flex-direction row for horizontal', () => {
    const wrapper = mount(Space)
    expect(wrapper.attributes('style')).toContain('flex-direction: row')
  })

  // ---- Alignment tests ----
  it('applies center alignment', () => {
    const wrapper = mount(Space, { props: { alignment: 'center' } })
    expect(wrapper.attributes('style')).toContain('align-items: center')
  })

  it('applies end alignment', () => {
    const wrapper = mount(Space, { props: { alignment: 'end' } })
    expect(wrapper.attributes('style')).toContain('align-items: flex-end')
  })

  it('applies start alignment (default)', () => {
    const wrapper = mount(Space)
    expect(wrapper.attributes('style')).toContain('align-items: flex-start')
  })

  it('applies baseline alignment', () => {
    const wrapper = mount(Space, { props: { alignment: 'baseline' } })
    expect(wrapper.attributes('style')).toContain('align-items: baseline')
  })

  it('applies stretch alignment', () => {
    const wrapper = mount(Space, { props: { alignment: 'stretch' } })
    expect(wrapper.attributes('style')).toContain('align-items: stretch')
  })

  // ---- Wrap tests ----
  it('applies flex-wrap nowrap by default', () => {
    const wrapper = mount(Space)
    expect(wrapper.attributes('style')).toContain('flex-wrap: nowrap')
  })

  it('applies flex-wrap wrap when wrap=true', () => {
    const wrapper = mount(Space, { props: { wrap: true } })
    expect(wrapper.attributes('style')).toContain('flex-wrap: wrap')
  })

  // ---- Spacer tests ----
  it('renders string spacer between items', () => {
    const wrapper = mount(Space, {
      props: { spacer: '|' },
      slots: {
        default: '<span>A</span><span>B</span>',
      },
    })
    expect(wrapper.findAll('.zc-space__spacer')).toHaveLength(1)
    expect(wrapper.find('.zc-space__spacer').text()).toContain('|')
  })

  // ---- Integration ----
  it('renders as inline-flex by default', () => {
    const wrapper = mount(Space)
    // Default display is inline-flex via CSS class
    expect(wrapper.classes()).toContain('zc-space')
  })

  it('renders as flex when fill', () => {
    const wrapper = mount(Space, { props: { fill: true } })
    expect(wrapper.classes()).toContain('is-fill')
  })

  // ---- Bug #17: Space spacer uses v-text, not v-html (XSS prevention) ----
  it('spacer text is not rendered as HTML', () => {
    const wrapper = mount(Space, {
      props: { spacer: '<script>alert(1)</script>' },
      slots: {
        default: '<span>A</span><span>B</span>',
      },
    })
    const html = wrapper.html()
    // The spacer should be rendered as text, not as an actual script element
    expect(html).not.toContain('<script>alert(1)</script>')
    // It should be escaped
    expect(html.toLowerCase()).toContain('&lt;script&gt;')
  })
})
