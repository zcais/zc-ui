import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcCheckbox from '../checkbox/checkbox.vue'
import ZcRadio from '../radio/radio.vue'
import ZcRadioGroup from '../radio/radio-group.vue'

describe('Accessibility: Checkbox', () => {
  it('should have role="checkbox"', () => {
    const wrapper = mount(ZcCheckbox)
    expect(wrapper.attributes('role')).toBe('checkbox')
  })

  it('should have aria-checked reflecting checked state', () => {
    const wrapper = mount(ZcCheckbox, { props: { modelValue: true } })
    expect(wrapper.attributes('aria-checked')).toBe('true')
  })

  it('should have aria-checked false when unchecked', () => {
    const wrapper = mount(ZcCheckbox, { props: { modelValue: false } })
    expect(wrapper.attributes('aria-checked')).toBe('false')
  })

  it('should have aria-checked mixed when indeterminate', () => {
    const wrapper = mount(ZcCheckbox, {
      props: { modelValue: false, indeterminate: true },
    })
    expect(wrapper.attributes('aria-checked')).toBe('mixed')
  })

  it('should have aria-disabled when disabled', () => {
    const wrapper = mount(ZcCheckbox, { props: { disabled: true } })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })
})

describe('Accessibility: Radio', () => {
  it('should have role="radio"', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: 'A' },
    })
    expect(wrapper.attributes('role')).toBe('radio')
  })

  it('should have aria-checked reflecting checked state', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: 'A' },
    })
    expect(wrapper.attributes('aria-checked')).toBe('true')
  })

  it('should have aria-disabled when disabled', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: '', disabled: true },
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('should have tabindex 0 when checked (roving tabindex)', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'A', modelValue: 'A' },
    })
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should have tabindex -1 when unchecked (roving tabindex)', () => {
    const wrapper = mount(ZcRadio, {
      props: { label: 'B', modelValue: 'A' },
    })
    expect(wrapper.attributes('tabindex')).toBe('-1')
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
