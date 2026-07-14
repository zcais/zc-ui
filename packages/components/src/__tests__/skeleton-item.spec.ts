import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import SkeletonItem from '../skeleton/skeleton-item.vue'

/**
 * Helper: find the first .zc-skeleton-item element from wrapper.
 * Handles multi-root fragment components where wrapper.classes() is unreliable.
 */
function findItem(wrapper: ReturnType<typeof mount>) {
  return wrapper.find('.zc-skeleton-item')
}

describe('ZcSkeletonItem', () => {
  // ---- Basic rendering ----
  it('renders correctly with default props', () => {
    const wrapper = mount(SkeletonItem)
    const item = findItem(wrapper)
    expect(item.classes()).toContain('zc-skeleton-item')
    expect(item.classes()).toContain('zc-skeleton-item--text')
    expect(item.classes()).toContain('zc-skeleton-item--anim-wave')
  })

  it('renders role and aria attributes', () => {
    const wrapper = mount(SkeletonItem)
    const item = findItem(wrapper)
    expect(item.attributes('role')).toBe('status')
    expect(item.attributes('aria-busy')).toBe('true')
    expect(item.attributes('aria-live')).toBe('polite')
  })

  // ---- Variant ----
  it('applies text variant by default', () => {
    const wrapper = mount(SkeletonItem)
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--text')
  })

  it('applies circle variant', () => {
    const wrapper = mount(SkeletonItem, { props: { variant: 'circle' } })
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--circle')
  })

  it('applies rect variant', () => {
    const wrapper = mount(SkeletonItem, { props: { variant: 'rect' } })
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--rect')
  })

  it('applies image variant', () => {
    const wrapper = mount(SkeletonItem, { props: { variant: 'image' } })
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--image')
  })

  it('applies button variant', () => {
    const wrapper = mount(SkeletonItem, { props: { variant: 'button' } })
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--button')
  })

  // ---- Width / Height ----
  it('applies numeric width as px', () => {
    const wrapper = mount(SkeletonItem, { props: { width: 200 } })
    expect(findItem(wrapper).attributes('style')).toContain('width: 200px')
  })

  it('applies string width as-is', () => {
    const wrapper = mount(SkeletonItem, { props: { width: '50%' } })
    expect(findItem(wrapper).attributes('style')).toContain('width: 50%')
  })

  it('applies numeric height as px', () => {
    const wrapper = mount(SkeletonItem, { props: { height: 48 } })
    expect(findItem(wrapper).attributes('style')).toContain('height: 48px')
  })

  it('applies string height as-is', () => {
    const wrapper = mount(SkeletonItem, { props: { height: '3rem' } })
    expect(findItem(wrapper).attributes('style')).toContain('height: 3rem')
  })

  it('applies both width and height', () => {
    const wrapper = mount(SkeletonItem, {
      props: { width: 120, height: 80 },
    })
    const style = findItem(wrapper).attributes('style') || ''
    expect(style).toContain('width: 120px')
    expect(style).toContain('height: 80px')
  })

  // ---- Animation ----
  it('uses wave animation by default', () => {
    const wrapper = mount(SkeletonItem)
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--anim-wave')
  })

  it('applies shimmer animation', () => {
    const wrapper = mount(SkeletonItem, { props: { animation: 'shimmer' } })
    expect(findItem(wrapper).classes()).toContain('zc-skeleton-item--anim-shimmer')
  })

  it('does not apply animation class when animation is none', () => {
    const wrapper = mount(SkeletonItem, { props: { animation: 'none' } })
    const classes = findItem(wrapper).classes()
    expect(classes).not.toContain('zc-skeleton-item--anim-wave')
    expect(classes).not.toContain('zc-skeleton-item--anim-shimmer')
  })

  // ---- Count ----
  it('renders one item by default', () => {
    const wrapper = mount(SkeletonItem)
    expect(wrapper.findAll('.zc-skeleton-item').length).toBe(1)
  })

  it('renders multiple items via count', () => {
    const wrapper = mount(SkeletonItem, { props: { count: 5 } })
    expect(wrapper.find('.zc-skeleton-item__group').exists()).toBe(true)
    const items = wrapper.findAll('.zc-skeleton-item__group .zc-skeleton-item')
    expect(items.length).toBe(5)
  })

  it('renders at least 1 item when count is 0 or negative', () => {
    const wrapper = mount(SkeletonItem, { props: { count: 0 } })
    expect(wrapper.findAll('.zc-skeleton-item').length).toBe(1)
  })

  // ---- Rows (text variant only) ----
  it('renders paragraph wrapper when rows > 0', () => {
    const wrapper = mount(SkeletonItem, { props: { rows: 4 } })
    expect(wrapper.find('.zc-skeleton-item__paragraph').exists()).toBe(true)
  })

  it('renders the correct number of rows', () => {
    const wrapper = mount(SkeletonItem, { props: { rows: 3 } })
    const lines = wrapper.findAll('.zc-skeleton-item__paragraph .zc-skeleton-item')
    expect(lines.length).toBe(3)
  })

  it('makes the last row narrower (60%)', () => {
    const wrapper = mount(SkeletonItem, { props: { rows: 3 } })
    const lines = wrapper.findAll('.zc-skeleton-item__paragraph .zc-skeleton-item')
    const lastStyle = lines[2].attributes('style') || ''
    expect(lastStyle).toContain('width: 60%')
  })

  it('non-last rows use 100% width when no width specified', () => {
    const wrapper = mount(SkeletonItem, { props: { rows: 3 } })
    const lines = wrapper.findAll('.zc-skeleton-item__paragraph .zc-skeleton-item')
    const firstStyle = lines[0].attributes('style') || ''
    expect(firstStyle).toContain('width: 100%')
  })

  it('non-last rows respect custom width', () => {
    const wrapper = mount(SkeletonItem, {
      props: { rows: 3, width: '80%' },
    })
    const lines = wrapper.findAll('.zc-skeleton-item__paragraph .zc-skeleton-item')
    const firstStyle = lines[0].attributes('style') || ''
    expect(firstStyle).toContain('width: 80%')
  })

  it('rows has no effect on non-text variants', () => {
    const wrapper = mount(SkeletonItem, {
      props: { variant: 'rect', rows: 4 },
    })
    expect(wrapper.find('.zc-skeleton-item__paragraph').exists()).toBe(false)
  })

  // ---- Rounded ----
  it('applies rounded=true with default radius', () => {
    const wrapper = mount(SkeletonItem, { props: { rounded: true } })
    expect(findItem(wrapper).attributes('style') || '').toContain('border-radius')
  })

  it('applies numeric rounded as px', () => {
    const wrapper = mount(SkeletonItem, { props: { rounded: 12 } })
    expect(findItem(wrapper).attributes('style') || '').toContain('border-radius: 12px')
  })

  it('applies string rounded as-is', () => {
    const wrapper = mount(SkeletonItem, { props: { rounded: '1rem' } })
    expect(findItem(wrapper).attributes('style') || '').toContain('border-radius: 1rem')
  })

  it('applies rounded=false as 0', () => {
    const wrapper = mount(SkeletonItem, { props: { rounded: false } })
    expect(findItem(wrapper).attributes('style') || '').toContain('border-radius: 0')
  })

  it('does not set border-radius when rounded is not provided', () => {
    const wrapper = mount(SkeletonItem)
    const style = findItem(wrapper).attributes('style') || ''
    expect(style).not.toContain('border-radius')
  })

  // ---- Combined props ----
  it('supports multiple combined props', () => {
    const wrapper = mount(SkeletonItem, {
      props: {
        variant: 'rect',
        width: '100%',
        height: 200,
        animation: 'shimmer',
        rounded: true,
      },
    })
    const item = findItem(wrapper)
    expect(item.classes()).toContain('zc-skeleton-item--rect')
    expect(item.classes()).toContain('zc-skeleton-item--anim-shimmer')
    const style = item.attributes('style') || ''
    expect(style).toContain('width: 100%')
    expect(style).toContain('height: 200px')
    expect(style).toContain('border-radius')
  })
})
