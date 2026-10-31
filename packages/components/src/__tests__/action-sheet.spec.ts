import { describe, it, expect, afterEach } from 'vitest'
import { mount, DOMWrapper } from '@vue/test-utils'
import ActionSheet from '../action-sheet/action-sheet.vue'
import type { ActionSheetItem } from '../action-sheet/action-sheet.vue'

const testActions: ActionSheetItem[] = [
  { key: 'share', label: 'Share' },
  { key: 'copy', label: 'Copy Link', description: 'Copy the link to clipboard' },
  { key: 'delete', label: 'Delete', color: 'danger', disabled: true },
]

function getMask(): DOMWrapper<Element> {
  const el = document.querySelector('.zc-action-sheet__mask')
  if (!el) throw new Error('mask not found')
  return new DOMWrapper(el)
}

function getContainer(): DOMWrapper<Element> {
  const el = document.querySelector('.zc-action-sheet__container')
  if (!el) throw new Error('container not found')
  return new DOMWrapper(el)
}

describe('ZcActionSheet', () => {
  afterEach(() => {
    document.body.innerHTML = ''
    document.body.style.overflow = ''
  })

  it('renders nothing when visible is false', () => {
    mount(ActionSheet, { props: { visible: false } })
    expect(document.querySelector('.zc-action-sheet__mask')).toBeNull()
  })

  it('renders mask and container when visible is true', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-action-sheet__mask')).not.toBeNull()
    expect(document.querySelector('.zc-action-sheet__container')).not.toBeNull()
    expect(document.querySelector('.zc-action-sheet__container.is-round')).not.toBeNull()
    wrapper.unmount()
  })

  it('renders all action items with labels and descriptions', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    expect(items).toHaveLength(3)
    expect(items[0].textContent).toContain('Share')
    expect(items[1].textContent).toContain('Copy Link')
    expect(items[1].querySelector('.zc-action-sheet__item-description')?.textContent).toContain(
      'Copy the link to clipboard'
    )
    wrapper.unmount()
  })

  it('applies disabled class and disabled attribute to disabled items', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    expect(items[0].classList.contains('is-disabled')).toBe(false)
    expect(items[2].classList.contains('is-disabled')).toBe(true)
    expect((items[2] as HTMLButtonElement).disabled).toBe(true)
    wrapper.unmount()
  })

  it('applies danger/primary color classes', async () => {
    const wrapper = mount(ActionSheet, {
      props: {
        visible: true,
        actions: [
          { label: 'Del', color: 'danger' },
          { label: 'Main', color: 'primary' },
        ],
      },
    })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    expect(items[0].classList.contains('is-danger')).toBe(true)
    expect(items[1].classList.contains('is-primary')).toBe(true)
    wrapper.unmount()
  })

  it('emits select with item and index when action clicked', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    items[1].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0]).toEqual([testActions[1], 1])
    wrapper.unmount()
  })

  it('does not emit select for disabled item', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    items[2].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('select')).toBeFalsy()
    wrapper.unmount()
  })

  it('emits update:visible false when closeOnClickAction is true', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, closeOnClickAction: true },
    })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    items[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
    wrapper.unmount()
  })

  it('does not emit update:visible when closeOnClickAction is false', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, closeOnClickAction: false },
    })
    await wrapper.vm.$nextTick()
    const items = document.querySelectorAll('.zc-action-sheet__item')
    items[0].dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('update:visible')).toBeFalsy()
    wrapper.unmount()
  })

  it('emits cancel and update:visible when cancel button clicked', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, cancelText: 'Cancel' },
    })
    await wrapper.vm.$nextTick()
    const cancelBtn = document.querySelector('.zc-action-sheet__cancel')
    expect(cancelBtn).not.toBeNull()
    expect(cancelBtn?.textContent).toContain('Cancel')
    cancelBtn!.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    await wrapper.vm.$nextTick()
    expect(wrapper.emitted('cancel')).toBeTruthy()
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
    wrapper.unmount()
  })

  it('hides cancel button when cancelText is empty string', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, cancelText: '' },
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-action-sheet__cancel')).toBeNull()
    wrapper.unmount()
  })

  it('shows custom cancel text', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, cancelText: '取 消' },
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-action-sheet__cancel')?.textContent).toContain('取 消')
    wrapper.unmount()
  })

  it('closes via update:visible when mask clicked with closeOnClickMask true', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, closeOnClickMask: true },
    })
    await wrapper.vm.$nextTick()
    await getMask().trigger('click')
    expect(wrapper.emitted('update:visible')![0]).toEqual([false])
    wrapper.unmount()
  })

  it('does not close when mask clicked with closeOnClickMask false', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, closeOnClickMask: false },
    })
    await wrapper.vm.$nextTick()
    await getMask().trigger('click')
    expect(wrapper.emitted('update:visible')).toBeFalsy()
    wrapper.unmount()
  })

  it('clicking inside the container does not trigger mask close', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    await getContainer().trigger('click')
    expect(wrapper.emitted('update:visible')).toBeFalsy()
    wrapper.unmount()
  })

  it('emits close event when visible changes to false', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    await wrapper.setProps({ visible: false })
    expect(wrapper.emitted('close')).toBeTruthy()
    expect(document.querySelector('.zc-action-sheet__mask')).toBeNull()
  })

  it('renders title and description header', async () => {
    const wrapper = mount(ActionSheet, {
      props: {
        visible: true,
        actions: testActions,
        title: 'Choose action',
        description: 'Some hint',
      },
    })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-action-sheet__header')).not.toBeNull()
    expect(document.querySelector('.zc-action-sheet__title')?.textContent).toContain(
      'Choose action'
    )
    expect(document.querySelector('.zc-action-sheet__description')?.textContent).toContain(
      'Some hint'
    )
    wrapper.unmount()
  })

  it('does not render header without title/description', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    expect(document.querySelector('.zc-action-sheet__header')).toBeNull()
    wrapper.unmount()
  })

  it('locks body scroll when open and restores when closed', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: false, actions: testActions, lockScroll: true },
    })
    expect(document.body.style.overflow).toBe('')
    await wrapper.setProps({ visible: true })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    await wrapper.setProps({ visible: false })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('')
    wrapper.unmount()
  })

  it('does not lock body scroll when lockScroll is false', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: false, actions: testActions, lockScroll: false },
    })
    await wrapper.setProps({ visible: true })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).not.toBe('hidden')
    wrapper.unmount()
  })

  it('restores body scroll on unmount while open', async () => {
    const wrapper = mount(ActionSheet, { props: { visible: true, actions: testActions } })
    await wrapper.vm.$nextTick()
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('')
  })

  it('applies custom zIndex to mask and renders header slot', async () => {
    const wrapper = mount(ActionSheet, {
      props: { visible: true, actions: testActions, zIndex: 3000 },
      slots: { header: '<div class="custom-header">Header Slot</div>' },
    })
    await wrapper.vm.$nextTick()
    const mask = document.querySelector('.zc-action-sheet__mask') as HTMLElement
    expect(mask.style.zIndex).toBe('3000')
    expect(document.querySelector('.custom-header')?.textContent).toContain('Header Slot')
    wrapper.unmount()
  })
})
