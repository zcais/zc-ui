import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Flex from '../flex/flex.vue'

describe('ZcFlex', () => {
  // ------------------------------------------------------------------ basic
  it('renders with default props', () => {
    const wrapper = mount(Flex)
    expect(wrapper.classes()).toContain('zc-flex')
  })

  it('renders default slot content', () => {
    const wrapper = mount(Flex, {
      slots: { default: '<span class="child">A</span>' },
    })
    expect(wrapper.find('.child').exists()).toBe(true)
    expect(wrapper.text()).toContain('A')
  })

  it('renders as div by default', () => {
    const wrapper = mount(Flex)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  // ------------------------------------------------------------------- tag
  it('renders as a custom tag', () => {
    const wrapper = mount(Flex, { props: { tag: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  // ------------------------------------------------------------ direction
  it('applies horizontal class by default', () => {
    const wrapper = mount(Flex)
    expect(wrapper.classes()).toContain('is-horizontal')
    expect(wrapper.classes()).not.toContain('is-vertical')
  })

  it('applies vertical class and column direction', () => {
    const wrapper = mount(Flex, { props: { vertical: true } })
    expect(wrapper.classes()).toContain('is-vertical')
    expect(wrapper.classes()).not.toContain('is-horizontal')
    expect(wrapper.attributes('style')).toContain('flex-direction: column')
  })

  it('does not emit flex-direction when vertical is false (CSS default row)', () => {
    const wrapper = mount(Flex, { props: { vertical: false } })
    expect(wrapper.attributes('style')).not.toContain('flex-direction')
  })

  // -------------------------------------------------------------- justify
  it.each([
    ['center'],
    ['flex-end'],
    ['space-between'],
    ['space-around'],
    ['space-evenly'],
  ] as const)('applies justify="%s"', (justify) => {
    const wrapper = mount(Flex, { props: { justify } })
    expect(wrapper.attributes('style')).toContain(`justify-content: ${justify}`)
  })

  it('does not emit justify-content for default "flex-start" (CSS default)', () => {
    const wrapper = mount(Flex)
    expect(wrapper.attributes('style')).not.toContain('justify-content')
  })

  // ---------------------------------------------------------------- align
  it.each([
    ['flex-start'],
    ['center'],
    ['flex-end'],
    ['stretch'],
    ['baseline'],
  ] as const)('applies align="%s"', (align) => {
    const wrapper = mount(Flex, { props: { align } })
    expect(wrapper.attributes('style')).toContain(`align-items: ${align}`)
  })

  // ------------------------------------------------------------------ wrap
  it.each([
    ['wrap'],
    ['wrap-reverse'],
  ] as const)('applies wrap="%s"', (wrap) => {
    const wrapper = mount(Flex, { props: { wrap } })
    expect(wrapper.attributes('style')).toContain(`flex-wrap: ${wrap}`)
  })

  it('does not emit flex-wrap for default "nowrap" (CSS default)', () => {
    const wrapper = mount(Flex)
    expect(wrapper.attributes('style')).not.toContain('flex-wrap')
  })

  // ------------------------------------------------------------------- gap
  it('applies numeric gap in px', () => {
    const wrapper = mount(Flex, { props: { gap: 20 } })
    expect(wrapper.attributes('style')).toContain('gap: 20px')
  })

  it('applies gap="small" via CSS variable', () => {
    const wrapper = mount(Flex, { props: { gap: 'small' } })
    expect(wrapper.attributes('style')).toContain(
      'gap: var(--zc-flex-gap-small, 8px)',
    )
  })

  it('applies gap="middle" via CSS variable', () => {
    const wrapper = mount(Flex, { props: { gap: 'middle' } })
    expect(wrapper.attributes('style')).toContain(
      'gap: var(--zc-flex-gap-middle, 16px)',
    )
  })

  it('applies gap="large" via CSS variable', () => {
    const wrapper = mount(Flex, { props: { gap: 'large' } })
    expect(wrapper.attributes('style')).toContain(
      'gap: var(--zc-flex-gap-large, 24px)',
    )
  })

  it('does not emit gap when gap is 0 (default)', () => {
    const wrapper = mount(Flex)
    expect(wrapper.attributes('style')).not.toContain('gap')
  })

  // ------------------------------------------------------------------ flex
  it('applies numeric flex shorthand', () => {
    const wrapper = mount(Flex, { props: { flex: 1 } })
    expect(wrapper.attributes('style')).toContain('flex: 1')
  })

  it('applies string flex shorthand', () => {
    const wrapper = mount(Flex, { props: { flex: '1 1 200px' } })
    expect(wrapper.attributes('style')).toContain('flex: 1 1 200px')
  })

  it('does not set flex when undefined', () => {
    const wrapper = mount(Flex)
    expect(wrapper.attributes('style')).not.toContain('flex:')
  })

  // -------------------------------------------------- clean inline styles
  it('emits minimal inline style with all defaults', () => {
    const wrapper = mount(Flex)
    const style = wrapper.attributes('style') || ''
    // With all defaults: only align-items:flex-start should be present
    // (flex-start ≠ CSS default 'stretch')
    expect(style).toContain('align-items: flex-start')
    // No other flex properties should be emitted
    expect(style).not.toContain('flex-direction')
    expect(style).not.toContain('justify-content')
    expect(style).not.toContain('flex-wrap')
    expect(style).not.toContain('gap')
    expect(style).not.toMatch(/\bflex\b(?!-)/) // 'flex' but not 'flex-*'
  })

  // --------------------------------------------------------- combinations
  it('combines multiple props correctly', () => {
    const wrapper = mount(Flex, {
      props: {
        vertical: true,
        justify: 'center',
        align: 'stretch',
        wrap: 'wrap',
        gap: 'middle',
      },
    })
    const style = wrapper.attributes('style')
    expect(style).toContain('flex-direction: column')
    expect(style).toContain('justify-content: center')
    expect(style).toContain('align-items: stretch')
    expect(style).toContain('flex-wrap: wrap')
    expect(style).toContain('var(--zc-flex-gap-middle, 16px)')
  })

  it('renders multiple slot children', () => {
    const wrapper = mount(Flex, {
      slots: {
        default: '<span>A</span><span>B</span><span>C</span>',
      },
    })
    expect(wrapper.findAll('span')).toHaveLength(3)
  })
})
