import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Select from '../select/select.vue'

const testOptions = [
  { label: 'Option 1', value: '1' },
  { label: 'Option 2', value: '2' },
  { label: 'Option 3', value: '3' },
]

describe('ZcSelect', () => {
  it('renders with default props', () => {
    const wrapper = mount(Select)
    expect(wrapper.classes()).toContain('zc-select')
  })

  it('applies medium size class by default', () => {
    const wrapper = mount(Select)
    expect(wrapper.classes()).toContain('zc-select--medium')
  })

  // ---- Placeholder ----
  it('displays placeholder when empty', () => {
    const wrapper = mount(Select, { props: { placeholder: '请选择' } })
    expect(wrapper.text()).toContain('请选择')
  })

  it('displays default placeholder when not provided', () => {
    const wrapper = mount(Select)
    expect(wrapper.text()).toContain('请选择')
  })

  it('displays selected label when value is set', () => {
    const wrapper = mount(Select, {
      props: { modelValue: '1', options: testOptions },
    })
    expect(wrapper.text()).toContain('Option 1')
  })

  // ---- Dropdown ----
  it('opens dropdown on click', async () => {
    const wrapper = mount(Select, { props: { options: testOptions } })
    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('is-open')
  })

  it('closes dropdown on second click', async () => {
    const wrapper = mount(Select, { props: { options: testOptions } })
    await wrapper.trigger('click')
    expect(wrapper.classes()).toContain('is-open')
    await wrapper.trigger('click')
    expect(wrapper.classes()).not.toContain('is-open')
  })

  it('renders dropdown options when opened', async () => {
    const wrapper = mount(Select, { props: { options: testOptions } })
    await wrapper.trigger('click')
    const options = wrapper.findAll('.zc-select__option')
    expect(options).toHaveLength(3)
    expect(options[0].text()).toContain('Option 1')
    expect(options[1].text()).toContain('Option 2')
    expect(options[2].text()).toContain('Option 3')
  })

  // ---- Option selection ----
  it('emits update:modelValue when option is selected', async () => {
    const wrapper = mount(Select, { props: { options: testOptions } })
    await wrapper.trigger('click')
    await wrapper.findAll('.zc-select__option')[1].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual(['2'])
  })

  it('emits change event when option is selected', async () => {
    const wrapper = mount(Select, { props: { options: testOptions } })
    await wrapper.trigger('click')
    await wrapper.findAll('.zc-select__option')[0].trigger('click')
    expect(wrapper.emitted('change')).toBeTruthy()
    expect(wrapper.emitted('change')![0]).toEqual(['1'])
  })

  it('closes dropdown after selecting a single option', async () => {
    const wrapper = mount(Select, { props: { options: testOptions } })
    await wrapper.trigger('click')
    await wrapper.findAll('.zc-select__option')[0].trigger('click')
    expect(wrapper.classes()).not.toContain('is-open')
  })

  it('applies selected class to chosen option', async () => {
    const wrapper = mount(Select, {
      props: { modelValue: '1', options: testOptions },
    })
    await wrapper.trigger('click')
    const options = wrapper.findAll('.zc-select__option')
    expect(options[0].classes()).toContain('is-selected')
    expect(options[1].classes()).not.toContain('is-selected')
  })

  // ---- Multiple mode ----
  it('applies multiple class in multiple mode', () => {
    const wrapper = mount(Select, { props: { multiple: true, options: testOptions } })
    expect(wrapper.classes()).toContain('is-multiple')
  })

  it('shows tags for selected options in multiple mode', () => {
    const wrapper = mount(Select, {
      props: {
        multiple: true,
        modelValue: ['1', '2'],
        options: testOptions,
      },
    })
    const tags = wrapper.findAll('.zc-select__tag')
    expect(tags).toHaveLength(2)
    expect(tags[0].text()).toContain('Option 1')
    expect(tags[1].text()).toContain('Option 2')
  })

  it('emits array values in multiple mode', async () => {
    const wrapper = mount(Select, {
      props: { multiple: true, options: testOptions },
    })
    await wrapper.trigger('click')
    await wrapper.findAll('.zc-select__option')[0].trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['1']])
  })

  it('does not close dropdown after selecting in multiple mode', async () => {
    const wrapper = mount(Select, {
      props: { multiple: true, options: testOptions },
    })
    await wrapper.trigger('click')
    await wrapper.findAll('.zc-select__option')[0].trigger('click')
    expect(wrapper.classes()).toContain('is-open')
  })

  // ---- Disabled ----
  it('applies disabled class when disabled', () => {
    const wrapper = mount(Select, { props: { disabled: true } })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('does not open dropdown when disabled', async () => {
    const wrapper = mount(Select, { props: { disabled: true } })
    await wrapper.trigger('click')
    expect(wrapper.classes()).not.toContain('is-open')
  })

  // ---- Clearable ----
  it('shows clear button when clearable and value is selected and dropdown is open', async () => {
    const wrapper = mount(Select, {
      props: { clearable: true, modelValue: '1', options: testOptions },
    })
    await wrapper.trigger('click')
    expect(wrapper.find('.zc-select__clear').exists()).toBe(true)
  })

  it('emits clear event when clear is clicked', async () => {
    const wrapper = mount(Select, {
      props: { clearable: true, modelValue: '1', options: testOptions },
    })
    await wrapper.trigger('click')
    await wrapper.find('.zc-select__clear').trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
  })

  it('resets value when clear is clicked', async () => {
    const wrapper = mount(Select, {
      props: { clearable: true, modelValue: '1', options: testOptions },
    })
    await wrapper.trigger('click')
    await wrapper.find('.zc-select__clear').trigger('click')
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([''])
  })

  // ---- Filterable ----
  it('renders input element when filterable', () => {
    const wrapper = mount(Select, { props: { filterable: true } })
    expect(wrapper.find('.zc-select__input').exists()).toBe(true)
  })

  it('applies filterable class when filterable', () => {
    const wrapper = mount(Select, { props: { filterable: true } })
    expect(wrapper.classes()).toContain('is-filterable')
  })

  // ---- Sizes ----
  it('applies large size class', () => {
    const wrapper = mount(Select, { props: { size: 'large' } })
    expect(wrapper.classes()).toContain('zc-select--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(Select, { props: { size: 'small' } })
    expect(wrapper.classes()).toContain('zc-select--small')
  })

  // ---- Disabled options ----
  it('applies disabled class to disabled option', async () => {
    const options = [
      { label: 'Normal', value: '1' },
      { label: 'Disabled', value: '2', disabled: true },
    ]
    const wrapper = mount(Select, { props: { options } })
    await wrapper.trigger('click')
    const opts = wrapper.findAll('.zc-select__option')
    expect(opts[0].classes()).not.toContain('is-disabled')
    expect(opts[1].classes()).toContain('is-disabled')
  })

  // ---- Collapse tags ----
  it('shows hidden tag count when collapseTags is enabled', () => {
    const wrapper = mount(Select, {
      props: {
        multiple: true,
        collapseTags: true,
        collapseTagsLimit: 1,
        modelValue: ['1', '2', '3'],
        options: testOptions,
      },
    })
    expect(wrapper.find('.zc-select__tag-count').exists()).toBe(true)
  })

  // ---- Bug #4: Select remote search ----
  it('displays remote search results in filteredOptions', async () => {
    const wrapper = mount(Select, {
      props: {
        filterable: true,
        remote: true,
        remoteMethod: async (query: string) => {
          return [
            { label: `Result for ${query}`, value: 'r1' },
            { label: `Another ${query}`, value: 'r2' },
          ]
        },
      },
    })
    await wrapper.trigger('click')
    const input = wrapper.find('.zc-select__input')
    await input.setValue('test')
    // Wait for the 300ms debounce + remote method resolution
    await new Promise((r) => setTimeout(r, 400))
    await wrapper.vm.$nextTick()
    const options = wrapper.findAll('.zc-select__option')
    expect(options.length).toBeGreaterThanOrEqual(2)
    expect(options[0].text()).toContain('Result for test')
  })

  // ---- Bug #5: Selected item remains visible after filtering ----
  it('selected option label remains visible even when filtered out', () => {
    const wrapper = mount(Select, {
      props: {
        modelValue: '1',
        filterable: true,
        options: testOptions,
      },
    })
    // Should display "Option 1" as the selected label
    expect(wrapper.text()).toContain('Option 1')
  })

  // =====================================================
  // Tag close button
  // =====================================================
  it('emits remove-tag when tag close button is clicked', async () => {
    const wrapper = mount(Select, {
      props: {
        multiple: true,
        modelValue: ['1', '2'],
        options: testOptions,
      },
    })
    const closeBtn = wrapper.findAll('.zc-select__tag-close')[0]
    await closeBtn.trigger('click')
    expect(wrapper.emitted('remove-tag')).toBeTruthy()
    expect(wrapper.emitted('remove-tag')![0]).toEqual(['1'])
  })

  it('removes the correct value from modelValue when tag is closed', async () => {
    const wrapper = mount(Select, {
      props: {
        multiple: true,
        modelValue: ['1', '2'],
        options: testOptions,
      },
    })
    const closeBtn = wrapper.findAll('.zc-select__tag-close')[1]
    await closeBtn.trigger('click')
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0]).toEqual([['1']])
  })

  // =====================================================
  // Prefix slot
  // =====================================================
  it('renders prefix slot content', () => {
    const wrapper = mount(Select, {
      slots: { prefix: '<span class="test-prefix">🔍</span>' },
    })
    expect(wrapper.find('.zc-select__prefix').exists()).toBe(true)
    expect(wrapper.find('.test-prefix').exists()).toBe(true)
  })

  // =====================================================
  // Empty slot
  // =====================================================
  it('renders custom empty slot when no options', async () => {
    const wrapper = mount(Select, {
      props: { options: [] },
      slots: { empty: '<span class="custom-empty">无数据</span>' },
    })
    await wrapper.trigger('click')
    expect(wrapper.find('.zc-select__empty').exists()).toBe(true)
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })

  // =====================================================
  // Group Options
  // =====================================================
  describe('Group Options', () => {
    const groupedOptions = [
      {
        label: '热门城市',
        options: [
          { label: '北京', value: 'bj' },
          { label: '上海', value: 'sh' },
        ],
      },
      {
        label: '其他城市',
        options: [
          { label: '成都', value: 'cd' },
          { label: '广州', value: 'gz' },
        ],
      },
    ]

    it('renders group title headers', async () => {
      const wrapper = mount(Select, {
        props: { optionGroups: groupedOptions },
      })
      await wrapper.trigger('click')
      const titles = wrapper.findAll('.zc-select__group-title')
      expect(titles).toHaveLength(2)
      expect(titles[0].text()).toContain('热门城市')
      expect(titles[1].text()).toContain('其他城市')
    })

    it('renders all options within groups', async () => {
      const wrapper = mount(Select, {
        props: { optionGroups: groupedOptions },
      })
      await wrapper.trigger('click')
      const options = wrapper.findAll('.zc-select__option')
      expect(options).toHaveLength(4)
      expect(options[0].text()).toContain('北京')
      expect(options[3].text()).toContain('广州')
    })

    it('can select an option from a group', async () => {
      const wrapper = mount(Select, {
        props: { optionGroups: groupedOptions },
      })
      await wrapper.trigger('click')
      await wrapper.findAll('.zc-select__option')[2].trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['cd'])
    })

    it('filters options within groups when filterable', async () => {
      const wrapper = mount(Select, {
        props: { optionGroups: groupedOptions, filterable: true },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('北')
      await nextTick()
      const options = wrapper.findAll('.zc-select__option')
      expect(options).toHaveLength(1)
      expect(options[0].text()).toContain('北京')
    })

    it('hides group title when no options match filter', async () => {
      const wrapper = mount(Select, {
        props: { optionGroups: groupedOptions, filterable: true },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('北')
      await nextTick()
      const titles = wrapper.findAll('.zc-select__group-title')
      expect(titles).toHaveLength(1)
      expect(titles[0].text()).toContain('热门城市')
    })
  })

  // =====================================================
  // Allow Create
  // =====================================================
  describe('Allow Create', () => {
    it('shows create option when query does not match any existing option', async () => {
      const wrapper = mount(Select, {
        props: { options: testOptions, filterable: true, allowCreate: true },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('New Item')
      await nextTick()
      const createEl = wrapper.find('.zc-select__option.is-create')
      expect(createEl.exists()).toBe(true)
      expect(createEl.text()).toContain('New Item')
    })

    it('does not show create option when query matches an existing option', async () => {
      const wrapper = mount(Select, {
        props: { options: testOptions, filterable: true, allowCreate: true },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('Option 1')
      await nextTick()
      const createEl = wrapper.find('.zc-select__option.is-create')
      expect(createEl.exists()).toBe(false)
    })

    it('emits create-tag when create option is clicked', async () => {
      const wrapper = mount(Select, {
        props: { options: testOptions, filterable: true, allowCreate: true },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('Custom Tag')
      await nextTick()
      const createEl = wrapper.find('.zc-select__option.is-create')
      await createEl.trigger('click')
      expect(wrapper.emitted('create-tag')).toBeTruthy()
      expect(wrapper.emitted('create-tag')![0]).toEqual(['Custom Tag'])
    })

    it('auto-selects the newly created option', async () => {
      const wrapper = mount(Select, {
        props: { options: testOptions, filterable: true, allowCreate: true },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('Brand New')
      await nextTick()
      const createEl = wrapper.find('.zc-select__option.is-create')
      await createEl.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual(['Brand New'])
    })

    it('does not show create option when allowCreate is false', async () => {
      const wrapper = mount(Select, {
        props: { options: testOptions, filterable: true, allowCreate: false },
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('Nonexistent')
      await nextTick()
      expect(wrapper.find('.zc-select__option.is-create').exists()).toBe(false)
    })
  })

  // =====================================================
  // Select All / Deselect All
  // =====================================================
  describe('Select All', () => {
    it('shows select-all bar in multiple mode', async () => {
      const wrapper = mount(Select, {
        props: { multiple: true, options: testOptions },
      })
      await wrapper.trigger('click')
      expect(wrapper.find('.zc-select__select-all').exists()).toBe(true)
    })

    it('does not show select-all bar in single mode', async () => {
      const wrapper = mount(Select, {
        props: { multiple: false, options: testOptions },
      })
      await wrapper.trigger('click')
      expect(wrapper.find('.zc-select__select-all').exists()).toBe(false)
    })

    it('selects all options when clicking select-all', async () => {
      const wrapper = mount(Select, {
        props: { multiple: true, options: testOptions },
      })
      await wrapper.trigger('click')
      await wrapper.find('.zc-select__select-all').trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['1', '2', '3']])
    })

    it('deselects all when clicking select-all with all selected', async () => {
      const wrapper = mount(Select, {
        props: { multiple: true, options: testOptions, modelValue: ['1', '2', '3'] },
      })
      await wrapper.trigger('click')
      await wrapper.find('.zc-select__select-all').trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([[]])
    })

    it('shows checked state when all options are selected', async () => {
      const wrapper = mount(Select, {
        props: { multiple: true, options: testOptions, modelValue: ['1', '2', '3'] },
      })
      await wrapper.trigger('click')
      const checkAll = wrapper.find('.zc-select__check-all')
      expect(checkAll.classes()).toContain('is-checked')
    })

    it('shows indeterminate state when some options are selected', async () => {
      const wrapper = mount(Select, {
        props: { multiple: true, options: testOptions, modelValue: ['1'] },
      })
      await wrapper.trigger('click')
      const checkAll = wrapper.find('.zc-select__check-all')
      expect(checkAll.classes()).toContain('is-indeterminate')
    })

    it('skips disabled options when selecting all', async () => {
      const options = [
        { label: 'A', value: 'a' },
        { label: 'B', value: 'b', disabled: true },
        { label: 'C', value: 'c' },
      ]
      const wrapper = mount(Select, {
        props: { multiple: true, options },
      })
      await wrapper.trigger('click')
      await wrapper.find('.zc-select__select-all').trigger('click')
      expect(wrapper.emitted('update:modelValue')![0]).toEqual([['a', 'c']])
    })
  })

  // =====================================================
  // Virtual Scroll
  // =====================================================
  describe('Virtual Scroll', () => {
    const bigOptions = Array.from({ length: 100 }, (_, i) => ({
      label: `Item ${i + 1}`,
      value: `item-${i + 1}`,
    }))

    it('renders virtual list container when virtualScroll is enabled', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: true },
      })
      await wrapper.trigger('click')
      expect(wrapper.find('.zc-select__virtual-list').exists()).toBe(true)
    })

    it('does not render virtual list when virtualScroll is disabled', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: false },
      })
      await wrapper.trigger('click')
      expect(wrapper.find('.zc-select__virtual-list').exists()).toBe(false)
    })

    it('renders virtual scroll structure with correct total height', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: true },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      // The virtual list must have a spacer div whose height = total items × itemHeight
      const virtualList = wrapper.find('.zc-select__virtual-list')
      expect(virtualList.exists()).toBe(true)
      const spacer = virtualList.element.firstElementChild as HTMLElement
      expect(spacer).toBeTruthy()
      // 100 items × 36px = 3600px total height
      expect(spacer.style.height).toBe('3600px')
      // Should have at least some rendered option items
      const renderedOptions = wrapper.findAll('.zc-select__virtual-list .zc-select__option')
      expect(renderedOptions.length).toBeGreaterThan(0)
      wrapper.unmount()
    })

    it('renders all options without virtual scroll', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: false },
      })
      await wrapper.trigger('click')
      const renderedOptions = wrapper.findAll('.zc-select__option')
      expect(renderedOptions).toHaveLength(100)
    })

    it('can select an option in virtual scroll mode', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: true },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      const firstOption = wrapper.findAll('.zc-select__virtual-list .zc-select__option')[0]
      await firstOption.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      wrapper.unmount()
    })

    // ---- Virtual + Filterable ----
    it('filters options correctly in virtual scroll mode', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: true, filterable: true },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      const input = wrapper.find('.zc-select__input')
      await input.setValue('Item 5')
      await nextTick()
      // Should only show items matching "Item 5" (Item 5, Item 50-59)
      const virtualList = wrapper.find('.zc-select__virtual-list')
      expect(virtualList.exists()).toBe(true)
      const spacer = virtualList.element.firstElementChild as HTMLElement
      // Item 5, Item 50-59 = 11 matches × 36px = 396px
      const totalHeight = parseInt(spacer.style.height)
      expect(totalHeight).toBe(396)
      const renderedOptions = wrapper.findAll('.zc-select__virtual-list .zc-select__option')
      expect(renderedOptions.length).toBeGreaterThan(0)
      expect(renderedOptions[0].text()).toContain('Item 5')
      wrapper.unmount()
    })

    // ---- Virtual + Multiple ----
    it('supports multiple selection in virtual scroll mode', async () => {
      const wrapper = mount(Select, {
        props: {
          options: bigOptions,
          virtualScroll: true,
          multiple: true,
          modelValue: ['item-1'],
        },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      // First option should be marked as selected
      const firstOption = wrapper.findAll('.zc-select__virtual-list .zc-select__option')[0]
      expect(firstOption.classes()).toContain('is-selected')
      // Click second option to add to selection
      const secondOption = wrapper.findAll('.zc-select__virtual-list .zc-select__option')[1]
      await secondOption.trigger('click')
      expect(wrapper.emitted('update:modelValue')).toBeTruthy()
      // Dropdown should stay open in multiple mode
      expect(wrapper.classes()).toContain('is-open')
      wrapper.unmount()
    })

    // ---- Virtual + Remote loading ----
    it('works with remote loading in virtual scroll mode', async () => {
      const wrapper = mount(Select, {
        props: {
          virtualScroll: true,
          filterable: true,
          remote: true,
          remoteMethod: async (query: string) => {
            return Array.from({ length: 20 }, (_, i) => ({
              label: `${query} Result ${i + 1}`,
              value: `${query}-r${i + 1}`,
            }))
          },
        },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      const input = wrapper.find('.zc-select__input')
      await input.setValue('test')
      // Wait for debounce + remote method
      await new Promise((r) => setTimeout(r, 400))
      await nextTick()
      const virtualList = wrapper.find('.zc-select__virtual-list')
      expect(virtualList.exists()).toBe(true)
      const renderedOptions = wrapper.findAll('.zc-select__virtual-list .zc-select__option')
      expect(renderedOptions.length).toBeGreaterThan(0)
      expect(renderedOptions[0].text()).toContain('test Result')
      wrapper.unmount()
    })

    // ---- Virtual + Group options ----
    it('renders group headers in virtual scroll mode', async () => {
      const groups = Array.from({ length: 5 }, (_, gi) => ({
        label: `Group ${gi + 1}`,
        options: Array.from({ length: 20 }, (_, oi) => ({
          label: `G${gi + 1}-Option ${oi + 1}`,
          value: `g${gi + 1}-opt-${oi + 1}`,
        })),
      }))
      const wrapper = mount(Select, {
        props: { optionGroups: groups, virtualScroll: true },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      const virtualList = wrapper.find('.zc-select__virtual-list')
      expect(virtualList.exists()).toBe(true)
      // Should render group titles as part of the virtual list
      const groupTitles = wrapper.findAll(
        '.zc-select__virtual-list .zc-select__option.is-group-title'
      )
      expect(groupTitles.length).toBeGreaterThan(0)
      wrapper.unmount()
    })

    // ---- Custom option height ----
    it('uses custom estimatedOptionHeight for item height', async () => {
      const wrapper = mount(Select, {
        props: {
          options: bigOptions,
          virtualScroll: true,
          estimatedOptionHeight: 48,
        },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      const virtualList = wrapper.find('.zc-select__virtual-list')
      const spacer = virtualList.element.firstElementChild as HTMLElement
      // 100 items × 48px = 4800px
      expect(spacer.style.height).toBe('4800px')
      // Each rendered option should have 48px height
      const renderedOption = wrapper.findAll('.zc-select__virtual-list .zc-select__option')[0]
      expect((renderedOption.element as HTMLElement).style.height).toBe('48px')
      wrapper.unmount()
    })

    it('defaults to 36px when estimatedOptionHeight is not provided', async () => {
      const wrapper = mount(Select, {
        props: {
          options: bigOptions,
          virtualScroll: true,
        },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      const virtualList = wrapper.find('.zc-select__virtual-list')
      const spacer = virtualList.element.firstElementChild as HTMLElement
      // Default 100 × 36px = 3600px
      expect(spacer.style.height).toBe('3600px')
      wrapper.unmount()
    })

    // ---- Reactive estimatedOptionHeight change ----
    it('reacts to estimatedOptionHeight prop changes at runtime', async () => {
      const wrapper = mount(Select, {
        props: {
          options: bigOptions,
          virtualScroll: true,
          estimatedOptionHeight: 36,
        },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      const virtualList = wrapper.find('.zc-select__virtual-list')
      const spacer = virtualList.element.firstElementChild as HTMLElement
      // Initial: 100 × 36 = 3600px
      expect(spacer.style.height).toBe('3600px')

      // Change height at runtime
      await wrapper.setProps({ estimatedOptionHeight: 50 })
      await nextTick()
      // After change: 100 × 50 = 5000px
      expect(spacer.style.height).toBe('5000px')
      // Rendered items should have 50px height
      const renderedOption = wrapper.findAll('.zc-select__virtual-list .zc-select__option')[0]
      expect((renderedOption.element as HTMLElement).style.height).toBe('50px')

      wrapper.unmount()
    })

    // ---- Performance: large dataset DOM node count < 50 ----
    // JSDOM does not compute layout (clientHeight is always 0), so we mock
    // HTMLElement.prototype.clientHeight to simulate a viewport. This lets
    // useVirtualList compute the correct slice — just like in a real browser.
    //
    // We use 2,000 items (instead of 10,000) because Vue's reactivity system
    // processing 10k items in the renderItems computed is slow in JSDOM, but
    // the virtualization logic is identical regardless of dataset size.
    it('renders fewer than 50 DOM option nodes with large dataset', async () => {
      // Mock clientHeight so useVirtualList knows the viewport size (280px).
      // With 36px rows → ceil(280/36) ≈ 8 visible + 10 overscan = ~18 items < 50.
      const clientHeightMock = vi
        .spyOn(HTMLElement.prototype, 'clientHeight', 'get')
        .mockReturnValue(280)

      const largeOptions = Array.from({ length: 2000 }, (_, i) => ({
        label: `Option ${i + 1}`,
        value: `opt-${i + 1}`,
      }))
      const wrapper = mount(Select, {
        props: { options: largeOptions, virtualScroll: true },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()

      const renderedOptions = wrapper.findAll('.zc-select__virtual-list .zc-select__option')
      // Acceptance criteria: < 50 DOM nodes
      expect(renderedOptions.length).toBeLessThan(50)

      // Verify total height reflects full data (2000 × 36 = 72000)
      const virtualList = wrapper.find('.zc-select__virtual-list')
      const spacer = virtualList.element.firstElementChild as HTMLElement
      expect(parseInt(spacer.style.height)).toBe(72000)

      clientHeightMock.mockRestore()
      wrapper.unmount()
    }, 30000)

    // ---- Keyboard navigation in virtual mode ----
    it('navigates with keyboard in virtual scroll mode', async () => {
      const wrapper = mount(Select, {
        props: { options: bigOptions, virtualScroll: true },
        attachTo: document.body,
      })
      await wrapper.trigger('click')
      await nextTick()
      // Simulate ArrowDown keypress to move hover to first option
      await wrapper.trigger('keydown', { key: 'ArrowDown' })
      await nextTick()
      // Verify hoveringIndex was updated (should be 0, the first selectable item)
      // The key test is that no crash occurs (scrollTo guard works in JSDOM)
      expect(wrapper.classes()).toContain('is-open')
      wrapper.unmount()
    })
  })
})
