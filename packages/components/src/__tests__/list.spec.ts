import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import List from '../list/list.vue'
import ListItem from '../list/list-item.vue'

describe('ZcList', () => {
  it('renders list', () => {
    const wrapper = mount(List)
    expect(wrapper.find('.zc-list').exists()).toBe(true)
  })

  it('renders with items', () => {
    const wrapper = mount(List, {
      slots: {
        default: `
          <list-item>Item 1</list-item>
          <list-item>Item 2</list-item>
        `,
      },
      global: { components: { ListItem } },
    })
    const items = wrapper.findAll('.zc-list-item')
    expect(items.length).toBe(2)
    expect(items[0].find('.zc-list-item__content').text()).toBe('Item 1')
  })

  it('shows header text', () => {
    const wrapper = mount(List, { props: { header: 'List Header' } })
    expect(wrapper.find('.zc-list__header').text()).toBe('List Header')
  })

  it('shows footer text', () => {
    const wrapper = mount(List, { props: { footer: 'List Footer' } })
    expect(wrapper.find('.zc-list__footer').text()).toBe('List Footer')
  })

  it('applies bordered class', () => {
    const wrapper = mount(List, { props: { bordered: true } })
    expect(wrapper.find('.zc-list').classes()).toContain('is-bordered')
  })

  it('applies horizontal layout class', () => {
    const wrapper = mount(List, { props: { layout: 'horizontal' } })
    expect(wrapper.find('.zc-list').classes()).toContain('zc-list--horizontal')
  })

  it('applies size class', () => {
    const wrapper = mount(List, { props: { size: 'small' } })
    expect(wrapper.find('.zc-list').classes()).toContain('zc-list--small')
  })

  it('shows loading state', () => {
    const wrapper = mount(List, { props: { loading: true } })
    expect(wrapper.find('.zc-list__loading').exists()).toBe(true)
  })

  it('renders custom header slot', () => {
    const wrapper = mount(List, {
      slots: { header: '<span class="custom-header">Custom</span>' },
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
  })

  it('renders list item with extra', () => {
    const wrapper = mount(ListItem, {
      props: { extra: '2024-01-01' },
      slots: { default: 'Title' },
    })
    expect(wrapper.find('.zc-list-item__content').text()).toBe('Title')
    expect(wrapper.find('.zc-list-item__extra').text()).toBe('2024-01-01')
  })
})
