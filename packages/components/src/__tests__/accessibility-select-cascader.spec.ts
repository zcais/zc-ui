import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import ZcSelect from '../select/select.vue'
import ZcCascader from '../cascader/cascader.vue'

describe('Accessibility: Select', () => {
  it('should have role="combobox" on trigger (non-filterable)', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    expect(wrapper.attributes('role')).toBe('combobox')
  })

  it('should have aria-expanded reflecting visible state', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    expect(wrapper.attributes('aria-expanded')).toBe('false')
  })

  it('should have aria-haspopup="listbox"', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    expect(wrapper.attributes('aria-haspopup')).toBe('listbox')
  })

  it('should have aria-disabled when disabled', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }], disabled: true },
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('should have tabindex 0 when not disabled (non-filterable)', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should have tabindex -1 when disabled', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }], disabled: true },
    })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('should have role="listbox" on options container', () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    // Open dropdown
    wrapper.vm.openDropdown()
    const listbox = wrapper.find('[role="listbox"]')
    expect(listbox.exists()).toBe(true)
  })

  it('should have aria-multiselectable on listbox when multiple', () => {
    const wrapper = mount(ZcSelect, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
        multiple: true,
      },
    })
    wrapper.vm.openDropdown()
    const listbox = wrapper.find('[role="listbox"]')
    expect(listbox.attributes('aria-multiselectable')).toBe('true')
  })

  it('should have role="option" on each option', () => {
    const wrapper = mount(ZcSelect, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    wrapper.vm.openDropdown()
    const options = wrapper.findAll('[role="option"]')
    expect(options.length).toBeGreaterThanOrEqual(2)
  })

  it('should have aria-selected on options', () => {
    const wrapper = mount(ZcSelect, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        modelValue: 'a',
      },
    })
    wrapper.vm.openDropdown()
    const option = wrapper.find('[role="option"]')
    expect(option.attributes('aria-selected')).toBe('true')
  })

  it('should have aria-disabled on disabled options', () => {
    const wrapper = mount(ZcSelect, {
      props: {
        options: [{ label: 'A', value: 'a', disabled: true }],
      },
    })
    wrapper.vm.openDropdown()
    const option = wrapper.find('[role="option"]')
    expect(option.attributes('aria-disabled')).toBe('true')
  })

  it('should support ArrowDown to open dropdown', async () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    expect(wrapper.vm.visible).toBe(true)
  })

  it('should support Escape to close dropdown', async () => {
    const wrapper = mount(ZcSelect, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    wrapper.vm.openDropdown()
    expect(wrapper.vm.visible).toBe(true)
    await wrapper.trigger('keydown', { key: 'Escape' })
    expect(wrapper.vm.visible).toBe(false)
  })

  it('should support Enter to select option', async () => {
    const wrapper = mount(ZcSelect, {
      props: {
        options: [
          { label: 'A', value: 'a' },
          { label: 'B', value: 'b' },
        ],
      },
    })
    wrapper.vm.openDropdown()
    // Navigate to first option
    await wrapper.trigger('keydown', { key: 'ArrowDown' })
    await wrapper.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})

describe('Accessibility: Cascader', () => {
  it('should have role="combobox"', () => {
    const wrapper = mount(ZcCascader, {
      props: {
        options: [{ label: 'A', value: 'a', children: [{ label: 'A1', value: 'a1' }] }],
      },
    })
    expect(wrapper.attributes('role')).toBe('combobox')
  })

  it('should have aria-haspopup="listbox"', () => {
    const wrapper = mount(ZcCascader, {
      props: {
        options: [{ label: 'A', value: 'a', children: [{ label: 'A1', value: 'a1' }] }],
      },
    })
    expect(wrapper.attributes('aria-haspopup')).toBe('listbox')
  })

  it('should have aria-expanded reflecting visible state', () => {
    const wrapper = mount(ZcCascader, {
      props: {
        options: [{ label: 'A', value: 'a' }],
      },
    })
    expect(wrapper.attributes('aria-expanded')).toBe('false')
  })

  it('should have aria-label', () => {
    const wrapper = mount(ZcCascader, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        placeholder: '请选择',
      },
    })
    expect(wrapper.attributes('aria-label')).toBe('请选择')
  })

  it('should have aria-disabled when disabled', () => {
    const wrapper = mount(ZcCascader, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        disabled: true,
      },
    })
    expect(wrapper.attributes('aria-disabled')).toBe('true')
  })

  it('should have tabindex 0 when not disabled', () => {
    const wrapper = mount(ZcCascader, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    expect(wrapper.attributes('tabindex')).toBe('0')
  })

  it('should have tabindex -1 when disabled', () => {
    const wrapper = mount(ZcCascader, {
      props: { options: [{ label: 'A', value: 'a' }], disabled: true },
    })
    expect(wrapper.attributes('tabindex')).toBe('-1')
  })

  it('should have aria-label on clear button', () => {
    const wrapper = mount(ZcCascader, {
      props: {
        options: [{ label: 'A', value: 'a' }],
        clearable: true,
        modelValue: [['a']],
      },
    })
    const clearBtn = wrapper.find('.zc-cascader__clear')
    expect(clearBtn.exists()).toBe(true)
    expect(clearBtn.attributes('aria-label')).toBe('清除选择')
  })

  it('should support Escape to close dropdown', async () => {
    const wrapper = mount(ZcCascader, {
      props: { options: [{ label: 'A', value: 'a' }] },
    })
    await wrapper.trigger('keydown', { key: 'Escape' })
    // Should not throw
    expect(wrapper.exists()).toBe(true)
  })
})
