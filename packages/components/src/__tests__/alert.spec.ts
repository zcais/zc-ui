import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Alert from '../alert/alert.vue'

describe('ZcAlert', () => {
  it('renders with default props', () => {
    const wrapper = mount(Alert, {
      props: { title: 'Test Alert' },
    })
    expect(wrapper.find('.zc-alert').exists()).toBe(true)
    expect(wrapper.find('.zc-alert__title').text()).toBe('Test Alert')
  })

  it('applies type class', () => {
    const wrapper = mount(Alert, { props: { title: 'T', type: 'success' } })
    expect(wrapper.find('.zc-alert').classes()).toContain('zc-alert--success')
  })

  it('applies warning type class', () => {
    const wrapper = mount(Alert, { props: { title: 'T', type: 'warning' } })
    expect(wrapper.find('.zc-alert').classes()).toContain('zc-alert--warning')
  })

  it('applies error type class', () => {
    const wrapper = mount(Alert, { props: { title: 'T', type: 'error' } })
    expect(wrapper.find('.zc-alert').classes()).toContain('zc-alert--error')
  })

  it('shows icon when showIcon is true', () => {
    const wrapper = mount(Alert, { props: { title: 'T', showIcon: true } })
    expect(wrapper.find('.zc-alert__icon').exists()).toBe(true)
  })

  it('hides icon by default', () => {
    const wrapper = mount(Alert, { props: { title: 'T' } })
    expect(wrapper.find('.zc-alert__icon').exists()).toBe(false)
  })

  it('shows description', () => {
    const wrapper = mount(Alert, { props: { title: 'T', description: 'Detailed info' } })
    expect(wrapper.find('.zc-alert__description').text()).toBe('Detailed info')
  })

  it('applies center class', () => {
    const wrapper = mount(Alert, { props: { title: 'T', center: true } })
    expect(wrapper.find('.zc-alert').classes()).toContain('is-center')
  })

  it('applies dark effect class', () => {
    const wrapper = mount(Alert, { props: { title: 'T', effect: 'dark' } })
    expect(wrapper.find('.zc-alert').classes()).toContain('is-dark')
  })

  it('emits close event when close button clicked', async () => {
    const wrapper = mount(Alert, { props: { title: 'T', closable: true } })
    await wrapper.find('.zc-alert__close').trigger('click')
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('hides after close', async () => {
    const wrapper = mount(Alert, { props: { title: 'T', closable: true } })
    await wrapper.find('.zc-alert__close').trigger('click')
    expect(wrapper.find('.zc-alert').exists()).toBe(false)
  })

  it('hides close button when closable is false', () => {
    const wrapper = mount(Alert, { props: { title: 'T', closable: false } })
    expect(wrapper.find('.zc-alert__close').exists()).toBe(false)
  })

  it('shows close text', () => {
    const wrapper = mount(Alert, { props: { title: 'T', closable: true, closeText: 'Dismiss' } })
    expect(wrapper.find('.zc-alert__close-text').text()).toBe('Dismiss')
  })

  it('renders default slot', () => {
    const wrapper = mount(Alert, {
      props: { title: 'T' },
      slots: { default: '<span class="custom">Extra</span>' },
    })
    expect(wrapper.find('.custom').exists()).toBe(true)
  })
})
