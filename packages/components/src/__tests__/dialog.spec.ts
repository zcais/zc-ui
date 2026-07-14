import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Dialog from '../dialog/dialog.vue'

describe('ZcDialog', () => {
  afterEach(() => {
    // Clean up teleported content
    document.body.innerHTML = ''
  })

  it('renders when modelValue is true', () => {
    mount(Dialog, {
      props: { modelValue: true, title: 'Test Dialog' },
      slots: { default: '<p>Dialog content</p>' },
    })
    expect(document.querySelector('.zc-dialog__overlay')).not.toBeNull()
    expect(document.querySelector('.zc-dialog__panel')).not.toBeNull()
  })

  it('does not render when modelValue is false', () => {
    mount(Dialog, {
      props: { modelValue: false },
    })
    expect(document.querySelector('.zc-dialog__overlay')).toBeNull()
  })

  it('displays title prop', () => {
    mount(Dialog, {
      props: { modelValue: true, title: 'My Title' },
    })
    expect(document.querySelector('.zc-dialog__title-text')?.textContent).toBe('My Title')
  })

  it('renders title slot', () => {
    mount(Dialog, {
      props: { modelValue: true },
      slots: { title: '<span class="custom-title">Custom</span>' },
    })
    expect(document.querySelector('.custom-title')).not.toBeNull()
  })

  it('renders body slot', () => {
    mount(Dialog, {
      props: { modelValue: true },
      slots: { default: '<div class="dialog-body">Content</div>' },
    })
    expect(document.querySelector('.dialog-body')).not.toBeNull()
  })

  it('renders footer slot', () => {
    mount(Dialog, {
      props: { modelValue: true },
      slots: { footer: '<button>Cancel</button><button>OK</button>' },
    })
    expect(document.querySelector('.zc-dialog__footer')).not.toBeNull()
    const buttons = document.querySelectorAll('.zc-dialog__footer button')
    expect(buttons.length).toBe(2)
  })

  it('emits update:modelValue false on close button click', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, showClose: true },
    })
    const closeBtn = document.querySelector('.zc-dialog__close-btn') as HTMLElement
    closeBtn.click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('emits update:modelValue false on overlay click', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, closeOnClickOverlay: true },
    })
    const overlay = document.querySelector('.zc-dialog__overlay') as HTMLElement
    overlay.click()
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([false])
  })

  it('does not close on overlay click when disabled', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: true, closeOnClickOverlay: false },
    })
    const overlay = document.querySelector('.zc-dialog__overlay') as HTMLElement
    overlay.click()
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('shows fullscreen button when enabled', () => {
    mount(Dialog, {
      props: { modelValue: true, fullscreen: true },
    })
    expect(document.querySelector('.zc-dialog__fullscreen-btn')).not.toBeNull()
  })

  it('toggles fullscreen on button click', async () => {
    mount(Dialog, {
      props: { modelValue: true, fullscreen: true },
    })
    const btn = document.querySelector('.zc-dialog__fullscreen-btn') as HTMLElement
    btn.click()
    await new Promise((resolve) => setTimeout(resolve, 0))
    expect(document.querySelector('.zc-dialog__panel')?.classList.contains('is-fullscreen')).toBe(
      true
    )
  })

  it('hides close button when showClose is false', () => {
    mount(Dialog, {
      props: { modelValue: true, showClose: false },
    })
    expect(document.querySelector('.zc-dialog__close-btn')).toBeNull()
  })

  it('applies width prop', () => {
    mount(Dialog, {
      props: { modelValue: true, width: '600px' },
    })
    const style = document.querySelector('.zc-dialog__panel')?.getAttribute('style') || ''
    expect(style).toContain('width: 600px')
  })

  it('emits open event when opened', async () => {
    const wrapper = mount(Dialog, {
      props: { modelValue: false },
    })
    await wrapper.setProps({ modelValue: true })
    expect(wrapper.emitted('open')).toBeTruthy()
  })

  it('applies center modifier', () => {
    mount(Dialog, {
      props: { modelValue: true, center: true },
    })
    expect(document.querySelector('.zc-dialog__panel')?.classList.contains('is-center')).toBe(true)
  })

  // --- Drag tests ---
  it('shows header as drag handle when draggable is enabled', () => {
    mount(Dialog, {
      props: { modelValue: true, draggable: true, title: 'Drag me' },
    })
    const header = document.querySelector('.zc-dialog__header') as HTMLElement
    expect(header).not.toBeNull()
  })

  it('moves dialog panel on drag when draggable is enabled', async () => {
    mount(Dialog, {
      props: { modelValue: true, draggable: true, title: 'Drag me' },
    })
    const header = document.querySelector('.zc-dialog__header') as HTMLElement
    const panel = document.querySelector('.zc-dialog__panel') as HTMLElement

    // Initial transform should have no offset (translate(0px, 0px))
    let style = panel.getAttribute('style') || ''
    expect(style).toContain('translate(0px, 0px)')

    // Simulate drag: mousedown → mousemove → mouseup
    header.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, bubbles: true }))
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 150, clientY: 130, bubbles: true })
    )
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    // After drag, transform should reflect the offset (50px x, 30px y)
    style = panel.getAttribute('style') || ''
    expect(style).toContain('translate(50px, 30px)')
  })

  it('does not move on drag when draggable is disabled', async () => {
    mount(Dialog, {
      props: { modelValue: true, draggable: false, title: 'No drag' },
    })
    const header = document.querySelector('.zc-dialog__header') as HTMLElement
    const panel = document.querySelector('.zc-dialog__panel') as HTMLElement

    // Simulate drag attempt
    header.dispatchEvent(new MouseEvent('mousedown', { clientX: 100, clientY: 100, bubbles: true }))
    document.dispatchEvent(
      new MouseEvent('mousemove', { clientX: 200, clientY: 200, bubbles: true })
    )
    document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))

    await new Promise((resolve) => setTimeout(resolve, 0))

    // Transform should remain none (no offset)
    const style = panel.getAttribute('style') || ''
    expect(style).toContain('transform: none')
  })
})
