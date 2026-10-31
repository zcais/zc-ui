import { describe, it, expect, vi, afterEach } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import { defineComponent, nextTick } from 'vue'
import Masonry from '../masonry/masonry.vue'

describe('ZcMasonry', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('renders container with base class and css-columns mode by default', () => {
    const wrapper = mount(Masonry, {
      slots: { default: '<div class="card">A</div><div class="card">B</div>' },
    })
    expect(wrapper.classes()).toContain('zc-masonry')
    expect(wrapper.classes()).toContain('is-css-columns')
    expect(wrapper.classes()).not.toContain('is-js-balanced')
  })

  it('wraps each slot child in a masonry item element', () => {
    const wrapper = mount(Masonry, {
      slots: {
        default: '<div class="card">A</div><div class="card">B</div><div class="card">C</div>',
      },
    })
    const items = wrapper.findAll('.zc-masonry__item')
    expect(items).toHaveLength(3)
    expect(items[0].text()).toBe('A')
    expect(items[0].attributes('data-masonry-item')).toBeDefined()
    expect(items[0].attributes('data-masonry-index')).toBe('0')
  })

  it('flattens v-for fragments from the default slot', () => {
    const Host = defineComponent({
      components: { ZcMasonry: Masonry },
      template: `
        <ZcMasonry>
          <div v-for="i in 5" :key="i" class="card">{{ i }}</div>
        </ZcMasonry>
      `,
    })
    const wrapper = mount(Host)
    const items = wrapper.findAll('.zc-masonry__item')
    expect(items).toHaveLength(5)
    expect(items[4].text()).toBe('5')
  })

  it('applies column-count style from columns prop', () => {
    const wrapper = mount(Masonry, {
      props: { columns: 4 },
      slots: { default: '<div class="card">A</div>' },
    })
    const style = wrapper.attributes('style')
    expect(style).toContain('column-count: 4')
  })

  it('applies gap as number and as CSS string', () => {
    const numeric = mount(Masonry, {
      props: { gap: 24 },
      slots: { default: '<div class="card">A</div>' },
    })
    expect(numeric.attributes('style')).toContain('--zc-masonry-gap: 24px')
    expect(numeric.attributes('style')).toContain('column-gap: 24px')

    const stringGap = mount(Masonry, {
      props: { gap: '1rem' },
      slots: { default: '<div class="card">A</div>' },
    })
    expect(stringGap.attributes('style')).toContain('--zc-masonry-gap: 1rem')
  })

  it('renders as custom tag via as prop', () => {
    const wrapper = mount(Masonry, {
      props: { as: 'ul' },
      slots: { default: '<li class="card">A</li>' },
    })
    expect(wrapper.element.tagName).toBe('UL')
  })

  it('responds to items changes in the default slot', async () => {
    const Host = defineComponent({
      components: { ZcMasonry: Masonry },
      props: { count: { type: Number, required: true } },
      template: `
        <ZcMasonry>
          <div v-for="i in count" :key="i" class="card">{{ i }}</div>
        </ZcMasonry>
      `,
    })
    const wrapper = mount(Host, { props: { count: 3 } })
    expect(wrapper.findAll('.zc-masonry__item')).toHaveLength(3)
    await wrapper.setProps({ count: 7 })
    await nextTick()
    expect(wrapper.findAll('.zc-masonry__item')).toHaveLength(7)
    await wrapper.setProps({ count: 1 })
    await nextTick()
    expect(wrapper.findAll('.zc-masonry__item')).toHaveLength(1)
  })

  it('emits item-click with the vnode and index when an item is clicked', async () => {
    const wrapper = mount(Masonry, {
      slots: { default: '<div class="card">A</div><div class="card">B</div>' },
    })
    const items = wrapper.findAll('.zc-masonry__item')
    await items[1].trigger('click')
    expect(wrapper.emitted('item-click')).toBeTruthy()
    expect(wrapper.emitted('item-click')!.length).toBe(1)
    expect(wrapper.emitted('item-click')![0][1]).toBe(1)
  })

  it('uses JS balanced mode with column wrappers when useColumns is false', async () => {
    const wrapper = mount(Masonry, {
      props: { useColumns: false, columns: 2 },
      slots: {
        default:
          '<div class="card">1</div><div class="card">2</div><div class="card">3</div><div class="card">4</div><div class="card">5</div>',
      },
    })
    await flushPromises()
    expect(wrapper.classes()).toContain('is-js-balanced')
    const columns = wrapper.findAll('.zc-masonry__column')
    expect(columns).toHaveLength(2)
    // 5 items round-robin / greedy balanced into 2 columns: 3 + 2
    const firstColumnItems = columns[0].findAll('.zc-masonry__item')
    const secondColumnItems = columns[1].findAll('.zc-masonry__item')
    expect(firstColumnItems.length + secondColumnItems.length).toBe(5)
    expect(firstColumnItems.length).toBe(3)
    expect(secondColumnItems.length).toBe(2)
  })

  it('redistributes items when columns change in JS balanced mode', async () => {
    const wrapper = mount(Masonry, {
      props: { useColumns: false, columns: 3 },
      slots: {
        default: '<div class="card">1</div><div class="card">2</div><div class="card">3</div>',
      },
    })
    await flushPromises()
    expect(wrapper.findAll('.zc-masonry__column')).toHaveLength(3)
    await wrapper.setProps({ columns: 2 })
    await flushPromises()
    expect(wrapper.findAll('.zc-masonry__column')).toHaveLength(2)
  })

  it('keeps default columns when container width is 0 (breakpoints inactive)', () => {
    // The global ResizeObserver mock never reports a size, so width stays 0
    const wrapper = mount(Masonry, {
      props: { columns: 3, breakpoints: { 768: 2, 1200: 4 } },
      slots: { default: '<div class="card">A</div>' },
    })
    expect(wrapper.attributes('style')).toContain('column-count: 3')
  })

  it('applies responsive breakpoints based on container width', async () => {
    class FakeResizeObserver {
      cb: ResizeObserverCallback
      constructor(cb: ResizeObserverCallback) {
        this.cb = cb
      }
      observe(target: Element): void {
        this.cb(
          [
            {
              target,
              contentRect: { width: 800, height: 0 } as DOMRectReadOnly,
            } as ResizeObserverEntry,
          ],
          this as unknown as ResizeObserver
        )
      }
      unobserve(): void {}
      disconnect(): void {}
    }
    vi.stubGlobal('ResizeObserver', FakeResizeObserver)

    const wrapper = mount(Masonry, {
      props: { columns: 3, breakpoints: { 1200: 4, 768: 2 } },
      slots: { default: '<div class="card">A</div>' },
    })
    // width 800 >= 768 → 2 columns
    await nextTick()
    expect(wrapper.attributes('style')).toContain('column-count: 2')

    // width 800 is below the smallest breakpoint (900) → 1 column
    await wrapper.setProps({ breakpoints: { 900: 5 } })
    await nextTick()
    expect(wrapper.attributes('style')).toContain('column-count: 1')
  })

  it('exposes relayout method for manual re-layout in JS mode', async () => {
    const wrapper = mount(Masonry, {
      props: { useColumns: false, columns: 2 },
      slots: { default: '<div class="card">A</div><div class="card">B</div>' },
    })
    await flushPromises()
    const vm = wrapper.vm as unknown as { relayout: () => void }
    expect(typeof vm.relayout).toBe('function')
    expect(() => vm.relayout()).not.toThrow()
    await flushPromises()
    expect(wrapper.findAll('.zc-masonry__item')).toHaveLength(2)
  })
})
