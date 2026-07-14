import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Breadcrumb from '../breadcrumb/breadcrumb.vue'
import BreadcrumbItem from '../breadcrumb/breadcrumb-item.vue'

describe('ZcBreadcrumb', () => {
  it('renders with default props', () => {
    const wrapper = mount(Breadcrumb)
    expect(wrapper.classes()).toContain('zc-breadcrumb')
  })

  it('renders default separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: { separator: '/' },
      slots: {
        default: { template: '<ZcBreadcrumbItem>Home</ZcBreadcrumbItem>' },
      },
      global: { components: { ZcBreadcrumbItem: BreadcrumbItem } },
    })
    expect(wrapper.findComponent(BreadcrumbItem).exists()).toBe(true)
  })

  it('renders custom separator', () => {
    const wrapper = mount(Breadcrumb, {
      props: { separator: '>' },
      slots: {
        default: { template: '<ZcBreadcrumbItem>Item</ZcBreadcrumbItem>' },
      },
      global: { components: { ZcBreadcrumbItem: BreadcrumbItem } },
    })
    expect(wrapper.text()).toContain('>')
  })

  it('renders breadcrumb items', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: [
          { template: '<ZcBreadcrumbItem>Home</ZcBreadcrumbItem>' },
          { template: '<ZcBreadcrumbItem>Settings</ZcBreadcrumbItem>' },
        ],
      },
      global: { components: { ZcBreadcrumbItem: BreadcrumbItem } },
    })
    const items = wrapper.findAllComponents(BreadcrumbItem)
    expect(items).toHaveLength(2)
    expect(wrapper.text()).toContain('Home')
    expect(wrapper.text()).toContain('Settings')
  })

  it('applies link class when to is set', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: {
          template: '<ZcBreadcrumbItem to="/home">Home</ZcBreadcrumbItem>',
        },
      },
      global: { components: { ZcBreadcrumbItem: BreadcrumbItem } },
    })
    expect(wrapper.find('.zc-breadcrumb__inner.is-link').exists()).toBe(true)
  })

  it('hides separator on last item via CSS', () => {
    const wrapper = mount(Breadcrumb, {
      slots: {
        default: { template: '<ZcBreadcrumbItem>Only</ZcBreadcrumbItem>' },
      },
      global: { components: { ZcBreadcrumbItem: BreadcrumbItem } },
    })
    // The separator is hidden by CSS last-child selector, so it still exists in DOM
    expect(wrapper.find('.zc-breadcrumb__separator').exists()).toBe(true)
    expect(wrapper.findAll('.zc-breadcrumb__item')).toHaveLength(1)
  })
})
