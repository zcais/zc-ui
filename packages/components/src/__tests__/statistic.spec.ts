import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import Statistic from '../statistic/statistic.vue'

describe('ZcStatistic', () => {
  it('renders with default value', () => {
    const wrapper = mount(Statistic)
    expect(wrapper.find('.zc-statistic').exists()).toBe(true)
    expect(wrapper.find('.zc-statistic__value').text()).toBe('0')
  })

  it('renders with value', () => {
    const wrapper = mount(Statistic, { props: { value: 1234 } })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('1,234')
  })

  it('renders with title', () => {
    const wrapper = mount(Statistic, { props: { title: 'Total Users', value: 100 } })
    expect(wrapper.find('.zc-statistic__title').text()).toBe('Total Users')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, prefix: '$', suffix: 'USD' },
    })
    expect(wrapper.find('.zc-statistic__prefix').text()).toBe('$')
    expect(wrapper.find('.zc-statistic__suffix').text()).toBe('USD')
  })

  it('formats number with precision', () => {
    const wrapper = mount(Statistic, {
      props: { value: 1234.5678, precision: 2 },
    })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('1,234.57')
  })

  it('renders custom prefix slot', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100 },
      slots: { prefix: '<span class="custom-prefix">¥</span>' },
    })
    expect(wrapper.find('.custom-prefix').exists()).toBe(true)
  })

  it('renders custom value slot', () => {
    const wrapper = mount(Statistic, {
      slots: { default: '<span class="custom-value">N/A</span>' },
    })
    expect(wrapper.find('.custom-value').exists()).toBe(true)
  })

  it('applies valueStyle', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, valueStyle: { color: 'red' } },
    })
    const style = wrapper.find('.zc-statistic__value').attributes('style')
    expect(style).toContain('color: red')
  })

  it('uses custom formatter', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 0.85,
        formatter: (val: number) => `${(val * 100).toFixed(0)}%`,
      },
    })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('85%')
  })

  // ---- custom decimal and group separators ----
  it('uses custom decimalSeparator and groupSeparator', () => {
    const wrapper = mount(Statistic, {
      props: { value: 1234567.89, precision: 2, decimalSeparator: ',', groupSeparator: '.' },
    })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('1.234.567,89')
  })

  // ---- suffix prop alone (existing test has prefix+suffix) ----
  it('renders suffix prop alone', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, suffix: 'kg' },
    })
    expect(wrapper.find('.zc-statistic__suffix').text()).toBe('kg')
  })

  // ---- title slot ----
  it('renders title slot', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100 },
      slots: { title: '<span class="custom-title">Custom Title</span>' },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.custom-title').text()).toBe('Custom Title')
  })

  // ---- suffix slot ----
  it('renders suffix slot', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100 },
      slots: { suffix: '<span class="custom-suffix">USD</span>' },
    })
    expect(wrapper.find('.custom-suffix').exists()).toBe(true)
    expect(wrapper.find('.custom-suffix').text()).toBe('USD')
  })

  // ---- valueStyle with multiple properties ----
  it('applies valueStyle with multiple properties', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, valueStyle: { color: 'blue', fontSize: '24px', fontWeight: 'bold' } },
    })
    const style = wrapper.find('.zc-statistic__value').attributes('style')
    expect(style).toContain('color: blue')
    expect(style).toContain('font-size: 24px')
    expect(style).toContain('font-weight: bold')
  })

  // ---- formatter returning complex strings ----
  it('formats with complex formatter returning formatted string', () => {
    const wrapper = mount(Statistic, {
      props: {
        value: 12345.67,
        precision: 2,
        formatter: (val: number) => `¥ ${val.toLocaleString('en-US')}`,
      },
    })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('¥ 12,345.67')
  })

  // ---- countUp animation ----
  it('animates countUp to final value', () => {
    const wrapper = mount(Statistic, {
      props: { value: 100, countUp: true, countFrom: 0, duration: 2000 },
    })
    // Animation should have completed
    expect(wrapper.find('.zc-statistic__value').text()).toBe('100')
  })

  it('applies displayValue correctly for countUp with non-default value', () => {
    const wrapper = mount(Statistic, {
      props: { value: 5000, countUp: true, countFrom: 100, duration: 3000 },
    })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('5,000')
  })

  // ---- countdown ----
  it('displays countdown with startValue < 1e10 (seconds mode)', async () => {
    const spy = vi.spyOn(Date, 'now').mockReturnValue(0)
    const wrapper = mount(Statistic, {
      props: { countdown: true, startValue: 5000 },
    })
    await flushPromises()
    // startValue < 1e10 => diff = startValue = 5000 => 5 seconds
    expect(wrapper.find('.zc-statistic__value').text()).toBe('00:00:05')
    spy.mockRestore()
  })

  it('displays countdown with timestamp startValue', async () => {
    const fakeNow = 5000000000000
    const spy = vi.spyOn(Date, 'now').mockReturnValue(fakeNow)
    const wrapper = mount(Statistic, {
      props: { countdown: true, startValue: fakeNow + 7200000 }, // +2 hours
    })
    await flushPromises()
    expect(wrapper.find('.zc-statistic__value').text()).toBe('02:00:00')
    spy.mockRestore()
  })

  it('shows 00:00:00 when countdown expires', async () => {
    const wrapper = mount(Statistic, {
      props: { countdown: true, startValue: 0 },
    })
    await flushPromises()
    expect(wrapper.find('.zc-statistic__value').text()).toBe('00:00:00')
  })

  // ---- value change via watch ----
  it('updates display when value prop changes', async () => {
    const wrapper = mount(Statistic, {
      props: { value: 100 },
    })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('100')

    await wrapper.setProps({ value: 500 })
    expect(wrapper.find('.zc-statistic__value').text()).toBe('500')
  })
})
