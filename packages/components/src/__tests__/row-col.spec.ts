import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Row from '../row/row.vue'
import Col from '../col/col.vue'

describe('ZcRow', () => {
  it('renders with default props', () => {
    const wrapper = mount(Row)
    expect(wrapper.classes()).toContain('zc-row')
  })

  it('renders default tag as div', () => {
    const wrapper = mount(Row)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Row, { props: { tag: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('applies wrap class when wrap=true', () => {
    const wrapper = mount(Row, { props: { wrap: true } })
    expect(wrapper.classes()).toContain('is-wrap')
  })

  it('does not apply wrap class by default', () => {
    const wrapper = mount(Row)
    expect(wrapper.classes()).not.toContain('is-wrap')
  })

  it('applies justify-content style', () => {
    const wrapper = mount(Row, { props: { justify: 'center' } })
    expect(wrapper.attributes('style')).toContain('justify-content: center')
  })

  it('applies align-items style', () => {
    const wrapper = mount(Row, { props: { align: 'middle' } })
    expect(wrapper.attributes('style')).toContain('align-items: center')
  })

  it('applies space-between justify', () => {
    const wrapper = mount(Row, { props: { justify: 'space-between' } })
    expect(wrapper.attributes('style')).toContain('justify-content: space-between')
  })

  it('applies bottom align', () => {
    const wrapper = mount(Row, { props: { align: 'bottom' } })
    expect(wrapper.attributes('style')).toContain('align-items: flex-end')
  })

  it('applies stretch align', () => {
    const wrapper = mount(Row, { props: { align: 'stretch' } })
    expect(wrapper.attributes('style')).toContain('align-items: stretch')
  })

  it('renders slot content', () => {
    const wrapper = mount(Row, {
      slots: { default: '<div class="child">content</div>' },
    })
    expect(wrapper.find('.child').exists()).toBe(true)
  })

  // ---- Gutter tests ----
  it('applies negative margins for number gutter', () => {
    const wrapper = mount(Row, { props: { gutter: 20 } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-left: -10px')
    expect(style).toContain('margin-right: -10px')
  })

  it('does not apply negative margins when gutter is 0', () => {
    const wrapper = mount(Row, { props: { gutter: 0 } })
    const style = wrapper.attributes('style') || ''
    expect(style).not.toContain('margin-left')
  })

  it('applies row-gap for vertical gutter in array form', () => {
    const wrapper = mount(Row, { props: { gutter: [20, 10] } })
    const style = wrapper.attributes('style')
    expect(style).toContain('margin-left: -10px')
    expect(style).toContain('row-gap: 10px')
  })

  it('applies justify space-evenly', () => {
    const wrapper = mount(Row, { props: { justify: 'space-evenly' } })
    expect(wrapper.attributes('style')).toContain('justify-content: space-evenly')
  })

  it('applies justify flex-start (start)', () => {
    const wrapper = mount(Row, { props: { justify: 'start' } })
    expect(wrapper.attributes('style')).toContain('justify-content: flex-start')
  })

  it('applies justify flex-end (end)', () => {
    const wrapper = mount(Row, { props: { justify: 'end' } })
    expect(wrapper.attributes('style')).toContain('justify-content: flex-end')
  })

  it('applies justify space-around', () => {
    const wrapper = mount(Row, { props: { justify: 'space-around' } })
    expect(wrapper.attributes('style')).toContain('justify-content: space-around')
  })

  it('applies align flex-start (top)', () => {
    const wrapper = mount(Row, { props: { align: 'top' } })
    expect(wrapper.attributes('style')).toContain('align-items: flex-start')
  })
})

describe('ZcCol', () => {
  it('renders with default props (span=24)', () => {
    const wrapper = mount(Col)
    expect(wrapper.classes()).toContain('zc-col')
    expect(wrapper.classes()).toContain('zc-col--24')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Col, { props: { tag: 'li' } })
    expect(wrapper.element.tagName).toBe('LI')
  })

  it('applies span class', () => {
    const wrapper = mount(Col, { props: { span: 12 } })
    expect(wrapper.classes()).toContain('zc-col--12')
  })

  it('sets span as CSS variable', () => {
    const wrapper = mount(Col, { props: { span: 12 } })
    expect(wrapper.attributes('style')).toContain('--zc-col-span: 12')
  })

  it('applies offset class', () => {
    const wrapper = mount(Col, { props: { offset: 6 } })
    expect(wrapper.classes()).toContain('zc-col--offset-6')
  })

  it('sets offset as CSS variable', () => {
    const wrapper = mount(Col, { props: { offset: 6 } })
    expect(wrapper.attributes('style')).toContain('--zc-col-offset: 6')
  })

  it('applies push style', () => {
    const wrapper = mount(Col, { props: { push: 4 } })
    expect(wrapper.attributes('style')).toContain('left: 16.666')
  })

  it('applies pull style', () => {
    const wrapper = mount(Col, { props: { pull: 4 } })
    expect(wrapper.attributes('style')).toContain('right: 16.666')
  })

  it('renders slot content', () => {
    const wrapper = mount(Col, {
      slots: { default: '<span>col content</span>' },
    })
    expect(wrapper.text()).toContain('col content')
  })

  it('applies responsive breakpoint classes (number)', () => {
    const wrapper = mount(Col, { props: { xs: 24, sm: 12, md: 8 } })
    expect(wrapper.classes()).toContain('zc-col--xs-24')
    expect(wrapper.classes()).toContain('zc-col--sm-12')
    expect(wrapper.classes()).toContain('zc-col--md-8')
    // CSS custom properties are also set as inline styles
    expect(wrapper.attributes('style')).toContain('--zc-col-span-xs: 24')
    expect(wrapper.attributes('style')).toContain('--zc-col-span-sm: 12')
    expect(wrapper.attributes('style')).toContain('--zc-col-span-md: 8')
  })

  /*
   * Note: jsdom does not evaluate CSS media queries, so the actual
   * width change at each breakpoint cannot be verified in unit tests.
   * The CSS rules in col.vue's <style> block handle this at runtime.
   * Visual regression / E2E tests should cover responsive behavior.
   */

  it('applies responsive breakpoint classes (object)', () => {
    const wrapper = mount(Col, {
      props: { sm: { span: 12, offset: 6 } },
    })
    expect(wrapper.classes()).toContain('zc-col--sm-12')
    expect(wrapper.classes()).toContain('zc-col--sm-offset-6')
  })

  it('applies lg and xl breakpoint classes', () => {
    const wrapper = mount(Col, { props: { lg: 6, xl: 4 } })
    expect(wrapper.classes()).toContain('zc-col--lg-6')
    expect(wrapper.classes()).toContain('zc-col--xl-4')
  })

  it('does not render span class for 0 span', () => {
    const wrapper = mount(Col, { props: { span: 0 } })
    expect(wrapper.classes()).not.toContain('zc-col--0')
  })
})

describe('ZcRow + ZcCol integration', () => {
  it('injects gutter from Row to Col', () => {
    const wrapper = mount(Row, {
      props: { gutter: 20 },
      slots: {
        default: () => mount(Col, { props: { span: 12 } }).html(),
      },
    })
    // The Row itself should have negative margins
    expect(wrapper.attributes('style')).toContain('margin-left: -10px')
  })

  it('Col receives gutter padding when inside Row', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: '<Row :gutter="20"><Col :span="12">A</Col></Row>',
    })
    const col = wrapper.findComponent(Col)
    expect(col.attributes('style')).toContain('padding-left: 10px')
    expect(col.attributes('style')).toContain('padding-right: 10px')
  })

  it('Col does not have padding when no Row parent', () => {
    const wrapper = mount(Col, { props: { span: 12 } })
    const style = wrapper.attributes('style') || ''
    expect(style).not.toContain('padding-left')
  })

  it('Col with array gutter from Row', () => {
    const wrapper = mount({
      components: { Row, Col },
      template: '<Row :gutter="[20, 10]"><Col :span="24">B</Col></Row>',
    })
    const col = wrapper.findComponent(Col)
    expect(col.attributes('style')).toContain('padding-left: 10px')
  })
})
