import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import { h, nextTick } from 'vue'
import Descriptions from '../descriptions/descriptions.vue'
import DescriptionsItem from '../descriptions/descriptions-item.vue'

describe('ZcDescriptions', () => {
  it('renders with title', () => {
    const wrapper = mount(Descriptions, {
      props: { title: 'User Info' },
    })
    expect(wrapper.find('.zc-descriptions').exists()).toBe(true)
    expect(wrapper.find('.zc-descriptions__title').text()).toBe('User Info')
  })

  it('renders with bordered class', () => {
    const wrapper = mount(Descriptions, {
      props: { border: true },
    })
    expect(wrapper.find('.zc-descriptions').classes()).toContain('is-bordered')
  })

  it('applies vertical direction class', () => {
    const wrapper = mount(Descriptions, {
      props: { direction: 'vertical' },
    })
    expect(wrapper.find('.zc-descriptions').classes()).toContain('zc-descriptions--vertical')
  })

  it('applies size class', () => {
    const wrapper = mount(Descriptions, {
      props: { size: 'small' },
    })
    expect(wrapper.find('.zc-descriptions').classes()).toContain('zc-descriptions--small')
  })

  it('renders items with label and content', async () => {
    const wrapper = mount(Descriptions, {
      slots: {
        default: () => [
          h(DescriptionsItem, { label: 'Name' }, () => 'John'),
          h(DescriptionsItem, { label: 'Age' }, () => '25'),
        ],
      },
    })
    await nextTick()
    const labels = wrapper.findAll('.zc-descriptions__label')
    expect(labels.length).toBe(2)
    expect(labels[0].text()).toContain('Name')
    expect(labels[1].text()).toContain('Age')
  })

  it('renders custom title slot', () => {
    const wrapper = mount(Descriptions, {
      slots: {
        title: '<span class="custom-title">Custom</span>',
      },
    })
    expect(wrapper.find('.custom-title').exists()).toBe(true)
  })

  it('shows extra text', () => {
    const wrapper = mount(Descriptions, {
      props: { extra: 'Edit' },
    })
    expect(wrapper.find('.zc-descriptions__extra').text()).toBe('Edit')
  })

  it('renders header only when title or extra exists', () => {
    const wrapper = mount(Descriptions)
    expect(wrapper.find('.zc-descriptions__header').exists()).toBe(false)

    const wrapper2 = mount(Descriptions, { props: { title: 'Test' } })
    expect(wrapper2.find('.zc-descriptions__header').exists()).toBe(true)
  })

  // ---- Bug #15: Descriptions column grouping ----
  it('groups items into rows based on column prop', async () => {
    const wrapper = mount(Descriptions, {
      props: { column: 3 },
      slots: {
        default: () => [
          h(DescriptionsItem, { label: 'A' }, () => 'Val A'),
          h(DescriptionsItem, { label: 'B' }, () => 'Val B'),
          h(DescriptionsItem, { label: 'C' }, () => 'Val C'),
          h(DescriptionsItem, { label: 'D' }, () => 'Val D'),
          h(DescriptionsItem, { label: 'E' }, () => 'Val E'),
          h(DescriptionsItem, { label: 'F' }, () => 'Val F'),
        ],
      },
    })
    await nextTick()
    // With column=3 and 6 items, there should be 2 rows
    const rows = wrapper.findAll('.zc-descriptions__row')
    expect(rows.length).toBe(2)

    // First row should have 3 labels (A, B, C)
    const firstRowLabels = rows[0].findAll('.zc-descriptions__label')
    expect(firstRowLabels.length).toBe(3)
    expect(firstRowLabels[0].text()).toContain('A')
    expect(firstRowLabels[2].text()).toContain('C')

    // Second row should have 3 labels (D, E, F)
    const secondRowLabels = rows[1].findAll('.zc-descriptions__label')
    expect(secondRowLabels.length).toBe(3)
  })

  it('respects column=1 with one item per row', async () => {
    const wrapper = mount(Descriptions, {
      props: { column: 1 },
      slots: {
        default: () => [
          h(DescriptionsItem, { label: 'A' }, () => 'Val A'),
          h(DescriptionsItem, { label: 'B' }, () => 'Val B'),
        ],
      },
    })
    await nextTick()
    const rows = wrapper.findAll('.zc-descriptions__row')
    expect(rows.length).toBe(2)
    expect(rows[0].findAll('.zc-descriptions__label').length).toBe(1)
  })

  it('renders item content correctly within grouped rows', async () => {
    const wrapper = mount(Descriptions, {
      props: { column: 2 },
      slots: {
        default: () => [
          h(DescriptionsItem, { label: 'Name' }, () => 'John'),
          h(DescriptionsItem, { label: 'Age' }, () => '25'),
        ],
      },
    })
    await nextTick()
    const row = wrapper.find('.zc-descriptions__row')
    const contents = row.findAll('.zc-descriptions__content')
    expect(contents[0].text()).toContain('John')
    expect(contents[1].text()).toContain('25')
  })
})
