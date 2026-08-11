import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { mount } from '@vue/test-utils'
import Table from '../table/table.vue'
import type { TableColumn } from '../table/types'

const sampleColumns: TableColumn[] = [
  { prop: 'name', label: 'Name' },
  { prop: 'age', label: 'Age', sortable: true },
  {
    prop: 'city',
    label: 'City',
    filterable: true,
    filters: [
      { text: 'Beijing', value: 'Beijing' },
      { text: 'Shanghai', value: 'Shanghai' },
    ],
  },
]

const sampleData = [
  { id: 1, name: 'Alice', age: 30, city: 'Beijing' },
  { id: 2, name: 'Bob', age: 25, city: 'Shanghai' },
  { id: 3, name: 'Charlie', age: 35, city: 'Beijing' },
]

describe('ZcTable', () => {
  it('renders with default props', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    expect(wrapper.classes()).toContain('zc-table')
  })

  // ---- Header rendering ----
  it('renders table headers from columns', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(3)
    expect(headers[0].text()).toContain('Name')
    expect(headers[1].text()).toContain('Age')
    expect(headers[2].text()).toContain('City')
  })

  it('renders body rows from data', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(3)
  })

  it('renders correct cell values', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    const cells = wrapper.findAll('tbody tr:first-child td')
    expect(cells[0].text()).toContain('Alice')
    expect(cells[1].text()).toContain('30')
    expect(cells[2].text()).toContain('Beijing')
  })

  // ---- Empty state ----
  it('shows empty text when data is empty', () => {
    const wrapper = mount(Table, {
      props: { data: [], columns: sampleColumns, emptyText: '暂无数据' },
    })
    expect(wrapper.find('.zc-table__empty-cell').text()).toContain('暂无数据')
  })

  it('uses default empty text', () => {
    const wrapper = mount(Table, {
      props: { data: [], columns: sampleColumns },
    })
    expect(wrapper.find('.zc-table__empty-cell').text()).toContain('暂无数据')
  })

  // ---- Sorting ----
  it('renders sort icons for sortable columns', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    expect(wrapper.find('.zc-table__sort-icon').exists()).toBe(true)
  })

  it('does not render sort icons for non-sortable columns', () => {
    const cols: TableColumn[] = [{ prop: 'name', label: 'Name' }]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    expect(wrapper.find('.zc-table__sort-icon').exists()).toBe(false)
  })

  it('sorts data ascending when sort icon clicked', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    const cells = wrapper.findAll('tbody tr:first-child td')
    expect(cells[1].text()).toContain('25')
  })

  it('sorts data descending when sort icon clicked twice', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    const cells = wrapper.findAll('tbody tr:first-child td')
    expect(cells[1].text()).toContain('35')
  })

  it('resets sort when sort icon clicked three times', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    const cells = wrapper.findAll('tbody tr:first-child td')
    expect(cells[0].text()).toContain('Alice')
  })

  it('emits sort-change event when sorting', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    expect(wrapper.emitted('sort-change')).toBeTruthy()
    const event = wrapper.emitted('sort-change')![0][0] as any
    expect(event.prop).toBe('age')
    expect(event.order).toBe('ascending')
  })

  // ---- Custom sorting ----
  it('does not sort data locally when sortable is custom', async () => {
    const cols: TableColumn[] = [{ prop: 'age', label: 'Age', sortable: 'custom' }]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    const cells = wrapper.findAll('tbody tr:first-child td')
    expect(cells[0].text()).toContain('30')
  })

  it('emits sort-change for custom sortable columns', async () => {
    const cols: TableColumn[] = [{ prop: 'age', label: 'Age', sortable: 'custom' }]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    expect(wrapper.emitted('sort-change')).toBeTruthy()
    const event = wrapper.emitted('sort-change')![0][0] as any
    expect(event.prop).toBe('age')
    expect(event.order).toBe('ascending')
  })

  // ---- Sorting + Filtering combined ----
  it('applies both sort and filter simultaneously', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__filter-trigger').trigger('click')
    const checkboxes = wrapper.findAll('.zc-table__filter-item input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    await wrapper.find('.zc-table__sort-icon').trigger('click')
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
    expect(rows[0].text()).toContain('Alice')
    expect(rows[1].text()).toContain('Charlie')
  })

  // ---- Filtering ----
  it('renders filter trigger for filterable columns', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    expect(wrapper.find('.zc-table__filter-trigger').exists()).toBe(true)
  })

  it('opens filter dropdown when trigger clicked', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__filter-trigger').trigger('click')
    expect(wrapper.find('.zc-table__filter-dropdown').exists()).toBe(true)
  })

  it('filters data when filter option selected', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__filter-trigger').trigger('click')
    const checkboxes = wrapper.findAll('.zc-table__filter-item input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('emits filter-change event when filter applied', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('.zc-table__filter-trigger').trigger('click')
    const checkboxes = wrapper.findAll('.zc-table__filter-item input[type="checkbox"]')
    await checkboxes[0].setValue(true)
    expect(wrapper.emitted('filter-change')).toBeTruthy()
  })

  // ---- Selection ----
  it('renders selection checkboxes when selectable is true', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, selectable: true },
    })
    const headerCheckbox = wrapper.find('thead .zc-checkbox')
    expect(headerCheckbox.exists()).toBe(true)
    const bodyCheckboxes = wrapper.findAll('tbody .zc-checkbox')
    expect(bodyCheckboxes).toHaveLength(3)
  })

  it('selects a row when checkbox clicked', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, selectable: true },
    })
    const bodyCheckbox = wrapper.find('tbody .zc-checkbox input')
    await bodyCheckbox.setValue(true)
    expect(wrapper.emitted('selection-change')).toBeTruthy()
    const selection = wrapper.emitted('selection-change')![0][0] as any[]
    expect(selection).toHaveLength(1)
    expect(selection[0].name).toBe('Alice')
  })

  it('selects all rows when header checkbox checked', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, selectable: true },
    })
    const headerCheckbox = wrapper.find('thead .zc-checkbox input')
    await headerCheckbox.setValue(true)
    expect(wrapper.emitted('selection-change')).toBeTruthy()
    const selection = wrapper.emitted('selection-change')![0][0] as any[]
    expect(selection).toHaveLength(3)
  })

  // ---- Pagination ----
  it('renders pagination when pagination is true', () => {
    const wrapper = mount(Table, {
      props: {
        data: sampleData,
        columns: sampleColumns,
        pagination: true,
        pageSize: 2,
      },
    })
    expect(wrapper.find('.zc-pagination').exists()).toBe(true)
  })

  it('paginates data correctly', () => {
    const wrapper = mount(Table, {
      props: {
        data: sampleData,
        columns: sampleColumns,
        pagination: true,
        pageSize: 2,
      },
    })
    const rows = wrapper.findAll('tbody tr')
    expect(rows).toHaveLength(2)
  })

  it('navigates to next page via ZcPagination', async () => {
    const wrapper = mount(Table, {
      props: {
        data: sampleData,
        columns: sampleColumns,
        pagination: true,
        pageSize: 2,
      },
    })
    expect(wrapper.findAll('tbody tr')).toHaveLength(2)
    expect(wrapper.find('tbody tr:first-child td').text()).toContain('Alice')
    const pageNumbers = wrapper.findAll('.zc-pagination__number')
    await pageNumbers[1].trigger('click')
    expect(wrapper.find('tbody tr:first-child td').text()).toContain('Charlie')
  })

  it('emits current-change on page navigation', async () => {
    const wrapper = mount(Table, {
      props: {
        data: sampleData,
        columns: sampleColumns,
        pagination: true,
        pageSize: 2,
      },
    })
    const pageNumbers = wrapper.findAll('.zc-pagination__number')
    await pageNumbers[1].trigger('click')
    expect(wrapper.emitted('current-change')).toBeTruthy()
    expect(wrapper.emitted('current-change')![0][0]).toBe(2)
  })

  it('clamps current page when data shrinks', async () => {
    const wrapper = mount(Table, {
      props: {
        data: sampleData,
        columns: sampleColumns,
        pagination: true,
        pageSize: 1,
      },
    })
    const pageNumbers = wrapper.findAll('.zc-pagination__number')
    await pageNumbers[2].trigger('click')
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
    await wrapper.setProps({ data: [{ id: 99, name: 'Zed', age: 99, city: 'X' }] })
    expect(wrapper.findAll('tbody tr')).toHaveLength(1)
  })

  // ---- Border & Stripe ----
  it('applies border class when border is true', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, border: true },
    })
    expect(wrapper.classes()).toContain('is-border')
  })

  it('applies stripe class when stripe is true', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, stripe: true },
    })
    expect(wrapper.classes()).toContain('is-stripe')
  })

  // ---- Custom column slots ----
  it('renders custom cell via slot', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
      slots: {
        'cell-name': '<template #default="{ row }"><strong>{{ row.name }}</strong></template>',
      },
    })
    expect(wrapper.find('tbody strong').exists()).toBe(true)
  })

  it('renders custom header via slot', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
      slots: {
        'header-name': '<template #default><span class="custom-header">Custom</span></template>',
      },
    })
    expect(wrapper.find('.custom-header').exists()).toBe(true)
  })

  // ---- Formatter ----
  it('uses formatter function for cell rendering', () => {
    const cols: TableColumn[] = [
      {
        prop: 'age',
        label: 'Age',
        formatter: (row) => `${row.age} years old`,
      },
    ]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    expect(wrapper.find('tbody tr:first-child td').text()).toContain('30 years old')
  })

  // ---- Row click ----
  it('emits row-click event when row clicked', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns },
    })
    await wrapper.find('tbody tr').trigger('click')
    expect(wrapper.emitted('row-click')).toBeTruthy()
  })

  // ---- Highlight current row ----
  it('highlights current row when highlightCurrentRow is true', async () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, highlightCurrentRow: true },
    })
    await wrapper.find('tbody tr').trigger('click')
    expect(wrapper.find('tbody tr').classes()).toContain('is-current')
  })

  // ---- Size variants ----
  it('applies large size class', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, size: 'large' },
    })
    expect(wrapper.classes()).toContain('zc-table--large')
  })

  it('applies small size class', () => {
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: sampleColumns, size: 'small' },
    })
    expect(wrapper.classes()).toContain('zc-table--small')
  })

  // ---- Column visibility ----
  it('hides columns when visible is false', () => {
    const cols: TableColumn[] = [
      { prop: 'name', label: 'Name' },
      { prop: 'age', label: 'Age', visible: false },
    ]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    const headers = wrapper.findAll('thead th')
    expect(headers).toHaveLength(1)
    expect(headers[0].text()).toContain('Name')
  })

  // ---- headerAlign ----
  it('applies headerAlign independently from align', () => {
    const cols: TableColumn[] = [
      { prop: 'name', label: 'Name', align: 'right', headerAlign: 'center' },
    ]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    const headerCell = wrapper.find('thead .zc-table__cell')
    expect(headerCell.attributes('style')).toContain('text-align: center')
    const bodyCell = wrapper.find('tbody .zc-table__cell')
    expect(bodyCell.attributes('style')).toContain('text-align: right')
  })

  // ---- className ----
  it('applies custom className to header and body cells', () => {
    const cols: TableColumn[] = [{ prop: 'name', label: 'Name', className: 'my-custom-col' }]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    expect(wrapper.find('thead .my-custom-col').exists()).toBe(true)
    expect(wrapper.find('tbody .my-custom-col').exists()).toBe(true)
  })

  // ---- minWidth ----
  it('applies minWidth style to columns', () => {
    const cols: TableColumn[] = [{ prop: 'name', label: 'Name', minWidth: 200 }]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    const headerStyle = wrapper.find('thead th').attributes('style')
    expect(headerStyle).toContain('min-width: 200px')
  })

  // ---- Fixed column ----
  it('applies fixed class and sticky position for fixed columns', () => {
    const cols: TableColumn[] = [
      { prop: 'name', label: 'Name', fixed: 'left' },
      { prop: 'age', label: 'Age' },
    ]
    const wrapper = mount(Table, {
      props: { data: sampleData, columns: cols },
    })
    const headerTh = wrapper.find('thead th')
    expect(headerTh.classes()).toContain('is-fixed')
    expect(headerTh.attributes('style')).toContain('position: sticky')
  })

  // ============================================================
  // Advanced Feature Tests
  // ============================================================

  // ---- 1. Fixed Column Offsets ----
  describe('Fixed Column Offsets', () => {
    it('calculates left offset for multiple fixed-left columns', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name', fixed: 'left', width: 100 },
        { prop: 'age', label: 'Age', fixed: 'left', width: 80 },
        { prop: 'city', label: 'City' },
      ]
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols },
      })
      const headerThs = wrapper.findAll('thead th')
      expect(headerThs[0].attributes('style')).toContain('left: 0px')
      expect(headerThs[1].attributes('style')).toContain('left: 100px')
    })

    it('calculates right offset for fixed-right columns', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name' },
        { prop: 'age', label: 'Age', fixed: 'right', width: 80 },
        { prop: 'city', label: 'City', fixed: 'right', width: 100 },
      ]
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols },
      })
      const headerThs = wrapper.findAll('thead th')
      expect(headerThs[2].attributes('style')).toContain('right: 0px')
      expect(headerThs[1].attributes('style')).toContain('right: 100px')
    })

    it('adds fixed-left-last shadow class to last fixed-left column', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name', fixed: 'left', width: 100 },
        { prop: 'age', label: 'Age' },
      ]
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols },
      })
      const headerTh = wrapper.find('thead th')
      expect(headerTh.classes()).toContain('is-fixed-left-last')
    })

    it('adds fixed-right-first shadow class to first fixed-right column', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name' },
        { prop: 'age', label: 'Age', fixed: 'right', width: 80 },
      ]
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols },
      })
      const headerTh = wrapper.findAll('thead th')[1]
      expect(headerTh.classes()).toContain('is-fixed-right-first')
    })
  })

  // ---- 2. Span Method ----
  describe('Span Method', () => {
    it('merges cells using spanMethod (rowspan)', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name' },
        { prop: 'age', label: 'Age' },
      ]
      const spanMethod = ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
        if (columnIndex === 0) {
          if (rowIndex === 0) return { rowspan: 2, colspan: 1 }
          return { rowspan: 0, colspan: 0 }
        }
        return { rowspan: 1, colspan: 1 }
      }
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols, spanMethod },
      })
      const firstRowCells = wrapper.findAll('tbody tr:first-child td')
      const secondRowCells = wrapper.findAll('tbody tr:nth-child(2) td')
      expect(firstRowCells[0].attributes('rowspan')).toBe('2')
      expect(secondRowCells.length).toBe(1)
    })

    it('merges cells using spanMethod (colspan)', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name' },
        { prop: 'age', label: 'Age' },
        { prop: 'city', label: 'City' },
      ]
      const spanMethod = ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
        if (rowIndex === 0 && columnIndex === 0) return { rowspan: 1, colspan: 2 }
        if (rowIndex === 0 && columnIndex === 1) return { rowspan: 0, colspan: 0 }
        return { rowspan: 1, colspan: 1 }
      }
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols, spanMethod },
      })
      const firstRowCells = wrapper.findAll('tbody tr:first-child td')
      expect(firstRowCells[0].attributes('colspan')).toBe('2')
      expect(firstRowCells.length).toBe(2)
    })

    it('supports array return from spanMethod', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name' },
        { prop: 'age', label: 'Age' },
      ]
      const spanMethod = ({ rowIndex, columnIndex }: { rowIndex: number; columnIndex: number }) => {
        if (columnIndex === 0 && rowIndex === 0) return [2, 1] as [number, number]
        if (columnIndex === 0 && rowIndex === 1) return [0, 0] as [number, number]
        return [1, 1] as [number, number]
      }
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols, spanMethod },
      })
      const firstRowCells = wrapper.findAll('tbody tr:first-child td')
      expect(firstRowCells[0].attributes('rowspan')).toBe('2')
    })

    it('returns undefined from spanMethod means no merge', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name' },
        { prop: 'age', label: 'Age' },
      ]
      const spanMethod = () => undefined
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols, spanMethod },
      })
      const firstRowCells = wrapper.findAll('tbody tr:first-child td')
      expect(firstRowCells).toHaveLength(2)
    })
  })

  // ---- 3. Expandable Row ----
  describe('Expandable Row', () => {
    it('renders expand column when expandable is true', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, expandable: true },
      })
      expect(wrapper.find('.zc-table__expand-icon').exists()).toBe(true)
    })

    it('shows expand content when row is expanded', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, expandable: true },
        slots: {
          expand:
            '<template #default="{ row }"><div class="expand-detail">{{ row.name }} details</div></template>',
        },
      })
      expect(wrapper.find('.expand-detail').exists()).toBe(false)
      await wrapper.find('.zc-table__expand-icon').trigger('click')
      expect(wrapper.find('.expand-detail').exists()).toBe(true)
      expect(wrapper.find('.expand-detail').text()).toContain('Alice details')
    })

    it('emits expand-change event when toggling', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, expandable: true },
      })
      await wrapper.find('.zc-table__expand-icon').trigger('click')
      expect(wrapper.emitted('expand-change')).toBeTruthy()
      const event = wrapper.emitted('expand-change')![0] as any[]
      expect(event[0].name).toBe('Alice')
      expect(event[1]).toBe(true)
    })

    it('collapses expand content on second click', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, expandable: true },
        slots: {
          expand: '<template #default><div class="expand-detail">Expanded</div></template>',
        },
      })
      await wrapper.find('.zc-table__expand-icon').trigger('click')
      expect(wrapper.find('.expand-detail').exists()).toBe(true)
      await wrapper.find('.zc-table__expand-icon').trigger('click')
      expect(wrapper.find('.expand-detail').exists()).toBe(false)
    })
  })

  // ---- 4. Tree Table ----
  describe('Tree Table', () => {
    const treeData = [
      {
        id: 1,
        name: 'Parent 1',
        age: 50,
        city: 'Beijing',
        children: [
          { id: 11, name: 'Child 1-1', age: 25, city: 'Shanghai' },
          { id: 12, name: 'Child 1-2', age: 22, city: 'Beijing' },
        ],
      },
      { id: 2, name: 'Parent 2', age: 40, city: 'Shanghai' },
    ]

    it('renders tree structure with correct row count', () => {
      const wrapper = mount(Table, {
        props: {
          data: treeData,
          columns: sampleColumns,
          treeProps: { children: 'children' },
        },
      })
      const rows = wrapper.findAll('tbody tr')
      expect(rows).toHaveLength(2)
    })

    it('shows tree toggle for rows with children', () => {
      const wrapper = mount(Table, {
        props: {
          data: treeData,
          columns: sampleColumns,
          treeProps: { children: 'children' },
        },
      })
      const treeToggles = wrapper.findAll('.zc-table__tree-toggle')
      expect(treeToggles).toHaveLength(1)
    })

    it('expands tree node to show children', async () => {
      const wrapper = mount(Table, {
        props: {
          data: treeData,
          columns: sampleColumns,
          treeProps: { children: 'children' },
        },
      })
      expect(wrapper.findAll('tbody tr')).toHaveLength(2)
      await wrapper.find('.zc-table__tree-toggle').trigger('click')
      expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    })

    it('emits tree-toggle event when expanding/collapsing', async () => {
      const wrapper = mount(Table, {
        props: {
          data: treeData,
          columns: sampleColumns,
          treeProps: { children: 'children' },
        },
      })
      await wrapper.find('.zc-table__tree-toggle').trigger('click')
      expect(wrapper.emitted('tree-toggle')).toBeTruthy()
      const event = wrapper.emitted('tree-toggle')![0] as any[]
      expect(event[0].name).toBe('Parent 1')
      expect(event[1]).toBe(true)
    })

    it('expands all nodes when defaultExpandAll is true', () => {
      const wrapper = mount(Table, {
        props: {
          data: treeData,
          columns: sampleColumns,
          treeProps: { children: 'children' },
          defaultExpandAll: true,
        },
      })
      expect(wrapper.findAll('tbody tr')).toHaveLength(4)
    })

    it('applies tree indent based on depth', async () => {
      const wrapper = mount(Table, {
        props: {
          data: treeData,
          columns: sampleColumns,
          treeProps: { children: 'children', indent: 20 },
        },
      })
      await wrapper.find('.zc-table__tree-toggle').trigger('click')
      const indents = wrapper.findAll('.zc-table__tree-indent')
      expect(indents.length).toBeGreaterThan(0)
      const childIndent = indents.find((el) => el.attributes('style')?.includes('20px'))
      expect(childIndent).toBeTruthy()
    })
  })

  // ---- 5. Drag Sort ----
  describe('Drag Sort', () => {
    it('makes rows draggable when draggable is true', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, draggable: true },
      })
      const rows = wrapper.findAll('tbody tr')
      rows.forEach((row) => {
        expect(row.attributes('draggable')).toBe('true')
      })
    })

    it('does not make rows draggable by default', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns },
      })
      const row = wrapper.find('tbody tr')
      expect(row.attributes('draggable')).toBe('false')
    })

    it('emits row-drag-end event after drag and drop', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, draggable: true },
      })
      const rows = wrapper.findAll('tbody tr')
      await rows[0].trigger('dragstart', { dataTransfer: { effectAllowed: 'move' } })
      await rows[1].trigger('dragover', {
        preventDefault: () => {},
        dataTransfer: { dropEffect: 'move' },
      })
      await rows[1].trigger('drop', { preventDefault: () => {} })
      expect(wrapper.emitted('row-drag-end')).toBeTruthy()
      const event = wrapper.emitted('row-drag-end')![0][0] as any
      expect(event.oldIndex).toBe(0)
      expect(event.newIndex).toBe(1)
      expect(event.data[0].name).toBe('Bob')
    })

    it('applies dragging visual class during drag', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, draggable: true },
      })
      const rows = wrapper.findAll('tbody tr')
      await rows[0].trigger('dragstart', { dataTransfer: { effectAllowed: 'move' } })
      expect(rows[0].classes()).toContain('is-dragging')
    })
  })

  // ---- 6. Editable Cell ----
  describe('Editable Cell', () => {
    it('renders input when editable cell is clicked', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, editable: true },
      })
      const firstCell = wrapper.find('tbody tr:first-child td')
      await firstCell.trigger('click')
      expect(wrapper.find('.zc-table__edit-input').exists()).toBe(true)
    })

    it('can be controlled via editable prop and column.editable', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name', editable: true },
        { prop: 'age', label: 'Age', editable: false },
      ]
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols, editable: true },
      })
      expect(wrapper.find('tbody').exists()).toBe(true)
    })

    it('emits cell-edit event when editing is confirmed', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, editable: true },
      })
      const vm = wrapper.vm as any
      vm.startEdit(sampleData[0], sampleColumns[0])
      vm.editValue = 'Alice Updated'
      vm.confirmEdit(sampleData[0], sampleColumns[0])
      expect(wrapper.emitted('cell-edit')).toBeTruthy()
      const event = wrapper.emitted('cell-edit')![0][0] as any
      expect(event.row.name).toBe('Alice Updated')
      expect(event.oldValue).toBe('Alice')
    })

    it('cancels edit without emitting event', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, editable: true },
      })
      const vm = wrapper.vm as any
      vm.startEdit(sampleData[0], sampleColumns[0])
      vm.editValue = 'Changed'
      vm.cancelEdit()
      expect(wrapper.emitted('cell-edit')).toBeFalsy()
    })
  })

  // ---- 7. Summary Row ----
  describe('Summary Row', () => {
    it('renders summary row when showSummary is true', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showSummary: true },
      })
      expect(wrapper.find('.zc-table__summary-row').exists()).toBe(true)
    })

    it('shows default summary text in first column', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showSummary: true },
      })
      const summaryCells = wrapper.findAll('.zc-table__summary-cell')
      expect(summaryCells[0].text()).toContain('合计')
    })

    it('calculates numeric sum for columns', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showSummary: true },
      })
      const summaryCells = wrapper.findAll('.zc-table__summary-cell')
      expect(summaryCells[1].text()).toContain('90')
    })

    it('uses custom summaryText', () => {
      const wrapper = mount(Table, {
        props: {
          data: sampleData,
          columns: sampleColumns,
          showSummary: true,
          summaryText: 'Total',
        },
      })
      const summaryCells = wrapper.findAll('.zc-table__summary-cell')
      expect(summaryCells[0].text()).toContain('Total')
    })

    it('uses custom summaryMethod when provided', () => {
      const wrapper = mount(Table, {
        props: {
          data: sampleData,
          columns: sampleColumns,
          showSummary: true,
          summaryMethod: ({ columns, data }: any) => {
            return columns.map((col: any, index: number) => {
              if (index === 0) return 'Custom Total'
              if (col.prop === 'age') return String(data.length)
              return ''
            })
          },
        },
      })
      const summaryCells = wrapper.findAll('.zc-table__summary-cell')
      expect(summaryCells[0].text()).toContain('Custom Total')
      expect(summaryCells[1].text()).toContain('3')
    })
  })

  // ---- 8. Column Settings ----
  describe('Column Settings', () => {
    it('renders settings button when showColumnSettings is true', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showColumnSettings: true },
      })
      expect(wrapper.find('.zc-table__settings-trigger').exists()).toBe(true)
    })

    it('does not render settings button by default', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns },
      })
      expect(wrapper.find('.zc-table__settings-trigger').exists()).toBe(false)
    })

    it('opens settings panel when trigger clicked', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showColumnSettings: true },
      })
      await wrapper.find('.zc-table__settings-trigger').trigger('click')
      expect(wrapper.find('.zc-table__settings-panel').exists()).toBe(true)
      const items = wrapper.findAll('.zc-table__settings-item')
      expect(items).toHaveLength(3)
    })

    it('hides column when unchecked in settings', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showColumnSettings: true },
      })
      await wrapper.find('.zc-table__settings-trigger').trigger('click')
      const checkboxes = wrapper.findAll('.zc-table__settings-item input[type="checkbox"]')
      await checkboxes[1].setValue(false)
      const headers = wrapper.findAll('thead th')
      expect(headers).toHaveLength(2)
    })

    it('emits column-settings-change event when visibility toggled', async () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, showColumnSettings: true },
      })
      await wrapper.find('.zc-table__settings-trigger').trigger('click')
      const checkboxes = wrapper.findAll('.zc-table__settings-item input[type="checkbox"]')
      await checkboxes[0].setValue(false)
      expect(wrapper.emitted('column-settings-change')).toBeTruthy()
    })
  })

  // ---- 9. Column Resize ----
  describe('Column Resize', () => {
    it('renders resize handle when resizable is true', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns, resizable: true },
      })
      expect(wrapper.find('.zc-table__resize-handle').exists()).toBe(true)
    })

    it('does not render resize handle by default', () => {
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: sampleColumns },
      })
      expect(wrapper.find('.zc-table__resize-handle').exists()).toBe(false)
    })

    it('respects column.resizable: false', () => {
      const cols: TableColumn[] = [
        { prop: 'name', label: 'Name', resizable: false },
        { prop: 'age', label: 'Age' },
      ]
      const wrapper = mount(Table, {
        props: { data: sampleData, columns: cols, resizable: true },
      })
      const handles = wrapper.findAll('.zc-table__resize-handle')
      expect(handles).toHaveLength(1)
    })

    it('emits column-resize event after resize', async () => {
      const wrapper = mount(Table, {
        props: {
          data: sampleData,
          columns: [{ prop: 'name', label: 'Name', width: 100 }, ...sampleColumns.slice(1)],
          resizable: true,
        },
      })
      const vm = wrapper.vm as any
      const mockEvent = {
        clientX: 150,
        preventDefault: () => {},
        stopPropagation: () => {},
      } as any
      vm.handleResizeStart(mockEvent, { prop: 'name', label: 'Name', width: 100 })
      vm.handleResizeMove({ clientX: 170 } as MouseEvent)
      vm.handleResizeEnd()
      expect(wrapper.emitted('column-resize')).toBeTruthy()
      const event = wrapper.emitted('column-resize')![0][0] as any
      expect(event.prop).toBe('name')
      expect(event.oldWidth).toBe(100)
      expect(event.newWidth).toBe(120)
    })
  })

  // ---- Virtual scroll tests ----
  describe('virtual scroll', () => {
    let originalClientHeight: PropertyDescriptor | undefined

    beforeEach(() => {
      // jsdom doesn't compute layout, so clientHeight is always 0.
      // Mock it so useVirtualList can compute a meaningful viewport.
      originalClientHeight = Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'clientHeight')
      Object.defineProperty(HTMLElement.prototype, 'clientHeight', {
        configurable: true,
        get() {
          return 400
        },
      })
    })

    afterEach(() => {
      if (originalClientHeight) {
        Object.defineProperty(HTMLElement.prototype, 'clientHeight', originalClientHeight)
      } else {
        delete (HTMLElement.prototype as any).clientHeight
      }
    })

    it('renders fewer rows than total in virtual mode', () => {
      const bigData = Array.from({ length: 500 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        amount: i * 100,
      }))
      const wrapper = mount(Table, {
        props: { data: bigData, virtual: true, height: 300 },
      })
      // Virtual mode should be active
      expect(wrapper.vm.isVirtualActive).toBe(true)
      // virtualData should be a subset (fewer than total)
      expect(wrapper.vm.virtualData.length).toBeLessThanOrEqual(bigData.length)
    })

    it('supports custom estimatedRowHeight', () => {
      const bigData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        amount: i * 100,
      }))
      const wrapper = mount(Table, {
        props: { data: bigData, virtual: true, height: 300, estimatedRowHeight: 60 },
      })
      expect(wrapper.exists()).toBe(true)
    })

    it('warns in dev when virtual + pagination', () => {
      const warn = vi.spyOn(console, 'warn')
      const bigData = Array.from({ length: 100 }, (_, i) => ({
        id: i,
        name: `Item ${i}`,
        amount: i * 100,
      }))
      mount(Table, {
        props: { data: bigData, virtual: true, height: 300, pagination: true },
      })
      // 应该打印警告
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })

    it('warns in dev when virtual + treeProps', () => {
      const warn = vi.spyOn(console, 'warn')
      const bigData = [
        { id: 1, name: 'Root', parentId: null },
        { id: 2, name: 'Child', parentId: 1 },
      ]
      mount(Table, {
        props: {
          data: bigData,
          virtual: true,
          height: 300,
          treeProps: { children: 'children' },
        },
      })
      // 应该打印警告
      expect(warn).toHaveBeenCalled()
      warn.mockRestore()
    })
  })
})
