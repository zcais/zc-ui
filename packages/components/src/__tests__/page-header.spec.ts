import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import PageHeader from '../page-header/page-header.vue'

describe('ZcPageHeader', () => {
  it('renders with default props', () => {
    const wrapper = mount(PageHeader)
    expect(wrapper.find('.zc-page-header').exists()).toBe(true)
  })

  it('displays title', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'My Title' },
    })
    expect(wrapper.find('.zc-page-header__title').text()).toBe('My Title')
  })

  it('displays subtitle', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Title', subtitle: 'My Subtitle' },
    })
    expect(wrapper.find('.zc-page-header__subtitle').text()).toBe('My Subtitle')
  })

  it('shows back button by default', () => {
    const wrapper = mount(PageHeader)
    expect(wrapper.find('.zc-page-header__back').exists()).toBe(true)
  })

  it('hides back button when showBack is false', () => {
    const wrapper = mount(PageHeader, {
      props: { showBack: false },
    })
    expect(wrapper.find('.zc-page-header__back').exists()).toBe(false)
  })

  it('emits back event on back button click', async () => {
    const wrapper = mount(PageHeader)
    await wrapper.find('.zc-page-header__back').trigger('click')
    expect(wrapper.emitted('back')).toBeTruthy()
  })

  it('renders breadcrumb slot', () => {
    const wrapper = mount(PageHeader, {
      slots: { breadcrumb: '<nav class="custom-breadcrumb">Home / Page</nav>' },
    })
    expect(wrapper.find('.custom-breadcrumb').exists()).toBe(true)
    expect(wrapper.find('.zc-page-header__breadcrumb').exists()).toBe(true)
  })

  it('renders title slot overriding prop', () => {
    const wrapper = mount(PageHeader, {
      props: { title: 'Prop Title' },
      slots: { title: '<span class="custom-title">Slot Title</span>' },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.zc-page-header__title').exists()).toBe(false)
  })

  it('renders subtitle slot overriding prop', () => {
    const wrapper = mount(PageHeader, {
      props: { subtitle: 'Prop Subtitle' },
      slots: { subtitle: '<span class="custom-sub">Slot Subtitle</span>' },
    })
    expect(wrapper.find('.custom-sub').exists()).toBe(true)
  })

  it('renders extra slot', () => {
    const wrapper = mount(PageHeader, {
      slots: { extra: '<button class="action-btn">Action</button>' },
    })
    expect(wrapper.find('.zc-page-header__extra').exists()).toBe(true)
    expect(wrapper.find('.action-btn').exists()).toBe(true)
  })

  it('renders footer slot', () => {
    const wrapper = mount(PageHeader, {
      slots: { footer: '<div class="custom-footer">Footer content</div>' },
    })
    expect(wrapper.find('.zc-page-header__footer').exists()).toBe(true)
    expect(wrapper.find('.custom-footer').exists()).toBe(true)
  })

  it('applies ghost class when ghost prop is true', () => {
    const wrapper = mount(PageHeader, {
      props: { ghost: true },
    })
    expect(wrapper.find('.zc-page-header').classes()).toContain('is-ghost')
  })

  it('does not render extra slot when not provided', () => {
    const wrapper = mount(PageHeader)
    expect(wrapper.find('.zc-page-header__extra').exists()).toBe(false)
  })

  it('does not render footer slot when not provided', () => {
    const wrapper = mount(PageHeader)
    expect(wrapper.find('.zc-page-header__footer').exists()).toBe(false)
  })

  it('does not render title when title prop is empty and no slot', () => {
    const wrapper = mount(PageHeader)
    expect(wrapper.find('.zc-page-header__title').exists()).toBe(false)
  })
})
