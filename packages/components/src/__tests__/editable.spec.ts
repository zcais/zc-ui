import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Editable from '../editable/editable.vue'

describe('ZcEditable', () => {
  it('renders with default props', () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Hello' } })
    expect(wrapper.classes()).toContain('zc-editable')
    expect(wrapper.text()).toContain('Hello')
  })

  it('renders in display mode by default', () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Text' } })
    expect(wrapper.find('.zc-editable__display').exists()).toBe(true)
    expect(wrapper.find('.zc-editable__input').exists()).toBe(false)
  })

  it('enters edit mode on click', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Text' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.find('.zc-editable__input').exists()).toBe(true)
  })

  it('enters edit mode on dblclick when trigger is dblclick', async () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Text', trigger: 'dblclick' },
    })
    await wrapper.find('.zc-editable__display').trigger('dblclick')
    expect(wrapper.find('.zc-editable__input').exists()).toBe(true)
  })

  it('does not enter edit on single click when trigger is dblclick', async () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Text', trigger: 'dblclick' },
    })
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.find('.zc-editable__input').exists()).toBe(false)
  })

  it('shows input with current value in edit mode', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Test Value' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    const input = wrapper.find('input')
    expect((input.element as HTMLInputElement).value).toBe('Test Value')
  })

  it('emits update:modelValue on confirm', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Old' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('input').setValue('New')
    await wrapper.find('.zc-editable__action--confirm').trigger('click')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeDefined()
    expect(events![0]).toEqual(['New'])
  })

  it('emits change with old and new value', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Old' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('input').setValue('New')
    await wrapper.find('.zc-editable__action--confirm').trigger('click')
    const changeEvents = wrapper.emitted('change')
    expect(changeEvents).toBeDefined()
    expect(changeEvents![0]).toEqual(['New', 'Old'])
  })

  it('emits start event when entering edit mode', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Text' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.emitted('start')).toBeDefined()
  })

  it('emits cancel event when canceling', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Text' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('.zc-editable__action--cancel').trigger('click')
    expect(wrapper.emitted('cancel')).toBeDefined()
  })

  it('restores original value on cancel', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Original' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('input').setValue('Changed')
    await wrapper.find('.zc-editable__action--cancel').trigger('click')
    expect(wrapper.find('.zc-editable__display').exists()).toBe(true)
    expect(wrapper.text()).toContain('Original')
  })

  it('confirms on Enter key for text mode', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Old' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('input').setValue('New')
    await wrapper.find('input').trigger('keydown', { key: 'Enter' })
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeDefined()
    expect(events![0]).toEqual(['New'])
  })

  it('cancels on Escape key', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Original' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('input').setValue('Changed')
    await wrapper.find('input').trigger('keydown', { key: 'Escape' })
    expect(wrapper.emitted('cancel')).toBeDefined()
    expect(wrapper.text()).toContain('Original')
  })

  it('does not enter edit mode when disabled', async () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Text', disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.find('.zc-editable__input').exists()).toBe(false)
  })

  it('renders placeholder when empty', () => {
    const wrapper = mount(Editable, {
      props: { modelValue: '', placeholder: 'Click to edit' },
    })
    expect(wrapper.classes()).toContain('is-empty')
    expect(wrapper.text()).toContain('Click to edit')
  })

  it('renders textarea in textarea mode', async () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Text', mode: 'textarea' },
    })
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.find('textarea').exists()).toBe(true)
  })

  it('renders confirm and cancel action buttons', async () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Text', showAction: true },
    })
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.find('.zc-editable__action--confirm').exists()).toBe(true)
    expect(wrapper.find('.zc-editable__action--cancel').exists()).toBe(true)
  })

  it('hides action buttons when showAction is false', async () => {
    const wrapper = mount(Editable, {
      props: { modelValue: 'Text', showAction: false },
    })
    await wrapper.find('.zc-editable__display').trigger('click')
    expect(wrapper.find('.zc-editable__actions').exists()).toBe(false)
  })

  it('shows edit icon on hover', () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Text' } })
    expect(wrapper.find('.zc-editable__edit-icon').exists()).toBe(true)
  })

  it('emits end event on confirm', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Old' } })
    await wrapper.find('.zc-editable__display').trigger('click')
    await wrapper.find('input').setValue('New')
    await wrapper.find('.zc-editable__action--confirm').trigger('click')
    const endEvents = wrapper.emitted('end')
    expect(endEvents).toBeDefined()
    expect(endEvents![0]).toEqual(['New'])
  })

  it('syncs modelValue to editValue when not editing', async () => {
    const wrapper = mount(Editable, { props: { modelValue: 'Initial' } })
    await wrapper.setProps({ modelValue: 'Updated' })
    // Should show updated value in display
    expect(wrapper.text()).toContain('Updated')
  })
})
