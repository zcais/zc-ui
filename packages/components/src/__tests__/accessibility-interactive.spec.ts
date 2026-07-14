import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcRate from '../rate/rate.vue'
import ZcCarousel from '../carousel/carousel.vue'
import ZcBacktop from '../backtop/backtop.vue'
import ZcCollapseItem from '../collapse/collapse-item.vue'

describe('Accessibility: Rate', () => {
  it('should have role="slider"', () => {
    const wrapper = mount(ZcRate)
    expect(wrapper.attributes('role')).toBe('slider')
  })

  it('should have aria-valuenow, aria-valuemin, aria-valuemax', () => {
    const wrapper = mount(ZcRate, { props: { modelValue: 3, max: 5 } })
    expect(wrapper.attributes('aria-valuenow')).toBe('3')
    expect(wrapper.attributes('aria-valuemin')).toBe('0')
    expect(wrapper.attributes('aria-valuemax')).toBe('5')
  })

  it('should have aria-disabled (not aria-valuedisabled)', () => {
    const wrapper = mount(ZcRate, { props: { disabled: true } })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
    expect(wrapper.attributes('aria-valuedisabled')).toBeUndefined()
  })

  it('should be focusable when not disabled', () => {
    const wrapper = mount(ZcRate)
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should not be focusable when disabled', () => {
    const wrapper = mount(ZcRate, { props: { disabled: true } })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('should increment on ArrowRight', async () => {
    const wrapper = mount(ZcRate, { props: { modelValue: 2 } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('should decrement on ArrowLeft', async () => {
    const wrapper = mount(ZcRate, { props: { modelValue: 3 } })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('should go to max on End', async () => {
    const wrapper = mount(ZcRate, { props: { modelValue: 2, max: 5 } })
    await wrapper.trigger('keydown', { key: 'End' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([5])
  })

  it('should go to 0 on Home', async () => {
    const wrapper = mount(ZcRate, { props: { modelValue: 3 } })
    await wrapper.trigger('keydown', { key: 'Home' })
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([0])
  })
})

describe('Accessibility: Carousel', () => {
  it('should have role="region" and aria-roledescription', () => {
    const wrapper = mount(ZcCarousel, { props: { arrow: 'always' } })
    expect(wrapper.attributes('role')).toBe('region')
    expect(wrapper.attributes('aria-roledescription')).toBe('走马灯')
  })

  it('should have aria-label on arrow buttons', () => {
    const wrapper = mount(ZcCarousel, { props: { arrow: 'always' } })
    const buttons = wrapper.findAll('.zc-carousel__arrow')
    expect(buttons[0]?.attributes('aria-label')).toBe('上一张')
    expect(buttons[1]?.attributes('aria-label')).toBe('下一张')
  })
})

describe('Accessibility: Backtop', () => {
  it('should have role="button" and aria-label', () => {
    const wrapper = mount(ZcBacktop)
    const btn = wrapper.find('.zc-backtop')
    expect(btn.attributes('role')).toBe('button')
    expect(btn.attributes('aria-label')).toBe('返回顶部')
  })
})

describe('Accessibility: Collapse Item', () => {
  it('should have role="tab"', () => {
    const wrapper = mount(ZcCollapseItem)
    expect(wrapper.find('.zc-collapse-item__header').attributes('role')).toBe('tab')
  })

  it('should have aria-expanded', () => {
    const wrapper = mount(ZcCollapseItem)
    expect(wrapper.find('.zc-collapse-item__header').attributes('aria-expanded')).toBe('false')
  })
})
