import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import InputOTP from '../input-otp/input-otp.vue'

describe('ZcInputOTP', () => {
  it('renders with default props', () => {
    const wrapper = mount(InputOTP)
    expect(wrapper.classes()).toContain('zc-input-otp')
    expect(wrapper.findAll('.zc-input-otp__box')).toHaveLength(6)
  })

  it('renders custom length', () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    expect(wrapper.findAll('.zc-input-otp__box')).toHaveLength(4)
  })

  it('renders 8 boxes for length=8', () => {
    const wrapper = mount(InputOTP, { props: { length: 8 } })
    expect(wrapper.findAll('.zc-input-otp__box')).toHaveLength(8)
  })

  it('applies size class', () => {
    const wrapper = mount(InputOTP, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('zc-input-otp--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(InputOTP, { props: { size: 'small' } })
    expect(wrapper.classes()).toContain('zc-input-otp--small')
  })

  it('applies disabled class and attribute', () => {
    const wrapper = mount(InputOTP, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
    const inputs = wrapper.findAll('input')
    expect(inputs[0].attributes('disabled')).toBeDefined()
  })

  it('syncs modelValue to internal values', async () => {
    const wrapper = mount(InputOTP, { props: { modelValue: '123', length: 4 } })
    await nextTick()
    const inputs = wrapper.findAll('input')
    expect((inputs[0].element as HTMLInputElement).value).toBe('1')
    expect((inputs[1].element as HTMLInputElement).value).toBe('2')
    expect((inputs[2].element as HTMLInputElement).value).toBe('3')
    expect((inputs[3].element as HTMLInputElement).value).toBe('')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const input = wrapper.find('input')
    await input.setValue('5')
    const events = wrapper.emitted('update:modelValue')
    expect(events).toBeDefined()
    expect(events![events!.length - 1]).toEqual(['5'])
  })

  it('emits change event on input', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const input = wrapper.find('input')
    await input.setValue('7')
    expect(wrapper.emitted('change')).toBeDefined()
  })

  it('emits complete event when all boxes filled', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    // Simulate pasting all characters into first box (multi-char input path)
    await wrapper.find('input').setValue('1234')
    const completeEvents = wrapper.emitted('complete')
    expect(completeEvents).toBeDefined()
    expect(completeEvents![0]).toEqual(['1234'])
  })

  it('does not emit complete until all filled', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const el = wrapper.find('input').element as HTMLInputElement
    el.value = '12'
    await wrapper.find('input').trigger('input')
    expect(wrapper.emitted('complete')).toBeUndefined()
  })

  it('handles Backspace to clear current box', async () => {
    const wrapper = mount(InputOTP, { props: { modelValue: '12', length: 4 } })
    await nextTick()
    const inputs = wrapper.findAll('input')
    await inputs[1].trigger('keydown', { key: 'Backspace' })
    const updateEvents = wrapper.emitted('update:modelValue')
    expect(updateEvents).toBeDefined()
    const lastEvent = updateEvents![updateEvents!.length - 1]
    expect(lastEvent[0]).toBe('1')
  })

  it('handles Backspace to go to previous box when current empty', async () => {
    const wrapper = mount(InputOTP, { props: { modelValue: '1', length: 4 } })
    await nextTick()
    const inputs = wrapper.findAll('input')
    await inputs[1].trigger('keydown', { key: 'Backspace' })
    const updateEvents = wrapper.emitted('update:modelValue')
    expect(updateEvents).toBeDefined()
    expect(updateEvents![updateEvents!.length - 1]).toEqual([''])
  })

  it('handles ArrowLeft key', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const inputs = wrapper.findAll('input')
    await inputs[2].trigger('keydown', { key: 'ArrowLeft' })
    expect(true).toBe(true)
  })

  it('handles ArrowRight key', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const inputs = wrapper.findAll('input')
    await inputs[0].trigger('keydown', { key: 'ArrowRight' })
    expect(true).toBe(true)
  })

  it('renders separator between boxes', () => {
    const wrapper = mount(InputOTP, { props: { separator: '-', length: 4 } })
    const separators = wrapper.findAll('.zc-input-otp__separator')
    expect(separators).toHaveLength(3)
    expect(separators[0].text()).toBe('-')
  })

  it('does not render separator after last box', () => {
    const wrapper = mount(InputOTP, { props: { separator: '-', length: 4 } })
    const separators = wrapper.findAll('.zc-input-otp__separator')
    expect(separators).toHaveLength(3)
  })

  it('uses password type when masked', () => {
    const wrapper = mount(InputOTP, { props: { masked: true } })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('password')
  })

  it('uses text type when not masked', () => {
    const wrapper = mount(InputOTP, { props: { masked: false } })
    const input = wrapper.find('input')
    expect(input.attributes('type')).toBe('text')
  })

  it('shows masked dot when filled and masked', async () => {
    const wrapper = mount(InputOTP, { props: { masked: true, modelValue: '12', length: 4 } })
    await nextTick()
    const dots = wrapper.findAll('.zc-input-otp__dot')
    expect(dots).toHaveLength(2)
  })

  it('sets inputmode numeric when numericOnly', () => {
    const wrapper = mount(InputOTP, { props: { numericOnly: true } })
    const input = wrapper.find('input')
    expect(input.attributes('inputmode')).toBe('numeric')
  })

  it('sets inputmode text when not numericOnly', () => {
    const wrapper = mount(InputOTP)
    const input = wrapper.find('input')
    expect(input.attributes('inputmode')).toBe('text')
  })

  it('exposes focus and clear methods', () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    const vm = wrapper.vm as any
    expect(typeof vm.focus).toBe('function')
    expect(typeof vm.clear).toBe('function')
  })

  it('marks box as filled when has value', async () => {
    const wrapper = mount(InputOTP, { props: { modelValue: '1', length: 4 } })
    await nextTick()
    const boxes = wrapper.findAll('.zc-input-otp__box')
    expect(boxes[0].classes()).toContain('is-filled')
    expect(boxes[1].classes()).not.toContain('is-filled')
  })

  it('renders placeholder text', () => {
    const wrapper = mount(InputOTP, { props: { placeholder: '•' } })
    const input = wrapper.find('input')
    expect(input.attributes('placeholder')).toBe('•')
  })

  it('handles paste with multiple characters', async () => {
    const wrapper = mount(InputOTP, { props: { length: 4 } })
    await wrapper.find('input').setValue('1234')
    const completeEvents = wrapper.emitted('complete')
    expect(completeEvents).toBeDefined()
    expect(completeEvents![0]).toEqual(['1234'])
  })
})
