import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import DatePicker from '../date-picker/date-picker.vue'

// The dropdown is teleported to <body> in production so it escapes overflow
// clipping. In tests, stub Teleport to render the dropdown in place, keeping
// wrapper.findAll assertions working without attachTo ceremony.
const globalStubs = { stubs: { teleport: true } }

describe('ZcDatePicker', () => {
  it('renders with zc-date-picker class', () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    expect(wrapper.classes()).toContain('zc-date-picker')
  })

  it('displays placeholder text', () => {
    const wrapper = mount(DatePicker, {
      global: globalStubs,
      props: { placeholder: 'Select a date' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Select a date')
  })

  it('shows default placeholder when not provided', () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    expect(wrapper.find('input').attributes('placeholder')).toBe('请选择日期')
  })

  it('applies disabled class', () => {
    const wrapper = mount(DatePicker, { global: globalStubs, props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('applies size classes', () => {
    const large = mount(DatePicker, { global: globalStubs, props: { size: 'large' } })
    expect(large.classes()).toContain('zc-date-picker--large')

    const small = mount(DatePicker, { global: globalStubs, props: { size: 'small' } })
    expect(small.classes()).toContain('zc-date-picker--small')
  })

  it('opens panel on click', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(false)
    await wrapper.trigger('click')
    expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(true)
  })

  it('renders calendar header with year and month', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    await wrapper.trigger('click')
    const header = wrapper.find('.zc-date-picker__header-label')
    expect(header.text()).toMatch(/\d{4} 年/)
  })

  it('renders weekday headers', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    await wrapper.trigger('click')
    const weekdays = wrapper.findAll('.zc-date-picker__weekday')
    expect(weekdays).toHaveLength(7)
    expect(weekdays[0].text()).toBe('日')
    expect(weekdays[6].text()).toBe('六')
  })

  it('renders 42 calendar cells', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    await wrapper.trigger('click')
    const days = wrapper.findAll('.zc-date-picker__day')
    expect(days).toHaveLength(42)
  })

  it('renders shortcuts when provided', async () => {
    const wrapper = mount(DatePicker, {
      global: globalStubs,
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
    const wrapper = mount(DatePicker, { global: globalStubs, props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.find('.zc-date-picker__panel').exists()).toBe(false)
  })

  it('renders two inputs in range mode', () => {
    const wrapper = mount(DatePicker, { global: globalStubs, props: { type: 'daterange' } })
    const inputs = wrapper.findAll('input')
    expect(inputs).toHaveLength(2)
  })

  it('applies range class in daterange mode', () => {
    const wrapper = mount(DatePicker, { global: globalStubs, props: { type: 'daterange' } })
    expect(wrapper.classes()).toContain('is-range')
  })

  it('navigates to previous month', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    await wrapper.trigger('click')
    const initialHeader = wrapper.find('.zc-date-picker__header-label').text()
    await wrapper.find('.zc-date-picker__prev-month').trigger('click')
    const newHeader = wrapper.find('.zc-date-picker__header-label').text()
    expect(initialHeader).not.toBe(newHeader)
  })

  it('navigates to next month', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
    await wrapper.trigger('click')
    const initialHeader = wrapper.find('.zc-date-picker__header-label').text()
    await wrapper.find('.zc-date-picker__next-month').trigger('click')
    const newHeader = wrapper.find('.zc-date-picker__header-label').text()
    expect(initialHeader).not.toBe(newHeader)
  })

  it('selects a date and closes panel', async () => {
    const wrapper = mount(DatePicker, { global: globalStubs })
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

  // ---- value-format (Element Plus compatible) ----
  describe('valueFormat', () => {
    it('emits a formatted string instead of a Date when valueFormat is set', async () => {
      const wrapper = mount(DatePicker, {
        global: globalStubs,
        props: { modelValue: '', valueFormat: 'YYYY-MM-DD' },
      })
      await wrapper.find('input').trigger('click') // open the panel
      const day = wrapper
        .findAll('.zc-date-picker__day')
        .find(
          (d) => !d.classes().includes('is-other-month') && !d.classes().includes('is-disabled')
        )
      await day!.trigger('click')
      const emitted = wrapper.emitted('update:modelValue')!
      const value = emitted[emitted.length - 1][0] as string
      expect(typeof value).toBe('string')
      expect(value).toMatch(/^\d{4}-\d{2}-\d{2}$/)
    })

    it('parses a value-format string modelValue into the panel', async () => {
      const wrapper = mount(DatePicker, {
        global: globalStubs,
        props: { modelValue: '2026-03-15', valueFormat: 'YYYY-MM-DD' },
      })
      await wrapper.find('input').trigger('click') // open the panel
      const selected = wrapper.find('.zc-date-picker__day.is-selected')
      expect(selected.exists()).toBe(true)
      expect(selected.text()).toBe('15')
    })

    it('emits an empty string on clear with valueFormat', async () => {
      const wrapper = mount(DatePicker, {
        global: globalStubs,
        props: { modelValue: '2026-03-15', valueFormat: 'YYYY-MM-DD', clearable: true },
      })
      await wrapper.find('input').trigger('click') // open the panel (clear shows when open)
      await wrapper.find('.zc-date-picker__clear').trigger('click')
      const emitted = wrapper.emitted('update:modelValue')!
      expect(emitted[emitted.length - 1][0]).toBe('')
    })
  })

  // ---- editable manual input ----
  describe('editable', () => {
    it('input is writable by default and readonly when editable=false', () => {
      const writable = mount(DatePicker, { global: globalStubs })
      expect(writable.find('input').attributes('readonly')).toBeUndefined()

      const readonly = mount(DatePicker, { global: globalStubs, props: { editable: false } })
      expect(readonly.find('input').attributes('readonly')).toBeDefined()
    })

    it('commits a typed date on Enter and emits the parsed value', async () => {
      const wrapper = mount(DatePicker, { global: globalStubs, props: { modelValue: '' } })
      const input = wrapper.find('input')
      ;(input.element as HTMLInputElement).value = '2026-03-15'
      await input.trigger('input')
      await input.trigger('keydown', { key: 'Enter' })

      const emitted = wrapper.emitted('update:modelValue')!
      expect(emitted).toBeTruthy()
      const value = emitted[emitted.length - 1][0] as Date
      expect(value).toBeInstanceOf(Date)
      expect((value as Date).getFullYear()).toBe(2026)
      expect((value as Date).getMonth()).toBe(2)
      expect((value as Date).getDate()).toBe(15)
    })

    it('restores the display value when the typed text is invalid', async () => {
      const wrapper = mount(DatePicker, {
        global: globalStubs,
        props: { modelValue: new Date(2026, 2, 15) },
      })
      const input = wrapper.find('input')
      ;(input.element as HTMLInputElement).value = 'not-a-date'
      await input.trigger('input')
      await input.trigger('blur')

      expect(wrapper.emitted('update:modelValue')).toBeUndefined()
      // display value is restored
      expect((input.element as HTMLInputElement).value).not.toBe('not-a-date')
    })

    it('clears the value when the input is emptied and committed', async () => {
      const wrapper = mount(DatePicker, {
        global: globalStubs,
        props: { modelValue: new Date(2026, 2, 15), clearable: true },
      })
      const input = wrapper.find('input')
      ;(input.element as HTMLInputElement).value = ''
      await input.trigger('input')
      await input.trigger('keydown', { key: 'Enter' })

      const emitted = wrapper.emitted('update:modelValue')!
      expect(emitted[emitted.length - 1][0]).toBe('')
    })
  })
})
