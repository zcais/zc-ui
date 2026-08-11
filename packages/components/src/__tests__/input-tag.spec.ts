import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import InputTag from '../input-tag/input-tag.vue'

describe('ZcInputTag', () => {
  it('renders with default props', () => {
    const wrapper = mount(InputTag)
    expect(wrapper.find('.zc-input-tag').exists()).toBe(true)
    expect(wrapper.find('input').exists()).toBe(true)
  })

  it('displays initial tags from modelValue', () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1', 'tag2'] },
    })
    const tags = wrapper.findAll('.zc-input-tag__tag')
    expect(tags.length).toBe(2)
    expect(tags[0].text()).toContain('tag1')
    expect(tags[1].text()).toContain('tag2')
  })

  it('adds tag on Enter key', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [] },
    })
    const input = wrapper.find('input')
    await input.setValue('newTag')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['newTag'])
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')![0][0]).toBe('newTag')
  })

  it('adds tag on Space key when trigger is space', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [], trigger: 'space' },
    })
    const input = wrapper.find('input')
    await input.setValue('spaceTag')
    await input.trigger('keydown', { key: ' ' })
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')![0][0]).toBe('spaceTag')
  })

  it('adds tag on Comma key when trigger is comma', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [], trigger: 'comma' },
    })
    const input = wrapper.find('input')
    await input.setValue('commaTag')
    await input.trigger('keydown', { key: ',' })
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')![0][0]).toBe('commaTag')
  })

  it('removes tag on Backspace when input is empty', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1', 'tag2'] },
    })
    const input = wrapper.find('input')
    await input.trigger('keydown', { key: 'Backspace' })
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')![0][0]).toBe('tag2')
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['tag1'])
  })

  it('removes tag via close button click', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1', 'tag2'] },
    })
    const closeBtns = wrapper.findAll('.zc-input-tag__tag-close')
    await closeBtns[0].trigger('click')
    expect(wrapper.emitted('remove')).toBeTruthy()
    expect(wrapper.emitted('remove')![0][0]).toBe('tag1')
  })

  it('emits clear event and empties modelValue on clear', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1', 'tag2'], clearable: true },
    })
    const clearBtn = wrapper.find('.zc-input-tag__clear')
    await clearBtn.trigger('click')
    expect(wrapper.emitted('clear')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual([])
  })

  it('does not add empty tag', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [] },
    })
    const input = wrapper.find('input')
    await input.setValue('   ')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('prevents duplicates by default', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1'] },
    })
    const input = wrapper.find('input')
    await input.setValue('tag1')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('allows duplicates when allowDuplicate is true', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1'], allowDuplicate: true },
    })
    const input = wrapper.find('input')
    await input.setValue('tag1')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')![0][0]).toEqual(['tag1', 'tag1'])
  })

  it('respects max limit', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['a', 'b'], max: 2 },
    })
    const input = wrapper.find('input')
    await input.setValue('c')
    await input.trigger('keydown', { key: 'Enter' })
    expect(wrapper.emitted('add')).toBeFalsy()
  })

  it('emits focus event', async () => {
    const wrapper = mount(InputTag)
    await wrapper.find('input').trigger('focus')
    expect(wrapper.emitted('focus')).toBeTruthy()
    expect(wrapper.classes()).toContain('is-focused')
  })

  it('emits blur event and adds remaining text on blur', async () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [] },
    })
    const input = wrapper.find('input')
    await input.setValue('blurTag')
    await input.trigger('blur')
    expect(wrapper.emitted('blur')).toBeTruthy()
    expect(wrapper.emitted('add')).toBeTruthy()
    expect(wrapper.emitted('add')![0][0]).toBe('blurTag')
  })

  it('applies disabled class and attribute', () => {
    const wrapper = mount(InputTag, {
      props: { disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
    expect(wrapper.find('input').attributes('disabled')).toBeDefined()
  })

  it('applies readonly class and attribute', () => {
    const wrapper = mount(InputTag, {
      props: { readonly: true },
    })
    expect(wrapper.classes()).toContain('is-readonly')
    expect(wrapper.find('input').attributes('readonly')).toBeDefined()
  })

  it('applies size class', () => {
    const wrapper = mount(InputTag, {
      props: { size: 'large' },
    })
    expect(wrapper.classes()).toContain('zc-input-tag--large')
  })

  it('shows placeholder only when no tags', () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: [], placeholder: '输入标签' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('输入标签')
  })

  it('hides placeholder when tags exist', () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1'], placeholder: '输入标签' },
    })
    expect(wrapper.find('input').attributes('placeholder')).toBe('')
  })

  it('hides close button when closable is false', () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1'], closable: false },
    })
    expect(wrapper.find('.zc-input-tag__tag-close').exists()).toBe(false)
  })

  it('hides clear button by default', () => {
    const wrapper = mount(InputTag, {
      props: { modelValue: ['tag1'] },
    })
    expect(wrapper.find('.zc-input-tag__clear').exists()).toBe(false)
  })

  it('exposes focus method', () => {
    const wrapper = mount(InputTag)
    expect(typeof (wrapper.vm as any).focus).toBe('function')
  })
})
