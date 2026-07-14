import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Timeline from '../timeline/timeline.vue'
import TimelineItem from '../timeline/timeline-item.vue'

describe('ZcTimeline', () => {
  it('renders timeline', () => {
    const wrapper = mount(Timeline)
    expect(wrapper.find('.zc-timeline').exists()).toBe(true)
  })

  it('applies reverse class', () => {
    const wrapper = mount(Timeline, { props: { reverse: true } })
    expect(wrapper.find('.zc-timeline').classes()).toContain('is-reverse')
  })

  it('renders timeline items', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: `
          <timeline-item timestamp="2024-01-01">Event 1</timeline-item>
          <timeline-item timestamp="2024-01-02">Event 2</timeline-item>
        `,
      },
      global: { components: { TimelineItem } },
    })
    const items = wrapper.findAll('.zc-timeline-item')
    expect(items.length).toBe(2)
    expect(items[0].find('.zc-timeline-item__content').text()).toBe('Event 1')
  })

  it('renders timestamp in top position', () => {
    const wrapper = mount(Timeline, {
      slots: {
        default: '<timeline-item timestamp="2024-01-01">Event</timeline-item>',
      },
      global: { components: { TimelineItem } },
    })
    const ts = wrapper.find('.zc-timeline-item__timestamp')
    expect(ts.exists()).toBe(true)
    expect(ts.text()).toBe('2024-01-01')
    expect(ts.classes()).toContain('zc-timeline-item__timestamp--top')
  })

  it('applies type color to node', () => {
    const wrapper = mount(TimelineItem, {
      props: { type: 'success' },
    })
    expect(wrapper.find('.zc-timeline-item__node').classes()).toContain(
      'zc-timeline-item__node--success'
    )
  })

  it('applies hollow class', () => {
    const wrapper = mount(TimelineItem, {
      props: { type: 'primary', hollow: true },
    })
    expect(wrapper.find('.zc-timeline-item__node').classes()).toContain('is-hollow')
  })

  it('applies large size class', () => {
    const wrapper = mount(TimelineItem, {
      props: { size: 'large' },
    })
    expect(wrapper.find('.zc-timeline-item__node').classes()).toContain(
      'zc-timeline-item__node--large'
    )
  })

  it('hides timestamp when hideTimestamp is true', () => {
    const wrapper = mount(TimelineItem, {
      props: { timestamp: '2024-01-01', hideTimestamp: true },
    })
    expect(wrapper.find('.zc-timeline-item__timestamp').exists()).toBe(false)
  })

  it('renders custom dot slot', () => {
    const wrapper = mount(TimelineItem, {
      props: { type: 'primary' },
      slots: {
        dot: '<span class="custom-dot">★</span>',
      },
    })
    expect(wrapper.find('.custom-dot').exists()).toBe(true)
  })

  it('applies bottom placement for timestamp', () => {
    const wrapper = mount(TimelineItem, {
      props: { timestamp: '2024-01-01', placement: 'bottom' },
    })
    const ts = wrapper.find('.zc-timeline-item__timestamp')
    expect(ts.classes()).toContain('zc-timeline-item__timestamp--bottom')
  })
})
