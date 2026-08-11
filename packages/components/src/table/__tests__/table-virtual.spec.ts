import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import { nextTick } from 'vue'
import ZcTable from '../table.vue'
import type { TableColumn } from '../types'

/**
 * jsdom does not implement real layout — clientHeight is always 0 and
 * scrollTo() is a no-op.  We stub these on HTMLElement.prototype so that
 * useVirtualList can compute a meaningful viewport height and the
 * virtualScrollTo tests can verify scroll positions.
 */
function setupJsdomLayoutMocks() {
  // Default container height used by most tests
  let mockClientHeight = 400

  Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
    configurable: true,
    get() {
      return mockClientHeight
    },
  })

  // Make scrollTo actually set scrollTop so assertions work
  HTMLElement.prototype.scrollTo = function (this: HTMLElement, options: ScrollToOptions | number) {
    if (typeof options === 'number') {
      this.scrollTop = options
    } else if (options && typeof options.top === 'number') {
      this.scrollTop = options.top
    }
  } as typeof HTMLElement.prototype.scrollTo

  return {
    setClientHeight(h: number) {
      mockClientHeight = h
    },
    restore() {
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (HTMLElement.prototype as any).clientHeight
    },
  }
}

describe('ZcTable Virtual Scrolling', () => {
  let layoutMocks: ReturnType<typeof setupJsdomLayoutMocks>

  beforeEach(() => {
    layoutMocks = setupJsdomLayoutMocks()
  })

  afterEach(() => {
    layoutMocks.restore()
    vi.restoreAllMocks()
  })
  // Helper to generate large dataset
  const generateData = (count: number) =>
    Array.from({ length: count }, (_, i) => ({
      id: i,
      name: `User ${i}`,
      age: 20 + (i % 50),
      email: `user${i}@example.com`,
    }))

  const columns: TableColumn[] = [
    { prop: 'id', label: 'ID', width: 80, sortable: true },
    { prop: 'name', label: 'Name', width: 150 },
    { prop: 'age', label: 'Age', width: 80, sortable: true },
    { prop: 'email', label: 'Email', width: 200 },
  ]

  describe('Virtual Mode Activation', () => {
    it('should not enable virtual mode when virtual=false', () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: false,
        },
      })

      // Virtual mode should be inactive
      expect(wrapper.vm.isVirtualActive).toBe(false)
    })

    it('should enable virtual mode when virtual=true and no pagination', () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          pagination: false,
          height: 400,
        },
      })

      expect(wrapper.vm.isVirtualActive).toBe(true)
    })

    it('should not enable virtual mode when pagination is enabled', () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          pagination: true,
        },
      })

      expect(wrapper.vm.isVirtualActive).toBe(false)
    })

    it('should use default estimatedRowHeight when not provided', () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
        },
      })

      expect(wrapper.vm.estimatedRowHeight).toBe(48)
    })

    it('should use custom estimatedRowHeight when provided', () => {
      const customHeight = 64
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          estimatedRowHeight: customHeight,
          height: 400,
        },
      })

      expect(wrapper.vm.estimatedRowHeight).toBe(customHeight)
    })
  })

  describe('DOM Node Count', () => {
    it('should render minimal DOM nodes with large dataset (1000 rows)', async () => {
      const largeData = generateData(1000)
      const wrapper = mount(ZcTable, {
        props: {
          data: largeData,
          columns,
          virtual: true,
          pagination: false,
          height: 400,
          estimatedRowHeight: 48,
        },
        attachTo: document.body,
      })

      await nextTick()
      await nextTick()
      await nextTick()

      // Verify virtual mode is active
      expect(wrapper.vm.isVirtualActive).toBe(true)

      // Check that virtualData is a subset of displayData (not all data)
      expect(wrapper.vm.virtualData.length).toBeLessThan(largeData.length)
      expect(wrapper.vm.virtualData.length).toBeGreaterThan(0)

      wrapper.unmount()
    }, 30000) // jsdom is slower than browsers
  })

  describe('Sorting in Virtual Mode', () => {
    it('should sort correctly in virtual mode', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
          defaultSort: { prop: 'age', order: 'ascending' },
        },
      })

      await nextTick()

      // Sort state should be applied
      expect(wrapper.vm.sortState.prop).toBe('age')
      expect(wrapper.vm.sortState.order).toBe('ascending')

      // Processed data should be sorted
      const ages = wrapper.vm.processedData.map((row: any) => row.age)
      const sortedAges = [...ages].sort((a, b) => a - b)
      expect(ages).toEqual(sortedAges)
    })

    it('should emit sort-change event in virtual mode', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
        },
      })

      await nextTick()

      const ageColumn = columns.find((col) => col.prop === 'age')
      expect(ageColumn).toBeDefined()

      // Simulate sort click
      wrapper.vm.handleSortClick(ageColumn!)

      await nextTick()

      // Event should be emitted
      expect(wrapper.emitted('sort-change')).toBeTruthy()
    })
  })

  describe('Filtering in Virtual Mode', () => {
    it('should filter correctly in virtual mode', async () => {
      const columnsWithFilter: TableColumn[] = [
        ...columns,
        {
          prop: 'age',
          label: 'Age',
          filterable: true,
          filters: [
            { text: '20-29', value: '20-29' },
            { text: '30-39', value: '30-39' },
          ],
        },
      ]

      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns: columnsWithFilter,
          virtual: true,
          height: 400,
        },
      })

      await nextTick()

      const initialLength = wrapper.vm.processedData.length

      // Apply filter
      wrapper.vm.handleFilterToggle(columnsWithFilter[1], '20-29')

      await nextTick()

      // Processed data should be filtered
      expect(wrapper.vm.processedData.length).toBeLessThan(initialLength)

      // Event should be emitted
      expect(wrapper.emitted('filter-change')).toBeTruthy()
    })
  })

  describe('Selection in Virtual Mode', () => {
    it('should select rows correctly in virtual mode', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          selectable: true,
          virtual: true,
          height: 400,
        },
      })

      await nextTick()

      const firstRow = wrapper.vm.processedData[0]

      // Select a row
      wrapper.vm.handleRowSelect(firstRow, true)

      await nextTick()

      // Row should be selected
      expect(wrapper.vm.isRowSelected(firstRow)).toBe(true)

      // Event should be emitted
      expect(wrapper.emitted('selection-change')).toBeTruthy()
      const selectedRows = wrapper.emitted('selection-change')![0][0] as any[]
      expect(selectedRows.length).toBe(1)
      expect(selectedRows[0].id).toBe(firstRow.id)
    })

    it('should select all rows correctly in virtual mode', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          selectable: true,
          virtual: true,
          height: 400,
        },
      })

      await nextTick()

      // Select all
      wrapper.vm.isAllSelected = true

      await nextTick()

      // All current page rows should be selected
      const displayData = wrapper.vm.displayData
      displayData.forEach((row: any) => {
        expect(wrapper.vm.isRowSelected(row)).toBe(true)
      })
    })
  })

  describe('virtualScrollTo Method', () => {
    it('should expose virtualScrollTo method', () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
        },
      })

      expect(typeof wrapper.vm.virtualScrollTo).toBe('function')
    })

    it('should scroll to specific index', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
          estimatedRowHeight: 48,
        },
        attachTo: document.body,
      })

      await nextTick()

      const container = wrapper.vm.wrapperRef
      if (!container) {
        wrapper.unmount()
        throw new Error('Container ref is not available')
      }

      // Call scrollToIndex
      wrapper.vm.virtualScrollTo(50, 'smooth')

      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 300)) // Wait for scroll

      // Scroll position should be close to the target
      // 50 * 48 = 2400px
      expect(container.scrollTop).toBeGreaterThan(2000)
      expect(container.scrollTop).toBeLessThan(2800)

      wrapper.unmount()
    })

    it('should handle boundary index (0)', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
          estimatedRowHeight: 48,
        },
        attachTo: document.body,
      })

      await nextTick()

      const container = wrapper.vm.wrapperRef
      if (!container) {
        wrapper.unmount()
        throw new Error('Container ref is not available')
      }

      // Scroll to first row
      wrapper.vm.virtualScrollTo(0, 'auto')

      await nextTick()

      expect(container.scrollTop).toBe(0)

      wrapper.unmount()
    })

    it('should handle boundary index (last row)', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
          estimatedRowHeight: 48,
        },
        attachTo: document.body,
      })

      await nextTick()

      const container = wrapper.vm.wrapperRef
      if (!container) {
        wrapper.unmount()
        throw new Error('Container ref is not available')
      }

      // Scroll to last row
      wrapper.vm.virtualScrollTo(99, 'auto')

      await nextTick()
      await new Promise((resolve) => setTimeout(resolve, 100))

      // Should scroll near the end
      // 99 * 48 = 4752px, viewport 400px
      // So scroll position should be around 4352px
      expect(container.scrollTop).toBeGreaterThan(4000)

      wrapper.unmount()
    })

    it('should handle out-of-bound index gracefully', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns,
          virtual: true,
          height: 400,
          estimatedRowHeight: 48,
        },
        attachTo: document.body,
      })

      await nextTick()

      const container = wrapper.vm.wrapperRef
      if (!container) {
        wrapper.unmount()
        throw new Error('Container ref is not available')
      }

      // Should not crash with invalid index
      expect(() => wrapper.vm.virtualScrollTo(1000, 'auto')).not.toThrow()

      // Should clamp to last item
      await nextTick()
      expect(container.scrollTop).toBeGreaterThan(0)

      wrapper.unmount()
    })
  })

  describe('Performance with Large Datasets', () => {
    it('should handle 1000 rows efficiently', async () => {
      const startTime = performance.now()

      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(1000),
          columns,
          virtual: true,
          height: 400,
          estimatedRowHeight: 48,
        },
        attachTo: document.body,
      })

      await nextTick()
      await nextTick()

      const mountTime = performance.now() - startTime

      // Mount should complete in reasonable time (< 30s in jsdom which is slower than browsers)
      expect(mountTime).toBeLessThan(30000)

      wrapper.unmount()
    }, 60000) // Give jsdom extra time
  })

  describe('Fixed Columns in Virtual Mode', () => {
    it('should render fixed columns correctly in virtual mode', async () => {
      const columnsWithFixed: TableColumn[] = [
        { prop: 'id', label: 'ID', fixed: 'left', width: 80 },
        { prop: 'name', label: 'Name', width: 150 },
        { prop: 'age', label: 'Age', width: 80 },
        { prop: 'email', label: 'Email', fixed: 'right', width: 200 },
      ]

      const wrapper = mount(ZcTable, {
        props: {
          data: generateData(100),
          columns: columnsWithFixed,
          virtual: true,
          height: 400,
        },
      })

      await nextTick()

      // Check that displayColumns are properly ordered (fixed-left first)
      const displayCols = wrapper.vm.displayColumns
      expect(displayCols[0].fixed).toBe('left')
      expect(displayCols[displayCols.length - 1].fixed).toBe('right')
    })
  })

  describe('Empty State in Virtual Mode', () => {
    it('should show empty state when data is empty in virtual mode', async () => {
      const wrapper = mount(ZcTable, {
        props: {
          data: [],
          columns,
          virtual: true,
          height: 400,
        },
      })

      await nextTick()

      const renderRows = wrapper.vm.renderRows
      expect(renderRows.length).toBe(0)
    })
  })
})
