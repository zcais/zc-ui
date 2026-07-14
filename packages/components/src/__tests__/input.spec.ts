import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcInput from '../input/input.vue'

describe('ZcInput', () => {
  it('renders with default props', () => {
    const wrapper = mount(ZcInput)
    // Check via HTML content or inner element
    expect(wrapper.find('.zc-input').exists()).toBe(true)
    expect(wrapper.find('.zc-input__inner').exists()).toBe(true)
  })

  it('renders an input element by default', () => {
    const wrapper = mount(ZcInput)
    expect(wrapper.find('input').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(false)
  })

  it('applies placeholder', () => {
    const wrapper = mount(ZcInput, { props: { placeholder: 'Enter name' } })
    expect(wrapper.find('input').attributes('placeholder')).toBe('Enter name')
  })

  it('v-model works via emitting update:modelValue on input', () => {
    const wrapper = mount(ZcInput, { props: { modelValue: '' } })
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).value = 'hello'
    input.trigger('input')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['hello'])
  })

  it('applies disabled class and disabled attribute', () => {
    const wrapper = mount(ZcInput, { props: { disabled: true } })
    expect(wrapper.find('.zc-input.is-disabled').exists()).toBe(true)
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies readonly attribute', () => {
    const wrapper = mount(ZcInput, { props: { readonly: true } })
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('applies large size class', () => {
    const wrapper = mount(ZcInput, { props: { size: 'large' } })
    expect(wrapper.find('.zc-input--large').exists()).toBe(true)
  })

  it('applies small size class', () => {
    const wrapper = mount(ZcInput, { props: { size: 'small' } })
    expect(wrapper.find('.zc-input--small').exists()).toBe(true)
  })

  it('renders textarea element when type is textarea', () => {
    const wrapper = mount(ZcInput, { props: { type: 'textarea' } })
    expect(wrapper.find('.is-textarea').exists()).toBe(true)
    expect(wrapper.find('textarea').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(false)
  })

  it('showPassword renders toggle button when value present', () => {
    const wrapper = mount(ZcInput, {
      props: { showPassword: true, modelValue: 'secret' },
    })
    expect(wrapper.find('.zc-input__password').exists()).toBe(true)
  })

  it('showPassword toggle does not appear when value is empty', () => {
    const wrapper = mount(ZcInput, {
      props: { showPassword: true, modelValue: '' },
    })
    expect(wrapper.find('.zc-input__password').exists()).toBe(false)
  })

  it('clearable shows clear button on hover', async () => {
    const wrapper = mount(ZcInput, {
      props: { clearable: true, modelValue: 'some value' },
    })
    // Hover the root element to set hovering=true
    await wrapper.find('.zc-input').trigger('mouseenter')
    // Vue needs to process the reactive update
    const clearBtn = wrapper.find('.zc-input__clear')
    expect(clearBtn.exists()).toBe(true)
  })

  it('clear button emits update:modelValue with empty string on click', async () => {
    const wrapper = mount(ZcInput, {
      props: { clearable: true, modelValue: 'clear me' },
    })
    await wrapper.find('.zc-input').trigger('mouseenter')
    const clearBtn = wrapper.find('.zc-input__clear')
    await clearBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('emits focus and blur events', () => {
    const wrapper = mount(ZcInput)
    const input = wrapper.find('input')
    input.trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('renders prepend slot', () => {
    const wrapper = mount(ZcInput, {
      slots: { prepend: '<span class="prepend-slot">$</span>' },
    })
    expect(wrapper.find('.zc-input__prepend').exists()).toBe(true)
    expect(wrapper.find('.prepend-slot').exists()).toBe(true)
    expect(wrapper.find('.prepend-slot').text()).toBe('$')
  })

  it('renders append slot', () => {
    const wrapper = mount(ZcInput, {
      slots: { append: '<span class="append-slot">.00</span>' },
    })
    expect(wrapper.find('.zc-input__append').exists()).toBe(true)
    expect(wrapper.find('.append-slot').exists()).toBe(true)
    expect(wrapper.find('.append-slot').text()).toBe('.00')
  })

  it('renders prefix slot', () => {
    const wrapper = mount(ZcInput, {
      slots: { prefix: '<span class="prefix-slot">🔍</span>' },
    })
    expect(wrapper.find('.zc-input__prefix').exists()).toBe(true)
    expect(wrapper.find('.prefix-slot').exists()).toBe(true)
  })

  it('renders suffix slot', () => {
    const wrapper = mount(ZcInput, {
      slots: { suffix: '<span class="suffix-slot">X</span>' },
    })
    expect(wrapper.find('.zc-input__suffix').exists()).toBe(true)
    expect(wrapper.find('.suffix-slot').exists()).toBe(true)
  })

  it('emits change event on change', () => {
    const wrapper = mount(ZcInput)
    const input = wrapper.find('input')
    ;(input.element as HTMLInputElement).value = 'changed'
    input.trigger('change')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['changed'])
  })
})
