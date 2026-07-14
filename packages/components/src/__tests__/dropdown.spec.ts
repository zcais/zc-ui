import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Dropdown from '../dropdown/dropdown.vue'
import DropdownItem from '../dropdown/dropdown-item.vue'

describe('ZcDropdown', () => {
  afterEach(() => {
    vi.useRealTimers()
    document.body.innerHTML = ''
  })

  it('renders with default props', () => {
    const wrapper = mount(Dropdown, {
      slots: { default: '<span>Trigger</span>' },
    })
    expect(wrapper.classes()).toContain('zc-dropdown')
    expect(wrapper.text()).toContain('Trigger')
  })

  it('does not show dropdown content initially', () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'hover', showTimeout: 0 },
      slots: { default: '<span>Trigger</span>' },
    })
    expect(document.querySelector('.zc-dropdown__menu')).toBeNull()
    wrapper.unmount()
  })

  it('shows dropdown on click trigger', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click' },
      slots: { default: '<span>Trigger</span>' },
    })
    await wrapper.trigger('click')
    await flushPromises()
    const menu = document.querySelector('.zc-dropdown__menu')
    expect(menu).not.toBeNull()
    wrapper.unmount()
  })

  it('shows dropdown on hover trigger', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Dropdown, {
      props: { trigger: 'hover', showTimeout: 0 },
      slots: { default: '<span>Trigger</span>' },
    })
    await wrapper.trigger('mouseenter')
    vi.advanceTimersByTime(10)
    await flushPromises()
    const menu = document.querySelector('.zc-dropdown__menu')
    expect(menu).not.toBeNull()
    wrapper.unmount()
  })

  it('does not show when disabled', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click', disabled: true },
      slots: { default: '<span>Trigger</span>' },
    })
    await wrapper.trigger('click')
    expect(document.querySelector('.zc-dropdown__menu')).toBeNull()
    wrapper.unmount()
  })

  it('emits show event', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click' },
      slots: { default: '<span>Trigger</span>' },
    })
    await wrapper.trigger('click')
    expect(wrapper.emitted('show')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits command event from dropdown item', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click' },
      slots: {
        default: '<span>Trigger</span>',
        dropdown: {
          template: '<ZcDropdownItem :command="1">Action</ZcDropdownItem>',
        },
      },
      global: { components: { ZcDropdownItem: DropdownItem } },
    })
    await wrapper.trigger('click')
    await flushPromises()
    const item = document.querySelector('.zc-dropdown__menu__item') as HTMLElement
    expect(item).not.toBeNull()
    item.click()
    await flushPromises()
    expect(wrapper.emitted('command')?.[0]).toEqual([1])
    wrapper.unmount()
  })

  it('renders divided item class', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click' },
      slots: {
        default: '<span>Trigger</span>',
        dropdown: {
          template: '<ZcDropdownItem :divided="true">Action</ZcDropdownItem>',
        },
      },
      global: { components: { ZcDropdownItem: DropdownItem } },
    })
    await wrapper.trigger('click')
    await flushPromises()
    const item = document.querySelector('.zc-dropdown__menu__item.is-divided')
    expect(item).not.toBeNull()
    wrapper.unmount()
  })

  // ---- Bug #18: Dropdown uses position:fixed when teleported ----
  it('menu is teleported to body with fixed positioning styles', async () => {
    const wrapper = mount(Dropdown, {
      props: { trigger: 'click' },
      slots: { default: '<span>Trigger</span>' },
    })
    await wrapper.trigger('click')
    await flushPromises()
    const menu = document.querySelector('.zc-dropdown__menu') as HTMLElement
    expect(menu).not.toBeNull()
    // Teleported to body (not inside the component's relative container)
    expect(menu.closest('.zc-dropdown')).toBeNull()
    // Has inline position styles from getBoundingClientRect-based updatePosition
    expect(menu.style.top || menu.style.bottom).not.toBe('')
    wrapper.unmount()
  })
})
