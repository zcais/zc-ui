import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TimePicker from '../time-picker/time-picker.vue'

describe('ZcTimePicker', () => {
  it('renders with default props', () => {
    const wrapper = mount(TimePicker)
    expect(wrapper.find('.zc-time-picker').exists()).toBe(true)
    expect(wrapper.find('.zc-time-picker__wrapper').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(TimePicker, { props: { size: 'large' } })
    expect(wrapper.find('.zc-time-picker').classes()).toContain('zc-time-picker--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(TimePicker, { props: { size: 'small' } })
    expect(wrapper.find('.zc-time-picker').classes()).toContain('zc-time-picker--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(TimePicker, { props: { disabled: true } })
    expect(wrapper.find('.zc-time-picker').classes()).toContain('is-disabled')
  })

  it('applies placeholder', () => {
    const wrapper = mount(TimePicker, { props: { placeholder: '选择时间' } })
    expect(wrapper.find('.zc-time-picker__display').text()).toBe('选择时间')
  })

  it('applies placeholder class when empty', () => {
    const wrapper = mount(TimePicker)
    expect(wrapper.find('.zc-time-picker__display').classes()).toContain('is-placeholder')
  })

  it('displays modelValue', () => {
    const wrapper = mount(TimePicker, { props: { modelValue: '14:30:00' } })
    expect(wrapper.find('.zc-time-picker__display').text()).toBe('14:30:00')
  })

  it('does not show placeholder class when has value', () => {
    const wrapper = mount(TimePicker, { props: { modelValue: '14:30:00' } })
    expect(wrapper.find('.zc-time-picker__display').classes()).not.toContain('is-placeholder')
  })

  it('opens panel on click', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    expect(wrapper.find('.zc-time-picker__panel').exists()).toBe(true)
  })

  it('applies focused class when open', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    expect(wrapper.find('.zc-time-picker').classes()).toContain('is-focused')
  })

  it('applies open class when visible', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    expect(wrapper.find('.zc-time-picker').classes()).toContain('is-open')
  })

  it('does not open panel when disabled', async () => {
    const wrapper = mount(TimePicker, { props: { disabled: true } })
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    expect(wrapper.find('.zc-time-picker').classes()).not.toContain('is-open')
  })

  it('does not open panel when readonly', async () => {
    const wrapper = mount(TimePicker, { props: { readonly: true } })
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    expect(wrapper.find('.zc-time-picker').classes()).not.toContain('is-open')
  })

  it('renders 24 hours in spinner', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    const hours = wrapper.findAll('.zc-time-picker__spinner--hour .zc-time-picker__spinner-item')
    expect(hours.length).toBe(24)
  })

  it('renders 60 minutes in spinner', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    const minutes = wrapper.findAll(
      '.zc-time-picker__spinner--minute .zc-time-picker__spinner-item'
    )
    expect(minutes.length).toBe(60)
  })

  it('renders 60 seconds in spinner', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    const seconds = wrapper.findAll(
      '.zc-time-picker__spinner--second .zc-time-picker__spinner-item'
    )
    expect(seconds.length).toBe(60)
  })

  it('renders confirm button in panel', async () => {
    const wrapper = mount(TimePicker)
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    expect(wrapper.find('.zc-time-picker__confirm-btn').exists()).toBe(true)
  })

  it('shows clear button when clearable and has value', () => {
    const wrapper = mount(TimePicker, { props: { modelValue: '14:30:00', clearable: true } })
    expect(wrapper.find('.zc-time-picker__clear').exists()).toBe(true)
  })

  it('emits change on confirm click', async () => {
    const wrapper = mount(TimePicker, { props: { modelValue: '14:30:00' } })
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    await wrapper.find('.zc-time-picker__confirm-btn').trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('respects format prop', () => {
    const wrapper = mount(TimePicker, { props: { modelValue: '14:30:00', format: 'HH:mm' } })
    expect(wrapper.find('.zc-time-picker__display').text()).toBe('14:30')
  })

  it('highlights selected hour', async () => {
    const wrapper = mount(TimePicker, { props: { modelValue: '14:30:00' } })
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    const selected = wrapper.find('.zc-time-picker__spinner--hour .is-selected')
    expect(selected.exists()).toBe(true)
    expect(selected.text()).toBe('14')
  })

  it('respects disabledHours', async () => {
    const wrapper = mount(TimePicker, {
      props: { disabledHours: () => [0, 1, 2, 22, 23] },
    })
    await wrapper.find('.zc-time-picker__wrapper').trigger('click')
    const disabledItems = wrapper.findAll('.zc-time-picker__spinner--hour .is-disabled')
    expect(disabledItems.length).toBe(5)
  })
})
