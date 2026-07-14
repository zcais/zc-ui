import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import AutoComplete from '../auto-complete/auto-complete.vue'

describe('ZcAutoComplete', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })
  it('renders with default props', () => {
    const wrapper = mount(AutoComplete)
    expect(wrapper.find('.zc-auto-complete').exists()).toBe(true)
    expect(wrapper.find('.zc-auto-complete__inner').exists()).toBe(true)
  })

  it('applies placeholder', () => {
    const wrapper = mount(AutoComplete, { props: { placeholder: 'Search...' } })
    expect(wrapper.find('.zc-auto-complete__inner').attributes('placeholder')).toBe('Search...')
  })

  it('applies size class', () => {
    const wrapper = mount(AutoComplete, { props: { size: 'large' } })
    expect(wrapper.find('.zc-auto-complete').classes()).toContain('zc-auto-complete--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(AutoComplete, { props: { size: 'small' } })
    expect(wrapper.find('.zc-auto-complete').classes()).toContain('zc-auto-complete--small')
  })

  it('applies disabled class', () => {
    const wrapper = mount(AutoComplete, { props: { disabled: true } })
    expect(wrapper.find('.zc-auto-complete').classes()).toContain('is-disabled')
    expect(wrapper.find('.zc-auto-complete__inner').attributes('disabled')).toBeDefined()
  })

  it('v-model binding', () => {
    const wrapper = mount(AutoComplete, {
      props: { modelValue: 'hello' },
    })
    expect(wrapper.find('.zc-auto-complete__inner').attributes('value')).toBe('hello')
  })

  it('emits update:modelValue on input', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions: (q: string) => [{ value: q }],
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('test')
    expect(wrapper.emitted('update:modelValue')?.[0]).toEqual(['test'])
  })

  it('shows suggestions after input with fetchSuggestions', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions: () => [{ value: 'abc' }, { value: 'abd' }],
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('ab')
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await nextTick()
    // Suggestions should appear
    const items = wrapper.findAll('.zc-auto-complete__item')
    expect(items.length).toBe(2)
  })

  it('shows no data text when suggestions empty', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions: () => [],
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('xyz')
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await nextTick()
    expect(wrapper.find('.zc-auto-complete__empty').exists()).toBe(true)
    expect(wrapper.find('.zc-auto-complete__empty').text()).toBe('暂无数据')
  })

  it('customizes noDataText', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions: () => [],
        noDataText: 'No results',
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('xyz')
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await nextTick()
    expect(wrapper.find('.zc-auto-complete__empty').text()).toBe('No results')
  })

  it('emits select when clicking suggestion', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions: () => [{ value: 'option1' }],
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('o')
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await nextTick()

    const item = wrapper.find('.zc-auto-complete__item')
    await item.trigger('click')
    expect(wrapper.emitted('select')).toBeTruthy()
  })

  it('applies disabled class to disabled suggestion items', async () => {
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions: () => [{ value: 'opt', disabled: true }],
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('o')
    await nextTick()
    await vi.advanceTimersByTimeAsync(300)
    await nextTick()
    expect(wrapper.find('.zc-auto-complete__item').classes()).toContain('is-disabled')
  })

  it('emits focus event', async () => {
    const wrapper = mount(AutoComplete)
    await wrapper.find('.zc-auto-complete__inner').trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
  })

  it('emits blur event', async () => {
    const wrapper = mount(AutoComplete)
    await wrapper.find('.zc-auto-complete__inner').trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
  })

  it('applies focused class on focus', async () => {
    const wrapper = mount(AutoComplete)
    await wrapper.find('.zc-auto-complete__inner').trigger('focus')
    expect(wrapper.find('.zc-auto-complete').classes()).toContain('is-focused')
  })

  it('renders prefix slot', () => {
    const wrapper = mount(AutoComplete, {
      slots: { prefix: '<span class="custom-prefix">🔍</span>' },
    })
    expect(wrapper.find('.custom-prefix').exists()).toBe(true)
  })

  it('renders suffix slot', () => {
    const wrapper = mount(AutoComplete, {
      slots: { suffix: '<span class="custom-suffix">✓</span>' },
    })
    expect(wrapper.find('.custom-suffix').exists()).toBe(true)
  })

  // ---- Bug #3: AutoComplete debounce timer cleanup on unmount ----
  it('clears pending debounce timer on unmount', async () => {
    const fetchSuggestions = vi.fn(() => [{ value: 'test' }])
    const wrapper = mount(AutoComplete, {
      props: {
        modelValue: '',
        fetchSuggestions,
        debounce: 500,
      },
    })
    const input = wrapper.find('.zc-auto-complete__inner')
    await input.setValue('test')
    await nextTick()

    // Unmount before debounce timer fires
    wrapper.unmount()

    // Advance timer past debounce delay
    vi.advanceTimersByTime(600)

    // fetchSuggestions should NOT have been called since timer was cleared
    expect(fetchSuggestions).not.toHaveBeenCalled()
  })
})
