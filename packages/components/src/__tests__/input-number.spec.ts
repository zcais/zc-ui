import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputNumber from '../input-number/input-number.vue'

describe('ZcInputNumber', () => {
  it('renders with default props', () => {
    const wrapper = mount(InputNumber)
    expect(wrapper.find('.zc-input-number').exists()).toBe(true)
    expect(wrapper.find('.zc-input-number__inner').exists()).toBe(true)
  })

  it('applies size class', () => {
    const wrapper = mount(InputNumber, { props: { size: 'large' } })
    expect(wrapper.find('.zc-input-number').classes()).toContain('zc-input-number--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(InputNumber, { props: { size: 'small' } })
    expect(wrapper.find('.zc-input-number').classes()).toContain('zc-input-number--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(InputNumber, { props: { disabled: true } })
    expect(wrapper.find('.zc-input-number').classes()).toContain('is-disabled')
    expect(wrapper.find('.zc-input-number__inner').attributes('disabled')).toBeDefined()
  })

  it('hides controls when controls is false', () => {
    const wrapper = mount(InputNumber, { props: { controls: false } })
    expect(wrapper.find('.zc-input-number').classes()).toContain('is-without-controls')
    expect(wrapper.find('.zc-input-number__decrease').exists()).toBe(false)
    expect(wrapper.find('.zc-input-number__increase').exists()).toBe(false)
  })

  it('applies controls-right position', () => {
    const wrapper = mount(InputNumber, { props: { controlsPosition: 'right' } })
    expect(wrapper.find('.zc-input-number').classes()).toContain('is-controls-right')
  })

  it('displays modelValue', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 42 } })
    expect((wrapper.find('.zc-input-number__inner').element as HTMLInputElement).value).toBe('42')
  })

  it('emits update:modelValue on increase button click', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.zc-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([6])
  })

  it('emits update:modelValue on decrease button click', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.zc-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([4])
  })

  it('respects min and max bounds', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, min: 0, max: 10, step: 3 } })
    // Decrease below min should stop at 2 (5 - 3 = 2)
    await wrapper.find('.zc-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([2])
  })

  it('respects max bound on increase - button disabled when step exceeds', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 9, min: 0, max: 10, step: 3 } })
    // 9 + 3 = 12 > 10, so increase button should be disabled
    expect(wrapper.find('.zc-input-number__increase').classes()).toContain('is-disabled')
  })

  it('emits change event', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.zc-input-number__increase').trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('applies placeholder', () => {
    const wrapper = mount(InputNumber, { props: { placeholder: 'Enter number' } })
    expect(wrapper.find('.zc-input-number__inner').attributes('placeholder')).toBe('Enter number')
  })

  it('applies readonly attribute', () => {
    const wrapper = mount(InputNumber, { props: { readonly: true } })
    expect(wrapper.find('.zc-input-number__inner').attributes('readonly')).toBeDefined()
  })

  it('disables increase when at max', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 10, max: 10 } })
    expect(wrapper.find('.zc-input-number__increase').classes()).toContain('is-disabled')
  })

  it('disables decrease when at min', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 0, min: 0 } })
    expect(wrapper.find('.zc-input-number__decrease').classes()).toContain('is-disabled')
  })

  it('exposes focus and blur methods', () => {
    const wrapper = mount(InputNumber)
    const vm = wrapper.vm as InstanceType<typeof InputNumber>
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.blur).toBe('function')
  })

  // ---- Bug #11: InputNumber step value should not double on keyboard ----
  it('ArrowUp increases value by exactly one step', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, step: 1 } })
    const input = wrapper.find('.zc-input-number__inner')
    await input.trigger('keydown', { key: 'ArrowUp' })
    const emits = wrapper.emitted('update:modelValue')
    expect(emits).toBeTruthy()
    expect(emits!.length).toBe(1)
    expect(emits![0]).toEqual([6])
  })

  it('ArrowDown decreases value by exactly one step', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, step: 1 } })
    const input = wrapper.find('.zc-input-number__inner')
    await input.trigger('keydown', { key: 'ArrowDown' })
    const emits = wrapper.emitted('update:modelValue')
    expect(emits).toBeTruthy()
    expect(emits!.length).toBe(1)
    expect(emits![0]).toEqual([4])
  })

  // ---- Additional coverage tests ----

  it('emits focus event', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.zc-input-number__inner').trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('emits blur event', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.zc-input-number__inner').trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('emits input event on user typing', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    await wrapper.find('.zc-input-number__inner').setValue('10')
    expect(wrapper.emitted('input')).toBeTruthy()
  })

  it('handles empty input change', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    const input = wrapper.find('.zc-input-number__inner')
    await input.setValue('')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([undefined])
    expect(wrapper.emitted('change')).toBeTruthy()
  })

  it('handles NaN input gracefully', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    const input = wrapper.find('.zc-input-number__inner')
    await input.setValue('abc')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })

  it('applies precision to display value', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 3.14159, precision: 2 } })
    expect((wrapper.find('.zc-input-number__inner').element as HTMLInputElement).value).toBe('3.14')
  })

  it('enforces stepStrictly mode', async () => {
    const wrapper = mount(InputNumber, {
      props: { modelValue: 5, step: 3, stepStrictly: true, min: 0 },
    })
    const input = wrapper.find('.zc-input-number__inner')
    await input.setValue('7')
    await input.trigger('change')
    const emitted = wrapper.emitted('update:modelValue')
    expect(emitted).toBeTruthy()
    // 7 rounded to nearest step from min: 0 + round(7/3)*3 = 6
    expect(emitted![0]).toEqual([6])
  })

  it('does not increase when disabled', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, disabled: true } })
    await wrapper.find('.zc-input-number__increase').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not decrease when readonly', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, readonly: true } })
    await wrapper.find('.zc-input-number__decrease').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('does not step when value equals next step value', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, min: 0, max: 5, step: 1 } })
    await wrapper.find('.zc-input-number__increase').trigger('click')
    // Already at max, shouldn't emit
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('exposes increase and decrease methods', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5 } })
    const vm = wrapper.vm as any
    expect(typeof vm.increase).toBe('function')
    expect(typeof vm.decrease).toBe('function')
  })

  it('clamps value to min when below via input', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, min: 3 } })
    const input = wrapper.find('.zc-input-number__inner')
    await input.setValue('-5')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([3])
  })

  it('clamps value to max when above via input', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, max: 7 } })
    const input = wrapper.find('.zc-input-number__inner')
    await input.setValue('100')
    await input.trigger('change')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([7])
  })

  it('handles undefined modelValue with increase', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: undefined, min: 0 } })
    await wrapper.find('.zc-input-number__increase').trigger('click')
    // Should use min as default, then add step: 0 + 1 = 1
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1])
  })

  it('does not respond to ArrowUp when disabled', async () => {
    const wrapper = mount(InputNumber, { props: { modelValue: 5, disabled: true } })
    await wrapper.find('.zc-input-number__inner').trigger('keydown', { key: 'ArrowUp' })
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('displays empty string for undefined modelValue', () => {
    const wrapper = mount(InputNumber, { props: { modelValue: undefined } })
    expect((wrapper.find('.zc-input-number__inner').element as HTMLInputElement).value).toBe('')
  })
})
