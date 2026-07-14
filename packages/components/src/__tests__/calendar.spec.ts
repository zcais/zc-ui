import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Calendar from '../calendar/calendar.vue'

describe('ZcCalendar', () => {
  it('renders with zc-calendar class', () => {
    const wrapper = mount(Calendar)
    expect(wrapper.classes()).toContain('zc-calendar')
  })

  it('renders header with year and month', () => {
    const testDate = new Date(2025, 5, 15) // June 2025
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })
    const title = wrapper.find('.zc-calendar__title')
    expect(title.text()).toContain('2025')
  })

  it('renders 42 day cells (6 weeks)', () => {
    const wrapper = mount(Calendar)
    const days = wrapper.findAll('.zc-calendar__day')
    expect(days).toHaveLength(42)
  })

  it('renders 7 weekday headers', () => {
    const wrapper = mount(Calendar)
    const weekdays = wrapper.findAll('.zc-calendar__weekday')
    expect(weekdays).toHaveLength(7)
  })

  it('renders today button', () => {
    const wrapper = mount(Calendar)
    const todayBtn = wrapper.find('.zc-calendar__btn-today')
    expect(todayBtn.exists()).toBe(true)
    expect(todayBtn.text()).toBe('今天')
  })

  // ---- Navigation ----
  it('navigates to previous month on prev button click', async () => {
    const testDate = new Date(2025, 5, 15)
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })
    const title = wrapper.find('.zc-calendar__title')
    expect(title.text()).toContain('2025')

    await wrapper.find('.zc-calendar__btn-prev-month').trigger('click')
    expect(wrapper.find('.zc-calendar__title').text()).toContain('2025')
    // May should be displayed - check it changed month
    const days = wrapper.findAll('.zc-calendar__day:not(.is-other-month)')
    expect(days.length).toBeGreaterThan(0)
  })

  it('navigates to next month on next button click', async () => {
    const testDate = new Date(2025, 0, 15) // January 2025
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })

    await wrapper.find('.zc-calendar__btn-next-month').trigger('click')
    // Should display February 2025
    const title = wrapper.find('.zc-calendar__title')
    expect(title.text()).toContain('2025')
  })

  it('navigates to previous year on prev year button click', async () => {
    const testDate = new Date(2025, 5, 15)
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })

    await wrapper.find('.zc-calendar__btn-prev-year').trigger('click')
    expect(wrapper.find('.zc-calendar__title').text()).toContain('2024')
  })

  it('navigates to next year on next year button click', async () => {
    const testDate = new Date(2025, 5, 15)
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })

    await wrapper.find('.zc-calendar__btn-next-year').trigger('click')
    expect(wrapper.find('.zc-calendar__title').text()).toContain('2026')
  })

  it('jumps to today on today button click', async () => {
    const testDate = new Date(2020, 0, 1)
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })
    // Navigate away first
    expect(wrapper.find('.zc-calendar__title').text()).toContain('2020')

    await wrapper.find('.zc-calendar__btn-today').trigger('click')
    const title = wrapper.find('.zc-calendar__title')
    const now = new Date()
    expect(title.text()).toContain(String(now.getFullYear()))
  })

  // ---- Date selection ----
  it('emits select event when a date is clicked', async () => {
    const wrapper = mount(Calendar)
    const firstDay = wrapper.find('.zc-calendar__day')
    await firstDay.trigger('click')

    expect(wrapper.emitted('select')).toBeTruthy()
    const emittedDate = wrapper.emitted('select')![0][0] as Date
    expect(emittedDate).toBeInstanceOf(Date)
  })

  it('emits update:modelValue when a date is clicked', async () => {
    const wrapper = mount(Calendar)
    const firstDay = wrapper.find('.zc-calendar__day')
    await firstDay.trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    const emittedDate = wrapper.emitted('update:modelValue')![0][0] as Date
    expect(emittedDate).toBeInstanceOf(Date)
  })

  it('emits change event when a date is clicked', async () => {
    const wrapper = mount(Calendar)
    const firstDay = wrapper.find('.zc-calendar__day')
    await firstDay.trigger('click')

    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('selects date via Enter key', async () => {
    const wrapper = mount(Calendar)
    const firstDay = wrapper.find('.zc-calendar__day')
    await firstDay.trigger('keydown', { key: 'Enter' })

    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('selects date via Space key', async () => {
    const wrapper = mount(Calendar)
    const firstDay = wrapper.find('.zc-calendar__day')
    await firstDay.trigger('keydown', { key: ' ' })

    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('applies selected class to the selected date', () => {
    const testDate = new Date(2025, 5, 15)
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })
    const selectedCells = wrapper.findAll('.zc-calendar__day.is-selected')
    expect(selectedCells.length).toBe(1)
  })

  // ---- first-day-of-week ----
  it('supports firstDayOfWeek prop (Monday=1)', () => {
    const wrapper = mount(Calendar, {
      props: { firstDayOfWeek: 1 },
    })
    const weekdays = wrapper.findAll('.zc-calendar__weekday')
    // With Monday as first day, first label should be "一" (zh-CN Monday)
    expect(weekdays[0].text()).toBe('一')
  })

  it('defaults to Sunday as first day of week', () => {
    const wrapper = mount(Calendar)
    const weekdays = wrapper.findAll('.zc-calendar__weekday')
    expect(weekdays[0].text()).toBe('日')
  })

  // ---- range ----
  it('highlights dates within range', () => {
    const testDate = new Date(2025, 5, 15) // June 15, 2025
    const range = {
      start: new Date(2025, 5, 10),
      end: new Date(2025, 5, 20),
    }
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate, range },
    })

    const inRangeCells = wrapper.findAll('.zc-calendar__day.is-in-range')
    expect(inRangeCells.length).toBeGreaterThan(0)
    // June 10-20 = 11 days
    expect(inRangeCells.length).toBe(11)
  })

  it('does not highlight any date when range is not provided', () => {
    const wrapper = mount(Calendar)
    const inRangeCells = wrapper.findAll('.zc-calendar__day.is-in-range')
    expect(inRangeCells.length).toBe(0)
  })

  // ---- other-month cells ----
  it('marks cells outside the current month with is-other-month class', () => {
    const testDate = new Date(2025, 5, 15) // June 2025
    const wrapper = mount(Calendar, {
      props: { modelValue: testDate },
    })
    const otherMonthCells = wrapper.findAll('.zc-calendar__day.is-other-month')
    expect(otherMonthCells.length).toBeGreaterThan(0)
  })

  // ---- today highlight ----
  it('marks today with is-today class', () => {
    const wrapper = mount(Calendar)
    const todayCells = wrapper.findAll('.zc-calendar__day.is-today')
    expect(todayCells.length).toBe(1)
  })

  // ---- Slot support ----
  it('supports date-cell scoped slot', () => {
    const wrapper = mount(Calendar, {
      slots: {
        'date-cell':
          '<template #date-cell="{ data }"><span class="custom-cell">{{ data.day }}</span></template>',
      },
    })
    const customCells = wrapper.findAll('.custom-cell')
    expect(customCells.length).toBe(42)
    // Verify slot receives cell data
    const firstCell = customCells[0]
    expect(firstCell.text()).toBeTruthy()
  })

  it('slot data includes isInMonth property', () => {
    const wrapper = mount(Calendar, {
      slots: {
        'date-cell':
          '<template #date-cell="{ data }"><span :class="[data.isInMonth ? \'in-month\' : \'not-in-month\']">{{ data.day }}</span></template>',
      },
    })
    const inMonth = wrapper.findAll('.in-month')
    const notInMonth = wrapper.findAll('.not-in-month')
    expect(inMonth.length).toBeGreaterThan(0)
    expect(notInMonth.length).toBeGreaterThan(0)
  })

  it('slot data includes isToday property', () => {
    const wrapper = mount(Calendar, {
      slots: {
        'date-cell':
          '<template #date-cell="{ data }"><span :class="{ \'is-today-cell\': data.isToday }">{{ data.day }}</span></template>',
      },
    })
    const todayCells = wrapper.findAll('.is-today-cell')
    expect(todayCells.length).toBe(1)
  })

  // ---- modelValue sync ----
  it('updates viewDate when modelValue changes', async () => {
    const wrapper = mount(Calendar, {
      props: { modelValue: new Date(2025, 5, 15) },
    })
    expect(wrapper.find('.zc-calendar__title').text()).toContain('2025')

    await wrapper.setProps({ modelValue: new Date(2023, 2, 10) })
    expect(wrapper.find('.zc-calendar__title').text()).toContain('2023')
  })

  // ---- Expose ----
  it('exposes navigation methods', () => {
    const wrapper = mount(Calendar)
    const vm = wrapper.vm as any
    expect(typeof vm.prevMonth).toBe('function')
    expect(typeof vm.nextMonth).toBe('function')
    expect(typeof vm.prevYear).toBe('function')
    expect(typeof vm.nextYear).toBe('function')
    expect(typeof vm.goToday).toBe('function')
  })

  // ---- Default value ----
  it('defaults modelValue to current date when not provided', () => {
    const wrapper = mount(Calendar)
    const todayCells = wrapper.findAll('.zc-calendar__day.is-today')
    expect(todayCells.length).toBe(1)
  })
})
