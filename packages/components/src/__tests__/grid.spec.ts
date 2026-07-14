import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import Grid from '../grid/grid.vue'
import GridItem from '../grid/grid-item.vue'

describe('ZcGrid', () => {
  it('renders with default props', () => {
    const wrapper = mount(Grid)
    expect(wrapper.classes()).toContain('zc-grid')
  })

  it('renders default tag as div', () => {
    const wrapper = mount(Grid)
    expect(wrapper.element.tagName).toBe('DIV')
  })

  it('renders custom tag', () => {
    const wrapper = mount(Grid, { props: { tag: 'section' } })
    expect(wrapper.element.tagName).toBe('SECTION')
  })

  it('applies default 12 columns', () => {
    const wrapper = mount(Grid)
    expect(wrapper.attributes('style')).toContain('grid-template-columns: repeat(12, 1fr)')
  })

  it('applies custom number of columns', () => {
    const wrapper = mount(Grid, { props: { columns: 4 } })
    expect(wrapper.attributes('style')).toContain('grid-template-columns: repeat(4, 1fr)')
  })

  it('applies custom string columns', () => {
    const wrapper = mount(Grid, {
      props: { columns: '100px 1fr 2fr' },
    })
    expect(wrapper.attributes('style')).toContain('grid-template-columns: 100px 1fr 2fr')
  })

  it('applies custom rows', () => {
    const wrapper = mount(Grid, { props: { rows: 3 } })
    expect(wrapper.attributes('style')).toContain('grid-template-rows: repeat(3, 1fr)')
  })

  it('applies custom string rows', () => {
    const wrapper = mount(Grid, { props: { rows: 'auto 1fr auto' } })
    expect(wrapper.attributes('style')).toContain('grid-template-rows: auto 1fr auto')
  })

  it('does not set rows when 0', () => {
    const wrapper = mount(Grid, { props: { rows: 0 } })
    const style = wrapper.attributes('style') || ''
    expect(style).not.toContain('grid-template-rows')
  })

  it('applies numeric gap', () => {
    const wrapper = mount(Grid, { props: { gap: 16 } })
    expect(wrapper.attributes('style')).toContain('gap: 16px')
  })

  it('applies tuple gap [row, col]', () => {
    const wrapper = mount(Grid, { props: { gap: [10, 20] } })
    expect(wrapper.attributes('style')).toContain('row-gap: 10px')
    expect(wrapper.attributes('style')).toContain('column-gap: 20px')
  })

  it('does not set gap when 0', () => {
    const wrapper = mount(Grid, { props: { gap: 0 } })
    const style = wrapper.attributes('style') || ''
    expect(style).not.toContain('gap:')
  })

  it('applies minColumnWidth for auto-fill', () => {
    const wrapper = mount(Grid, {
      props: { minColumnWidth: '120px' },
    })
    expect(wrapper.attributes('style')).toContain(
      'grid-template-columns: repeat(auto-fill, minmax(120px, 1fr))'
    )
  })

  it('minColumnWidth overrides columns prop', () => {
    const wrapper = mount(Grid, {
      props: { columns: 4, minColumnWidth: '100px' },
    })
    expect(wrapper.attributes('style')).toContain('minmax(100px, 1fr)')
    expect(wrapper.attributes('style')).not.toContain('repeat(4, 1fr)')
  })

  it('applies justify-items', () => {
    const wrapper = mount(Grid, { props: { justifyItems: 'center' } })
    expect(wrapper.attributes('style')).toContain('justify-items: center')
  })

  it('applies align-items', () => {
    const wrapper = mount(Grid, { props: { alignItems: 'baseline' } })
    expect(wrapper.attributes('style')).toContain('align-items: baseline')
  })

  it('applies justify-content', () => {
    const wrapper = mount(Grid, { props: { justifyContent: 'space-between' } })
    expect(wrapper.attributes('style')).toContain('justify-content: space-between')
  })

  it('applies align-content', () => {
    const wrapper = mount(Grid, { props: { alignContent: 'center' } })
    expect(wrapper.attributes('style')).toContain('align-content: center')
  })

  it('applies auto-flow', () => {
    const wrapper = mount(Grid, { props: { autoFlow: 'column' } })
    expect(wrapper.attributes('style')).toContain('grid-auto-flow: column')
  })

  it('applies auto-flow dense', () => {
    const wrapper = mount(Grid, { props: { autoFlow: 'row dense' } })
    expect(wrapper.attributes('style')).toContain('grid-auto-flow: row dense')
  })

  it('renders slot content', () => {
    const wrapper = mount(Grid, {
      slots: { default: '<div class="cell">content</div>' },
    })
    expect(wrapper.find('.cell').exists()).toBe(true)
  })
})

describe('ZcGridItem', () => {
  it('renders with default props', () => {
    const wrapper = mount(GridItem)
    expect(wrapper.classes()).toContain('zc-grid-item')
  })

  it('renders custom tag', () => {
    const wrapper = mount(GridItem, { props: { tag: 'article' } })
    expect(wrapper.element.tagName).toBe('ARTICLE')
  })

  it('applies colSpan', () => {
    const wrapper = mount(GridItem, { props: { colSpan: 3 } })
    expect(wrapper.attributes('style')).toContain('grid-column: span 3')
  })

  it('applies rowSpan', () => {
    const wrapper = mount(GridItem, { props: { rowSpan: 2 } })
    expect(wrapper.attributes('style')).toContain('grid-row: span 2')
  })

  it('applies columnStart and columnEnd', () => {
    const wrapper = mount(GridItem, {
      props: { columnStart: 1, columnEnd: 3 },
    })
    expect(wrapper.attributes('style')).toContain('grid-column-start: 1')
    expect(wrapper.attributes('style')).toContain('grid-column-end: 3')
  })

  it('applies rowStart and rowEnd', () => {
    const wrapper = mount(GridItem, {
      props: { rowStart: 2, rowEnd: 4 },
    })
    expect(wrapper.attributes('style')).toContain('grid-row-start: 2')
    expect(wrapper.attributes('style')).toContain('grid-row-end: 4')
  })

  it('applies grid-area', () => {
    const wrapper = mount(GridItem, {
      props: { area: 'header' },
    })
    expect(wrapper.attributes('style')).toContain('grid-area: header')
  })

  it('renders slot content', () => {
    const wrapper = mount(GridItem, {
      slots: { default: '<p>Grid item</p>' },
    })
    expect(wrapper.text()).toContain('Grid item')
  })

  it('colSpan overrides columnStart/End', () => {
    const wrapper = mount(GridItem, {
      props: { colSpan: 2, columnStart: 1, columnEnd: 3 },
    })
    expect(wrapper.attributes('style')).toContain('grid-column: span 2')
  })

  it('rowSpan overrides rowStart/End', () => {
    const wrapper = mount(GridItem, {
      props: { rowSpan: 3, rowStart: 1, rowEnd: 4 },
    })
    expect(wrapper.attributes('style')).toContain('grid-row: span 3')
  })
})

describe('ZcGrid + ZcGridItem integration', () => {
  it('renders a grid with items', () => {
    const wrapper = mount({
      components: { Grid, GridItem },
      template: `
        <Grid :columns="3" :gap="16">
          <GridItem :colSpan="2">Item 1</GridItem>
          <GridItem>Item 2</GridItem>
          <GridItem :colSpan="3">Item 3</GridItem>
        </Grid>
      `,
    })

    expect(wrapper.find('.zc-grid').exists()).toBe(true)
    expect(wrapper.findAll('.zc-grid-item')).toHaveLength(3)
    const items = wrapper.findAll('.zc-grid-item')
    expect(items[0].attributes('style')).toContain('grid-column: span 2')
    expect(items[2].attributes('style')).toContain('grid-column: span 3')
  })
})
