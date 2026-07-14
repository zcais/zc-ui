import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Drawer from '../drawer/drawer.vue'

describe('ZcDrawer', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders when modelValue is true', () => {
    mount(Drawer, {
      props: { modelValue: true, title: 'Test Drawer' },
      slots: { default: '<p>Drawer content</p>' },
    })
    expect(document.querySelector('.zc-drawer__overlay')).not.toBeNull()
    expect(document.querySelector('.zc-drawer__panel')).not.toBeNull()
  })

  it('does not render when modelValue is false', () => {
    mount(Drawer, { props: { modelValue: false } })
    expect(document.querySelector('.zc-drawer__overlay')).toBeNull()
  })

  it('displays title prop', () => {
    mount(Drawer, { props: { modelValue: true, title: 'My Title' } })
    expect(document.querySelector('.zc-drawer__title-text')?.textContent).toBe('My Title')
  })

  it('renders title slot', () => {
    mount(Drawer, {
      props: { modelValue: true },
      slots: { title: '<span class="custom-title">Custom</span>' },
    })
    expect(document.querySelector('.custom-title')).not.toBeNull()
  })

  it('applies rtl direction class by default', () => {
    mount(Drawer, { props: { modelValue: true } })
    const panel = document.querySelector('.zc-drawer__panel')
    expect(panel?.classList.contains('zc-drawer-panel--rtl')).toBe(true)
  })

  it('applies ltr direction class', () => {
    mount(Drawer, { props: { modelValue: true, direction: 'ltr' } })
    expect(document.querySelector('.zc-drawer-panel--ltr')).not.toBeNull()
  })

  it('applies ttb direction class', () => {
    mount(Drawer, { props: { modelValue: true, direction: 'ttb' } })
    expect(document.querySelector('.zc-drawer-panel--ttb')).not.toBeNull()
  })

  it('applies btt direction class', () => {
    mount(Drawer, { props: { modelValue: true, direction: 'btt' } })
    expect(document.querySelector('.zc-drawer-panel--btt')).not.toBeNull()
  })

  it('shows close button by default', () => {
    mount(Drawer, { props: { modelValue: true, title: 'T' } })
    expect(document.querySelector('.zc-drawer__close-btn')).not.toBeNull()
  })

  it('hides close button when showClose is false', () => {
    mount(Drawer, { props: { modelValue: true, title: 'T', showClose: false } })
    expect(document.querySelector('.zc-drawer__close-btn')).toBeNull()
  })

  it('emits update:modelValue false when close button clicked', async () => {
    const wrapper = mount(Drawer, { props: { modelValue: true, title: 'T' } })
    const closeBtn = document.querySelector('.zc-drawer__close-btn') as HTMLElement
    closeBtn.click()
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('emits update:modelValue false on overlay click', async () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, closeOnClickOverlay: true },
    })
    const overlay = document.querySelector('.zc-drawer__overlay') as HTMLElement
    overlay.click()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('does not close on overlay click when closeOnClickOverlay is false', () => {
    const wrapper = mount(Drawer, {
      props: { modelValue: true, closeOnClickOverlay: false },
    })
    const overlay = document.querySelector('.zc-drawer__overlay') as HTMLElement
    overlay.click()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('renders footer slot', () => {
    mount(Drawer, {
      props: { modelValue: true },
      slots: { footer: '<button>OK</button>' },
    })
    expect(document.querySelector('.zc-drawer__footer')).not.toBeNull()
  })

  it('hides footer when not provided', () => {
    mount(Drawer, { props: { modelValue: true } })
    expect(document.querySelector('.zc-drawer__footer')).toBeNull()
  })

  it('renders resize handle when resizable', () => {
    mount(Drawer, { props: { modelValue: true, resizable: true } })
    expect(document.querySelector('.zc-drawer__resize-handle')).not.toBeNull()
  })

  it('hides resize handle by default', () => {
    mount(Drawer, { props: { modelValue: true } })
    expect(document.querySelector('.zc-drawer__resize-handle')).toBeNull()
  })

  it('sets custom size', () => {
    mount(Drawer, { props: { modelValue: true, size: '500px' } })
    const panel = document.querySelector('.zc-drawer__panel') as HTMLElement
    expect(panel.style.width).toBe('500px')
  })

  it('applies size as number value', () => {
    mount(Drawer, { props: { modelValue: true, size: 400 } })
    const panel = document.querySelector('.zc-drawer__panel') as HTMLElement
    expect(panel.style.width).toBe('400px')
  })

  it('applies drawerClass to panel', () => {
    mount(Drawer, { props: { modelValue: true, drawerClass: 'my-custom-class' } })
    const panel = document.querySelector('.zc-drawer__panel')
    expect(panel?.classList.contains('my-custom-class')).toBe(true)
  })

  it('renders overlay with direction class', () => {
    mount(Drawer, { props: { modelValue: true, direction: 'btt' } })
    const overlay = document.querySelector('.zc-drawer__overlay')
    expect(overlay?.classList.contains('zc-drawer-overlay--btt')).toBe(true)
  })

  it('renders no header when title is empty, no title slot, and showClose is false', () => {
    mount(Drawer, {
      props: { modelValue: true, title: '', showClose: false },
    })
    expect(document.querySelector('.zc-drawer__header')).toBeNull()
  })

  it('emits open event when drawer opens', () => {
    const wrapper = mount(Drawer, { props: { modelValue: true } })
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('emits close event when modelValue becomes false', async () => {
    const wrapper = mount(Drawer, { props: { modelValue: true, title: 'T' } })
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('close')).toBeTruthy()
  })

  it('closes on Escape keypress when closeOnEsc is true', async () => {
    const wrapper = mount(Drawer, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('does not close on Escape when closeOnEsc is false', async () => {
    const wrapper = mount(Drawer, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: true, closeOnEsc: false })
    await nextTick()
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('locks body scroll when open and lockScroll is true', () => {
    mount(Drawer, { props: { modelValue: true, lockScroll: true } })
    expect(document.body.style.overflow).toBe('hidden')
  })

  it('renders panel with role="dialog" and aria-modal="true"', () => {
    mount(Drawer, { props: { modelValue: true } })
    const panel = document.querySelector('.zc-drawer__panel')
    expect(panel?.getAttribute('role')).toBe('dialog')
    expect(panel?.getAttribute('aria-modal')).toBe('true')
  })

  it('sets aria-labelledby when title is provided', () => {
    mount(Drawer, { props: { modelValue: true, title: 'My Drawer' } })
    const panel = document.querySelector('.zc-drawer__panel')
    expect(panel?.getAttribute('aria-labelledby')).toBeTruthy()
  })

  it('does not re-open when already open', () => {
    const wrapper = mount(Drawer, { props: { modelValue: true } })
    wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('open')!.length).toBe(1)
  })

  it('does not re-close when already closed', async () => {
    const wrapper = mount(Drawer, { props: { modelValue: false } })
    await wrapper.setProps({ modelValue: false })
    expect(wrapper.emitted('close')).toBeFalsy()
  })
})
