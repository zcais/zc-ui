import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ContextMenu from '../context-menu/context-menu.vue'
import type { ContextMenuItem } from '../context-menu/types'

const items: ContextMenuItem[] = [
  { key: 'copy', label: '复制' },
  { key: 'paste', label: '粘贴' },
  { key: 'delete', label: '删除', disabled: true, danger: true },
  { key: 'share', label: '分享', divided: true, icon: 'share' },
]

describe('ZcContextMenu', () => {
  it('renders nothing when visible is false', () => {
    const wrapper = mount(ContextMenu, {
      props: { items, visible: false },
    })
    expect(wrapper.find('.zc-context-menu__wrapper').exists()).toBe(false)
  })

  it('renders menu items when visible', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 100, y: 100 },
      attachTo: document.body,
    })
    const wrapperEl = document.querySelector('.zc-context-menu__wrapper')
    expect(wrapperEl).toBeTruthy()
    const menuItems = document.querySelectorAll('.zc-context-menu__item')
    expect(menuItems.length).toBe(4)
    wrapper.unmount()
  })

  it('displays correct labels', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const labels = document.querySelectorAll('.zc-context-menu__item-label')
    expect(labels[0].textContent).toBe('复制')
    expect(labels[1].textContent).toBe('粘贴')
    expect(labels[2].textContent).toBe('删除')
    expect(labels[3].textContent).toBe('分享')
    wrapper.unmount()
  })

  it('emits select and update:visible on item click', async () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const menuItems = document.querySelectorAll('.zc-context-menu__item')
    ;(menuItems[0] as HTMLElement).click()
    await wrapper.vm.$nextTick()
    const selectEvents = wrapper.emitted('select')
    expect(selectEvents).toBeTruthy()
    expect(selectEvents![0][0]).toMatchObject({ key: 'copy', label: '复制' })
    const updateEvents = wrapper.emitted('update:visible')
    expect(updateEvents).toBeTruthy()
    expect(updateEvents![0][0]).toBe(false)
    wrapper.unmount()
  })

  it('does not emit select when disabled item is clicked', async () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const menuItems = document.querySelectorAll('.zc-context-menu__item')
    // Index 2 is 'delete' which is disabled
    ;(menuItems[2] as HTMLElement).click()
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('select')).toBeFalsy()
    wrapper.unmount()
  })

  it('applies disabled class', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const menuItems = document.querySelectorAll('.zc-context-menu__item')
    expect(menuItems[2].classList.contains('is-disabled')).toBe(true)
    wrapper.unmount()
  })

  it('applies danger class', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const menuItems = document.querySelectorAll('.zc-context-menu__item')
    expect(menuItems[2].classList.contains('is-danger')).toBe(true)
    wrapper.unmount()
  })

  it('renders divider for items with divided prop', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const dividers = document.querySelectorAll('.zc-context-menu__divider')
    expect(dividers.length).toBe(1)
    wrapper.unmount()
  })

  it('applies position styles', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 200, y: 300 },
      attachTo: document.body,
    })
    const el = document.querySelector('.zc-context-menu__wrapper') as HTMLElement
    const style = el.getAttribute('style') || ''
    expect(style).toContain('left: 200px')
    expect(style).toContain('top: 300px')
    wrapper.unmount()
  })

  it('applies minWidth and maxWidth styles', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0, minWidth: 200, maxWidth: 400 },
      attachTo: document.body,
    })
    const el = document.querySelector('.zc-context-menu__wrapper') as HTMLElement
    const style = el.getAttribute('style') || ''
    expect(style).toContain('min-width: 200px')
    expect(style).toContain('max-width: 400px')
    wrapper.unmount()
  })

  it('renders icon when provided', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items, visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const icons = document.querySelectorAll('.zc-context-menu__item-icon')
    // Only 'share' has icon
    expect(icons.length).toBe(1)
    wrapper.unmount()
  })

  it('renders empty items list without error', () => {
    document.body.innerHTML = ''
    const wrapper = mount(ContextMenu, {
      props: { items: [], visible: true, x: 0, y: 0 },
      attachTo: document.body,
    })
    const menuItems = document.querySelectorAll('.zc-context-menu__item')
    expect(menuItems.length).toBe(0)
    wrapper.unmount()
  })
})
