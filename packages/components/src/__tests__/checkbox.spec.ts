import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcCheckbox from '../checkbox/checkbox.vue'
import ZcCheckboxGroup from '../checkbox/checkbox-group.vue'

describe('ZcCheckbox', () => {
  it('renders with default props', () => {
    const wrapper = mount(ZcCheckbox)
    expect(wrapper.find('.zc-checkbox').exists()).toBe(true)
  })

  it('renders label text via prop', () => {
    const wrapper = mount(ZcCheckbox, { props: { label: 'Option A' } })
    expect(wrapper.text()).toContain('Option A')
  })

  it('renders label text via slot', () => {
    const wrapper = mount(ZcCheckbox, {
      slots: { default: 'Custom Label' },
    })
    expect(wrapper.text()).toContain('Custom Label')
  })

  it('click toggles modelValue and emits update:modelValue', () => {
    const wrapper = mount(ZcCheckbox, { props: { label: 'A' } })
    // Click the label span (only rendered when label prop is set)
    wrapper.find('.zc-checkbox__label').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([true])
  })

  it('click toggles from true to false', () => {
    const wrapper = mount(ZcCheckbox, {
      props: { label: 'A', modelValue: true },
    })
    wrapper.find('.zc-checkbox__label').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([false])
  })

  it('emits change event on toggle', () => {
    const wrapper = mount(ZcCheckbox, { props: { label: 'A' } })
    wrapper.find('.zc-checkbox__label').trigger('click')
    expect(wrapper.emitted('change')![0]).toEqual([true])
  })

  it('checked state adds is-checked class', () => {
    const wrapper = mount(ZcCheckbox, { props: { modelValue: true } })
    expect(wrapper.find('.is-checked').exists()).toBe(true)
  })

  it('unchecked state does not have is-checked class', () => {
    const wrapper = mount(ZcCheckbox, { props: { modelValue: false } })
    expect(wrapper.find('.is-checked').exists()).toBe(false)
  })

  it('indeterminate adds is-indeterminate class', () => {
    const wrapper = mount(ZcCheckbox, {
      props: { indeterminate: true, modelValue: false },
    })
    expect(wrapper.find('.is-indeterminate').exists()).toBe(true)
  })

  it('disabled prevents toggle on click', () => {
    const wrapper = mount(ZcCheckbox, {
      props: { label: 'A', disabled: true },
    })
    wrapper.find('.zc-checkbox__label').trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
  })

  it('disabled adds is-disabled class', () => {
    const wrapper = mount(ZcCheckbox, { props: { disabled: true } })
    expect(wrapper.find('.is-disabled').exists()).toBe(true)
  })

  it('renders hidden native checkbox input', () => {
    const wrapper = mount(ZcCheckbox)
    expect(wrapper.find('input[type="checkbox"]').exists()).toBe(true)
  })

  it('native checkbox reflects checked state', () => {
    const wrapper = mount(ZcCheckbox, { props: { modelValue: true } })
    const input = wrapper.find('input[type="checkbox"]')
    expect((input.element as HTMLInputElement).checked).toBe(true)
  })

  it('renders checkmark icon when checked', () => {
    const wrapper = mount(ZcCheckbox, { props: { modelValue: true } })
    expect(wrapper.find('.zc-checkbox__icon').exists()).toBe(true)
  })

  it('renders indeterminate dash icon', () => {
    const wrapper = mount(ZcCheckbox, {
      props: { indeterminate: true, modelValue: false },
    })
    expect(wrapper.find('.zc-checkbox__icon').exists()).toBe(true)
  })
})

describe('ZcCheckboxGroup', () => {
  it('renders children', () => {
    const wrapper = mount(ZcCheckboxGroup, {
      slots: { default: '<div class="child">item</div>' },
    })
    expect(wrapper.find('.child').exists()).toBe(true)
    expect(wrapper.text()).toContain('item')
  })

  it('has zc-checkbox-group class and role="group"', () => {
    const wrapper = mount(ZcCheckboxGroup)
    expect(wrapper.find('.zc-checkbox-group').exists()).toBe(true)
    expect(wrapper.attributes('role')).toBe('group')
  })

  it('group mode: clicking a checkbox toggles its label in the group array', () => {
    const wrapper = mount({
      components: { ZcCheckboxGroup, ZcCheckbox },
      template: `
        <ZcCheckboxGroup @update:model-value="groupValue = $event">
          <ZcCheckbox label="A" />
          <ZcCheckbox label="B" />
        </ZcCheckboxGroup>
      `,
      data: () => ({ groupValue: [] }),
    })
    const checkbox = wrapper.findComponent(ZcCheckbox)
    checkbox.find('.zc-checkbox__label').trigger('click')
    expect((wrapper.vm as any).groupValue).toEqual(['A'])
  })

  it('group mode: clicking multiple checkboxes adds each label', () => {
    const wrapper = mount({
      components: { ZcCheckboxGroup, ZcCheckbox },
      template: `
        <ZcCheckboxGroup @update:model-value="groupValue = $event">
          <ZcCheckbox label="A" />
          <ZcCheckbox label="B" />
        </ZcCheckboxGroup>
      `,
      data: () => ({ groupValue: [] }),
    })
    const checkboxes = wrapper.findAllComponents(ZcCheckbox)
    checkboxes[0].find('.zc-checkbox__label').trigger('click')
    checkboxes[1].find('.zc-checkbox__label').trigger('click')
    expect((wrapper.vm as any).groupValue).toEqual(['A', 'B'])
  })

  it('group mode: clicking an already checked checkbox removes it', () => {
    const wrapper = mount({
      components: { ZcCheckboxGroup, ZcCheckbox },
      template: `
        <ZcCheckboxGroup :model-value="['A', 'B']" @update:model-value="groupValue = $event">
          <ZcCheckbox label="A" />
          <ZcCheckbox label="B" />
        </ZcCheckboxGroup>
      `,
      data: () => ({ groupValue: ['A', 'B'] }),
    })
    const checkboxes = wrapper.findAllComponents(ZcCheckbox)
    checkboxes[0].find('.zc-checkbox__label').trigger('click')
    expect((wrapper.vm as any).groupValue).toEqual(['B'])
  })

  it('group mode: disabled checkbox does not toggle', () => {
    const wrapper = mount({
      components: { ZcCheckboxGroup, ZcCheckbox },
      template: `
        <ZcCheckboxGroup :model-value="['A']" @update:model-value="groupValue = $event">
          <ZcCheckbox label="A" :disabled="true" />
        </ZcCheckboxGroup>
      `,
      data: () => ({ groupValue: ['A'] }),
    })
    const checkbox = wrapper.findComponent(ZcCheckbox)
    checkbox.find('.zc-checkbox__label').trigger('click')
    expect((wrapper.vm as any).groupValue).toEqual(['A'])
  })

  it('group mode with group disabled prevents all toggles', () => {
    const wrapper = mount({
      components: { ZcCheckboxGroup, ZcCheckbox },
      template: `
        <ZcCheckboxGroup :model-value="[]" disabled @update:model-value="groupValue = $event">
          <ZcCheckbox label="A" />
        </ZcCheckboxGroup>
      `,
      data: () => ({ groupValue: [] }),
    })
    const checkbox = wrapper.findComponent(ZcCheckbox)
    expect(checkbox.find('.is-disabled').exists()).toBe(true)
    checkbox.find('.zc-checkbox__label').trigger('click')
    expect((wrapper.vm as any).groupValue).toEqual([])
  })

  it('group mode adds is-disabled class to group when disabled', () => {
    const wrapper = mount(ZcCheckboxGroup, { props: { disabled: true } })
    expect(wrapper.find('.is-disabled').exists()).toBe(true)
  })

  // ---- Bug #14: CheckboxGroup reactive sync when modelValue prop changes ----
  it('syncs internal ref when modelValue prop changes externally', async () => {
    const wrapper = mount({
      components: { ZcCheckboxGroup, ZcCheckbox },
      template: `
        <ZcCheckboxGroup :model-value="value">
          <ZcCheckbox label="A" />
          <ZcCheckbox label="B" />
        </ZcCheckboxGroup>
      `,
      data: () => ({ value: ['A'] as Array<string | number | boolean> }),
    }) as any
    // Initially A is checked
    let checkboxes = wrapper.findAllComponents(ZcCheckbox)
    expect(checkboxes[0].classes()).toContain('is-checked')
    expect(checkboxes[1].classes()).not.toContain('is-checked')

    // Change the value externally
    wrapper.vm.value = ['B']
    await wrapper.vm.$nextTick()

    checkboxes = wrapper.findAllComponents(ZcCheckbox)
    expect(checkboxes[0].classes()).not.toContain('is-checked')
    expect(checkboxes[1].classes()).toContain('is-checked')
  })
})
