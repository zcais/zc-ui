import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Pagination from '../pagination/pagination.vue'

describe('ZcPagination', () => {
  it('renders with default props', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100 },
    })
    expect(wrapper.classes()).toContain('zc-pagination')
  })

  it('computes correct total pages', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10 },
    })
    // Should have page numbers up to 10
    const numbers = wrapper.findAll('.zc-pagination__number')
    const lastNumber = numbers[numbers.length - 1]
    expect(lastNumber.text()).toBe('10')
  })

  it('shows ellipsis for large page counts', () => {
    const wrapper = mount(Pagination, {
      props: { total: 1000, pageSize: 10, currentPage: 5 },
    })
    const ellipsis = wrapper.findAll('.zc-pagination__number.is-ellipsis')
    expect(ellipsis.length).toBeGreaterThan(0)
  })

  it('highlights active page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 3 },
    })
    const active = wrapper.find('.zc-pagination__number.is-active')
    expect(active.text()).toBe('3')
  })

  it('emits update:currentPage on page click', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, pageSize: 10, currentPage: 1 },
    })
    const numbers = wrapper.findAll('.zc-pagination__number')
    // Click on page 3 (accounting for ellipsis, find number 3)
    const page3 = numbers.find((n) => n.text() === '3')
    await page3?.trigger('click')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([3])
  })

  it('emits prev-click on prev button', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 3 },
    })
    const prevBtn = wrapper.find('.zc-pagination__prev')
    await prevBtn.trigger('click')
    expect(wrapper.emitted('prev-click')?.[0]).toEqual([2])
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([2])
  })

  it('emits next-click on next button', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 3 },
    })
    const nextBtn = wrapper.find('.zc-pagination__next')
    await nextBtn.trigger('click')
    expect(wrapper.emitted('next-click')?.[0]).toEqual([4])
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([4])
  })

  it('disables prev on first page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 1 },
    })
    const prevBtn = wrapper.find('.zc-pagination__prev')
    expect(prevBtn.classes()).toContain('is-disabled')
  })

  it('disables next on last page', () => {
    const wrapper = mount(Pagination, {
      props: { total: 50, pageSize: 10, currentPage: 5 },
    })
    const nextBtn = wrapper.find('.zc-pagination__next')
    expect(nextBtn.classes()).toContain('is-disabled')
  })

  it('shows total text when layout includes total', () => {
    const wrapper = mount(Pagination, {
      props: { total: 42, layout: 'total, prev, pager, next' },
    })
    expect(wrapper.find('.zc-pagination__total').text()).toContain('42')
  })

  it('shows jumper when layout includes jumper', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, layout: 'prev, pager, next, jumper' },
    })
    expect(wrapper.find('.zc-pagination__jumper').exists()).toBe(true)
    expect(wrapper.find('.zc-pagination__jumper-input').exists()).toBe(true)
  })

  it('applies disabled state', () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, disabled: true },
    })
    expect(wrapper.classes()).toContain('is-disabled')
  })

  it('shows all pages when total is small', () => {
    const wrapper = mount(Pagination, {
      props: { total: 30, pageSize: 10, currentPage: 1 },
    })
    const ellipsis = wrapper.findAll('.zc-pagination__number.is-ellipsis')
    expect(ellipsis.length).toBe(0)
  })

  it('jumper input navigates to entered page on Enter', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 1, layout: 'prev, pager, next, jumper' },
    })
    const input = wrapper.find('.zc-pagination__jumper-input')
    await input.setValue(5)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([5])
  })

  it('jumper input clamps to valid range', async () => {
    const wrapper = mount(Pagination, {
      props: { total: 100, pageSize: 10, currentPage: 1, layout: 'prev, pager, next, jumper' },
    })
    const input = wrapper.find('.zc-pagination__jumper-input')
    // Enter a page beyond total pages (100/10 = 10 pages)
    await input.setValue(99)
    await input.trigger('keyup.enter')
    expect(wrapper.emitted('update:currentPage')?.[0]).toEqual([10])
  })
})
