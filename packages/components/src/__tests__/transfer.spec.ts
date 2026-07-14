import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Transfer from '../transfer/transfer.vue'

const mockData = [
  { key: 1, label: 'Option 1' },
  { key: 2, label: 'Option 2' },
  { key: 3, label: 'Option 3' },
  { key: 4, label: 'Option 4' },
  { key: 5, label: 'Option 5' },
]

describe('ZcTransfer', () => {
  it('renders with default props', () => {
    const wrapper = mount(Transfer)
    expect(wrapper.find('.zc-transfer').exists()).toBe(true)
    expect(wrapper.findAll('.zc-transfer__panel').length).toBe(2)
    expect(wrapper.findAll('.zc-transfer__button').length).toBe(2)
  })

  it('applies disabled class', () => {
    const wrapper = mount(Transfer, { props: { disabled: true } })
    expect(wrapper.find('.zc-transfer').classes()).toContain('is-disabled')
  })

  it('displays left panel with data items', () => {
    const wrapper = mount(Transfer, { props: { data: mockData } })
    const leftItems = wrapper.find('.zc-transfer__panel')
    // All 5 items should be in left panel
    const items = leftItems.findAll('.zc-transfer__item')
    expect(items.length).toBe(5)
    expect(items[0].find('.zc-transfer__item-label').text()).toBe('Option 1')
  })

  it('displays titles in header', () => {
    const wrapper = mount(Transfer, {
      props: { data: mockData, titles: ['Source', 'Target'] },
    })
    // Titles are rendered at the top of each panel header area
    const panels = wrapper.findAll('.zc-transfer__panel')
    expect(panels.length).toBe(2)
  })

  it('moves items to right panel', async () => {
    const wrapper = mount(Transfer, {
      props: { data: mockData },
    })
    // Check first item
    const firstCheckbox = wrapper
      .findAll('.zc-transfer__panel')[0]
      .findAll('.zc-transfer__checkbox')[0]
    await firstCheckbox.trigger('click')

    // Click move to right button
    const buttons = wrapper.findAll('.zc-transfer__button')
    await buttons[0].trigger('click')

    expect(wrapper.emitted('update:modelValue')?.[0]).toBeTruthy()
  })

  it('displays items in right panel after move', async () => {
    const wrapper = mount(Transfer, {
      props: { data: mockData, modelValue: [1, 2] },
    })
    const rightPanel = wrapper.findAll('.zc-transfer__panel')[1]
    const items = rightPanel.findAll('.zc-transfer__item')
    expect(items.length).toBe(2)
    expect(items[0].find('.zc-transfer__item-label').text()).toBe('Option 1')
    expect(items[1].find('.zc-transfer__item-label').text()).toBe('Option 2')
  })

  it('shows search input when filterable', () => {
    const wrapper = mount(Transfer, {
      props: { data: mockData, filterable: true },
    })
    const filters = wrapper.findAll('.zc-transfer__filter')
    expect(filters.length).toBe(2)
  })

  it('shows header count', () => {
    const wrapper = mount(Transfer, { props: { data: mockData } })
    const headers = wrapper.findAll('.zc-transfer__header-text')
    expect(headers[0].text()).toContain('0/5')
    expect(headers[1].text()).toContain('0/0')
  })

  it('disables move buttons when nothing is checked', () => {
    const wrapper = mount(Transfer, { props: { data: mockData } })
    const buttons = wrapper.findAll('.zc-transfer__button')
    expect(buttons[0].classes()).toContain('is-disabled')
    expect(buttons[1].classes()).toContain('is-disabled')
  })

  it('renders empty state', () => {
    const wrapper = mount(Transfer, { props: { data: [], modelValue: [] } })
    const empties = wrapper.findAll('.zc-transfer__empty')
    expect(empties.length).toBe(2)
  })

  it('disables disabled items', () => {
    const dataWithDisabled = [
      { key: 1, label: 'Enabled', disabled: false },
      { key: 2, label: 'Disabled', disabled: true },
    ]
    const wrapper = mount(Transfer, { props: { data: dataWithDisabled } })
    const items = wrapper.findAll('.zc-transfer__panel')[0].findAll('.zc-transfer__item')
    expect(items[1].classes()).toContain('is-disabled')
  })

  it('emits left-check-change event', async () => {
    const wrapper = mount(Transfer, { props: { data: mockData } })
    const firstCheckbox = wrapper
      .findAll('.zc-transfer__panel')[0]
      .findAll('.zc-transfer__checkbox')[0]
    await firstCheckbox.trigger('click')
    expect(wrapper.emitted('left-check-change')).toBeTruthy()
  })
})
