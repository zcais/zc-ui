import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import Slider from '../slider/slider.vue'

describe('ZcSlider', () => {
  it('renders with default props', () => {
    const wrapper = mount(Slider)
    expect(wrapper.find('.zc-slider').exists()).toBe(true)
    expect(wrapper.find('.zc-slider__runway').exists()).toBe(true)
    expect(wrapper.find('.zc-slider__thumb-wrapper').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(Slider, { props: { size: 'large' } })
    expect(wrapper.find('.zc-slider').classes()).toContain('zc-slider--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(Slider, { props: { size: 'small' } })
    expect(wrapper.find('.zc-slider').classes()).toContain('zc-slider--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(Slider, { props: { disabled: true } })
    expect(wrapper.find('.zc-slider').classes()).toContain('is-disabled')
  })

  it('applies vertical class', () => {
    const wrapper = mount(Slider, { props: { vertical: true } })
    expect(wrapper.find('.zc-slider').classes()).toContain('is-vertical')
  })

  it('applies range class', () => {
    const wrapper = mount(Slider, { props: { range: true, modelValue: [20, 80] } })
    expect(wrapper.find('.zc-slider').classes()).toContain('is-range')
    // Should have 2 thumbs
    expect(wrapper.findAll('.zc-slider__thumb-wrapper').length).toBe(2)
  })

  it('shows tooltip on hover', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const thumbWrapper = wrapper.find('.zc-slider__thumb-wrapper')
    await thumbWrapper.trigger('mouseenter')
    const tooltip = wrapper.find('.zc-slider__tooltip')
    expect(tooltip.exists()).toBe(true)
  })

  it('hides tooltip when showTooltip is false', () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, showTooltip: false } })
    expect(wrapper.find('.zc-slider__tooltip').exists()).toBe(false)
  })

  it('renders marks', () => {
    const marks = [
      { value: 0, label: '0%' },
      { value: 50, label: '50%' },
      { value: 100, label: '100%' },
    ]
    const wrapper = mount(Slider, { props: { marks } })
    const markLabels = wrapper.findAll('.zc-slider__mark-label')
    expect(markLabels.length).toBe(3)
    expect(markLabels[0].text()).toBe('0%')
    expect(markLabels[1].text()).toBe('50%')
    expect(markLabels[2].text()).toBe('100%')
  })

  it('applies custom height for vertical mode', () => {
    const wrapper = mount(Slider, { props: { vertical: true, height: '300px' } })
    const runway = wrapper.find('.zc-slider__runway')
    expect(runway.attributes('style')).toContain('height: 300px')
  })

  it('renders with single thumb by default', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30 } })
    expect(wrapper.findAll('.zc-slider__thumb-wrapper').length).toBe(1)
  })

  it('renders active bar', () => {
    const wrapper = mount(Slider, { props: { modelValue: 30 } })
    const bar = wrapper.find('.zc-slider__bar')
    expect(bar.exists()).toBe(true)
  })

  it('respects min/max/step props', () => {
    const wrapper = mount(Slider, {
      props: { min: 10, max: 50, step: 5, modelValue: 25 },
    })
    const thumbWrapper = wrapper.find('.zc-slider__thumb-wrapper')
    expect(thumbWrapper.attributes('aria-valuemin')).toBe('10')
    expect(thumbWrapper.attributes('aria-valuemax')).toBe('50')
    expect(thumbWrapper.attributes('aria-valuenow')).toBe('25')
  })

  it('renders out-of-range modelValue without crashing (min boundary)', () => {
    const wrapper = mount(Slider, { props: { min: 0, max: 100, modelValue: -10 } })
    // Component displays raw value; clamping occurs during interaction only
    expect(wrapper.find('.zc-slider__thumb-wrapper').exists()).toBe(true)
  })

  it('renders out-of-range modelValue without crashing (max boundary)', () => {
    const wrapper = mount(Slider, { props: { min: 0, max: 100, modelValue: 200 } })
    expect(wrapper.find('.zc-slider__thumb-wrapper').exists()).toBe(true)
  })

  it('clamps value during track click to min boundary', async () => {
    const wrapper = mount(Slider, { props: { min: 0, max: 10, modelValue: 5 } })
    const runway = wrapper.find('.zc-slider__runway')
    Object.defineProperty(runway.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 20, right: 100, bottom: 20 }),
    })
    // Click far left
    await runway.trigger('click', { clientX: -50, clientY: 10 })
    const emitted = wrapper.emitted('update:modelValue') as [[number]]
    expect(emitted).toBeTruthy()
    expect(emitted[0][0]).toBe(0)
  })

  it('does not respond to track click when disabled', async () => {
    const wrapper = mount(Slider, {
      props: { disabled: true, modelValue: 50 },
    })
    const runway = wrapper.find('.zc-slider__runway')
    await runway.trigger('click')
    // value should still be 50
    const thumbWrapper = wrapper.find('.zc-slider__thumb-wrapper')
    expect(thumbWrapper.attributes('aria-valuenow')).toBe('50')
  })

  it('emits update:modelValue on track click', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const runway = wrapper.find('.zc-slider__runway')
    // Simulate clicking at the right edge
    Object.defineProperty(runway.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 20, right: 100, bottom: 20 }),
    })
    await runway.trigger('click', { clientX: 90, clientY: 10 })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    // Value should be near 90 (our click at 90% of width)
    const val = (emitted![0] as [number])[0]
    expect(val).toBeGreaterThanOrEqual(80)
  })

  it('emits change event on track click', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const runway = wrapper.find('.zc-slider__runway')
    Object.defineProperty(runway.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 20, right: 100, bottom: 20 }),
    })
    await runway.trigger('click', { clientX: 90, clientY: 10 })
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('emits input event on track click', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const runway = wrapper.find('.zc-slider__runway')
    Object.defineProperty(runway.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 20, right: 100, bottom: 20 }),
    })
    await runway.trigger('click', { clientX: 90, clientY: 10 })
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('handles keyboard ArrowRight to increment', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 5 } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = (emitted![0] as [number])[0]
    expect(val).toBe(55)
  })

  it('handles keyboard ArrowLeft to decrement', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 5 } })
    await wrapper.trigger('keydown', { key: 'ArrowLeft' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = (emitted![0] as [number])[0]
    expect(val).toBe(45)
  })

  it('handles keyboard Home to go to min', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, min: 0 } })
    await wrapper.trigger('keydown', { key: 'Home' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = (emitted![0] as [number])[0]
    expect(val).toBe(0)
  })

  it('handles keyboard End to go to max', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, max: 100 } })
    await wrapper.trigger('keydown', { key: 'End' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = (emitted![0] as [number])[0]
    expect(val).toBe(100)
  })

  it('ignores keyboard when disabled', async () => {
    const wrapper = mount(Slider, { props: { disabled: true, modelValue: 50 } })
    await wrapper.trigger('keydown', { key: 'ArrowRight' })
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('handles keyboard ArrowDown/ArrowUp for vertical orientation', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50, step: 5, vertical: true } })
    await wrapper.trigger('keydown', { key: 'ArrowUp' })
    let emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect((emitted![0] as [number])[0]).toBe(55)

    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    emitted = wrapper.emitted('update:modelValue')
    expect((emitted![1] as [number])[0]).toBe(50)
  })

  it('renders two thumbs with correct values in range mode', () => {
    const wrapper = mount(Slider, { props: { range: true, modelValue: [20, 80] } })
    const thumbs = wrapper.findAll('.zc-slider__thumb-wrapper')
    expect(thumbs.length).toBe(2)
    expect(thumbs[0].attributes('aria-valuenow')).toBe('20')
    expect(thumbs[1].attributes('aria-valuenow')).toBe('80')
  })

  it('updates first thumb in range mode on keyboard Home', async () => {
    const wrapper = mount(Slider, { props: { range: true, modelValue: [30, 80] } })
    await wrapper.trigger('keydown', { key: 'Home' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = (emitted![0] as [number[]])[0]
    expect(val[0]).toBe(0)
  })

  it('updates second thumb in range mode on keyboard End', async () => {
    const wrapper = mount(Slider, { props: { range: true, modelValue: [30, 80] } })
    await wrapper.trigger('keydown', { key: 'End' })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    const val = (emitted![0] as [number[]])[0]
    expect(val[1]).toBe(100)
  })

  it('snaps value to nearest step', async () => {
    const wrapper = mount(Slider, { props: { step: 10, modelValue: 50 } })
    const runway = wrapper.find('.zc-slider__runway')
    Object.defineProperty(runway.element, 'getBoundingClientRect', {
      value: () => ({ left: 0, top: 0, width: 100, height: 20, right: 100, bottom: 20 }),
    })
    // Click at 53% -> should snap to 50 (nearest multiple of 10)
    await runway.trigger('click', { clientX: 53, clientY: 10 })
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    expect((emitted![0] as [number])[0]).toBe(50)
  })

  it('shows tooltip only on hover and hides on leave', async () => {
    const wrapper = mount(Slider, { props: { modelValue: 50 } })
    const thumbWrapper = wrapper.find('.zc-slider__thumb-wrapper')
    // Initially no tooltip
    expect(wrapper.find('.zc-slider__tooltip').exists()).toBe(false)
    // Mouse enter
    await thumbWrapper.trigger('mouseenter')
    expect(wrapper.find('.zc-slider__tooltip').exists()).toBe(true)
    // Mouse leave (not dragging)
    await thumbWrapper.trigger('mouseleave')
    expect(wrapper.find('.zc-slider__tooltip').exists()).toBe(false)
  })
})
