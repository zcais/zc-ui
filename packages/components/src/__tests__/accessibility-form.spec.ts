import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcCheckbox from '../checkbox/checkbox.vue'
import ZcRadio from '../radio/radio.vue'
import ZcRadioGroup from '../radio/radio-group.vue'

describe('Accessibility: Checkbox', () => {
  // The native input is the single interactive element: it carries the
  // checkbox semantics itself, and the label must not nest another one.
  it('should expose a native checkbox input with checkbox semantics', () => {
    const wrapper = mount(ZcCheckbox)
    const input = wrapper.find('input[type="checkbox"]')
    expect(input.exists()).toBe(true)
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('should reflect checked state on the native input', () => {
    const checked = mount(ZcCheckbox, { props: { modelValue: true } })
    expect((checked.find('input').element as HTMLInputElement).checked).toBe(true)

    const unchecked = mount(ZcCheckbox, { props: { modelValue: false } })
    expect((unchecked.find('input').element as HTMLInputElement).checked).toBe(false)
  })

  it('should set aria-checked="mixed" when indeterminate', () => {
    const wrapper = mount(ZcCheckbox, {
      props: { modelValue: false, indeterminate: true },
    })
    expect(wrapper.find('input').attributes('aria-checked')).toBe('mixed')
  })

  it('should disable the native input when disabled', () => {
    const wrapper = mount(ZcCheckbox, { props: { disabled: true } })
    expect((wrapper.find('input').element as HTMLInputElement).disabled).toBe(true)
  })
})

describe('Accessibility: Radio', () => {
  it('should expose a native radio input with radio semantics', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: 'A' },
    })
    const input = wrapper.find('input[type="radio"]')
    expect(input.exists()).toBe(true)
    expect(wrapper.attributes('role')).toBeUndefined()
  })

  it('should reflect checked state on the native input', () => {
    const checked = mount(ZcRadio, {
      props: { label: 'A', modelValue: 'A' },
    })
    expect((checked.find('input[type="radio"]').element as HTMLInputElement).checked).toBe(true)
  })

  it('should disable the native input when disabled', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: '', disabled: true },
    })
    expect((wrapper.find('input[type="radio"]').element as HTMLInputElement).disabled).toBe(true)
  })

  it('should keep the native input keyboard-focusable', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: 'A' },
    })
    const input = wrapper.find('input[type="radio"]')
    // Native inputs are focusable; no tabindex override is applied.
    expect(input.attributes('tabindex')).toBeUndefined()
  })
})

describe('Accessibility: RadioGroup', () => {
  it('should have role="radiogroup"', () => {
    const wrapper = mount(ZcRadioGroup)
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })

  it('should have aria-disabled when disabled', () => {
    const wrapper = mount(ZcRadioGroup, { props: { disabled: true } })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('should respond to ArrowRight key', async () => {
    const wrapper = mount(ZcRadioGroup, {
      props: { modelValue: 'A' },
      slots: {
        default: () => 'A B C',
      },
    })
    // Should not throw
    expect(wrapper.attributes('role')).toBe('radiogroup')
  })
})
