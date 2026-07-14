import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import Mention from '../mention/mention.vue'
import type { MentionOption, MentionOptionGroup } from '../mention/types'

const mockOptions: MentionOption[] = [
  { value: 'alice', label: 'Alice Johnson' },
  { value: 'bob', label: 'Bob Smith' },
  { value: 'charlie', label: 'Charlie Brown' },
]

// ============================================================
// 1. Basic rendering & props (backward compatibility)
// ============================================================

describe('ZcMention — basic rendering', () => {
  it('renders with default props', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('.zc-mention').exists()).toBe(true)
    expect(wrapper.find('.zc-mention__textarea').exists()).toBe(true)
  })

  it('applies disabled class', () => {
    const wrapper = mount(Mention, { props: { disabled: true } })
    expect(wrapper.find('.zc-mention').classes()).toContain('is-disabled')
    expect(wrapper.find('.zc-mention__textarea').attributes('disabled')).toBeDefined()
  })

  it('applies placeholder', () => {
    const wrapper = mount(Mention, {
      props: { placeholder: 'Type here...' },
    })
    expect(wrapper.find('.zc-mention__textarea').attributes('placeholder')).toBe(
      'Type here...',
    )
  })

  it('applies default placeholder', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('.zc-mention__textarea').attributes('placeholder')).toBe(
      '请输入内容',
    )
  })

  it('applies focused class on focus', async () => {
    const wrapper = mount(Mention)
    await wrapper.find('.zc-mention__textarea').trigger('focus')
    expect(wrapper.find('.zc-mention').classes()).toContain('is-focused')
  })

  it('emits focus event', async () => {
    const wrapper = mount(Mention)
    await wrapper.find('.zc-mention__textarea').trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('emits blur event', async () => {
    const wrapper = mount(Mention)
    await wrapper.find('.zc-mention__textarea').trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('v-model binding', () => {
    const wrapper = mount(Mention, {
      props: { modelValue: 'Hello @alice' },
    })
    expect(
      (wrapper.find('.zc-mention__textarea').element as HTMLTextAreaElement).value,
    ).toBe('Hello @alice')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(Mention, { props: { modelValue: '' } })
    await wrapper.find('.zc-mention__textarea').setValue('Hello')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['Hello'])
  })

  it('does not show suggestions initially', () => {
    const wrapper = mount(Mention, { props: { options: mockOptions } })
    expect(wrapper.find('.zc-mention__suggestions').isVisible()).toBe(false)
  })
})

// ============================================================
// 2. Multi-trigger support
// ============================================================

describe('ZcMention — multi-trigger support', () => {
  it('accepts string trigger (backward compat)', () => {
    const wrapper = mount(Mention, { props: { trigger: '#' } })
    expect(wrapper.find('.zc-mention__textarea').exists()).toBe(true)
  })

  it('accepts array trigger', () => {
    const wrapper = mount(Mention, {
      props: { trigger: ['@', '#'] },
    })
    expect(wrapper.find('.zc-mention__textarea').exists()).toBe(true)
  })

  it('emits search with correct trigger char for @', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', trigger: ['@', '#'], options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('hello @a')
    const searchEvents = wrapper.emitted('search')
    expect(searchEvents).toBeTruthy()
    const lastSearch = searchEvents![searchEvents!.length - 1]
    expect(lastSearch?.[1]).toBe('@')
  })

  it('emits search with correct trigger char for #', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', trigger: ['@', '#'], options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('hello #b')
    const searchEvents = wrapper.emitted('search')
    expect(searchEvents).toBeTruthy()
    const lastSearch = searchEvents![searchEvents!.length - 1]
    expect(lastSearch?.[1]).toBe('#')
  })
})

// ============================================================
// 3. Input mode (type: 'textarea' | 'input')
// ============================================================

describe('ZcMention — input mode', () => {
  it('renders textarea by default', () => {
    const wrapper = mount(Mention)
    expect(wrapper.find('.zc-mention__textarea').exists()).toBe(true)
    expect(wrapper.find('.zc-mention__input').exists()).toBe(false)
  })

  it('renders input element when type="input"', () => {
    const wrapper = mount(Mention, { props: { type: 'input' } })
    expect(wrapper.find('.zc-mention__input').exists()).toBe(true)
    expect(wrapper.find('.zc-mention__textarea').exists()).toBe(false)
    expect(wrapper.find('.zc-mention__input').element.tagName).toBe('INPUT')
  })

  it('input mode supports v-model', async () => {
    const wrapper = mount(Mention, {
      props: { type: 'input', modelValue: 'test' },
    })
    const input = wrapper.find('.zc-mention__input')
    expect((input.element as HTMLInputElement).value).toBe('test')

    await input.setValue('new value')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['new value'])
  })
})

// ============================================================
// 4. Custom option rendering (#option slot)
// ============================================================

describe('ZcMention — #option slot', () => {
  it('renders default option template when no slot provided', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    // Suggestions should be visible
    expect(wrapper.find('.zc-mention__suggestions').isVisible()).toBe(true)
    expect(wrapper.find('.zc-mention__item-value').text()).toBe('alice')
  })

  it('renders custom option slot content', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
      slots: {
        option: '<span class="custom-option">{{ params.option.value }}</span>',
      },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    expect(wrapper.find('.custom-option').exists()).toBe(true)
  })
})

// ============================================================
// 5. Custom filter function
// ============================================================

describe('ZcMention — custom filter', () => {
  it('uses built-in includes filter by default', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@ali')
    const items = wrapper.findAll('.zc-mention__item')
    expect(items.length).toBe(1)
    expect(items[0].text()).toContain('alice')
  })

  it('uses custom filter function', async () => {
    const customFilter = (opt: MentionOption, keyword: string) =>
      (opt.value ?? '').startsWith(keyword)
    const wrapper = mount(Mention, {
      props: {
        modelValue: '',
        options: mockOptions,
        filter: customFilter,
      },
    })
    // 'b' should match 'bob' (starts with) but not 'alice'
    await wrapper.find('.zc-mention__textarea').setValue('@b')
    const items = wrapper.findAll('.zc-mention__item')
    expect(items.length).toBe(1)
    expect(items[0].text()).toContain('bob')
  })

  it('custom filter can override to match differently', async () => {
    const customFilter = (opt: MentionOption, keyword: string) =>
      (opt.label ?? '').toLowerCase().endsWith(keyword)
    const wrapper = mount(Mention, {
      props: {
        modelValue: '',
        options: mockOptions,
        filter: customFilter,
      },
    })
    // 'son' ends with in "Alice Johnson"
    await wrapper.find('.zc-mention__textarea').setValue('@son')
    const items = wrapper.findAll('.zc-mention__item')
    expect(items.length).toBe(1)
    expect(items[0].text()).toContain('alice')
  })
})

// ============================================================
// 6. Async loading state
// ============================================================

describe('ZcMention — async loading', () => {
  it('shows loading indicator when loading=true', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: [], loading: true },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@test')
    expect(wrapper.find('.zc-mention__loading').exists()).toBe(true)
  })

  it('shows custom loading text', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: [], loading: true, loadingText: 'Searching...' },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@test')
    expect(wrapper.find('.zc-mention__loading-text').text()).toBe('Searching...')
  })

  it('shows default loading text from locale', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: [], loading: true },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@test')
    expect(wrapper.find('.zc-mention__loading-text').text()).toBe('加载中…')
  })

  it('renders #loading slot', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: [], loading: true },
      slots: {
        loading: '<div class="custom-loading">Custom Spinner</div>',
      },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@test')
    expect(wrapper.find('.custom-loading').exists()).toBe(true)
  })
})

// ============================================================
// 7. Option grouping
// ============================================================

describe('ZcMention — option grouping', () => {
  const groupedOptions: MentionOption[] = [
    { value: 'alice', label: 'Alice', group: 'engineering' },
    { value: 'bob', label: 'Bob', group: 'engineering' },
    { value: 'charlie', label: 'Charlie', group: 'design' },
  ]
  const groups: MentionOptionGroup[] = [
    { value: 'engineering', label: 'Engineering' },
    { value: 'design', label: 'Design' },
  ]

  it('renders group headers when optionGroups provided', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '',
        options: groupedOptions,
        optionGroups: groups,
      },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    expect(wrapper.find('.zc-mention__group-title').exists()).toBe(true)
    const titles = wrapper.findAll('.zc-mention__group-title')
    expect(titles.length).toBe(2)
    expect(titles[0].text()).toBe('Engineering')
    expect(titles[1].text()).toBe('Design')
  })

  it('options appear under correct group', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '',
        options: groupedOptions,
        optionGroups: groups,
      },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const groups_dom = wrapper.findAll('.zc-mention__group')
    // Engineering group should have 2 options
    expect(groups_dom[0].findAll('.zc-mention__item').length).toBe(2)
    // Design group should have 1 option
    expect(groups_dom[1].findAll('.zc-mention__item').length).toBe(1)
  })

  it('filters options within groups', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '',
        options: groupedOptions,
        optionGroups: groups,
      },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@ali')
    const groups_dom = wrapper.findAll('.zc-mention__group')
    // Only engineering group should be visible with alice
    expect(groups_dom.length).toBe(1)
    expect(groups_dom[0].findAll('.zc-mention__item').length).toBe(1)
  })
})

// ============================================================
// 8. Empty state (#empty slot)
// ============================================================

describe('ZcMention — empty state', () => {
  it('shows default empty text when no results', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@zzznomatch')
    expect(wrapper.find('.zc-mention__empty').isVisible()).toBe(true)
    expect(wrapper.find('.zc-mention__empty-text').text()).toBe('暂无匹配结果')
  })

  it('renders #empty slot content', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
      slots: {
        empty: '<div class="custom-empty">No users found</div>',
      },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@zzznomatch')
    expect(wrapper.find('.custom-empty').exists()).toBe(true)
  })
})

// ============================================================
// 9. Blur behavior configuration
// ============================================================

describe('ZcMention — blur behavior', () => {
  it('clears search on blur by default (blurBehavior="clear")', async () => {
    vi.useFakeTimers()
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    await textarea.trigger('blur')
    // The clear behavior uses setTimeout(150) to allow click events to register
    vi.advanceTimersByTime(200)
    await nextTick()
    expect(wrapper.find('.zc-mention__suggestions').isVisible()).toBe(false)
    vi.useRealTimers()
  })

  it('keeps dropdown open when blurBehavior="keep-open"', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions, blurBehavior: 'keep-open' },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    await textarea.trigger('blur')
    // Should still be visible
    expect(wrapper.find('.zc-mention__suggestions').isVisible()).toBe(true)
  })

  it('selects first option when blurBehavior="select-first"', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions, blurBehavior: 'select-first' },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    await textarea.trigger('blur')
    await nextTick()
    const changeEvents = wrapper.emitted('change')
    expect(changeEvents).toBeTruthy()
    const lastChange = changeEvents![changeEvents!.length - 1]
    // Should contain the first option's label "Alice Johnson"
    expect(lastChange?.[0]).toContain('Alice')
  })
})

// ============================================================
// 10. maxHeight configuration
// ============================================================

describe('ZcMention — maxHeight', () => {
  it('applies default maxHeight of 240px', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const style = wrapper.find('.zc-mention__suggestions').attributes('style')
    expect(style).toContain('240px')
  })

  it('applies custom numeric maxHeight', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions, maxHeight: 300 },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const style = wrapper.find('.zc-mention__suggestions').attributes('style')
    expect(style).toContain('300px')
  })

  it('applies custom string maxHeight', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions, maxHeight: '50vh' },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const style = wrapper.find('.zc-mention__suggestions').attributes('style')
    expect(style).toContain('50vh')
  })
})

// ============================================================
// 11. ARIA accessibility
// ============================================================

describe('ZcMention — ARIA accessibility', () => {
  it('textarea has correct ARIA attributes', () => {
    const wrapper = mount(Mention)
    const textarea = wrapper.find('.zc-mention__textarea')
    expect(textarea.attributes('role')).toBe('combobox')
    expect(textarea.attributes('aria-haspopup')).toBe('listbox')
    expect(textarea.attributes('aria-autocomplete')).toBe('list')
    expect(textarea.attributes('aria-expanded')).toBe('false')
  })

  it('aria-expanded becomes true when dropdown is visible', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const textarea = wrapper.find('.zc-mention__textarea')
    expect(textarea.attributes('aria-expanded')).toBe('true')
  })

  it('dropdown has role="listbox"', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    expect(wrapper.find('.zc-mention__suggestions').attributes('role')).toBe(
      'listbox',
    )
  })

  it('option items have role="option"', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const items = wrapper.findAll('.zc-mention__item')
    items.forEach((item) => {
      expect(item.attributes('role')).toBe('option')
    })
  })

  it('option items have aria-selected attribute', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    await nextTick()
    const items = wrapper.findAll('.zc-mention__item')
    // First item should be selected (activeIndex=0)
    expect(items[0].attributes('aria-selected')).toBe('true')
  })

  it('input mode also has ARIA attributes', () => {
    const wrapper = mount(Mention, { props: { type: 'input' } })
    const input = wrapper.find('.zc-mention__input')
    expect(input.attributes('role')).toBe('combobox')
    expect(input.attributes('aria-autocomplete')).toBe('list')
  })
})

// ============================================================
// 12. Keyboard navigation
// ============================================================

describe('ZcMention — keyboard navigation', () => {
  it('ArrowDown moves active index', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    await nextTick()
    // After trigger, activeIndex starts at 0
    await textarea.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    const items = wrapper.findAll('.zc-mention__item')
    expect(items[1].classes()).toContain('is-active')
  })

  it('ArrowUp moves active index', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    // Move down first
    await textarea.trigger('keydown', { key: 'ArrowDown' })
    await nextTick()
    // Move back up
    await textarea.trigger('keydown', { key: 'ArrowUp' })
    await nextTick()
    const items = wrapper.findAll('.zc-mention__item')
    expect(items[0].classes()).toContain('is-active')
  })

  it('Escape closes dropdown', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    await nextTick()
    expect(wrapper.find('.zc-mention__suggestions').isVisible()).toBe(true)
    await textarea.trigger('keydown', { key: 'Escape' })
    await nextTick()
    // Check internal visible state (Vue transition may delay display:none in jsdom)
    expect((wrapper.vm as any).visible).toBe(false)
  })

  it('Enter selects active option', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    const textarea = wrapper.find('.zc-mention__textarea')
    await textarea.setValue('@')
    await nextTick()
    // Press Enter to select first option (Alice Johnson)
    await textarea.trigger('keydown', { key: 'Enter' })
    await nextTick()
    const changeEvents = wrapper.emitted('change')
    expect(changeEvents).toBeTruthy()
    const lastChange = changeEvents![changeEvents!.length - 1]
    expect(lastChange?.[0]).toContain('Alice')
    expect(wrapper.emitted('select')).toBeTruthy()
  })
})

// ============================================================
// 13. Select option functionality
// ============================================================

describe('ZcMention — select option', () => {
  it('emits select event with option data', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const items = wrapper.findAll('.zc-mention__item')
    await items[0].trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
    expect(wrapper.emitted('select')![0][0]).toMatchObject({ value: 'alice' })
  })

  it('inserts mention text into value on select', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const items = wrapper.findAll('.zc-mention__item')
    await items[1].trigger('click')
    const updateEvents = wrapper.emitted('update:modelValue')
    expect(updateEvents).toBeTruthy()
    const lastUpdate = updateEvents![updateEvents!.length - 1]
    expect(lastUpdate?.[0]).toContain('@Bob Smith')
  })

  it('does not select disabled option', async () => {
    const optionsWithDisabled: MentionOption[] = [
      { value: 'alice', label: 'Alice', disabled: true },
      { value: 'bob', label: 'Bob' },
    ]
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: optionsWithDisabled },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    const items = wrapper.findAll('.zc-mention__item')
    expect(items[0].classes()).toContain('is-disabled')
    await items[0].trigger('click')
    // Should not emit select for disabled option
    expect(wrapper.emitted('select')).toBeFalsy()
  })
})

// ============================================================
// 14. Avatar rendering
// ============================================================

describe('ZcMention — avatar', () => {
  it('renders avatar when option has avatar field', async () => {
    const optionsWithAvatar: MentionOption[] = [
      { value: 'alice', label: 'Alice', avatar: 'https://example.com/alice.jpg' },
    ]
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: optionsWithAvatar },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    expect(wrapper.find('.zc-mention__item-avatar').exists()).toBe(true)
    expect(wrapper.find('.zc-mention__item-avatar').attributes('src')).toBe(
      'https://example.com/alice.jpg',
    )
  })
})

// ============================================================
// 15. Placement
// ============================================================

describe('ZcMention — placement', () => {
  it('applies is-top class when placement="top"', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions, placement: 'top' },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    expect(wrapper.find('.zc-mention__suggestions').classes()).toContain('is-top')
  })

  it('does not have is-top class by default', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    expect(wrapper.find('.zc-mention__suggestions').classes()).not.toContain(
      'is-top',
    )
  })
})

// ============================================================
// 16. Split mode
// ============================================================

describe('ZcMention — split mode', () => {
  it('renders contenteditable div in split mode', () => {
    const wrapper = mount(Mention, {
      props: { split: true },
    })
    expect(wrapper.find('.zc-mention__editable').exists()).toBe(true)
    expect(wrapper.find('.zc-mention__editable').attributes('contenteditable')).toBe(
      'true',
    )
    expect(wrapper.find('.zc-mention__textarea').exists()).toBe(false)
  })

  it('has is-split class in split mode', () => {
    const wrapper = mount(Mention, {
      props: { split: true },
    })
    expect(wrapper.find('.zc-mention').classes()).toContain('is-split')
  })

  it('contenteditable has ARIA attributes', () => {
    const wrapper = mount(Mention, {
      props: { split: true },
    })
    const editable = wrapper.find('.zc-mention__editable')
    expect(editable.attributes('role')).toBe('combobox')
    expect(editable.attributes('aria-haspopup')).toBe('listbox')
    expect(editable.attributes('aria-autocomplete')).toBe('list')
  })

  it('renders initial value with mention tags', () => {
    const wrapper = mount(Mention, {
      props: { split: true, modelValue: 'Hello @alice', trigger: '@' },
    })
    expect(wrapper.find('.zc-mention__tag').exists()).toBe(true)
  })

  it('emits update:modelValue on editable input', async () => {
    const wrapper = mount(Mention, {
      props: { split: true, modelValue: '' },
    })
    const editable = wrapper.find('.zc-mention__editable')
    // Simulate user typing in contenteditable by setting innerText
    const el = editable.element as HTMLElement
    el.innerText = 'Hello @alice'
    await editable.trigger('input')
    await nextTick()
    // Should emit model value update
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
  })
})

// ============================================================
// 17. Teleport
// ============================================================

describe('ZcMention — Teleport', () => {
  it('renders dropdown inside container by default (no teleport)', async () => {
    const wrapper = mount(Mention, {
      props: { modelValue: '', options: mockOptions },
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    // Dropdown should be inside the .zc-mention container
    expect(wrapper.find('.zc-mention .zc-mention__suggestions').exists()).toBe(true)
  })

  it('teleports dropdown to body when teleport=true', async () => {
    const wrapper = mount(Mention, {
      props: {
        modelValue: '',
        options: mockOptions,
        teleport: true,
      },
      attachTo: document.body,
    })
    await wrapper.find('.zc-mention__textarea').setValue('@')
    await nextTick()
    // Suggestions should be teleported to body
    const bodySuggestions = document.body.querySelectorAll('.zc-mention__suggestions')
    expect(bodySuggestions.length).toBeGreaterThan(0)
    wrapper.unmount()
  })
})

// ============================================================
// 18. Define expose
// ============================================================

describe('ZcMention — exposed API', () => {
  it('exposes closeSuggestions method', () => {
    const wrapper = mount(Mention, { props: { options: mockOptions } })
    const vm = wrapper.vm as any
    expect(typeof vm.closeSuggestions).toBe('function')
  })

  it('exposes visible ref', () => {
    const wrapper = mount(Mention, { props: { options: mockOptions } })
    const vm = wrapper.vm as any
    expect(vm.visible).toBeDefined()
    expect(vm.visible).toBe(false)
  })

  it('exposes filteredOptions computed', () => {
    const wrapper = mount(Mention, { props: { options: mockOptions } })
    const vm = wrapper.vm as any
    expect(vm.filteredOptions).toBeDefined()
    expect(Array.isArray(vm.filteredOptions)).toBe(true)
  })
})
