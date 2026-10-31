import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import StatisticCard from '../statistic-card/statistic-card.vue'

describe('ZcStatisticCard', () => {
  it('renders root element with title and value', () => {
    const wrapper = mount(StatisticCard, { props: { title: 'Sales', value: 1234 } })
    expect(wrapper.find('.zc-statistic-card').exists()).toBe(true)
    expect(wrapper.find('.zc-statistic-card__title').text()).toBe('Sales')
    expect(wrapper.find('.zc-statistic-card__value-content').text()).toBe('1,234')
  })

  it('formats large numbers with thousands separators by default', () => {
    const wrapper = mount(StatisticCard, { props: { value: 1234567 } })
    expect(wrapper.find('.zc-statistic-card__value-content').text()).toBe('1,234,567')
  })

  it('formats decimals correctly', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 3.14159, decimals: 2, separator: false },
    })
    expect(wrapper.find('.zc-statistic-card__value-content').text()).toBe('3.14')
  })

  it('keeps separator when decimals are used', () => {
    const wrapper = mount(StatisticCard, { props: { value: 1234.5, decimals: 1 } })
    expect(wrapper.find('.zc-statistic-card__value-content').text()).toBe('1,234.5')
  })

  it('renders string value as-is without formatting', () => {
    const wrapper = mount(StatisticCard, { props: { value: 'N/A' } })
    expect(wrapper.find('.zc-statistic-card__value-content').text()).toBe('N/A')
  })

  it('does not apply separators when separator is false', () => {
    const wrapper = mount(StatisticCard, { props: { value: 98765, separator: false } })
    expect(wrapper.find('.zc-statistic-card__value-content').text()).toBe('98765')
  })

  it('renders prefix and suffix', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 100, prefix: '$', suffix: 'USD' },
    })
    expect(wrapper.find('.zc-statistic-card__prefix').text()).toBe('$')
    expect(wrapper.find('.zc-statistic-card__suffix').text()).toBe('USD')
  })

  it('applies is-bordered class by default and removes it when bordered is false', () => {
    const bordered = mount(StatisticCard, { props: { value: 1 } })
    expect(bordered.find('.zc-statistic-card').classes()).toContain('is-bordered')
    const unbordered = mount(StatisticCard, { props: { value: 1, bordered: false } })
    expect(unbordered.find('.zc-statistic-card').classes()).not.toContain('is-bordered')
  })

  it('applies trend up class and shows arrow with positive trendValue', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 100, trend: 'up', trendValue: 12.5 },
    })
    const trend = wrapper.find('.zc-statistic-card__trend')
    expect(trend.exists()).toBe(true)
    expect(trend.classes()).toContain('zc-statistic-card--up')
    expect(trend.find('.zc-statistic-card__trend-arrow').exists()).toBe(true)
    expect(trend.find('.zc-statistic-card__trend-value').text()).toBe('+12.5%')
  })

  it('applies trend down class and renders negative trendValue without extra sign', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 100, trend: 'down', trendValue: -3.2 },
    })
    const trend = wrapper.find('.zc-statistic-card__trend')
    expect(trend.classes()).toContain('zc-statistic-card--down')
    expect(trend.find('.zc-statistic-card__trend-value').text()).toBe('-3.2%')
  })

  it('does not render trend element when trend is none and no trendValue', () => {
    const wrapper = mount(StatisticCard, { props: { value: 100 } })
    expect(wrapper.find('.zc-statistic-card__trend').exists()).toBe(false)
  })

  it('renders trend label with default text', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 100, trend: 'up', trendValue: 5 },
    })
    expect(wrapper.find('.zc-statistic-card__trend-label').text()).toBe('vs last period')
  })

  it('renders custom trend label', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 100, trend: 'down', trendValue: 1, trendLabel: '较上周' },
    })
    expect(wrapper.find('.zc-statistic-card__trend-label').text()).toBe('较上周')
  })

  it('renders skeleton when loading and hides real content', () => {
    const wrapper = mount(StatisticCard, {
      props: { title: 'T', value: 999, loading: true },
    })
    expect(wrapper.find('.zc-statistic-card__skeleton').exists()).toBe(true)
    expect(wrapper.find('.zc-statistic-card__skeleton-value').exists()).toBe(true)
    expect(wrapper.find('.zc-statistic-card__value').exists()).toBe(false)
    expect(wrapper.classes()).toContain('is-loading')
  })

  it('applies padding style to card', () => {
    const wrapper = mount(StatisticCard, { props: { value: 1, padding: 30 } })
    expect(wrapper.attributes('style')).toContain('padding: 30px')
  })

  it('emits click event when card is clicked', async () => {
    const wrapper = mount(StatisticCard, { props: { value: 1 } })
    await wrapper.trigger('click')
    expect(wrapper.emitted('click')).toBeTruthy()
  })

  it('renders footer slot', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 1 },
      slots: { footer: '<div class="custom-footer">footer content</div>' },
    })
    expect(wrapper.find('.zc-statistic-card__footer').exists()).toBe(true)
    expect(wrapper.find('.custom-footer').text()).toBe('footer content')
  })

  it('renders title and avatar slots', () => {
    const wrapper = mount(StatisticCard, {
      props: { value: 1, title: 'ignored' },
      slots: {
        title: '<span class="custom-title">Slotted Title</span>',
        avatar: '<img class="custom-avatar" src="x.png" />',
      },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
    expect(wrapper.find('.zc-statistic-card__avatar').exists()).toBe(true)
    expect(wrapper.find('.custom-avatar').exists()).toBe(true)
  })
})
