import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Tag from '../tag/tag.vue'

describe('ZcTag', () => {
  it('renders with default props', () => {
    const wrapper = mount(Tag)
    expect(wrapper.classes()).toContain('zc-tag')
    expect(wrapper.element.tagName).toBe('SPAN')
  })

  it('renders slot content', () => {
    const wrapper = mount(Tag, { slots: { default: 'Hello' } })
    expect(wrapper.text()).toContain('Hello')
  })

  // ---- Type ----
  it('applies primary type class', () => {
    const wrapper = mount(Tag, { props: { type: 'primary' } })
    expect(wrapper.classes()).toContain('zc-tag--primary')
  })

  it('applies success type class', () => {
    const wrapper = mount(Tag, { props: { type: 'success' } })
    expect(wrapper.classes()).toContain('zc-tag--success')
  })

  it('applies warning type class', () => {
    const wrapper = mount(Tag, { props: { type: 'warning' } })
    expect(wrapper.classes()).toContain('zc-tag--warning')
  })

  it('applies danger type class', () => {
    const wrapper = mount(Tag, { props: { type: 'danger' } })
    expect(wrapper.classes()).toContain('zc-tag--danger')
  })

  it('applies info type class by default', () => {
    const wrapper = mount(Tag)
    expect(wrapper.classes()).toContain('zc-tag--info')
  })

  // ---- Effect ----
  it('applies light effect by default', () => {
    const wrapper = mount(Tag)
    expect(wrapper.classes()).toContain('zc-tag--light')
  })

  it('applies dark effect', () => {
    const wrapper = mount(Tag, { props: { effect: 'dark' } })
    expect(wrapper.classes()).toContain('zc-tag--dark')
  })

  it('applies plain effect', () => {
    const wrapper = mount(Tag, { props: { effect: 'plain' } })
    expect(wrapper.classes()).toContain('zc-tag--plain')
  })

  // ---- Round ----
  it('applies round class when round is true', () => {
    const wrapper = mount(Tag, { props: { round: true } })
    expect(wrapper.classes()).toContain('is-round')
  })

  it('does not apply round class by default', () => {
    const wrapper = mount(Tag)
    expect(wrapper.classes()).not.toContain('is-round')
  })

  // ---- Closable ----
  it('shows close icon when closable is true', () => {
    const wrapper = mount(Tag, { props: { closable: true } })
    expect(wrapper.find('.zc-tag__close').exists()).toBe(true)
  })

  it('does not show close icon by default', () => {
    const wrapper = mount(Tag)
    expect(wrapper.find('.zc-tag__close').exists()).toBe(false)
  })

  it('emits close event when close icon clicked', async () => {
    const wrapper = mount(Tag, { props: { closable: true } })
    await wrapper.find('.zc-tag__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(wrapper.emitted('close')).toHaveLength(1)
  })

  // ---- Click ----
  it('emits click event on tag click', async () => {
    const wrapper = mount(Tag)
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  // ---- Hit ----
  it('applies hit class when hit is true', () => {
    const wrapper = mount(Tag, { props: { hit: true } })
    expect(wrapper.classes()).toContain('is-hit')
  })
})
