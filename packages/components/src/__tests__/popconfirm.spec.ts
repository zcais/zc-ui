import { describe, it, expect, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Popconfirm from '../popconfirm/popconfirm.vue'

describe('ZcPopconfirm', () => {
  afterEach(() => {
    document.body.innerHTML = ''
  })

  it('renders trigger content', () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Are you sure?' },
      slots: { default: '<button>Delete</button>' },
    })
    expect(wrapper.find('button').exists()).toBe(true)
  })

  it('does not show popper by default', () => {
    mount(Popconfirm, {
      props: { title: 'Confirm?' },
      slots: { default: '<span>Click me</span>' },
    })
    expect(document.querySelector('.zc-popconfirm__popper')).toBeNull()
  })

  it('shows popper when visible is true', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Confirm?', visible: true },
      slots: { default: '<span>Click me</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__popper')).not.toBeNull()
    wrapper.unmount()
  })

  it('shows title text', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'Delete this item?', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__title')?.textContent).toBe('Delete this item?')
    wrapper.unmount()
  })

  it('shows description text', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', description: 'This cannot be undone', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__description')?.textContent).toBe(
      'This cannot be undone'
    )
    wrapper.unmount()
  })

  it('emits confirm when confirm button clicked', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    const confirmBtn = buttons[buttons.length - 1] as HTMLElement
    confirmBtn.click()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    wrapper.unmount()
  })

  it('emits cancel when cancel button clicked', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const cancelBtn = document.querySelector('.zc-popconfirm__btn') as HTMLElement
    cancelBtn.click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    wrapper.unmount()
  })

  it('hides cancel button when hideCancelButton is true', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, hideCancelButton: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    expect(buttons.length).toBe(1)
    wrapper.unmount()
  })

  it('applies danger class when danger is true', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, danger: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__popper')?.classList.contains('is-danger')).toBe(
      true
    )
    wrapper.unmount()
  })

  it('shows danger icon when danger is true', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, danger: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__icon')).not.toBeNull()
    wrapper.unmount()
  })

  it('shows arrow by default', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__arrow')).not.toBeNull()
    wrapper.unmount()
  })

  it('hides arrow when showArrow is false', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, showArrow: false },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__arrow')).toBeNull()
    wrapper.unmount()
  })

  it('does not show popper when disabled', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, disabled: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__popper')).toBeNull()
    wrapper.unmount()
  })

  // ---- Bug #18: Popconfirm uses position:fixed when teleported ----
  it('popper is teleported to body with fixed positioning styles', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    await nextTick()
    const popper = document.querySelector('.zc-popconfirm__popper') as HTMLElement
    expect(popper).not.toBeNull()
    // Teleported to body (not inside the component's relative container)
    expect(popper.closest('.zc-popconfirm')).toBeNull()
    // Has inline styles (width + position computed from getBoundingClientRect)
    expect(popper.style.width).toBe('220px')
    wrapper.unmount()
  })

  it('shows custom confirmButtonText', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, confirmButtonText: 'Yes, delete' },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    expect(buttons[buttons.length - 1].textContent).toBe('Yes, delete')
    wrapper.unmount()
  })

  it('shows custom cancelButtonText', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, cancelButtonText: 'No, keep' },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const cancelBtn = document.querySelector('.zc-popconfirm__btn') as HTMLElement
    expect(cancelBtn.textContent).toBe('No, keep')
    wrapper.unmount()
  })

  it('applies confirmButtonType class', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, confirmButtonType: 'success' },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    const confirmBtn = buttons[buttons.length - 1] as HTMLElement
    expect(confirmBtn.classList.contains('zc-popconfirm__btn--success')).toBe(true)
    wrapper.unmount()
  })

  it('applies cancelButtonType class', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, cancelButtonType: 'warning' },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const cancelBtn = document.querySelector('.zc-popconfirm__btn') as HTMLElement
    expect(cancelBtn.classList.contains('zc-popconfirm__btn--warning')).toBe(true)
    wrapper.unmount()
  })

  it('uses danger type for confirm button when danger is true', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, danger: true, confirmButtonType: 'primary' },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    const confirmBtn = buttons[buttons.length - 1] as HTMLElement
    expect(confirmBtn.classList.contains('zc-popconfirm__btn--danger')).toBe(true)
    wrapper.unmount()
  })

  it('hides confirm button when hideConfirmButton is true', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, hideConfirmButton: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    expect(buttons.length).toBe(1) // Only cancel button
    expect(buttons[0].textContent).toBe('Cancel')
    wrapper.unmount()
  })

  it('renders custom icon when icon prop is set', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true, icon: 'my-icon-class' },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const iconEl = document.querySelector('.zc-popconfirm__icon i')
    expect(iconEl).not.toBeNull()
    expect(iconEl?.classList.contains('my-icon-class')).toBe(true)
    wrapper.unmount()
  })

  it('emits confirm and update:visible(false) on confirm click', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const buttons = document.querySelectorAll('.zc-popconfirm__btn')
    const confirmBtn = buttons[buttons.length - 1] as HTMLElement
    confirmBtn.click()
    expect(wrapper.emitted('confirm')).toBeTruthy()
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
    wrapper.unmount()
  })

  it('emits cancel and update:visible(false) on cancel click', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', visible: true },
      slots: { default: '<span>Click</span>' },
    })
    await nextTick()
    const cancelBtn = document.querySelector('.zc-popconfirm__btn') as HTMLElement
    cancelBtn.click()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:visible')).toBeTruthy()
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
    wrapper.unmount()
  })

  it('toggles popper on trigger click when trigger is click', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T' },
      slots: { default: '<span>Click me</span>' },
    })
    expect(document.querySelector('.zc-popconfirm__popper')).toBeNull()
    wrapper.find('.zc-popconfirm').trigger('click')
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__popper')).not.toBeNull()
    wrapper.find('.zc-popconfirm').trigger('click')
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__popper')).toBeNull()
    wrapper.unmount()
  })

  it('does not show popper when disabled even on click', async () => {
    const wrapper = mount(Popconfirm, {
      props: { title: 'T', disabled: true },
      slots: { default: '<span>Click</span>' },
    })
    wrapper.find('.zc-popconfirm').trigger('click')
    await nextTick()
    expect(document.querySelector('.zc-popconfirm__popper')).toBeNull()
    wrapper.unmount()
  })
})
