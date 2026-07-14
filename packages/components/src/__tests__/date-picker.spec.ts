import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePicker from '../date-picker/date-picker.vue'

describe('ZcDatePicker', () => {
  it('renders with zc-date-picker class', () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.classes()).toContain('zc-date-picker')
  })

  it('displays placeholder text', () => {
    const wrapper = mount(DatePicker, {
      props: { placeholder: 'Select a date' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Select a date')
  })

  it('shows default placeholder when not provided', () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.find('input').attributes('placeholder')).toBe('请选择日期')
  })

  it('applies disabled class', () => {
    const wrapper = mount(DatePicker, {
      props: { disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('applies size classes', () => {
    const large = mount(DatePicker, { props: { size: 'large' } })
    expect(large.classes()).toContain('zc-date-picker--large')

    const small = mount(DatePicker, { props: { size: 'small' } })
    expect(small.classes()).toContain('zc-date-picker--small')
  })

  it('opens panel on click', async () => {
    const wrapper = mount(DatePicker)
    expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(false)
    await wrapper.trigger('click')
    expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(true)
  })

  it('renders calendar header with year and month', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.trigger('click')
    const header = wrapper.find('.zc-date-picker__header-label')
    expect(header.text()).toMatch(/\d{4} 年/)
  })

  it('renders weekday headers', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.trigger('click')
    const weekdays = wrapper.findAll('.zc-date-picker__weekday')
    expect(weekdays).toHaveLength(7)
    expect(weekdays[0].text()).toBe('日')
    expect(weekdays[6].text()).toBe('六')
  })

  it('renders 42 calendar cells', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.trigger('click')
    const days = wrapper.findAll('.zc-date-picker__day')
    expect(days).toHaveLength(42)
  })

  it('renders shortcuts when provided', async () => {
    const wrapper = mount(DatePicker, {
      props: {
        shortcuts: [
          { text: '今天', value: () => new Date() },
          { text: '昨天', value: () => new Date() },
        ],
      },
    })
    await wrapper.trigger('click')
    const shortcutButtons = wrapper.findAll('.zc-date-picker__shortcut')
    expect(shortcutButtons).toHaveLength(2)
    expect(shortcutButtons[0].text()).toBe('今天')
  })

  it('does not open when disabled', async () => {
    const wrapper = mount(DatePicker, {
      props: { disabled: true },
    })
    await wrapper.trigger('click')
    expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(false)
  })

  it('renders two inputs in range mode', () => {
    const wrapper = mount(DatePicker, {
      props: { type: 'daterange' },
    })
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
  })

  it('applies range class in daterange mode', () => {
    const wrapper = mount(DatePicker, {
      props: { type: 'daterange' },
    })
    expect(wrapper.classes()).toContain('is-range')
  })

  it('navigates to previous month', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.trigger('click')
    const initialHeader = wrapper.find('.zc-date-picker__header-label').text()
    await wrapper.find('.zc-date-picker__prev-month').trigger('click')
    const newHeader = wrapper.find('.zc-date-picker__header-label').text()
    expect(initialHeader).not.toBe(newHeader)
  })

  it('navigates to next month', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.trigger('click')
    const initialHeader = wrapper.find('.zc-date-picker__header-label').text()
    await wrapper.find('.zc-date-picker__next-month').trigger('click')
    const newHeader = wrapper.find('.zc-date-picker__header-label').text()
    expect(initialHeader).not.toBe(newHeader)
  })

  it('selects a date and closes panel', async () => {
    const wrapper = mount(DatePicker)
    await wrapper.trigger('click')
    const days = wrapper.findAll('.zc-date-picker__day')
    // Click a day in the current month (not other-month)
    const currentMonthDay = days.find((d) => !d.classes().includes('is-other-month'))
    if (currentMonthDay) {
      await currentMonthDay.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('change')).toBeTruthy()
      // Panel should close after selection
      expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(false)
    }
  })
})
